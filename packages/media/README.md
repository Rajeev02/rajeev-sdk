# @rajeev02/media

[![npm version](https://img.shields.io/npm/v/@rajeev02/media.svg)](https://www.npmjs.com/package/@rajeev02/media)
[![license](https://img.shields.io/npm/l/@rajeev02/media.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Unified media player & download manager** with adaptive streaming (HLS/DASH), Picture-in-Picture, Chromecast/AirPlay, DRM (Widevine/FairPlay), quality selection, and offline downloads.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Adaptive streaming** — HLS & DASH with automatic quality switching based on bandwidth
- **DRM support** — Widevine (Android/Web) and FairPlay (iOS) for premium content protection
- **Picture-in-Picture** — Floating video player while using other apps
- **Casting** — Chromecast and AirPlay integration with unified API
- **Offline downloads** — Background download with pause/resume, progress tracking, storage limits
- **Resume playback** — Automatic resume from last position across sessions
- **Playback speed** — 0.5x to 3x speed with pitch correction

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |
| Web        | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/media
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Media Player

```typescript
import { MediaPlayerController } from "@rajeev02/media";

const player = new MediaPlayerController({
  autoPlay: true,
  enablePiP: true,
  enableCast: true,
});

// Load a video with DRM
player.load({
  uri: "https://stream.example.com/video.m3u8",
  type: "video",
  title: "My Movie",
  drm: {
    type: "widevine",
    licenseServerUrl: "https://drm.example.com/license",
  },
});

// Listen for events
player.on((event) => {
  switch (event.type) {
    case "progress":
      updateSeekbar(event.currentTimeMs);
      break;
    case "quality_changed":
      showBadge(event.quality);
      break;
    case "buffering":
      showSpinner(event.isBuffering);
      break;
  }
});

// Playback controls
player.play();
player.pause();
player.seek(60_000); // Seek to 1 minute
player.setRate(1.5); // 1.5x speed
player.setQuality("720p"); // Manual quality selection
player.enterPiP(); // Picture-in-Picture
player.skipForward(10_000); // Skip 10 seconds
```

### Offline Downloads

```typescript
import { DownloadManager } from "@rajeev02/media";

const dm = new DownloadManager(
  2, // Max concurrent downloads
  2 * 1024 ** 3, // 2 GB storage limit
);

// Enqueue download
dm.enqueue({
  id: "movie-001",
  uri: "https://cdn.example.com/movie.mp4",
  title: "Offline Movie",
  estimatedSizeBytes: 500_000_000, // 500 MB
});

// Track progress
dm.onProgress((progress) => {
  console.log(`${progress.percentComplete}% at ${progress.speedBps} B/s`);
  console.log(`ETA: ${progress.estimatedTimeRemainingMs}ms`);
});

// Manage downloads
dm.pause("movie-001");
dm.resume("movie-001");
dm.cancel("movie-001");
const all = dm.getAll(); // List all downloads with status
```

## API Reference

### `MediaPlayerController`

| Method                                 | Description                  |
| -------------------------------------- | ---------------------------- |
| `load(source)`                         | Load media source            |
| `play()` / `pause()`                   | Play or pause                |
| `seek(positionMs)`                     | Seek to position             |
| `setRate(rate)`                        | Set playback speed (0.5–3.0) |
| `setQuality(quality)`                  | Set video quality            |
| `setVolume(volume)`                    | Set volume (0–1)             |
| `enterPiP()` / `exitPiP()`             | Toggle Picture-in-Picture    |
| `skipForward(ms)` / `skipBackward(ms)` | Skip forward/backward        |
| `on(callback)`                         | Subscribe to player events   |
| `destroy()`                            | Release player resources     |

### `DownloadManager`

| Method                     | Description             |
| -------------------------- | ----------------------- |
| `enqueue(config)`          | Start a download        |
| `pause(id)` / `resume(id)` | Pause or resume         |
| `cancel(id)`               | Cancel and delete       |
| `getAll()`                 | List all downloads      |
| `getById(id)`              | Get download status     |
| `onProgress(callback)`     | Track download progress |
| `getTotalStorageUsed()`    | Get total bytes used    |

## Full Documentation

📖 [Complete API docs with casting, DRM, and playlist support](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/MEDIA.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
