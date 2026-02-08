# Rajeev SDK — Native iOS SwiftUI Demo

A native iOS SwiftUI application demonstrating how the Rajeev SDK libraries are consumed on Apple platforms.

## Architecture

The Rajeev SDK contains two kinds of modules:

- **Rust Core (UniFFI)** — `vault`, `network`, `sync`, `locale` are written in Rust and exposed to Swift via [UniFFI](https://mozilla.github.io/uniffi-rs/) bindings. These run natively with no JavaScript bridge overhead.
- **TypeScript Modules** — `auth`, `payments`, `camera`, `deeplink`, `document`, `edge-ai`, `media`, `video-editor`, `app-shell`, `notify`, `ui` are TypeScript packages normally consumed through React Native. In this demo they are shown as UI mockups illustrating the API surface.

## Requirements

| Requirement                            | Version |
| -------------------------------------- | ------- |
| Xcode                                  | 16.0+   |
| iOS Target                             | 16.0+   |
| Swift                                  | 5.9+    |
| Rust toolchain (for building bindings) | 1.75+   |

## Getting Started

1. **Build the Rust UniFFI bindings** (from repo root):

   ```bash
   cd tools/rust-build
   ./build-ios.sh
   ```

   This produces XCFrameworks and generated Swift sources under each crate's output directory.

2. **Open the Xcode project**:

   ```bash
   open examples/ios-native-demo/RajeevSDKDemo.xcodeproj
   ```

3. **Add the generated UniFFI Swift files** to the Xcode project if not already linked.

4. **Build & Run** on a simulator or device (iOS 16+).

## Project Structure

```
ios-native-demo/
├── README.md
└── RajeevSDKDemo/
    ├── RajeevSDKDemoApp.swift      # App entry point
    ├── ContentView.swift           # Main navigation list
    └── Demos/
        ├── VaultDemoView.swift     # Rust core – secure storage
        ├── NetworkDemoView.swift   # Rust core – networking
        ├── SyncDemoView.swift      # Rust core – CRDT sync
        ├── LocaleDemoView.swift    # Rust core – i18n/l10n
        ├── AuthDemoView.swift      # TS module – authentication
        ├── PaymentsDemoView.swift  # TS module – payments
        ├── CameraDemoView.swift    # TS module – camera
        ├── DeepLinkDemoView.swift  # TS module – deep linking
        ├── DocumentDemoView.swift  # TS module – documents
        ├── EdgeAIDemoView.swift    # TS module – on-device AI
        ├── MediaDemoView.swift     # TS module – media player
        ├── VideoEditorDemoView.swift # TS module – video editing
        ├── AppShellDemoView.swift  # TS module – app shell
        ├── NotifyDemoView.swift    # TS module – notifications
        └── UIDemoView.swift        # TS module – design tokens
```

## 📸 Screenshots

### Home Screen — Navigation List

```
┌───────────────────────────────────────────┐
│  9:41               ◉ ▐▐▐ ■ )))  🔋 100% │
├───────────────────────────────────────────┤
│  Rajeev SDK Demo                         │
│                                          │
│  ─── Rust Core (UniFFI) ──────────────── │
│  🔐  Vault — Secure Storage          ▸  │
│  🌐  Network — Connectivity           ▸  │
│  🔄  Sync — CRDT Offline-first        ▸  │
│  🌍  Locale — i18n / l10n             ▸  │
│                                          │
│  ─── TypeScript Modules ─────────────── │
│  🔑  Auth — Session Management        ▸  │
│  💳  Payments — UPI / Checkout         ▸  │
│  📷  Camera — Capture & Lens           ▸  │
│  🔗  Deep Link — URL Routing           ▸  │
│  📄  Document — Scan & OCR             ▸  │
│  🤖  Edge AI — On-Device ML            ▸  │
│  🎵  Media — Playback                  ▸  │
│  🎬  Video Editor — Trim & Filter      ▸  │
│  📦  App Shell — Micro-frontend        ▸  │
│  🔔  Notify — Local Notifications      ▸  │
│  🎨  UI — Design Tokens                ▸  │
│                                          │
└───────────────────────────────────────────┘
```

### Individual Demo Screen

```
┌───────────────────────────────────────────┐
│  ◂ Back          Vault Demo        ⊕     │
├───────────────────────────────────────────┤
│                                          │
│  🔐  Vault — Secure Storage              │
│  Encrypted key-value store powered by    │
│  Rust + UniFFI bindings.                 │
│                                          │
│  ┌─────────────┐  ┌─────────────┐        │
│  │  Store Key  │  │  Read Key   │        │
│  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐        │
│  │  Delete Key │  │  List All   │        │
│  └─────────────┘  └─────────────┘        │
│                                          │
│  Output Log:                             │
│  ┌─────────────────────────────────┐     │
│  │ ▶ vault.store("api_key", "•••") │     │
│  │   ✓ Stored 1 entry              │     │
│  │ ▶ vault.read("api_key")         │     │
│  │   → "sk-live-abc123…"           │     │
│  │ ▶ vault.listKeys()             │     │
│  │   → ["api_key"]                 │     │
│  │ _                               │     │
│  └─────────────────────────────────┘     │
│                                          │
└───────────────────────────────────────────┘
```

## License

See [LICENSE](../../LICENSE) in the repository root.
