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

export default function DeepLinkDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🔗 Deep Link</h2>
      <p style={{ color: "#666" }}>
        Universal links, deep link routing, and deferred deep links.
      </p>

      <h3>Router</h3>
      <button
        style={btn}
        onClick={() => {
          append("deeplink.router.init() → router initialized with 19 routes:");
          append("  /home, /product/:id, /category/:slug, /cart, /checkout,");
          append("  /pay/:vpa, /orders, /order/:id, /profile, /settings,");
          append("  /search?q=, /offers, /refer/:code, /kyc, /support,");
          append("  /track/:id, /review/:productId, /wishlist, /notifications");
        }}
      >
        Init Router (19 Routes)
      </button>

      <h3>Handle Deep Links</h3>
      <button
        style={btn}
        onClick={() => {
          append('deeplink.handle("myapp://product/123") →');
          append('  matched: /product/:id → { id: "123" }');
          append("  navigate → ProductScreen(id=123)");
        }}
      >
        myapp://product/123
      </button>
      <button
        style={btn}
        onClick={() => {
          append('deeplink.handle("myapp://pay/rajeev@upi") →');
          append('  matched: /pay/:vpa → { vpa: "rajeev@upi" }');
          append('  navigate → PaymentScreen(vpa="rajeev@upi")');
        }}
      >
        myapp://pay/rajeev@upi
      </button>
      <button
        style={btn}
        onClick={() => {
          append('deeplink.handle("myapp://refer/SAVE20") →');
          append('  matched: /refer/:code → { code: "SAVE20" }');
          append(
            '  navigate → ReferralScreen(code="SAVE20"), coupon auto-applied',
          );
        }}
      >
        myapp://refer/SAVE20
      </button>

      <h3>Generate Links</h3>
      <button
        style={btn}
        onClick={() =>
          append('deeplink.generate("/product/123") → "myapp://product/123"')
        }
      >
        Generate App Link
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'deeplink.universal("/product/123") → "https://rajeev.app/product/123" (Apple AASA + Android assetlinks configured)',
          )
        }
      >
        Generate Universal Link
      </button>

      <h3>Deferred Deep Link</h3>
      <button
        style={btn}
        onClick={() => {
          append(
            "deeplink.deferred.check() → 🔍 checking for deferred deep link…",
          );
          append('  → found: "myapp://product/456?ref=instagram"');
          append("  → user was not installed, came from ad campaign");
          append(
            "  → navigate → ProductScreen(id=456), attribution: instagram",
          );
        }}
      >
        Check Deferred Deep Link
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
