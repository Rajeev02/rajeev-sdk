/**
 * @rajeev02/camera — Capture Module
 * Full camera abstraction: photo, video, HDR, panorama, timer, burst, night mode
 */

export type CameraFacing = "front" | "back";
export type FlashMode = "off" | "on" | "auto" | "torch";
export type CaptureMode =
  | "photo"
  | "video"
  | "portrait"
  | "panorama"
  | "night"
  | "burst"
  | "timelapse"
  | "slow_motion"
  | "document";
export type AspectRatio = "1:1" | "4:3" | "16:9" | "3:2" | "full";
export type GridType =
  | "none"
  | "rule_of_thirds"
  | "golden_ratio"
  | "square"
  | "crosshair";

export interface CameraConfig {
  facing: CameraFacing;
  flash: FlashMode;
  mode: CaptureMode;
  aspectRatio: AspectRatio;
  grid: GridType;
  /** Enable HDR (High Dynamic Range) */
  hdr: boolean;
  /** Enable image stabilization */
  stabilization: boolean;
  /** Timer delay in seconds (0 = no timer) */
  timerSeconds: number;
  /** Zoom level (1.0 = no zoom) */
  zoom: number;
  /** Max zoom level */
  maxZoom: number;
  /** Photo quality (0-100) */
  photoQuality: number;
  /** Video resolution */
  videoResolution: VideoResolution;
  /** Video frame rate */
  videoFps: number;
  /** Enable location tagging */
  geoTag: boolean;
  /** Enable sound on capture */
  shutterSound: boolean;
  /** Enable beauty/face enhancement mode */
  beautyMode: boolean;
  /** Beauty mode intensity (0-100) */
  beautyIntensity: number;
  /** Watermark text (e.g., timestamp, custom text) */
  watermark?: string;
  /** Mirror front camera preview */
  mirrorFrontCamera: boolean;
}

export type VideoResolution = "480p" | "720p" | "1080p" | "2K" | "4K";

export interface CapturedMedia {
  id: string;
  uri: string;
  type: "photo" | "video";
  width: number;
  height: number;
  /** File size in bytes */
  sizeBytes: number;
  /** MIME type */
  mimeType: string;
  /** Duration in ms (video only) */
  durationMs?: number;
  /** Thumbnail URI (video) */
  thumbnailUri?: string;
  /** EXIF metadata */
  exif?: ExifData;
  /** Timestamp */
  capturedAt: number;
}

export interface ExifData {
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

export interface FocusPoint {
  x: number; // 0-1 normalized
  y: number;
  autoExposure: boolean;
}

export interface CameraCapabilities {
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

/**
 * Camera Controller — manages camera state, capture, and settings
 */
export class CameraController {
  private config: CameraConfig;
  private isRecording: boolean = false;
  private recordingStartTime: number = 0;
  private capturedMedia: CapturedMedia[] = [];
  private listeners: Set<(event: CameraEvent) => void> = new Set();

  constructor(config?: Partial<CameraConfig>) {
    this.config = {
      facing: "back",
      flash: "auto",
      mode: "photo",
      aspectRatio: "4:3",
      grid: "rule_of_thirds",
      hdr: false,
      stabilization: true,
      timerSeconds: 0,
      zoom: 1.0,
      maxZoom: 10.0,
      photoQuality: 90,
      videoResolution: "1080p",
      videoFps: 30,
      geoTag: false,
      shutterSound: true,
      beautyMode: false,
      beautyIntensity: 50,
      mirrorFrontCamera: true,
      ...config,
    };
  }

  /** Switch between front and back camera */
  flipCamera(): void {
    this.config.facing = this.config.facing === "front" ? "back" : "front";
    this.emit({ type: "camera_flipped", facing: this.config.facing });
  }

  /** Set capture mode */
  setMode(mode: CaptureMode): void {
    this.config.mode = mode;
    this.emit({ type: "mode_changed", mode });
  }

  /** Set flash mode */
  setFlash(mode: FlashMode): void {
    this.config.flash = mode;
  }

  /** Cycle flash mode: off → on → auto */
  cycleFlash(): FlashMode {
    const cycle: FlashMode[] = ["off", "on", "auto"];
    const idx = (cycle.indexOf(this.config.flash) + 1) % cycle.length;
    this.config.flash = cycle[idx];
    return this.config.flash;
  }

  /** Set zoom level */
  setZoom(zoom: number): void {
    this.config.zoom = Math.max(1.0, Math.min(zoom, this.config.maxZoom));
  }

  /** Set focus point (tap to focus) */
  setFocusPoint(point: FocusPoint): void {
    this.emit({ type: "focus_set", point });
  }

  /** Set aspect ratio */
  setAspectRatio(ratio: AspectRatio): void {
    this.config.aspectRatio = ratio;
  }

  /** Set grid overlay */
  setGrid(grid: GridType): void {
    this.config.grid = grid;
  }

  /** Toggle HDR */
  toggleHdr(): boolean {
    this.config.hdr = !this.config.hdr;
    return this.config.hdr;
  }

  /** Toggle beauty mode */
  toggleBeautyMode(): boolean {
    this.config.beautyMode = !this.config.beautyMode;
    return this.config.beautyMode;
  }

  /** Set beauty intensity */
  setBeautyIntensity(intensity: number): void {
    this.config.beautyIntensity = Math.max(0, Math.min(100, intensity));
  }

  /** Set timer delay */
  setTimer(seconds: number): void {
    this.config.timerSeconds = seconds;
  }

  /** Cycle timer: 0 → 3 → 5 → 10 → 0 */
  cycleTimer(): number {
    const cycle = [0, 3, 5, 10];
    const idx = (cycle.indexOf(this.config.timerSeconds) + 1) % cycle.length;
    this.config.timerSeconds = cycle[idx];
    return this.config.timerSeconds;
  }

  /** Capture a photo (returns mock; native layer does actual capture) */
  capturePhoto(): string {
    const id = `photo_${Date.now()}`;
    this.emit({ type: "capture_started", mediaType: "photo" });
    // Native layer would capture and call onPhotoCaptured
    return id;
  }

  /** Start video recording */
  startRecording(): void {
    if (this.isRecording) return;
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.emit({ type: "recording_started" });
  }

  /** Stop video recording */
  stopRecording(): void {
    if (!this.isRecording) return;
    this.isRecording = false;
    const durationMs = Date.now() - this.recordingStartTime;
    this.emit({ type: "recording_stopped", durationMs });
  }

  /** Called by native layer when media is captured */
  onMediaCaptured(media: CapturedMedia): void {
    this.capturedMedia.push(media);
    this.emit({ type: "media_captured", media });
  }

  /** Get recording state */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /** Get recording duration */
  getRecordingDurationMs(): number {
    if (!this.isRecording) return 0;
    return Date.now() - this.recordingStartTime;
  }

  /** Get current config */
  getConfig(): CameraConfig {
    return { ...this.config };
  }

  /** Get captured media gallery */
  getCapturedMedia(): CapturedMedia[] {
    return [...this.capturedMedia];
  }

  /** Subscribe to camera events */
  on(listener: (event: CameraEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Get default capabilities (native layer overrides) */
  static getDefaultCapabilities(): CameraCapabilities {
    return {
      hasFlash: true,
      hasFrontCamera: true,
      hasBackCamera: true,
      maxZoom: 10,
      supportedModes: [
        "photo",
        "video",
        "portrait",
        "panorama",
        "night",
        "document",
      ],
      supportedResolutions: ["480p", "720p", "1080p", "4K"],
      supportedFps: [24, 30, 60, 120, 240],
      supportsHdr: true,
      supportsNightMode: true,
      supportsPortrait: true,
      supportsPanorama: true,
      supportsSlowMotion: true,
      supportsTimelapse: true,
      supportsBeautyMode: true,
      supportsOpticalZoom: false,
      supportedAspectRatios: ["1:1", "4:3", "16:9", "3:2", "full"],
    };
  }

  private emit(event: CameraEvent): void {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch {}
    }
  }
}

export type CameraEvent =
  | { type: "camera_flipped"; facing: CameraFacing }
  | { type: "mode_changed"; mode: CaptureMode }
  | { type: "focus_set"; point: FocusPoint }
  | { type: "capture_started"; mediaType: "photo" | "video" }
  | { type: "recording_started" }
  | { type: "recording_stopped"; durationMs: number }
  | { type: "media_captured"; media: CapturedMedia };
