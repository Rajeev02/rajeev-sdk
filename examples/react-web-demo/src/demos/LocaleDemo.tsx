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

export default function LocaleDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🇮🇳 Locale</h2>
      <p style={{ color: "#666" }}>
        Indian localization with translations, currency formatting, and
        transliteration.
      </p>

      <h3>Translation</h3>
      <button
        style={btn}
        onClick={() => append('locale.t("welcome", "hi") → "स्वागत है"')}
      >
        Translate → Hindi
      </button>
      <button
        style={btn}
        onClick={() => append('locale.t("welcome", "ta") → "வரவேற்கிறோம்"')}
      >
        Translate → Tamil
      </button>
      <button
        style={btn}
        onClick={() => append('locale.t("welcome", "te") → "స్వాగతం"')}
      >
        Translate → Telugu
      </button>
      <button
        style={btn}
        onClick={() =>
          append('locale.t("checkout_summary", "hi") → "आपके ऑर्डर का सारांश"')
        }
      >
        Translate Checkout → Hindi
      </button>

      <h3>Currency Formatting</h3>
      <button
        style={btn}
        onClick={() => append('locale.formatINR(12345678) → "₹1,23,45,678.00"')}
      >
        Format ₹1.2Cr
      </button>
      <button
        style={btn}
        onClick={() => append('locale.formatINR(1234.5) → "₹1,234.50"')}
      >
        Format ₹1,234
      </button>
      <button
        style={btn}
        onClick={() => append('locale.formatINR(999999.99) → "₹9,99,999.99"')}
      >
        Format ₹9.99L
      </button>
      <button
        style={btn}
        onClick={() => append('locale.formatCompact(12345678) → "₹1.23 Cr"')}
      >
        Compact Format
      </button>

      <h3>Number Systems</h3>
      <button
        style={btn}
        onClick={() => append('locale.toDevanagari(1234567890) → "१२३४५६७८९०"')}
      >
        Devanagari Digits
      </button>
      <button
        style={btn}
        onClick={() => append('locale.toTamil(1234567890) → "௧௨௩௪௫௬௭௮௯௦"')}
      >
        Tamil Digits
      </button>

      <h3>Transliteration</h3>
      <button
        style={btn}
        onClick={() =>
          append('locale.transliterate("namaste", "Deva") → "नमस्ते"')
        }
      >
        Latin → Devanagari
      </button>
      <button
        style={btn}
        onClick={() =>
          append('locale.transliterate("vanakkam", "Taml") → "வணக்கம்"')
        }
      >
        Latin → Tamil
      </button>
      <button
        style={btn}
        onClick={() =>
          append('locale.transliterate("dhanyavaad", "Deva") → "धन्यवाद"')
        }
      >
        Latin → Devanagari (Thanks)
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'locale.detectScript("नमस्ते दुनिया") → "Devanagari" (confidence: 99.1%)',
          )
        }
      >
        Detect Script
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
