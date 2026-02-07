use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

/// Hybrid Logical Clock — combines wall clock with a counter for ordering
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct HLC {
    /// Wall clock timestamp in milliseconds
    pub timestamp_ms: i64,
    /// Counter for same-millisecond ordering
    pub counter: u32,
    /// Node ID to break ties
    pub node_id: String,
}

impl HLC {
    pub fn new(node_id: &str) -> Self {
        HLC {
            timestamp_ms: Utc::now().timestamp_millis(),
            counter: 0,
            node_id: node_id.to_string(),
        }
    }

    /// Generate next timestamp, ensuring monotonic increase
    pub fn next(&mut self) -> HLC {
        let now = Utc::now().timestamp_millis();
        if now > self.timestamp_ms {
            self.timestamp_ms = now;
            self.counter = 0;
        } else {
            self.counter += 1;
        }
        self.clone()
    }

    /// Merge with a remote clock — take the maximum
    pub fn merge(&mut self, remote: &HLC) {
        let now = Utc::now().timestamp_millis();
        if now > self.timestamp_ms && now > remote.timestamp_ms {
            self.timestamp_ms = now;
            self.counter = 0;
        } else if self.timestamp_ms > remote.timestamp_ms {
            self.counter += 1;
        } else if remote.timestamp_ms > self.timestamp_ms {
            self.timestamp_ms = remote.timestamp_ms;
            self.counter = remote.counter + 1;
        } else {
            // Same timestamp
            self.counter = self.counter.max(remote.counter) + 1;
        }
    }
}

/// An operation in the operation log (op-log)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Operation {
    /// Unique operation ID
    pub id: String,
    /// Collection name (e.g., "tasks", "notes")
    pub collection: String,
    /// Document ID being modified
    pub document_id: String,
    /// Operation type
    pub op_type: OpType,
    /// Field being modified (for updates)
    pub field: Option<String>,
    /// New value as JSON
    pub value: Option<String>,
    /// HLC timestamp for ordering
    pub hlc: HLC,
    /// Whether this operation has been synced to server
    pub synced: bool,
}

/// Type of operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum OpType {
    Insert,
    Update,
    Delete,
}

/// Merge result when applying remote operations
#[derive(Debug, Clone)]
pub enum MergeResult {
    /// Local wins — no change needed
    LocalWins,
    /// Remote wins — apply remote value
    RemoteWins { value: Option<String> },
    /// Conflict — both values kept, user must resolve
    Conflict {
        local_value: Option<String>,
        remote_value: Option<String>,
    },
}

/// Last-Write-Wins (LWW) merge strategy
pub fn lww_merge(local: &Operation, remote: &Operation) -> MergeResult {
    if local.hlc > remote.hlc {
        MergeResult::LocalWins
    } else if remote.hlc > local.hlc {
        MergeResult::RemoteWins {
            value: remote.value.clone(),
        }
    } else {
        // Same HLC — use node_id as tiebreaker (deterministic)
        if local.hlc.node_id >= remote.hlc.node_id {
            MergeResult::LocalWins
        } else {
            MergeResult::RemoteWins {
                value: remote.value.clone(),
            }
        }
    }
}

/// A document with field-level CRDT tracking
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrdtDocument {
    pub id: String,
    pub collection: String,
    /// Field values with their HLC timestamps
    pub fields: HashMap<String, (String, HLC)>,
    /// Whether the document is deleted (tombstone)
    pub deleted: bool,
    /// When last modified
    pub last_modified: HLC,
}

impl CrdtDocument {
    pub fn new(id: &str, collection: &str, node_id: &str) -> Self {
        CrdtDocument {
            id: id.to_string(),
            collection: collection.to_string(),
            fields: HashMap::new(),
            deleted: false,
            last_modified: HLC::new(node_id),
        }
    }

    /// Set a field value
    pub fn set_field(&mut self, field: &str, value: &str, hlc: HLC) {
        self.fields
            .insert(field.to_string(), (value.to_string(), hlc.clone()));
        self.last_modified = hlc;
    }

    /// Get a field value
    pub fn get_field(&self, field: &str) -> Option<&str> {
        self.fields.get(field).map(|(v, _)| v.as_str())
    }

    /// Merge with a remote version of the same document (field-level LWW)
    pub fn merge(&mut self, remote: &CrdtDocument) {
        for (field, (remote_value, remote_hlc)) in &remote.fields {
            match self.fields.get(field) {
                Some((_local_value, local_hlc)) => {
                    if remote_hlc > local_hlc {
                        self.fields
                            .insert(field.clone(), (remote_value.clone(), remote_hlc.clone()));
                    }
                }
                None => {
                    self.fields
                        .insert(field.clone(), (remote_value.clone(), remote_hlc.clone()));
                }
            }
        }

        if remote.last_modified > self.last_modified {
            self.last_modified = remote.last_modified.clone();
            self.deleted = remote.deleted;
        }
    }

    /// Convert fields to a flat JSON object
    pub fn to_json(&self) -> String {
        let map: HashMap<&str, &str> = self
            .fields
            .iter()
            .map(|(k, (v, _))| (k.as_str(), v.as_str()))
            .collect();
        serde_json::to_string(&map).unwrap_or_else(|_| "{}".to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hlc_monotonic() {
        let mut clock = HLC::new("node-1");
        let t1 = clock.next();
        let t2 = clock.next();
        let t3 = clock.next();
        assert!(t2 > t1);
        assert!(t3 > t2);
    }

    #[test]
    fn test_hlc_merge() {
        let mut local = HLC::new("node-a");
        let mut remote = HLC::new("node-b");

        // Advance remote far ahead
        remote.timestamp_ms += 10000;
        remote.next();

        local.merge(&remote);
        assert!(local.timestamp_ms >= remote.timestamp_ms);
    }

    #[test]
    fn test_lww_merge_local_wins() {
        let mut clock_a = HLC::new("a");
        let mut clock_b = HLC::new("b");

        let t1 = clock_b.next();
        std::thread::sleep(std::time::Duration::from_millis(2));
        let t2 = clock_a.next();

        let local = Operation {
            id: "op1".to_string(),
            collection: "tasks".to_string(),
            document_id: "doc1".to_string(),
            op_type: OpType::Update,
            field: Some("title".to_string()),
            value: Some("local-value".to_string()),
            hlc: t2,
            synced: false,
        };

        let remote = Operation {
            id: "op2".to_string(),
            collection: "tasks".to_string(),
            document_id: "doc1".to_string(),
            op_type: OpType::Update,
            field: Some("title".to_string()),
            value: Some("remote-value".to_string()),
            hlc: t1,
            synced: true,
        };

        match lww_merge(&local, &remote) {
            MergeResult::LocalWins => {} // Expected
            _ => panic!("Local should win with later timestamp"),
        }
    }

    #[test]
    fn test_document_field_merge() {
        let mut doc_a = CrdtDocument::new("doc1", "tasks", "node-a");
        let mut doc_b = CrdtDocument::new("doc1", "tasks", "node-b");

        let mut clock_a = HLC::new("node-a");
        let mut clock_b = HLC::new("node-b");

        // Node A sets title
        doc_a.set_field("title", "Title from A", clock_a.next());
        // Node B sets description
        doc_b.set_field("description", "Desc from B", clock_b.next());

        // Merge B into A — should have both fields
        doc_a.merge(&doc_b);

        assert_eq!(doc_a.get_field("title"), Some("Title from A"));
        assert_eq!(doc_a.get_field("description"), Some("Desc from B"));
    }

    #[test]
    fn test_document_conflicting_field_merge() {
        let mut doc_a = CrdtDocument::new("doc1", "tasks", "node-a");
        let mut doc_b = CrdtDocument::new("doc1", "tasks", "node-b");

        let mut clock_a = HLC::new("node-a");
        let mut clock_b = HLC::new("node-b");

        // Both set the same field
        doc_a.set_field("title", "Version A", clock_a.next());
        std::thread::sleep(std::time::Duration::from_millis(2));
        doc_b.set_field("title", "Version B", clock_b.next());

        // Merge B into A — B should win (later timestamp)
        doc_a.merge(&doc_b);
        assert_eq!(doc_a.get_field("title"), Some("Version B"));
    }

    #[test]
    fn test_document_to_json() {
        let mut doc = CrdtDocument::new("doc1", "tasks", "node-a");
        let mut clock = HLC::new("node-a");
        doc.set_field("title", "My Task", clock.next());
        doc.set_field("done", "false", clock.next());

        let json = doc.to_json();
        assert!(json.contains("My Task"));
        assert!(json.contains("false"));
    }
}
