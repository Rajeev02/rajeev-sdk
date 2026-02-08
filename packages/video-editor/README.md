# @rajeev02/video-editor

[![npm version](https://img.shields.io/npm/v/@rajeev02/video-editor.svg)](https://www.npmjs.com/package/@rajeev02/video-editor)
[![license](https://img.shields.io/npm/l/@rajeev02/video-editor.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Video editor** with multi-track timeline, transitions, color grading, chroma key, speed ramps, and export presets for Instagram/YouTube/WhatsApp.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Multi-track timeline** — Video, audio, text, and sticker tracks with precise positioning
- **Transitions** — Crossfade, slide, zoom, wipe, dissolve, rotate between clips
- **Color grading** — 10+ filter presets (cinematic, vintage, warm, cool) plus custom LUT support
- **Speed control** — Constant speed (0.25x–4x) and speed ramps with ease curves
- **Chroma key** — Green/blue screen removal with tolerance and edge smoothing
- **Export presets** — Instagram Reels (9:16), YouTube (16:9), WhatsApp Status, TikTok, Twitter — all pre-configured
- **Text & stickers** — Animated text overlays, sticker tracks with timing

## ⚠️ Important: Video Processing Engine Required

This library provides the **timeline data model, editing state management, and export configuration**. It does **NOT** render video, apply GPU filters, or encode output files.

You need a native video processing engine:

| Platform | Recommended engine |
| -------- | ------------------ |
| iOS | AVFoundation / AVComposition |
| Android | MediaCodec / ExoPlayer |
| Cross-platform | [`ffmpeg-kit`](https://github.com/arthenica/ffmpeg-kit) (FFmpeg wrapper for RN) |
| Web | [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) |

**How it works:** This library manages the editing state (timeline clips, transitions, effects, text overlays) as a data model. Your rendering engine reads this state to produce the actual video output.

```
┌────────────────────────────────────────────────────────────┐
│  Your UI   →   @rajeev02/video-editor   →   FFmpeg/Native  │
│  (timeline)    (state management)         (actual render) │
└────────────────────────────────────────────────────────────┘
```

**What this library provides:** Multi-track timeline, clip trim/split, transition configuration, color grading presets, chroma key parameters, speed ramp keyframes, export presets (Instagram/YouTube/TikTok/WhatsApp), and undo/redo history.

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/video-editor
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Timeline

```typescript
import { VideoTimeline } from "@rajeev02/video-editor";

const timeline = new VideoTimeline();

// Add video clips
const clip1 = timeline.addVideoClip({
  sourceUri: "video1.mp4",
  sourceStartMs: 0,
  sourceEndMs: 5000,
  durationMs: 5000,
  speed: 1,
  volume: 1,
});

// Split a clip
const clip2 = timeline.splitClip(clip1, 2500);

// Add transition between clips
timeline.addTransition(clip1, clip2, "crossfade", 500);

// Add audio track
timeline.addAudioClip({
  sourceUri: "bg-music.mp3",
  timelineStartMs: 0,
  durationMs: 10000,
  volume: 0.5,
  fadeInMs: 1000,
  fadeOutMs: 1000,
});

// Add text overlay
timeline.addTextClip({
  text: "Summer 2026",
  fontFamily: "Helvetica",
  fontSize: 32,
  color: "#FFFFFF",
  position: { x: 0.5, y: 0.1 },
  startMs: 0,
  durationMs: 3000,
  animation: "fade_in",
});

// Get timeline state
const state = timeline.getState();
```

### Export

```typescript
import { ExportController, getExportPresets } from "@rajeev02/video-editor";

// See all available presets
const presets = getExportPresets();
// → ["instagram_reels", "youtube_1080p", "youtube_4k", "whatsapp_status", "tiktok", "twitter"]

// Export for Instagram Reels
const exporter = new ExportController({
  format: "mp4",
  codec: "h264",
  quality: "high",
  resolution: { width: 1080, height: 1920 }, // 9:16
  fps: 30,
  videoBitrate: 8_000_000,
  audioBitrate: 192_000,
});

exporter.onProgress((p) => {
  console.log(`${p.percent}% — ETA: ${p.estimatedTimeRemainingMs}ms`);
});

exporter.startExport();
```

### Color Grading & Effects

```typescript
import { getVideoFilterPresets } from "@rajeev02/video-editor";

const filters = getVideoFilterPresets();
// → ["cinematic", "vintage", "warm_sunset", "cool_blue", "noir", "vivid", ...]

// Apply to a clip
timeline.applyFilter(clip1, "cinematic");

// Chroma key (green screen)
timeline.applyChromaKey(clip1, {
  color: "#00FF00",
  tolerance: 0.3,
  edgeSmoothing: 0.1,
});

// Speed ramp
timeline.applySpeedRamp(clip1, [
  { timeMs: 0, speed: 1 },
  { timeMs: 1000, speed: 0.25 }, // Slow-mo
  { timeMs: 2000, speed: 2 }, // Speed up
  { timeMs: 3000, speed: 1 }, // Normal
]);
```

## Transition Types

| Transition                   | Description          |
| ---------------------------- | -------------------- |
| `crossfade`                  | Smooth opacity blend |
| `slide_left` / `slide_right` | Slide in from side   |
| `zoom_in` / `zoom_out`       | Zoom transition      |
| `wipe_left` / `wipe_right`   | Wipe reveal          |
| `dissolve`                   | Pixel dissolve       |
| `rotate`                     | Rotation transition  |

## Export Presets

| Preset          | Resolution       | FPS | Bitrate |
| --------------- | ---------------- | --- | ------- |
| Instagram Reels | 1080×1920 (9:16) | 30  | 8 Mbps  |
| YouTube 1080p   | 1920×1080 (16:9) | 30  | 8 Mbps  |
| YouTube 4K      | 3840×2160 (16:9) | 30  | 35 Mbps |
| WhatsApp Status | 720×1280 (9:16)  | 30  | 3 Mbps  |
| TikTok          | 1080×1920 (9:16) | 30  | 6 Mbps  |
| Twitter         | 1280×720 (16:9)  | 30  | 5 Mbps  |

## API Reference

### `VideoTimeline`

| Method                                          | Description             |
| ----------------------------------------------- | ----------------------- |
| `addVideoClip(config)`                          | Add video to timeline   |
| `addAudioClip(config)`                          | Add audio track         |
| `addTextClip(config)`                           | Add text overlay        |
| `splitClip(clipId, timeMs)`                     | Split clip at position  |
| `addTransition(clip1, clip2, type, durationMs)` | Add transition          |
| `applyFilter(clipId, filterId)`                 | Apply color filter      |
| `applyChromaKey(clipId, config)`                | Apply green screen      |
| `applySpeedRamp(clipId, keyframes)`             | Apply speed ramp        |
| `removeClip(clipId)`                            | Remove a clip           |
| `getState()`                                    | Get full timeline state |
| `undo()` / `redo()`                             | Undo/redo edits         |

### `ExportController`

| Method                 | Description               |
| ---------------------- | ------------------------- |
| `startExport()`        | Begin export              |
| `cancelExport()`       | Cancel in-progress export |
| `onProgress(callback)` | Track export progress     |

## Full Documentation

📖 [Complete API docs with all effects and export options](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/VIDEO-EDITOR.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
