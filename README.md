# 🚀 Rajeev SDK

**Cross-platform infrastructure libraries for building apps that work everywhere — from ₹5000 Android phones in villages to Apple Watch on city wrists.**

Built by [Rajeev Joshi](https://github.com/Rajeev02)

---

## 📦 Packages

| Package             | Description                      | Core Language | Status   |
| ------------------- | -------------------------------- | ------------- | -------- |
| `@rajeev02/vault`   | Universal Secure Storage         | Rust          | ✅ Built |
| `@rajeev02/network` | Connectivity-Aware Network Layer | Rust          | ✅ Built |
| `@rajeev02/sync`    | Offline-First Sync Engine        | Rust          | ✅ Built |
| `@rajeev02/locale`  | Smart Localization Engine        | Rust          | ✅ Built |
| `@rajeev02/notify`  | Unified Notification Layer       | TypeScript    | ✅ Built |
| `@rajeev02/ui`      | Adaptive UI Component System     | TypeScript    | ✅ Built |

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│       Your App (React Native / Expo)         │
├──────────────────────────────────────────────┤
│       TypeScript API Layer (NPM packages)    │
│  @rajeev02/vault  @rajeev02/network  etc.   │
├──────────────────────────────────────────────┤
│     Auto-generated Turbo Modules (ubrn)      │
│  uniffi-bindgen-react-native → TS + Native   │
├──────────────────────────────────────────────┤
│           Rust Core (shared logic)           │
│  vault-core | network-core | sync-core      │
├────────┬─────────┬─────────┬─────────────────┤
│Android │  iOS    │  Web    │ Watch/Auto/IoT  │
│ Turbo  │ Turbo   │  WASM   │ Native binary   │
│ Module │ Module  │         │                 │
└────────┴─────────┴─────────┴─────────────────┘
```

Rust core code is annotated with `#[uniffi::export]` proc macros. Running `ubrn build` auto-generates React Native Turbo Modules for Android and iOS — no hand-written Kotlin or Swift bridge code needed.

Works with both bare React Native 0.84+ and Expo SDK 54+ (via Expo Modules / custom dev client).

## 🖥️ Platform Support

| Platform | Android | iOS | Web | Wear OS | watchOS | Android Auto | IoT |
| -------- | ------- | --- | --- | ------- | ------- | ------------ | --- |
| Vault    | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           | ✅  |
| Network  | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           | ✅  |
| Sync     | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           | ✅  |
| Locale   | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           | ✅  |
| Notify   | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           | ❌  |
| UI       | ✅      | ✅  | ✅  | ✅      | ✅      | ✅           | ❌  |

## 🚀 Quick Start

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
npm install -g uniffi-bindgen-react-native   # ubrn — auto-generates native bridges

# 4. Install Android NDK (if not already)
# Open Android Studio → SDK Manager → SDK Tools → NDK (Side by side) → Install

# 5. Install Xcode command line tools
xcode-select --install

# 6. Clone and setup
git clone https://github.com/Rajeev02/rajeev-sdk.git
cd rajeev-sdk
yarn install
```

### Usage

```typescript
import { Vault } from "@rajeev02/vault";

const vault = await Vault.create({ appId: "com.myapp" });
await vault.set("token", "my-secret-value", { expiry: "24h" });
const token = await vault.get("token");
```

## �️ Tech Stack

| Layer          | Technology                   | Version      |
| -------------- | ---------------------------- | ------------ |
| Rust edition   | Rust 2024                    | stable       |
| FFI bindings   | uniffi                       | 0.31         |
| Bridge codegen | uniffi-bindgen-react-native  | 0.29.3-1     |
| Encryption     | AES-256-GCM (aes-gcm)        | 0.10.3       |
| Local storage  | SQLite (rusqlite)            | 0.38         |
| Error handling | thiserror                    | 2.0          |
| Serialization  | serde / serde_json           | 1.0          |
| Random         | rand                         | 0.9          |
| React Native   | Turbo Modules                | 0.84         |
| Expo           | Expo SDK                     | 54           |
| Android        | compileSdk / targetSdk 35    | API 24+      |
| iOS            | Swift 6.0                    | iOS 16.0+    |
| watchOS        | Swift 6.0                    | watchOS 9.0+ |
| Build system   | Turborepo + Cargo workspaces | latest       |
| TypeScript     | ^5.4                         | latest       |

## 📁 Project Structure

```
rajeev-sdk/
├── packages/
│   ├── vault/              # @rajeev02/vault
│   │   ├── rust-core/      # Rust crate (crypto + storage)
│   │   ├── ts-wrapper/     # TypeScript API + hooks
│   │   ├── android/        # Auto-generated Turbo Module (via ubrn)
│   │   ├── ios/            # Auto-generated Turbo Module (via ubrn)
│   │   └── package.json
│   ├── network/            # @rajeev02/network
│   │   └── rust-core/      # Connectivity, caching, queue, optimization
│   ├── sync/               # @rajeev02/sync
│   │   └── rust-core/      # CRDT conflict resolution, offline storage
│   ├── locale/             # @rajeev02/locale
│   │   └── rust-core/      # Dictionary, formatting, transliteration
│   ├── notify/             # @rajeev02/notify (TypeScript)
│   │   └── src/            # Inbox, scheduler
│   └── ui/                 # @rajeev02/ui (TypeScript)
│       └── src/            # Device detection, hooks, design tokens
├── tools/
│   └── rust-build/         # Cross-compilation scripts
├── docs/                   # Architecture docs, setup guide
├── Cargo.toml              # Rust workspace
├── package.json            # JS workspace (Yarn workspaces)
└── turbo.json              # Build orchestration
```

## � Docs

- [Setup Guide](docs/SETUP.md) — step-by-step environment setup
- [Architecture Update (Feb 2026)](docs/ARCHITECTURE-UPDATE-2026.md) — migration to ubrn + Turbo Modules

## 📄 License

MIT © 2026 Rajeev Joshi
