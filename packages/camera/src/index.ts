/**
 * @rajeev02/camera
 * Advanced Camera & Photo Editor
 * Capture, filters, crop, adjust, draw, text, stickers, blur, frames, beauty mode
 *
 * @author Rajeev Kumar Joshi
 * @license MIT
 */

// Camera Capture
export { CameraController } from "./capture";
export type {
  CameraConfig,
  CameraFacing,
  FlashMode,
  CaptureMode,
  AspectRatio,
  GridType,
  VideoResolution,
  CapturedMedia,
  ExifData,
  FocusPoint,
  CameraCapabilities,
  CameraEvent,
} from "./capture";

// Photo Editor
export { PhotoEditorController, getCropPresets } from "./photo-editor";
export type {
  EditTool,
  CropPreset,
  AdjustmentValues,
  DrawConfig,
  TextOverlay,
  StickerOverlay,
  BlurRegion,
  FrameConfig,
  EditAction,
} from "./photo-editor";

// Filters
export {
  getBuiltInFilters,
  getFiltersByCategory,
  getFilterCategories,
} from "./filters";
export type { PhotoFilter, FilterCategory, FilterAdjustments } from "./filters";
