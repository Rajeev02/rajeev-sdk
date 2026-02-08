# 🎓 CampusConnect — Expo React Native

> A full-featured university super-app built with **Expo SDK 54**, **React Navigation 7**, and **TypeScript** — showcasing all 15 `@rajeev02/*` SDK libraries across 12 screens.

CampusConnect is the reference mobile app for the Rajeev SDK. It demonstrates how every package in the SDK comes together to power a real-world student experience: biometric login, live timetables, fee payments, smart notes with OCR, video editing, push notifications, and more — all from a single React Native codebase.

---

## 📸 Screenshots

### Login Screen
```
┌─────────────────────────────┐
│  ░░░░░ gradient ░░░░░░░░░░  │
│                             │
│         🏛️                  │
│    CAMPUS CONNECT           │
│   ─────────────────         │
│   Your University, Smarter  │
│                             │
│  ┌───────────────────────┐  │
│  │ 🇮🇳 +91  9876543210   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │      Send OTP  →      │  │
│  └───────────────────────┘  │
│                             │
│  ── or continue with ─────  │
│                             │
│  ┌───────────────────────┐  │
│  │   G  Sign in with     │  │
│  │      Google           │  │
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
│  │  4   │ │ ₹12K │         │
│  │Class │ │ Fees │         │
│  │Today │ │ Due  │         │
│  └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐         │
│  │  3   │ │ 8.7  │         │
│  │Unread│ │ CGPA │         │
│  │Alerts│ │      │         │
│  └──────┘ └──────┘         │
│                             │
│  📅 Today's Classes         │
│  ┌─────────────────────────┐│
│  │ 09:00  Data Structures  ││
│  │        Room 301 · Prof K││
│  ├─────────────────────────┤│
│  │ 11:00  Operating Systems││
│  │        Lab 2 · Prof M   ││
│  ├─────────────────────────┤│
│  │ 14:00  Linear Algebra   ││
│  │        Room 108 · Prof S││
│  └─────────────────────────┘│
│                             │
│  ⚡ Quick Actions            │
│  [Notes] [Fees] [ID Card]  │
│                             │
│ 🏠  📅  📝  💳  👤          │
└─────────────────────────────┘
```

### Timetable
```
┌─────────────────────────────┐
│  📅 Timetable               │
│                             │
│  [Mon] [Tue] [Wed] Thu  Fri │
│  ─────────────────────────  │
│                             │
│  ┌─────────────────────────┐│
│  │ 09:00 – 10:00           ││
│  │ 📘 Data Structures      ││
│  │ Room 301 · Prof. Kapoor ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 10:15 – 11:15           ││
│  │ 📗 Discrete Math        ││
│  │ Room 204 · Prof. Sharma ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 11:30 – 13:00           ││
│  │ 📙 OS Lab               ││
│  │ Lab 2 · Prof. Mehta     ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 14:00 – 15:00           ││
│  │ 📕 Linear Algebra       ││
│  │ Room 108 · Prof. Singh  ││
│  └─────────────────────────┘│
│                             │
│ 🏠  📅  📝  💳  👤          │
└─────────────────────────────┘
```

### Fees
```
┌─────────────────────────────┐
│  💳 Fees & Payments         │
│                             │
│  ┌─────────────────────────┐│
│  │ ░░░ gradient card ░░░░░ ││
│  │                         ││
│  │  Total Pending          ││
│  │  ₹1,24,500             ││
│  │                         ││
│  │  Due by: 28 Feb 2026   ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ Tuition Fee    ₹85,000  ││
│  │ Semester 6              ││
│  │              [Pay Now →]││
│  ├─────────────────────────┤│
│  │ Hostel Fee     ₹32,000  ││
│  │ Jan – Jun 2026          ││
│  │              [Pay Now →]││
│  ├─────────────────────────┤│
│  │ Library Fine      ₹500  ││
│  │ Overdue: 3 books        ││
│  │              [Pay Now →]││
│  ├─────────────────────────┤│
│  │ Lab Fee         ₹7,000  ││
│  │ Physics + CS Labs       ││
│  │              [Pay Now →]││
│  └─────────────────────────┘│
│                             │
│ 🏠  📅  📝  💳  👤          │
└─────────────────────────────┘
```

### ID Card
```
┌─────────────────────────────┐
│  🪪 Student ID Card         │
│                             │
│  ← Tap to flip →           │
│                             │
│  ┌─────────────────────────┐│
│  │ ░░░ UNIVERSITY NAME ░░░ ││
│  │                         ││
│  │      ┌─────────┐       ││
│  │      │  👤      │       ││
│  │      │  Photo   │       ││
│  │      └─────────┘       ││
│  │                         ││
│  │  Rajeev Joshi           ││
│  │  BSc Computer Science   ││
│  │  Roll No: CS2023-042    ││
│  │  Year: 3rd              ││
│  │                         ││
│  │  ┌─────────────────┐   ││
│  │  │▐▌▐▌▐▌▐▌▐▌▐▌▐▌▐▌│   ││
│  │  │  CS2023042       │   ││
│  │  └─────────────────┘   ││
│  │                         ││
│  │  Valid: Aug 2023–May 26 ││
│  └─────────────────────────┘│
│                             │
│  [📷 Update Photo]          │
│  [📥 Save to Wallet]        │
│                             │
│ 🏠  📅  📝  💳  👤          │
└─────────────────────────────┘
```

---

## 📦 Libraries Used

| # | Package | Version | Screens | Features Powered |
|---|---------|---------|---------|-----------------|
| 1 | `@rajeev02/app-shell` | ^0.2.0 | Onboarding | App bootstrap, splash screen, navigation skeleton |
| 2 | `@rajeev02/auth` | ^0.2.0 | Login, ID Card, Profile | Phone OTP, Google sign-in, biometric unlock |
| 3 | `@rajeev02/camera` | ^0.2.0 | Notes, ID Card, Video Studio | Document scanning, photo capture |
| 4 | `@rajeev02/deeplink` | ^0.2.0 | Events | Universal links, event share links |
| 5 | `@rajeev02/document` | ^0.2.0 | Notes | PDF generation, document viewer, file picker |
| 6 | `@rajeev02/edge-ai` | ^0.2.0 | Notes | On-device OCR, handwriting recognition |
| 7 | `@rajeev02/locale` | ^0.2.0 | Dashboard, Timetable, Fees, Profile | i18n, currency formatting (₹), date/time locale |
| 8 | `@rajeev02/media` | ^0.2.0 | Lectures | Audio/video playback, streaming, media cache |
| 9 | `@rajeev02/network` | ^0.2.0 | Dashboard, Timetable, Notifications, Lectures | REST client, connectivity monitor, retry logic |
| 10 | `@rajeev02/notify` | ^0.2.0 | Login, Notifications, Events | Push notifications, in-app alerts, badges |
| 11 | `@rajeev02/payments` | ^0.2.0 | Fees, Events | UPI, card payments, receipts |
| 12 | `@rajeev02/sync` | ^0.2.0 | Dashboard, Timetable, Notes | Offline-first data, background sync, conflict resolution |
| 13 | `@rajeev02/ui` | ^0.2.0 | Onboarding, Dashboard, Profile | Theme engine, design tokens, adaptive components |
| 14 | `@rajeev02/vault` | ^0.2.0 | Login, Fees, ID Card, Profile | Secure storage, keychain, encrypted credentials |
| 15 | `@rajeev02/video-editor` | ^0.2.0 | Video Studio | Trim, merge, filters, export lecture clips |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Expo CLI** (`npx expo`)
- iOS Simulator (Xcode 16+) or Android Emulator (API 26+)
- Expo Go app on a physical device (optional)

### Install & Run

```bash
# Navigate to the project
cd examples/campus-connect

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```

Then press:
- `i` → open in iOS Simulator
- `a` → open in Android Emulator
- `w` → open in web browser
- Scan QR code with Expo Go on your phone

---

## 🗂️ Project Structure

```
campus-connect/
├── App.tsx                          # Entry point — SDK init + NavigationContainer
├── app.json                         # Expo config (name, slug, splash, icons)
├── package.json                     # Dependencies — all 15 @rajeev02/* packages
├── tsconfig.json                    # TypeScript configuration
└── src/
    ├── theme/
    │   └── index.ts                 # Design tokens, colors, typography
    ├── services/
    │   └── sdk.ts                   # SDK initialization & service registry
    ├── navigation/
    │   └── AppNavigator.tsx         # Stack + Bottom Tab navigators
    └── screens/
        ├── OnboardingScreen.tsx     # Welcome carousel          → app-shell, ui
        ├── LoginScreen.tsx          # Phone OTP + Google auth   → auth, vault, notify
        ├── DashboardScreen.tsx      # Home with stats & classes → network, sync, ui, locale
        ├── TimetableScreen.tsx      # Weekly schedule           → sync, network, locale
        ├── NotesScreen.tsx          # Scan & OCR notes          → camera, document, edge-ai, sync
        ├── FeesScreen.tsx           # Payments & receipts       → payments, vault, locale
        ├── NotificationsScreen.tsx  # Push & in-app alerts      → notify, network
        ├── EventsScreen.tsx         # Campus events             → deeplink, notify, payments
        ├── IDCardScreen.tsx         # Digital student ID        → vault, auth, camera
        ├── LecturesScreen.tsx       # Video lectures            → media, network
        ├── VideoStudioScreen.tsx    # Edit lecture clips         → video-editor, camera
        └── ProfileScreen.tsx        # Settings & account        → auth, vault, locale, ui
```

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
