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

export default function DocumentDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>📄 Document</h2>
      <p style={{ color: "#666" }}>
        Document picker, PDF editor, signatures, and form filling.
      </p>

      <h3>Document Picker</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.pick({ type: "photo" }) → selected "IMG_2847.heic" (3.2 MB, 4032×3024)',
          )
        }
      >
        Pick Photo
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.pick({ type: "document" }) → selected "invoice_jan2026.pdf" (248 KB, 3 pages)',
          )
        }
      >
        Pick Document
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.pick({ type: "kyc", docType: "aadhaar" }) → selected "aadhaar_front.jpg" (1.1 MB, auto-cropped, orientation corrected)',
          )
        }
      >
        Pick KYC Document
      </button>

      <h3>PDF Editor</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.editor.open("contract_v2.pdf") → PDF loaded (10 pages, 1.8 MB, text-selectable)',
          )
        }
      >
        Open PDF (10 pages)
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.editor.highlight({ page: 3, text: "Total Amount: ₹1,49,999", color: "yellow" }) → text highlighted on page 3',
          )
        }
      >
        Add Highlight
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.editor.stamp({ page: 1, text: "APPROVED", position: "top-right", color: "#10B981", rotation: -15 }) → stamp added',
          )
        }
      >
        Stamp APPROVED
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.editor.addNote({ page: 5, position: { x: 200, y: 350 }, text: "Verify this clause with legal team" }) → sticky note added',
          )
        }
      >
        Add Text Note
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.editor.fillField({ fieldName: "applicant_name", value: "Rajeev Joshi" }) → form field filled',
          )
        }
      >
        Fill Form Field
      </button>

      <h3>Digital Signature</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'document.signature.create({ type: "typed", name: "Rajeev Joshi", font: "Dancing Script" }) → signature created (SVG, 320×80)',
          )
        }
      >
        Create Typed Signature
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "document.signature.place({ page: 10, position: { x: 350, y: 680 }, width: 200 }) → signature placed on page 10, bottom-right",
          )
        }
      >
        Place Signature
      </button>
      <button
        style={btn}
        onClick={() => {
          append("document.signature.generateRecord() →");
          append(
            '  { signer: "Rajeev Joshi", timestamp: "' +
              new Date().toISOString() +
              '",',
          );
          append('    hash: "sha256:a3f8c1d9e7b2…", ip: "103.21.x.x",');
          append('    certificate: "self-signed", pages: [10], valid: true }');
        }}
      >
        Generate Signing Record
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
