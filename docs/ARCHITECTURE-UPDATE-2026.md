# Rajeev SDK — Architecture Update (Feb 2026)

## What Changed

After research, we're upgrading the SDK architecture to use the latest tooling:

### Before (Old Approach — Manual Bridges)
```
Rust Core → hand-written Kotlin (Android) → React Native
Rust Core → hand-written Swift (iOS) → React Native
Rust Core → wasm-pack → Web
```
**Problem:** We had to write and maintain separate Kotlin + Swift + C++ bridge code manually for each library. That's 3x the work for every new feature.

### After (New Approach — Auto-Generated via uniffi-bindgen-react-native)
```
Rust Core (with #[uniffi::export] proc macros)
    → `ubrn build android` → auto-generated Turbo Module (Kotlin + C++)
    → `ubrn build ios` → auto-generated Turbo Module (Swift)
    → `ubrn build wasm` → auto-generated WASM bindings
    → TypeScript types auto-generated
```
**Result:** Write Rust once, run `ubrn build`, get working React Native Turbo Modules for all platforms. Zero hand-written native code.

## Updated Dependencies (Feb 2026)

| Package | Old Version | New Version | Notes |
|---------|------------|-------------|-------|
| uniffi | 0.29 | 0.31 | Latest stable |
| uniffi-bindgen-react-native | (not used) | 0.29.3-1 | Auto-generates TS + native modules |
| Rust edition | 2021 | 2024 | Latest stable Rust edition |
| React Native | 0.72+ | 0.83/0.84 | Turbo Modules standard |
| License year | 2024 | 2026 | Current year |

## What This Means for Development

### Old Workflow (6 steps per library)
1. Write Rust core
2. Write .udl interface file
3. Write Kotlin Android module (~200 lines)
4. Write Swift iOS module (~200 lines)
5. Write TypeScript wrapper
6. Write build scripts for each platform

### New Workflow (3 steps per library)
1. Write Rust core with `#[uniffi::export]` proc macros
2. Run `ubrn build` (auto-generates everything)
3. Write thin TypeScript convenience layer (hooks, etc.)

### What Stays the Same
- Rust core code (crypto, storage, queue, cache) — **unchanged, still excellent**
- AES-256-GCM encryption — **gold standard in 2026**
- SQLite for local storage — **still dominant**
- Monorepo structure — **still best practice**
- Cross-platform architecture — **still the right pattern**

### What We Delete
- `packages/vault/android/` (hand-written Kotlin) → replaced by auto-generated
- `packages/vault/ios/` (hand-written Swift) → replaced by auto-generated
- `packages/vault/rust-core/src/vault.udl` → replaced by proc macros
- `packages/vault/rust-core/build.rs` → no longer needed

## New Project Setup

```bash
# Install uniffi-bindgen-react-native globally
npm install -g uniffi-bindgen-react-native

# Initialize a new library (one-time setup)
npx ubrn init --name vault

# Build for all platforms
npx ubrn build android
npx ubrn build ios

# The TypeScript bindings are auto-generated!
```

## New Rust Code Style (proc macros instead of .udl)

```rust
// OLD: Separate .udl file + build.rs scaffolding
// NEW: Just annotate your Rust code directly

#[derive(uniffi::Record)]
pub struct VaultConfig {
    pub app_id: String,
    pub db_path: Option<String>,
}

#[derive(uniffi::Enum)]
pub enum VaultError {
    EncryptionFailed,
    KeyNotFound,
    StorageError { msg: String },
}

#[derive(uniffi::Object)]
pub struct RajeevVault { ... }

#[uniffi::export]
impl RajeevVault {
    #[uniffi::constructor]
    pub fn new(config: VaultConfig) -> Result<Self, VaultError> { ... }

    pub fn store(&self, key: String, value: String) -> Result<(), VaultError> { ... }
    pub fn retrieve(&self, key: String) -> Result<Option<String>, VaultError> { ... }
}
```

This is cleaner, more maintainable, and the tooling auto-generates all platform bridges.

## Impact on Existing Code

**Rust core logic:** Zero changes needed. The crypto, storage, queue, cache modules are perfect as-is.

**What changes:** How we expose the Rust to TypeScript. Instead of .udl + manual bridges, we use proc macros + `ubrn`.

## Completed Milestones

1. ~~Migrate vault's lib.rs to use proc macros instead of .udl~~ — **Done**
2. ~~Set up ubrn config~~ — **Done**
3. ~~Test with a real React Native 0.84 app~~ — **Done** (Expo SDK 54 demo app)
4. ~~Apply same pattern to network, sync, locale, notify, ui~~ — **Done** (all 15 packages built)
5. ~~Build 6 example apps~~ — **Done** (Expo, React Web, iOS native, Android native, watchOS, Vanilla HTML)
6. ~~115 Rust tests passing across 4 crates~~ — **Done**
7. ~~All 11 TypeScript packages compile clean under `--strict`~~ — **Done**
