# Rajeev SDK — Native Android Kotlin Demo

Native Android demo showcasing all 15 Rajeev SDK libraries using Jetpack Compose and Material 3.

Rust-core libraries (Vault, Network, Sync, Locale) are consumed via **UniFFI JNI bindings**.
TypeScript-origin libraries are presented as UI mockups demonstrating the intended API surface.

## Requirements

| Tool           | Version           |
| -------------- | ----------------- |
| Android Studio | Ladybug (2024.2)+ |
| Kotlin         | 2.1               |
| compileSdk     | 35                |
| minSdk         | 24                |
| Gradle         | 8.8+              |

## Getting Started

1. Open this folder (`android-native-demo/`) in Android Studio.
2. Let Gradle sync complete.
3. Select a device or emulator (API 24+).
4. Click **Run ▶**.

## Libraries Demonstrated

### Rust Core (UniFFI JNI)

Vault · Network · Sync · Locale

### TypeScript Modules (UI Mockups)

Auth · Payments · Camera · DeepLink · Document · Edge-AI · Media · Video-Editor · App-Shell · Notify · UI
