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

## License

See [LICENSE](../../LICENSE) in the repository root.
