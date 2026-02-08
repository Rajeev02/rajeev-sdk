# 🤖 CampusConnect — Android (Jetpack Compose)

> A native Android university app built with **Jetpack Compose**, **Material 3**, and **Kotlin 2.1** — showcasing all 15 `@rajeev02/*` SDK libraries in a single-file Compose application.

CampusConnect Android is the native Android reference app for the Rajeev SDK. All 6 screens — Login, Dashboard, Timetable, Fees, Campus, and Profile — live in a single `MainActivity.kt` (816 lines), demonstrating how compact and expressive Jetpack Compose paired with the SDK can be.

---

## 📸 Screenshots

### Login
```
┌─────────────────────────────┐
│  ░░░░░░░ gradient ░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │
│                             │
│         🏛️                  │
│    CAMPUS CONNECT           │
│   ─────────────────         │
│   Your University, Smarter  │
│                             │
│  ┌───────────────────────┐  │
│  │ 🇮🇳 +91 │ Mobile No.   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │    ▶  Send OTP        │  │
│  └───────────────────────┘  │
│                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│    OTP: [_] [_] [_] [_]    │
│  │    Verify & Login     │  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                             │
│  ────── or ──────           │
│                             │
│  ┌───────────────────────┐  │
│  │  G  Continue with     │  │
│  │     Google            │  │
│  └───────────────────────┘  │
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
│  📅 Today's Classes         │
│  ┌─────────────────────────┐│
│  │ 09:00  Data Structures  ││
│  │        Room 301         ││
│  ├─────────────────────────┤│
│  │ 11:00  Operating Systems││
│  │        Lab 2            ││
│  ├─────────────────────────┤│
│  │ 14:00  Linear Algebra   ││
│  │        Room 108         ││
│  ├─────────────────────────┤│
│  │ 15:30  DBMS             ││
│  │        Room 205         ││
│  └─────────────────────────┘│
│                             │
│ 🏠   📅   💳   🏫   👤     │
│ Home Class Fees Camp Prof   │
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
│  │ 🟦 09:00 – 10:00       ││
│  │ Data Structures         ││
│  │ Room 301 · Prof. Kapoor ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🟩 10:15 – 11:15       ││
│  │ Discrete Mathematics    ││
│  │ Room 204 · Prof. Sharma ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🟧 11:30 – 13:00       ││
│  │ OS Lab                  ││
│  │ Lab 2 · Prof. Mehta     ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🟥 14:00 – 15:00       ││
│  │ Linear Algebra          ││
│  │ Room 108 · Prof. Singh  ││
│  └─────────────────────────┘│
│                             │
│ 🏠   📅   💳   🏫   👤     │
│ Home Class Fees Camp Prof   │
└─────────────────────────────┘
```

### Fees
```
┌─────────────────────────────┐
│  💳 Fees                    │
│                             │
│  ┌─────────────────────────┐│
│  │ ░░░ gradient card ░░░░░ ││
│  │                         ││
│  │  Total Pending          ││
│  │  ₹1,24,500             ││
│  │                         ││
│  │  Due: 28 Feb 2026      ││
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
│ 🏠   📅   💳   🏫   👤     │
│ Home Class Fees Camp Prof   │
└─────────────────────────────┘
```

### Campus — ID Card & Events
```
┌─────────────────────────────┐
│  🏫 Campus                  │
│                             │
│  🪪 Digital ID Card         │
│  ┌─────────────────────────┐│
│  │  UNIVERSITY NAME        ││
│  │                         ││
│  │      ┌────────┐        ││
│  │      │  👤    │        ││
│  │      │  Photo │        ││
│  │      └────────┘        ││
│  │                         ││
│  │  Rajeev Joshi           ││
│  │  BSc CS · Roll CS-042   ││
│  │                         ││
│  │  ┌────────────────┐    ││
│  │  │▐▌▐▌▐▌▐▌▐▌▐▌▐▌▐▌│    ││
│  │  │  CS2023042      │    ││
│  │  └────────────────┘    ││
│  └─────────────────────────┘│
│                             │
│  🎪 Upcoming Events         │
│  ┌─────────────────────────┐│
│  │ 🎭 Hackathon 2026      ││
│  │ 15 Feb · Main Auditorium││
│  │ [Register]  [Share 🔗] ││
│  ├─────────────────────────┤│
│  │ 🎵 Cultural Fest       ││
│  │ 22 Feb · Open Grounds   ││
│  │ [Register]  [Share 🔗] ││
│  └─────────────────────────┘│
│                             │
│ 🏠   📅   💳   🏫   👤     │
│ Home Class Fees Camp Prof   │
└─────────────────────────────┘
```

---

## 📦 Libraries Used

| # | Package | Simulated | Screens | Features Powered |
|---|---------|-----------|---------|-----------------|
| 1 | `@rajeev02/app-shell` | ✅ | App | Splash screen, Compose navigation scaffold |
| 2 | `@rajeev02/auth` | ✅ | Login, Profile | Phone OTP flow, Google sign-in, session state |
| 3 | `@rajeev02/camera` | ✅ | Campus (ID) | Photo capture for student ID |
| 4 | `@rajeev02/deeplink` | ✅ | Campus (Events) | Event share links, intent filters |
| 5 | `@rajeev02/document` | ✅ | Dashboard | Document viewer, PDF generation |
| 6 | `@rajeev02/edge-ai` | ✅ | Dashboard | On-device OCR, smart suggestions |
| 7 | `@rajeev02/locale` | ✅ | Dashboard, Timetable, Fees, Profile | ₹ currency, Hindi/English, date formatting |
| 8 | `@rajeev02/media` | ✅ | Dashboard | ExoPlayer integration, media cache |
| 9 | `@rajeev02/network` | ✅ | Dashboard, Timetable, Fees | OkHttp client, connectivity monitor |
| 10 | `@rajeev02/notify` | ✅ | Login, Campus (Events) | FCM push, in-app snackbars |
| 11 | `@rajeev02/payments` | ✅ | Fees, Campus (Events) | UPI intent, payment sheets |
| 12 | `@rajeev02/sync` | ✅ | Dashboard, Timetable | Room DB sync, WorkManager background jobs |
| 13 | `@rajeev02/ui` | ✅ | All | Material 3 theme, dynamic colors, design tokens |
| 14 | `@rajeev02/vault` | ✅ | Login, Fees, Campus (ID), Profile | EncryptedSharedPreferences, Android Keystore |
| 15 | `@rajeev02/video-editor` | ✅ | Dashboard | MediaCodec trim/merge, export |

> **Note:** All 15 libraries are *simulated* in this native demo — the UI and data flow mirror what the SDK would provide, using Compose state management and mock data.

---

## 🚀 Getting Started

### Requirements

| Tool | Version |
|------|---------|
| Android Studio | Ladybug 2024.2+ |
| Kotlin | 2.1 |
| Gradle | 8.x (wrapper included) |
| compileSdk | 35 |
| minSdk | 26 |
| targetSdk | 35 |

### Build & Run

```bash
# Navigate to the project
cd examples/campus-connect-android

# Build the debug APK
./gradlew assembleDebug

# Or open in Android Studio:
# File → Open → select campus-connect-android/
# Wait for Gradle sync → Run ▶️ on emulator or device
```

### Environment Setup

Make sure `JAVA_HOME` and `ANDROID_HOME` are set:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

---

## 🗂️ Project Structure

```
campus-connect-android/
├── build.gradle.kts              # Root Gradle config
├── settings.gradle.kts           # Project settings
├── gradle.properties             # Gradle JVM & AndroidX flags
├── gradlew / gradlew.bat         # Gradle wrapper scripts
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
└── app/
    ├── build.gradle.kts          # App module — Compose, Material 3, Kotlin 2.1
    └── src/main/
        ├── AndroidManifest.xml   # Permissions, activity declaration
        └── java/com/rajeevsdk/campusconnect/
            └── MainActivity.kt  # 816 lines — all 6 screens in Compose
```

### Screens in `MainActivity.kt`

| Screen | Lines (approx.) | Description |
|--------|-----------------|-------------|
| `LoginScreen` | ~130 | Gradient background, phone OTP, Google sign-in |
| `DashboardScreen` | ~160 | Stats grid, today's classes, quick actions |
| `TimetableScreen` | ~120 | Day tabs, color-coded class cards |
| `FeesScreen` | ~130 | Gradient total card, itemized fees, pay buttons |
| `CampusScreen` | ~150 | Digital ID card with barcode, event cards |
| `ProfileScreen` | ~100 | Settings, account info, logout |

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
