#!/bin/bash
set -e

PACKAGE=${1:-vault}
RUST_DIR="packages/$PACKAGE/rust-core"
TARGET_DIR="$RUST_DIR/target"

echo "Building $PACKAGE for iOS..."

echo "  Building for iOS device (aarch64-apple-ios)..."
cargo build --release \
    --target aarch64-apple-ios \
    --manifest-path "$RUST_DIR/Cargo.toml"

echo "  Building for iOS simulator (aarch64-apple-ios-sim)..."
cargo build --release \
    --target aarch64-apple-ios-sim \
    --manifest-path "$RUST_DIR/Cargo.toml"

echo "  Building for iOS simulator (x86_64-apple-ios)..."
cargo build --release \
    --target x86_64-apple-ios \
    --manifest-path "$RUST_DIR/Cargo.toml"

echo "  Creating universal simulator library..."
mkdir -p "$TARGET_DIR/universal/release"

lipo -create \
    "$TARGET_DIR/aarch64-apple-ios-sim/release/librajeev_vault_core.a" \
    "$TARGET_DIR/x86_64-apple-ios/release/librajeev_vault_core.a" \
    -output "$TARGET_DIR/universal/release/librajeev_vault_core_sim.a"

cp "$TARGET_DIR/aarch64-apple-ios/release/librajeev_vault_core.a" \
   "$TARGET_DIR/universal/release/librajeev_vault_core.a"

echo "  Generating Swift bindings..."
cargo run --manifest-path "$RUST_DIR/Cargo.toml" \
    --bin uniffi-bindgen \
    generate "$RUST_DIR/src/vault.udl" \
    --language swift \
    --out-dir "$TARGET_DIR/uniffi"

echo "iOS build complete!"
echo "  Device lib:    $TARGET_DIR/universal/release/librajeev_vault_core.a"
echo "  Simulator lib: $TARGET_DIR/universal/release/librajeev_vault_core_sim.a"
echo "  Swift bindings: $TARGET_DIR/uniffi/"
