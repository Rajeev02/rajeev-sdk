# Rajeev SDK

**Cross-platform infrastructure libraries for building apps that work everywhere — from ₹5000 Android phones in villages to Apple Watch on city wrists.**

Built by [Rajeev Kumar Joshi](https://rajeev02.github.io) · [GitHub](https://github.com/Rajeev02) · [LinkedIn](https://www.linkedin.com/in/rajeev-joshi/)

---

## Packages

### Rust Core Libraries

| Package             | Description                                     | Tests | Platforms                               |
| ------------------- | ----------------------------------------------- | ----- | --------------------------------------- |
| `@rajeev02/vault`   | Universal Secure Storage (AES-256-GCM + SQLite) | 29    | Android · iOS · Web · watchOS · Wear OS |
| `@rajeev02/network` | Connectivity-Aware Network Layer                | 45    | Android · iOS · Web · watchOS · Wear OS |
| `@rajeev02/sync`    | Offline-First CRDT Sync Engine                  | 14    | Android · iOS · Web · watchOS · Wear OS |
| `@rajeev02/locale`  | Smart Localization (10 scripts, INR formatting) | 27    | Android · iOS · Web · watchOS · Wear OS |

### TypeScript Libraries

| Package                  | Description                                            | Platforms           |
| ------------------------ | ------------------------------------------------------ | ------------------- |
| `@rajeev02/notify`       | Unified Notification Layer (inbox, scheduler)          | Android · iOS · Web |
| `@rajeev02/ui`           | Adaptive UI System (tokens, hooks, device)             | Android · iOS · Web |
| `@rajeev02/auth`         | Authentication & Session Management (OAuth, biometric) | Android · iOS · Web |
| `@rajeev02/payments`     | Payments Engine (UPI, cards, wallets)                  | Android · iOS · Web |
| `@rajeev02/camera`       | Camera & Photo Pipeline (capture, edit, filters)       | Android · iOS       |
| `@rajeev02/deeplink`     | Universal Deep Linking (routes, deferred links)        | Android · iOS · Web |
| `@rajeev02/document`     | Document Manager (scan, OCR, PDF, sign)                | Android · iOS       |
| `@rajeev02/edge-ai`      | On-Device AI (text, image, inference)                  | Android · iOS       |
| `@rajeev02/media`        | Media Player (audio, video, streaming, PiP)            | Android · iOS · Web |
| `@rajeev02/video-editor` | Video Editor (trim, filters, transitions, export)      | Android · iOS       |
| `@rajeev02/app-shell`    | App Shell Framework (bootstrap, feature flags, A/B)    | Android · iOS · Web |

> **115 Rust tests passing** across all 4 core crates. All 11 TypeScript packages compile clean under `--strict`.

## Setup Requirements Per Package

Each package is published to npm under the `@rajeev02` scope. Some packages are **ready to use out of the box**, while others need **external services or native libraries**. This table shows what each package requires:

| Package          | Type               | Additional Setup Required                                                                                                                                             |
| ---------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **vault**        | Rust native module | Native build required — `pod install` (iOS), rebuild (Android), WASM (Web). **Not compatible with Expo Go.**                                                          |
| **network**      | Rust native module | Same native setup as vault                                                                                                                                            |
| **sync**         | Rust native module | Same native setup as vault                                                                                                                                            |
| **locale**       | Rust native module | Same native setup as vault                                                                                                                                            |
| **ui**           | Pure TypeScript    | **None** — works immediately after `npm install`                                                                                                                      |
| **notify**       | Pure TypeScript    | Needs a **notification delivery layer** (expo-notifications, @notifee/react-native, or FCM) to actually display notifications. Library manages scheduling state only. |
| **auth**         | Pure TypeScript    | Needs a **backend server** with OTP sending (via Twilio/MSG91/Firebase Auth), token generation, and refresh endpoints. OAuth needs client IDs.                        |
| **payments**     | Pure TypeScript    | Needs a **payment gateway** (Razorpay/Cashfree/Juspay) backend. Library generates UPI intents and validates cards — doesn't process payments.                         |
| **camera**       | Pure TypeScript    | Needs a **native camera library** (expo-camera or react-native-vision-camera). Library manages state/filters/editing — doesn't access hardware.                       |
| **deeplink**     | Pure TypeScript    | Needs **native URL scheme config** (iOS: Associated Domains, Android: intent filters). Library parses/routes URLs — doesn't receive them.                             |
| **document**     | Pure TypeScript    | Needs a **PDF renderer** (react-native-pdf / pdf.js) and **file picker** (expo-document-picker). Library manages editing state.                                       |
| **edge-ai**      | Pure TypeScript    | Needs **OCR engine** (Google ML Kit / Apple Vision) for text extraction, **ML runtime** for model inference. Library parses pre-extracted text.                       |
| **media**        | Pure TypeScript    | Needs a **native media player** (expo-av / react-native-video). DRM needs a license server. Library manages playback state.                                           |
| **video-editor** | Pure TypeScript    | Needs a **video processing engine** (FFmpeg / AVFoundation / MediaCodec). Library manages timeline/editing state.                                                     |
| **app-shell**    | Pure TypeScript    | Some modules need a **backend** (ApiClient, ChatEngine, AnalyticsEngine, FeatureFlagManager). CartManager and OnboardingManager work standalone.                      |

> **📖 Each package README on npm has a detailed "⚠️ Important" section** explaining exactly what external services or libraries are needed, with links to recommended providers.

## npm Packages

All 12 packages are published on npm under the `@rajeev02` scope:

```bash
# Install any package
npm install @rajeev02/vault
npm install @rajeev02/auth
npm install @rajeev02/payments
# ... etc
```

| Package                  | npm                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `@rajeev02/vault`        | [![npm](https://img.shields.io/npm/v/@rajeev02/vault.svg)](https://www.npmjs.com/package/@rajeev02/vault)               |
| `@rajeev02/notify`       | [![npm](https://img.shields.io/npm/v/@rajeev02/notify.svg)](https://www.npmjs.com/package/@rajeev02/notify)             |
| `@rajeev02/ui`           | [![npm](https://img.shields.io/npm/v/@rajeev02/ui.svg)](https://www.npmjs.com/package/@rajeev02/ui)                     |
| `@rajeev02/auth`         | [![npm](https://img.shields.io/npm/v/@rajeev02/auth.svg)](https://www.npmjs.com/package/@rajeev02/auth)                 |
| `@rajeev02/payments`     | [![npm](https://img.shields.io/npm/v/@rajeev02/payments.svg)](https://www.npmjs.com/package/@rajeev02/payments)         |
| `@rajeev02/camera`       | [![npm](https://img.shields.io/npm/v/@rajeev02/camera.svg)](https://www.npmjs.com/package/@rajeev02/camera)             |
| `@rajeev02/deeplink`     | [![npm](https://img.shields.io/npm/v/@rajeev02/deeplink.svg)](https://www.npmjs.com/package/@rajeev02/deeplink)         |
| `@rajeev02/document`     | [![npm](https://img.shields.io/npm/v/@rajeev02/document.svg)](https://www.npmjs.com/package/@rajeev02/document)         |
| `@rajeev02/edge-ai`      | [![npm](https://img.shields.io/npm/v/@rajeev02/edge-ai.svg)](https://www.npmjs.com/package/@rajeev02/edge-ai)           |
| `@rajeev02/media`        | [![npm](https://img.shields.io/npm/v/@rajeev02/media.svg)](https://www.npmjs.com/package/@rajeev02/media)               |
| `@rajeev02/video-editor` | [![npm](https://img.shields.io/npm/v/@rajeev02/video-editor.svg)](https://www.npmjs.com/package/@rajeev02/video-editor) |
| `@rajeev02/app-shell`    | [![npm](https://img.shields.io/npm/v/@rajeev02/app-shell.svg)](https://www.npmjs.com/package/@rajeev02/app-shell)       |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│          Your App (React Native / Expo / Native / Web)      │
├─────────────────────────────────────────────────────────────┤
│              TypeScript API Layer (15 NPM packages)         │
│  vault · network · sync · locale · notify · ui · auth      │
│  payments · camera · deeplink · document · edge-ai · media  │
│  video-editor · app-shell                                   │
├─────────────────────────────────────────────────────────────┤
│       Auto-generated Turbo Modules (ubrn / UniFFI)          │
│  uniffi-bindgen-react-native → TS + Kotlin + Swift          │
├─────────────────────────────────────────────────────────────┤
│               Rust Core (shared native logic)               │
│  vault-core · network-core · sync-core · locale-core        │
├──────────┬──────────┬──────────┬────────────────────────────┤
│ Android  │   iOS    │   Web    │  watchOS · Wear OS · IoT   │
│ Turbo    │  Turbo   │  WASM    │  Native binary (UniFFI)    │
│ Module   │  Module  │          │                            │
└──────────┴──────────┴──────────┴────────────────────────────┘
```

Rust core code is annotated with `#[uniffi::export]` proc macros. Running `ubrn build` auto-generates React Native Turbo Modules for Android and iOS — no hand-written native bridge code needed. Web is served via WASM (`wasm-bindgen`).

Works with bare React Native 0.84+, Expo SDK 54+, native Swift/Kotlin apps, and plain web.

## Platform Support

| Library      | Android | iOS | Web | watchOS | Wear OS | Android Auto |
| ------------ | ------- | --- | --- | ------- | ------- | ------------ |
| Vault        | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           |
| Network      | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           |
| Sync         | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           |
| Locale       | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           |
| Auth         | ✅      | ✅  | ✅  | ✅      | —       | —            |
| Payments     | ✅      | ✅  | ✅  | ✅      | —       | —            |
| Notify       | ✅      | ✅  | ✅  | ✅      | ✅      | —            |
| UI           | ✅      | ✅  | ✅  | ✅      | ✅      | —            |
| Camera       | ✅      | ✅  | —   | —       | —       | —            |
| DeepLink     | ✅      | ✅  | ✅  | —       | —       | —            |
| Document     | ✅      | ✅  | —   | —       | —       | —            |
| Edge-AI      | ✅      | ✅  | —   | —       | —       | —            |
| Media        | ✅      | ✅  | ✅  | —       | —       | —            |
| Video Editor | ✅      | ✅  | —   | —       | —       | —            |
| App Shell    | ✅      | ✅  | ✅  | —       | —       | —            |

## Quick Start

### Prerequisites (macOS)

```bash
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 2. Add cross-compilation targets
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
rustup target add wasm32-unknown-unknown

# 3. Install build tools
cargo install cargo-ndk
cargo install wasm-pack
npm install -g uniffi-bindgen-react-native

# 4. Install Android Studio + NDK
# Download Android Studio → SDK Manager → SDK Tools → NDK (Side by side) → Install

# 5. Install Xcode
# App Store → Xcode 16+ → Install
xcode-select --install

# 6. Clone and setup
git clone https://github.com/Rajeev02/rajeev-sdk.git
cd rajeev-sdk
npm install
```

### Run Tests

```bash
# Rust — 115 tests across 4 crates
cargo test --workspace

# TypeScript — strict type-check all 11 packages
for pkg in packages/*/; do
  [ -f "$pkg/tsconfig.json" ] && (cd "$pkg" && npx tsc --noEmit --strict)
done
```

### Build for Platforms

```bash
# WASM (Web)
cd tools/rust-build && ./build-wasm.sh

# iOS (requires Xcode)
cd tools/rust-build && ./build-ios.sh

# Android (requires Android Studio + NDK)
cd tools/rust-build && ./build-android.sh
```

### Usage

```typescript
import { Vault } from "@rajeev02/vault";

const vault = await Vault.create({ appId: "com.myapp" });
await vault.set("token", "my-secret-value", { expiry: "24h" });
const token = await vault.get("token");
```

```typescript
import { AuthManager } from "@rajeev02/auth";

const auth = new AuthManager({ providers: ["google", "apple", "phone"] });
await auth.signIn("google");
```

```typescript
import { PaymentProcessor } from "@rajeev02/payments";

const payment = new PaymentProcessor({ merchantId: "MERCHANT_001" });
await payment.process({ method: "upi", amount: 999, currency: "INR" });
```

## Tech Stack

| Layer          | Technology                   | Version              |
| -------------- | ---------------------------- | -------------------- |
| Rust edition   | Rust 2024                    | 1.93+ stable         |
| FFI bindings   | uniffi                       | 0.31                 |
| Bridge codegen | uniffi-bindgen-react-native  | 0.29.3-1             |
| Encryption     | AES-256-GCM (aes-gcm)        | 0.10.3               |
| Local storage  | SQLite (rusqlite)            | 0.38                 |
| Error handling | thiserror                    | 2.0                  |
| Serialization  | serde / serde_json           | 1.0                  |
| Random         | rand                         | 0.9                  |
| React Native   | Turbo Modules                | 0.84                 |
| Expo           | Expo SDK                     | 54                   |
| Android        | compileSdk / targetSdk 35    | API 24+ (Kotlin 2.1) |
| iOS            | Swift 6.0                    | iOS 16.0+            |
| watchOS        | Swift 6.0                    | watchOS 9.0+         |
| Build system   | Turborepo + Cargo workspaces | latest               |
| TypeScript     | ^5.4                         | strict mode          |

## Project Structure

```
rajeev-sdk/
├── packages/
│   ├── vault/               # Secure storage (Rust + TS + Android + iOS)
│   │   ├── rust-core/       #   AES-256-GCM encryption, SQLite, key derivation
│   │   ├── ts-wrapper/      #   TypeScript API, React hooks
│   │   ├── android/         #   Native module (Kotlin)
│   │   └── ios/             #   Native module (Swift)
│   ├── network/             # Connectivity, caching, queue, optimization (Rust)
│   ├── sync/                # CRDT conflict resolution, offline storage (Rust)
│   ├── locale/              # Dictionary, formatting, transliteration (Rust)
│   ├── auth/                # OAuth, biometric, session management (TS)
│   ├── payments/            # UPI, cards, wallets, subscriptions (TS)
│   ├── camera/              # Capture, photo editor, filters, AR (TS)
│   ├── deeplink/            # Universal links, deferred deep links (TS)
│   ├── document/            # Scanner, OCR, PDF, digital signatures (TS)
│   ├── edge-ai/             # On-device ML inference, NLP, vision (TS)
│   ├── media/               # Audio/video player, streaming, PiP (TS)
│   ├── video-editor/        # Trim, transitions, filters, export (TS)
│   ├── app-shell/           # Bootstrap, feature flags, A/B testing (TS)
│   ├── notify/              # Push/local notifications, inbox (TS)
│   └── ui/                  # Design tokens, device detection, hooks (TS)
├── examples/
│   ├── expo-demo/           # Expo SDK 54 — 15 demo screens (iOS/Android/Web)
│   ├── react-web-demo/      # React 19 + Vite 6 — 15 library demos
│   ├── ios-native-demo/     # SwiftUI (iOS 16+) — 15 native demo views
│   ├── android-native-demo/ # Jetpack Compose + Material 3 — 15 demos
│   ├── watchos-demo/        # watchOS 9+ SwiftUI — 8 watch-relevant demos
│   └── vanilla-web-demo/    # Single HTML file — zero dependencies
├── tools/
│   └── rust-build/          # Cross-compilation scripts (iOS, Android, WASM)
├── docs/
│   ├── USAGE.md             # Getting-started guide
│   ├── SETUP.md             # Environment setup
│   ├── ARCHITECTURE-UPDATE-2026.md
│   └── usage/               # 15 per-library API docs
├── Cargo.toml               # Rust workspace (4 crates)
├── package.json             # npm workspaces
└── turbo.json               # Build orchestration
```

## Example Apps

Six example apps demonstrate all 15 libraries across every supported platform:

### Expo Demo (React Native — iOS / Android / Web)

15 interactive demo screens using Expo SDK 54.

```bash
cd examples/expo-demo
npm install
npx expo start --web          # Web
npx expo start --ios          # iOS Simulator (requires Xcode)
npx expo start --android      # Android Emulator (requires Android Studio)
```

### React Web Demo (Vite + React 19)

15 library demos in a sidebar-navigation React app.

```bash
cd examples/react-web-demo
npm install
npm run dev                    # http://localhost:5173
npm run build                  # Production build
```

### Native iOS Demo (SwiftUI)

15 native SwiftUI views — Rust-core libraries via UniFFI, TypeScript libraries as API mockups.

```bash
# 1. Build Rust UniFFI bindings
cd tools/rust-build && ./build-ios.sh

# 2. Open in Xcode
open examples/ios-native-demo/RajeevSDKDemo.xcodeproj

# 3. Select iOS 16+ simulator → Build & Run (⌘R)
```

### Native Android Demo (Jetpack Compose)

15 Compose screens with Material 3 — Rust-core via UniFFI JNI, TypeScript modules as UI mockups.

```bash
# 1. Open in Android Studio
#    File → Open → examples/android-native-demo/

# 2. Let Gradle sync
# 3. Select emulator (API 24+) → Run ▶
```

### watchOS Demo (SwiftUI)

8 watch-relevant demos (Vault, Network, Sync, Locale, Notify, Auth, Payments, UI Tokens).

```bash
# 1. Open in Xcode
open examples/watchos-demo/RajeevWatchDemo.xcodeproj

# 2. Select Apple Watch simulator → Build & Run (⌘R)
```

### Vanilla Web Demo

All 15 libraries in a single HTML file — zero dependencies, zero build step.

```bash
open examples/vanilla-web-demo/index.html
```

## Documentation

### Guides

- [Usage Guide](docs/USAGE.md) — getting started on every platform
- [Setup Guide](docs/SETUP.md) — step-by-step environment setup
- [Architecture Update (Feb 2026)](docs/ARCHITECTURE-UPDATE-2026.md) — migration to ubrn + Turbo Modules

### Library Reference

| Package                  | Docs                                          | Highlights                                               |
| ------------------------ | --------------------------------------------- | -------------------------------------------------------- |
| `@rajeev02/vault`        | [VAULT.md](docs/usage/VAULT.md)               | React hooks, namespaces, expiry, hashing, WASM, crypto   |
| `@rajeev02/network`      | [NETWORK.md](docs/usage/NETWORK.md)           | Connectivity monitoring, adaptive quality, HTTP cache    |
| `@rajeev02/locale`       | [LOCALE.md](docs/usage/LOCALE.md)             | INR / Lakh / Crore formatting, 10-script transliteration |
| `@rajeev02/sync`         | [SYNC.md](docs/usage/SYNC.md)                 | CRDT, Hybrid Logical Clock, conflict resolution          |
| `@rajeev02/notify`       | [NOTIFY.md](docs/usage/NOTIFY.md)             | Scheduling, quiet hours, channels, in-app inbox          |
| `@rajeev02/ui`           | [UI.md](docs/usage/UI.md)                     | Design tokens, device detection, theming                 |
| `@rajeev02/auth`         | [AUTH.md](docs/usage/AUTH.md)                 | OAuth 2.0/OIDC, biometric, MFA, session management       |
| `@rajeev02/payments`     | [PAYMENTS.md](docs/usage/PAYMENTS.md)         | UPI, cards, wallets, subscriptions, refunds              |
| `@rajeev02/camera`       | [CAMERA.md](docs/usage/CAMERA.md)             | Capture pipeline, photo editor, filters, AR overlays     |
| `@rajeev02/deeplink`     | [DEEPLINK.md](docs/usage/DEEPLINK.md)         | Universal/App Links, deferred deep links, routing        |
| `@rajeev02/document`     | [DOCUMENT.md](docs/usage/DOCUMENT.md)         | Scanner, OCR, PDF generation, digital signatures         |
| `@rajeev02/edge-ai`      | [EDGE-AI.md](docs/usage/EDGE-AI.md)           | On-device inference, NLP, image classification           |
| `@rajeev02/media`        | [MEDIA.md](docs/usage/MEDIA.md)               | Audio/video player, streaming, PiP, playlists            |
| `@rajeev02/video-editor` | [VIDEO-EDITOR.md](docs/usage/VIDEO-EDITOR.md) | Trim, transitions, filters, multi-track, export          |
| `@rajeev02/app-shell`    | [APP-SHELL.md](docs/usage/APP-SHELL.md)       | Bootstrap, feature flags, A/B testing, crash reporting   |

## Release & Publishing

All 12 TypeScript packages are published to npm under the `@rajeev02` scope. The monorepo includes a release script that handles version bumping, building, git tagging, and npm publishing in one step.

### Quick Publish Commands

```bash
# Patch release (0.2.1 → 0.2.2) — all packages
npm run release:patch

# Minor release (0.2.x → 0.3.0) — all packages
npm run release:minor

# Major release (0.x.x → 1.0.0) — all packages
npm run release:major

# Dry run — see what would happen without publishing
npm run release:dry
```

### Release Script (Advanced)

The release script at `tools/release.js` supports fine-grained control:

```bash
# Publish specific packages only
node tools/release.js --bump patch --packages vault notify auth

# Set an exact version
node tools/release.js --version 1.0.0

# Pass OTP for npm 2FA
node tools/release.js --bump patch --otp 123456

# Skip git commit/push (useful for CI)
node tools/release.js --bump patch --skip-git

# Skip npm publish (version bump + build only)
node tools/release.js --bump patch --skip-publish

# Skip build step (if already built)
node tools/release.js --bump patch --no-build
```

### Manual Step-by-Step Publish

If you prefer to publish manually:

```bash
# 1. Bump versions across all packages
node tools/bump-version.js patch   # or: minor, major, or exact like 1.0.0

# 2. Build all TypeScript packages
node tools/build-all-ts.js

# 3. Commit & push
git add -A
git commit -m "chore: bump to vX.Y.Z"
git push origin main

# 4. Publish to npm (requires npm login + 2FA)
node tools/publish-all.js

# Or publish a single package
cd packages/vault/ts-wrapper && npm publish --access public
cd packages/notify && npm publish --access public
```

### npm Authentication

Publishing requires authentication with the npm registry:

```bash
# Login (interactive — opens browser for 2FA)
npm login

# Or use an automation token (for CI/CD)
npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN
```

> **Tip:** Create a Granular Access Token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) with **Read and write** permission scoped to `@rajeev02` packages for CI/CD pipelines.

### Package Paths

| Package      | Source                       | Publishable Directory        |
| ------------ | ---------------------------- | ---------------------------- |
| vault        | `packages/vault/ts-wrapper/` | `packages/vault/ts-wrapper/` |
| notify       | `packages/notify/`           | `packages/notify/`           |
| ui           | `packages/ui/`               | `packages/ui/`               |
| auth         | `packages/auth/`             | `packages/auth/`             |
| payments     | `packages/payments/`         | `packages/payments/`         |
| camera       | `packages/camera/`           | `packages/camera/`           |
| deeplink     | `packages/deeplink/`         | `packages/deeplink/`         |
| document     | `packages/document/`         | `packages/document/`         |
| edge-ai      | `packages/edge-ai/`          | `packages/edge-ai/`          |
| media        | `packages/media/`            | `packages/media/`            |
| video-editor | `packages/video-editor/`     | `packages/video-editor/`     |
| app-shell    | `packages/app-shell/`        | `packages/app-shell/`        |

## License

MIT © 2026 Rajeev Kumar Joshi
