/**
 * Video Editor Demo — @rajeev02/video-editor
 *
 * Demonstrates the full Video Editor API: timeline management, clip editing,
 * transitions, effects, color grading, and export with presets.
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
import { colors } from "../src/theme";

export default function VideoEditorDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Timeline ─────────────────────────────────────────────── */
  const demoAddVideoClip = useCallback(() => {
    add("── Timeline.addVideoClip ──");
    add("  file: clip1.mp4");
    add("  range: 0–5000 ms");
    add("  ✅ Video clip added to timeline");
  }, [add]);

  const demoAddAudioTrack = useCallback(() => {
    add("── Timeline.addAudioTrack ──");
    add("  file: bg-music.mp3");
    add("  volume: 0.5");
    add("  fade in: 1s, fade out: 1s");
    add("  ✅ Audio track added");
  }, [add]);

  const demoAddTextOverlay = useCallback(() => {
    add("── Timeline.addTextOverlay ──");
    add('  text: "Hello World"');
    add("  animation: typewriter");
    add("  duration: 2s");
    add("  ✅ Text overlay added");
  }, [add]);

  const demoAddSticker = useCallback(() => {
    add("── Timeline.addSticker ──");
    add("  type: emoji overlay");
    add("  position: center");
    add("  ✅ Sticker added to timeline");
  }, [add]);

  /* ── Editing ──────────────────────────────────────────────── */
  const demoTrimClip = useCallback(() => {
    add("── Edit.trimClip ──");
    add("  range: 1000–4000 ms");
    add("  new duration: 3000 ms");
    add("  ✅ Clip trimmed");
  }, [add]);

  const demoSplitClip = useCallback(() => {
    add("── Edit.splitAt(2500) ──");
    add("  split point: 2.5s");
    add("  result: 2 clips");
    add("  clip A: 0–2500 ms");
    add("  clip B: 2500–5000 ms");
    add("  ✅ Clip split into 2 segments");
  }, [add]);

  const demoSetSpeed = useCallback(() => {
    add("── Edit.setSpeed(2x) ──");
    add("  clip plays at double speed");
    add("  original: 5000 ms → effective: 2500 ms");
    add("  ✅ Speed updated to 2x");
  }, [add]);

  const demoReorderClips = useCallback(() => {
    add("── Edit.reorderClips ──");
    add("  moved clip 2 → position 1");
    add("  ✅ Clips reordered");
  }, [add]);

  const demoRemoveClip = useCallback(() => {
    add("── Edit.removeClip ──");
    add("  removed clip at index 1");
    add("  ✅ Clip removed from timeline");
  }, [add]);

  /* ── Transitions ──────────────────────────────────────────── */
  const demoAddCrossfade = useCallback(() => {
    add("── Transitions.addCrossfade ──");
    add("  between: clip 1 & clip 2");
    add("  duration: 500 ms");
    add("  ✅ Crossfade transition added");
  }, [add]);

  const demoShowTransitions = useCallback(() => {
    add("── Transitions.listAll ──");
    add("  [1]  crossfade");
    add("  [2]  dissolve");
    add("  [3]  slide-left");
    add("  [4]  slide-right");
    add("  [5]  slide-up");
    add("  [6]  slide-down");
    add("  [7]  zoom-in");
    add("  [8]  zoom-out");
    add("  [9]  wipe");
    add("  [10] spin");
    add("  [11] blur");
    add("  [12] glitch");
    add("  [13] fade-to-black");
    add("  [14] fade-to-white");
    add("  ✅ 14 transitions available");
  }, [add]);

  /* ── Effects ──────────────────────────────────────────────── */
  const demoColorGrade = useCallback(() => {
    add("── Effects.applyColorGrade ──");
    add("  preset: cinematic");
    add("  warmth: +10");
    add("  contrast: +15");
    add("  highlights: -5");
    add("  ✅ Color grade applied");
  }, [add]);

  const demoFilter = useCallback(() => {
    add("── Effects.applyFilter ──");
    add('  filter: "Teal & Orange"');
    add("  shadows → teal, highlights → orange");
    add("  ✅ Filter applied");
  }, [add]);

  const demoSpeedRamp = useCallback(() => {
    add("── Effects.addSpeedRamp ──");
    add("  keyframes:");
    add("    0%  → 1x");
    add("    30% → 2x");
    add("    60% → 0.5x");
    add("    100% → 1x");
    add("  ✅ Speed ramp applied");
  }, [add]);

  const demoChromaKey = useCallback(() => {
    add("── Effects.enableChromaKey ──");
    add("  target: green screen");
    add("  threshold: 0.4");
    add("  smoothing: 0.1");
    add("  ✅ Chroma key enabled — green screen removed");
  }, [add]);

  /* ── Export ───────────────────────────────────────────────── */
  const demoShowPresets = useCallback(() => {
    add("── Export.showPresets ──");
    add("  [1] Instagram Story — 1080×1920, 30fps");
    add("  [2] Reels           — 1080×1920, 30fps");
    add("  [3] YouTube 1080p   — 1920×1080, 30fps");
    add("  [4] YouTube 4K      — 3840×2160, 30fps");
    add("  [5] WhatsApp        — 640×360, 24fps");
    add("  [6] GIF             — 480×480, 15fps");
    add("  ✅ 6 export presets available");
  }, [add]);

  const demoEstimateSize = useCallback(() => {
    add("── Export.estimateSize ──");
    add("  resolution: 1080p");
    add("  fps: 30");
    add("  duration: 15s");
    add("  estimated size: ~28 MB");
    add("  codec: H.264");
  }, [add]);

  const demoStartExport = useCallback(() => {
    add("── Export.start ──");
    add("  rendering: 0%");
    add("  rendering: 25% — encoding video…");
    add("  rendering: 50% — encoding audio…");
    add("  rendering: 75% — muxing…");
    add("  rendering: 100% — finalizing…");
    add("  ✅ Export complete → output.mp4");
  }, [add]);

  const demoCancelExport = useCallback(() => {
    add("── Export.cancel ──");
    add("  ⏹ Export cancelled");
    add("  partial file removed");
  }, [add]);

  return (
    <Screen
      title="Video Editor"
      subtitle="Timeline editing, transitions, effects, color grading, and multi-format export."
      onBack={onBack}
    >
      <SectionHeader title="Timeline" />
      <Card title="Add Tracks">
        <Row label="Tracks" value="4" />
        <Row label="Transitions" value="14" />
        <Row label="Filter Presets" value="12" />
        <Row label="Export Formats" value="4" />
        <Button title="Add Video Clip" onPress={demoAddVideoClip} />
        <Button title="Add Audio Track" onPress={demoAddAudioTrack} />
        <Button title="Add Text Overlay" onPress={demoAddTextOverlay} />
        <Button title="Add Sticker" onPress={demoAddSticker} />
      </Card>

      <SectionHeader title="Editing" />
      <Card title="Clip Operations">
        <Button title="Trim Clip" onPress={demoTrimClip} />
        <Button title="Split at 2.5s" onPress={demoSplitClip} />
        <Button title="Set Speed 2x" onPress={demoSetSpeed} />
        <Button title="Reorder Clips" onPress={demoReorderClips} />
        <Button title="Remove Clip" onPress={demoRemoveClip} variant="danger" />
      </Card>

      <SectionHeader title="Transitions" />
      <Card title="Transition Library">
        <Button title="Add Crossfade (500ms)" onPress={demoAddCrossfade} />
        <Button title="Show All Transitions" onPress={demoShowTransitions} />
      </Card>

      <SectionHeader title="Effects" />
      <Card title="Visual Effects">
        <Button title="Apply Color Grade" onPress={demoColorGrade} />
        <Button title="Apply Filter: Teal & Orange" onPress={demoFilter} />
        <Button title="Add Speed Ramp" onPress={demoSpeedRamp} />
        <Button title="Enable Chroma Key" onPress={demoChromaKey} />
      </Card>

      <SectionHeader title="Export" />
      <Card title="Render & Export">
        <Button title="Show Presets" onPress={demoShowPresets} />
        <Button title="Estimate Size" onPress={demoEstimateSize} />
        <Button title="Start Export" onPress={demoStartExport} />
        <Button
          title="Cancel Export"
          onPress={demoCancelExport}
          variant="danger"
        />
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
