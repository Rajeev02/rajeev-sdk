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

export default function VideoEditorDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>🎬 Video Editor</h2>
      <p style={{ color: "#666" }}>
        Multi-track timeline, transitions, color grading, speed ramping, and
        export.
      </p>

      <h3>Timeline</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'videoEditor.timeline.addClip({ source: "clip_001.mp4", duration: 8.4 }) → clip added to track V1 [0:00–0:08.4]',
          )
        }
      >
        Add Video Clip
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'videoEditor.timeline.addAudio({ source: "bgm_lofi.mp3", duration: 45.0 }) → audio added to track A1 [0:00–0:45.0]',
          )
        }
      >
        Add Audio Track
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'videoEditor.timeline.split({ track: "V1", at: 4.2 }) → clip split at 0:04.2 → [clip_001a: 0:00–0:04.2, clip_001b: 0:04.2–0:08.4]',
          )
        }
      >
        Split Clip at 4.2s
      </button>

      <h3>Transitions & Effects</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'videoEditor.transition.add({ type: "crossfade", between: ["clip_001a", "clip_001b"], duration: 0.8 }) → crossfade transition added (800ms)',
          )
        }
      >
        Add Crossfade
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'videoEditor.color.apply("Teal & Orange") → LUT applied { shadows: teal(#008080), highlights: orange(#FF8C00), intensity: 0.7 }',
          )
        }
      >
        Apply Teal & Orange
      </button>
      <button
        style={btn}
        onClick={() => {
          append('videoEditor.speed.ramp({ clip: "clip_001b", keyframes: [');
          append("  { time: 0.0, speed: 1.0 },");
          append("  { time: 1.5, speed: 0.25 },  // slow-mo");
          append("  { time: 3.0, speed: 2.0 },   // speed up");
          append("  { time: 4.2, speed: 1.0 }");
          append("] }) → speed ramp applied (new duration: 5.1s)");
        }}
      >
        Speed Ramp
      </button>

      <h3>Export</h3>
      <button
        style={btn}
        onClick={() => {
          append("videoEditor.export.presets() →");
          append("  📱 Instagram Reel — 1080×1920, 30fps, H.264, ~15 MB");
          append("  📱 YouTube Shorts — 1080×1920, 60fps, H.264, ~22 MB");
          append("  🖥️ YouTube HD — 1920×1080, 30fps, H.264, ~45 MB");
          append("  🖥️ YouTube 4K — 3840×2160, 30fps, H.265, ~120 MB");
          append("  📤 WhatsApp — 720×1280, 30fps, H.264, ~8 MB");
        }}
      >
        Show Export Presets
      </button>
      <button
        style={btn}
        onClick={() => {
          append(
            'videoEditor.export.start({ preset: "YouTube HD" }) → exporting…',
          );
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            if (progress >= 100) {
              clearInterval(interval);
              append(
                '  ✅ export complete → "output_final.mp4" (42.3 MB, 0:08.4, 1920×1080)',
              );
            } else {
              append(
                `  ⏳ encoding… ${progress}% (pass 1/2, frame ${progress * 2.5}/252)`,
              );
            }
          }, 400);
        }}
      >
        Start Export
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
