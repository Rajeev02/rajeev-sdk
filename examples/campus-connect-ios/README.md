# 🍎 CampusConnect — iOS (SwiftUI)

> A native iOS university app built with **SwiftUI**, **iOS 16+**, and **Swift 5.9+** — showcasing all 15 `@rajeev02/*` SDK libraries in a single-file SwiftUI application.

CampusConnect iOS is the native Apple reference app for the Rajeev SDK. All screens — Login, Dashboard, Timetable, Notes, Fees, Notifications, Events, ID Card, Lectures, and Profile — are implemented in a single `CampusConnectApp.swift` (796 lines), demonstrating the power of SwiftUI's declarative UI combined with the SDK's capabilities.

---

## 📸 Screenshots

### Login
```
┌─────────────────────────────┐
│                             │
│  ░░░░░░░ gradient ░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │
│                             │
│         🏛️                  │
│    CAMPUS CONNECT           │
│   ─────────────────         │
│   Your University, Smarter  │
│                             │
│  ┌───────────────────────┐  │
│  │ 🇮🇳 +91  Mobile Number │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │    Send OTP  →        │  │
│  └───────────────────────┘  │
│                             │
│   ─── or continue with ──   │
│                             │
│  ┌───────────────────────┐  │
│  │  G  Sign in with      │  │
│  │     Google            │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  🔐 Sign in with      │  │
│  │     Apple             │  │
│  └───────────────────────┘  │
│                             │
│  By continuing you agree    │
│  to our Terms & Privacy     │
│                             │
└─────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────┐
│  Good morning, Rajeev! 👋   │
│  BSc Computer Science       │
│                             │
│  ┌──────┐ ┌──────┐         │
│  │  4   │ │ ₹1.2L│         │
│  │Class │ │ Fees │         │
│  │Today │ │ Due  │         │
│  └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐         │
│  │  3   │ │ 8.7  │         │
│  │Unread│ │ CGPA │         │
│  │Alerts│ │      │         │
│  └──────┘ └──────┘         │
│                             │
│  📅 Today's Schedule        │
│  ┌─────────────────────────┐│
│  │ ● 09:00 Data Structures ││
│  │   Room 301 · Prof K     ││
│  │                         ││
│  │ ● 11:00 OS Lab          ││
│  │   Lab 2 · Prof M        ││
│  │                         ││
│  │ ● 14:00 Linear Algebra  ││
│  │   Room 108 · Prof S     ││
│  │                         ││
│  │ ● 15:30 DBMS            ││
│  │   Room 205 · Prof R     ││
│  └─────────────────────────┘│
│                             │
│  ⚡ Quick Actions            │
│  [Notes] [Fees] [ID Card]  │
│                             │
│ 🏠   📅   📝   💳   •••    │
│ Home Class Notes Fees More  │
└─────────────────────────────┘
```

### Timetable
```
┌─────────────────────────────┐
│  📅 Timetable               │
│                             │
│      ◀  Wednesday  ▶        │
│                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │ 09:00 ──────────────    │
│  │ │                       │
│  │ │  📘 Data Structures   │
│  │ │  Room 301             │
│  │ │  Prof. Kapoor         │
│  │ │                       │
│  │ 10:00 ──────────────    │
│  │                         │
│  │ 10:15 ──────────────    │
│  │ │                       │
│  │ │  📗 Discrete Math     │
│  │ │  Room 204             │
│  │ │  Prof. Sharma         │
│  │ │                       │
│  │ 11:15 ──────────────    │
│  │                         │
│  │ 11:30 ──────────────    │
│  │ │                       │
│  │ │  📙 OS Lab            │
│  │ │  Lab 2                │
│  │ │  Prof. Mehta          │
│  │ │                       │
│  │ 13:00 ──────────────    │
│  │                         │
│  │ 14:00 ──────────────    │
│  │ │                       │
│  │ │  📕 Linear Algebra    │
│  │ │  Room 108             │
│  │ │  Prof. Singh          │
│  │ │                       │
│  │ 15:00 ──────────────    │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                             │
│ 🏠   📅   📝   💳   •••    │
│ Home Class Notes Fees More  │
└─────────────────────────────┘
```

### ID Card
```
┌─────────────────────────────┐
│  🪪 Student ID              │
│                             │
│  ← Tap card to flip →      │
│                             │
│  ┌─────────────────────────┐│
│  │                         ││
│  │  ═══════════════════    ││
│  │   UNIVERSITY NAME       ││
│  │  ═══════════════════    ││
│  │                         ││
│  │      ┌─────────┐       ││
│  │      │         │       ││
│  │      │  👤     │       ││
│  │      │  Photo  │       ││
│  │      │         │       ││
│  │      └─────────┘       ││
│  │                         ││
│  │  Name: Rajeev Joshi     ││
│  │  Dept: Computer Science ││
│  │  Roll: CS2023-042       ││
│  │  Year: 3rd Year         ││
│  │                         ││
│  │  ┌─────────────────┐   ││
│  │  │▐▌▐▌▐▌▐▌▐▌▐▌▐▌▐▌│   ││
│  │  │   CS2023042      │   ││
│  │  └─────────────────┘   ││
│  │                         ││
│  │  Valid: Aug 2023–May 26 ││
│  └─────────────────────────┘│
│                             │
│  [📷 Update Photo]          │
│  [📥 Add to Apple Wallet]   │
│                             │
│ 🏠   📅   📝   💳   •••    │
│ Home Class Notes Fees More  │
└─────────────────────────────┘
```

---

## 📦 Libraries Used

| # | Package | Simulated | Screens | Features Powered |
|---|---------|-----------|---------|-----------------|
| 1 | `@rajeev02/app-shell` | ✅ | App | App lifecycle, splash, tab navigation skeleton |
| 2 | `@rajeev02/auth` | ✅ | Login, ID Card, Profile | Phone OTP, Google/Apple sign-in, biometric Face ID |
| 3 | `@rajeev02/camera` | ✅ | Notes, ID Card | AVFoundation camera, document scanning |
| 4 | `@rajeev02/deeplink` | ✅ | Events | Universal links, event share sheets |
| 5 | `@rajeev02/document` | ✅ | Notes | PDFKit viewer, document picker, file export |
| 6 | `@rajeev02/edge-ai` | ✅ | Notes | Vision framework OCR, on-device text recognition |
| 7 | `@rajeev02/locale` | ✅ | Dashboard, Timetable, Fees, Profile | ₹ currency, Hindi/English, Foundation date formatting |
| 8 | `@rajeev02/media` | ✅ | Lectures | AVPlayer streaming, background audio, AirPlay |
| 9 | `@rajeev02/network` | ✅ | Dashboard, Timetable, Notifications, Lectures | URLSession client, NWPathMonitor, retry logic |
| 10 | `@rajeev02/notify` | ✅ | Login, Notifications, Events | APNs push, UNUserNotificationCenter, badges |
| 11 | `@rajeev02/payments` | ✅ | Fees, Events | Apple Pay, StoreKit, receipt validation |
| 12 | `@rajeev02/sync` | ✅ | Dashboard, Timetable, Notes | Core Data sync, CloudKit, background refresh |
| 13 | `@rajeev02/ui` | ✅ | All | SwiftUI theme engine, adaptive colors, SF Symbols |
| 14 | `@rajeev02/vault` | ✅ | Login, Fees, ID Card, Profile | Keychain Services, Secure Enclave, CryptoKit |
| 15 | `@rajeev02/video-editor` | ✅ | Lectures | AVFoundation trim/compose, export presets |

> **Note:** All 15 libraries are *simulated* in this native demo — the SwiftUI views and data flow mirror what the SDK would provide, using `@State`/`@StateObject` and mock data.

---

## 🚀 Getting Started

### Requirements

| Tool | Version |
|------|---------|
| Xcode | 16+ |
| Swift | 5.9+ |
| iOS Deployment Target | 16.0+ |
| XcodeGen | Latest (for project generation) |

### Setup & Run

```bash
# 1. Install XcodeGen (if not already installed)
brew install xcodegen

# 2. Navigate to the project
cd examples/campus-connect-ios

# 3. Generate Xcode project from project.yml
xcodegen generate

# 4. Open in Xcode
open CampusConnect.xcodeproj

# 5. Select an iOS 16+ simulator and press ⌘R to build & run
```

### Alternative: Direct Xcode Build

```bash
# Build from command line
xcodebuild -project CampusConnect.xcodeproj \
  -scheme CampusConnect \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  build
```

---

## 🗂️ Project Structure

```
campus-connect-ios/
├── project.yml                    # XcodeGen configuration
└── CampusConnect/
    └── CampusConnectApp.swift     # 796 lines — full app in SwiftUI
```

### Screens in `CampusConnectApp.swift`

| Screen | Lines (approx.) | Description |
|--------|-----------------|-------------|
| `LoginView` | ~100 | Gradient background, phone OTP, Google & Apple sign-in |
| `DashboardView` | ~120 | Stats cards, today's schedule, quick action buttons |
| `TimetableView` | ~90 | Day picker with timeline, color-coded class blocks |
| `NotesView` | ~80 | Note cards with scan/OCR actions |
| `FeesView` | ~90 | Gradient total card, itemized fees, pay buttons |
| `NotificationsView` | ~60 | Push notification list, read/unread states |
| `EventsView` | ~70 | Event cards with register & share actions |
| `IDCardView` | ~80 | Flip card with student info, barcode, wallet export |
| `LecturesView` | ~50 | Video lecture list with player |
| `ProfileView` | ~56 | Account settings, theme toggle, logout |

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
