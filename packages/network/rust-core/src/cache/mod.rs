use chrono::Utc;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::sync::Mutex;

/// A cached HTTP response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CachedResponse {
    /// Cache key (hash of method + url + relevant headers)
    pub cache_key: String,
    /// HTTP status code
    pub status_code: u16,
    /// Response headers as JSON
    pub headers_json: String,
    /// Response body
    pub body: String,
    /// When this entry was cached
    pub cached_at: String,
    /// When this entry expires
    pub expires_at: String,
    /// ETag for conditional requests
    pub etag: Option<String>,
    /// Last-Modified header for conditional requests
    pub last_modified: Option<String>,
    /// Size of the body in bytes
    pub body_size: u64,
}

/// Cache statistics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheStats {
    pub total_entries: u64,
    pub total_size_bytes: u64,
    pub hit_count: u64,
    pub miss_count: u64,
    pub hit_rate: f64,
}

#[derive(Debug, thiserror::Error)]
pub enum CacheError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Cache miss")]
    CacheMiss,
}

impl From<rusqlite::Error> for CacheError {
    fn from(e: rusqlite::Error) -> Self {
        CacheError::DatabaseError(e.to_string())
    }
}

/// HTTP response cache backed by SQLite
pub struct HttpCache {
    conn: Mutex<Connection>,
    max_size_bytes: u64,
    hit_count: Mutex<u64>,
    miss_count: Mutex<u64>,
}

impl HttpCache {
    pub fn new(db_path: &str, max_size_bytes: u64) -> Result<Self, CacheError> {
        let conn = if db_path == ":memory:" {
            Connection::open_in_memory()?
        } else {
            Connection::open(db_path)?
        };

        let cache = HttpCache {
            conn: Mutex::new(conn),
            max_size_bytes,
            hit_count: Mutex::new(0),
            miss_count: Mutex::new(0),
        };
        cache.initialize_db()?;
        Ok(cache)
    }

    fn initialize_db(&self) -> Result<(), CacheError> {
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS http_cache (
                cache_key TEXT PRIMARY KEY,
                status_code INTEGER NOT NULL,
                headers_json TEXT NOT NULL DEFAULT '{}',
                body TEXT NOT NULL,
                cached_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                etag TEXT,
                last_modified TEXT,
                body_size INTEGER NOT NULL,
                last_accessed_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_cache_expires ON http_cache(expires_at);
            CREATE INDEX IF NOT EXISTS idx_cache_accessed ON http_cache(last_accessed_at);
            CREATE INDEX IF NOT EXISTS idx_cache_size ON http_cache(body_size);
            ",
        )?;
        Ok(())
    }

    /// Generate a cache key from method + URL
    pub fn generate_key(method: &str, url: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(method.as_bytes());
        hasher.update(b":");
        hasher.update(url.as_bytes());
        let hash = hasher.finalize();
        base64::Engine::encode(&base64::engine::general_purpose::URL_SAFE_NO_PAD, hash)
    }

    /// Get a cached response (returns None if expired or not found)
    pub fn get(&self, method: &str, url: &str) -> Result<Option<CachedResponse>, CacheError> {
        let cache_key = Self::generate_key(method, url);
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;
        let now = Utc::now().to_rfc3339();

        let result = conn.query_row(
            "SELECT cache_key, status_code, headers_json, body, cached_at, expires_at, 
                    etag, last_modified, body_size
             FROM http_cache 
             WHERE cache_key = ?1 AND expires_at > ?2",
            params![cache_key, now],
            |row| {
                Ok(CachedResponse {
                    cache_key: row.get(0)?,
                    status_code: row.get(1)?,
                    headers_json: row.get(2)?,
                    body: row.get(3)?,
                    cached_at: row.get(4)?,
                    expires_at: row.get(5)?,
                    etag: row.get(6)?,
                    last_modified: row.get(7)?,
                    body_size: row.get::<_, i64>(8)? as u64,
                })
            },
        );

        match result {
            Ok(entry) => {
                // Update last_accessed_at for LRU
                let _ = conn.execute(
                    "UPDATE http_cache SET last_accessed_at = ?1 WHERE cache_key = ?2",
                    params![now, cache_key],
                );
                if let Ok(mut hits) = self.hit_count.lock() {
                    *hits += 1;
                }
                Ok(Some(entry))
            }
            Err(rusqlite::Error::QueryReturnedNoRows) => {
                if let Ok(mut misses) = self.miss_count.lock() {
                    *misses += 1;
                }
                Ok(None)
            }
            Err(e) => Err(CacheError::DatabaseError(e.to_string())),
        }
    }

    /// Store a response in the cache
    pub fn put(
        &self,
        method: &str,
        url: &str,
        status_code: u16,
        headers_json: &str,
        body: &str,
        ttl_seconds: u64,
        etag: Option<&str>,
        last_modified: Option<&str>,
    ) -> Result<(), CacheError> {
        let cache_key = Self::generate_key(method, url);
        let now = Utc::now();
        let expires_at = now + chrono::Duration::seconds(ttl_seconds as i64);
        let body_size = body.len() as u64;

        // Evict if necessary to make room
        self.evict_if_needed(body_size)?;

        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;
        conn.execute(
            "INSERT OR REPLACE INTO http_cache 
             (cache_key, status_code, headers_json, body, cached_at, expires_at, etag, last_modified, body_size, last_accessed_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?5)",
            params![
                cache_key,
                status_code,
                headers_json,
                body,
                now.to_rfc3339(),
                expires_at.to_rfc3339(),
                etag,
                last_modified,
                body_size as i64,
            ],
        )?;

        Ok(())
    }

    /// Invalidate a specific cache entry
    pub fn invalidate(&self, method: &str, url: &str) -> Result<bool, CacheError> {
        let cache_key = Self::generate_key(method, url);
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;
        let rows = conn.execute(
            "DELETE FROM http_cache WHERE cache_key = ?1",
            params![cache_key],
        )?;
        Ok(rows > 0)
    }

    /// Clear expired entries
    pub fn cleanup_expired(&self) -> Result<u64, CacheError> {
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;
        let now = Utc::now().to_rfc3339();
        let rows = conn.execute(
            "DELETE FROM http_cache WHERE expires_at <= ?1",
            params![now],
        )?;
        Ok(rows as u64)
    }

    /// Evict least-recently-used entries if cache is too large
    fn evict_if_needed(&self, new_entry_size: u64) -> Result<(), CacheError> {
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;

        let total_size: u64 = conn.query_row(
            "SELECT COALESCE(SUM(body_size), 0) FROM http_cache",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        if total_size + new_entry_size <= self.max_size_bytes {
            return Ok(());
        }

        // First, remove expired entries
        let now = Utc::now().to_rfc3339();
        conn.execute(
            "DELETE FROM http_cache WHERE expires_at <= ?1",
            params![now],
        )?;

        // If still over limit, remove LRU entries
        let new_total: u64 = conn.query_row(
            "SELECT COALESCE(SUM(body_size), 0) FROM http_cache",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        if new_total + new_entry_size > self.max_size_bytes {
            // Remove oldest accessed entries until we have space
            conn.execute(
                "DELETE FROM http_cache WHERE cache_key IN (
                    SELECT cache_key FROM http_cache 
                    ORDER BY last_accessed_at ASC 
                    LIMIT 10
                )",
                [],
            )?;
        }

        Ok(())
    }

    /// Clear entire cache
    pub fn clear(&self) -> Result<(), CacheError> {
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;
        conn.execute("DELETE FROM http_cache", [])?;
        Ok(())
    }

    /// Get cache statistics
    pub fn stats(&self) -> Result<CacheStats, CacheError> {
        let conn = self.conn.lock().map_err(|e| CacheError::DatabaseError(e.to_string()))?;

        let total_entries: u64 = conn.query_row(
            "SELECT COUNT(*) FROM http_cache",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        let total_size_bytes: u64 = conn.query_row(
            "SELECT COALESCE(SUM(body_size), 0) FROM http_cache",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        let hits = self.hit_count.lock().map(|g| *g).unwrap_or(0);
        let misses = self.miss_count.lock().map(|g| *g).unwrap_or(0);
        let total_requests = hits + misses;
        let hit_rate = if total_requests > 0 {
            hits as f64 / total_requests as f64
        } else {
            0.0
        };

        Ok(CacheStats {
            total_entries,
            total_size_bytes,
            hit_count: hits,
            miss_count: misses,
            hit_rate,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_cache() -> HttpCache {
        HttpCache::new(":memory:", 10 * 1024 * 1024).unwrap() // 10MB limit
    }

    #[test]
    fn test_put_and_get() {
        let cache = create_test_cache();

        cache.put("GET", "https://api.test.com/users", 200, "{}", "{\"users\":[]}", 300, None, None).unwrap();

        let result = cache.get("GET", "https://api.test.com/users").unwrap();
        assert!(result.is_some());

        let entry = result.unwrap();
        assert_eq!(entry.status_code, 200);
        assert_eq!(entry.body, "{\"users\":[]}");
    }

    #[test]
    fn test_cache_miss() {
        let cache = create_test_cache();
        let result = cache.get("GET", "https://nonexistent.com").unwrap();
        assert!(result.is_none());
    }

    #[test]
    fn test_cache_key_uniqueness() {
        let key1 = HttpCache::generate_key("GET", "https://api.com/users");
        let key2 = HttpCache::generate_key("POST", "https://api.com/users");
        let key3 = HttpCache::generate_key("GET", "https://api.com/posts");

        assert_ne!(key1, key2); // Different method
        assert_ne!(key1, key3); // Different URL
    }

    #[test]
    fn test_invalidate() {
        let cache = create_test_cache();

        cache.put("GET", "https://api.com/data", 200, "{}", "data", 300, None, None).unwrap();
        assert!(cache.get("GET", "https://api.com/data").unwrap().is_some());

        cache.invalidate("GET", "https://api.com/data").unwrap();
        assert!(cache.get("GET", "https://api.com/data").unwrap().is_none());
    }

    #[test]
    fn test_clear() {
        let cache = create_test_cache();

        cache.put("GET", "https://a.com", 200, "{}", "a", 300, None, None).unwrap();
        cache.put("GET", "https://b.com", 200, "{}", "b", 300, None, None).unwrap();

        cache.clear().unwrap();

        let stats = cache.stats().unwrap();
        assert_eq!(stats.total_entries, 0);
    }

    #[test]
    fn test_stats() {
        let cache = create_test_cache();

        cache.put("GET", "https://a.com", 200, "{}", "response-body", 300, None, None).unwrap();

        // Hit
        cache.get("GET", "https://a.com").unwrap();
        // Miss
        cache.get("GET", "https://nonexistent.com").unwrap();

        let stats = cache.stats().unwrap();
        assert_eq!(stats.total_entries, 1);
        assert_eq!(stats.hit_count, 1);
        assert_eq!(stats.miss_count, 1);
        assert!((stats.hit_rate - 0.5).abs() < 0.01);
    }

    #[test]
    fn test_etag_storage() {
        let cache = create_test_cache();

        cache.put(
            "GET", "https://api.com/data", 200, "{}",
            "data", 300,
            Some("\"abc123\""),
            Some("Wed, 01 Jan 2025 00:00:00 GMT"),
        ).unwrap();

        let entry = cache.get("GET", "https://api.com/data").unwrap().unwrap();
        assert_eq!(entry.etag, Some("\"abc123\"".to_string()));
        assert_eq!(entry.last_modified, Some("Wed, 01 Jan 2025 00:00:00 GMT".to_string()));
    }

    #[test]
    fn test_overwrite_existing() {
        let cache = create_test_cache();

        cache.put("GET", "https://api.com/data", 200, "{}", "old-data", 300, None, None).unwrap();
        cache.put("GET", "https://api.com/data", 200, "{}", "new-data", 300, None, None).unwrap();

        let entry = cache.get("GET", "https://api.com/data").unwrap().unwrap();
        assert_eq!(entry.body, "new-data");
    }
}
