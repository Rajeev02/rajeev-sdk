# Rajeev SDK — Usage Guide

**Cross-platform infrastructure SDK for React Native, Expo & Web — powered by Rust.**

15 packages. One consistent API across iOS, Android, Web, watchOS, Wear OS, and Android Auto.

---

## Packages

| Package                                           | Description                                           | Engine     | Docs                                     |
| ------------------------------------------------- | ----------------------------------------------------- | ---------- | ---------------------------------------- |
| [`@rajeev02/vault`](usage/VAULT.md)               | AES-256-GCM encrypted key-value storage               | Rust       | [VAULT.md](usage/VAULT.md)               |
| [`@rajeev02/network`](usage/NETWORK.md)           | Connectivity-aware networking with queue & cache      | Rust       | [NETWORK.md](usage/NETWORK.md)           |
| [`@rajeev02/locale`](usage/LOCALE.md)             | Indian localization, INR formatting, transliteration  | Rust       | [LOCALE.md](usage/LOCALE.md)             |
| [`@rajeev02/sync`](usage/SYNC.md)                 | Offline-first CRDT sync engine                        | Rust       | [SYNC.md](usage/SYNC.md)                 |
| [`@rajeev02/notify`](usage/NOTIFY.md)             | Notification scheduling with inbox                    | TypeScript | [NOTIFY.md](usage/NOTIFY.md)             |
| [`@rajeev02/ui`](usage/UI.md)                     | Design tokens, device detection, theming              | TypeScript | [UI.md](usage/UI.md)                     |
| [`@rajeev02/auth`](usage/AUTH.md)                 | Phone OTP, social sign-in, Aadhaar eKYC, JWT sessions | TypeScript | [AUTH.md](usage/AUTH.md)                 |
| [`@rajeev02/payments`](usage/PAYMENTS.md)         | UPI, card validation, wallets, subscriptions          | TypeScript | [PAYMENTS.md](usage/PAYMENTS.md)         |
| [`@rajeev02/camera`](usage/CAMERA.md)             | Camera capture, 24 filters, photo editor              | TypeScript | [CAMERA.md](usage/CAMERA.md)             |
| [`@rajeev02/deeplink`](usage/DEEPLINK.md)         | Universal deep linking & UTM attribution              | TypeScript | [DEEPLINK.md](usage/DEEPLINK.md)         |
| [`@rajeev02/document`](usage/DOCUMENT.md)         | Document picker, PDF editor, signatures               | TypeScript | [DOCUMENT.md](usage/DOCUMENT.md)         |
| [`@rajeev02/edge-ai`](usage/EDGE-AI.md)           | On-device OCR, ML pipeline, voice AI                  | TypeScript | [EDGE-AI.md](usage/EDGE-AI.md)           |
| [`@rajeev02/media`](usage/MEDIA.md)               | Adaptive streaming, PiP, DRM, offline downloads       | TypeScript | [MEDIA.md](usage/MEDIA.md)               |
| [`@rajeev02/video-editor`](usage/VIDEO-EDITOR.md) | Multi-track timeline, effects, export presets         | TypeScript | [VIDEO-EDITOR.md](usage/VIDEO-EDITOR.md) |
| [`@rajeev02/app-shell`](usage/APP-SHELL.md)       | API client, chat, cart, forms, feature flags          | TypeScript | [APP-SHELL.md](usage/APP-SHELL.md)       |

---

## Platform Support Matrix

All 15 packages support every platform:

| Platform                | Rust Packages (4) | TypeScript Packages (11) |
| ----------------------- | :---------------: | :----------------------: |
| **iOS 16+**             |        ✅         |            ✅            |
| **Android 7+ (API 24)** |        ✅         |            ✅            |
| **Web**                 |        ✅         |            ✅            |
| **watchOS 9+**          |        ✅         |            ✅            |
| **Wear OS**             |        ✅         |            ✅            |
| **Android Auto**        |        ✅         |            ✅            |

---

## Requirements

| Tool              | Version                |
| ----------------- | ---------------------- |
| Node.js           | ≥ 18.0                 |
| React             | ≥ 18.3                 |
| React Native      | ≥ 0.84                 |
| Expo _(optional)_ | ≥ 54                   |
| Rust              | ≥ 1.82 (edition 2024)  |
| Xcode             | ≥ 16 (iOS builds)      |
| Android NDK       | ≥ r26 (Android builds) |

---

## Installation

### All Packages

```bash
npm install @rajeev02/vault @rajeev02/network @rajeev02/locale @rajeev02/sync @rajeev02/notify @rajeev02/ui
```

### iOS Setup

```bash
cd ios && pod install
```

### Individual Packages

```bash
# Pick only what you need
npm install @rajeev02/vault      # Secure storage
npm install @rajeev02/network    # Smart networking
npm install @rajeev02/locale     # Localization
npm install @rajeev02/sync       # Offline sync
npm install @rajeev02/notify     # Notifications
npm install @rajeev02/ui         # Design system
```

---

## Quick Start by Platform

### iOS (React Native)

```typescript
import { Vault } from "@rajeev02/vault";
import { NotificationScheduler } from "@rajeev02/notify";
import { colors, spacing } from "@rajeev02/ui";

// Encrypted storage with Face ID
const vault = await Vault.create({
  appId: "my-app",
  biometricAvailable: true,
});
await vault.set("pin", "1234", { biometricRequired: true });

// Schedule a notification
const scheduler = new NotificationScheduler();
scheduler.schedule({
  id: "reminder",
  title: "Task due",
  body: "Complete your daily review",
  platform: { ios: { sound: "reminder.wav", badge: 1 } },
});
```

### Android (React Native)

```typescript
import { Vault } from "@rajeev02/vault";
import { RajeevNetwork } from "@rajeev02/network";

// Encrypted storage
const vault = await Vault.create({ appId: "my-app" });
await vault.set("token", "abc123", { expiry: "7d" });

// Smart networking
const network = new RajeevNetwork({
  appId: "my-app",
  dbDir: filesDir,
  enableQueue: true,
  enableCache: true,
});
network.updateStatus("4g", 25000, 50, false);
const timeout = network.getSuggestedTimeoutMs(); // → 10000
```

### Web (Expo)

```typescript
import { Vault } from "@rajeev02/vault";
import { formatINRShort, TranslationEngine } from "@rajeev02/locale";
import { detectDeviceType, getTheme } from "@rajeev02/ui";

// WASM-backed vault (loads automatically on web)
const vault = await Vault.create({ appId: "web-app" });
await vault.set("session", "sess_xyz");

// Indian currency formatting
const price = formatINRShort(2500000); // → '₹25 Lakh'

// Responsive theming
const device = detectDeviceType(window.innerWidth, window.innerHeight);
const theme = getTheme("dark");
```

### watchOS

```typescript
import { Vault } from "@rajeev02/vault";
import { SyncStorage } from "@rajeev02/sync";
import { getMinTouchTarget, getFontMultiplier } from "@rajeev02/ui";

// Sync health data between watch and phone
const sync = new SyncStorage(":memory:", "watch-01");
await sync.insert(
  "health",
  JSON.stringify({ heartRate: 72, timestamp: Date.now() }),
);

// Adaptive sizing for watch
const touchTarget = getMinTouchTarget("watch"); // → 38dp
const fontScale = getFontMultiplier("watch"); // → 0.85
```

### Android Auto

```typescript
import { NotificationScheduler } from "@rajeev02/notify";
import { TranslationEngine } from "@rajeev02/locale";

const scheduler = new NotificationScheduler();
scheduler.schedule({
  id: "nav-alert",
  title: "Traffic ahead",
  body: "2 km delay on NH48",
  priority: "high",
  platform: {
    auto: { ttsText: "Traffic alert. Two kilometer delay ahead on NH 48." },
  },
});
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Your App                          │
│         React Native / Expo / Web                    │
├──────────┬──────────┬──────────┬─────────┬──────────┤
│  Vault   │ Network  │  Locale  │  Sync   │  Notify  │  ← TypeScript API
│  (TS)    │  (TS)    │  (TS)    │  (TS)   │  (TS)    │
├──────────┴──────────┴──────────┴─────────┤          │
│              Native Bridge                │  UI      │
│     UniFFI (iOS/Android) │ WASM (Web)     │  (TS)   │
├──────────┬──────────┬──────────┬─────────┤          │
│  vault   │ network  │  locale  │  sync   │          │  ← Rust Core
│  core    │  core    │  core    │  core   │          │
│  (Rust)  │  (Rust)  │  (Rust)  │  (Rust) │          │
└──────────┴──────────┴──────────┴─────────┴──────────┘
```

**Rust-powered packages** (vault, network, locale, sync):

- iOS/Android: Rust → UniFFI → Swift/Kotlin native modules
- Web: Rust → `wasm-pack` → WASM + JS bindings

**Pure TypeScript packages** (notify, ui):

- Run identically on all platforms

---

## Building from Source

### Prerequisites

```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
rustup target add wasm32-unknown-unknown

# wasm-pack (for web builds)
cargo install wasm-pack

# cargo-ndk (for Android builds)
cargo install cargo-ndk
```

### Build Commands

```bash
# All platforms (vault)
./tools/rust-build/build-all.sh

# Individual targets
./tools/rust-build/build-ios.sh vault       # iOS universal + simulator
./tools/rust-build/build-android.sh vault   # Android (4 ABIs)
./tools/rust-build/build-wasm.sh vault      # Web (WASM)

# Any package
./tools/rust-build/build-ios.sh network
./tools/rust-build/build-android.sh sync
./tools/rust-build/build-wasm.sh locale
```

### Run Tests

```bash
# All Rust crates
cargo test --workspace

# Individual crate
cargo test -p rajeev-vault-core
cargo test -p rajeev-network-core
cargo test -p rajeev-sync-core
cargo test -p rajeev-locale-core
```

---

## Example Apps

Six example apps are included in [`examples/`](../examples/) showcasing all 15 packages:

### Expo Demo (React Native — iOS / Android / Web)
```bash
cd examples/expo-demo
npm install
npx expo start --web       # Web
npx expo start --ios       # iOS Simulator
npx expo start --android   # Android Emulator
```

### React Web Demo (Vite + React 19)
```bash
cd examples/react-web-demo
npm install
npm run dev                # http://localhost:5173
```

### Native iOS Demo (SwiftUI)
```bash
open examples/ios-native-demo/RajeevSDKDemo.xcodeproj
# Select iOS 16+ simulator → Build & Run (⌘R)
```

### Native Android Demo (Jetpack Compose)
```bash
# Open in Android Studio: File → Open → examples/android-native-demo/
# Let Gradle sync → Select emulator (API 24+) → Run ▶
```

### watchOS Demo (SwiftUI)
```bash
open examples/watchos-demo/RajeevWatchDemo.xcodeproj
# Select Apple Watch simulator → Build & Run (⌘R)
```

### Vanilla Web Demo
```bash
open examples/vanilla-web-demo/index.html
```

---

## Related Documentation

- [SETUP.md](SETUP.md) — Development environment setup
- [ARCHITECTURE-UPDATE-2026.md](ARCHITECTURE-UPDATE-2026.md) — Architecture decisions and migration plan
- [README.md](../README.md) — Project overview

---

## License

MIT
