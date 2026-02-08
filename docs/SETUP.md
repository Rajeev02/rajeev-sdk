# Rajeev SDK - Setup Guide (macOS)

## Step-by-Step: Get Everything Running

Follow these steps IN ORDER. Just copy-paste each command.

---

## Step 1: Install Rust (one-time, 2 minutes)

Open Terminal and run:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

When prompted, press `1` for default installation.

Then run:

```bash
source $HOME/.cargo/env
```

Verify it worked:

```bash
rustc --version
cargo --version
```

You should see version numbers. If yes, move to Step 2.

---

## Step 2: Add Cross-Compilation Targets (one-time, 1 minute)

```bash
# iOS targets
rustup target add aarch64-apple-ios
rustup target add x86_64-apple-ios
rustup target add aarch64-apple-ios-sim

# Android targets
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add x86_64-linux-android
rustup target add i686-linux-android

# Web (WASM) target
rustup target add wasm32-unknown-unknown
```

---

## Step 3: Install Build Tools (one-time, 2 minutes)

```bash
# Android cross-compiler
cargo install cargo-ndk

# WASM build tool
cargo install wasm-pack

# FFI binding generator
cargo install uniffi-bindgen-cli
```

---

## Step 4: Install Xcode + Android Studio (if not already)

### Xcode

```bash
xcode-select --install
```

Also open App Store and install Xcode if you haven't.

### Android Studio

1. Download from https://developer.android.com/studio
2. Install it
3. Open Android Studio > SDK Manager > SDK Tools
4. Check "NDK (Side by side)" and install
5. Set the environment variable:

```bash
echo 'export ANDROID_NDK_HOME="$HOME/Library/Android/sdk/ndk/$(ls $HOME/Library/Android/sdk/ndk/ | head -1)"' >> ~/.zshrc
echo 'export ANDROID_HOME="$HOME/Library/Android/sdk"' >> ~/.zshrc
source ~/.zshrc
```

---

## Step 5: Clone and Test the Rust Core

```bash
# Navigate to your project
cd rajeev-sdk

# Test ALL Rust crates (no phone needed!)
cargo test --workspace
```

You should see output like:

```
running 29 tests (vault)
running 45 tests (network)
running 14 tests (sync)
running 27 tests (locale)
...
test result: ok. 115 passed; 0 failed
```

If all tests pass, your Rust core is working!

---

## Step 6: Build for Android

```bash
chmod +x tools/rust-build/*.sh
bash tools/rust-build/build-android.sh vault
```

This creates .so files in `packages/vault/android/src/main/jniLibs/`

---

## Step 7: Build for iOS

```bash
bash tools/rust-build/build-ios.sh vault
```

This creates .a files and Swift bindings.

---

## Step 8: Build TypeScript Wrapper

```bash
cd packages/vault/ts-wrapper
yarn install
yarn build
cd ../../..
```

---

## Troubleshooting

### "cargo: command not found"

```bash
source $HOME/.cargo/env
```

### "Android NDK not found"

Make sure you installed NDK via Android Studio SDK Manager, then:

```bash
ls $HOME/Library/Android/sdk/ndk/
```

If you see a version folder, the NDK is installed.

### "xcrun: error: SDK not found"

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Rust compilation errors

Copy the FULL error message and share it with Claude. Rust errors are very
descriptive and almost always tell you exactly what to fix.

---

## What Each File Does

```
rajeev-sdk/
|
|- packages/
|  |- vault/                  <- Secure storage (AES-256-GCM + SQLite)
|  |  |- rust-core/           <- Encryption + Storage logic in Rust
|  |  |  |- src/
|  |  |  |  |- lib.rs          <- Entry point with #[uniffi::export] proc macros
|  |  |  |  |- crypto/mod.rs  <- AES-256-GCM encrypt/decrypt, hashing
|  |  |  |  |- storage/mod.rs <- SQLite database, namespaces, expiry, CRUD
|  |  |  |- Cargo.toml        <- Rust dependencies
|  |  |- ts-wrapper/           <- TypeScript API (React hooks, vault class)
|  |  |- android/              <- Native module (Kotlin, UniFFI JNI)
|  |  |- ios/                  <- Native module (Swift, UniFFI FFI)
|  |
|  |- network/                <- Connectivity, caching, queue, optimization (Rust)
|  |- sync/                   <- CRDT conflict resolution, offline storage (Rust)
|  |- locale/                 <- Dictionary, formatting, transliteration (Rust)
|  |- auth/                   <- OAuth, biometric, sessions (TS)
|  |- payments/               <- UPI, cards, wallets (TS)
|  |- camera/                 <- Capture, filters, AR (TS)
|  |- deeplink/               <- Universal links, routing (TS)
|  |- document/               <- Scanner, OCR, PDF, signatures (TS)
|  |- edge-ai/                <- On-device ML inference (TS)
|  |- media/                  <- Audio/video player, PiP (TS)
|  |- video-editor/           <- Trim, transitions, export (TS)
|  |- app-shell/              <- Feature flags, A/B, bootstrap (TS)
|  |- notify/                 <- Notifications, inbox (TS)
|  |- ui/                     <- Design tokens, hooks, device (TS)
|
|- examples/
|  |- expo-demo/              <- Expo SDK 54 demo (iOS/Android/Web)
|  |- react-web-demo/         <- React 19 + Vite 6 demo
|  |- ios-native-demo/        <- SwiftUI native demo (15 screens)
|  |- android-native-demo/    <- Jetpack Compose demo (15 screens)
|  |- watchos-demo/           <- watchOS SwiftUI demo (8 screens)
|  |- vanilla-web-demo/       <- Single HTML, zero deps
|
|- tools/rust-build/          <- Cross-compilation scripts (iOS, Android, WASM)
|- docs/                      <- Documentation + 15 per-library API docs
```

---

## What's Already Built

All 15 packages and 6 example apps are complete:

- **4 Rust core crates** — 115 tests passing (vault, network, sync, locale)
- **11 TypeScript packages** — all compile under `--strict`
- **6 example apps** — Expo, React Web, iOS native, Android native, watchOS, Vanilla HTML

Each Rust library uses `#[uniffi::export]` proc macros. Running `ubrn build` auto-generates React Native Turbo Modules — no hand-written native bridge code needed.
