# rajeev-sdk

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Cross-platform infrastructure libraries and core components, designed for sharing high-performance logic across web, mobile, and edge environments.

## Overview

The `rajeev-sdk` is a monorepo providing foundational building blocks for application development. It solves the problem of duplicating core business and infrastructure logic across multiple platforms by implementing critical components (like networking, secure storage, synchronization, and localization) in Rust. These components are then exposed to consumer applications via language-specific wrappers using UniFFI.

It is intended for developers building cross-platform applications who require consistent behavior, high performance, and memory safety at the infrastructure layer.

## Features

* **Write Once, Run Anywhere** — Core infrastructure is implemented in Rust and compiled for iOS, Android, WebAssembly, and Node.js.
* **Type-Safe Bindings** — Uses UniFFI to automatically generate native interfaces and TypeScript definitions from Rust code.
* **Modular Architecture** — Packages are independently versioned and published, allowing consumers to include only necessary dependencies.
* **Monorepo Tooling** — Leverages Turborepo and Yarn workspaces for fast, cached, and deterministic builds.

## Architecture

The project follows a "hub and spoke" architectural model:

1. **Rust Core (`rust-core`)**: The source of truth for business and infrastructure logic.
2. **UniFFI Interface**: Defines the contract between the Rust core and foreign languages.
3. **Language Wrappers (`ts-wrapper`)**: Idiomatic bindings generated for specific ecosystems.

## Technology Stack

| Category       | Technology |
| -------------- | ---------- |
| Language       | Rust, TypeScript |
| Build System   | Turborepo, Cargo, Yarn Workspaces |
| FFI Generator  | UniFFI (Mozilla) |
| Runtime        | Node.js (>=18.0.0) |

## Project Structure

```text
rajeev-sdk/
├── packages/
│   ├── vault/           # Secure storage (Rust core + TS wrappers)
│   ├── network/         # Networking layer (Rust core + TS wrappers)
│   ├── sync/            # Data synchronization (Rust core + TS wrappers)
│   ├── locale/          # i18n & l10n (Rust core + TS wrappers)
│   ├── ui/              # Shared UI components
│   ├── auth/            # Authentication workflows
│   ├── media/           # Media processing utilities
│   └── ...              # Other functional modules
├── examples/            # Example applications consuming the SDK
├── tools/               # Build scripts and release automation
├── Cargo.toml           # Rust workspace configuration
└── package.json         # Node workspace & Turborepo configuration
```

## Prerequisites

To build and run the SDK locally, you must have the following installed:

* Node.js `>= 18.0.0`
* Yarn `1.x` (Classic)
* Rust toolchain (via `rustup`)
* Platform-specific build tools for iOS/Android (if building mobile targets)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajeev02/rajeev-sdk.git
   cd rajeev-sdk
   ```

2. **Install Node dependencies:**
   ```bash
   yarn install
   ```

3. **Build the Rust core libraries:**
   ```bash
   npm run build:rust
   ```

4. **Build the TypeScript wrappers:**
   ```bash
   npm run build:ts
   ```

## Development Workflow

The repository includes several npm scripts to streamline local development:

| Command | Description |
| ------- | ----------- |
| `npm run build` | Builds both Rust and TS packages (via Turborepo). |
| `npm run build:vault:ios` | Builds the vault module specifically for iOS. |
| `npm run build:vault:android` | Builds the vault module specifically for Android. |
| `npm run build:vault:wasm` | Builds the vault module for WebAssembly. |
| `npm run test:rust` | Runs the Cargo test suite across all Rust workspaces. |
| `npm run test:ts` | Runs the test suite for all TypeScript packages. |
| `npm run clean` | Cleans Cargo build artifacts and Yarn `dist` folders. |

## Testing

The project maintains separate testing pipelines for Rust and TypeScript.

**Run Rust tests:**
```bash
cargo test --workspace
```
*Alternatively: `npm run test:rust`*

**Run TypeScript tests:**
```bash
yarn workspaces foreach run test
```
*Alternatively: `npm run test:ts`*

## Deployment / Publishing

Package publishing is automated via custom scripts located in the `tools/` directory.

To release a new version across all packages:

1. **Dry Run (Verify changes):**
   ```bash
   npm run release:dry
   ```

2. **Bump Versions:**
   ```bash
   npm run release:patch  # Or minor/major
   ```

3. **Publish to Registry:**
   ```bash
   npm run publish:all
   ```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Ensure all tests pass (`npm run test:rust` and `npm run test:ts`).
4. Submit a Pull Request targeting the `main` branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
