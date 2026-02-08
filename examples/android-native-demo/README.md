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

## 📸 Screenshots

### Home Screen — Library Grid

```
┌─────────────────────────────────────────────┐
│  Rajeev SDK Demo            ≡  Material 3   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │  🔐 Vault │ │  🌐 Net   │ │  🔄 Sync  │  │
│  │   Rust    │ │   Rust    │ │   Rust    │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │  🌍 i18n  │ │  🔑 Auth  │ │  💳 Pay   │  │
│  │   Rust    │ │   TS      │ │   TS      │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │  📷 Cam   │ │  🔗 Link  │ │  📄 Doc   │  │
│  │   TS      │ │   TS      │ │   TS      │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │  🤖 AI    │ │  🎵 Media │ │  🎬 Video │  │
│  │   TS      │ │   TS      │ │   TS      │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │  📦 Shell │ │  🔔 Notif │ │  🎨 UI    │  │
│  │   TS      │ │   TS      │ │   TS      │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### Individual Demo Screen

```
┌─────────────────────────────────────────────┐
│  ← Back        Vault Demo        ⋮ Options  │
├─────────────────────────────────────────────┤
│                                             │
│  🔐 Vault — Secure Storage (Rust/UniFFI)    │
│                                             │
│  ┌──────────────┐  ┌──────────────┐         │
│  │  Store Key   │  │  Read Key    │         │
│  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐         │
│  │  Delete Key  │  │  List Keys   │         │
│  └──────────────┘  └──────────────┘         │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ > vault.store("token", "abc123")    │    │
│  │   ✓ Stored successfully             │    │
│  │ > vault.read("token")               │    │
│  │   → "abc123"                        │    │
│  │ > vault.list()                      │    │
│  │   → ["token"]                       │    │
│  │ _                                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

## Libraries Demonstrated

| #  | Library        | Package                   | API Methods Shown                                    |
| -- | -------------- | ------------------------- | ---------------------------------------------------- |
| 1  | **Vault**      | `@anthropic/rajeev-vault`     | `store`, `read`, `delete`, `listKeys`                |
| 2  | **Network**    | `@anthropic/rajeev-network`   | `request`, `get`, `post`, `queueOffline`             |
| 3  | **Sync**       | `@anthropic/rajeev-sync`      | `merge`, `getState`, `pushLocal`, `resolveConflict`  |
| 4  | **Locale**     | `@anthropic/rajeev-locale`    | `translate`, `setLocale`, `formatCurrency`, `format` |
| 5  | **Auth**       | `@anthropic/rajeev-auth`      | `login`, `logout`, `getSession`, `refreshToken`      |
| 6  | **Payments**   | `@anthropic/rajeev-payments`  | `initUPI`, `requestPayment`, `checkStatus`           |
| 7  | **Camera**     | `@anthropic/rajeev-camera`    | `openCamera`, `capture`, `switchLens`, `setFlash`    |
| 8  | **Deep Link**  | `@anthropic/rajeev-deeplink`  | `register`, `handle`, `buildLink`, `parse`           |
| 9  | **Document**   | `@anthropic/rajeev-document`  | `scan`, `ocrExtract`, `classify`, `exportPDF`        |
| 10 | **Edge AI**    | `@anthropic/rajeev-edge-ai`   | `loadModel`, `predict`, `summarize`, `embed`         |
| 11 | **Media**      | `@anthropic/rajeev-media`     | `play`, `pause`, `seek`, `getMetadata`               |
| 12 | **Video Editor** | `@anthropic/rajeev-video-editor` | `trim`, `merge`, `addFilter`, `export`            |
| 13 | **App Shell**  | `@anthropic/rajeev-app-shell` | `registerRoute`, `navigate`, `getConfig`             |
| 14 | **Notify**     | `@anthropic/rajeev-notify`    | `schedule`, `cancel`, `getPermission`, `onTap`       |
| 15 | **UI**         | `@anthropic/rajeev-ui`        | `getTokens`, `applyTheme`, `getDeviceInfo`           |
