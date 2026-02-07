# @rajeev02/sync

**Offline-first sync engine** with CRDT-based conflict resolution, Hybrid Logical Clock causal ordering, persistent operation log, and multi-device convergence.

| Platform             | Engine                    | Binding         |
| -------------------- | ------------------------- | --------------- |
| iOS 16+              | Rust (`rajeev-sync-core`) | UniFFI → Swift  |
| Android 7+ (API 24)  | Rust (`rajeev-sync-core`) | UniFFI → Kotlin |
| Web                  | Rust → WASM               | `wasm-bindgen`  |
| watchOS 9+ / Wear OS | Rust                      | UniFFI          |
| Android Auto         | Rust                      | UniFFI          |

---

## Installation

```bash
npm install @rajeev02/sync
```

---

## Quick Start

```typescript
import { SyncStorage } from "@rajeev02/sync";

// Each device gets a unique node ID
const storage = new SyncStorage(":memory:", "device-phone-01");

// Insert documents
const docId = await storage.insert(
  "tasks",
  JSON.stringify({
    title: "Buy groceries",
    done: false,
  }),
);

// Update fields
await storage.update("tasks", docId, "done", "true");

// Query
const tasks = await storage.query("tasks", 10);

// Get unsynced operations for server push
const ops = await storage.getUnsyncedOps(100);
```

---

## Platform Usage

### iOS / Android (React Native)

```typescript
import { SyncStorage } from "@rajeev02/sync";
import { getDeviceId } from "./utils";

const storage = new SyncStorage(
  `${documentsDir}/sync.db`, // Persistent SQLite database
  getDeviceId(), // Unique device identifier
);

// All mutations are recorded in the operation log
await storage.insert(
  "notes",
  JSON.stringify({ title: "Meeting notes", body: "..." }),
);

// Sync with server when online
const unsyncedOps = await storage.getUnsyncedOps(100);
await sendToServer(unsyncedOps);
await storage.markSynced(unsyncedOps.map((op) => op.id));
```

### Web (WASM)

```typescript
import { SyncStorage } from "@rajeev02/sync";

// In-memory for web, or use IndexedDB adapter
const storage = new SyncStorage(":memory:", `browser-${crypto.randomUUID()}`);

await storage.insert(
  "bookmarks",
  JSON.stringify({ url: "https://example.com" }),
);
```

### watchOS / Wear OS

Same API — sync operations between watch and phone:

```typescript
// Watch creates tasks locally
const id = await storage.insert(
  "tasks",
  JSON.stringify({ title: "Take medicine" }),
);

// Phone receives the op and merges — CRDT guarantees convergence
```

---

## Core Concepts

### CRDT (Conflict-free Replicated Data Types)

Every document is a **CRDT document** with field-level Last-Writer-Wins (LWW) semantics. When two devices edit the same field, the one with the later Hybrid Logical Clock timestamp wins — deterministically, across all devices.

### Hybrid Logical Clock (HLC)

The HLC combines **physical time** (wall clock) with a **logical counter** and **node ID** to provide:

- **Causal ordering:** If A happened before B, HLC(A) < HLC(B)
- **Uniqueness:** No two operations share the same HLC
- **Clock skew tolerance:** The logical counter prevents duplicates even with clock drift

```
HLC = { timestamp_ms: 1707312000000, counter: 0, node_id: "device-A" }
```

**Comparison order:** `timestamp_ms` → `counter` → `node_id` (lexicographic)

### Operation Log

Every mutation (insert, update, delete) is recorded as an `Operation` in the persistent log:

```
[Insert]  tasks/uuid-001  @ HLC(1707312000, 0, device-A)
[Update]  tasks/uuid-001  done="true"  @ HLC(1707312001, 0, device-A)
[Delete]  tasks/uuid-002  @ HLC(1707312002, 0, device-A)
```

Operations are marked as `synced: false` until confirmed by the server.

---

## API Reference

### `SyncStorage`

#### `new SyncStorage(dbPath, nodeId)`

Create a sync storage instance.

| Parameter | Description                                     |
| --------- | ----------------------------------------------- |
| `dbPath`  | SQLite database path (`:memory:` for in-memory) |
| `nodeId`  | Unique identifier for this device/client        |

```typescript
const storage = new SyncStorage("/data/sync.db", "device-phone-01");
```

#### `storage.insert(collection, dataJson): string`

Insert a new document. Returns the generated document ID (UUID).

```typescript
const id = await storage.insert(
  "tasks",
  JSON.stringify({
    title: "Ship feature",
    priority: "high",
    assignee: "Rajeev",
  }),
);
// → 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```

An `Insert` operation is recorded in the op log.

#### `storage.update(collection, documentId, field, value)`

Update a single field on a document. Each field update gets its own HLC for fine-grained conflict resolution.

```typescript
await storage.update("tasks", id, "priority", "critical");
await storage.update("tasks", id, "assignee", "Priya");
```

An `Update` operation is recorded for each call.

#### `storage.delete(collection, documentId): boolean`

Soft-delete a document. Returns `true` if found.

```typescript
await storage.delete("tasks", id); // Marks as deleted, doesn't remove
```

A `Delete` operation is recorded.

#### `storage.get(collection, documentId): string | null`

Get a document as JSON. Returns `null` if not found or deleted.

```typescript
const doc = await storage.get("tasks", id);
// → '{"title":"Ship feature","priority":"critical","assignee":"Priya"}'
```

#### `storage.query(collection, limit): string[]`

Query documents in a collection. Returns an array of JSON strings.

```typescript
const tasks = await storage.query("tasks", 50);
tasks.forEach((json) => {
  const task = JSON.parse(json);
  console.log(task.title);
});
```

---

### Sync Operations

#### `storage.getUnsyncedOps(limit): string[]`

Get unsynced operations as JSON strings for server push.

```typescript
const ops = await storage.getUnsyncedOps(100);
// → [
//   '{"id":"op-001","collection":"tasks","document_id":"uuid-001","op_type":"Insert",...}',
//   '{"id":"op-002","collection":"tasks","document_id":"uuid-001","op_type":"Update",...}',
// ]
```

Each operation includes:

```typescript
interface Operation {
  id: string;
  collection: string;
  documentId: string;
  opType: "Insert" | "Update" | "Delete";
  field?: string; // For Update ops
  value?: string; // For Update ops
  hlc: {
    timestampMs: number;
    counter: number;
    nodeId: string;
  };
  synced: boolean;
}
```

#### `storage.markSynced(opIds: string[]): number`

Mark operations as synced after successful server push. Returns the count of ops marked.

```typescript
const count = await storage.markSynced(["op-001", "op-002"]);
// → 2
```

#### `storage.purgeOldOps(hours): number`

Remove old synced operations to save space. Returns the count of purged ops.

```typescript
const purged = await storage.purgeOldOps(24); // Remove ops older than 24h
// → 47
```

---

### Stats

```typescript
const stats = await storage.getStats();
// → {
//   total_documents: 42,
//   total_operations: 128,
//   unsynced_operations: 5,
//   collections: 3
// }
```

---

### CRDT Document (Low-Level)

For advanced usage, work directly with CRDT documents:

```typescript
import { CrdtDocument, HLC, lwwMerge } from "@rajeev02/sync";

// Create documents on two devices
const docA = CrdtDocument.new("doc-001", "tasks", "device-A");
const docB = CrdtDocument.new("doc-001", "tasks", "device-B");

// Both edit the same field
const hlcA = new HLC("device-A");
docA.setField("title", "Buy pasta", hlcA.next());

const hlcB = new HLC("device-B");
docB.setField("title", "Buy rice", hlcB.next());

// Merge — later HLC wins
docA.merge(docB);
docA.getField("title"); // → 'Buy rice' (device-B had later timestamp)

// docB also merges — converges to same result
docB.merge(docA);
docB.getField("title"); // → 'Buy rice' ✅ Same!
```

### Conflict Resolution Rules

| Scenario                          | Resolution                              |
| --------------------------------- | --------------------------------------- |
| Different timestamps              | Later timestamp wins                    |
| Same timestamp, different counter | Higher counter wins                     |
| Same timestamp + counter          | Lexicographically greater `nodeId` wins |

**Result:** Deterministic convergence across all devices without coordination.

---

### Sync Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Phone      │     │   Server     │     │   Laptop     │
│  device-A    │     │   (relay)    │     │  device-B    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ SyncStorage  │     │              │     │ SyncStorage  │
│  op_log      │────►│  Forward     │────►│  op_log      │
│  CRDT docs   │     │  ops         │     │  CRDT docs   │
│              │◄────│              │◄────│              │
└──────────────┘     └──────────────┘     └──────────────┘
         │                                       │
         └───────── Converge (LWW merge) ────────┘
```

1. Each device writes locally → operations go to `op_log`
2. When online, push `getUnsyncedOps()` to server
3. Server forwards to all connected devices
4. Each device applies remote ops → CRDT merge resolves conflicts
5. All devices converge to identical state

---

### Build from Source

```bash
cargo test -p rajeev-sync-core            # Run tests
./tools/rust-build/build-ios.sh sync      # Build for iOS
./tools/rust-build/build-android.sh sync  # Build for Android
./tools/rust-build/build-wasm.sh sync     # Build for Web (WASM)
```
