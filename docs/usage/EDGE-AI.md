# @rajeev02/edge-ai

**On-device ML** with Indian ID card OCR (Aadhaar/PAN/DL), model pipeline (TFLite/CoreML/ONNX/WASM), and voice AI in 11 Indian languages.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | ES module                  |
| watchOS 9+          | TypeScript | React Native module        |
| Wear OS             | TypeScript | React Native module        |
| Android Auto        | TypeScript | React Native module        |

---

## Installation

```bash
npm install @rajeev02/edge-ai
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
  ModelManager,
  detectDocumentType,
  extractPanNumber,
  validatePan,
  parseVoiceIntent,
  SUPPORTED_VOICE_LANGUAGES,
} from "@rajeev02/edge-ai";

// OCR: Detect and extract PAN card
const docType = detectDocumentType("Income Tax Department PAN ABCPE1234F");
// → "pan"

const pan = extractPanNumber("Name: Rajeev PAN: ABCPE1234F DOB: 01/01/1990");
// → "ABCPE1234F"

validatePan("ABCPE1234F"); // → true

// Model Pipeline
const mm = new ModelManager();
mm.register({
  id: "face_detect",
  name: "Face Detection",
  modelPath: "models/face.tflite",
  backend: "tflite",
  useGpu: true,
});
await mm.load("face_detect");
console.log(mm.isReady("face_detect")); // → true

// Voice AI
const intent = parseVoiceIntent("pay 500 to Rajeev", "en");
// → { intent: "pay", confidence: 0.95, entities: { amount: "500", recipient: "Rajeev" } }
```

---

## API Reference

### OCR & ID Detection

| Function                      | Returns          | Description                                    |
| ----------------------------- | ---------------- | ---------------------------------------------- |
| `detectDocumentType(ocrText)` | `DocumentType`   | Detect Indian ID card type from OCR text       |
| `extractAadhaarNumber(text)`  | `string \| null` | Extract masked Aadhaar number `XXXX XXXX 1234` |
| `extractPanNumber(text)`      | `string \| null` | Extract PAN number `ABCPE1234F`                |
| `validatePan(pan)`            | `boolean`        | Validate PAN format                            |
| `validateAadhaar(aadhaar)`    | `boolean`        | Validate Aadhaar with Verhoeff checksum        |
| `getScanningTips(docType)`    | `string[]`       | Get scanning tips for document type            |

---

### `ModelManager`

ML model lifecycle management for TFLite, CoreML, ONNX, and WASM backends.

```typescript
new ModelManager();
```

#### Methods

| Method                    | Returns         | Description                                     |
| ------------------------- | --------------- | ----------------------------------------------- |
| `register(config)`        | `void`          | Register a model configuration                  |
| `load(modelId)`           | `Promise<void>` | Load model into memory                          |
| `unload(modelId)`         | `void`          | Unload model and free memory                    |
| `getState(modelId)`       | `ModelState`    | Get current model state                         |
| `isReady(modelId)`        | `boolean`       | Check if model is ready for inference           |
| `getAll()`                | `ModelInfo[]`   | List all registered models                      |
| `onStateChange(listener)` | `() => void`    | Subscribe to state changes, returns unsubscribe |

---

### Voice AI

| Function                            | Returns       | Description                                |
| ----------------------------------- | ------------- | ------------------------------------------ |
| `parseVoiceIntent(text, language?)` | `VoiceIntent` | Parse voice command into structured intent |
| `getTtsConfig(language)`            | `TtsConfig`   | Get TTS rate/pitch for a language          |

#### Supported Intents

| Intent     | Example Commands                       |
| ---------- | -------------------------------------- |
| `navigate` | "go to home", "open settings"          |
| `search`   | "search for shoes", "find restaurants" |
| `pay`      | "pay 500 to Rajeev", "send money"      |
| `call`     | "call mom", "dial 9876543210"          |
| `help`     | "help me", "what can you do"           |

---

### Supported Voice Languages

| Code | Language  |
| ---- | --------- |
| `hi` | Hindi     |
| `bn` | Bengali   |
| `ta` | Tamil     |
| `te` | Telugu    |
| `mr` | Marathi   |
| `gu` | Gujarati  |
| `kn` | Kannada   |
| `ml` | Malayalam |
| `or` | Odia      |
| `pa` | Punjabi   |
| `as` | Assamese  |

---

## Types

```typescript
type DocumentType =
  | "aadhaar_front"
  | "aadhaar_back"
  | "pan"
  | "driving_license"
  | "voter_id"
  | "passport"
  | "unknown";

type MLBackend = "tflite" | "coreml" | "onnx" | "wasm";

type ModelState = "unloaded" | "loading" | "ready" | "inferring" | "error";

interface ModelConfig {
  id: string;
  name: string;
  modelPath: string;
  backend: MLBackend;
  inputShape?: number[];
  useGpu?: boolean;
  numThreads?: number;
}

interface InferenceResult {
  modelId: string;
  inferenceTimeMs: number;
  outputs: Record<string, unknown>;
  results: BoundingBox[];
  topConfidence: number;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

interface OcrResult {
  text: string;
  blocks: OcrBlock[];
  languages: string[];
  confidence: number;
  processingTimeMs: number;
}

interface AadhaarCardData {
  name?: string;
  aadhaarNumber?: string;
  dob?: string;
  gender?: string;
  address?: string;
}

interface PanCardData {
  name?: string;
  panNumber?: string;
  fatherName?: string;
  dob?: string;
}

interface VoiceConfig {
  wakeWord?: string;
  language: string;
  offlineOnly?: boolean;
  maxDurationSeconds?: number;
  minConfidence?: number;
}

interface VoiceIntent {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  originalText: string;
}
```
