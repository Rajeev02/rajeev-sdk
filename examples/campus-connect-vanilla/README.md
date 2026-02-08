# 🌍 CampusConnect — Vanilla Web (Zero-Dependency)

> A complete university app in a **single HTML file** — no frameworks, no build tools, no npm — showcasing all 15 `@rajeev02/*` SDK libraries with pure HTML, CSS, and JavaScript.

CampusConnect Vanilla is the most minimal implementation of the CampusConnect reference app. Everything — styles, logic, and markup — lives inside one `index.html` file. Just double-click to open in any modern browser. It demonstrates that the Rajeev SDK's API surface can be consumed without any toolchain overhead.

---

## 📸 Screenshots

### Tab Navigation & Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ CampusConnect Vanilla                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Dashboard] [Timetable] [Notes] [Fees]                  │
│  [Notifications] [Events] [ID Card] [Profile]            │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  Good morning, Rajeev! 👋                                │
│  BSc Computer Science · Semester 6                       │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │    4     │ │  ₹1.24L  │ │   8.7    │ │    3     │    │
│  │ Classes  │ │   Fees   │ │  CGPA    │ │  Alerts  │    │
│  │  Today   │ │ Pending  │ │          │ │  Unread  │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                          │
│  📅 Today's Classes                                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 09:00  📘 Data Structures       Room 301         │    │
│  │ 11:00  📙 Operating Systems     Lab 2            │    │
│  │ 14:00  📕 Linear Algebra        Room 108         │    │
│  │ 15:30  📗 DBMS                  Room 205         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ⚡ Quick Actions                                        │
│  [ 📷 Scan Notes ]  [ 💳 Pay Fees ]  [ 🪪 ID Card ]     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Fees Tab
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ CampusConnect Vanilla                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Dashboard] [Timetable] [Notes] [Fees]                  │
│  [Notifications] [Events] [ID Card] [Profile]            │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  💳 Fees & Payments                                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  ░░░░░░░░░ gradient banner ░░░░░░░░░░░░░░░░░░░  │    │
│  │                                                  │    │
│  │    Total Pending: ₹1,24,500                      │    │
│  │    Due by: 28 February 2026                      │    │
│  │                                                  │    │
│  │              [ Pay All → ]                       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Tuition Fee         ₹85,000      [ Pay Now → ]  │    │
│  │ Semester 6                                       │    │
│  ├──────────────────────────────────────────────────┤    │
│  │ Hostel Fee          ₹32,000      [ Pay Now → ]  │    │
│  │ Jan – Jun 2026                                   │    │
│  ├──────────────────────────────────────────────────┤    │
│  │ Library Fine           ₹500      [ Pay Now → ]  │    │
│  │ Overdue: 3 books                                 │    │
│  ├──────────────────────────────────────────────────┤    │
│  │ Lab Fee              ₹7,000      [ Pay Now → ]  │    │
│  │ Physics + CS Labs                                │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### ID Card Tab
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ CampusConnect Vanilla                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Dashboard] [Timetable] [Notes] [Fees]                  │
│  [Notifications] [Events] [ID Card] [Profile]            │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  🪪 Student ID Card                                      │
│                                                          │
│        ┌──────────────────────────────────┐              │
│        │                                  │              │
│        │   ═══════════════════════════    │              │
│        │    STATE UNIVERSITY              │              │
│        │   ═══════════════════════════    │              │
│        │                                  │              │
│        │         ┌──────────┐             │              │
│        │         │          │             │              │
│        │         │    👤    │             │              │
│        │         │   Photo  │             │              │
│        │         │          │             │              │
│        │         └──────────┘             │              │
│        │                                  │              │
│        │   Name:  Rajeev Joshi            │              │
│        │   Dept:  Computer Science        │              │
│        │   Roll:  CS2023-042              │              │
│        │   Year:  3rd Year                │              │
│        │                                  │              │
│        │   ┌──────────────────────┐       │              │
│        │   │ ▐▌▐▌▐▌▐▌▐▌▐▌▐▌▐▌▐▌ │       │              │
│        │   │     CS2023042        │       │              │
│        │   └──────────────────────┘       │              │
│        │                                  │              │
│        │   Valid: Aug 2023 – May 2026     │              │
│        └──────────────────────────────────┘              │
│                                                          │
│   [ 📥 Download PDF ]   [ 📤 Share ]                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Libraries Used

| # | Package | Tabs | Features Powered |
|---|---------|------|-----------------|
| 1 | `@rajeev02/app-shell` | App | Tab navigation shell, app bootstrap |
| 2 | `@rajeev02/auth` | Profile | Login state, session management |
| 3 | `@rajeev02/camera` | Notes | Simulated document scan trigger |
| 4 | `@rajeev02/deeplink` | Events | Event share links, URL routing |
| 5 | `@rajeev02/document` | Notes | PDF export, document viewer |
| 6 | `@rajeev02/edge-ai` | Notes | Simulated OCR text extraction |
| 7 | `@rajeev02/locale` | Dashboard, Timetable, Fees, Profile | ₹ currency formatting, date locale |
| 8 | `@rajeev02/media` | Dashboard | Audio/video playback controls |
| 9 | `@rajeev02/network` | Dashboard, Timetable, Notifications | Fetch wrapper, online/offline indicator |
| 10 | `@rajeev02/notify` | Notifications, Events | Browser Notification API, toast alerts |
| 11 | `@rajeev02/payments` | Fees | Simulated UPI/card payment flow |
| 12 | `@rajeev02/sync` | Dashboard, Timetable, Notes | localStorage sync, conflict resolution |
| 13 | `@rajeev02/ui` | All | CSS custom properties, design tokens, dark mode toggle |
| 14 | `@rajeev02/vault` | Profile, Fees, ID Card | Encrypted localStorage, credential storage |
| 15 | `@rajeev02/video-editor` | Dashboard | Simulated video clip trim/export |

> All 15 libraries are demonstrated via simulated API calls with mock data — no actual SDK packages are bundled. The demo illustrates the API surface and UX patterns.

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- That's it. No Node.js, no npm, no build tools.

### Run

```bash
# Option 1: Open directly in your default browser
open examples/campus-connect-vanilla/index.html

# Option 2: Or just double-click index.html in Finder

# Option 3: Serve locally (optional, for strict CORS scenarios)
npx serve examples/campus-connect-vanilla
```

**No build step. No npm install. No framework. Just open the file.**

---

## 🗂️ Project Structure

```
campus-connect-vanilla/
└── index.html    # Everything — HTML, CSS, and JavaScript in one file
```

That's the entire project. One file. Zero dependencies.

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
