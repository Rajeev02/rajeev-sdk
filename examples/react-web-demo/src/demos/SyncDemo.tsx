import { useState } from "react";

const btn: React.CSSProperties = {
  background: "#4F46E5",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  margin: 4,
  fontSize: 13,
  fontWeight: 500,
};
const logBox: React.CSSProperties = {
  background: "#1E1E2E",
  color: "#A5F3FC",
  fontFamily: "monospace",
  fontSize: 13,
  padding: 16,
  borderRadius: 8,
  maxHeight: 300,
  overflowY: "auto",
  whiteSpace: "pre-wrap",
  marginTop: 16,
};

export default function SyncDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🔄 Sync</h2>
      <p style={{ color: "#666" }}>
        Offline-first CRDT sync engine with conflict resolution and HLC
        timestamps.
      </p>

      <h3>Document Operations</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'sync.createDoc("cart-001") → Document created { id: "cart-001", hlc: "2026-02-07T10:30:00.000Z-0001-node_a" }',
          )
        }
      >
        Create CRDT Doc
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'sync.set("cart-001", "item_count", 3) → field set { hlc: "…-0002-node_a", op: "LWW_SET" }',
          )
        }
      >
        Set item_count = 3
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'sync.set("cart-001", "total", 2499.50) → field set { hlc: "…-0003-node_a", op: "LWW_SET" }',
          )
        }
      >
        Set total = ₹2499.50
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'sync.get("cart-001") → { item_count: 3, total: 2499.50, _version: 3 }',
          )
        }
      >
        Get Document
      </button>

      <h3>Conflict Resolution</h3>
      <button
        style={btn}
        onClick={() => {
          append("⚡ Simulating concurrent edit from node_b…");
          append(
            'node_b: sync.set("cart-001", "item_count", 5) → hlc: "…-0002-node_b"',
          );
          append(
            'sync.merge("cart-001", remote_ops) → CONFLICT on "item_count"',
          );
          append("  → Resolved via HLC: node_b wins (later timestamp)");
          append("  → item_count = 5 (merged)");
        }}
      >
        Merge Conflicting Changes
      </button>

      <h3>Timestamps & History</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'sync.hlc() → "2026-02-07T10:30:12.847Z-0004-node_a" (HLC: physical+logical+node)',
          )
        }
      >
        Show HLC Timestamp
      </button>
      <button
        style={btn}
        onClick={() => {
          append('sync.diff("cart-001", since: "…-0001") →');
          append("  [+] item_count: 3 → 5 (merged)");
          append("  [+] total: null → 2499.50");
          append("  2 changes, 0 deletions");
        }}
      >
        Show Diff
      </button>

      <h3>Server Sync</h3>
      <button
        style={btn}
        onClick={() => {
          append('sync.push("cart-001") → uploading 3 ops (412 bytes)…');
          setTimeout(
            () => append("sync.push complete → server ack, version 3"),
            300,
          );
        }}
      >
        Sync to Server
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'sync.status() → { pending: 0, synced: 3, lastSync: "2s ago", online: true }',
          )
        }
      >
        Sync Status
      </button>

      <div style={logBox}>
        {log.length === 0 ? "// Output will appear here…" : log.join("\n")}
      </div>
      {log.length > 0 && (
        <button
          style={{ ...btn, background: "#666", marginTop: 8 }}
          onClick={() => setLog([])}
        >
          Clear Log
        </button>
      )}
    </div>
  );
}
