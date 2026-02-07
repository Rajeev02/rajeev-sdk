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

export default function CameraDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>📷 Camera</h2>
      <p style={{ color: "#666" }}>
        Camera controls, photo capture, video recording, filters, and editing.
      </p>

      <h3>Camera Controls</h3>
      <button
        style={btn}
        onClick={() =>
          append("camera.flip() → switched to front camera (1080p, f/2.2)")
        }
      >
        Flip Camera
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'camera.setMode("portrait") → portrait mode enabled (depth: 2.8, bokeh: on)',
          )
        }
      >
        Set Portrait Mode
      </button>
      <button
        style={btn}
        onClick={() =>
          append("camera.toggleHDR() → HDR enabled (multi-frame, 3 exposures)")
        }
      >
        Toggle HDR
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "camera.cycleFlash() → flash: auto → on → off → auto (current: on)",
          )
        }
      >
        Cycle Flash
      </button>

      <h3>Capture</h3>
      <button
        style={btn}
        onClick={() => {
          append("camera.capture() → 📸 photo captured");
          append(
            '  { width: 4032, height: 3024, format: "heif", size: "3.2 MB",',
          );
          append('    iso: 100, exposure: "1/120s", focalLength: "26mm",');
          append(
            '    gps: { lat: 19.0760, lng: 72.8777 }, timestamp: "' +
              new Date().toISOString() +
              '" }',
          );
        }}
      >
        Capture Photo
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "camera.video.start() → 🔴 recording started (1080p @ 30fps, h265, stabilization: on)",
          )
        }
      >
        Start Recording
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "camera.video.stop() → ⏹️ recording stopped (duration: 12.4s, size: 18.7 MB)",
          )
        }
      >
        Stop Recording
      </button>

      <h3>Filters & Editing</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'camera.filter.apply("Golden Hour") → filter applied { warmth: +35, saturation: +20, contrast: +10, vignette: 15% }',
          )
        }
      >
        Apply "Golden Hour"
      </button>
      <button
        style={btn}
        onClick={() =>
          append("camera.editor.brightness(+0.3) → brightness adjusted to +30%")
        }
      >
        Brightness +30%
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'camera.editor.addOverlay({ type: "text", value: "Rajeev SDK", position: "bottom-center", font: "bold 24px", color: "#fff" }) → text overlay added',
          )
        }
      >
        Add Text Overlay
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "camera.editor.undo() → ↩️ reverted last action (overlay removed)",
          )
        }
      >
        Undo
      </button>
      <button
        style={btn}
        onClick={() =>
          append("camera.editor.redo() → ↪️ restored action (overlay re-added)")
        }
      >
        Redo
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
