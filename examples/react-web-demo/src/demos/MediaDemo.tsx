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

export default function MediaDemo() {
  const [log, setLog] = useState<string[]>([]);
  const ts = () => new Date().toLocaleTimeString();
  const append = (msg: string) => setLog((p) => [...p, `[${ts()}] ${msg}`]);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ margin: 0 }}>▶️ Media</h2>
      <p style={{ color: "#666" }}>
        HLS/DASH player, adaptive quality, PiP, DRM, and offline downloads.
      </p>

      <h3>Playback</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'media.load("https://cdn.rajeev.app/video/demo.m3u8") → HLS manifest loaded { duration: 124.5s, qualities: 4, drm: "widevine" }',
          )
        }
      >
        Load HLS Video
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "media.play() → ▶️ playing (720p, bitrate: 2.8 Mbps, buffer: 12.4s)",
          )
        }
      >
        Play
      </button>
      <button
        style={btn}
        onClick={() => append("media.pause() → ⏸️ paused at 00:32.7")}
      >
        Pause
      </button>
      <button
        style={btn}
        onClick={() =>
          append("media.seek(60) → seeked to 01:00.0 (buffer refill: 340ms)")
        }
      >
        Seek to 1:00
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            "media.setRate(1.5) → playback rate: 1.5× (pitch correction: on)",
          )
        }
      >
        Rate 1.5×
      </button>

      <h3>Quality</h3>
      <button
        style={btn}
        onClick={() => {
          append("media.qualities() →");
          append("  360p  — 800 kbps  (mobile)");
          append("  480p  — 1.4 Mbps  (standard)");
          append("  720p  — 2.8 Mbps  (HD) ← current");
          append("  1080p — 5.2 Mbps  (Full HD)");
        }}
      >
        Show Qualities
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'media.setQuality("1080p") → switched to 1080p (5.2 Mbps, seamless ABR transition)',
          )
        }
      >
        Switch to 1080p
      </button>

      <h3>Picture-in-Picture & DRM</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            "media.pip.enter() → 📺 PiP mode active (320×180, corner: bottom-right)",
          )
        }
      >
        Enter PiP
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'media.drm.check() → { widevine: "L1", fairplay: "supported", clearkey: true, hdcp: "2.2" }',
          )
        }
      >
        Check DRM
      </button>

      <h3>Offline Download</h3>
      <button
        style={btn}
        onClick={() =>
          append(
            'media.download.enqueue({ url: "…/demo.m3u8", quality: "720p" }) → download queued { estimatedSize: "210 MB", id: "dl_001" }',
          )
        }
      >
        Enqueue Download
      </button>
      <button
        style={btn}
        onClick={() =>
          append(
            'media.download.progress("dl_001") → { progress: 34.2%, downloaded: "71.8 MB", speed: "4.2 MB/s", eta: "33s" }',
          )
        }
      >
        Check Progress
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
