/**
 * @rajeev02/video-editor — Export
 * Render pipeline: resolution, format, codec, compression, watermark, progress
 */

export type ExportFormat = "mp4" | "mov" | "webm" | "gif";
export type ExportCodec = "h264" | "h265" | "vp9" | "av1";
export type ExportQuality = "draft" | "standard" | "high" | "ultra";
export type ExportState =
  | "idle"
  | "preparing"
  | "rendering"
  | "encoding"
  | "completed"
  | "failed"
  | "cancelled";

export interface ExportConfig {
  format: ExportFormat;
  codec: ExportCodec;
  quality: ExportQuality;
  resolution: { width: number; height: number };
  fps: number;
  /** Bitrate in kbps (0 = auto based on quality) */
  videoBitrate: number;
  audioBitrate: number;
  /** Max output file size in bytes (0 = no limit) */
  maxSizeBytes: number;
  /** Add watermark */
  watermark?: {
    text?: string;
    imageUri?: string;
    position:
      | "top_left"
      | "top_right"
      | "bottom_left"
      | "bottom_right"
      | "center";
    opacity: number;
  };
  /** Output filename */
  outputFilename: string;
  /** Whether to include audio */
  includeAudio: boolean;
}

export interface ExportProgress {
  state: ExportState;
  /** 0-100 */
  percent: number;
  /** Current frame being processed */
  currentFrame: number;
  /** Total frames */
  totalFrames: number;
  /** Elapsed time in ms */
  elapsedMs: number;
  /** Estimated remaining time in ms */
  estimatedRemainingMs: number;
  /** Current output file size */
  currentSizeBytes: number;
}

export interface ExportResult {
  success: boolean;
  outputUri?: string;
  outputSizeBytes?: number;
  durationMs?: number;
  renderTimeMs?: number;
  error?: string;
}

/** Export preset configurations */
export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  config: Partial<ExportConfig>;
}

export function getExportPresets(): ExportPreset[] {
  return [
    {
      id: "social_story",
      name: "Instagram/WhatsApp Story",
      description: "1080x1920, 30fps, optimized for stories",
      config: {
        resolution: { width: 1080, height: 1920 },
        fps: 30,
        format: "mp4",
        codec: "h264",
        quality: "standard",
      },
    },
    {
      id: "social_reel",
      name: "Reels/Shorts",
      description: "1080x1920, 30fps, max 60s",
      config: {
        resolution: { width: 1080, height: 1920 },
        fps: 30,
        format: "mp4",
        codec: "h264",
        quality: "high",
      },
    },
    {
      id: "social_post",
      name: "Social Post (Square)",
      description: "1080x1080, 30fps",
      config: {
        resolution: { width: 1080, height: 1080 },
        fps: 30,
        format: "mp4",
        codec: "h264",
        quality: "standard",
      },
    },
    {
      id: "youtube_1080",
      name: "YouTube 1080p",
      description: "1920x1080, 30fps, high quality",
      config: {
        resolution: { width: 1920, height: 1080 },
        fps: 30,
        format: "mp4",
        codec: "h264",
        quality: "high",
      },
    },
    {
      id: "youtube_4k",
      name: "YouTube 4K",
      description: "3840x2160, 30fps, ultra quality",
      config: {
        resolution: { width: 3840, height: 2160 },
        fps: 30,
        format: "mp4",
        codec: "h265",
        quality: "ultra",
      },
    },
    {
      id: "whatsapp",
      name: "WhatsApp Share",
      description: "720p, compressed for sharing",
      config: {
        resolution: { width: 1280, height: 720 },
        fps: 30,
        format: "mp4",
        codec: "h264",
        quality: "draft",
        maxSizeBytes: 16 * 1024 * 1024,
      },
    },
    {
      id: "gif",
      name: "GIF",
      description: "480p, 15fps animated GIF",
      config: {
        resolution: { width: 480, height: 480 },
        fps: 15,
        format: "gif",
        codec: "h264",
        quality: "draft",
      },
    },
  ];
}

/**
 * Export Controller — manages render pipeline
 */
export class ExportController {
  private config: ExportConfig;
  private state: ExportState = "idle";
  private progress: ExportProgress;
  private listeners: Set<(progress: ExportProgress) => void> = new Set();

  constructor(config?: Partial<ExportConfig>) {
    this.config = {
      format: "mp4",
      codec: "h264",
      quality: "high",
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      videoBitrate: 0,
      audioBitrate: 128,
      maxSizeBytes: 0,
      outputFilename: `video_${Date.now()}.mp4`,
      includeAudio: true,
      ...config,
    };
    this.progress = {
      state: "idle",
      percent: 0,
      currentFrame: 0,
      totalFrames: 0,
      elapsedMs: 0,
      estimatedRemainingMs: 0,
      currentSizeBytes: 0,
    };
  }

  /** Start export (native layer performs actual rendering) */
  startExport(): void {
    this.state = "preparing";
    this.progress.state = "preparing";
    this.notifyProgress();
  }

  /** Update progress (called by native renderer) */
  updateProgress(
    currentFrame: number,
    totalFrames: number,
    sizeBytes: number,
  ): void {
    this.state = "rendering";
    this.progress = {
      state: "rendering",
      currentFrame,
      totalFrames,
      percent: totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0,
      elapsedMs: 0,
      estimatedRemainingMs: 0,
      currentSizeBytes: sizeBytes,
    };
    this.notifyProgress();
  }

  /** Called when export completes */
  onComplete(result: ExportResult): void {
    this.state = result.success ? "completed" : "failed";
    this.progress.state = this.state;
    this.progress.percent = result.success ? 100 : this.progress.percent;
    this.notifyProgress();
  }

  /** Cancel export */
  cancel(): void {
    this.state = "cancelled";
    this.progress.state = "cancelled";
    this.notifyProgress();
  }

  getConfig(): ExportConfig {
    return { ...this.config };
  }
  getProgress(): ExportProgress {
    return { ...this.progress };
  }
  getState(): ExportState {
    return this.state;
  }

  /** Estimate output file size in bytes */
  estimateFileSize(durationMs: number): number {
    const bitrateKbps = this.config.videoBitrate || this.getAutoVideoBitrate();
    const audioBitrate = this.config.includeAudio
      ? this.config.audioBitrate
      : 0;
    return (((bitrateKbps + audioBitrate) * (durationMs / 1000)) / 8) * 1000;
  }

  onProgress(listener: (progress: ExportProgress) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private getAutoVideoBitrate(): number {
    const pixels = this.config.resolution.width * this.config.resolution.height;
    const qualityMultiplier = {
      draft: 0.5,
      standard: 1,
      high: 1.5,
      ultra: 2.5,
    };
    const baseBitrate = pixels * 0.003; // ~3 bits per pixel baseline
    return baseBitrate * (qualityMultiplier[this.config.quality] ?? 1);
  }

  private notifyProgress(): void {
    for (const l of this.listeners) {
      try {
        l(this.progress);
      } catch {}
    }
  }
}
