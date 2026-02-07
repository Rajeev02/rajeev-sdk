use chrono::Utc;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use uuid::Uuid;

/// Request priority levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum Priority {
    /// Send only on good connections, can be dropped (analytics, telemetry)
    Low = 0,
    /// Normal priority, queued if offline
    Normal = 1,
    /// Send as soon as possible, retry aggressively
    High = 2,
    /// Must succeed — payments, auth tokens. Retry indefinitely.
    Critical = 3,
}

impl Priority {
    pub fn from_i32(val: i32) -> Self {
        match val {
            0 => Priority::Low,
            1 => Priority::Normal,
            2 => Priority::High,
            3 => Priority::Critical,
            _ => Priority::Normal,
        }
    }

    /// Maximum retry attempts for this priority
    pub fn max_retries(&self) -> u32 {
        match self {
            Priority::Low => 1,
            Priority::Normal => 3,
            Priority::High => 5,
            Priority::Critical => u32::MAX, // Retry indefinitely
        }
    }

    /// Minimum network quality score (0-100) required to send
    pub fn min_quality_score(&self) -> u8 {
        match self {
            Priority::Low => 50,      // Only send on decent connections
            Priority::Normal => 20,   // Send on anything above 2G
            Priority::High => 10,     // Send on even slow connections
            Priority::Critical => 1,  // Send on anything that's online
        }
    }
}

/// HTTP method
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HttpMethod {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
}

impl HttpMethod {
    pub fn as_str(&self) -> &'static str {
        match self {
            HttpMethod::GET => "GET",
            HttpMethod::POST => "POST",
            HttpMethod::PUT => "PUT",
            HttpMethod::PATCH => "PATCH",
            HttpMethod::DELETE => "DELETE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_uppercase().as_str() {
            "GET" => HttpMethod::GET,
            "POST" => HttpMethod::POST,
            "PUT" => HttpMethod::PUT,
            "PATCH" => HttpMethod::PATCH,
            "DELETE" => HttpMethod::DELETE,
            _ => HttpMethod::GET,
        }
    }
}

/// A queued network request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueuedRequest {
    /// Unique request ID
    pub id: String,
    /// HTTP method
    pub method: String,
    /// Full URL
    pub url: String,
    /// Request headers as JSON string
    pub headers_json: String,
    /// Request body (if any)
    pub body: Option<String>,
    /// Priority level
    pub priority: i32,
    /// Number of retry attempts so far
    pub retry_count: u32,
    /// Maximum retries allowed
    pub max_retries: u32,
    /// When the request was created
    pub created_at: String,
    /// When to next attempt (for backoff)
    pub next_attempt_at: String,
    /// Whether to compress the request body
    pub compress: bool,
    /// Optional tag for grouping/cancellation
    pub tag: Option<String>,
}

/// Result of processing a queued request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueueProcessResult {
    /// Request ID
    pub request_id: String,
    /// Whether the request should be sent now
    pub should_send: bool,
    /// Request details (if should_send is true)
    pub request: Option<QueuedRequest>,
}

#[derive(Debug, thiserror::Error)]
pub enum QueueError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Request not found: {0}")]
    NotFound(String),
    #[error("Queue is empty")]
    Empty,
    #[error("Serialization error: {0}")]
    SerializationError(String),
}

impl From<rusqlite::Error> for QueueError {
    fn from(e: rusqlite::Error) -> Self {
        QueueError::DatabaseError(e.to_string())
    }
}

/// Persistent request queue backed by SQLite
pub struct RequestQueue {
    conn: Mutex<Connection>,
}

impl RequestQueue {
    /// Create a new request queue
    pub fn new(db_path: &str) -> Result<Self, QueueError> {
        let conn = if db_path == ":memory:" {
            Connection::open_in_memory()?
        } else {
            Connection::open(db_path)?
        };

        let queue = RequestQueue {
            conn: Mutex::new(conn),
        };
        queue.initialize_db()?;
        Ok(queue)
    }

    fn initialize_db(&self) -> Result<(), QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS request_queue (
                id TEXT PRIMARY KEY,
                method TEXT NOT NULL,
                url TEXT NOT NULL,
                headers_json TEXT NOT NULL DEFAULT '{}',
                body TEXT,
                priority INTEGER NOT NULL DEFAULT 1,
                retry_count INTEGER NOT NULL DEFAULT 0,
                max_retries INTEGER NOT NULL DEFAULT 3,
                created_at TEXT NOT NULL,
                next_attempt_at TEXT NOT NULL,
                compress INTEGER NOT NULL DEFAULT 0,
                tag TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_queue_priority ON request_queue(priority DESC, created_at ASC);
            CREATE INDEX IF NOT EXISTS idx_queue_next_attempt ON request_queue(next_attempt_at);
            CREATE INDEX IF NOT EXISTS idx_queue_tag ON request_queue(tag);
            ",
        )?;
        Ok(())
    }

    /// Add a request to the queue
    pub fn enqueue(
        &self,
        method: &str,
        url: &str,
        headers_json: &str,
        body: Option<&str>,
        priority: Priority,
        compress: bool,
        tag: Option<&str>,
    ) -> Result<String, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let id = Uuid::new_v4().to_string();
        let now = Utc::now().to_rfc3339();

        conn.execute(
            "INSERT INTO request_queue 
             (id, method, url, headers_json, body, priority, retry_count, max_retries, created_at, next_attempt_at, compress, tag)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7, ?8, ?8, ?9, ?10)",
            params![
                id,
                method,
                url,
                headers_json,
                body,
                priority as i32,
                priority.max_retries(),
                now,
                compress as i32,
                tag,
            ],
        )?;

        Ok(id)
    }

    /// Get the next request that should be sent, based on priority and timing
    pub fn dequeue(&self, current_quality_score: u8) -> Result<Option<QueuedRequest>, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let now = Utc::now().to_rfc3339();

        // Get highest priority request whose next_attempt_at has passed
        // and whose priority allows sending at current quality
        let result = conn.query_row(
            "SELECT id, method, url, headers_json, body, priority, retry_count, max_retries, 
                    created_at, next_attempt_at, compress, tag
             FROM request_queue 
             WHERE next_attempt_at <= ?1
             ORDER BY priority DESC, created_at ASC 
             LIMIT 1",
            params![now],
            |row| {
                Ok(QueuedRequest {
                    id: row.get(0)?,
                    method: row.get(1)?,
                    url: row.get(2)?,
                    headers_json: row.get(3)?,
                    body: row.get(4)?,
                    priority: row.get(5)?,
                    retry_count: row.get::<_, u32>(6)?,
                    max_retries: row.get::<_, u32>(7)?,
                    created_at: row.get(8)?,
                    next_attempt_at: row.get(9)?,
                    compress: row.get::<_, i32>(10)? != 0,
                    tag: row.get(11)?,
                })
            },
        );

        match result {
            Ok(req) => {
                let priority = Priority::from_i32(req.priority);
                if current_quality_score >= priority.min_quality_score() {
                    Ok(Some(req))
                } else {
                    Ok(None) // Network not good enough for this priority
                }
            }
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(QueueError::DatabaseError(e.to_string())),
        }
    }

    /// Mark a request as successfully completed (remove from queue)
    pub fn complete(&self, request_id: &str) -> Result<bool, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let rows = conn.execute(
            "DELETE FROM request_queue WHERE id = ?1",
            params![request_id],
        )?;
        Ok(rows > 0)
    }

    /// Mark a request as failed — increment retry count and set backoff
    pub fn fail(&self, request_id: &str) -> Result<bool, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;

        // Get current state
        let (retry_count, max_retries): (u32, u32) = conn.query_row(
            "SELECT retry_count, max_retries FROM request_queue WHERE id = ?1",
            params![request_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        ).map_err(|_| QueueError::NotFound(request_id.to_string()))?;

        let new_retry_count = retry_count + 1;

        if new_retry_count >= max_retries {
            // Max retries exceeded — remove from queue
            conn.execute(
                "DELETE FROM request_queue WHERE id = ?1",
                params![request_id],
            )?;
            return Ok(false); // Request dropped
        }

        // Exponential backoff with jitter: base * 2^retry + random(0..base)
        let base_seconds: u64 = 2;
        let backoff_seconds = base_seconds * 2u64.pow(new_retry_count);
        let backoff_seconds = backoff_seconds.min(300); // Cap at 5 minutes

        let next_attempt = Utc::now() + chrono::Duration::seconds(backoff_seconds as i64);

        conn.execute(
            "UPDATE request_queue SET retry_count = ?1, next_attempt_at = ?2 WHERE id = ?3",
            params![new_retry_count, next_attempt.to_rfc3339(), request_id],
        )?;

        Ok(true) // Request will be retried
    }

    /// Get queue size
    pub fn size(&self) -> Result<u64, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let count: u64 = conn.query_row(
            "SELECT COUNT(*) FROM request_queue",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;
        Ok(count)
    }

    /// Get queue size by priority
    pub fn size_by_priority(&self, priority: Priority) -> Result<u64, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let count: u64 = conn.query_row(
            "SELECT COUNT(*) FROM request_queue WHERE priority = ?1",
            params![priority as i32],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;
        Ok(count)
    }

    /// Cancel all requests with a specific tag
    pub fn cancel_by_tag(&self, tag: &str) -> Result<u64, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let rows = conn.execute(
            "DELETE FROM request_queue WHERE tag = ?1",
            params![tag],
        )?;
        Ok(rows as u64)
    }

    /// Cancel a specific request
    pub fn cancel(&self, request_id: &str) -> Result<bool, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let rows = conn.execute(
            "DELETE FROM request_queue WHERE id = ?1",
            params![request_id],
        )?;
        Ok(rows > 0)
    }

    /// Clear the entire queue
    pub fn clear(&self) -> Result<(), QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        conn.execute("DELETE FROM request_queue", [])?;
        Ok(())
    }

    /// Get all pending requests (for debugging/display)
    pub fn list_pending(&self, limit: u32) -> Result<Vec<QueuedRequest>, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let mut stmt = conn.prepare(
            "SELECT id, method, url, headers_json, body, priority, retry_count, max_retries,
                    created_at, next_attempt_at, compress, tag
             FROM request_queue 
             ORDER BY priority DESC, created_at ASC
             LIMIT ?1",
        )?;

        let requests = stmt
            .query_map(params![limit], |row| {
                Ok(QueuedRequest {
                    id: row.get(0)?,
                    method: row.get(1)?,
                    url: row.get(2)?,
                    headers_json: row.get(3)?,
                    body: row.get(4)?,
                    priority: row.get(5)?,
                    retry_count: row.get::<_, u32>(6)?,
                    max_retries: row.get::<_, u32>(7)?,
                    created_at: row.get(8)?,
                    next_attempt_at: row.get(9)?,
                    compress: row.get::<_, i32>(10)? != 0,
                    tag: row.get(11)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(requests)
    }

    /// Remove old completed/expired requests
    pub fn cleanup_old(&self, older_than_hours: u32) -> Result<u64, QueueError> {
        let conn = self.conn.lock().map_err(|e| QueueError::DatabaseError(e.to_string()))?;
        let cutoff = Utc::now() - chrono::Duration::hours(older_than_hours as i64);
        let rows = conn.execute(
            "DELETE FROM request_queue WHERE created_at < ?1 AND priority < ?2",
            params![cutoff.to_rfc3339(), Priority::Critical as i32],
        )?;
        Ok(rows as u64)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_queue() -> RequestQueue {
        RequestQueue::new(":memory:").unwrap()
    }

    #[test]
    fn test_enqueue_dequeue() {
        let queue = create_test_queue();

        let id = queue
            .enqueue("GET", "https://api.test.com/users", "{}", None, Priority::Normal, false, None)
            .unwrap();

        assert!(!id.is_empty());
        assert_eq!(queue.size().unwrap(), 1);

        let req = queue.dequeue(50).unwrap().unwrap();
        assert_eq!(req.url, "https://api.test.com/users");
        assert_eq!(req.method, "GET");
    }

    #[test]
    fn test_priority_ordering() {
        let queue = create_test_queue();

        queue.enqueue("GET", "https://low.com", "{}", None, Priority::Low, false, None).unwrap();
        queue.enqueue("POST", "https://critical.com", "{}", Some("{\"amount\":100}"), Priority::Critical, false, None).unwrap();
        queue.enqueue("GET", "https://normal.com", "{}", None, Priority::Normal, false, None).unwrap();

        // Should get Critical first
        let req = queue.dequeue(100).unwrap().unwrap();
        assert_eq!(req.url, "https://critical.com");
    }

    #[test]
    fn test_quality_gating() {
        let queue = create_test_queue();

        queue.enqueue("GET", "https://low.com", "{}", None, Priority::Low, false, None).unwrap();

        // Low priority requires quality >= 50, we only have 20
        let req = queue.dequeue(20).unwrap();
        assert!(req.is_none());

        // With quality 60, should get it
        let req = queue.dequeue(60).unwrap();
        assert!(req.is_some());
    }

    #[test]
    fn test_complete() {
        let queue = create_test_queue();

        let id = queue.enqueue("GET", "https://test.com", "{}", None, Priority::Normal, false, None).unwrap();
        assert_eq!(queue.size().unwrap(), 1);

        queue.complete(&id).unwrap();
        assert_eq!(queue.size().unwrap(), 0);
    }

    #[test]
    fn test_fail_and_retry() {
        let queue = create_test_queue();

        let id = queue.enqueue("GET", "https://test.com", "{}", None, Priority::Normal, false, None).unwrap();

        // Fail it — should still be in queue with backoff
        let will_retry = queue.fail(&id).unwrap();
        assert!(will_retry);
        assert_eq!(queue.size().unwrap(), 1);
    }

    #[test]
    fn test_fail_max_retries_removes() {
        let queue = create_test_queue();

        // Low priority = max 1 retry
        let id = queue.enqueue("GET", "https://test.com", "{}", None, Priority::Low, false, None).unwrap();

        let will_retry = queue.fail(&id).unwrap();
        assert!(!will_retry); // Should be removed after 1 failure
        assert_eq!(queue.size().unwrap(), 0);
    }

    #[test]
    fn test_cancel_by_tag() {
        let queue = create_test_queue();

        queue.enqueue("GET", "https://a.com", "{}", None, Priority::Normal, false, Some("batch-1")).unwrap();
        queue.enqueue("GET", "https://b.com", "{}", None, Priority::Normal, false, Some("batch-1")).unwrap();
        queue.enqueue("GET", "https://c.com", "{}", None, Priority::Normal, false, Some("batch-2")).unwrap();

        let cancelled = queue.cancel_by_tag("batch-1").unwrap();
        assert_eq!(cancelled, 2);
        assert_eq!(queue.size().unwrap(), 1);
    }

    #[test]
    fn test_clear() {
        let queue = create_test_queue();

        queue.enqueue("GET", "https://a.com", "{}", None, Priority::Normal, false, None).unwrap();
        queue.enqueue("GET", "https://b.com", "{}", None, Priority::High, false, None).unwrap();

        queue.clear().unwrap();
        assert_eq!(queue.size().unwrap(), 0);
    }

    #[test]
    fn test_list_pending() {
        let queue = create_test_queue();

        queue.enqueue("GET", "https://a.com", "{}", None, Priority::Low, false, None).unwrap();
        queue.enqueue("POST", "https://b.com", "{}", Some("body"), Priority::High, false, None).unwrap();

        let pending = queue.list_pending(10).unwrap();
        assert_eq!(pending.len(), 2);
        // High priority should be first
        assert_eq!(pending[0].url, "https://b.com");
    }

    #[test]
    fn test_size_by_priority() {
        let queue = create_test_queue();

        queue.enqueue("GET", "https://a.com", "{}", None, Priority::Low, false, None).unwrap();
        queue.enqueue("GET", "https://b.com", "{}", None, Priority::High, false, None).unwrap();
        queue.enqueue("GET", "https://c.com", "{}", None, Priority::High, false, None).unwrap();

        assert_eq!(queue.size_by_priority(Priority::Low).unwrap(), 1);
        assert_eq!(queue.size_by_priority(Priority::High).unwrap(), 2);
        assert_eq!(queue.size_by_priority(Priority::Critical).unwrap(), 0);
    }
}
