# 🎓 CampusConnect — Real-World Demo App

> **A full-featured College/University app demonstrating all 15 Rajeev SDK libraries across 6 platforms.**

CampusConnect is a comprehensive demo application that showcases how all `@rajeev02/*` npm packages work together in a real-world scenario. It's built as a college student app with features like timetable sync, fee payments, digital ID cards, lecture playback, note scanning with AI, and more.

---

## 📱 Platform Versions

| Platform | Directory | Tech Stack | Status |
|----------|-----------|------------|--------|
| **Expo (React Native)** | `campus-connect/` | Expo SDK 54 + React Navigation 7 | ✅ Full App (12 screens) |
| **React Web** | `campus-connect-web/` | Vite + React 19 | ✅ Dashboard (9 pages) |
| **iOS Native** | `campus-connect-ios/` | SwiftUI | ✅ Full App (6 views) |
| **Android Native** | `campus-connect-android/` | Jetpack Compose + Material 3 | ✅ Full App (6 screens) |
| **watchOS** | `campus-connect-watchos/` | SwiftUI (Watch) | ✅ Companion (4 views) |
| **Vanilla Web** | `campus-connect-vanilla/` | HTML + CSS + JS (zero deps) | ✅ Single File (8 tabs) |

---

## 📦 All 15 SDK Libraries Used

Every library is integrated into real, meaningful features:

| # | Library | CampusConnect Feature | Screens |
|---|---------|----------------------|---------|
| 1 | `@rajeev02/app-shell` | Onboarding flow, feature flags, A/B testing, analytics | Onboarding, Profile |
| 2 | `@rajeev02/auth` | Phone OTP login, Google sign-in, biometric unlock | Login, Profile, ID Card |
| 3 | `@rajeev02/vault` | Encrypted student ID, secure token storage, hall tickets | ID Card, Login, Fees |
| 4 | `@rajeev02/network` | Offline mode, connectivity indicator, smart caching | Dashboard, all screens |
| 5 | `@rajeev02/sync` | Notes sync across devices, timetable CRDT sync | Timetable, Notes, Dashboard |
| 6 | `@rajeev02/locale` | Hindi/English toggle, ₹ INR formatting, date localization | Fees, Profile, all screens |
| 7 | `@rajeev02/notify` | Class reminders, fee alerts, event notifications, inbox | Notifications, Dashboard |
| 8 | `@rajeev02/ui` | College theme, adaptive layout, dark mode, design tokens | All screens |
| 9 | `@rajeev02/payments` | UPI fee payment, payment history, event tickets | Fees, Events |
| 10 | `@rajeev02/camera` | Student ID photo, QR attendance scanner | ID Card, Notes |
| 11 | `@rajeev02/document` | Scan notes, OCR text extraction, PDF generation | Notes |
| 12 | `@rajeev02/edge-ai` | On-device OCR, AI quiz generation from notes | Notes |
| 13 | `@rajeev02/media` | Lecture recordings playback, campus radio | Lectures |
| 14 | `@rajeev02/video-editor` | Record presentations, trim/edit lecture clips | Video Studio |
| 15 | `@rajeev02/deeplink` | Share event links, campus navigation links | Events |

---

## 🖥️ Quick Start

### Expo (React Native) — Recommended

```bash
cd examples/campus-connect
npm install
npx expo start
# Press 'w' for web, 'i' for iOS, 'a' for Android
```

### React Web (Vite)

```bash
cd examples/campus-connect-web
npm install
npm run dev
# Open http://localhost:5173
```

### Vanilla Web

```bash
cd examples/campus-connect-vanilla
open index.html
# Or use any HTTP server: npx serve .
```

### iOS Native (SwiftUI)

1. Create new Xcode project → App → SwiftUI
2. Copy `campus-connect-ios/CampusConnectApp.swift` as `ContentView.swift`
3. Build & Run on simulator

### Android Native (Jetpack Compose)

1. Create new Android Studio project → Empty Compose Activity
2. Copy `campus-connect-android/MainActivity.kt` into your project
3. Add Material 3 dependencies, Build & Run

### watchOS

1. Add watchOS target to an existing Xcode project
2. Copy `campus-connect-watchos/CampusConnectWatch.swift`
3. Build & Run on Watch simulator

---

## 🏗️ Architecture

### Expo App Structure

```
campus-connect/
├── App.tsx                          # Root: Onboarding → Login → Main
├── src/
│   ├── theme/index.ts               # College-branded design tokens
│   ├── services/sdk.ts              # All 15 SDK integrations + mock data
│   ├── navigation/AppNavigator.tsx   # Bottom tabs + stack navigators
│   └── screens/
│       ├── OnboardingScreen.tsx      # 3-step intro (app-shell)
│       ├── LoginScreen.tsx           # OTP + Google + Biometric (auth, vault)
│       ├── DashboardScreen.tsx       # Today's schedule, quick actions
│       ├── TimetableScreen.tsx       # Day-based timeline (sync)
│       ├── NotesScreen.tsx           # Scan → OCR → AI → Sync pipeline
│       ├── FeesScreen.tsx            # UPI payments, INR formatting
│       ├── NotificationsScreen.tsx   # Filterable inbox (notify)
│       ├── EventsScreen.tsx          # Events with deep link sharing
│       ├── IDCardScreen.tsx          # Flip-card with vault encryption
│       ├── LecturesScreen.tsx        # Audio player with progress (media)
│       ├── VideoStudioScreen.tsx     # Video projects (video-editor)
│       └── ProfileScreen.tsx         # Settings, SDK versions, logout
```

### Library Integration Flow

```
Student opens app
  ↓
[@rajeev02/app-shell]  →  Onboarding & Feature Flags
[@rajeev02/auth]       →  Phone OTP / Google / Biometric Login
[@rajeev02/vault]      →  Store tokens securely
  ↓
Dashboard loads
  ↓
[@rajeev02/network]    →  Check connectivity, cache data
[@rajeev02/sync]       →  Sync timetable via CRDT
[@rajeev02/locale]     →  Format dates, currency (₹)
[@rajeev02/ui]         →  Apply theme, adaptive layout
[@rajeev02/notify]     →  Show unread alerts badge
  ↓
Student uses features
  ↓
[@rajeev02/camera]     →  Scan notes / QR attendance
[@rajeev02/document]   →  OCR text extraction, PDF export
[@rajeev02/edge-ai]    →  AI quiz from scanned notes
[@rajeev02/media]      →  Play lecture recordings
[@rajeev02/video-editor] → Record & edit presentations
[@rajeev02/payments]   →  Pay fees via UPI
[@rajeev02/deeplink]   →  Share event invitations
```

---

## 📸 Screens Preview

| Screen | Description | SDK Libraries |
|--------|-------------|---------------|
| 🎬 Onboarding | 3-step intro slides | app-shell, ui |
| 🔐 Login | Phone OTP + Google + Biometric | auth, vault, notify |
| 🏠 Dashboard | Today's schedule, quick actions, alerts | network, sync, ui, locale |
| 📅 Timetable | Mon-Fri day tabs, class timeline | sync, network, locale |
| 📝 Notes | Scan → OCR → AI categorize → Sync | camera, document, edge-ai, sync |
| 💳 Fees | UPI payment, ₹ formatting, history | payments, vault, locale |
| 🔔 Notifications | Filterable inbox with categories | notify, network |
| 🎉 Events | Event cards, registration, sharing | deeplink, notify, payments |
| 🪪 ID Card | Flip-card, barcode, encrypted data | vault, auth, camera |
| 🎧 Lectures | Audio player with progress tracking | media, network |
| 🎬 Video Studio | Record, edit, export presentations | video-editor, camera |
| 👤 Profile | Language toggle, theme, SDK versions | auth, vault, locale, ui |

---

## 🎨 Design System

- **Primary**: `#1a237e` (Deep Indigo — college branding)
- **Secondary**: `#ff6f00` (Amber — accents)
- **Success**: `#2e7d32` | **Error**: `#c62828` | **Warning**: `#f57f17`
- **Typography**: System font with 8 size scales
- **Spacing**: 4px grid system (xs=4, sm=8, md=16, lg=24, xl=32)
- **Border Radius**: sm=8, md=12, lg=16, xl=20

---

## 📝 Notes

- All SDK integrations use **simulated/mock** implementations to demonstrate API patterns
- Mock data includes realistic Indian college context (INR currency, Hindi language, UPI payments)
- Each screen clearly shows which `@rajeev02/*` library powers each feature via SDK tags
- The app is designed to be a **portfolio piece** showcasing the SDK's capabilities

---

## 📄 License

MIT © Rajeev Joshi
