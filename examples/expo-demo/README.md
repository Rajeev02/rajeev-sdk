# 📱 Rajeev SDK — Expo React Native Demo

> An interactive API explorer built with **Expo SDK 54**, **React Navigation**, and **TypeScript** — showcasing all 15 `@rajeev02/*` SDK libraries with dedicated demo screens, action buttons, and live output logs.

Unlike the CampusConnect reference apps, this is a **developer-focused demo** that presents each SDK library individually. Every library gets its own screen with interactive buttons that invoke API methods and display results in a scrollable output console — perfect for exploring the full API surface.

---

## 📸 Screenshots

### Home Screen — Library Grid
```
┌─────────────────────────────┐
│  Rajeev SDK Demo      ⚙️    │
│  ─────────────────────────  │
│                             │
│  15 Libraries               │
│                             │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 🔐   │ │ 🌐   │ │ 🔄   ││
│  │Vault │ │Netwrk│ │ Sync ││
│  └──────┘ └──────┘ └──────┘│
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 🌍   │ │ 🔔   │ │ 🎨   ││
│  │Locale│ │Notify│ │  UI  ││
│  └──────┘ └──────┘ └──────┘│
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 👤   │ │ 💳   │ │ 📷   ││
│  │ Auth │ │ Pay  │ │Camera││
│  └──────┘ └──────┘ └──────┘│
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 🔗   │ │ 📄   │ │ 🧠   ││
│  │ Deep │ │ Doc  │ │EdgeAI││
│  │ Link │ │      │ │      ││
│  └──────┘ └──────┘ └──────┘│
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 🎵   │ │ 🎬   │ │ 📦   ││
│  │Media │ │Video │ │ App  ││
│  │      │ │Editor│ │Shell ││
│  └──────┘ └──────┘ └──────┘│
│                             │
└─────────────────────────────┘
```

### Individual Demo Screen
```
┌─────────────────────────────┐
│  ← Vault Demo          🔐   │
│  ─────────────────────────  │
│                             │
│  Secure storage powered     │
│  by Rust + Keychain         │
│                             │
│  ┌───────────┐ ┌───────────┐│
│  │  Store    │ │  Retrieve ││
│  │  Secret   │ │  Secret   ││
│  └───────────┘ └───────────┘│
│  ┌───────────┐ ┌───────────┐│
│  │  Delete   │ │  List     ││
│  │  Entry    │ │  Keys     ││
│  └───────────┘ └───────────┘│
│  ┌───────────┐ ┌───────────┐│
│  │  Encrypt  │ │  Decrypt  ││
│  │  Data     │ │  Data     ││
│  └───────────┘ └───────────┘│
│                             │
│  📋 Output                  │
│  ┌─────────────────────────┐│
│  │ > vault.store("token",  ││
│  │   "eyJhb...")           ││
│  │ ✓ Stored successfully   ││
│  │                         ││
│  │ > vault.retrieve("token"││
│  │   )                     ││
│  │ ✓ "eyJhbGciOi..."      ││
│  │                         ││
│  │ > vault.listKeys()      ││
│  │ ✓ ["token", "user_id",  ││
│  │    "refresh_token"]     ││
│  └─────────────────────────┘│
│                             │
└─────────────────────────────┘
```

---

## 📦 Libraries Demonstrated

| # | Package | Screen | API Methods Demonstrated |
|---|---------|--------|------------------------|
| 1 | `@rajeev02/vault` | VaultScreen | `store`, `retrieve`, `delete`, `listKeys`, `encrypt`, `decrypt` |
| 2 | `@rajeev02/network` | NetworkScreen | `get`, `post`, `put`, connectivity status, cache control, retry |
| 3 | `@rajeev02/sync` | SyncScreen | `merge`, `diff`, `resolve`, CRDT counters, offline queue |
| 4 | `@rajeev02/locale` | LocaleScreen | `formatCurrency`, `formatDate`, `translate`, language switch |
| 5 | `@rajeev02/notify` | NotifyScreen | `scheduleLocal`, `requestPermission`, `setBadge`, push token |
| 6 | `@rajeev02/ui` | UIScreen | `getTheme`, `getDeviceInfo`, design tokens, adaptive layout |
| 7 | `@rajeev02/auth` | AuthScreen | `loginOTP`, `loginGoogle`, `biometric`, session, `logout` |
| 8 | `@rajeev02/payments` | PaymentsScreen | `initiateUPI`, `verifyPayment`, `getReceipt`, transaction list |
| 9 | `@rajeev02/camera` | CameraScreen | `capture`, `scanDocument`, `pickFromGallery`, flash toggle |
| 10 | `@rajeev02/deeplink` | DeepLinkScreen | `register`, `parse`, `navigate`, `generateLink`, handle URL |
| 11 | `@rajeev02/document` | DocumentScreen | `scan`, `generatePDF`, `viewDocument`, `pickFile`, export |
| 12 | `@rajeev02/edge-ai` | EdgeAIScreen | `ocr`, `classify`, `detectObjects`, `summarize`, model status |
| 13 | `@rajeev02/media` | MediaScreen | `play`, `pause`, `seek`, audio/video toggle, playlist |
| 14 | `@rajeev02/video-editor` | VideoEditorScreen | `trim`, `merge`, `addFilter`, `export`, timeline preview |
| 15 | `@rajeev02/app-shell` | HomeScreen | `init`, `getConfig`, navigation scaffold, splash control |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Expo CLI** (`npx expo`)
- iOS Simulator (Xcode 16+) or Android Emulator (API 26+)
- Expo Go app on a physical device (optional)

### Install & Run

```bash
# Navigate to the project
cd examples/expo-demo

# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

Then press:
- `i` → open in iOS Simulator
- `a` → open in Android Emulator
- `w` → open in web browser
- Scan QR code with Expo Go on your phone

### Run on Web

```bash
npx expo start --web
```

---

## 🗂️ Project Structure

```
expo-demo/
├── App.tsx                        # Navigation setup — Stack navigator with all 15 screens
├── app.json                       # Expo configuration
├── package.json                   # Dependencies — all 15 @rajeev02/* packages
├── tsconfig.json                  # TypeScript configuration
└── src/
    ├── components/
    │   └── LogOutput.tsx          # Shared scrollable output console component
    └── screens/
        ├── HomeScreen.tsx         # Library grid — 15 colored cards with icons
        ├── VaultScreen.tsx        # Secure storage demo — store, retrieve, encrypt
        ├── NetworkScreen.tsx      # HTTP methods, caching, connectivity status
        ├── SyncScreen.tsx         # CRDT operations, merge, conflict resolution
        ├── LocaleScreen.tsx       # i18n strings, currency/date formatting
        ├── NotifyScreen.tsx       # Push/local notifications, badges, permissions
        ├── UIScreen.tsx           # Design tokens, device info, theme engine
        ├── AuthScreen.tsx         # OTP login, Google auth, biometric unlock
        ├── PaymentsScreen.tsx     # UPI payment flow, receipts, transaction history
        ├── CameraScreen.tsx       # Photo capture, document scanning, gallery
        ├── DeepLinkScreen.tsx     # Deep link registration, URL parsing, navigation
        ├── DocumentScreen.tsx     # Document scanning, PDF generation, file picker
        ├── EdgeAIScreen.tsx       # On-device OCR, classification, object detection
        ├── MediaScreen.tsx        # Audio/video playback, streaming, playlists
        └── VideoEditorScreen.tsx  # Video trim, merge, filters, export
```

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
