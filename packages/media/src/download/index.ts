/**
 * @rajeev02/media — Download Manager
 * Offline media downloads with quality selection, pause/resume, storage management
 */

export type DownloadState =
  | "queued"
  | "downloading"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface DownloadRequest {
  id: string;
  uri: string;
  title: string;
  qualityId?: string;
  /** Estimated size in bytes */
  estimatedSizeBytes?: number;
  /** Expiry time for downloaded content (DRM) */
  expiresAt?: number;
  metadata?: Record<string, unknown>;
}

export interface DownloadProgress {
  id: string;
  state: DownloadState;
  bytesDownloaded: number;
  totalBytes: number;
  percentComplete: number;
  speedBps: number;
  estimatedRemainingMs: number;
}

/**
 * Download Manager — tracks offline media downloads
 */
export class DownloadManager {
  private downloads: Map<
    string,
    DownloadRequest & {
      state: DownloadState;
      bytesDownloaded: number;
      totalBytes: number;
      startedAt: number;
    }
  > = new Map();
  private listeners: Set<(id: string, progress: DownloadProgress) => void> =
    new Set();
  private maxConcurrent: number;
  private maxStorageBytes: number;

  constructor(
    maxConcurrent: number = 2,
    maxStorageBytes: number = 2 * 1024 * 1024 * 1024,
  ) {
    this.maxConcurrent = maxConcurrent;
    this.maxStorageBytes = maxStorageBytes;
  }

  /** Queue a download */
  enqueue(request: DownloadRequest): boolean {
    if (this.downloads.has(request.id)) return false;
    if (
      this.getTotalStorageUsed() + (request.estimatedSizeBytes ?? 0) >
      this.maxStorageBytes
    )
      return false;

    this.downloads.set(request.id, {
      ...request,
      state: "queued",
      bytesDownloaded: 0,
      totalBytes: request.estimatedSizeBytes ?? 0,
      startedAt: Date.now(),
    });
    return true;
  }

  /** Pause a download */
  pause(id: string): boolean {
    const dl = this.downloads.get(id);
    if (dl && dl.state === "downloading") {
      dl.state = "paused";
      return true;
    }
    return false;
  }

  /** Resume a download */
  resume(id: string): boolean {
    const dl = this.downloads.get(id);
    if (dl && dl.state === "paused") {
      dl.state = "queued";
      return true;
    }
    return false;
  }

  /** Cancel and remove a download */
  cancel(id: string): boolean {
    const dl = this.downloads.get(id);
    if (dl) {
      dl.state = "cancelled";
      this.downloads.delete(id);
      return true;
    }
    return false;
  }

  /** Update progress (called by native downloader) */
  updateProgress(
    id: string,
    bytesDownloaded: number,
    totalBytes: number,
  ): void {
    const dl = this.downloads.get(id);
    if (!dl) return;
    dl.bytesDownloaded = bytesDownloaded;
    dl.totalBytes = totalBytes;
    dl.state = "downloading";

    const elapsed = Date.now() - dl.startedAt;
    const speed = elapsed > 0 ? (bytesDownloaded / elapsed) * 1000 : 0;
    const remaining =
      speed > 0 ? ((totalBytes - bytesDownloaded) / speed) * 1000 : 0;

    const progress: DownloadProgress = {
      id,
      state: "downloading",
      bytesDownloaded,
      totalBytes,
      percentComplete:
        totalBytes > 0 ? (bytesDownloaded / totalBytes) * 100 : 0,
      speedBps: speed,
      estimatedRemainingMs: remaining,
    };

    if (bytesDownloaded >= totalBytes) {
      dl.state = "completed";
      progress.state = "completed";
      progress.percentComplete = 100;
    }
    this.notify(id, progress);
  }

  /** Get all downloads */
  getAll(): (DownloadRequest & { state: DownloadState })[] {
    return Array.from(this.downloads.values());
  }

  /** Get completed downloads */
  getCompleted(): DownloadRequest[] {
    return Array.from(this.downloads.values()).filter(
      (d) => d.state === "completed",
    );
  }

  /** Get total storage used by completed downloads */
  getTotalStorageUsed(): number {
    return Array.from(this.downloads.values())
      .filter((d) => d.state === "completed")
      .reduce((sum, d) => sum + d.totalBytes, 0);
  }

  /** Get max storage in bytes */
  getMaxStorage(): number {
    return this.maxStorageBytes;
  }

  /** Delete a completed download */
  deleteDownload(id: string): boolean {
    return this.downloads.delete(id);
  }

  /** Clear all completed downloads */
  clearCompleted(): number {
    let count = 0;
    for (const [id, dl] of this.downloads) {
      if (dl.state === "completed") {
        this.downloads.delete(id);
        count++;
      }
    }
    return count;
  }

  /** Subscribe to progress updates */
  onProgress(
    listener: (id: string, progress: DownloadProgress) => void,
  ): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(id: string, progress: DownloadProgress): void {
    for (const l of this.listeners) {
      try {
        l(id, progress);
      } catch {}
    }
  }
}
