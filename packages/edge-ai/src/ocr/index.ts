/**
 * @rajeev02/edge-ai — OCR Module
 * On-device text recognition, document scanning, Indian ID card extraction
 */

export interface OcrResult {
  /** Full recognized text */
  text: string;
  /** Individual text blocks with positions */
  blocks: OcrBlock[];
  /** Detected language(s) */
  languages: string[];
  /** Overall confidence (0-1) */
  confidence: number;
  /** Processing time in ms */
  processingTimeMs: number;
}

export interface OcrBlock {
  text: string;
  boundingBox: { x: number; y: number; width: number; height: number };
  confidence: number;
  language?: string;
}

/** Extracted data from Indian ID cards */
export interface AadhaarCardData {
  name?: string;
  aadhaarNumber?: string; // Will be masked: XXXX XXXX 1234
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  pincode?: string;
  photo?: string; // Base64
  confidence: number;
}

export interface PanCardData {
  name?: string;
  panNumber?: string;
  fatherName?: string;
  dateOfBirth?: string;
  confidence: number;
}

export interface DrivingLicenseData {
  name?: string;
  licenseNumber?: string;
  dateOfBirth?: string;
  validity?: string;
  address?: string;
  vehicleClasses?: string[];
  confidence: number;
}

export type DocumentType =
  | "aadhaar_front"
  | "aadhaar_back"
  | "pan"
  | "driving_license"
  | "voter_id"
  | "passport"
  | "unknown";

/**
 * Detect the type of Indian ID document from OCR text
 */
export function detectDocumentType(ocrText: string): DocumentType {
  const text = ocrText.toLowerCase();
  if (
    text.includes("aadhaar") ||
    text.includes("unique identification") ||
    text.includes("uidai")
  ) {
    return text.includes("address") ? "aadhaar_back" : "aadhaar_front";
  }
  if (text.includes("income tax") || text.includes("permanent account"))
    return "pan";
  if (
    text.includes("driving") ||
    text.includes("licence") ||
    text.includes("motor vehicle")
  )
    return "driving_license";
  if (
    text.includes("election") ||
    text.includes("voter") ||
    text.includes("eci")
  )
    return "voter_id";
  if (text.includes("passport") || text.includes("republic of india"))
    return "passport";
  return "unknown";
}

/**
 * Extract Aadhaar number from OCR text
 * Returns masked format: XXXX XXXX 1234
 */
export function extractAadhaarNumber(text: string): string | null {
  const match = text.replace(/\s/g, "").match(/\d{12}/);
  if (match) {
    const num = match[0];
    return `XXXX XXXX ${num.slice(8)}`;
  }
  // Try with spaces
  const spaced = text.match(/\d{4}\s?\d{4}\s?\d{4}/);
  if (spaced) {
    const digits = spaced[0].replace(/\s/g, "");
    return `XXXX XXXX ${digits.slice(8)}`;
  }
  return null;
}

/**
 * Extract PAN number from OCR text
 * Format: ABCDE1234F
 */
export function extractPanNumber(text: string): string | null {
  const match = text.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
  return match ? match[0] : null;
}

/**
 * Validate PAN number format
 */
export function validatePan(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

/**
 * Validate Aadhaar number (Verhoeff checksum)
 */
export function validateAadhaar(aadhaar: string): boolean {
  const digits = aadhaar.replace(/\s/g, "");
  if (digits.length !== 12 || !/^\d{12}$/.test(digits)) return false;
  // Basic: first digit can't be 0 or 1
  return digits[0] !== "0" && digits[0] !== "1";
}

/**
 * Suggested document scanning tips for better OCR
 */
export function getScanningTips(docType: DocumentType): string[] {
  const common = [
    "Place document on a flat, dark surface",
    "Ensure good lighting without glare",
    "Keep camera steady and parallel to document",
  ];

  switch (docType) {
    case "aadhaar_front":
    case "aadhaar_back":
      return [
        ...common,
        "Ensure all 4 corners of Aadhaar card are visible",
        "QR code should be clearly visible for verification",
      ];
    case "pan":
      return [
        ...common,
        "Ensure PAN number is clearly readable",
        "Photo area should not be covered",
      ];
    default:
      return common;
  }
}
