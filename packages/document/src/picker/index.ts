/**
 * @rajeev02/document — Picker
 * Universal document picker: gallery, camera, files, cloud, recent, multi-select
 */

export type DocumentSource =
  | "gallery"
  | "camera"
  | "files"
  | "google_drive"
  | "dropbox"
  | "onedrive"
  | "icloud"
  | "recent";
export type DocumentCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "any";

export interface PickerConfig {
  /** Allowed sources */
  sources: DocumentSource[];
  /** Allowed file categories */
  categories: DocumentCategory[];
  /** Custom MIME types (e.g., ['application/pdf', 'image/jpeg']) */
  mimeTypes?: string[];
  /** Allow multiple selection */
  multiple: boolean;
  /** Max files in multi-select */
  maxFiles?: number;
  /** Max file size per file (bytes) */
  maxSizeBytes?: number;
  /** Total max size (bytes) */
  totalMaxSizeBytes?: number;
  /** Enable camera document scanning mode */
  enableDocumentScan?: boolean;
  /** Compress images before returning */
  compressImages?: boolean;
  /** Max image dimension after compression */
  maxImageDimension?: number;
}

export interface PickedDocument {
  id: string;
  name: string;
  uri: string;
  mimeType: string;
  sizeBytes: number;
  category: DocumentCategory;
  source: DocumentSource;
  /** Image/video width */
  width?: number;
  /** Image/video height */
  height?: number;
  /** Video/audio duration ms */
  durationMs?: number;
  /** Thumbnail URI */
  thumbnailUri?: string;
  /** Last modified timestamp */
  modifiedAt?: number;
  /** File extension */
  extension: string;
}

/** MIME type to category mapping */
export function categorizeFile(mimeType: string): DocumentCategory {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  )
    return "document";
  if (
    mimeType.includes("sheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("csv")
  )
    return "spreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "presentation";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar") ||
    mimeType.includes("7z")
  )
    return "archive";
  return "any";
}

/** Get MIME types for a category */
export function getMimeTypesForCategory(category: DocumentCategory): string[] {
  switch (category) {
    case "image":
      return [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/heic",
        "image/heif",
        "image/bmp",
        "image/svg+xml",
      ];
    case "video":
      return [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
        "video/3gpp",
      ];
    case "audio":
      return [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/aac",
        "audio/flac",
        "audio/x-m4a",
      ];
    case "pdf":
      return ["application/pdf"];
    case "document":
      return [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/rtf",
        "application/rtf",
      ];
    case "spreadsheet":
      return [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
    case "presentation":
      return [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
    case "archive":
      return [
        "application/zip",
        "application/x-rar-compressed",
        "application/x-7z-compressed",
        "application/gzip",
      ];
    case "any":
      return ["*/*"];
    default:
      return ["*/*"];
  }
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Get file extension from name or URI */
export function getFileExtension(nameOrUri: string): string {
  const parts = nameOrUri.split(".");
  return parts.length > 1
    ? parts[parts.length - 1].toLowerCase().split("?")[0]
    : "";
}

/** Get icon name for file category (for UI rendering) */
export function getFileIcon(category: DocumentCategory): string {
  const icons: Record<DocumentCategory, string> = {
    image: "image",
    video: "film",
    audio: "music",
    pdf: "file-text",
    document: "file-text",
    spreadsheet: "table",
    presentation: "monitor",
    archive: "archive",
    any: "file",
  };
  return icons[category] ?? "file";
}

/** Default picker configs for common use cases */
export function getPickerPreset(
  preset: "photo" | "video" | "document" | "kyc_document" | "any",
): PickerConfig {
  switch (preset) {
    case "photo":
      return {
        sources: ["gallery", "camera"],
        categories: ["image"],
        multiple: false,
        compressImages: true,
        maxImageDimension: 2048,
        maxSizeBytes: 10 * 1024 * 1024,
      };
    case "video":
      return {
        sources: ["gallery", "camera"],
        categories: ["video"],
        multiple: false,
        maxSizeBytes: 100 * 1024 * 1024,
      };
    case "document":
      return {
        sources: ["files", "google_drive", "recent"],
        categories: ["pdf", "document", "spreadsheet"],
        multiple: true,
        maxFiles: 10,
        maxSizeBytes: 25 * 1024 * 1024,
      };
    case "kyc_document":
      return {
        sources: ["camera", "gallery"],
        categories: ["image", "pdf"],
        multiple: false,
        enableDocumentScan: true,
        compressImages: true,
        maxSizeBytes: 5 * 1024 * 1024,
      };
    case "any":
      return {
        sources: ["files", "gallery", "camera", "google_drive", "recent"],
        categories: ["any"],
        multiple: true,
        maxFiles: 20,
      };
  }
}
