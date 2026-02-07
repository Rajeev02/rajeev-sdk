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

export default function AppShellDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🏗️ App Shell</h2>
      <p style={{ color: "#666" }}>
        Full app framework: API client, onboarding, chat, cart, forms,
        analytics, and feature flags.
      </p>

      <h3>API Client</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.api.create({ baseURL: "https://api.rajeev.app/v1", timeout: 10000, retry: 3 }) → API client ready',
          )
        }
      >
        Create API Client
      </button>
      <button
        style={btn}
        onClick={() => {
          append('appShell.api.get("/products") →');
          append("  200 OK (cache: HIT, age: 45s, 12 products)");
          append(
            '  [{ id: 1, name: "iPhone 16", price: 79999 }, { id: 2, name: "AirPods Pro", price: 24999 }, …]',
          );
        }}
      >
        GET /products (Cached)
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.api.post("/orders", { items: [1, 2], total: 104998 }) → 201 Created { orderId: "RJ-4521", status: "confirmed" }',
          )
        }
      >
        POST /orders
      </button>

      <h3>Onboarding</h3>
      <button
        style={btn}
        onClick={() => {
          append("appShell.onboarding.start() → onboarding flow (4 slides):");
          append("  1️⃣  Welcome to Rajeev SDK");
          append("  2️⃣  Secure Payments with UPI");
          append("  3️⃣  Works Offline, Syncs Later");
          append("  4️⃣  Available in 11 Indian Languages");
          append("  → showing slide 1/4");
        }}
      >
        Start Onboarding (4 Slides)
      </button>

      <h3>Chat</h3>
      <button
        style={btn}
        onClick={() => {
          append(
            'appShell.chat.send({ to: "support", message: "My order #RJ-4521 is delayed" }) →',
          );
          append('  ✅ sent (id: "msg_082", delivered: true)');
          append('  🤖 auto-reply: "Hi! Let me check your order status…"');
        }}
      >
        Send Chat Message
      </button>

      <h3>Cart</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.cart.add({ id: 1, name: "iPhone 16", price: 79999, qty: 1 }) → added (cart: 1 item, ₹79,999)',
          )
        }
      >
        Add iPhone ₹79,999
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.cart.add({ id: 2, name: "AirPods Pro", price: 24999, qty: 1 }) → added (cart: 2 items, ₹1,04,998)',
          )
        }
      >
        Add AirPods ₹24,999
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.cart.applyCoupon("SAVE10") → ✅ coupon applied (10% off, discount: ₹10,499.80)',
          )
        }
      >
        Apply Coupon SAVE10
      </button>
      <button
        style={btn}
        onClick={() => {
          append("appShell.cart.summary() →");
          append("  Subtotal:     ₹1,04,998.00");
          append("  Discount:    -₹10,499.80 (SAVE10)");
          append("  GST (18%):    ₹17,009.68");
          append("  ─────────────────────");
          append("  Total:        ₹1,11,507.88");
        }}
      >
        Show Cart Summary
      </button>

      <h3>Feature Flags & Validation</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.flags.check("dark_mode_v2") → { enabled: true, variant: "B", rollout: 45% }',
          )
        }
      >
        Check Feature Flag
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.validate.aadhaar("234567894321") → ✅ valid (Verhoeff checksum passed)',
          )
        }
      >
        Validate Aadhaar
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.validate.pan("ABCDE1234F") → ✅ valid (format: Individual)',
          )
        }
      >
        Validate PAN
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.validate.ifsc("ICIC0001234") → ✅ valid { bank: "ICICI Bank", branch: "Andheri West", city: "Mumbai" }',
          )
        }
      >
        Validate IFSC
      </button>

      <h3>Analytics</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.analytics.track("page_view", { screen: "ProductDetail", productId: 1 }) → event queued (batch: 3/10)',
          )
        }
      >
        Track Page View
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'appShell.analytics.track("purchase", { orderId: "RJ-4521", amount: 111507.88, items: 2 }) → event queued (batch: 4/10)',
          )
        }
      >
        Track Purchase
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
