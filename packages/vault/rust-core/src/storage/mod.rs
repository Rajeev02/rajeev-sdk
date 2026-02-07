use chrono::{DateTime, Duration, Utc};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

use crate::crypto;

/// Represents a stored entry in the vault
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoredEntry {
    pub key: String,
    pub encrypted_value: String,
    pub namespace: String,
    pub expires_at: Option<String>,
    pub biometric_required: bool,
    pub exportable: bool,
    pub created_at: String,
    pub updated_at: String,
}

/// Storage statistics
#[derive(Debug, Clone)]
pub struct StorageStats {
    pub total_entries: u64,
    pub total_namespaces: u64,
    pub expired_entries: u64,
    pub storage_bytes: u64,
}

#[derive(Debug, thiserror::Error)]
pub enum StorageError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Key not found: {0}")]
    KeyNotFound(String),
    #[error("Key expired: {0}")]
    KeyExpired(String),
    #[error("Biometric authentication required")]
    BiometricRequired,
    #[error("Entry is not exportable")]
    NotExportable,
    #[error("Serialization error: {0}")]
    SerializationError(String),
}

impl From<rusqlite::Error> for StorageError {
    fn from(e: rusqlite::Error) -> Self {
        StorageError::DatabaseError(e.to_string())
    }
}

/// SQLite-backed secure storage engine
pub struct StorageEngine {
    conn: Connection,
    master_key: String,
}

impl StorageEngine {
    /// Create a new storage engine with the given database path and master key
    pub fn new(db_path: &str, master_key: &str) -> Result<Self, StorageError> {
        let conn = if db_path == ":memory:" {
            Connection::open_in_memory()?
        } else {
            Connection::open(db_path)?
        };

        let engine = StorageEngine {
            conn,
            master_key: master_key.to_string(),
        };
        engine.initialize_db()?;
        Ok(engine)
    }

    /// Initialize database schema
    fn initialize_db(&self) -> Result<(), StorageError> {
        self.conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS vault_entries (
                key TEXT NOT NULL,
                namespace TEXT NOT NULL DEFAULT 'default',
                encrypted_value TEXT NOT NULL,
                expires_at TEXT,
                biometric_required INTEGER NOT NULL DEFAULT 0,
                exportable INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (key, namespace)
            );

            CREATE INDEX IF NOT EXISTS idx_vault_namespace ON vault_entries(namespace);
            CREATE INDEX IF NOT EXISTS idx_vault_expires ON vault_entries(expires_at);
            ",
        )?;
        Ok(())
    }

    /// Parse expiry string like "24h", "7d", "30m" into a DateTime
    fn parse_expiry(expiry: &str) -> Result<DateTime<Utc>, StorageError> {
        let expiry = expiry.trim();
        if expiry.is_empty() {
            return Err(StorageError::SerializationError(
                "Empty expiry string".to_string(),
            ));
        }

        let (num_str, unit) = expiry.split_at(expiry.len() - 1);
        let num: i64 = num_str
            .parse()
            .map_err(|_| StorageError::SerializationError(format!("Invalid expiry: {}", expiry)))?;

        let duration = match unit {
            "m" => Duration::minutes(num),
            "h" => Duration::hours(num),
            "d" => Duration::days(num),
            "w" => Duration::weeks(num),
            _ => {
                return Err(StorageError::SerializationError(format!(
                    "Unknown time unit: {}. Use m/h/d/w",
                    unit
                )))
            }
        };

        Ok(Utc::now() + duration)
    }

    /// Store a key-value pair with encryption
    pub fn store(
        &self,
        key: &str,
        value: &str,
        namespace: Option<&str>,
        expiry: Option<&str>,
        biometric_required: bool,
        exportable: bool,
    ) -> Result<(), StorageError> {
        let namespace = namespace.unwrap_or("default");
        let now = Utc::now().to_rfc3339();

        // Encrypt the value
        let encrypted = crypto::encrypt_to_base64(value, &self.master_key)
            .map_err(|e| StorageError::DatabaseError(format!("Encryption failed: {}", e)))?;

        // Parse expiry
        let expires_at = match expiry {
            Some(exp) => Some(Self::parse_expiry(exp)?.to_rfc3339()),
            None => None,
        };

        // Upsert (insert or replace)
        self.conn.execute(
            "INSERT OR REPLACE INTO vault_entries 
             (key, namespace, encrypted_value, expires_at, biometric_required, exportable, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, 
                     COALESCE((SELECT created_at FROM vault_entries WHERE key = ?1 AND namespace = ?2), ?7), 
                     ?7)",
            params![
                key,
                namespace,
                encrypted,
                expires_at,
                biometric_required as i32,
                exportable as i32,
                now,
            ],
        )?;

        Ok(())
    }

    /// Retrieve and decrypt a value by key
    pub fn retrieve(
        &self,
        key: &str,
        namespace: Option<&str>,
        biometric_authenticated: bool,
    ) -> Result<Option<String>, StorageError> {
        let namespace = namespace.unwrap_or("default");

        let result: Result<StoredEntry, _> = self.conn.query_row(
            "SELECT key, encrypted_value, namespace, expires_at, biometric_required, exportable, created_at, updated_at 
             FROM vault_entries WHERE key = ?1 AND namespace = ?2",
            params![key, namespace],
            |row| {
                Ok(StoredEntry {
                    key: row.get(0)?,
                    encrypted_value: row.get(1)?,
                    namespace: row.get(2)?,
                    expires_at: row.get(3)?,
                    biometric_required: row.get::<_, i32>(4)? != 0,
                    exportable: row.get::<_, i32>(5)? != 0,
                    created_at: row.get(6)?,
                    updated_at: row.get(7)?,
                })
            },
        );

        match result {
            Ok(entry) => {
                // Check expiry
                if let Some(ref expires_at) = entry.expires_at {
                    if let Ok(exp_time) = DateTime::parse_from_rfc3339(expires_at) {
                        if Utc::now() > exp_time {
                            // Auto-delete expired entry
                            self.delete(key, Some(namespace))?;
                            return Err(StorageError::KeyExpired(key.to_string()));
                        }
                    }
                }

                // Check biometric requirement
                if entry.biometric_required && !biometric_authenticated {
                    return Err(StorageError::BiometricRequired);
                }

                // Decrypt
                let decrypted =
                    crypto::decrypt_from_base64(&entry.encrypted_value, &self.master_key)
                        .map_err(|e| {
                            StorageError::DatabaseError(format!("Decryption failed: {}", e))
                        })?;

                Ok(Some(decrypted))
            }
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(StorageError::DatabaseError(e.to_string())),
        }
    }

    /// Delete a key
    pub fn delete(&self, key: &str, namespace: Option<&str>) -> Result<bool, StorageError> {
        let namespace = namespace.unwrap_or("default");
        let rows = self.conn.execute(
            "DELETE FROM vault_entries WHERE key = ?1 AND namespace = ?2",
            params![key, namespace],
        )?;
        Ok(rows > 0)
    }

    /// Check if a key exists (and is not expired)
    pub fn exists(&self, key: &str, namespace: Option<&str>) -> Result<bool, StorageError> {
        let namespace = namespace.unwrap_or("default");
        let count: i64 = self.conn.query_row(
            "SELECT COUNT(*) FROM vault_entries 
             WHERE key = ?1 AND namespace = ?2 
             AND (expires_at IS NULL OR expires_at > ?3)",
            params![key, namespace, Utc::now().to_rfc3339()],
            |row| row.get(0),
        )?;
        Ok(count > 0)
    }

    /// List all keys in a namespace
    pub fn list_keys(&self, namespace: Option<&str>) -> Result<Vec<String>, StorageError> {
        let namespace = namespace.unwrap_or("default");
        let mut stmt = self.conn.prepare(
            "SELECT key FROM vault_entries 
             WHERE namespace = ?1 
             AND (expires_at IS NULL OR expires_at > ?2)
             ORDER BY key",
        )?;

        let keys = stmt
            .query_map(params![namespace, Utc::now().to_rfc3339()], |row| {
                row.get(0)
            })?
            .collect::<Result<Vec<String>, _>>()?;

        Ok(keys)
    }

    /// List all namespaces
    pub fn list_namespaces(&self) -> Result<Vec<String>, StorageError> {
        let mut stmt = self
            .conn
            .prepare("SELECT DISTINCT namespace FROM vault_entries ORDER BY namespace")?;

        let namespaces = stmt
            .query_map([], |row| row.get(0))?
            .collect::<Result<Vec<String>, _>>()?;

        Ok(namespaces)
    }

    /// Wipe all entries in a namespace
    pub fn wipe_namespace(&self, namespace: &str) -> Result<(), StorageError> {
        self.conn.execute(
            "DELETE FROM vault_entries WHERE namespace = ?1",
            params![namespace],
        )?;
        Ok(())
    }

    /// Wipe everything
    pub fn wipe_all(&self) -> Result<(), StorageError> {
        self.conn.execute("DELETE FROM vault_entries", [])?;
        // Also vacuum to reclaim space and overwrite deleted data
        self.conn.execute_batch("VACUUM")?;
        Ok(())
    }

    /// Get storage statistics
    pub fn get_stats(&self) -> Result<StorageStats, StorageError> {
        let total_entries: u64 = self
            .conn
            .query_row("SELECT COUNT(*) FROM vault_entries", [], |row| row.get::<_, i64>(0).map(|v| v as u64))?;

        let total_namespaces: u64 = self.conn.query_row(
            "SELECT COUNT(DISTINCT namespace) FROM vault_entries",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        let expired_entries: u64 = self.conn.query_row(
            "SELECT COUNT(*) FROM vault_entries WHERE expires_at IS NOT NULL AND expires_at <= ?1",
            params![Utc::now().to_rfc3339()],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        // Approximate storage size
        let storage_bytes: u64 = self.conn.query_row(
            "SELECT COALESCE(SUM(LENGTH(encrypted_value)), 0) FROM vault_entries",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        Ok(StorageStats {
            total_entries,
            total_namespaces,
            expired_entries,
            storage_bytes,
        })
    }

    /// Clean up expired entries
    pub fn cleanup_expired(&self) -> Result<u64, StorageError> {
        let rows = self.conn.execute(
            "DELETE FROM vault_entries WHERE expires_at IS NOT NULL AND expires_at <= ?1",
            params![Utc::now().to_rfc3339()],
        )?;
        Ok(rows as u64)
    }

    /// Export an entry (returns encrypted data for transfer)
    pub fn export_entry(
        &self,
        key: &str,
        namespace: Option<&str>,
    ) -> Result<Option<String>, StorageError> {
        let namespace = namespace.unwrap_or("default");

        let result: Result<(String, bool), _> = self.conn.query_row(
            "SELECT encrypted_value, exportable FROM vault_entries WHERE key = ?1 AND namespace = ?2",
            params![key, namespace],
            |row| Ok((row.get(0)?, row.get::<_, i32>(1)? != 0)),
        );

        match result {
            Ok((encrypted_value, exportable)) => {
                if !exportable {
                    return Err(StorageError::NotExportable);
                }
                Ok(Some(encrypted_value))
            }
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(StorageError::DatabaseError(e.to_string())),
        }
    }

    /// Import an encrypted entry
    pub fn import_entry(
        &self,
        key: &str,
        encrypted_data: &str,
        namespace: Option<&str>,
        expiry: Option<&str>,
        biometric_required: bool,
        exportable: bool,
    ) -> Result<(), StorageError> {
        let namespace = namespace.unwrap_or("default");
        let now = Utc::now().to_rfc3339();

        let expires_at = match expiry {
            Some(exp) => Some(Self::parse_expiry(exp)?.to_rfc3339()),
            None => None,
        };

        self.conn.execute(
            "INSERT OR REPLACE INTO vault_entries 
             (key, namespace, encrypted_value, expires_at, biometric_required, exportable, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)",
            params![
                key,
                namespace,
                encrypted_data,
                expires_at,
                biometric_required as i32,
                exportable as i32,
                now,
            ],
        )?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_engine() -> StorageEngine {
        StorageEngine::new(":memory:", "test-master-key-123").unwrap()
    }

    #[test]
    fn test_store_and_retrieve() {
        let engine = create_test_engine();
        engine
            .store("token", "my-secret", None, None, false, true)
            .unwrap();

        let value = engine.retrieve("token", None, false).unwrap();
        assert_eq!(value, Some("my-secret".to_string()));
    }

    #[test]
    fn test_store_with_namespace() {
        let engine = create_test_engine();
        engine
            .store("api_key", "key-1", Some("payments"), None, false, true)
            .unwrap();
        engine
            .store("api_key", "key-2", Some("health"), None, false, true)
            .unwrap();

        let v1 = engine.retrieve("api_key", Some("payments"), false).unwrap();
        let v2 = engine.retrieve("api_key", Some("health"), false).unwrap();

        assert_eq!(v1, Some("key-1".to_string()));
        assert_eq!(v2, Some("key-2".to_string()));
    }

    #[test]
    fn test_key_not_found() {
        let engine = create_test_engine();
        let value = engine.retrieve("nonexistent", None, false).unwrap();
        assert_eq!(value, None);
    }

    #[test]
    fn test_delete() {
        let engine = create_test_engine();
        engine
            .store("temp", "value", None, None, false, true)
            .unwrap();

        assert!(engine.delete("temp", None).unwrap());
        assert_eq!(engine.retrieve("temp", None, false).unwrap(), None);
    }

    #[test]
    fn test_exists() {
        let engine = create_test_engine();
        engine
            .store("exists-key", "value", None, None, false, true)
            .unwrap();

        assert!(engine.exists("exists-key", None).unwrap());
        assert!(!engine.exists("no-key", None).unwrap());
    }

    #[test]
    fn test_list_keys() {
        let engine = create_test_engine();
        engine
            .store("alpha", "1", None, None, false, true)
            .unwrap();
        engine
            .store("beta", "2", None, None, false, true)
            .unwrap();
        engine
            .store("gamma", "3", None, None, false, true)
            .unwrap();

        let keys = engine.list_keys(None).unwrap();
        assert_eq!(keys, vec!["alpha", "beta", "gamma"]);
    }

    #[test]
    fn test_list_namespaces() {
        let engine = create_test_engine();
        engine
            .store("k1", "v1", Some("auth"), None, false, true)
            .unwrap();
        engine
            .store("k2", "v2", Some("payments"), None, false, true)
            .unwrap();

        let ns = engine.list_namespaces().unwrap();
        assert!(ns.contains(&"auth".to_string()));
        assert!(ns.contains(&"payments".to_string()));
    }

    #[test]
    fn test_wipe_namespace() {
        let engine = create_test_engine();
        engine
            .store("k1", "v1", Some("temp"), None, false, true)
            .unwrap();
        engine
            .store("k2", "v2", Some("temp"), None, false, true)
            .unwrap();
        engine
            .store("k3", "v3", Some("keep"), None, false, true)
            .unwrap();

        engine.wipe_namespace("temp").unwrap();

        assert_eq!(engine.list_keys(Some("temp")).unwrap().len(), 0);
        assert_eq!(engine.list_keys(Some("keep")).unwrap().len(), 1);
    }

    #[test]
    fn test_wipe_all() {
        let engine = create_test_engine();
        engine
            .store("k1", "v1", None, None, false, true)
            .unwrap();
        engine
            .store("k2", "v2", None, None, false, true)
            .unwrap();

        engine.wipe_all().unwrap();

        let stats = engine.get_stats().unwrap();
        assert_eq!(stats.total_entries, 0);
    }

    #[test]
    fn test_biometric_required() {
        let engine = create_test_engine();
        engine
            .store("pin", "1234", None, None, true, true)
            .unwrap();

        // Without biometric auth → should fail
        let result = engine.retrieve("pin", None, false);
        assert!(matches!(result, Err(StorageError::BiometricRequired)));

        // With biometric auth → should succeed
        let value = engine.retrieve("pin", None, true).unwrap();
        assert_eq!(value, Some("1234".to_string()));
    }

    #[test]
    fn test_non_exportable() {
        let engine = create_test_engine();
        engine
            .store("private", "secret", None, None, false, false)
            .unwrap();

        let result = engine.export_entry("private", None);
        assert!(matches!(result, Err(StorageError::NotExportable)));
    }

    #[test]
    fn test_stats() {
        let engine = create_test_engine();
        engine
            .store("k1", "v1", Some("ns1"), None, false, true)
            .unwrap();
        engine
            .store("k2", "v2", Some("ns2"), None, false, true)
            .unwrap();

        let stats = engine.get_stats().unwrap();
        assert_eq!(stats.total_entries, 2);
        assert_eq!(stats.total_namespaces, 2);
    }

    #[test]
    fn test_unicode_storage() {
        let engine = create_test_engine();
        engine
            .store("hindi", "नमस्ते दुनिया 🇮🇳", None, None, false, true)
            .unwrap();

        let value = engine.retrieve("hindi", None, false).unwrap();
        assert_eq!(value, Some("नमस्ते दुनिया 🇮🇳".to_string()));
    }

    #[test]
    fn test_overwrite_existing_key() {
        let engine = create_test_engine();
        engine
            .store("key", "value1", None, None, false, true)
            .unwrap();
        engine
            .store("key", "value2", None, None, false, true)
            .unwrap();

        let value = engine.retrieve("key", None, false).unwrap();
        assert_eq!(value, Some("value2".to_string()));
    }
}
