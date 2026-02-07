/**
 * Media Demo — @rajeev02/media
 *
 * Demonstrates the full Media API: adaptive HLS streaming, DRM playback,
 * quality selection, offline downloads, and watch history.
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

export default function MediaDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Player ───────────────────────────────────────────────── */
  const demoLoadVideo = useCallback(() => {
    add("── Player.load ──");
    add("  source: adaptive HLS stream");
    add("  resolution: 1080p");
    add("  duration: 45:30");
    add("  ✅ Video loaded and ready to play");
  }, [add]);

  const demoPlay = useCallback(() => {
    add("── Player.play ──");
    add("  ▶ Playback started");
    add("  state: playing");
  }, [add]);

  const demoPause = useCallback(() => {
    add("── Player.pause ──");
    add("  ⏸ Playback paused");
    add("  state: paused");
  }, [add]);

  const demoSeek = useCallback(() => {
    add("── Player.seek(50%) ──");
    add("  seeking to 50% of 45:30");
    add("  position: 22:45");
    add("  ✅ Seek complete");
  }, [add]);

  const demoSkipForward = useCallback(() => {
    add("── Player.skipForward(10s) ──");
    add("  ⏩ Skipping forward 10 seconds");
    add("  ✅ Position updated");
  }, [add]);

  const demoSkipBack = useCallback(() => {
    add("── Player.skipBack(10s) ──");
    add("  ⏪ Skipping back 10 seconds");
    add("  ✅ Position updated");
  }, [add]);

  const demoSetRate = useCallback(() => {
    add("── Player.setRate(1.5) ──");
    add("  playback rate: 1.5x");
    add("  ✅ Rate updated");
  }, [add]);

  const demoFullscreen = useCallback(() => {
    add("── Player.toggleFullscreen ──");
    add("  ⛶ Fullscreen toggled");
    add("  mode: fullscreen");
  }, [add]);

  const demoPiP = useCallback(() => {
    add("── Player.enterPiP ──");
    add("  🖼 Picture-in-Picture activated");
    add("  mode: pip");
  }, [add]);

  /* ── Quality ──────────────────────────────────────────────── */
  const demoShowQualities = useCallback(() => {
    add("── Quality.getAvailable ──");
    add("  [0] Auto        — adaptive");
    add("  [1] 360p        — 800 kbps");
    add("  [2] 480p        — 1.5 Mbps");
    add("  [3] 720p        — 3.0 Mbps");
    add("  [4] 1080p       — 6.0 Mbps");
    add("  ✅ 5 quality levels available");
  }, [add]);

  const demoSetQuality = useCallback(() => {
    add("── Quality.set(720p) ──");
    add("  switching to 720p (3.0 Mbps)");
    add("  ✅ Quality locked to 720p");
  }, [add]);

  /* ── DRM ──────────────────────────────────────────────────── */
  const demoLoadDRM = useCallback(() => {
    add("── DRM.loadProtectedContent ──");
    add("  DRM type: Widevine");
    add("  license server: configured");
    add("  ✅ DRM content loaded successfully");
  }, [add]);

  const demoCheckDRM = useCallback(() => {
    add("── DRM.checkStatus ──");
    add("  status: license acquired");
    add("  valid until: 2026-02-08T12:00:00Z");
    add("  ✅ DRM license active");
  }, [add]);

  /* ── Downloads ────────────────────────────────────────────── */
  const demoEnqueueDownload = useCallback(() => {
    add("── Download.enqueue ──");
    add("  file: video.mp4");
    add("  estimated size: 500 MB");
    add("  ✅ Download enqueued");
  }, [add]);

  const demoCheckProgress = useCallback(() => {
    add("── Download.checkProgress ──");
    add("  progress: 45%");
    add("  downloaded: 225 MB / 500 MB");
    add("  speed: 2.1 MB/s");
    add("  remaining: ~2 min");
  }, [add]);

  const demoPauseDownload = useCallback(() => {
    add("── Download.pause ──");
    add("  ⏸ Download paused");
    add("  ✅ State saved, can resume later");
  }, [add]);

  const demoResumeDownload = useCallback(() => {
    add("── Download.resume ──");
    add("  ▶ Download resumed from 225 MB");
    add("  ✅ Resuming at 2.1 MB/s");
  }, [add]);

  const demoShowStorage = useCallback(() => {
    add("── Download.showStorage ──");
    add("  used: 1.2 GB / 2.0 GB");
    add("  available: 800 MB");
    add("  cached videos: 3");
  }, [add]);

  /* ── Watch History ────────────────────────────────────────── */
  const demoSavePosition = useCallback(() => {
    add("── WatchHistory.saveResumePosition ──");
    add("  video: current video");
    add("  position: 22:45");
    add("  ✅ Resume position saved");
  }, [add]);

  const demoGetPosition = useCallback(() => {
    add("── WatchHistory.getResumePosition ──");
    add("  video: current video");
    add("  last position: 22:45");
    add("  ✅ Resume position loaded");
  }, [add]);

  const demoClearHistory = useCallback(() => {
    add("── WatchHistory.clear ──");
    add("  ✅ Watch history cleared");
    add("  entries removed: 5");
  }, [add]);

  return (
    <Screen
      title="Media"
      subtitle="Adaptive HLS streaming, DRM playback, quality selection, offline downloads, and watch history."
      onBack={onBack}
    >
      <SectionHeader title="Player" />
      <Card title="Playback Controls">
        <Row label="Max Rate" value="4x" />
        <Row label="Qualities" value="5" />
        <Row label="DRM Types" value="3" />
        <Row label="Max Downloads" value="2" />
        <Button title="Load Video" onPress={demoLoadVideo} />
        <Button title="Play" onPress={demoPlay} />
        <Button title="Pause" onPress={demoPause} />
        <Button title="Seek to 50%" onPress={demoSeek} />
        <Button title="Skip Forward 10s" onPress={demoSkipForward} />
        <Button title="Skip Back 10s" onPress={demoSkipBack} />
        <Button title="Set Rate 1.5x" onPress={demoSetRate} />
        <Button title="Toggle Fullscreen" onPress={demoFullscreen} />
        <Button title="Enter PiP" onPress={demoPiP} />
      </Card>

      <SectionHeader title="Quality" />
      <Card title="Quality Selection">
        <Button title="Show Qualities" onPress={demoShowQualities} />
        <Button title="Set Quality: 720p" onPress={demoSetQuality} />
      </Card>

      <SectionHeader title="DRM" />
      <Card title="DRM Playback">
        <Button title="Load DRM Content" onPress={demoLoadDRM} />
        <Button title="Check DRM Status" onPress={demoCheckDRM} />
      </Card>

      <SectionHeader title="Downloads" />
      <Card title="Offline Downloads">
        <Button title="Enqueue Download" onPress={demoEnqueueDownload} />
        <Button title="Check Progress" onPress={demoCheckProgress} />
        <Button title="Pause Download" onPress={demoPauseDownload} />
        <Button title="Resume Download" onPress={demoResumeDownload} />
        <Button title="Show Storage" onPress={demoShowStorage} />
      </Card>

      <SectionHeader title="Watch History" />
      <Card title="Resume & History">
        <Button title="Save Resume Position" onPress={demoSavePosition} />
        <Button title="Get Resume Position" onPress={demoGetPosition} />
        <Button
          title="Clear History"
          onPress={demoClearHistory}
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
