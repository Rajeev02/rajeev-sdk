/**
 * @rajeev02/edge-ai
 * Edge AI / On-Device ML Toolkit
 * OCR, face detection, voice commands, document scanning
 *
 * @author Rajeev Kumar Joshi
 * @license MIT
 */
export { ModelManager } from "./pipeline";
export type {
  ModelConfig,
  InferenceResult,
  BoundingBox,
  MLBackend,
  ModelState,
} from "./pipeline";

export {
  detectDocumentType,
  extractAadhaarNumber,
  extractPanNumber,
  validatePan,
  validateAadhaar,
  getScanningTips,
} from "./ocr";
export type {
  OcrResult,
  OcrBlock,
  AadhaarCardData,
  PanCardData,
  DrivingLicenseData,
  DocumentType,
} from "./ocr";

export {
  parseVoiceIntent,
  getTtsConfig,
  SUPPORTED_VOICE_LANGUAGES,
} from "./voice";
export type {
  VoiceConfig,
  SpeechResult,
  VoiceIntent,
  VoiceState,
} from "./voice";
