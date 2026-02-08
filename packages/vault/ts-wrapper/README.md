# @rajeev02/vault

[![npm version](https://img.shields.io/npm/v/@rajeev02/vault.svg)](https://www.npmjs.com/package/@rajeev02/vault)
[![license](https://img.shields.io/npm/l/@rajeev02/vault.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**AES-256-GCM encrypted key-value storage** with namespaces, expiry, hashing, and biometric gating — powered by Rust for maximum performance and security.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Bank-grade encryption** — AES-256-GCM (the same standard used by banks and governments)
- **Rust-powered** — Crypto logic runs in native Rust, not JavaScript. No key exposure in JS memory.
- **Offline-first** — SQLite-backed storage works without network. Data persists across app restarts.
- **Biometric gating** — Optionally require Face ID / Touch ID / fingerprint before reading sensitive keys
- **Namespaces + expiry** — Organize keys by context, auto-expire tokens after TTL
- **Truly cross-platform** — Same API on iOS, Android, Web (WASM), watchOS, and Wear OS

## ⚠️ Native Module Required

This package includes a **native Rust module** compiled via UniFFI (iOS/Android) and WASM (Web). It will NOT work in **Expo Go** or any JS-only environment.

| Platform    | Setup required                                                                 |
| ----------- | ------------------------------------------------------------------------------ |
| **iOS**     | Run `cd ios && pod install` after `npm install`                                |
| **Android** | Rebuild your app (`npx react-native run-android` or `./gradlew assembleDebug`) |
| **Web**     | Import from `@rajeev02/vault/web` (WASM bundle auto-loaded)                    |
| **Expo**    | Must use a development build (`npx expo prebuild`) — Expo Go is not supported  |

The encrypted storage, crypto operations, and SQLite persistence all run in **native Rust** — not JavaScript. This means the native binary must be linked to your app.

## Platform Support

| Platform     | Engine            | Status |
| ------------ | ----------------- | ------ |
| iOS 16+      | Rust → UniFFI     | ✅     |
| Android 7+   | Rust → UniFFI JNI | ✅     |
| Web          | Rust → WASM       | ✅     |
| watchOS 9+   | Rust → UniFFI     | ✅     |
| Wear OS      | Rust → UniFFI     | ✅     |
| Android Auto | Rust → UniFFI     | ✅     |

## Installation

```bash
npm install @rajeev02/vault

# iOS (after install)
cd ios && pod install
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0
- `expo` >= 54.0.0 _(optional)_

## Quick Start

```typescript
import { Vault } from "@rajeev02/vault";

// Create an encrypted vault
const vault = await Vault.create({
  appId: "my-app",
  encryption: "AES-256-GCM",
});

// Store and retrieve secrets
await vault.set("auth_token", "eyJhbGciOi…");
const token = await vault.get("auth_token"); // → 'eyJhbGciOi…'

// JSON convenience
await vault.setJSON("profile", { name: "Rajeev", lang: "hi" });
const profile = await vault.getJSON<{ name: string }>("profile");

// Namespaces — isolate data by context
const userVault = vault.namespace("user-123");
await userVault.set("preferences", "dark-mode");

// Expiry — auto-delete after TTL
await vault.set("otp", "483921", { expiry: "5m" });

// Biometric gating (iOS Face ID / Android fingerprint)
await vault.set("bank_pin", "8491", { biometricRequired: true });
const pin = await vault.get("bank_pin"); // triggers biometric prompt

// Hashing — one-way hash for password verification
const hash = await vault.hash("my-password");
const matches = await vault.verifyHash("my-password", hash); // → true

// Bulk operations
await vault.setMany([
  { key: "a", value: "1" },
  { key: "b", value: "2" },
]);
const all = await vault.getAll(); // → Map of all key-value pairs

// Cleanup
await vault.delete("auth_token");
await vault.clear(); // Remove all keys
```

## React Hooks

```typescript
import { useVault, useVaultValue } from "@rajeev02/vault";

function SecureComponent() {
  const vault = useVault({ appId: "my-app" });
  const [token, setToken] = useVaultValue(vault, "auth_token");

  return <Text>{token ?? "No token"}</Text>;
}
```

## API Reference

| Method                           | Returns                   | Description                     |
| -------------------------------- | ------------------------- | ------------------------------- |
| `Vault.create(config)`           | `Promise<Vault>`          | Create encrypted vault instance |
| `vault.set(key, value, opts?)`   | `Promise<void>`           | Store encrypted value           |
| `vault.get(key)`                 | `Promise<string \| null>` | Retrieve decrypted value        |
| `vault.setJSON(key, obj, opts?)` | `Promise<void>`           | Store JSON object               |
| `vault.getJSON<T>(key)`          | `Promise<T \| null>`      | Retrieve parsed JSON            |
| `vault.delete(key)`              | `Promise<void>`           | Delete a key                    |
| `vault.clear()`                  | `Promise<void>`           | Delete all keys                 |
| `vault.has(key)`                 | `Promise<boolean>`        | Check if key exists             |
| `vault.keys()`                   | `Promise<string[]>`       | List all keys                   |
| `vault.getAll()`                 | `Promise<Map>`            | Get all key-value pairs         |
| `vault.namespace(ns)`            | `Vault`                   | Create namespaced sub-vault     |
| `vault.hash(input)`              | `Promise<string>`         | One-way hash                    |
| `vault.verifyHash(input, hash)`  | `Promise<boolean>`        | Verify hash match               |

## Architecture

```
TypeScript API (this package)
    ↓
Native Bridge (auto-generated by UniFFI)
    ↓
Rust Core (rajeev-vault-core)
  ├── AES-256-GCM encryption (aes-gcm 0.10)
  ├── SQLite storage (rusqlite 0.38)
  ├── Key derivation (PBKDF2 / Argon2)
  └── Secure random (rand 0.9)
```

## Full Documentation

📖 [Complete API docs with platform-specific examples](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/VAULT.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
