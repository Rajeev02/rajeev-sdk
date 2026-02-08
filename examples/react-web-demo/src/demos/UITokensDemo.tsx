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

const swatch = (color: string, label: string) => (
  <div
    key={label}
    style={{ display: "inline-flex", alignItems: "center", gap: 8, margin: 4 }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: color,
        border: "1px solid #ddd",
      }}
    />
    <span style={{ fontSize: 12 }}>
      {label}
      <br />
      <code style={{ fontSize: 11, color: "#888" }}>{color}</code>
    </span>
  </div>
);

export default function UITokensDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [dark, setDark] = useState(false);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🎨 UI Tokens</h2>
      <p style={{ color: "#666" }}>
        Design system tokens: colors, spacing, typography, and device detection.
      </p>

      <h3>Color Palette</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {swatch("#4F46E5", "Primary")}
        {swatch("#F59E0B", "Accent")}
        {swatch("#10B981", "Success")}
        {swatch("#EF4444", "Error")}
        {swatch("#F97316", "Warning")}
        {swatch("#1a1a2e", "Surface")}
        {swatch("#f5f5f5", "Background")}
      </div>
      <button
        style={btn}
        onClick={() =>
          append(
            'ui.tokens.colors → { primary: "#4F46E5", accent: "#F59E0B", success: "#10B981", error: "#EF4444", warning: "#F97316" }',
          )
        }
      >
        Get Colors
      </button>

      <h3>Spacing Scale</h3>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          margin: "8px 0",
        }}
      >
        {[4, 8, 12, 16, 24, 32, 48, 64].map((s) => (
          <div key={s} style={{ textAlign: "center" }}>
            <div
              style={{
                width: s,
                height: s,
                background: "#4F46E5",
                borderRadius: 2,
              }}
            />
            <div style={{ fontSize: 10, marginTop: 4 }}>{s}</div>
          </div>
        ))}
      </div>
      <button
        style={btn}
        onClick={() =>
          append(
            "ui.tokens.spacing → [4, 8, 12, 16, 24, 32, 48, 64] (8-point grid)",
          )
        }
      >
        Get Spacing
      </button>

      <h3>Typography Scale</h3>
      <button
        style={btn}
        onClick={() => {
          append("ui.tokens.typography →");
          append("  caption:  12px / 1.33 / 400");
          append("  body:     14px / 1.43 / 400");
          append("  subhead:  16px / 1.50 / 500");
          append("  title:    20px / 1.40 / 600");
          append("  headline: 28px / 1.29 / 700");
          append("  display:  36px / 1.22 / 700");
        }}
      >
        Get Typography
      </button>

      <h3>Device Detection</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'ui.device.detect() → { type: "desktop", width: ' +
              window.innerWidth +
              ", height: " +
              window.innerHeight +
              ", dpr: " +
              window.devicePixelRatio +
              ", touch: false }",
          )
        }
      >
        Detect Device
      </button>
      <button
        style={btn}
        onClick={() => append('ui.device.breakpoint() → "lg" (≥1024px)')}
      >
        Get Breakpoint
      </button>

      <h3>Theme</h3>
      <button
        style={{
          ...btn,
          background: dark ? "#fff" : "#1a1a2e",
          color: dark ? "#1a1a2e" : "#fff",
        }}
        onClick={() => {
          const next = !dark;
          setDark(next);
          append(
            `ui.theme.set("${next ? "dark" : "light"}") → theme switched to ${next ? "dark" : "light"}`,
          );
        }}
      >
        Toggle Theme ({dark ? "Dark" : "Light"})
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
