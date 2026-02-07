#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT_DIR"

echo "========================================"
echo "  Rajeev SDK - Build All Platforms"
echo "  by Rajeev Joshi"
echo "========================================"
echo ""

# Build vault
echo "[1/3] Building Vault for Android..."
bash tools/rust-build/build-android.sh vault

echo ""
echo "[2/3] Building Vault for iOS..."
bash tools/rust-build/build-ios.sh vault

echo ""
echo "[3/3] Building Vault for Web (WASM)..."
bash tools/rust-build/build-wasm.sh vault

echo ""
echo "========================================"
echo "  All builds complete!"
echo "========================================"
