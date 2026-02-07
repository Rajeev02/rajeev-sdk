# @rajeev02/locale

**Indian-first localization engine** with a translation system, Lakh/Crore number formatting, INR currency, phone formatting, and Indic script transliteration across 10 scripts.

| Platform             | Engine                      | Binding         |
| -------------------- | --------------------------- | --------------- |
| iOS 16+              | Rust (`rajeev-locale-core`) | UniFFI → Swift  |
| Android 7+ (API 24)  | Rust (`rajeev-locale-core`) | UniFFI → Kotlin |
| Web                  | Rust → WASM                 | `wasm-bindgen`  |
| watchOS 9+ / Wear OS | Rust                        | UniFFI          |
| Android Auto         | Rust                        | UniFFI          |

---

## Installation

```bash
npm install @rajeev02/locale
```

---

## Quick Start

```typescript
import {
  TranslationEngine,
  formatINR,
  formatIndianNumber,
  transliterate,
} from "@rajeev02/locale";

// Translation
const engine = new TranslationEngine("hi", "en");
engine.loadLanguage({
  code: "hi",
  name: "Hindi",
  nativeName: "हिन्दी",
  rtl: false,
  translations: { greeting: "नमस्ते {{name}}!" },
});
engine.translate("greeting", { name: "Rajeev" }); // → 'नमस्ते Rajeev!'

// Currency
formatINR(1500000); // → '₹15,00,000.00'
formatINRShort(1500000); // → '₹15 Lakh'

// Transliteration
transliterate("namaste"); // → 'नमस्ते'
```

---

## Platform Usage

### iOS / Android / Wear OS / watchOS

All platforms use the same Rust core through UniFFI-generated bindings. The API is identical across native platforms:

```typescript
import {
  TranslationEngine,
  formatINR,
  formatPhoneIndian,
} from "@rajeev02/locale";

const engine = new TranslationEngine("hi", "en");
engine.loadLanguageJSON(jsonString); // Load from bundled JSON asset

const price = formatINR(25000); // → '₹25,000.00'
const phone = formatPhoneIndian("9876543210"); // → '+91 98765 43210'
```

### Web (WASM)

The WASM build provides the same API. All formatting functions run entirely in the browser — no server round-trips.

```typescript
import {
  TranslationEngine,
  formatIndianNumber,
  formatINR,
  formatINRShort,
  detectScript,
  transliterateToDevanagari,
} from "@rajeev02/locale";

const formatted = formatIndianNumber(12345678); // → '1,23,45,678'
const script = detectScript("தமிழ் மொழி"); // → 'Tamil'
```

### Android Auto

Voice-friendly surface — use transliteration and formatting for TTS output:

```typescript
const price = formatINRShort(7500000); // → '₹75 Lakh'
// TTS reads: "seventy-five lakh rupees"
```

---

## API Reference

### Translation Engine

#### `new TranslationEngine(defaultLanguage, fallbackLanguage)`

```typescript
const engine = new TranslationEngine("hi", "en");
```

#### `engine.loadLanguage(pack: LanguagePack)`

Load a language pack.

```typescript
interface LanguagePack {
  code: string; // 'hi', 'en', 'bn', 'ta', etc.
  name: string; // 'Hindi'
  nativeName: string; // 'हिन्दी'
  rtl: boolean; // false (true for Urdu, Arabic)
  translations: Record<string, string>;
}

engine.loadLanguage({
  code: "hi",
  name: "Hindi",
  nativeName: "हिन्दी",
  rtl: false,
  translations: {
    "app.greeting": "नमस्ते {{name}}!",
    "app.welcome": "स्वागत है",
    "items.zero": "कोई आइटम नहीं",
    "items.one": "{{count}} आइटम",
    "items.other": "{{count}} आइटम",
  },
});
```

#### `engine.loadLanguageJSON(json: string): string`

Load a language pack from a JSON string. Returns the language code.

```typescript
const code = engine.loadLanguageJSON(
  await fetch("/locales/bn.json").then((r) => r.text()),
);
// → 'bn'
```

#### `engine.setLanguage(code): boolean`

Switch the active language. Returns `false` if the language pack isn't loaded.

```typescript
engine.setLanguage("ta"); // Switch to Tamil
```

#### `engine.translate(key, params?): string`

Translate a key with optional `{{param}}` interpolation.

```typescript
engine.translate("app.greeting", { name: "Rajeev" });
// → 'नमस्ते Rajeev!'

engine.translate("missing.key");
// → 'missing.key' (returns the key itself as fallback)
```

#### `engine.translatePlural(key, count, params?): string`

Pluralized translation. Looks up `key.zero`, `key.one`, or `key.other` based on count.

```typescript
engine.translatePlural("items", 0); // → 'कोई आइटम नहीं'
engine.translatePlural("items", 1); // → '1 आइटम'
engine.translatePlural("items", 42); // → '42 आइटम'
```

| Count | Suffix looked up |
| ----- | ---------------- |
| 0     | `.zero`          |
| 1     | `.one`           |
| 2+    | `.other`         |

#### Other Engine Methods

```typescript
engine.getLanguage(); // → 'hi'
engine.availableLanguages(); // → ['hi', 'en', 'bn', 'ta']
engine.isRtl("hi"); // → false
engine.isRtl("ur"); // → true
engine.getAllKeys(); // → ['app.greeting', 'app.welcome', ...]
```

---

### Number Formatting

#### `formatIndianNumber(num): string`

Format a number using the Indian numbering system (Lakh/Crore grouping).

```typescript
formatIndianNumber(1234); // → '1,234'
formatIndianNumber(12345); // → '12,345'
formatIndianNumber(123456); // → '1,23,456'
formatIndianNumber(1234567); // → '12,34,567'
formatIndianNumber(12345678); // → '1,23,45,678'
formatIndianNumber(123456789); // → '12,34,56,789'
```

**Grouping pattern:** First group of 3 digits from the right, then groups of 2.

---

### Currency Formatting

#### `formatINR(amount): string`

Format as Indian Rupees with the ₹ symbol.

```typescript
formatINR(999); // → '₹999.00'
formatINR(15000); // → '₹15,000.00'
formatINR(1234567.5); // → '₹12,34,567.50'
```

#### `formatINRShort(amount): string`

Format using Lakh/Crore shorthand.

```typescript
formatINRShort(50000); // → '₹50,000'     (< 1 Lakh: full number)
formatINRShort(150000); // → '₹1.5 Lakh'
formatINRShort(1500000); // → '₹15 Lakh'
formatINRShort(25000000); // → '₹2.5 Crore'
formatINRShort(2500000000); // → '₹250 Crore'
```

| Range                | Format                           |
| -------------------- | -------------------------------- |
| < 1,00,000           | Full number with Indian grouping |
| 1,00,000 – 99,99,999 | X.X Lakh                         |
| 1,00,00,000+         | X.X Crore                        |

---

### Phone Formatting

#### `formatPhoneIndian(number): string`

Format Indian phone numbers with the +91 prefix.

```typescript
formatPhoneIndian("9876543210"); // → '+91 98765 43210'
formatPhoneIndian("919876543210"); // → '+91 98765 43210'
formatPhoneIndian("09876543210"); // → '+91 98765 43210'
formatPhoneIndian("+919876543210"); // → '+91 98765 43210'
```

Handles all common Indian phone number formats automatically.

---

### Date & Time Formatting

#### `formatDateIndian(year, month, day): string`

Format a date in DD/MM/YYYY (Indian standard).

```typescript
formatDateIndian(2026, 2, 7); // → '07/02/2026'
```

#### `formatTime12h(hour, minute): string`

Format time in 12-hour format.

```typescript
formatTime12h(14, 30); // → '2:30 PM'
formatTime12h(9, 5); // → '9:05 AM'
formatTime12h(0, 0); // → '12:00 AM'
```

---

### Transliteration

#### `transliterateToDevanagari(input): string`

Convert Latin/romanized text to Devanagari script.

```typescript
transliterateToDevanagari("namaste"); // → 'नमस्ते'
transliterateToDevanagari("rajeev"); // → 'राजीव'
transliterateToDevanagari("bharat"); // → 'भारत'
transliterateToDevanagari("shubh"); // → 'शुभ'
```

#### `detectScript(text): Script`

Detect the script used in a text string via Unicode range analysis.

```typescript
detectScript("Hello world"); // → 'Latin'
detectScript("नमस्ते दुनिया"); // → 'Devanagari'
detectScript("বাংলা ভাষা"); // → 'Bengali'
detectScript("தமிழ் மொழி"); // → 'Tamil'
detectScript("తెలుగు భాష"); // → 'Telugu'
```

#### `supportedScripts(): [code, name][]`

List all 10 supported Indic scripts.

```typescript
supportedScripts();
// → [
//   ['en', 'Latin'], ['hi', 'Devanagari'], ['bn', 'Bengali'],
//   ['ta', 'Tamil'], ['te', 'Telugu'], ['kn', 'Kannada'],
//   ['ml', 'Malayalam'], ['gu', 'Gujarati'], ['pa', 'Gurmukhi'],
//   ['or', 'Odia']
// ]
```

---

### Full Example: Multi-Language E-Commerce

```typescript
import {
  TranslationEngine,
  formatINR,
  formatINRShort,
  formatPhoneIndian,
  formatDateIndian,
  detectScript,
} from "@rajeev02/locale";

const engine = new TranslationEngine("hi", "en");

// Load language packs from server
const packs = await Promise.all(
  ["hi", "en", "ta", "bn"].map(async (code) => {
    const json = await fetch(`/locales/${code}.json`).then((r) => r.text());
    return engine.loadLanguageJSON(json);
  }),
);

// Display product price
const price = formatINRShort(1499900); // → '₹15 Lakh'

// Format seller phone
const phone = formatPhoneIndian("9876543210"); // → '+91 98765 43210'

// Date
const listed = formatDateIndian(2026, 1, 15); // → '15/01/2026'

// Switch language based on user preference
engine.setLanguage("ta");
const title = engine.translate("product.title", { name: "iPhone 17" });
```

---

### Build from Source

```bash
cargo test -p rajeev-locale-core            # Run tests
./tools/rust-build/build-ios.sh locale      # Build for iOS
./tools/rust-build/build-android.sh locale  # Build for Android
./tools/rust-build/build-wasm.sh locale     # Build for Web (WASM)
```
