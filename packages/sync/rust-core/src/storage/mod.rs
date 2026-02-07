use chrono::Utc;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use uuid::Uuid;

use crate::crdt::{CrdtDocument, HLC, OpType, Operation};

#[derive(Debug, thiserror::Error)]
pub enum StorageError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Serialization error: {0}")]
    Serialization(String),
}

impl From<rusqlite::Error> for StorageError {
    fn from(e: rusqlite::Error) -> Self {
        StorageError::Database(e.to_string())
    }
}

/// Local-first document storage with operation log for sync
pub struct SyncStorage {
    conn: Mutex<Connection>,
    node_id: String,
    clock: Mutex<HLC>,
}

impl SyncStorage {
    pub fn new(db_path: &str, node_id: &str) -> Result<Self, StorageError> {
        let conn = if db_path == ":memory:" {
            Connection::open_in_memory()?
        } else {
            Connection::open(db_path)?
        };

        let storage = SyncStorage {
            conn: Mutex::new(conn),
            node_id: node_id.to_string(),
            clock: Mutex::new(HLC::new(node_id)),
        };
        storage.initialize_db()?;
        Ok(storage)
    }

    fn initialize_db(&self) -> Result<(), StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT NOT NULL,
                collection TEXT NOT NULL,
                data_json TEXT NOT NULL,
                hlc_json TEXT NOT NULL,
                deleted INTEGER NOT NULL DEFAULT 0,
                version INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (id, collection)
            );

            CREATE TABLE IF NOT EXISTS op_log (
                id TEXT PRIMARY KEY,
                collection TEXT NOT NULL,
                document_id TEXT NOT NULL,
                op_type TEXT NOT NULL,
                field TEXT,
                value TEXT,
                hlc_json TEXT NOT NULL,
                synced INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_docs_collection ON documents(collection);
            CREATE INDEX IF NOT EXISTS idx_docs_updated ON documents(updated_at);
            CREATE INDEX IF NOT EXISTS idx_oplog_synced ON op_log(synced);
            CREATE INDEX IF NOT EXISTS idx_oplog_collection ON op_log(collection, document_id);
            ",
        )?;
        Ok(())
    }

    fn next_hlc(&self) -> HLC {
        self.clock
            .lock()
            .map(|mut c| c.next())
            .unwrap_or_else(|_| HLC::new(&self.node_id))
    }

    /// Insert a new document
    pub fn insert(
        &self,
        collection: &str,
        data_json: &str,
    ) -> Result<String, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let id = Uuid::new_v4().to_string();
        let now = Utc::now().to_rfc3339();
        let hlc = self.next_hlc();
        let hlc_json = serde_json::to_string(&hlc)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;

        conn.execute(
            "INSERT INTO documents (id, collection, data_json, hlc_json, deleted, version, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, 0, 1, ?5, ?5)",
            params![id, collection, data_json, hlc_json, now],
        )?;

        // Record in op_log
        let op_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO op_log (id, collection, document_id, op_type, field, value, hlc_json, synced, created_at)
             VALUES (?1, ?2, ?3, 'Insert', NULL, ?4, ?5, 0, ?6)",
            params![op_id, collection, id, data_json, hlc_json, now],
        )?;

        Ok(id)
    }

    /// Update a document field
    pub fn update(
        &self,
        collection: &str,
        document_id: &str,
        field: &str,
        value: &str,
    ) -> Result<(), StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let now = Utc::now().to_rfc3339();
        let hlc = self.next_hlc();
        let hlc_json = serde_json::to_string(&hlc)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;

        // Get current data, merge field
        let current_json: String = conn
            .query_row(
                "SELECT data_json FROM documents WHERE id = ?1 AND collection = ?2 AND deleted = 0",
                params![document_id, collection],
                |row| row.get(0),
            )
            .map_err(|_| StorageError::NotFound(document_id.to_string()))?;

        let mut data: serde_json::Value = serde_json::from_str(&current_json)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;

        if let Some(obj) = data.as_object_mut() {
            obj.insert(
                field.to_string(),
                serde_json::Value::String(value.to_string()),
            );
        }

        let updated_json = serde_json::to_string(&data)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;

        conn.execute(
            "UPDATE documents SET data_json = ?1, hlc_json = ?2, version = version + 1, updated_at = ?3 
             WHERE id = ?4 AND collection = ?5",
            params![updated_json, hlc_json, now, document_id, collection],
        )?;

        // Record in op_log
        let op_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO op_log (id, collection, document_id, op_type, field, value, hlc_json, synced, created_at)
             VALUES (?1, ?2, ?3, 'Update', ?4, ?5, ?6, 0, ?7)",
            params![op_id, collection, document_id, field, value, hlc_json, now],
        )?;

        Ok(())
    }

    /// Soft-delete a document
    pub fn delete(&self, collection: &str, document_id: &str) -> Result<bool, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let now = Utc::now().to_rfc3339();
        let hlc = self.next_hlc();
        let hlc_json = serde_json::to_string(&hlc)
            .map_err(|e| StorageError::Serialization(e.to_string()))?;

        let rows = conn.execute(
            "UPDATE documents SET deleted = 1, hlc_json = ?1, updated_at = ?2 WHERE id = ?3 AND collection = ?4",
            params![hlc_json, now, document_id, collection],
        )?;

        if rows > 0 {
            let op_id = Uuid::new_v4().to_string();
            conn.execute(
                "INSERT INTO op_log (id, collection, document_id, op_type, field, value, hlc_json, synced, created_at)
                 VALUES (?1, ?2, ?3, 'Delete', NULL, NULL, ?4, 0, ?5)",
                params![op_id, collection, document_id, hlc_json, now],
            )?;
        }

        Ok(rows > 0)
    }

    /// Get a single document
    pub fn get(&self, collection: &str, document_id: &str) -> Result<Option<String>, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let result = conn.query_row(
            "SELECT data_json FROM documents WHERE id = ?1 AND collection = ?2 AND deleted = 0",
            params![document_id, collection],
            |row| row.get::<_, String>(0),
        );

        match result {
            Ok(json) => Ok(Some(json)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(StorageError::Database(e.to_string())),
        }
    }

    /// Query all documents in a collection
    pub fn query(&self, collection: &str, limit: u32) -> Result<Vec<String>, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let mut stmt = conn.prepare(
            "SELECT data_json FROM documents WHERE collection = ?1 AND deleted = 0 ORDER BY updated_at DESC LIMIT ?2",
        )?;

        let docs = stmt
            .query_map(params![collection, limit], |row| row.get::<_, String>(0))?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(docs)
    }

    /// Get unsynced operations for sending to server
    pub fn get_unsynced_ops(&self, limit: u32) -> Result<Vec<String>, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let mut stmt = conn.prepare(
            "SELECT id, collection, document_id, op_type, field, value, hlc_json, synced, created_at
             FROM op_log WHERE synced = 0 ORDER BY created_at ASC LIMIT ?1",
        )?;

        let ops = stmt
            .query_map(params![limit], |row| {
                let op = serde_json::json!({
                    "id": row.get::<_, String>(0)?,
                    "collection": row.get::<_, String>(1)?,
                    "document_id": row.get::<_, String>(2)?,
                    "op_type": row.get::<_, String>(3)?,
                    "field": row.get::<_, Option<String>>(4)?,
                    "value": row.get::<_, Option<String>>(5)?,
                    "hlc_json": row.get::<_, String>(6)?,
                    "synced": row.get::<_, i32>(7)?,
                    "created_at": row.get::<_, String>(8)?,
                });
                Ok(op.to_string())
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(ops)
    }

    /// Mark operations as synced
    pub fn mark_synced(&self, op_ids: &[String]) -> Result<u64, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let mut count = 0u64;
        for id in op_ids {
            count += conn.execute(
                "UPDATE op_log SET synced = 1 WHERE id = ?1",
                params![id],
            )? as u64;
        }
        Ok(count)
    }

    /// Get sync stats
    pub fn get_stats(&self) -> Result<String, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;

        let total_docs: u64 = conn.query_row(
            "SELECT COUNT(*) FROM documents WHERE deleted = 0",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;
        let total_ops: u64 = conn.query_row("SELECT COUNT(*) FROM op_log", [], |row| row.get::<_, i64>(0).map(|v| v as u64))?;
        let unsynced_ops: u64 = conn.query_row(
            "SELECT COUNT(*) FROM op_log WHERE synced = 0",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;
        let collections: u64 = conn.query_row(
            "SELECT COUNT(DISTINCT collection) FROM documents",
            [],
            |row| row.get::<_, i64>(0).map(|v| v as u64),
        )?;

        Ok(serde_json::json!({
            "total_documents": total_docs,
            "total_operations": total_ops,
            "unsynced_operations": unsynced_ops,
            "collections": collections,
        })
        .to_string())
    }

    /// Purge synced operations older than N hours
    pub fn purge_old_ops(&self, hours: u32) -> Result<u64, StorageError> {
        let conn = self.conn.lock().map_err(|e| StorageError::Database(e.to_string()))?;
        let cutoff = Utc::now() - chrono::Duration::hours(hours as i64);
        let rows = conn.execute(
            "DELETE FROM op_log WHERE synced = 1 AND created_at < ?1",
            params![cutoff.to_rfc3339()],
        )?;
        Ok(rows as u64)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_storage() -> SyncStorage {
        SyncStorage::new(":memory:", "test-node").unwrap()
    }

    #[test]
    fn test_insert_and_get() {
        let store = create_test_storage();
        let id = store.insert("tasks", r#"{"title":"Buy milk","done":false}"#).unwrap();
        let doc = store.get("tasks", &id).unwrap().unwrap();
        assert!(doc.contains("Buy milk"));
    }

    #[test]
    fn test_update_field() {
        let store = create_test_storage();
        let id = store.insert("tasks", r#"{"title":"Buy milk","done":"false"}"#).unwrap();
        store.update("tasks", &id, "done", "true").unwrap();

        let doc = store.get("tasks", &id).unwrap().unwrap();
        assert!(doc.contains("true"));
    }

    #[test]
    fn test_delete() {
        let store = create_test_storage();
        let id = store.insert("tasks", r#"{"title":"Delete me"}"#).unwrap();
        assert!(store.delete("tasks", &id).unwrap());
        assert!(store.get("tasks", &id).unwrap().is_none());
    }

    #[test]
    fn test_query_collection() {
        let store = create_test_storage();
        store.insert("tasks", r#"{"title":"Task 1"}"#).unwrap();
        store.insert("tasks", r#"{"title":"Task 2"}"#).unwrap();
        store.insert("notes", r#"{"title":"Note 1"}"#).unwrap();

        let tasks = store.query("tasks", 100).unwrap();
        assert_eq!(tasks.len(), 2);

        let notes = store.query("notes", 100).unwrap();
        assert_eq!(notes.len(), 1);
    }

    #[test]
    fn test_unsynced_ops() {
        let store = create_test_storage();
        store.insert("tasks", r#"{"title":"Task 1"}"#).unwrap();
        store.insert("tasks", r#"{"title":"Task 2"}"#).unwrap();

        let ops = store.get_unsynced_ops(100).unwrap();
        assert_eq!(ops.len(), 2);
    }

    #[test]
    fn test_stats() {
        let store = create_test_storage();
        store.insert("tasks", r#"{"title":"Task"}"#).unwrap();
        store.insert("notes", r#"{"title":"Note"}"#).unwrap();

        let stats = store.get_stats().unwrap();
        assert!(stats.contains("\"total_documents\":2"));
        assert!(stats.contains("\"collections\":2"));
    }

    #[test]
    fn test_get_nonexistent() {
        let store = create_test_storage();
        assert!(store.get("tasks", "nonexistent").unwrap().is_none());
    }
}
