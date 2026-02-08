/**
 * @rajeev02/video-editor
 * Video Editor — timeline, effects, transitions, export
 * Trim, merge, split, reorder, speed, filters, text, stickers, music, green screen
 *
 * @author Rajeev Kumar Joshi
 * @license MIT
 */

// Timeline
export { VideoTimeline } from "./timeline";
export type {
  VideoClip,
  AudioClip,
  TextClip,
  StickerClip,
  Transition,
  TransitionType,
  TrackType,
  TextAnimation,
  TimelineEvent,
} from "./timeline";

// Effects
export { getVideoFilterPresets, getTransitionTypes } from "./effects";
export type {
  VideoEffect,
  ColorGrade,
  SpeedRamp,
  KenBurnsEffect,
  ChromaKeyConfig,
  VideoFilterPreset,
} from "./effects";

// Export
export { ExportController, getExportPresets } from "./export";
export type {
  ExportConfig,
  ExportProgress,
  ExportResult,
  ExportPreset,
  ExportFormat,
  ExportCodec,
  ExportQuality,
  ExportState,
} from "./export";
