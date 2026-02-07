#!/bin/bash
set -e

PACKAGE=${1:-vault}
RUST_DIR="packages/$PACKAGE/rust-core"
OUTPUT_DIR="packages/$PACKAGE/ts-wrapper/wasm"

echo "Building $PACKAGE for WebAssembly..."

# Use Homebrew LLVM clang for wasm32 C compilation (Apple clang lacks wasm target)
if [ -x "/usr/local/opt/llvm/bin/clang" ]; then
    export CC_wasm32_unknown_unknown="/usr/local/opt/llvm/bin/clang"
elif [ -x "/opt/homebrew/opt/llvm/bin/clang" ]; then
    export CC_wasm32_unknown_unknown="/opt/homebrew/opt/llvm/bin/clang"
fi

mkdir -p "$OUTPUT_DIR"

wasm-pack build "$RUST_DIR" \
    --target web \
    --out-dir "../../../$OUTPUT_DIR" \
    --release

echo "WASM build complete!"
echo "  Output: $OUTPUT_DIR/"
ls -la "$OUTPUT_DIR/" 2>/dev/null
