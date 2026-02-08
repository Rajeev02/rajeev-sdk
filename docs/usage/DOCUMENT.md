# @rajeev02/document

**Document picker, PDF annotation & editor, and digital signature management** with multi-source file selection, stamps, form filling, and legal signing records.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | ES module                  |
| watchOS 9+          | TypeScript | React Native module        |
| Wear OS             | TypeScript | React Native module        |
| Android Auto        | TypeScript | React Native module        |

---

## Prerequisites

> **⚠️ This library provides document editing state management.** It does NOT render PDFs or display a file picker. It manages annotation tracking, signature placement, form field values, page navigation, and undo/redo history.

Before using `@rajeev02/document`, you need:

1. **A file picker library:**
   - Expo: [`expo-document-picker`](https://docs.expo.dev/versions/latest/sdk/document-picker/)
   - Bare RN: [`react-native-document-picker`](https://github.com/rnmods/react-native-document-picker)
2. **A PDF rendering library:**
   - React Native: [`react-native-pdf`](https://github.com/wonday/react-native-pdf)
   - Web: [`pdf.js`](https://mozilla.github.io/pdf.js/)
3. **A canvas/drawing component** (for signature capture — the library stores/places signatures but doesn't capture drawn strokes)
4. **File permissions:**
   - iOS: `NSPhotoLibraryUsageDescription` in `Info.plist`
   - Android: `READ_EXTERNAL_STORAGE` / `READ_MEDIA_IMAGES` permissions

---

## Installation

```bash
npm install @rajeev02/document
```

### Peer Dependencies

| Package        | Version                 |
| -------------- | ----------------------- |
| `react`        | `>=18.3.0`              |
| `react-native` | `>=0.84.0`              |
| `expo`         | `>=54.0.0` _(optional)_ |

---

## Quick Start

```typescript
import {
  DocumentEditorController,
  SignatureManager,
  getPickerPreset,
  categorizeFile,
  formatFileSize,
} from "@rajeev02/document";

// Document picker preset
const kycPreset = getPickerPreset("kyc_document");
// → { sources: ["camera", "gallery", "files"], categories: ["image", "pdf"], ... }

// Categorize and format
categorizeFile("application/pdf"); // → "pdf"
formatFileSize(2_457_600); // → "2.3 MB"

// PDF Editor
const editor = new DocumentEditorController("file://contract.pdf", 10);
editor.goToPage(3);
editor.addHighlight(0.1, 0.2, 0.5, 0.03);
editor.addStamp(0.7, 0.9, "approved");
editor.setFormFieldValue("name", "Rajeev Kumar Joshi");

// Signatures
const sigMgr = new SignatureManager();
const sigId = sigMgr.saveTypedSignature("Rajeev Kumar Joshi", "Dancing Script");
sigMgr.placeSignature({
  signatureId: sigId,
  pageNumber: 10,
  position: { x: 0.6, y: 0.9 },
  size: { width: 0.25, height: 0.06 },
  rotation: 0,
});
const record = sigMgr.generateSigningRecord(
  "Rajeev Kumar Joshi",
  "rajeev@example.com",
  "Contract acceptance",
  "sha256:abc...",
);
```

---

## API Reference

### `DocumentEditorController`

```typescript
new DocumentEditorController(documentUri: string, pageCount: number)
```

#### Navigation

| Method           | Description               |
| ---------------- | ------------------------- |
| `goToPage(page)` | Navigate to specific page |
| `nextPage()`     | Go to next page           |
| `prevPage()`     | Go to previous page       |
| `setZoom(level)` | Set zoom level (0.5–5.0)  |

#### Annotations

| Method                              | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `setActiveTool(tool)`               | Set annotation tool                      |
| `setActiveColor(color)`             | Set annotation color                     |
| `setStrokeWidth(width)`             | Set stroke width                         |
| `addAnnotation(annotation)`         | Add generic annotation                   |
| `addHighlight(x, y, width, height)` | Add yellow highlight                     |
| `addTextNote(x, y, text)`           | Add sticky note                          |
| `addTextBox(x, y, text, fontSize)`  | Add text box                             |
| `addStamp(x, y, type)`              | Add stamp (approved/rejected/draft/etc.) |
| `addFreehand(points)`               | Add freehand drawing                     |
| `removeAnnotation(id)`              | Remove annotation by ID                  |
| `getAnnotations()`                  | Get all annotations on current page      |
| `clearAnnotations()`                | Clear all annotations                    |

#### Page Management

| Method                    | Description         |
| ------------------------- | ------------------- |
| `rotatePage(degrees)`     | Rotate current page |
| `deletePage(page)`        | Delete a page       |
| `reorderPages(pageOrder)` | Reorder all pages   |

#### Form Filling

| Method                              | Description                 |
| ----------------------------------- | --------------------------- |
| `setFormFieldValue(fieldId, value)` | Fill form field             |
| `getFormFields()`                   | Get all form fields         |
| `loadFormFields(fields)`            | Load form field definitions |

#### History

| Method   | Description             |
| -------- | ----------------------- |
| `undo()` | Undo last action        |
| `redo()` | Redo last undone action |

---

### `SignatureManager`

```typescript
new SignatureManager(config?: SignatureConfig)
```

#### Methods

| Method                                             | Returns                  | Description                         |
| -------------------------------------------------- | ------------------------ | ----------------------------------- |
| `saveDrawnSignature(imageBase64, color?)`          | `string`                 | Save drawn signature, returns ID    |
| `saveTypedSignature(text, fontFamily?, color?)`    | `string`                 | Save typed signature, returns ID    |
| `saveUploadedSignature(imageBase64)`               | `string`                 | Save uploaded signature, returns ID |
| `deleteSignature(id)`                              | `boolean`                | Delete a saved signature            |
| `setDefault(id)`                                   | `void`                   | Set default signature               |
| `getDefault()`                                     | `Signature \| undefined` | Get default signature               |
| `getAllSignatures()`                               | `Signature[]`            | List all saved signatures           |
| `placeSignature(placement)`                        | `void`                   | Place signature on document         |
| `getPlacements()`                                  | `SignaturePlacement[]`   | Get all placements                  |
| `getPagePlacements(page)`                          | `SignaturePlacement[]`   | Get placements for a page           |
| `removePlacement(index)`                           | `void`                   | Remove a placement                  |
| `generateSigningRecord(name, email, reason, hash)` | `SigningRecord`          | Generate legal signing record       |

---

### Utility Functions

| Function                            | Returns                 | Description                   |
| ----------------------------------- | ----------------------- | ----------------------------- |
| `categorizeFile(mimeType)`          | `DocumentCategory`      | Categorize MIME type          |
| `getMimeTypesForCategory(category)` | `string[]`              | Get MIME types for a category |
| `formatFileSize(bytes)`             | `string`                | Human-readable file size      |
| `getFileExtension(name)`            | `string`                | Extract file extension        |
| `getFileIcon(category)`             | `string`                | Get emoji icon for category   |
| `getPickerPreset(preset)`           | `Partial<PickerConfig>` | Get picker preset config      |
| `getSignatureSizePresets()`         | `SignatureSizePreset[]` | Get signature size presets    |

---

## Types

```typescript
type DocumentSource =
  | "gallery"
  | "camera"
  | "files"
  | "google_drive"
  | "dropbox"
  | "onedrive"
  | "icloud"
  | "recent";

type DocumentCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "any";

type AnnotationTool =
  | "highlight"
  | "underline"
  | "freehand"
  | "text_note"
  | "text_box"
  | "rectangle"
  | "circle"
  | "arrow"
  | "stamp"
  | "eraser";

type StampType =
  | "approved"
  | "rejected"
  | "draft"
  | "confidential"
  | "reviewed"
  | "final"
  | "void"
  | "urgent"
  | "custom";

type SignatureType = "drawn" | "typed" | "uploaded" | "aadhaar_esign";

interface PickerConfig {
  sources: DocumentSource[];
  categories: DocumentCategory[];
  multiple: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  compressImages?: boolean;
  enableDocumentScan?: boolean;
}

interface PickedDocument {
  id: string;
  name: string;
  uri: string;
  mimeType: string;
  sizeBytes: number;
  category: DocumentCategory;
  source: DocumentSource;
  extension: string;
}

interface SignatureConfig {
  canvasWidth: number;
  canvasHeight: number;
  penColor: string;
  penThickness: number;
  availableColors: string[];
  availableFonts: string[];
  includeTimestamp: boolean;
  requireReason: boolean;
}

interface SignaturePlacement {
  signatureId: string;
  pageNumber: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
}

interface SigningRecord {
  id: string;
  signatureId: string;
  signerName: string;
  signerEmail: string;
  reason: string;
  documentHash: string;
  timestamp: string;
  ip: string;
}
```
