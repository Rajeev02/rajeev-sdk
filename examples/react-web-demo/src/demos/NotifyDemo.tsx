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

export default function NotifyDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🔔 Notify</h2>
      <p style={{ color: "#666" }}>
        Push notifications, local scheduling, quiet hours, and inbox management.
      </p>

      <h3>Schedule Notifications</h3>
      <button
        style={btn}
        onClick={() => {
          const t = new Date(Date.now() + 5 * 60000).toLocaleTimeString();
          append(
            `notify.schedule({ title: "Payment Due", body: "₹2,499 EMI reminder", delay: "5m" }) → scheduled for ${t}`,
          );
        }}
      >
        Schedule in 5min
      </button>
      <button
        style={btn}
        onClick={() => {
          const t = new Date(Date.now() + 60 * 60000).toLocaleTimeString();
          append(
            `notify.schedule({ title: "Flash Sale!", body: "50% off starts now", delay: "1h" }) → scheduled for ${t}`,
          );
        }}
      >
        Schedule in 1hr
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'notify.schedule({ title: "Daily Digest", body: "Your daily summary", delay: "tomorrow 9am" }) → scheduled for tomorrow 09:00',
          )
        }
      >
        Schedule Tomorrow
      </button>

      <h3>Quiet Hours</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'notify.quietHours.check() → { active: false, window: "22:00–07:00", current: "' +
              new Date().toLocaleTimeString() +
              '" }',
          )
        }
      >
        Check Quiet Hours
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'notify.quietHours.set({ start: "22:00", end: "07:00" }) → quiet hours configured',
          )
        }
      >
        Set 10PM – 7AM
      </button>

      <h3>Inbox</h3>
      <button
        style={btn}
        onClick={() => {
          append("notify.inbox.list() →");
          append(
            "  📦 [unread] Order Shipped — Your order #RJ-4521 has been shipped (2h ago)",
          );
          append(
            "  💳 [unread] Payment Received — ₹1,299 credited to wallet (5h ago)",
          );
          append(
            "  🎉 [read]   Welcome! — Thanks for joining Rajeev SDK (1d ago)",
          );
        }}
      >
        Show Inbox (3)
      </button>
      <button
        style={btn}
        onClick={() =>
          append('notify.inbox.markRead("msg-001") → ✅ marked as read')
        }
      >
        Mark Read
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "notify.inbox.markAllRead() → ✅ 2 notifications marked as read",
          )
        }
      >
        Mark All Read
      </button>
      <button
        style={btn}
        onClick={() =>
          append("notify.inbox.clear() → 🗑️ 3 notifications cleared")
        }
      >
        Clear Inbox
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'notify.token() → "fcm_dKj3n8Fh2kL9…" (FCM registration token)',
          )
        }
      >
        Get Push Token
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
