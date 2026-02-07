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

export default function EdgeAIDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🤖 Edge AI</h2>
      <p style={{ color: "#666" }}>
        On-device ML: OCR, document detection, PAN/Aadhaar validation, voice
        parsing.
      </p>

      <h3>OCR & Document Detection</h3>
      <button
        style={btn}
        onClick={() => {
          append(
            'edgeai.ocr.detect("aadhaar_front.jpg") → Aadhaar card detected',
          );
          append('  { type: "aadhaar", confidence: 0.97,');
          append(
            '    fields: { name: "Rajeev Joshi", dob: "15/08/1995", gender: "Male",',
          );
          append('    number: "XXXX XXXX 4321", address: "Mumbai, MH" },');
          append("    boundingBox: { x: 12, y: 8, w: 476, h: 302 } }");
        }}
      >
        Detect Aadhaar Card
      </button>
      <button
        style={btn}
        onClick={() => {
          append('edgeai.ocr.extract("pan_card.jpg") → PAN extracted');
          append(
            '  { type: "pan", number: "ABCDE1234F", name: "RAJEEV JOSHI",',
          );
          append('    dob: "15/08/1995", confidence: 0.99 }');
        }}
      >
        Extract PAN Number
      </button>

      <h3>Validation</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'edgeai.validate.pan("ABCDE1234F") → ✅ valid PAN { format: "AAAAA9999A", type: "Individual (P)", checksum: pass }',
          )
        }
      >
        Validate PAN
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'edgeai.validate.aadhaar("234567894321") → ✅ valid Aadhaar { verhoeff: pass, length: 12, masked: "XXXX XXXX 4321" }',
          )
        }
      >
        Validate Aadhaar
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'edgeai.validate.pan("INVALID123") → ❌ invalid PAN { reason: "format mismatch, expected AAAAA9999A" }',
          )
        }
      >
        Validate Invalid PAN
      </button>

      <h3>ML Pipeline</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'edgeai.pipeline.register("document_classifier", { format: "tflite", path: "models/doc_cls_v3.tflite", size: "4.2 MB" }) → model registered',
          )
        }
      >
        Register TFLite Model
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'edgeai.pipeline.load("document_classifier") → model loaded to GPU (warm-up: 120ms, ready)',
          )
        }
      >
        Load Model
      </button>

      <h3>Voice Intent</h3>
      <button
        style={btn}
        onClick={() => {
          append('edgeai.voice.parseIntent("pay 500 to Rajeev") →');
          append('  { intent: "payment", confidence: 0.94,');
          append(
            '    entities: { amount: 500, currency: "INR", recipient: "Rajeev" },',
          );
          append('    action: "upi_transfer", language: "en" }');
        }}
      >
        Parse "pay 500 to Rajeev"
      </button>
      <button
        style={btn}
        onClick={() => {
          append("edgeai.voice.languages() → 11 supported:");
          append("  Hindi, English, Tamil, Telugu, Kannada, Malayalam,");
          append("  Bengali, Marathi, Gujarati, Punjabi, Odia");
        }}
      >
        Show Languages (11)
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
