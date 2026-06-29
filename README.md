# rajeev-sdk

> Cross-platform infrastructure libraries by Rajeev Kumar Joshi.

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

`rajeev-sdk` is a modular, cross-platform infrastructure monorepo designed to eliminate business logic duplication across mobile, web, and edge environments. It centralizes critical operations—such as secure storage, network requests, data synchronization, and localization—into a high-performance, memory-safe Rust core.

These core components are exposed to native platforms and JavaScript runtimes via automatically generated type-safe bindings (using UniFFI and WebAssembly). The SDK also provides a comprehensive suite of front-end TypeScript packages for building robust application shells.

## Features

* **Unified Rust Core**: Critical paths (cryptography in `vault`, offline-first synchronization in `sync`) are written once in Rust, ensuring deterministic behavior and memory safety across all platforms.
* **Type-Safe FFI Boundaries**: Uses Mozilla's UniFFI and `wasm-bindgen` to emit idiomatic Swift, Kotlin, and TypeScript interfaces automatically.
* **Pluggable Architecture**: Components are strictly isolated in a monorepo setup (managed by Turborepo and Cargo), allowing consumers to adopt packages incrementally.
* **Zero-Knowledge Secure Storage**: The `vault` package utilizes AES-GCM and PBKDF2 for robust, cross-platform local encrypted storage (backed by SQLite/Rusqlite).

## Architecture

The project employs a hub-and-spoke FFI architecture:

1. **Rust Core (`packages/<module>/rust-core`)**: The central implementation of all logic, state management, and side-effects.
2. **FFI Layer**: UniFFI generates C-ABI bindings and native scaffolds. For the web, `wasm-bindgen` emits WebAssembly modules.
3. **Language Wrappers (`packages/<module>/ts-wrapper`)**: Idiomatic TypeScript APIs that internally call the Rust Core.

## Technology Stack

| Category | Technology |
| :--- | :--- |
| **Languages** | Rust (Edition 2024), TypeScript (5.9) |
| **Build Systems** | Turborepo, Cargo, Yarn 1.x |
| **FFI & Bindings** | UniFFI, `wasm-bindgen` |
| **Core Libraries** | `serde`, `thiserror`, `aes-gcm`, `rusqlite`, `tokio` |
| **Runtimes** | Node.js (>=18.0.0), WebAssembly, iOS Native, Android Native |

## Project Structure

```text
rajeev-sdk/
├── packages/
│   ├── vault/           # Secure storage (AES-GCM, SQLite)
│   ├── network/         # Networking layer
│   ├── sync/            # Offline-first data synchronization
│   ├── locale/          # Internationalization & l10n
│   ├── ui/              # Shared TS UI components
│   ├── app-shell/       # Core application scaffolding
│   ├── edge-ai/         # On-device AI processing utilities
│   ├── media/           # Media and camera abstractions
│   └── ...              # Other TS abstractions (auth, payments, etc.)
├── examples/            # Reference integrations
│   ├── campus-connect/  # Multi-platform demonstration apps (Web, iOS, Android, WatchOS)
│   └── ...
├── tools/               # Release automation and platform-specific build scripts
├── Cargo.toml           # Root Cargo workspace manifest
└── package.json         # Root Node/Yarn workspace and Turborepo configuration
```

## Prerequisites

* **Node.js** `>= 18.0.0`
* **Yarn** `1.x` (Classic)
* **Rust Toolchain** (latest stable via `rustup`)
* Platform-specific build chains (Xcode for iOS, Android Studio/NDK for Android)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajeev02/rajeev-sdk.git
   cd rajeev-sdk
   ```

2. **Install Node dependencies:**
   ```bash
   yarn install
   ```

3. **Build the Rust Core (Wasm/Native):**
   ```bash
   npm run build:rust
   ```

4. **Build the TypeScript Wrappers:**
   ```bash
   npm run build:ts
   ```

## Development & Build Commands

The repository leverages Turborepo for task orchestration. Common commands include:

| Command | Description |
| :--- | :--- |
| `npm run build` | Full workspace build (Rust + TypeScript). |
| `npm run build:vault:ios` | Builds the vault module specifically for iOS targets. |
| `npm run build:vault:android`| Builds the vault module specifically for Android (JNI). |
| `npm run build:vault:wasm` | Compiles the vault module to WebAssembly. |
| `npm run clean` | Cleans Cargo targets and removes `dist`/`node_modules` across the tree. |

## Testing

Testing is split across the Rust backend and the TypeScript frontend.

**Run Rust Unit & Integration Tests:**
```bash
npm run test:rust
# or directly: cargo test --workspace
```

**Run TypeScript Tests:**
```bash
npm run test:ts
# or directly: yarn workspaces foreach run test
```

## Deployment & Publishing

The `tools/` directory contains custom automation for semantic versioning and package registry publishing.

1. **Verify Release (Dry Run):**
   ```bash
   npm run release:dry
   ```
2. **Bump Versions (Patch/Minor/Major):**
   ```bash
   npm run release:patch
   ```
3. **Publish to Registry:**
   ```bash
   npm run publish:all
   ```

## Contributing

1. Fork the repository and branch from `main`.
2. Implement your feature or bug fix within the appropriate `rust-core` or TS package.
3. Verify that `npm run test:rust` and `npm run test:ts` pass.
4. Submit a Pull Request. Ensure that API changes in Rust are reflected in UniFFI definitions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
