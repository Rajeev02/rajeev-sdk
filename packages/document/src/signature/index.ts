/**
 * @rajeev02/document — Signature
 * Digital signature: draw, type, upload, place on documents, stamp, legal timestamp
 */

export type SignatureType = "drawn" | "typed" | "uploaded" | "aadhaar_esign";

export interface SignatureData {
  id: string;
  type: SignatureType;
  /** Base64 image of signature */
  imageBase64: string;
  /** For typed signatures */
  text?: string;
  fontFamily?: string;
  /** Color of signature */
  color: string;
  /** When created */
  createdAt: number;
  /** Whether this is the default signature */
  isDefault: boolean;
}

export interface SignaturePlacement {
  signatureId: string;
  pageNumber: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  /** Legal timestamp */
  timestamp: number;
  /** Signer name */
  signerName?: string;
  /** Signer email */
  signerEmail?: string;
  /** IP address at time of signing */
  ipAddress?: string;
  /** Reason for signing */
  reason?: string;
}

export interface SignatureConfig {
  /** Canvas width for drawn signatures */
  canvasWidth: number;
  /** Canvas height */
  canvasHeight: number;
  /** Default pen color */
  penColor: string;
  /** Pen thickness */
  penThickness: number;
  /** Available pen colors */
  availableColors: string[];
  /** Available fonts for typed signatures */
  availableFonts: string[];
  /** Whether to include timestamp overlay */
  includeTimestamp: boolean;
  /** Whether to require reason for signing */
  requireReason: boolean;
}

/**
 * Signature Manager — manages saved signatures and placement
 */
export class SignatureManager {
  private signatures: Map<string, SignatureData> = new Map();
  private placements: SignaturePlacement[] = [];
  private config: SignatureConfig;

  constructor(config?: Partial<SignatureConfig>) {
    this.config = {
      canvasWidth: 600,
      canvasHeight: 200,
      penColor: "#000000",
      penThickness: 3,
      availableColors: ["#000000", "#1E3A5F", "#8B0000", "#006400"],
      availableFonts: [
        "Dancing Script",
        "Great Vibes",
        "Allura",
        "Sacramento",
        "Alex Brush",
        "Pacifico",
      ],
      includeTimestamp: true,
      requireReason: false,
      ...config,
    };
  }

  /** Save a drawn signature */
  saveDrawnSignature(imageBase64: string, color: string = "#000000"): string {
    const id = `sig_${Date.now()}`;
    const sig: SignatureData = {
      id,
      type: "drawn",
      imageBase64,
      color,
      createdAt: Date.now(),
      isDefault: this.signatures.size === 0,
    };
    this.signatures.set(id, sig);
    return id;
  }

  /** Save a typed signature */
  saveTypedSignature(
    text: string,
    fontFamily: string,
    color: string = "#000000",
  ): string {
    const id = `sig_${Date.now()}`;
    const sig: SignatureData = {
      id,
      type: "typed",
      imageBase64: "",
      text,
      fontFamily,
      color,
      createdAt: Date.now(),
      isDefault: this.signatures.size === 0,
    };
    this.signatures.set(id, sig);
    return id;
  }

  /** Save an uploaded signature image */
  saveUploadedSignature(imageBase64: string): string {
    const id = `sig_${Date.now()}`;
    const sig: SignatureData = {
      id,
      type: "uploaded",
      imageBase64,
      color: "#000000",
      createdAt: Date.now(),
      isDefault: this.signatures.size === 0,
    };
    this.signatures.set(id, sig);
    return id;
  }

  /** Delete a saved signature */
  deleteSignature(id: string): boolean {
    return this.signatures.delete(id);
  }

  /** Set default signature */
  setDefault(id: string): void {
    for (const sig of this.signatures.values()) sig.isDefault = false;
    const sig = this.signatures.get(id);
    if (sig) sig.isDefault = true;
  }

  /** Get default signature */
  getDefault(): SignatureData | null {
    return (
      Array.from(this.signatures.values()).find((s) => s.isDefault) ?? null
    );
  }

  /** Get all saved signatures */
  getAllSignatures(): SignatureData[] {
    return Array.from(this.signatures.values());
  }

  /** Place signature on a document */
  placeSignature(placement: Omit<SignaturePlacement, "timestamp">): void {
    this.placements.push({ ...placement, timestamp: Date.now() });
  }

  /** Get all placements */
  getPlacements(): SignaturePlacement[] {
    return [...this.placements];
  }

  /** Get placements for a specific page */
  getPagePlacements(pageNumber: number): SignaturePlacement[] {
    return this.placements.filter((p) => p.pageNumber === pageNumber);
  }

  /** Remove a placement */
  removePlacement(index: number): void {
    this.placements.splice(index, 1);
  }

  /** Generate signing certificate data (for legal compliance) */
  generateSigningRecord(
    signerName: string,
    signerEmail: string,
    reason: string,
    documentHash: string,
  ): Record<string, unknown> {
    return {
      signerName,
      signerEmail,
      reason,
      documentHash,
      signedAt: new Date().toISOString(),
      signatureCount: this.placements.length,
      placements: this.placements.map((p) => ({
        page: p.pageNumber,
        x: p.position.x,
        y: p.position.y,
        timestamp: p.timestamp,
      })),
      certificateVersion: "1.0",
    };
  }

  getConfig(): SignatureConfig {
    return { ...this.config };
  }
}

/** Default signature placement sizes */
export function getSignatureSizePresets(): {
  id: string;
  label: string;
  width: number;
  height: number;
}[] {
  return [
    { id: "small", label: "Small", width: 0.15, height: 0.04 },
    { id: "medium", label: "Medium", width: 0.25, height: 0.06 },
    { id: "large", label: "Large", width: 0.35, height: 0.08 },
    { id: "full_width", label: "Full Width", width: 0.5, height: 0.1 },
  ];
}
