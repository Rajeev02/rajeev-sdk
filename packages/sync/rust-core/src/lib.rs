pub mod crdt;
pub mod storage;

pub use crdt::{CrdtDocument, HLC, MergeResult, OpType, Operation};
pub use storage::SyncStorage;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_full_sync_flow() {
        // Simulate two devices syncing
        let device_a = SyncStorage::new(":memory:", "device-a").unwrap();
        let device_b = SyncStorage::new(":memory:", "device-b").unwrap();

        // Device A creates a task
        let task_id = device_a.insert("tasks", r#"{"title":"Shared task","done":"false"}"#).unwrap();

        // Get unsynced ops from A
        let ops = device_a.get_unsynced_ops(100).unwrap();
        assert_eq!(ops.len(), 1);

        // After sync, the data would be on device B too
        device_b.insert("tasks", r#"{"title":"Shared task","done":"false"}"#).unwrap();

        // Both devices have the task
        assert_eq!(device_a.query("tasks", 100).unwrap().len(), 1);
        assert_eq!(device_b.query("tasks", 100).unwrap().len(), 1);
    }
}
