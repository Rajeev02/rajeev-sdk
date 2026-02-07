#!/bin/bash
set -e

# Build Rust vault core for Android
# Usage: ./build-android.sh [package_name]

PACKAGE=${1:-vault}
RUST_DIR="packages/$PACKAGE/rust-core"
OUTPUT_DIR="packages/$PACKAGE/android/src/main/jniLibs"

echo "🔨 Building $PACKAGE for Android..."

# Ensure Android NDK is set
if [ -z "$ANDROID_NDK_HOME" ]; then
    # Try common locations on macOS
    if [ -d "$HOME/Library/Android/sdk/ndk" ]; then
        ANDROID_NDK_HOME=$(ls -d "$HOME/Library/Android/sdk/ndk/"*/ | head -1)
    else
        echo "❌ ANDROID_NDK_HOME not set. Install NDK via Android Studio."
        echo "   SDK Manager → SDK Tools → NDK (Side by side)"
        exit 1
    fi
fi

export ANDROID_NDK_HOME
echo "  NDK: $ANDROID_NDK_HOME"

# Build for each architecture
TARGETS=(
    "aarch64-linux-android:arm64-v8a"
    "armv7-linux-androideabi:armeabi-v7a"
    "x86_64-linux-android:x86_64"
    "i686-linux-android:x86"
)

for TARGET_PAIR in "${TARGETS[@]}"; do
    IFS=':' read -r RUST_TARGET ANDROID_ABI <<< "$TARGET_PAIR"
    echo "  📦 Building for $ANDROID_ABI ($RUST_TARGET)..."

    cargo ndk \
        --target "$RUST_TARGET" \
        --platform 24 \
        -o "$OUTPUT_DIR" \
        build --release \
        --manifest-path "$RUST_DIR/Cargo.toml"
done

echo "✅ Android build complete!"
echo "   Output: $OUTPUT_DIR/"
ls -la "$OUTPUT_DIR/"*/ 2>/dev/null || echo "   (check subdirectories)"
