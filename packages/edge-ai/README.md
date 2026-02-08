# @rajeev02/edge-ai

[![npm version](https://img.shields.io/npm/v/@rajeev02/edge-ai.svg)](https://www.npmjs.com/package/@rajeev02/edge-ai)
[![license](https://img.shields.io/npm/l/@rajeev02/edge-ai.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**On-device ML toolkit** with Indian ID card OCR (Aadhaar/PAN/DL), model pipeline (TFLite/CoreML/ONNX/WASM), and voice AI in 11 Indian languages.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Indian ID OCR** — Extract and validate Aadhaar, PAN, Driving License from scanned text. Verhoeff checksum for Aadhaar.
- **ML model pipeline** — Register, load, and run TFLite / CoreML / ONNX / WASM models with a unified API
- **Voice AI** — Parse voice commands in 11 Indian languages (Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, English)
- **Intent detection** — "pay 500 to Rajeev" → `{ intent: "pay", entities: { amount: "500", recipient: "Rajeev" } }`
- **GPU acceleration** — Optional GPU backend for TFLite and CoreML models
- **Privacy-first** — All processing happens on device. No data sent to cloud servers.

## ⚠️ Important: ML Runtimes & OCR Engine Required

This library provides **ML pipeline management, text parsing utilities, and voice intent matching**. It does **NOT** include ML models, OCR engines, or speech recognition.

| What the library does                             | What YOU must provide                               |
| ------------------------------------------------- | --------------------------------------------------- |
| Parse OCR text to extract PAN/Aadhaar/DL numbers  | OCR engine to convert images → text first           |
| Validate Aadhaar (Verhoeff checksum), PAN format  | Nothing — works standalone                          |
| Model lifecycle management (register/load/unload) | TFLite, CoreML, or ONNX runtime + model files       |
| Rule-based voice intent parsing (11 languages)    | Speech-to-text engine to convert audio → text first |

**OCR functions** (`extractPanNumber`, `extractAadhaarNumber`, `detectDocumentType`) accept **pre-extracted text strings** — you must first convert images to text using an OCR engine:

| Platform       | Recommended OCR engine                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------- |
| iOS            | [Apple Vision Framework](https://developer.apple.com/documentation/vision)                     |
| Android        | [Google ML Kit Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition) |
| Cross-platform | [Tesseract.js](https://tesseract.projectnaptha.com/) (web/WASM)                                |

**ML pipeline** manages model state (register → load → ready → unload) but actual inference must be implemented via native ML runtimes on each platform.

**Voice AI** parses text commands using regex-based intent detection — it does not record or transcribe audio. Feed it text from a speech-to-text engine like [Google Speech-to-Text](https://cloud.google.com/speech-to-text) or [Whisper](https://openai.com/research/whisper).

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/edge-ai
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Indian ID OCR

```typescript
import {
  detectDocumentType,
  extractPanNumber,
  extractAadhaarNumber,
  validatePan,
  validateAadhaar,
  getScanningTips,
} from "@rajeev02/edge-ai";

// Detect document type from OCR text
const docType = detectDocumentType("Income Tax Department PAN ABCPE1234F");
// → "pan"

// Extract PAN
const pan = extractPanNumber("Name: Rajeev PAN: ABCPE1234F DOB: 01/01/1990");
// → "ABCPE1234F"

// Extract masked Aadhaar
const aadhaar = extractAadhaarNumber("Aadhaar: 1234 5678 9012");
// → "XXXX XXXX 9012"

// Validate
validatePan("ABCPE1234F"); // → true
validateAadhaar("123456789012"); // → true (Verhoeff checksum)

// Get scanning tips for users
getScanningTips("aadhaar");
// → ["Place the card on a flat surface", "Ensure all four corners are visible", ...]
```

### ML Model Pipeline

```typescript
import { ModelManager } from "@rajeev02/edge-ai";

const mm = new ModelManager();

// Register a model
mm.register({
  id: "face_detect",
  name: "Face Detection",
  modelPath: "models/face.tflite",
  backend: "tflite",
  useGpu: true,
});

// Load into memory
await mm.load("face_detect");
console.log(mm.isReady("face_detect")); // → true

// Get model info
const info = mm.getModelInfo("face_detect");
// → { id, name, status: "ready", backend, sizeBytes, loadTimeMs }

// Unload when done
mm.unload("face_detect");
```

### Voice AI

```typescript
import { parseVoiceIntent, SUPPORTED_VOICE_LANGUAGES } from "@rajeev02/edge-ai";

// Parse natural language commands
const intent = parseVoiceIntent("pay 500 to Rajeev", "en");
// → { intent: "pay", confidence: 0.95, entities: { amount: "500", recipient: "Rajeev" }, language: "en" }

const hindiIntent = parseVoiceIntent("Rajeev ko 500 bhejo", "hi");
// → { intent: "pay", confidence: 0.92, entities: { amount: "500", recipient: "Rajeev" }, language: "hi" }

// 11 supported languages
console.log(SUPPORTED_VOICE_LANGUAGES);
// → ["en", "hi", "ta", "bn", "te", "mr", "gu", "kn", "ml", "or", "pa"]
```

## Supported Document Types

| Type            | Detection Keywords              | Extraction                 |
| --------------- | ------------------------------- | -------------------------- |
| Aadhaar         | "UIDAI", "Aadhaar"              | Number (masked), name, DOB |
| PAN             | "Income Tax", "PAN"             | PAN number, name, DOB      |
| Driving License | "Driving", "License", "DL"      | DL number, name, validity  |
| Voter ID        | "Election Commission"           | Voter ID, name             |
| Passport        | "Passport", "Republic of India" | Passport number, name      |

## API Reference

| Export                      | Type       | Description                         |
| --------------------------- | ---------- | ----------------------------------- |
| `detectDocumentType()`      | `function` | Detect Indian ID type from OCR text |
| `extractAadhaarNumber()`    | `function` | Extract masked Aadhaar number       |
| `extractPanNumber()`        | `function` | Extract PAN number                  |
| `validatePan()`             | `function` | Validate PAN format                 |
| `validateAadhaar()`         | `function` | Validate Aadhaar (Verhoeff)         |
| `getScanningTips()`         | `function` | Get user-facing scanning tips       |
| `ModelManager`              | `class`    | ML model lifecycle management       |
| `parseVoiceIntent()`        | `function` | Parse voice commands to intents     |
| `SUPPORTED_VOICE_LANGUAGES` | `string[]` | List of supported languages         |

## Full Documentation

📖 [Complete API docs with model config and voice AI](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/EDGE-AI.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
