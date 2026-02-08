/**
 * @rajeev02/video-editor — Timeline
 * Multi-track timeline with clips, trim, split, reorder, layers
 */

export type TrackType = "video" | "audio" | "overlay" | "text" | "sticker";

export interface VideoClip {
  id: string;
  sourceUri: string;
  /** Start time in source media (ms) */
  sourceStartMs: number;
  /** End time in source media (ms) */
  sourceEndMs: number;
  /** Position on timeline (ms) */
  timelineStartMs: number;
  /** Duration on timeline (ms) */
  durationMs: number;
  /** Playback speed multiplier */
  speed: number;
  /** Whether audio is muted */
  muted: boolean;
  /** Volume (0-1) */
  volume: number;
  /** Thumbnail URI */
  thumbnailUri?: string;
  /** Original file width/height */
  width?: number;
  height?: number;
}

export interface AudioClip {
  id: string;
  sourceUri: string;
  title?: string;
  sourceStartMs: number;
  sourceEndMs: number;
  timelineStartMs: number;
  durationMs: number;
  volume: number;
  /** Fade in duration (ms) */
  fadeInMs: number;
  /** Fade out duration (ms) */
  fadeOutMs: number;
}

export interface TextClip {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  position: { x: number; y: number };
  timelineStartMs: number;
  durationMs: number;
  animation?: TextAnimation;
}

export type TextAnimation =
  | "none"
  | "fade_in"
  | "fade_out"
  | "slide_in_left"
  | "slide_in_right"
  | "slide_in_bottom"
  | "typewriter"
  | "bounce"
  | "zoom_in"
  | "scale_up";

export interface StickerClip {
  id: string;
  source: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  timelineStartMs: number;
  durationMs: number;
  animation?: "none" | "bounce" | "spin" | "pulse" | "shake";
}

export type TransitionType =
  | "none"
  | "crossfade"
  | "slide_left"
  | "slide_right"
  | "slide_up"
  | "slide_down"
  | "zoom_in"
  | "zoom_out"
  | "spin"
  | "blur"
  | "wipe_left"
  | "wipe_right"
  | "dissolve"
  | "glitch";

export interface Transition {
  id: string;
  type: TransitionType;
  durationMs: number;
  /** Between which two clip IDs */
  fromClipId: string;
  toClipId: string;
}

/**
 * Video Timeline — manages multi-track editing
 */
export class VideoTimeline {
  private videoClips: VideoClip[] = [];
  private audioClips: AudioClip[] = [];
  private textClips: TextClip[] = [];
  private stickerClips: StickerClip[] = [];
  private transitions: Transition[] = [];
  private currentTimeMs: number = 0;
  private listeners: Set<(event: TimelineEvent) => void> = new Set();

  /** Add a video clip */
  addVideoClip(clip: Omit<VideoClip, "id" | "timelineStartMs">): string {
    const id = `vclip_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const timelineStartMs = this.getTotalDuration();
    const fullClip: VideoClip = {
      ...clip,
      id,
      timelineStartMs,
      speed: clip.speed ?? 1,
      muted: clip.muted ?? false,
      volume: clip.volume ?? 1,
    };
    this.videoClips.push(fullClip);
    this.emit({ type: "clip_added", clipId: id, trackType: "video" });
    return id;
  }

  /** Add an audio track */
  addAudioClip(clip: Omit<AudioClip, "id">): string {
    const id = `aclip_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.audioClips.push({
      ...clip,
      id,
      fadeInMs: clip.fadeInMs ?? 0,
      fadeOutMs: clip.fadeOutMs ?? 0,
    });
    this.emit({ type: "clip_added", clipId: id, trackType: "audio" });
    return id;
  }

  /** Add text overlay */
  addTextClip(clip: Omit<TextClip, "id">): string {
    const id = `tclip_${Date.now()}`;
    this.textClips.push({ ...clip, id });
    return id;
  }

  /** Add sticker overlay */
  addStickerClip(clip: Omit<StickerClip, "id">): string {
    const id = `sclip_${Date.now()}`;
    this.stickerClips.push({ ...clip, id });
    return id;
  }

  /** Trim a video clip */
  trimClip(clipId: string, newStartMs: number, newEndMs: number): boolean {
    const clip = this.videoClips.find((c) => c.id === clipId);
    if (!clip) return false;
    clip.sourceStartMs = newStartMs;
    clip.sourceEndMs = newEndMs;
    clip.durationMs = (newEndMs - newStartMs) / clip.speed;
    this.recalculateTimeline();
    this.emit({ type: "clip_trimmed", clipId });
    return true;
  }

  /** Split a clip at a given time */
  splitClip(clipId: string, atTimeMs: number): string | null {
    const idx = this.videoClips.findIndex((c) => c.id === clipId);
    if (idx < 0) return null;
    const clip = this.videoClips[idx];
    const splitPoint =
      clip.sourceStartMs + (atTimeMs - clip.timelineStartMs) * clip.speed;
    if (splitPoint <= clip.sourceStartMs || splitPoint >= clip.sourceEndMs)
      return null;

    const newClipId = `vclip_${Date.now()}`;
    const newClip: VideoClip = {
      ...clip,
      id: newClipId,
      sourceStartMs: splitPoint,
      timelineStartMs: atTimeMs,
      durationMs: (clip.sourceEndMs - splitPoint) / clip.speed,
    };
    clip.sourceEndMs = splitPoint;
    clip.durationMs = (splitPoint - clip.sourceStartMs) / clip.speed;

    this.videoClips.splice(idx + 1, 0, newClip);
    this.recalculateTimeline();
    this.emit({ type: "clip_split", clipId, newClipId });
    return newClipId;
  }

  /** Remove a clip */
  removeClip(clipId: string): boolean {
    const before = this.videoClips.length + this.audioClips.length;
    this.videoClips = this.videoClips.filter((c) => c.id !== clipId);
    this.audioClips = this.audioClips.filter((c) => c.id !== clipId);
    this.textClips = this.textClips.filter((c) => c.id !== clipId);
    this.stickerClips = this.stickerClips.filter((c) => c.id !== clipId);
    const removed = this.videoClips.length + this.audioClips.length < before;
    if (removed) {
      this.recalculateTimeline();
      this.emit({ type: "clip_removed", clipId });
    }
    return removed;
  }

  /** Reorder video clips */
  reorderClip(clipId: string, newIndex: number): boolean {
    const idx = this.videoClips.findIndex((c) => c.id === clipId);
    if (idx < 0 || newIndex < 0 || newIndex >= this.videoClips.length)
      return false;
    const [clip] = this.videoClips.splice(idx, 1);
    this.videoClips.splice(newIndex, 0, clip);
    this.recalculateTimeline();
    return true;
  }

  /** Set clip speed */
  setClipSpeed(clipId: string, speed: number): void {
    const clip = this.videoClips.find((c) => c.id === clipId);
    if (clip) {
      clip.speed = Math.max(0.1, Math.min(8, speed));
      clip.durationMs = (clip.sourceEndMs - clip.sourceStartMs) / clip.speed;
      this.recalculateTimeline();
    }
  }

  /** Add transition between clips */
  addTransition(
    fromClipId: string,
    toClipId: string,
    type: TransitionType,
    durationMs: number = 500,
  ): string {
    const id = `trans_${Date.now()}`;
    this.transitions.push({ id, type, durationMs, fromClipId, toClipId });
    return id;
  }

  /** Get total duration of the timeline */
  getTotalDuration(): number {
    if (this.videoClips.length === 0) return 0;
    const last = this.videoClips[this.videoClips.length - 1];
    return last.timelineStartMs + last.durationMs;
  }

  /** Seek to position */
  seek(timeMs: number): void {
    this.currentTimeMs = Math.max(0, Math.min(timeMs, this.getTotalDuration()));
  }

  /** Get current time */
  getCurrentTime(): number {
    return this.currentTimeMs;
  }

  /** Get all clips */
  getVideoClips(): VideoClip[] {
    return [...this.videoClips];
  }
  getAudioClips(): AudioClip[] {
    return [...this.audioClips];
  }
  getTextClips(): TextClip[] {
    return [...this.textClips];
  }
  getStickerClips(): StickerClip[] {
    return [...this.stickerClips];
  }
  getTransitions(): Transition[] {
    return [...this.transitions];
  }

  /** Get clip count */
  getClipCount(): number {
    return this.videoClips.length + this.audioClips.length;
  }

  /** Subscribe to events */
  on(listener: (event: TimelineEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private recalculateTimeline(): void {
    let pos = 0;
    for (const clip of this.videoClips) {
      clip.timelineStartMs = pos;
      pos += clip.durationMs;
    }
  }

  private emit(event: TimelineEvent): void {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch {}
    }
  }
}

export type TimelineEvent =
  | { type: "clip_added"; clipId: string; trackType: TrackType }
  | { type: "clip_removed"; clipId: string }
  | { type: "clip_trimmed"; clipId: string }
  | { type: "clip_split"; clipId: string; newClipId: string };
