# Rajeev SDK — watchOS SwiftUI Demo

A watchOS SwiftUI app demonstrating the subset of **Rajeev SDK** libraries relevant to Apple Watch.

## Requirements

| Tool    | Version |
| ------- | ------- |
| Xcode   | 16.0+   |
| watchOS | 9.0+    |
| Swift   | 5.9+    |

## Libraries Demonstrated

| #   | Library       | Description                        |
| --- | ------------- | ---------------------------------- |
| 1   | **Vault**     | Secure on-device storage (UniFFI)  |
| 2   | **Network**   | Connectivity & priority queue      |
| 3   | **Sync**      | Offline-first CRDT sync            |
| 4   | **Locale**    | Translations & currency formatting |
| 5   | **Notify**    | Local notifications & reminders    |
| 6   | **Auth**      | Session management                 |
| 7   | **Payments**  | Quick Pay (UPI)                    |
| 8   | **UI Tokens** | Design tokens & device info        |

## Getting Started

1. Open the project in Xcode 16+.
2. Select an Apple Watch simulator or device.
3. Build & Run (**⌘R**).

> **Note:** This demo uses simulated SDK calls. In production, the native Rust core
> libraries are linked via UniFFI-generated Swift bindings.

## 📸 Screenshots

### Home Screen — Compact Library List

```
┌─────────────────────┐
│       9:41           │
├─────────────────────┤
│ Rajeev SDK          │
│                     │
│ 🔐 Vault        ▸  │
│ 🌐 Network      ▸  │
│ 🔄 Sync         ▸  │
│ 🌍 Locale       ▸  │
│ 🔔 Notify       ▸  │
│ 🔑 Auth         ▸  │
│ 💳 Payments     ▸  │
│ 🎨 UI Tokens    ▸  │
│                     │
└─────────────────────┘
```

### Individual Demo Screen

```
┌─────────────────────┐
│       9:41           │
├─────────────────────┤
│ ◂  Vault Demo       │
│                     │
│ ┌─────────────────┐ │
│ │ 🔐 Vault        │ │
│ │ Secure Storage  │ │
│ └─────────────────┘ │
│                     │
│ ┌───────┐ ┌───────┐ │
│ │ Store │ │ Read  │ │
│ └───────┘ └───────┘ │
│ ┌───────┐ ┌───────┐ │
│ │Delete │ │ List  │ │
│ └───────┘ └───────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ ✓ Stored "tok"  │ │
│ │ → "abc123"      │ │
│ │ _               │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```
