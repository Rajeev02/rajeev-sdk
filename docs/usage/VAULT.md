# @rajeev02/vault

**AES-256-GCM encrypted key-value storage** with namespaces, expiry, hashing, and biometric gating.

| Platform            | Engine                     | Binding                           |
| ------------------- | -------------------------- | --------------------------------- |
| iOS 16+             | Rust (`rajeev-vault-core`) | UniFFI → Swift native module      |
| Android 7+ (API 24) | Rust (`rajeev-vault-core`) | UniFFI → Kotlin JNI native module |
| Web                 | Rust → WASM                | `wasm-bindgen` + JS glue          |
| watchOS 9+          | Rust (`rajeev-vault-core`) | UniFFI → Swift                    |
| Wear OS             | Rust (`rajeev-vault-core`) | UniFFI → Kotlin                   |
| Android Auto        | Rust (`rajeev-vault-core`) | UniFFI → Kotlin                   |

---

## Prerequisites

> **⚠️ This package includes a native Rust module** compiled via UniFFI (iOS/Android) and WASM (Web). It will NOT work in Expo Go or any JS-only environment.

| Platform | Setup required |
| -------- | -------------- |
| **iOS** | Run `cd ios && pod install` after `npm install` |
| **Android** | Rebuild your app (`npx react-native run-android` or `./gradlew assembleDebug`) |
| **Web** | Import from `@rajeev02/vault/web` (WASM bundle auto-loaded) |
| **Expo** | Must use a development build (`npx expo prebuild`) — Expo Go is not supported |

The encrypted storage, crypto operations, and SQLite persistence all run in **native Rust** — not JavaScript. The native binary must be linked to your app at build time.

---

## Installation

```bash
# React Native / Expo
npm install @rajeev02/vault

# iOS (after install)
cd ios && pod install
```

### Peer Dependencies

| Package        | Version                 |
| -------------- | ----------------------- |
| `react`        | `>=18.3.0`              |
| `react-native` | `>=0.84.0`              |
| `expo`         | `>=54.0.0` _(optional)_ |

---

## Quick Start

```typescript
import { Vault } from "@rajeev02/vault";

// Create an encrypted vault
const vault = await Vault.create({
  appId: "my-app",
  encryption: "AES-256-GCM",
});

// Store and retrieve
await vault.set("auth_token", "eyJhbGciOi…");
const token = await vault.get("auth_token"); // → 'eyJhbGciOi…'

// JSON convenience
await vault.setJSON("profile", { name: "Rajeev", lang: "hi" });
const profile = await vault.getJSON<{ name: string; lang: string }>("profile");
```

---

## Platform Usage

### iOS (React Native)

```typescript
import { Vault } from "@rajeev02/vault";

const vault = await Vault.create({
  appId: "my-ios-app",
  encryption: "AES-256-GCM",
  biometricAvailable: true, // Enable Face ID / Touch ID gating
});

// Store with biometric requirement
await vault.set("bank_pin", "8491", {
  biometricRequired: true,
  expiry: "24h",
});

// Retrieval triggers biometric prompt on-device
const pin = await vault.get("bank_pin");
```

The native module (`RajeevVault`) is registered automatically via CocoaPods. It links against `librajeev_vault_core.a` built from Rust.

**Minimum targets:** iOS 16.0, watchOS 9.0, Swift 6.0.

### Android (React Native)

```typescript
import { Vault } from "@rajeev02/vault";

const vault = await Vault.create({
  appId: "my-android-app",
  encryption: "AES-256-GCM",
  biometricAvailable: true, // Fingerprint / face unlock
});

await vault.set("refresh_token", "rft_abc123", {
  expiry: "7d",
  biometricRequired: true,
});
```

The native module loads `librajeev_vault_core.so` via JNI. Supported ABIs: `arm64-v8a`, `armeabi-v7a`, `x86_64`, `x86`.

**Minimum targets:** `compileSdk 35`, `minSdk 24` (Android 7.0+), Kotlin 2.1.0.

### Web (Expo / React Native Web)

```typescript
import { Vault } from "@rajeev02/vault";

// On web, the WASM module is loaded automatically
const vault = await Vault.create({
  appId: "my-web-app",
  encryption: "AES-256-GCM",
});

await vault.set("session", "sess_xyz");
const session = await vault.get("session");
```

The web build uses `wasm-bindgen` exports compiled via `wasm-pack`. The WASM binary (~1.1 MB) is loaded lazily.

**WASM-specific exports** (lower level):

```typescript
import init, {
  wasm_generate_encryption_key,
  wasm_hash_value,
  wasm_verify_hash,
} from "@rajeev02/vault/wasm";

await init(); // Load WASM module

const key = wasm_generate_encryption_key();
const hash = wasm_hash_value("password123");
const ok = wasm_verify_hash("password123", hash); // true
```

### watchOS

The vault Rust core compiles to watchOS via UniFFI → Swift. Use the same `Vault` API from your WatchKit extension:

```swift
// Swift (watchOS)
let config = VaultConfig(appId: "my-watch-app", encryption: "AES-256-GCM")
let vault = try RajeevVault(config: config)
try vault.store(key: "heart_rate", value: "72", options: StoreOptions())
```

### Android Auto

Uses the same Android native module. The Vault API works identically inside an Android Auto service:

```kotlin
// Kotlin (Android Auto)
val module = RajeevVaultModule(reactContext)
module.create(config, promise)
module.store("destination", "Office", null, false, true, null, promise)
```

---

## API Reference

### `Vault` (class)

#### `Vault.create(config: VaultConfig): Promise<Vault>`

Creates a new vault instance with encrypted SQLite storage.

```typescript
interface VaultConfig {
  appId: string; // Unique app identifier
  dbPath?: string; // Custom database path (optional)
  encryption?: "AES-256-GCM"; // Encryption algorithm (default)
  biometricAvailable?: boolean; // Enable biometric gating (default: false)
}
```

#### `vault.set(key, value, options?): Promise<void>`

Store an encrypted key-value pair.

```typescript
interface StoreOptions {
  expiry?: string | null; // "30m", "24h", "7d", "4w" (null = never)
  biometricRequired?: boolean; // Require biometric auth on read (default: false)
  exportable?: boolean; // Allow export (default: true)
  namespace?: string; // Namespace partition (default: 'default')
}

await vault.set("api_key", "sk_live_abc", {
  expiry: "7d",
  namespace: "credentials",
});
```

#### `vault.get(key, namespace?): Promise<string | null>`

Retrieve a decrypted value. Returns `null` if not found. Throws `VaultError` with code `KEY_EXPIRED` if expired.

```typescript
const value = await vault.get("api_key", "credentials");
```

#### `vault.getJSON<T>(key, namespace?): Promise<T | null>`

Retrieve and parse a JSON value.

```typescript
const profile = await vault.getJSON<{ name: string }>("profile");
```

#### `vault.setJSON<T>(key, value, options?): Promise<void>`

Stringify and store a JSON value.

```typescript
await vault.setJSON("settings", { theme: "dark", lang: "hi" });
```

#### `vault.delete(key, namespace?): Promise<boolean>`

Delete a key. Returns `true` if the key existed.

#### `vault.has(key, namespace?): Promise<boolean>`

Check if a key exists (does not decrypt).

#### `vault.keys(namespace?): Promise<string[]>`

List all keys in a namespace.

#### `vault.namespaces(): Promise<string[]>`

List all namespaces.

---

### Namespaces

Namespaces isolate keys into logical partitions.

```typescript
const auth = vault.namespace("auth");
const payments = vault.namespace("payments");

await auth.set("token", "eyJ…");
await payments.set("token", "pay_xyz");

await auth.get("token"); // → 'eyJ…'
await payments.get("token"); // → 'pay_xyz'

await auth.keys(); // → ['token']
await auth.wipe(); // Clears only the 'auth' namespace
```

`NamespacedVault` exposes: `set`, `get`, `getJSON`, `setJSON`, `delete`, `has`, `keys`, `wipe`.

---

### Static Methods

#### `Vault.generateKey(): Promise<string>`

Generate a 256-bit cryptographically secure random key (base64-encoded).

```typescript
const key = await Vault.generateKey();
// → "a3F7kL2m…" (44 chars base64)
```

#### `Vault.hash(input): Promise<string>`

SHA-256 hash with random salt. Format: `s:<salt>:<hash>`.

```typescript
const hash = await Vault.hash("password123");
// → "s:a1b2c3…:d4e5f6…"
```

#### `Vault.verifyHash(input, hash): Promise<boolean>`

Verify a previously hashed value.

```typescript
await Vault.verifyHash("password123", hash); // → true
await Vault.verifyHash("wrong", hash); // → false
```

---

### Stats & Cleanup

```typescript
const stats = await vault.stats();
// → { totalEntries: 12, totalNamespaces: 3, expiredEntries: 2, storageBytes: 8192 }

await vault.cleanup(); // Remove expired entries
await vault.wipeAll(); // Destroy all data + VACUUM
```

---

### React Hooks

```typescript
import { useVault, useVaultValue, useVaultJSON, useVaultStats } from '@rajeev02/vault';

function MyComponent() {
  // Initialize
  const { vault, isReady, error } = useVault({ appId: 'demo' });

  // Read a single value (auto-refreshes)
  const { value, isLoading, refresh } = useVaultValue(vault, 'auth_token');

  // Read parsed JSON
  const { data: profile } = useVaultJSON<{ name: string }>(vault, 'profile');

  // Stats
  const { stats } = useVaultStats(vault);

  if (!isReady) return <Loading />;
  return <Text>{value}</Text>;
}
```

---

### Error Handling

```typescript
import { VaultError, VaultErrorCode } from "@rajeev02/vault";

try {
  await vault.get("expired_key");
} catch (e) {
  if (e instanceof VaultError) {
    switch (e.code) {
      case VaultErrorCode.KEY_EXPIRED:
        console.log("Key has expired");
        break;
      case VaultErrorCode.BIOMETRIC_REQUIRED:
        console.log("Biometric authentication needed");
        break;
      case VaultErrorCode.ENCRYPTION_FAILED:
      case VaultErrorCode.DECRYPTION_FAILED:
        console.log("Crypto error:", e.message);
        break;
    }
  }
}
```

**Error codes:** `ENCRYPTION_FAILED`, `DECRYPTION_FAILED`, `KEY_NOT_FOUND`, `KEY_EXPIRED`, `STORAGE_ERROR`, `INVALID_CONFIG`, `BIOMETRIC_REQUIRED`, `BIOMETRIC_FAILED`, `NOT_INITIALIZED`.

---

### Cryptography Details

| Parameter      | Value                                       |
| -------------- | ------------------------------------------- |
| Encryption     | AES-256-GCM (authenticated encryption)      |
| Key Derivation | PBKDF2 with HMAC-SHA256, 100,000 iterations |
| Key Size       | 256 bits (32 bytes)                         |
| Salt Size      | 256 bits (32 bytes, random per entry)       |
| Nonce Size     | 96 bits (12 bytes, random per operation)    |
| Hashing        | SHA-256 with random 32-byte salt            |

---

### Build from Source

```bash
# Build native libraries
./tools/rust-build/build-ios.sh vault     # iOS + watchOS
./tools/rust-build/build-android.sh vault # Android + Wear OS
./tools/rust-build/build-wasm.sh vault    # Web (WASM)

# Run Rust tests
cargo test -p rajeev-vault-core
```
