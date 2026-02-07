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

export default function NetworkDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🌐 Network</h2>
      <p style={{ color: "#666" }}>
        Smart networking with priority queues, caching, and compression.
      </p>

      <h3>Connectivity</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.checkConnectivity() → { online: true, type: "wifi", downlink: 48.5, rtt: 12, effectiveType: "4g" }',
          )
        }
      >
        Check Connectivity
      </button>

      <h3>Priority Queue</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.enqueue({ url: "/api/payment", priority: "high" }) → queued #1 (high) — executing immediately',
          )
        }
      >
        Enqueue High
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.enqueue({ url: "/api/analytics", priority: "medium" }) → queued #2 (medium) — waiting for slot',
          )
        }
      >
        Enqueue Medium
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.enqueue({ url: "/api/logs", priority: "low" }) → queued #3 (low) — deferred',
          )
        }
      >
        Enqueue Low
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "network.queue.status() → { pending: 2, active: 1, completed: 0, slots: 4/6 available }",
          )
        }
      >
        Queue Status
      </button>

      <h3>HTTP Cache</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.get("/api/products") → 200 OK (247ms, CACHE MISS, stored with max-age=300)',
          )
        }
      >
        GET (Cache Miss)
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.get("/api/products") → 200 OK (1ms, CACHE HIT, expires in 4m58s)',
          )
        }
      >
        GET (Cache Hit)
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.cache.invalidate("/api/products") → cache entry removed',
          )
        }
      >
        Invalidate Cache
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'network.cache.stats() → { entries: 12, size: "48 KB", hitRate: "73.2%" }',
          )
        }
      >
        Cache Stats
      </button>

      <h3>Compression</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            "network.compress(payload) → gzip { original: 14280 bytes, compressed: 3412 bytes, ratio: 76.1%, time: 2.1ms }",
          )
        }
      >
        Gzip Compress
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "network.decompress(data) → inflated { compressed: 3412 bytes, original: 14280 bytes, time: 0.8ms }",
          )
        }
      >
        Gzip Decompress
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
