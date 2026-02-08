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

export default function PaymentsDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>💳 Payments</h2>
      <p style={{ color: "#666" }}>
        UPI, card validation, wallets, and e-mandate for Indian payments.
      </p>

      <h3>UPI</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.upi.generateURI({ pa: "merchant@okicici", pn: "RajeevStore", am: "499.00", cu: "INR" }) → "upi://pay?pa=merchant@okicici&pn=RajeevStore&am=499.00&cu=INR&tn=Order%20%23RJ-4521"',
          )
        }
      >
        Generate UPI URI
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.upi.validateVPA("rajeev@okicici") → ✅ valid { name: "Rajeev Joshi", bank: "ICICI", ifsc: "ICIC0001234" }',
          )
        }
      >
        Validate VPA
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.upi.validateVPA("invalid@xyz") → ❌ invalid VPA (bank not registered)',
          )
        }
      >
        Validate Invalid VPA
      </button>

      <h3>Card Validation</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.card.detect("4111111111111111") → { network: "Visa", type: "credit", country: "IN", bank: "HDFC" }',
          )
        }
      >
        Detect 4111… → Visa
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.card.detect("6521801234567890") → { network: "RuPay", type: "debit", country: "IN", bank: "SBI" }',
          )
        }
      >
        Detect 6521… → RuPay
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.card.detect("5200828282828210") → { network: "Mastercard", type: "debit", country: "IN", bank: "Axis" }',
          )
        }
      >
        Detect 5200… → Mastercard
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.card.format("4111111111111111") → "4111 1111 1111 1111"',
          )
        }
      >
        Format Card
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.card.luhn("4111111111111111") → ✅ valid (Luhn checksum passed)',
          )
        }
      >
        Luhn Validate ✅
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.card.luhn("4111111111111112") → ❌ invalid (Luhn checksum failed)',
          )
        }
      >
        Luhn Validate ❌
      </button>

      <h3>Wallets</h3>
      <button
        style={btn}
        onClick={() => {
          append("payments.wallets.list() →");
          append("  📱 Paytm — linked (balance: ₹1,247)");
          append("  📱 PhonePe — linked (balance: ₹3,580)");
          append("  📱 GPay — not linked");
          append("  📱 Amazon Pay — linked (balance: ₹892)");
        }}
      >
        List Wallets
      </button>

      <h3>E-Mandate</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'payments.mandate.create({ amount: 999, frequency: "monthly", debitDay: 5, account: "rajeev@okicici" }) → mandate created { id: "mdt_Rj8k3…", status: "pending_auth", authDeadline: "48h" }',
          )
        }
      >
        Create Mandate
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
