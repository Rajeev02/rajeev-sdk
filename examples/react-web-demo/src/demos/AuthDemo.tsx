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

export default function AuthDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🔑 Auth</h2>
      <p style={{ color: "#666" }}>
        Authentication with OTP, social providers, sessions, and Indian
        identity.
      </p>

      <h3>OTP Flow</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'auth.otp.send({ phone: "+91 98765 43210", channel: "sms" }) → OTP sent (6-digit, expires in 300s, hash: "a3f8…")',
          )
        }
      >
        Send OTP (+91 98765 43210)
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'auth.otp.verify({ phone: "+91 98765 43210", code: "847291" }) → ✅ verified { token: "eyJhbGci…", expiresIn: 3600 }',
          )
        }
      >
        Verify OTP (847291)
      </button>

      <h3>Session Management</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'auth.session.init() → session created { sid: "sess_Rj7k2nF…", userId: "usr_001", expiresAt: "2026-02-08T10:30:00Z" }',
          )
        }
      >
        Init Session
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'auth.state() → { authenticated: true, userId: "usr_001", provider: "phone", expiresIn: 3542 }',
          )
        }
      >
        Check Auth State
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'auth.session.refresh() → ✅ token refreshed { newExpiry: "2026-02-08T11:30:00Z", rotated: true }',
          )
        }
      >
        Refresh Token
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "auth.logout() → session destroyed, tokens cleared, redirect → /login",
          )
        }
      >
        Logout
      </button>

      <h3>Providers</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {[
          { name: "Phone", emoji: "📱" },
          { name: "Google", emoji: "🔵" },
          { name: "Apple", emoji: "🍎" },
          { name: "Aadhaar", emoji: "🆔" },
          { name: "DigiLocker", emoji: "📂" },
        ].map((p) => (
          <button
            key={p.name}
            style={btn}
            onClick={() =>
              append(
                `auth.provider("${p.name.toLowerCase()}").login() → ${p.emoji} ${p.name} OAuth flow initiated → redirect to provider…`,
              )
            }
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

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
