/**
 * Camera Demo — @rajeev02/camera
 *
 * Demonstrates the full Camera API: camera controls, photo/video capture,
 * photo editor with filters, adjustments, overlays, and crop presets.
 */
import React, { useState, useCallback } from "react";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
  Badge,
} from "../src/components";

export default function CameraDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Camera Controls ──────────────────────────────────────── */
  const demoFlip = useCallback(() => {
    add("── Camera.flip ──");
    add("  previous: back");
    add("  current:  front");
    add("  ✅ Camera flipped (front ↔ back)");
  }, [add]);

  const demoSetMode = useCallback(() => {
    add("── Camera.setMode ──");
    add("  previous: photo");
    add("  current:  portrait");
    add("  ✅ Mode set to Portrait");
    add("  depthEffect: enabled");
    add("  bokehLevel: 4.0");
  }, [add]);

  const demoToggleHDR = useCallback(() => {
    add("── Camera.toggleHDR ──");
    add("  HDR: ON ✅");
    add("  toneMapping: adaptive");
    add("  bracketCount: 3");
  }, [add]);

  const demoCycleFlash = useCallback(() => {
    add("── Camera.cycleFlash ──");
    add("  auto → on → off → torch");
    add("  current: on 🔦");
  }, [add]);

  const demoSetZoom = useCallback(() => {
    add("── Camera.setZoom ──");
    add("  zoom: 2.0×");
    add("  digitalZoom: false (optical)");
    add("  lens: telephoto");
    add("  ✅ Zoom set to 2×");
  }, [add]);

  const demoSetTimer = useCallback(() => {
    add("── Camera.setTimer ──");
    add("  delay: 3s");
    add("  countdown: enabled");
    add("  ✅ Timer set to 3 seconds");
  }, [add]);

  /* ── Capture ──────────────────────────────────────────────── */
  const demoTakePhoto = useCallback(() => {
    add("── Capture.takePhoto ──");
    add("  📸 Shutter fired");
    add("  ✅ Photo captured");
    add("  resolution: 4032 × 3024");
    add("  fileSize: 2.4 MB");
    add("  format: HEIF");
    add("  colorSpace: Display P3");
    add("  uri: file:///tmp/capture/IMG_20260207_001.heif");
    add("  metadata:");
    add("    iso: 100");
    add("    shutterSpeed: 1/250");
    add("    aperture: f/1.8");
    add("    focalLength: 26mm");
  }, [add]);

  const demoStartRecording = useCallback(() => {
    add("── Capture.startRecording ──");
    add("  🔴 Recording started…");
    add("  resolution: 1920 × 1080");
    add("  fps: 30");
    add("  codec: H.265 (HEVC)");
    add("  stabilization: cinematic");
  }, [add]);

  const demoStopRecording = useCallback(() => {
    add("── Capture.stopRecording ──");
    add("  ⏹ Recording stopped");
    add("  ✅ Video saved");
    add("  duration: 15.2s");
    add("  resolution: 1920 × 1080");
    add("  fileSize: 28.4 MB");
    add("  uri: file:///tmp/capture/VID_20260207_001.mov");
  }, [add]);

  const demoBurstMode = useCallback(() => {
    add("── Capture.burst ──");
    add("  📸 Burst mode activated…");
    add("  Capturing 10 photos at 10fps…");
    add("  ✅ Burst complete (10 / 10)");
    add("  bestShot: IMG_20260207_burst_004.heif");
    add("  totalSize: 18.6 MB");
  }, [add]);

  /* ── Photo Editor ─────────────────────────────────────────── */
  const demoApplyFilter = useCallback(() => {
    add("── PhotoEditor.applyFilter ──");
    add('  filter: "Golden Hour"');
    add("  category: Warm");
    add("  intensity: 0.75");
    add("  ✅ Filter applied — Golden Hour");
  }, [add]);

  const demoAdjustBrightness = useCallback(() => {
    add("── PhotoEditor.adjust ──");
    add("  property: brightness");
    add("  value: +20 (range: -100 to +100)");
    add("  ✅ Brightness adjusted to +20");
  }, [add]);

  const demoAddTextOverlay = useCallback(() => {
    add("── PhotoEditor.addOverlay ──");
    add("  type: text");
    add('  content: "Rajeev SDK Demo"');
    add("  font: SF Pro Bold, 24pt");
    add("  color: #FFFFFF");
    add("  position: { x: 0.5, y: 0.9 } (center-bottom)");
    add("  ✅ Text overlay added");
  }, [add]);

  const demoCrop = useCallback(() => {
    add("── PhotoEditor.crop ──");
    add("  preset: 16:9");
    add("  original: 4032 × 3024");
    add("  cropped:  4032 × 2268");
    add("  ✅ Cropped to 16:9");
  }, [add]);

  const demoRotate = useCallback(() => {
    add("── PhotoEditor.rotate ──");
    add("  angle: 90° clockwise");
    add("  new dimensions: 3024 × 4032");
    add("  ✅ Rotated 90°");
  }, [add]);

  const demoAddBlur = useCallback(() => {
    add("── PhotoEditor.addBlurRegion ──");
    add("  type: gaussian");
    add("  radius: 25");
    add("  region: { x: 0.2, y: 0.3, w: 0.3, h: 0.2 }");
    add("  ✅ Blur region added");
  }, [add]);

  const demoUndo = useCallback(() => {
    add("── PhotoEditor.undo ──");
    add("  ✅ Last edit undone");
    add("  historyStack: 3 edits remaining");
  }, [add]);

  const demoRedo = useCallback(() => {
    add("── PhotoEditor.redo ──");
    add("  ✅ Edit re-applied");
    add("  historyStack: 4 edits applied");
  }, [add]);

  /* ── Filters ──────────────────────────────────────────────── */
  const demoShowFilters = useCallback(() => {
    add("── Filters.listBuiltIn ──");
    add("  Categories:");
    add(
      "    Natural  (6) — Daylight, Cloudy, Shade, Tungsten, Fluorescent, Flash",
    );
    add("    Warm     (4) — Golden Hour, Sunset, Amber, Honey");
    add("    Cool     (4) — Arctic, Ocean, Twilight, Moonlight");
    add("    Vintage  (4) — Retro, Sepia, Faded, Polaroid");
    add("    B&W      (3) — Noir, High Contrast, Silver");
    add("    Film     (3) — Kodak 400, Fuji Velvia, Cinestill");
    add("  Total: 24 filters");
  }, [add]);

  const demoShowCropPresets = useCallback(() => {
    add("── Filters.cropPresets ──");
    add("  Available presets:");
    add("    1. Free         (unconstrained)");
    add("    2. Square       (1:1)");
    add("    3. 4:3          (standard)");
    add("    4. 16:9         (widescreen)");
    add("    5. Aadhaar      (3.5:4.5 — ID photo)");
    add("    6. Passport     (2:2.5 — intl. passport)");
    add("    7. Story        (9:16 — social media)");
  }, [add]);

  return (
    <Screen
      title="Camera"
      subtitle="Camera controls, photo/video capture, photo editor with filters, adjustments, and crop presets."
      onBack={onBack}
    >
      <SectionHeader title="Camera Controls" />
      <Card title="Controls">
        <Button title="Flip Camera" onPress={demoFlip} />
        <Button title="Set Mode: Portrait" onPress={demoSetMode} />
        <Button title="Toggle HDR" onPress={demoToggleHDR} />
        <Button title="Cycle Flash" onPress={demoCycleFlash} />
        <Button title="Set Zoom 2×" onPress={demoSetZoom} />
        <Button title="Set Timer 3s" onPress={demoSetTimer} />
      </Card>

      <SectionHeader title="Capture" />
      <Card title="Photo & Video">
        <Button title="Take Photo" onPress={demoTakePhoto} />
        <Button title="Start Recording" onPress={demoStartRecording} />
        <Button title="Stop Recording" onPress={demoStopRecording} />
        <Button title="Burst Mode (10 photos)" onPress={demoBurstMode} />
      </Card>

      <SectionHeader title="Photo Editor" />
      <Card title="Edit Tools">
        <Button title="Apply Filter: Golden Hour" onPress={demoApplyFilter} />
        <Button title="Adjust Brightness +20" onPress={demoAdjustBrightness} />
        <Button title="Add Text Overlay" onPress={demoAddTextOverlay} />
        <Button title="Crop to 16:9" onPress={demoCrop} />
        <Button title="Rotate 90°" onPress={demoRotate} />
        <Button title="Add Blur Region" onPress={demoAddBlur} />
      </Card>
      <Card title="History">
        <Button title="Undo" onPress={demoUndo} />
        <Button title="Redo" onPress={demoRedo} />
      </Card>

      <SectionHeader title="Filters" />
      <Card title="Built-in Filters & Presets">
        <Button title="Show Built-in Filters" onPress={demoShowFilters} />
        <Button title="Show Crop Presets" onPress={demoShowCropPresets} />
      </Card>

      <SectionHeader title="Configuration" />
      <Card>
        <Row label="Capture Modes" value="9" />
        <Row label="Filters" value="24" />
        <Row label="Edit Tools" value="10+" />
        <Row label="Crop Presets" value="7" />
      </Card>

      <Button
        title="Clear Log"
        onPress={() => setLog([])}
        variant="secondary"
      />
      <OutputLog lines={log} />
    </Screen>
  );
}
