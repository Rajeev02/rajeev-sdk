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

# Test the Rust code (no phone needed!)
cargo test --manifest-path packages/vault/rust-core/Cargo.toml
```

You should see output like:
```
running 16 tests
test crypto::tests::test_encrypt_decrypt_roundtrip ... ok
test crypto::tests::test_wrong_key_fails ... ok
test storage::tests::test_store_and_retrieve ... ok
...
test result: ok. 16 passed; 0 failed
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
|- packages/vault/
|  |- rust-core/              <- THE BRAIN: Encryption + Storage logic in Rust
|  |  |- src/
|  |  |  |- lib.rs            <- Main entry point, ties everything together
|  |  |  |- vault.udl         <- Interface definition (generates Swift/Kotlin code)
|  |  |  |- crypto/mod.rs     <- AES-256-GCM encrypt/decrypt, hashing
|  |  |  |- storage/mod.rs    <- SQLite database, namespaces, expiry, CRUD
|  |  |- Cargo.toml           <- Rust dependencies
|  |
|  |- ts-wrapper/             <- THE API: What you import in React Native
|  |  |- src/
|  |  |  |- index.ts          <- Main export file
|  |  |  |- vault.ts          <- Vault class with all methods
|  |  |  |- hooks.ts          <- React hooks (useVault, useVaultValue)
|  |  |  |- types.ts          <- TypeScript type definitions
|  |  |  |- native-bridge.ts  <- Connects TS to native Rust module
|  |
|  |- android/                <- Android bridge (Kotlin -> Rust via JNI)
|  |- ios/                    <- iOS bridge (Swift -> Rust via C FFI)
|
|- tools/rust-build/          <- Build scripts for each platform
|- docs/                      <- Documentation
```

---

## Next Steps After Setup

Once everything builds, we will:

1. Create a React Native demo app that uses the vault
2. Build the Network library (same pattern)
3. Build the Sync library
4. Build the Locale library
5. Build the Notify library
6. Build the UI component library

Each library follows the EXACT same pattern:
  Rust core -> UniFFI bindings -> Native Module -> TypeScript API
