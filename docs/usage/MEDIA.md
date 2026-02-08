# @rajeev02/media

**Unified media player & download manager** with adaptive streaming, PiP, casting, DRM (Widevine/FairPlay), quality selection, and offline downloads.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | ES module                  |
| watchOS 9+          | TypeScript | React Native module        |
| Wear OS             | TypeScript | React Native module        |
| Android Auto        | TypeScript | React Native module        |

---

## Installation

```bash
npm install @rajeev02/media
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
import { MediaPlayerController, DownloadManager } from "@rajeev02/media";

// Create player
const player = new MediaPlayerController({
  autoPlay: true,
  enablePiP: true,
  enableCast: true,
});

// Load adaptive stream
player.load({
  uri: "https://stream.example.com/video.m3u8",
  type: "video",
  title: "Demo Video",
  drm: {
    type: "widevine",
    licenseServerUrl: "https://drm.example.com/license",
  },
});

// Listen for events
player.on((event) => {
  if (event.type === "progress") updateSeekbar(event.currentTimeMs);
  if (event.type === "quality_changed") showQualityBadge(event.quality);
});

// Playback controls
player.play();
player.setRate(1.5);
player.setQuality("720p");
player.enterPiP();

// Downloads
const dm = new DownloadManager(2, 2 * 1024 ** 3); // 2 concurrent, 2GB max
dm.enqueue({
  id: "dl1",
  uri: "https://cdn.example.com/video.mp4",
  title: "Offline Video",
  estimatedSizeBytes: 500_000_000,
});

dm.onProgress((progress) => {
  console.log(`${progress.percentComplete}% at ${progress.speedBps} B/s`);
});
```

---

## API Reference

### `MediaPlayerController`

```typescript
new MediaPlayerController(config?: PlayerConfig)
```

#### Playback

| Method                            | Description                                |
| --------------------------------- | ------------------------------------------ |
| `load(source)`                    | Load media source (checks resume position) |
| `onReady(durationMs, qualities?)` | Native callback when media is ready        |
| `play()`                          | Start playback                             |
| `pause()`                         | Pause playback                             |
| `seek(positionMs)`                | Seek to position                           |
| `skipForward(ms?)`                | Skip forward (default 10s)                 |
| `skipBackward(ms?)`               | Skip backward (default 10s)                |

#### Settings

| Method                  | Description                      |
| ----------------------- | -------------------------------- |
| `setRate(rate)`         | Set playback rate (0.25x–4x)     |
| `setVolume(volume)`     | Set volume (0.0–1.0)             |
| `toggleMute()`          | Toggle mute                      |
| `setQuality(qualityId)` | Select quality level or `"auto"` |
| `getQualities()`        | List available quality levels    |

#### Display

| Method               | Description              |
| -------------------- | ------------------------ |
| `toggleFullscreen()` | Toggle fullscreen mode   |
| `enterPiP()`         | Enter Picture-in-Picture |
| `exitPiP()`          | Exit Picture-in-Picture  |

#### State

| Method                   | Returns         | Description                       |
| ------------------------ | --------------- | --------------------------------- |
| `getState()`             | `PlaybackState` | Get full playback state snapshot  |
| `getProgressPercent()`   | `number`        | Get current progress 0–100        |
| `getResumePosition(uri)` | `number`        | Get saved resume position for URI |
| `on(listener)`           | `() => void`    | Subscribe to player events        |
| `destroy()`              | `void`          | Release all resources             |

---

### `DownloadManager`

```typescript
new DownloadManager(maxConcurrent?: number, maxStorageBytes?: number)
```

#### Methods

| Method                             | Returns          | Description                         |
| ---------------------------------- | ---------------- | ----------------------------------- |
| `enqueue(request)`                 | `string`         | Queue download, returns download ID |
| `pause(id)`                        | `void`           | Pause a download                    |
| `resume(id)`                       | `void`           | Resume a paused download            |
| `cancel(id)`                       | `void`           | Cancel a download                   |
| `updateProgress(id, bytes, total)` | `void`           | Update download progress            |
| `getAll()`                         | `DownloadItem[]` | Get all downloads                   |
| `getCompleted()`                   | `DownloadItem[]` | Get completed downloads             |
| `getTotalStorageUsed()`            | `number`         | Get total storage used in bytes     |
| `getMaxStorage()`                  | `number`         | Get max storage limit               |
| `deleteDownload(id)`               | `void`           | Delete a downloaded file            |
| `clearCompleted()`                 | `void`           | Clear all completed downloads       |
| `onProgress(listener)`             | `() => void`     | Subscribe to download progress      |

---

## Types

```typescript
type MediaType = "video" | "audio" | "live_video" | "live_audio";
type PlayerState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "buffering"
  | "ended"
  | "error";
type DownloadState =
  | "queued"
  | "downloading"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

interface MediaSource {
  uri: string;
  type: MediaType;
  title?: string;
  drm?: DrmConfig;
  qualities?: QualityLevel[];
  headers?: Record<string, string>;
}

interface DrmConfig {
  type: "widevine" | "fairplay" | "clearkey";
  licenseServerUrl: string;
  headers?: Record<string, string>;
}

interface QualityLevel {
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  codec?: string;
}

interface PlayerConfig {
  autoPlay?: boolean;
  loop?: boolean;
  startPositionMs?: number;
  enablePiP?: boolean;
  enableCast?: boolean;
  backgroundAudio?: boolean;
}

interface PlaybackState {
  playerState: PlayerState;
  currentTimeMs: number;
  durationMs: number;
  volume: number;
  muted: boolean;
  rate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  isCasting: boolean;
  currentQuality?: QualityLevel;
}

interface DownloadRequest {
  id: string;
  uri: string;
  title: string;
  qualityId?: string;
  estimatedSizeBytes?: number;
  expiresAt?: number;
}

interface DownloadProgress {
  id: string;
  state: DownloadState;
  bytesDownloaded: number;
  totalBytes: number;
  percentComplete: number;
  speedBps: number;
  estimatedRemainingMs: number;
}
```
