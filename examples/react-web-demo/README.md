# ⚛️ Rajeev SDK — React Web Demo

> A modern web dashboard built with **Vite**, **React 19**, and **TypeScript** — showcasing all 15 `@rajeev02/*` SDK libraries with a sidebar-driven layout, interactive controls, and a live output console.

Unlike the CampusConnect reference apps, this is a **developer-focused API explorer** for the browser. Each SDK library has its own dedicated demo panel with action buttons that invoke API methods and display results in a scrollable log — ideal for understanding the full API surface in a web context.

---

## 📸 Screenshots

### Main Layout — Sidebar Navigation
```
┌──────────────────────────────────────────────────────────┐
│  ⚛️ Rajeev SDK · Web Demo                                │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  🔐 Vault  │  🔐 Vault — Secure Storage                  │
│            │                                             │
│  🌐 Network│  Encrypted key-value storage powered        │
│            │  by Rust + Web Crypto API.                   │
│  🔄 Sync   │                                             │
│            │  ┌─────────┐ ┌──────────┐ ┌─────────┐      │
│  🌍 Locale │  │  Store  │ │ Retrieve │ │  Delete │      │
│            │  │  Secret │ │  Secret  │ │  Entry  │      │
│  🔔 Notify │  └─────────┘ └──────────┘ └─────────┘      │
│            │  ┌─────────┐ ┌──────────┐ ┌─────────┐      │
│  🎨 UI     │  │  List   │ │ Encrypt  │ │ Decrypt │      │
│            │  │  Keys   │ │  Data    │ │  Data   │      │
│  👤 Auth   │  └─────────┘ └──────────┘ └─────────┘      │
│            │                                             │
│  💳 Pay    │  📋 Output                                  │
│            │  ┌─────────────────────────────────────┐    │
│  📷 Camera │  │ > vault.store("api_key", "sk-...")   │    │
│            │  │ ✓ Stored successfully                │    │
│  🔗 Deep   │  │                                      │    │
│    Link    │  │ > vault.retrieve("api_key")           │    │
│            │  │ ✓ "sk-r4j33v-xxxx-xxxx"              │    │
│  📄 Doc    │  │                                      │    │
│            │  │ > vault.listKeys()                    │    │
│  🧠 EdgeAI │  │ ✓ ["api_key", "session", "prefs"]    │    │
│            │  │                                      │    │
│  🎵 Media  │  │ > vault.delete("session")             │    │
│            │  │ ✓ Deleted "session"                   │    │
│  🎬 Video  │  └─────────────────────────────────────┘    │
│    Editor  │                                             │
│            │                                             │
│  📦 App    │                                             │
│    Shell   │                                             │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  © 2026 · Powered by Rajeev SDK                          │
└──────────────────────────────────────────────────────────┘
```

### Individual Demo — Network
```
┌──────────────────────────────────────────────────────────┐
│  ⚛️ Rajeev SDK · Web Demo                                │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  🔐 Vault  │  🌐 Network — HTTP & Connectivity           │
│            │                                             │
│  🌐 Network│  High-performance HTTP client with          │
│       ←    │  automatic retries, caching, and            │
│  🔄 Sync   │  offline detection.                         │
│            │                                             │
│  🌍 Locale │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│            │  │  GET     │ │  POST    │ │  PUT     │    │
│  🔔 Notify │  │ Request  │ │ Request  │ │ Request  │    │
│            │  └──────────┘ └──────────┘ └──────────┘    │
│  🎨 UI     │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│            │  │  Check   │ │  Clear   │ │  Set     │    │
│  👤 Auth   │  │ Connect  │ │  Cache   │ │ Timeout  │    │
│            │  └──────────┘ └──────────┘ └──────────┘    │
│  💳 Pay    │                                             │
│            │  📋 Output                                  │
│  📷 Camera │  ┌─────────────────────────────────────┐    │
│            │  │ > network.get("/api/users")          │    │
│  🔗 Deep   │  │ ✓ 200 OK (143ms)                     │    │
│    Link    │  │   { users: [...], count: 42 }        │    │
│            │  │                                      │    │
│  📄 Doc    │  │ > network.connectivity()              │    │
│            │  │ ✓ { online: true, type: "wifi",       │    │
│  🧠 EdgeAI │  │     downlink: 50 }                    │    │
│            │  │                                      │    │
│  🎵 Media  │  │ > network.post("/api/data",           │    │
│            │  │     { key: "value" })                 │    │
│  🎬 Video  │  │ ✓ 201 Created (87ms)                 │    │
│    Editor  │  └─────────────────────────────────────┘    │
│            │                                             │
│  📦 App    │                                             │
│    Shell   │                                             │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  © 2026 · Powered by Rajeev SDK                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Libraries Demonstrated

| # | Package | Demo Component | API Methods Demonstrated |
|---|---------|---------------|------------------------|
| 1 | `@rajeev02/vault` | VaultDemo | `store`, `retrieve`, `delete`, `listKeys`, `encrypt`, `decrypt` |
| 2 | `@rajeev02/network` | NetworkDemo | `get`, `post`, `put`, `connectivity`, `clearCache`, `setTimeout` |
| 3 | `@rajeev02/sync` | SyncDemo | `merge`, `diff`, `resolve`, CRDT state, offline queue |
| 4 | `@rajeev02/locale` | LocaleDemo | `formatCurrency`, `formatDate`, `translate`, language switch |
| 5 | `@rajeev02/notify` | NotifyDemo | `requestPermission`, `showToast`, `schedulePush`, badge control |
| 6 | `@rajeev02/ui` | UIDemo | `getTheme`, `setTheme`, design tokens, responsive breakpoints |
| 7 | `@rajeev02/auth` | AuthDemo | `loginOTP`, `loginOAuth`, `refreshSession`, `logout`, token info |
| 8 | `@rajeev02/payments` | PaymentsDemo | `initiatePayment`, `verifyStatus`, `getReceipt`, history |
| 9 | `@rajeev02/camera` | CameraDemo | `capture`, `scanDocument`, `pickFile`, WebRTC controls |
| 10 | `@rajeev02/deeplink` | DeepLinkDemo | `register`, `parse`, `navigate`, `generateLink`, URL handling |
| 11 | `@rajeev02/document` | DocumentDemo | `scan`, `generatePDF`, `viewDocument`, `export`, file picker |
| 12 | `@rajeev02/edge-ai` | EdgeAIDemo | `ocr`, `classify`, `detect`, `summarize`, WASM model loading |
| 13 | `@rajeev02/media` | MediaDemo | `play`, `pause`, `seek`, `setVolume`, playlist, streaming |
| 14 | `@rajeev02/video-editor` | VideoEditorDemo | `trim`, `merge`, `addFilter`, `export`, WASM timeline |
| 15 | `@rajeev02/app-shell` | AppShellDemo | `init`, `getConfig`, `setNavigation`, lifecycle hooks |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- A modern browser (Chrome, Firefox, Safari, Edge)

### Install & Run

```bash
# Navigate to the project
cd examples/react-web-demo

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🗂️ Project Structure

```
react-web-demo/
├── index.html                # HTML entry point
├── package.json              # Dependencies — all 15 @rajeev02/* packages
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build config
└── src/
    ├── main.tsx              # React root mount
    ├── App.tsx               # Sidebar layout + routing
    ├── App.css               # Global styles, sidebar, output console
    └── demos/
        ├── VaultDemo.tsx     # Secure storage — store, retrieve, encrypt
        ├── NetworkDemo.tsx   # HTTP client — GET, POST, connectivity
        ├── SyncDemo.tsx      # CRDT sync — merge, diff, conflict resolution
        ├── LocaleDemo.tsx    # i18n — currency, dates, language switching
        ├── NotifyDemo.tsx    # Notifications — push, toast, badges
        ├── UIDemo.tsx        # Design tokens — themes, breakpoints, device info
        ├── AuthDemo.tsx      # Auth flows — OTP, OAuth, biometric, session
        ├── PaymentsDemo.tsx  # Payments — UPI, card, receipts, history
        ├── CameraDemo.tsx    # Camera — WebRTC capture, document scan
        ├── DeepLinkDemo.tsx  # Deep linking — URL parse, register, navigate
        ├── DocumentDemo.tsx  # Documents — scan, PDF generate, file pick
        ├── EdgeAIDemo.tsx    # Edge AI — OCR, classify, detect (WASM)
        ├── MediaDemo.tsx     # Media — audio/video playback, streaming
        ├── VideoEditorDemo.tsx # Video — trim, merge, filters, export
        └── AppShellDemo.tsx  # App Shell — init, config, navigation
```

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
