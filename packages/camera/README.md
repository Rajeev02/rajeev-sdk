# @rajeev02/camera

[![npm version](https://img.shields.io/npm/v/@rajeev02/camera.svg)](https://www.npmjs.com/package/@rajeev02/camera)
[![license](https://img.shields.io/npm/l/@rajeev02/camera.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Camera capture & photo editor** with HDR, 9 capture modes, 24 built-in filters, and a full editing suite — crop, adjust, text, stickers, drawing, and beauty mode.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **9 capture modes** — Photo, video, portrait, night, panorama, slow-mo, time-lapse, burst, document scan
- **24 built-in filters** — Categorized: Natural, Warm, Cool, B&W, Cinematic, Vintage — with real-time preview
- **Full photo editor** — Crop (free/square/16:9/4:3), adjust (brightness, contrast, saturation, etc.), rotate, flip
- **Text & stickers** — Add text overlays with fonts, colors, alignment. Add sticker packs.
- **Beauty mode** — Skin smoothing, face brightening, eye enhancement — subtle defaults
- **HDR & zoom** — Hardware HDR, digital zoom up to 10x, front/back camera switching
- **Event-driven** — Subscribe to capture events, recording progress, focus changes

## ⚠️ Important: Native Camera Library Required

This package provides the **camera state management, filter presets, and photo editing pipeline**. It does **NOT** directly access camera hardware or render a camera preview.

You need a native camera library to pair with:

| Environment | Recommended library |
| ----------- | ------------------- |
| Expo | [`expo-camera`](https://docs.expo.dev/versions/latest/sdk/camera/) |
| Bare React Native | [`react-native-vision-camera`](https://github.com/mrousavy/react-native-vision-camera) |
| Web | [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) |

**Permissions required:**
- **iOS:** Add `NSCameraUsageDescription` and `NSMicrophoneUsageDescription` to `Info.plist`
- **Android:** Add `CAMERA` and `RECORD_AUDIO` permissions to `AndroidManifest.xml`

**What this library provides:** Camera settings state machine, 24 photo filter presets, photo editor (crop/adjust/text/stickers/blur/frames), and edit history (undo/redo). Your native camera library handles the actual hardware interaction — this library manages everything around it.

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/camera
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Camera Capture

```typescript
import { CameraController } from "@rajeev02/camera";

const camera = new CameraController({
  facing: "back",
  flash: "auto",
  mode: "photo",
  hdr: true,
});

// Listen for capture events
camera.on((event) => {
  if (event.type === "media_captured") {
    console.log("Photo saved:", event.media.uri);
  }
});

// Switch to portrait mode and capture
camera.setMode("portrait");
camera.setZoom(1.5);
camera.capturePhoto();

// Video recording
camera.setMode("video");
camera.startRecording();
// ... later
camera.stopRecording(); // → triggers "recording_stopped" event
```

### Photo Editor

```typescript
import { PhotoEditorController, getBuiltInFilters } from "@rajeev02/camera";

const editor = new PhotoEditorController("file:///photo.jpg");

// Apply a filter
editor.applyFilter("golden_hour");

// Adjust
editor.setAdjustment("brightness", 15);
editor.setAdjustment("contrast", 10);
editor.setAdjustment("saturation", -5);

// Crop to 16:9
editor.setCropAspectRatio("16:9");

// Add text overlay
editor.addText({
  text: "Summer 2026 ☀️",
  fontFamily: "Helvetica",
  fontSize: 24,
  color: "#FFFFFF",
  bold: true,
  alignment: "center",
  position: { x: 0.5, y: 0.9 },
});

// Get edit state for export
const state = editor.getEditState();
```

### Filters

```typescript
import { getBuiltInFilters, getFiltersByCategory } from "@rajeev02/camera";

const allFilters = getBuiltInFilters(); // 24 filters
const warmFilters = getFiltersByCategory("warm");
// → ["golden_hour", "sunset_glow", "amber", "warm_vintage"]
```

## Available Filters

| Category  | Filters                                        |
| --------- | ---------------------------------------------- |
| Natural   | vivid, soft_light, clarity, natural_hdr        |
| Warm      | golden_hour, sunset_glow, amber, warm_vintage  |
| Cool      | arctic, ocean_blue, moonlight, cool_breeze     |
| B&W       | noir, silver, high_contrast_bw, film_grain     |
| Cinematic | teal_orange, blockbuster, moody, anamorphic    |
| Vintage   | polaroid, retro_80s, faded_film, cross_process |

## API Reference

### `CameraController`

| Method             | Description           |
| ------------------ | --------------------- |
| `capturePhoto()`   | Capture a photo       |
| `startRecording()` | Start video recording |
| `stopRecording()`  | Stop video recording  |
| `setMode(mode)`    | Set capture mode      |
| `setFlash(mode)`   | Set flash mode        |
| `setZoom(level)`   | Set zoom level        |
| `flipCamera()`     | Toggle front/back     |
| `on(callback)`     | Subscribe to events   |

### `PhotoEditorController`

| Method                       | Description                     |
| ---------------------------- | ------------------------------- |
| `applyFilter(id)`            | Apply a filter preset           |
| `setAdjustment(type, value)` | Adjust brightness/contrast/etc. |
| `setCropAspectRatio(ratio)`  | Set crop ratio                  |
| `addText(config)`            | Add text overlay                |
| `addSticker(config)`         | Add sticker                     |
| `rotate(degrees)`            | Rotate image                    |
| `flip(axis)`                 | Flip horizontal/vertical        |
| `undo()` / `redo()`          | Undo/redo edits                 |
| `getEditState()`             | Get full edit state             |

## Full Documentation

📖 [Complete API docs with all modes, filters, and editor features](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/CAMERA.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
