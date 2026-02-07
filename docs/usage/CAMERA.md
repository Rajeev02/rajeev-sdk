# @rajeev02/camera

**Camera capture & photo editor** with HDR, 9 capture modes, 24 built-in filters, and a full editing suite.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | React Native / Expo module |
| watchOS 9+          | TypeScript | React Native / Expo module |
| Wear OS             | TypeScript | React Native / Expo module |
| Android Auto        | TypeScript | React Native / Expo module |

---

## Installation

```bash
npm install @rajeev02/camera
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
  CameraController,
  PhotoEditorController,
  getBuiltInFilters,
  getFiltersByCategory,
} from "@rajeev02/camera";

// 1. Create a camera controller
const camera = new CameraController({
  facing: "back",
  flash: "auto",
  mode: "photo",
  hdr: true,
});

// 2. Listen to camera events
const unsubscribe = camera.on((event) => {
  switch (event.type) {
    case "media_captured":
      console.log("Captured:", event.media.uri);
      break;
    case "recording_stopped":
      console.log("Video duration:", event.durationMs, "ms");
      break;
  }
});

// 3. Set portrait mode and capture
camera.setMode("portrait");
camera.setZoom(1.5);
const photoId = camera.capturePhoto();

// 4. Open the photo editor
const editor = new PhotoEditorController("file:///captured_photo.jpg");

// 5. Apply a filter
const filters = getBuiltInFilters();
editor.applyFilter("golden_hour");

// 6. Adjust brightness and contrast
editor.setAdjustment("brightness", 15);
editor.setAdjustment("contrast", 10);

// 7. Add a text overlay
editor.addText({
  text: "Hello from Rajeev SDK!",
  fontFamily: "Helvetica",
  fontSize: 24,
  color: "#FFFFFF",
  bold: true,
  italic: false,
  underline: false,
  alignment: "center",
  rotation: 0,
  position: { x: 0.5, y: 0.9 },
  opacity: 100,
});

// 8. Get the full edit state for export
const state = editor.getEditState();
```

---

## API Reference

### `CameraController` (class)

Full camera abstraction managing state, capture, and settings with event-driven architecture.

#### `new CameraController(config?: Partial<CameraConfig>)`

Create a camera controller with optional config overrides. Unspecified values use sensible defaults.

```typescript
const camera = new CameraController({
  facing: "back", // default
  flash: "auto", // default
  mode: "photo", // default
  aspectRatio: "4:3", // default
  grid: "rule_of_thirds", // default
  hdr: false, // default
  stabilization: true, // default
  timerSeconds: 0, // default
  zoom: 1.0, // default
  photoQuality: 90, // default (0-100)
  videoResolution: "1080p", // default
  videoFps: 30, // default
  beautyMode: false, // default
  beautyIntensity: 50, // default (0-100)
  mirrorFrontCamera: true, // default
  shutterSound: true, // default
  geoTag: false, // default
});
```

#### `camera.flipCamera(): void`

Switch between front and back camera. Emits `camera_flipped` event.

#### `camera.setMode(mode: CaptureMode): void`

Set the capture mode. Emits `mode_changed` event.

```typescript
camera.setMode("portrait"); // Depth-of-field bokeh
camera.setMode("night"); // Night mode (longer exposure)
camera.setMode("panorama"); // Panoramic capture
camera.setMode("document"); // Document scanning
camera.setMode("burst"); // Burst shot
camera.setMode("slow_motion"); // Slow-motion video
camera.setMode("timelapse"); // Timelapse video
```

#### `camera.setFlash(mode: FlashMode): void`

Set flash mode: `"off"`, `"on"`, `"auto"`, or `"torch"`.

#### `camera.cycleFlash(): FlashMode`

Cycle flash mode: off → on → auto → off. Returns the new mode.

#### `camera.setZoom(zoom: number): void`

Set zoom level. Clamped between `1.0` and `maxZoom`.

```typescript
camera.setZoom(2.5); // 2.5x zoom
```

#### `camera.setFocusPoint(point: FocusPoint): void`

Set tap-to-focus point (normalized 0–1 coordinates). Emits `focus_set` event.

```typescript
camera.setFocusPoint({ x: 0.5, y: 0.5, autoExposure: true });
```

#### `camera.setAspectRatio(ratio: AspectRatio): void`

Set aspect ratio: `"1:1"`, `"4:3"`, `"16:9"`, `"3:2"`, or `"full"`.

#### `camera.setGrid(grid: GridType): void`

Set grid overlay: `"none"`, `"rule_of_thirds"`, `"golden_ratio"`, `"square"`, or `"crosshair"`.

#### `camera.toggleHdr(): boolean`

Toggle HDR mode. Returns the new HDR state.

#### `camera.toggleBeautyMode(): boolean`

Toggle beauty/face enhancement mode. Returns the new state.

#### `camera.setBeautyIntensity(intensity: number): void`

Set beauty mode intensity (0–100).

#### `camera.setTimer(seconds: number): void`

Set capture timer delay in seconds. Use `0` to disable.

#### `camera.cycleTimer(): number`

Cycle timer: 0 → 3 → 5 → 10 → 0. Returns the new delay.

#### `camera.capturePhoto(): string`

Capture a photo. Returns a capture ID. The native layer delivers the result via the `media_captured` event.

#### `camera.startRecording(): void`

Start video recording. Emits `recording_started` event. No-op if already recording.

#### `camera.stopRecording(): void`

Stop video recording. Emits `recording_stopped` event with `durationMs`.

#### `camera.getIsRecording(): boolean`

Returns `true` if currently recording video.

#### `camera.getRecordingDurationMs(): number`

Returns the elapsed recording duration in milliseconds. Returns `0` if not recording.

#### `camera.getConfig(): CameraConfig`

Returns a copy of the current camera configuration.

#### `camera.getCapturedMedia(): CapturedMedia[]`

Returns all media captured in the current session.

#### `camera.on(listener): () => void`

Subscribe to camera events. Returns an unsubscribe function.

```typescript
const unsubscribe = camera.on((event) => {
  if (event.type === "media_captured") {
    console.log(event.media.uri, event.media.sizeBytes);
  }
});
```

#### `CameraController.getDefaultCapabilities(): CameraCapabilities`

Static method returning default device capabilities (native layer overrides at runtime).

```typescript
const caps = CameraController.getDefaultCapabilities();
// → {
//   hasFlash: true, hasFrontCamera: true, hasBackCamera: true,
//   maxZoom: 10,
//   supportedModes: ["photo", "video", "portrait", "panorama", "night", "document"],
//   supportedResolutions: ["480p", "720p", "1080p", "4K"],
//   supportedFps: [24, 30, 60, 120, 240],
//   supportsHdr: true, supportsNightMode: true, supportsPortrait: true,
//   supportsPanorama: true, supportsSlowMotion: true, supportsTimelapse: true,
//   supportsBeautyMode: true, supportsOpticalZoom: false,
//   supportedAspectRatios: ["1:1", "4:3", "16:9", "3:2", "full"],
// }
```

---

### `PhotoEditorController` (class)

Full photo editing controller with crop, rotate, adjust, draw, text, stickers, blur, frames, and undo/redo history.

#### `new PhotoEditorController(sourceUri: string)`

Create an editor for the given image URI.

```typescript
const editor = new PhotoEditorController("file:///path/to/photo.jpg");
```

#### Crop & Transform

##### `editor.setCrop(x, y, width, height): void`

Set a crop region in image coordinates.

##### `editor.rotate(degrees): void`

Rotate by a number of degrees (cumulative, modulo 360).

##### `editor.rotateLeft(): void` / `editor.rotateRight(): void`

Rotate 90° counterclockwise / clockwise.

##### `editor.flipHorizontal(): void` / `editor.flipVertical(): void`

Mirror the image horizontally or vertically.

##### `editor.straighten(degrees): void`

Fine-tune rotation for horizon correction (clamped to ±45°).

##### `editor.setPerspective(topLeft, topRight, bottomLeft, bottomRight): void`

Apply perspective correction using four corner points.

#### Adjustments

##### `editor.setAdjustment(key, value): void`

Set a single adjustment parameter. See `AdjustmentValues` for all 14 parameters.

```typescript
editor.setAdjustment("brightness", 20); // -100 to 100
editor.setAdjustment("contrast", 15); // -100 to 100
editor.setAdjustment("saturation", -10); // -100 to 100
editor.setAdjustment("exposure", 5); // -100 to 100
editor.setAdjustment("highlights", -20); // -100 to 100
editor.setAdjustment("shadows", 10); // -100 to 100
editor.setAdjustment("warmth", 25); // -100 to 100
editor.setAdjustment("tint", 0); // -100 to 100
editor.setAdjustment("sharpness", 30); // 0 to 100
editor.setAdjustment("grain", 5); // 0 to 100
editor.setAdjustment("vignette", 15); // 0 to 100
editor.setAdjustment("clarity", 10); // -100 to 100
editor.setAdjustment("fadeAmount", 0); // 0 to 100
editor.setAdjustment("hue", 0); // -180 to 180
```

##### `editor.resetAdjustments(): void`

Reset all adjustments to their default values (zero).

##### `editor.getAdjustments(): AdjustmentValues`

Returns a copy of the current adjustment values.

#### Filters

##### `editor.applyFilter(filterId): void`

Apply a built-in or custom filter by ID.

```typescript
editor.applyFilter("golden_hour");
editor.applyFilter("bw_classic");
```

##### `editor.removeFilter(): void`

Remove the active filter.

##### `editor.getActiveFilter(): string | null`

Returns the ID of the active filter, or `null`.

#### Text Overlays

##### `editor.addText(config): string`

Add a text overlay. Returns the overlay ID.

```typescript
const textId = editor.addText({
  text: "Summer 2026 ☀️",
  fontFamily: "Helvetica",
  fontSize: 32,
  color: "#FFFFFF",
  backgroundColor: "rgba(0,0,0,0.5)",
  bold: true,
  italic: false,
  underline: false,
  alignment: "center",
  rotation: 0,
  position: { x: 0.5, y: 0.1 },
  opacity: 100,
  shadow: { color: "#000000", offsetX: 2, offsetY: 2, blur: 4 },
  outline: { color: "#000000", width: 1 },
});
```

##### `editor.updateText(id, updates): void`

Update properties of an existing text overlay.

##### `editor.removeText(id): void`

Remove a text overlay by ID.

##### `editor.getTextOverlays(): TextOverlay[]`

Returns all text overlays.

#### Stickers

##### `editor.addSticker(config): string`

Add a sticker overlay. Returns the sticker ID.

```typescript
const stickerId = editor.addSticker({
  source: "emoji://🎉",
  position: { x: 0.8, y: 0.2 },
  scale: 1.5,
  rotation: -15,
  opacity: 100,
  flipHorizontal: false,
});
```

##### `editor.updateSticker(id, updates): void`

Update sticker properties.

##### `editor.removeSticker(id): void`

Remove a sticker.

##### `editor.getStickers(): StickerOverlay[]`

Returns all sticker overlays.

#### Drawing

##### `editor.startDrawPath(config): void`

Start a new drawing path with the given brush configuration.

```typescript
editor.startDrawPath({
  color: "#FF0000",
  brushSize: 5,
  brushType: "pen", // "pen" | "marker" | "pencil" | "spray" | "neon" | "eraser" | "blur_brush"
  opacity: 100,
});
```

##### `editor.addDrawPoint(x, y): void`

Add a point to the current drawing path.

##### `editor.endDrawPath(): void`

Finish the current drawing path and add it to history.

##### `editor.clearDrawing(): void`

Clear all drawing paths.

##### `editor.getDrawPaths()`

Returns all drawing paths with their configs and points.

#### Blur Regions

##### `editor.addBlurRegion(config): string`

Add a blur region. Returns the region ID.

```typescript
const blurId = editor.addBlurRegion({
  type: "circle", // "circle" | "rectangle" | "freeform"
  center: { x: 0.5, y: 0.5 },
  radius: 100,
  intensity: 50, // 1-100
  blurType: "gaussian", // "gaussian" | "motion" | "radial" | "pixelate"
});
```

##### `editor.removeBlurRegion(id): void`

Remove a blur region.

##### `editor.getBlurRegions(): BlurRegion[]`

Returns all blur regions.

#### Frames

##### `editor.setFrame(config): void`

Apply a frame to the image.

```typescript
editor.setFrame({
  id: "polaroid",
  type: "polaroid", // "solid" | "gradient" | "pattern" | "rounded" | "polaroid" | "film_strip" | "torn_paper"
  width: 20,
  color: "#FFFFFF",
  cornerRadius: 8,
  innerPadding: 10,
});
```

##### `editor.removeFrame(): void`

Remove the current frame.

##### `editor.getFrame(): FrameConfig | null`

Returns the current frame config, or `null`.

#### History (Undo / Redo)

##### `editor.undo(): boolean`

Undo the last edit action. Returns `false` if nothing to undo.

##### `editor.redo(): boolean`

Redo a previously undone action. Returns `false` if nothing to redo.

##### `editor.canUndo(): boolean` / `editor.canRedo(): boolean`

Check if undo/redo is available.

##### `editor.getHistoryCount(): number`

Returns the total number of actions in the history stack.

#### Export

##### `editor.getEditState(): Record<string, unknown>`

Returns the complete edit state (adjustments, overlays, crop, rotation, filter, etc.) for serialization or export.

##### `editor.resetAll(): void`

Reset all edits to the original image state. Clears adjustments, overlays, blur regions, drawing paths, frames, crop, rotation, filter, and history.

##### `editor.on(listener): () => void`

Subscribe to editor events (e.g., `"undo"`, `"redo"`). Returns an unsubscribe function.

---

### Filter Functions

#### `getBuiltInFilters(): PhotoFilter[]`

Returns all 24 built-in filter presets.

```typescript
const filters = getBuiltInFilters();
// → [
//   { id: "original", name: "Original", category: "natural", premium: false, … },
//   { id: "vivid",    name: "Vivid",    category: "natural", premium: false, … },
//   { id: "golden_hour", name: "Golden Hour", category: "warm", premium: false, … },
//   … (24 total)
// ]
```

#### `getFiltersByCategory(category): PhotoFilter[]`

Get filters for a specific category.

```typescript
const warmFilters = getFiltersByCategory("warm");
// → [golden_hour, sunset, honey]

const bwFilters = getFiltersByCategory("bw");
// → [bw_classic, bw_high_contrast, bw_film_noir]
```

#### `getFilterCategories(): { id: FilterCategory; label: string }[]`

Get all available filter categories with display labels.

```typescript
const categories = getFilterCategories();
// → [
//   { id: "natural",   label: "Natural" },
//   { id: "warm",      label: "Warm" },
//   { id: "cool",      label: "Cool" },
//   { id: "vintage",   label: "Vintage" },
//   { id: "dramatic",  label: "Dramatic" },
//   { id: "bw",        label: "B&W" },
//   { id: "film",      label: "Film" },
//   { id: "portrait",  label: "Portrait" },
//   { id: "food",      label: "Food" },
//   { id: "landscape", label: "Landscape" },
//   { id: "night",     label: "Night" },
//   { id: "artistic",  label: "Artistic" },
// ]
```

#### `getCropPresets(): CropPreset[]`

Get standard crop aspect-ratio presets including Indian document sizes.

```typescript
const presets = getCropPresets();
// → [
//   { id: "free",     label: "Free",           aspectRatio: null },
//   { id: "original", label: "Original",       aspectRatio: null },
//   { id: "1:1",      label: "Square",         aspectRatio: 1 },
//   { id: "4:3",      label: "4:3",            aspectRatio: 1.333 },
//   { id: "16:9",     label: "16:9",           aspectRatio: 1.778 },
//   { id: "9:16",     label: "9:16 (Story)",   aspectRatio: 0.5625 },
//   { id: "aadhaar",  label: "Aadhaar Size",   aspectRatio: 0.778 },
//   { id: "passport", label: "Passport Size",  aspectRatio: 0.778 },
//   … (11 total)
// ]
```

---

## Types

### `CameraConfig`

```typescript
interface CameraConfig {
  facing: CameraFacing; // "front" | "back"
  flash: FlashMode; // "off" | "on" | "auto" | "torch"
  mode: CaptureMode; // 9 capture modes
  aspectRatio: AspectRatio; // "1:1" | "4:3" | "16:9" | "3:2" | "full"
  grid: GridType; // "none" | "rule_of_thirds" | "golden_ratio" | "square" | "crosshair"
  hdr: boolean;
  stabilization: boolean;
  timerSeconds: number; // 0 = no timer
  zoom: number; // 1.0 = no zoom
  maxZoom: number;
  photoQuality: number; // 0-100
  videoResolution: VideoResolution; // "480p" | "720p" | "1080p" | "2K" | "4K"
  videoFps: number;
  geoTag: boolean;
  shutterSound: boolean;
  beautyMode: boolean;
  beautyIntensity: number; // 0-100
  watermark?: string;
  mirrorFrontCamera: boolean;
}
```

### `CaptureMode`

```typescript
type CaptureMode =
  | "photo" // Standard photo
  | "video" // Video recording
  | "portrait" // Depth-of-field bokeh
  | "panorama" // Panoramic capture
  | "night" // Night mode (longer exposure)
  | "burst" // Burst shot
  | "timelapse" // Timelapse video
  | "slow_motion" // Slow-motion video
  | "document"; // Document scanning
```

### `CapturedMedia`

```typescript
interface CapturedMedia {
  id: string;
  uri: string;
  type: "photo" | "video";
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
  durationMs?: number; // video only
  thumbnailUri?: string; // video only
  exif?: ExifData;
  capturedAt: number; // Unix timestamp (ms)
}
```

### `ExifData`

```typescript
interface ExifData {
  make?: string;
  model?: string;
  dateTime?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  focalLength?: number;
  exposureTime?: string;
  iso?: number;
  aperture?: number;
  flash?: boolean;
  orientation?: number;
}
```

### `CameraCapabilities`

```typescript
interface CameraCapabilities {
  hasFlash: boolean;
  hasFrontCamera: boolean;
  hasBackCamera: boolean;
  maxZoom: number;
  supportedModes: CaptureMode[];
  supportedResolutions: VideoResolution[];
  supportedFps: number[];
  supportsHdr: boolean;
  supportsNightMode: boolean;
  supportsPortrait: boolean;
  supportsPanorama: boolean;
  supportsSlowMotion: boolean;
  supportsTimelapse: boolean;
  supportsBeautyMode: boolean;
  supportsOpticalZoom: boolean;
  supportedAspectRatios: AspectRatio[];
}
```

### `CameraEvent`

```typescript
type CameraEvent =
  | { type: "camera_flipped"; facing: CameraFacing }
  | { type: "mode_changed"; mode: CaptureMode }
  | { type: "focus_set"; point: FocusPoint }
  | { type: "capture_started"; mediaType: "photo" | "video" }
  | { type: "recording_started" }
  | { type: "recording_stopped"; durationMs: number }
  | { type: "media_captured"; media: CapturedMedia };
```

### `EditTool`

```typescript
type EditTool =
  | "crop"
  | "rotate"
  | "flip"
  | "adjust"
  | "filter"
  | "draw"
  | "text"
  | "sticker"
  | "blur"
  | "frame"
  | "vignette"
  | "sharpen"
  | "heal"
  | "red_eye"
  | "perspective"
  | "collage"
  | "background_remove"
  | "resize";
```

### `AdjustmentValues`

```typescript
interface AdjustmentValues {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  exposure: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  warmth: number; // -100 to 100
  tint: number; // -100 to 100
  sharpness: number; // 0 to 100
  grain: number; // 0 to 100
  vignette: number; // 0 to 100
  clarity: number; // -100 to 100
  fadeAmount: number; // 0 to 100
  hue: number; // -180 to 180
}
```

### `DrawConfig`

```typescript
interface DrawConfig {
  color: string;
  brushSize: number; // 1-50
  brushType:
    | "pen"
    | "marker"
    | "pencil"
    | "spray"
    | "neon"
    | "eraser"
    | "blur_brush";
  opacity: number; // 0-100
}
```

### `TextOverlay`

```typescript
interface TextOverlay {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: "left" | "center" | "right";
  rotation: number;
  position: { x: number; y: number };
  opacity: number;
  shadow?: { color: string; offsetX: number; offsetY: number; blur: number };
  outline?: { color: string; width: number };
}
```

### `StickerOverlay`

```typescript
interface StickerOverlay {
  id: string;
  source: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
  flipHorizontal: boolean;
}
```

### `BlurRegion`

```typescript
interface BlurRegion {
  id: string;
  type: "circle" | "rectangle" | "freeform";
  center: { x: number; y: number };
  radius?: number;
  width?: number;
  height?: number;
  intensity: number; // 1-100
  blurType: "gaussian" | "motion" | "radial" | "pixelate";
  path?: { x: number; y: number }[];
}
```

### `FrameConfig`

```typescript
interface FrameConfig {
  id: string;
  type:
    | "solid"
    | "gradient"
    | "pattern"
    | "rounded"
    | "polaroid"
    | "film_strip"
    | "torn_paper";
  color?: string;
  width: number;
  cornerRadius?: number;
  innerPadding?: number;
}
```

### `PhotoFilter`

```typescript
interface PhotoFilter {
  id: string;
  name: string;
  category: FilterCategory;
  thumbnail?: string;
  adjustments: Partial<FilterAdjustments>;
  premium: boolean;
}
```

### `FilterCategory`

```typescript
type FilterCategory =
  | "natural"
  | "warm"
  | "cool"
  | "vintage"
  | "dramatic"
  | "bw"
  | "film"
  | "portrait"
  | "food"
  | "landscape"
  | "night"
  | "artistic";
```

### `FilterAdjustments`

```typescript
interface FilterAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  grain: number;
  vignette: number;
  fadeAmount: number;
  hue: number;
}
```
