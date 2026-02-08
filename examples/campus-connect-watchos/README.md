# ⌚ CampusConnect — watchOS (SwiftUI)

> A native watchOS companion app built with **SwiftUI**, **watchOS 9+**, and **Swift 5.9+** — showcasing 8 of 15 `@rajeev02/*` SDK libraries on the Apple Watch.

CampusConnect Watch is the wrist-sized companion to the full CampusConnect university app. Designed for quick glances and on-the-go interactions, it packs four focused views — Schedule, Notifications, ID Card, and Quick Info — into a single `CampusConnectWatch.swift` file, demonstrating how the Rajeev SDK adapts to the smallest Apple screen.

---

## 📸 Screenshots

### Schedule
```
┌───────────────────┐
│  ┌─ 44mm ──────┐  │
│  │              │  │
│  │ 📅 Schedule  │  │
│  │              │  │
│  │ ┌──────────┐ │  │
│  │ │ 09:00    │ │  │
│  │ │ 📘 Data  │ │  │
│  │ │ Structs  │ │  │
│  │ │ Rm 301   │ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 11:00    │ │  │
│  │ │ 📙 OS    │ │  │
│  │ │ Lab      │ │  │
│  │ │ Lab 2    │ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 14:00    │ │  │
│  │ │ 📕 LinAlg│ │  │
│  │ │ Rm 108   │ │  │
│  │ └──────────┘ │  │
│  │              │  │
│  │  3 classes   │  │
│  │  today       │  │
│  │              │  │
│  └──────────────┘  │
│    ●  ○  ○  ○      │
└───────────────────┘
```

### Notifications
```
┌───────────────────┐
│  ┌─ 44mm ──────┐  │
│  │              │  │
│  │ 🔔 Alerts   │  │
│  │              │  │
│  │ ┌──────────┐ │  │
│  │ │ 💳       │ │  │
│  │ │ Fee      │ │  │
│  │ │ deadline │ │  │
│  │ │ extended │ │  │
│  │ │ to 28 Feb│ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 📚       │ │  │
│  │ │ New      │ │  │
│  │ │ lecture: │ │  │
│  │ │ OS Ch.4  │ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 🎭       │ │  │
│  │ │ Hackathon│ │  │
│  │ │ 2026     │ │  │
│  │ │ open!    │ │  │
│  │ └──────────┘ │  │
│  │              │  │
│  └──────────────┘  │
│    ○  ●  ○  ○      │
└───────────────────┘
```

### ID Card
```
┌───────────────────┐
│  ┌─ 44mm ──────┐  │
│  │              │  │
│  │ 🪪 ID Card  │  │
│  │              │  │
│  │ ┌──────────┐ │  │
│  │ │ UNIV.    │ │  │
│  │ │          │ │  │
│  │ │  ┌────┐  │ │  │
│  │ │  │ 👤 │  │ │  │
│  │ │  └────┘  │ │  │
│  │ │          │ │  │
│  │ │ Rajeev   │ │  │
│  │ │ Joshi    │ │  │
│  │ │          │ │  │
│  │ │ BSc CS   │ │  │
│  │ │ CS-042   │ │  │
│  │ │          │ │  │
│  │ │▐▌▐▌▐▌▐▌▐▌│ │  │
│  │ │CS2023042 │ │  │
│  │ │          │ │  │
│  │ │ Valid    │ │  │
│  │ │ Aug '23  │ │  │
│  │ │ May '26  │ │  │
│  │ └──────────┘ │  │
│  │              │  │
│  └──────────────┘  │
│    ○  ○  ●  ○      │
└───────────────────┘
```

### Quick Info
```
┌───────────────────┐
│  ┌─ 44mm ──────┐  │
│  │              │  │
│  │ ⚡ Quick Info │  │
│  │              │  │
│  │ ┌──────────┐ │  │
│  │ │ 📅  4    │ │  │
│  │ │ Classes  │ │  │
│  │ │ Today    │ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 💳 ₹1.2L │ │  │
│  │ │ Fees     │ │  │
│  │ │ Pending  │ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 📊  8.7  │ │  │
│  │ │ CGPA     │ │  │
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │ 🔄 Synced│ │  │
│  │ │ 2 min ago│ │  │
│  │ └──────────┘ │  │
│  │              │  │
│  └──────────────┘  │
│    ○  ○  ○  ●      │
└───────────────────┘
```

---

## 📦 Libraries Used

| # | Package | Simulated | Views | Features Powered |
|---|---------|-----------|-------|-----------------|
| 1 | `@rajeev02/auth` | ✅ | All | Session token forwarding from paired iPhone |
| 2 | `@rajeev02/locale` | ✅ | Quick Info | ₹ currency formatting, date/time locale |
| 3 | `@rajeev02/network` | ✅ | Schedule, Notifications | WatchConnectivity, URLSession, connectivity status |
| 4 | `@rajeev02/notify` | ✅ | Notifications | WKNotificationScene, push alert rendering |
| 5 | `@rajeev02/payments` | ✅ | Quick Info | Fee summary display, Apple Pay readiness |
| 6 | `@rajeev02/sync` | ✅ | Schedule, Quick Info | CRDT timetable merge, background app refresh |
| 7 | `@rajeev02/ui` | ✅ | All | watchOS design tokens, accent colors, compact typography |
| 8 | `@rajeev02/vault` | ✅ | ID Card | Keychain-encrypted student ID, Secure Enclave on watch |

> **Note:** 8 of the 15 SDK libraries are relevant to Apple Watch. The remaining 7 (camera, deeplink, document, edge-ai, media, video-editor, app-shell) target richer screen platforms.

---

## 🚀 Getting Started

### Requirements

| Tool | Version |
|------|---------|
| Xcode | 16+ |
| Swift | 5.9+ |
| watchOS Deployment Target | 9.0+ |
| XcodeGen | Latest (for project generation) |

### Setup & Run

```bash
# 1. Install XcodeGen (if not already installed)
brew install xcodegen

# 2. Navigate to the project
cd examples/campus-connect-watchos

# 3. Generate Xcode project from project.yml
xcodegen generate

# 4. Open in Xcode
open CampusConnectWatch.xcodeproj

# 5. Select an Apple Watch simulator → Build & Run (⌘R)
```

### Alternative: Command-Line Build

```bash
xcodebuild -project CampusConnectWatch.xcodeproj \
  -scheme CampusConnectWatch \
  -sdk watchsimulator \
  -destination 'platform=watchOS Simulator,name=Apple Watch Series 10 (46mm)' \
  build
```

---

## 🗂️ Project Structure

```
campus-connect-watchos/
├── project.yml                      # XcodeGen configuration
└── CampusConnectWatch/
    └── CampusConnectWatch.swift     # Single-file watchOS app
```

### Views in `CampusConnectWatch.swift`

| View | Description |
|------|-------------|
| `ScheduleView` | Today's classes in compact rounded cards with time, subject, and room |
| `NotificationsView` | Scrollable alert list with emoji-coded category icons |
| `IDCardView` | Compact digital student card with barcode for tap-to-show |
| `QuickInfoView` | At-a-glance stats — classes today, fees pending, CGPA, sync status |

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
