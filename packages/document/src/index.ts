/**
 * @rajeev02/document
 * Document Picker, Editor & Signature
 * File picker, PDF annotation, stamps, form filling, digital signatures
 *
 * @author Rajeev Joshi
 * @license MIT
 */

// Picker
export {
  categorizeFile,
  getMimeTypesForCategory,
  formatFileSize,
  getFileExtension,
  getFileIcon,
  getPickerPreset,
} from "./picker";
export type {
  DocumentSource,
  DocumentCategory,
  PickerConfig,
  PickedDocument,
} from "./picker";

// Editor
export { DocumentEditorController } from "./editor";
export type {
  AnnotationTool,
  Annotation,
  StampType,
  FormField,
  DocumentPage,
  DocEditorEvent,
} from "./editor";

// Signature
export { SignatureManager, getSignatureSizePresets } from "./signature";
export type {
  SignatureType,
  SignatureData,
  SignaturePlacement,
  SignatureConfig,
} from "./signature";
