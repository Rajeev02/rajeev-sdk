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

export default function VaultDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🔐 Vault</h2>
      <p style={{ color: "#666" }}>
        Encrypted key-value storage with namespaces, expiry, and hashing.
      </p>

      <h3>Initialization</h3>
      <button
        style={btn}
        onClick={() =>
          append("vault.init() → Vault ready (AES-256-GCM, keychain-backed)")
        }
      >
        Init Vault
      </button>

      <h3>Key-Value Operations</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'vault.set("auth_token", "eyJhbGci…") → stored (encrypted, 128 bytes)',
          )
        }
      >
        Set auth_token
      </button>
      <button
        style={btn}
        onClick={() =>
          append('vault.get("auth_token") → "eyJhbGci…" (decrypted in 0.3ms)')
        }
      >
        Get auth_token
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'vault.set("user_prefs", { theme: "dark", lang: "hi" }) → stored as JSON (64 bytes)',
          )
        }
      >
        Store JSON
      </button>
      <button
        style={btn}
        onClick={() =>
          append('vault.get("user_prefs") → { theme: "dark", lang: "hi" }')
        }
      >
        Get JSON
      </button>

      <h3>Namespaces</h3>
      <button
        style={btn}
        onClick={() =>
          append('vault.namespace("secure") → Namespace "secure" created')
        }
      >
        Create Namespace
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'vault.namespace("secure").set("pin", "1234") → stored in "secure" ns',
          )
        }
      >
        Set in Namespace
      </button>

      <h3>Hashing & Keys</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'vault.hash("password123") → "$argon2id$v=19$m=65536,t=3,p=4$…" (42ms)',
          )
        }
      >
        Hash Password
      </button>
      <button
        style={btn}
        onClick={() =>
          append('vault.verify("password123", "$argon2id$…") → ✅ Match')
        }
      >
        Verify Hash
      </button>
      <button
        style={btn}
        onClick={() =>
          append('vault.generateKey(256) → "a3f8c1d9e7b2…" (256-bit AES key)')
        }
      >
        Generate Key
      </button>

      <h3>Expiry & Management</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'vault.setWithExpiry("otp_session", "active", 300s) → stored, expires at ' +
              new Date(Date.now() + 300000).toLocaleTimeString(),
          )
        }
      >
        Set with 5min Expiry
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'vault.stats() → { keys: 5, namespaces: 2, totalSize: "4.2 KB", encrypted: true }',
          )
        }
      >
        Stats
      </button>
      <button
        style={btn}
        onClick={() => {
          append("vault.wipe() → ⚠️ All data destroyed (5 keys, 2 namespaces)");
        }}
      >
        Wipe All
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
