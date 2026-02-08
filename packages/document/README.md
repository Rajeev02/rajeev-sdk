# @rajeev02/document

[![npm version](https://img.shields.io/npm/v/@rajeev02/document.svg)](https://www.npmjs.com/package/@rajeev02/document)
[![license](https://img.shields.io/npm/l/@rajeev02/document.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Document picker, PDF annotation & editor, and digital signature management** with multi-source file selection, stamps, form filling, and legally-valid signing records.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Document picker** — Select files from camera, gallery, file system with preset configs (KYC, invoice, medical)
- **PDF editor** — Navigate, zoom, highlight, underline, strikethrough, stamp, freehand draw, add text
- **Form filling** — Set form field values programmatically for PDF forms
- **Digital signatures** — Type, draw, or upload signatures. Place on any page with position/size control.
- **Signing records** — Generate legally-valid signing records with timestamp, IP, reason, and document hash
- **File utilities** — Categorize files by MIME type, format file sizes, get picker presets

## ⚠️ Important: PDF Renderer & File Picker Required

This library provides **document editing state management** — annotation tracking, signature placement, form field values, page navigation, and undo/redo history. It does **NOT** render PDFs or display a native file picker.

You need to pair it with:

| Feature               | Recommended library                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| File picker (Expo)    | [`expo-document-picker`](https://docs.expo.dev/versions/latest/sdk/document-picker/)              |
| File picker (bare RN) | [`react-native-document-picker`](https://github.com/rnmods/react-native-document-picker)          |
| PDF rendering (RN)    | [`react-native-pdf`](https://github.com/wonday/react-native-pdf)                                  |
| PDF rendering (Web)   | [`pdf.js`](https://mozilla.github.io/pdf.js/)                                                     |
| Signature drawing     | A canvas component — this library stores/places signatures, but doesn't capture the drawn strokes |

**Permissions required:**

- **iOS:** Add `NSPhotoLibraryUsageDescription` to `Info.plist` (for gallery access)
- **Android:** Add `READ_EXTERNAL_STORAGE` / `READ_MEDIA_IMAGES` permissions

**What this library provides:** Annotation data model, signature management with legal signing records, form field state, file categorization utilities, and picker configuration presets. Your rendering library displays the document — this library manages the editing state on top of it.

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/document
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Document Picker

```typescript
import {
  getPickerPreset,
  categorizeFile,
  formatFileSize,
} from "@rajeev02/document";

// Pre-configured picker for KYC documents
const kycPreset = getPickerPreset("kyc_document");
// → { sources: ["camera", "gallery", "files"], categories: ["image", "pdf"], maxSizeMB: 10, ... }

// File utilities
categorizeFile("application/pdf"); // → "pdf"
categorizeFile("image/jpeg"); // → "image"
formatFileSize(2_457_600); // → "2.3 MB"
```

### PDF Editor

```typescript
import { DocumentEditorController } from "@rajeev02/document";

const editor = new DocumentEditorController("file://contract.pdf", 10);

// Navigation
editor.goToPage(3);
editor.setZoom(1.5);

// Annotations
editor.addHighlight(0.1, 0.2, 0.5, 0.03);
editor.addStamp(0.7, 0.9, "approved");
editor.setActiveTool("freehand");
editor.setActiveColor("#FF0000");

// Form filling
editor.setFormFieldValue("name", "Rajeev Kumar Joshi");
editor.setFormFieldValue("date", "2026-02-08");
```

### Digital Signatures

```typescript
import { SignatureManager } from "@rajeev02/document";

const sigMgr = new SignatureManager();

// Create a typed signature
const sigId = sigMgr.saveTypedSignature("Rajeev Kumar Joshi", "Dancing Script");

// Place on document
sigMgr.placeSignature({
  signatureId: sigId,
  pageNumber: 10,
  position: { x: 0.6, y: 0.9 },
  size: { width: 0.25, height: 0.06 },
  rotation: 0,
});

// Generate legally-valid signing record
const record = sigMgr.generateSigningRecord(
  "Rajeev Kumar Joshi",
  "rajeev@example.com",
  "Contract acceptance",
  "sha256:abc123...",
);
```

## Picker Presets

| Preset           | Sources                | Categories | Max Size |
| ---------------- | ---------------------- | ---------- | -------- |
| `kyc_document`   | camera, gallery, files | image, pdf | 10 MB    |
| `invoice`        | camera, files          | image, pdf | 25 MB    |
| `medical_report` | camera, gallery, files | image, pdf | 50 MB    |
| `profile_photo`  | camera, gallery        | image      | 5 MB     |
| `general`        | camera, gallery, files | all        | 100 MB   |

## API Reference

### `DocumentEditorController`

| Method                            | Description                         |
| --------------------------------- | ----------------------------------- |
| `goToPage(page)`                  | Navigate to page                    |
| `setZoom(level)`                  | Set zoom (0.5–5.0)                  |
| `addHighlight(x, y, w, h)`        | Add highlight annotation            |
| `addStamp(x, y, type)`            | Add stamp (approved/rejected/draft) |
| `setActiveTool(tool)`             | Set annotation tool                 |
| `setFormFieldValue(field, value)` | Fill form field                     |
| `undo()` / `redo()`               | Undo/redo                           |

### `SignatureManager`

| Method                           | Description                   |
| -------------------------------- | ----------------------------- |
| `saveTypedSignature(name, font)` | Create typed signature        |
| `saveDrawnSignature(paths)`      | Save hand-drawn signature     |
| `placeSignature(config)`         | Place signature on document   |
| `generateSigningRecord(...)`     | Generate legal signing record |
| `getSavedSignatures()`           | List all saved signatures     |

## Full Documentation

📖 [Complete API docs with all annotation types](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/DOCUMENT.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
