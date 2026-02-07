/**
 * @rajeev02/media — Player Core
 * State machine for media playback — controls, events, quality selection, PiP, casting
 */

export type PlayerState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "buffering"
  | "ended"
  | "error";
export type MediaType = "video" | "audio" | "live_video" | "live_audio";

export interface MediaSource {
  uri: string;
  type: MediaType;
  title?: string;
  subtitle?: string;
  thumbnailUri?: string;
  durationMs?: number;
  /** DRM configuration */
  drm?: DrmConfig;
  /** Available quality levels (for adaptive streaming) */
  qualities?: QualityLevel[];
  /** Headers for authenticated streams */
  headers?: Record<string, string>;
  /** Offline download ID (if playing from local storage) */
  offlineId?: string;
}

export interface DrmConfig {
  type: "widevine" | "fairplay" | "clearkey";
  licenseServerUrl: string;
  headers?: Record<string, string>;
  certificateUrl?: string;
}

export interface QualityLevel {
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  codec?: string;
}

export interface PlaybackState {
  state: PlayerState;
  currentTimeMs: number;
  durationMs: number;
  bufferedMs: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
  isPiP: boolean;
  isCasting: boolean;
  isFullscreen: boolean;
  currentQuality: QualityLevel | null;
  autoQuality: boolean;
  error?: string;
}

export interface PlayerConfig {
  /** Auto-play when source is loaded */
  autoPlay?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Start at specific position (ms) — for resume */
  startPositionMs?: number;
  /** Max buffer duration (ms). Default: 30000 */
  maxBufferMs?: number;
  /** Min buffer before playback starts (ms). Default: 5000 */
  minBufferMs?: number;
  /** Preferred quality level (or 'auto') */
  preferredQuality?: string;
  /** Enable PiP support */
  enablePiP?: boolean;
  /** Enable casting support (Chromecast/AirPlay) */
  enableCast?: boolean;
  /** Background audio playback */
  backgroundAudio?: boolean;
}

export type PlayerEvent =
  | { type: "stateChange"; state: PlayerState }
  | {
      type: "progress";
      currentTimeMs: number;
      durationMs: number;
      bufferedMs: number;
    }
  | { type: "qualityChange"; quality: QualityLevel }
  | { type: "error"; code: string; message: string }
  | { type: "ended" }
  | { type: "pipChange"; active: boolean }
  | { type: "castChange"; active: boolean; deviceName?: string }
  | { type: "seekComplete"; positionMs: number };

/**
 * Media Player Controller
 * Abstract player that works with any native backend (ExoPlayer, AVPlayer, web <video>)
 */
export class MediaPlayerController {
  private source: MediaSource | null = null;
  private config: PlayerConfig;
  private state: PlaybackState;
  private listeners: Set<(event: PlayerEvent) => void> = new Set();
  private watchHistory: Map<string, number> = new Map(); // uri → last position

  constructor(config: PlayerConfig = {}) {
    this.config = {
      autoPlay: false,
      loop: false,
      startPositionMs: 0,
      maxBufferMs: 30000,
      minBufferMs: 5000,
      preferredQuality: "auto",
      enablePiP: true,
      enableCast: false,
      backgroundAudio: false,
      ...config,
    };
    this.state = this.createInitialState();
  }

  /** Load a media source */
  load(source: MediaSource): void {
    this.source = source;
    this.setState("loading");
    // Check for resume position
    const savedPos = this.watchHistory.get(source.uri);
    if (savedPos && savedPos > 0 && !this.config.startPositionMs) {
      this.config.startPositionMs = savedPos;
    }
    this.emit({ type: "stateChange", state: "loading" });
  }

  /** Called by native layer when media is ready */
  onReady(durationMs: number, qualities?: QualityLevel[]): void {
    this.state.durationMs = durationMs;
    if (qualities && this.source) {
      this.source.qualities = qualities;
    }
    this.setState("ready");
    if (this.config.autoPlay) this.play();
  }

  /** Play */
  play(): void {
    if (this.state.state === "ended" && this.config.loop) {
      this.seek(0);
    }
    this.setState("playing");
  }

  /** Pause */
  pause(): void {
    this.saveProgress();
    this.setState("paused");
  }

  /** Seek to position */
  seek(positionMs: number): void {
    this.state.currentTimeMs = Math.max(
      0,
      Math.min(positionMs, this.state.durationMs),
    );
    this.emit({ type: "seekComplete", positionMs: this.state.currentTimeMs });
  }

  /** Skip forward */
  skipForward(ms: number = 10000): void {
    this.seek(this.state.currentTimeMs + ms);
  }

  /** Skip backward */
  skipBackward(ms: number = 10000): void {
    this.seek(this.state.currentTimeMs - ms);
  }

  /** Set playback rate */
  setRate(rate: number): void {
    this.state.playbackRate = Math.max(0.25, Math.min(4, rate));
  }

  /** Set volume (0.0 - 1.0) */
  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
  }

  /** Toggle mute */
  toggleMute(): void {
    this.state.muted = !this.state.muted;
  }

  /** Toggle fullscreen */
  toggleFullscreen(): void {
    this.state.isFullscreen = !this.state.isFullscreen;
  }

  /** Enter PiP */
  enterPiP(): void {
    if (this.config.enablePiP) {
      this.state.isPiP = true;
      this.emit({ type: "pipChange", active: true });
    }
  }

  /** Exit PiP */
  exitPiP(): void {
    this.state.isPiP = false;
    this.emit({ type: "pipChange", active: false });
  }

  /** Select quality level */
  setQuality(qualityId: string): void {
    if (qualityId === "auto") {
      this.state.autoQuality = true;
      this.state.currentQuality = null;
      return;
    }
    const quality = this.source?.qualities?.find((q) => q.id === qualityId);
    if (quality) {
      this.state.autoQuality = false;
      this.state.currentQuality = quality;
      this.emit({ type: "qualityChange", quality });
    }
  }

  /** Get available quality levels */
  getQualities(): QualityLevel[] {
    return this.source?.qualities ?? [];
  }

  /** Update progress (called by native layer on timer) */
  onProgress(currentTimeMs: number, bufferedMs: number): void {
    this.state.currentTimeMs = currentTimeMs;
    this.state.bufferedMs = bufferedMs;
    this.emit({
      type: "progress",
      currentTimeMs,
      durationMs: this.state.durationMs,
      bufferedMs,
    });
  }

  /** Called when playback ends */
  onEnded(): void {
    this.setState("ended");
    this.watchHistory.delete(this.source?.uri ?? "");
    this.emit({ type: "ended" });
    if (this.config.loop) this.play();
  }

  /** Called on error */
  onError(code: string, message: string): void {
    this.setState("error");
    this.state.error = message;
    this.emit({ type: "error", code, message });
  }

  /** Get current playback state */
  getState(): PlaybackState {
    return { ...this.state };
  }
  getSource(): MediaSource | null {
    return this.source;
  }
  getConfig(): PlayerConfig {
    return { ...this.config };
  }

  /** Get watch progress percentage (0-100) */
  getProgressPercent(): number {
    if (this.state.durationMs === 0) return 0;
    return (this.state.currentTimeMs / this.state.durationMs) * 100;
  }

  /** Get resume position for a URI */
  getResumePosition(uri: string): number {
    return this.watchHistory.get(uri) ?? 0;
  }

  /** Subscribe to events */
  on(listener: (event: PlayerEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Destroy player */
  destroy(): void {
    this.saveProgress();
    this.source = null;
    this.setState("idle");
    this.listeners.clear();
  }

  /** Suggest quality based on network bandwidth */
  static suggestQuality(
    qualities: QualityLevel[],
    bandwidthKbps: number,
  ): QualityLevel | null {
    const bandwidthBps = bandwidthKbps * 1000;
    // Pick highest quality that fits within 80% of available bandwidth
    const suitable = qualities
      .filter((q) => q.bitrate <= bandwidthBps * 0.8)
      .sort((a, b) => b.bitrate - a.bitrate);
    return suitable[0] ?? qualities[qualities.length - 1] ?? null;
  }

  private saveProgress(): void {
    if (this.source && this.state.currentTimeMs > 5000) {
      this.watchHistory.set(this.source.uri, this.state.currentTimeMs);
    }
  }

  private setState(state: PlayerState): void {
    this.state.state = state;
    this.emit({ type: "stateChange", state });
  }

  private emit(event: PlayerEvent): void {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch {}
    }
  }

  private createInitialState(): PlaybackState {
    return {
      state: "idle",
      currentTimeMs: 0,
      durationMs: 0,
      bufferedMs: 0,
      playbackRate: 1,
      volume: 1,
      muted: false,
      isPiP: false,
      isCasting: false,
      isFullscreen: false,
      currentQuality: null,
      autoQuality: true,
    };
  }
}
