# @rajeev02/video-editor

**Video editor** with multi-track timeline, transitions, color grading, chroma key, speed ramps, and export presets for Instagram/YouTube/WhatsApp.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | ES module                  |
| watchOS 9+          | TypeScript | React Native module        |
| Wear OS             | TypeScript | React Native module        |
| Android Auto        | TypeScript | React Native module        |

---

## Prerequisites

> **⚠️ This library provides the timeline data model, editing state management, and export configuration.** It does NOT render video, apply GPU filters, or encode output files.

Before using `@rajeev02/video-editor`, you need a **native video processing engine:**

| Platform | Recommended engine |
| -------- | ------------------ |
| iOS | AVFoundation / AVComposition |
| Android | MediaCodec / ExoPlayer |
| Cross-platform | [`ffmpeg-kit`](https://github.com/arthenica/ffmpeg-kit) (FFmpeg for React Native) |
| Web | [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) |

This library manages the editing state (clips, transitions, effects, text) as a data model. Your rendering engine reads this state to produce the actual video output.

---

## Installation

```bash
npm install @rajeev02/video-editor
```

### Peer Dependencies

| Package        | Version                 |
| -------------- | ----------------------- |
| `react`        | `>=18.3.0`              |
| `react-native` | `>=0.84.0`              |
| `expo`         | `>=54.0.0` _(optional)_ |

---

## Quick Start

```typescript
import {
  VideoTimeline,
  ExportController,
  getVideoFilterPresets,
  getTransitionTypes,
  getExportPresets,
} from "@rajeev02/video-editor";

// Create timeline
const timeline = new VideoTimeline();

// Add clips
const clip1 = timeline.addVideoClip({
  sourceUri: "video1.mp4",
  sourceStartMs: 0,
  sourceEndMs: 5000,
  durationMs: 5000,
  speed: 1,
  muted: false,
  volume: 1,
});

// Split and add transition
const clip2 = timeline.splitClip(clip1, 2500);
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

// Export
const exporter = new ExportController({
  format: "mp4",
  codec: "h264",
  quality: "high",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  videoBitrate: 8_000_000,
  audioBitrate: 192_000,
});

exporter.onProgress((p) => console.log(`${p.percent}%`));
exporter.startExport();
```

---

## API Reference

### `VideoTimeline`

Multi-track timeline with video, audio, text, and sticker clips.

```typescript
new VideoTimeline();
```

#### Clip Management

| Method                 | Returns  | Description                            |
| ---------------------- | -------- | -------------------------------------- |
| `addVideoClip(clip)`   | `string` | Add video clip, returns clip ID        |
| `addAudioClip(clip)`   | `string` | Add audio clip, returns clip ID        |
| `addTextClip(clip)`    | `string` | Add text overlay clip, returns clip ID |
| `addStickerClip(clip)` | `string` | Add sticker clip, returns clip ID      |
| `removeClip(clipId)`   | `void`   | Remove clip by ID                      |

#### Editing

| Method                             | Returns  | Description                             |
| ---------------------------------- | -------- | --------------------------------------- |
| `trimClip(clipId, startMs, endMs)` | `void`   | Adjust clip in/out points               |
| `splitClip(clipId, atTimeMs)`      | `string` | Split clip at time, returns new clip ID |
| `reorderClip(clipId, newIndex)`    | `void`   | Move clip to new position               |
| `setClipSpeed(clipId, speed)`      | `void`   | Set speed (0.1x–8x)                     |

#### Transitions

| Method                                          | Description                  |
| ----------------------------------------------- | ---------------------------- |
| `addTransition(fromId, toId, type, durationMs)` | Add transition between clips |

#### Playback

| Method               | Returns  | Description                   |
| -------------------- | -------- | ----------------------------- |
| `getTotalDuration()` | `number` | Total timeline duration in ms |
| `seek(timeMs)`       | `void`   | Seek to time                  |
| `getCurrentTime()`   | `number` | Get current playhead time     |

#### Queries

| Method              | Returns             |
| ------------------- | ------------------- |
| `getVideoClips()`   | `VideoClipItem[]`   |
| `getAudioClips()`   | `AudioClipItem[]`   |
| `getTextClips()`    | `TextClipItem[]`    |
| `getStickerClips()` | `StickerClipItem[]` |
| `getTransitions()`  | `TransitionItem[]`  |
| `on(listener)`      | `() => void`        |

---

### `ExportController`

```typescript
new ExportController(config: ExportConfig)
```

#### Methods

| Method                                | Returns          | Description                   |
| ------------------------------------- | ---------------- | ----------------------------- |
| `startExport()`                       | `void`           | Begin rendering               |
| `updateProgress(frame, total, bytes)` | `void`           | Update render progress        |
| `onComplete(result)`                  | `void`           | Mark export complete          |
| `cancel()`                            | `void`           | Cancel export                 |
| `estimateFileSize(durationMs)`        | `number`         | Estimate output size in bytes |
| `getConfig()`                         | `ExportConfig`   | Get export configuration      |
| `getProgress()`                       | `ExportProgress` | Get current progress          |
| `getState()`                          | `ExportState`    | Get current state             |
| `onProgress(listener)`                | `() => void`     | Subscribe to progress updates |

---

### Preset Functions

#### `getVideoFilterPresets()`

Returns 12 filter presets:

| Filter        | Description                   |
| ------------- | ----------------------------- |
| Original      | No color grading              |
| Cinematic     | Warm shadows, cool highlights |
| Teal & Orange | Film-look color grade         |
| Vintage Film  | Faded warm tones              |
| B&W Film      | Classic black & white         |
| VHS Retro     | VHS tape aesthetic            |
| Neon Night    | Boosted neon colors           |
| Golden Hour   | Warm golden tones             |
| Moody         | Dark desaturated look         |
| Pastel        | Soft pastel colors            |
| High Contrast | Bold punchy colors            |
| Film Noir     | Dark dramatic B&W             |

#### `getTransitionTypes()`

Returns 14 transition types: Crossfade, Dissolve, Slide Left/Right/Up/Down, Zoom In/Out, Wipe, Spin, Blur, Glitch, Fade to Black, Fade to White.

#### `getExportPresets()`

| Preset          | Resolution | FPS | Use Case              |
| --------------- | ---------- | --- | --------------------- |
| Instagram Story | 1080×1920  | 30  | 9:16 vertical stories |
| Reels/Shorts    | 1080×1920  | 30  | Short-form video      |
| Social Post     | 1080×1080  | 30  | Square posts          |
| YouTube 1080p   | 1920×1080  | 30  | Standard HD           |
| YouTube 4K      | 3840×2160  | 30  | Ultra HD              |
| WhatsApp Share  | 848×480    | 24  | Compressed sharing    |
| GIF             | 480×480    | 15  | Animated GIF          |

---

## Types

```typescript
type ExportFormat = "mp4" | "mov" | "webm" | "gif";
type ExportQuality = "draft" | "standard" | "high" | "ultra";
type ExportState =
  | "idle"
  | "preparing"
  | "rendering"
  | "encoding"
  | "completed"
  | "failed"
  | "cancelled";
type TextAnimation =
  | "fade_in"
  | "typewriter"
  | "bounce"
  | "zoom_in"
  | "slide_in_left"
  | "slide_in_right"
  | "slide_in_up"
  | "glitch";
type TransitionType =
  | "crossfade"
  | "dissolve"
  | "slide_left"
  | "slide_right"
  | "slide_up"
  | "slide_down"
  | "zoom_in"
  | "zoom_out"
  | "wipe"
  | "spin"
  | "blur"
  | "glitch"
  | "fade_to_black"
  | "fade_to_white";
type VideoEffect =
  | "color_grade"
  | "speed_ramp"
  | "reverse"
  | "ken_burns"
  | "chroma_key"
  | "vhs"
  | "glitch"
  | "film_grain";

interface VideoClip {
  sourceUri: string;
  sourceStartMs: number;
  sourceEndMs: number;
  timelineStartMs?: number;
  durationMs: number;
  speed: number;
  muted: boolean;
  volume: number;
}

interface AudioClip {
  sourceUri: string;
  title?: string;
  timelineStartMs: number;
  durationMs: number;
  volume: number;
  fadeInMs: number;
  fadeOutMs: number;
}

interface TextClip {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number };
  animation: TextAnimation;
  durationMs: number;
  timelineStartMs: number;
}

interface ExportConfig {
  format: ExportFormat;
  codec: string;
  quality: ExportQuality;
  resolution: { width: number; height: number };
  fps: number;
  videoBitrate: number;
  audioBitrate: number;
  watermark?: { imageUri: string; position: string; opacity: number };
  outputFilename?: string;
}

interface ColorGrade {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
  vibrance: number;
}

interface SpeedRamp {
  keyframes: Array<{ timeMs: number; speed: number }>;
  smooth: boolean;
}

interface ChromaKeyConfig {
  keyColor: string;
  similarity: number;
  smoothness: number;
  spillSuppression: number;
  backgroundUri?: string;
}
```
