# 🌐 CampusConnect — React Web

> A responsive university dashboard built with **Vite**, **React 19**, and **TypeScript** — showcasing all 15 `@rajeev02/*` SDK libraries in a modern single-page web application.

CampusConnect Web brings the full student experience to the browser. It features a sidebar-driven layout with real-time timetable views, fee management, smart notes with OCR, event discovery, and a digital ID card — all powered by the Rajeev SDK's browser-compatible packages.

---

## 📸 Screenshots

### Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ CampusConnect                          🔔  👤 Rajeev │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  🏠 Home   │  Good morning, Rajeev! 👋                   │
│            │  BSc Computer Science · Semester 6          │
│  📅 Classes│                                             │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  📝 Notes  │  │    4     │ │  ₹1.24L  │ │    8.7   │    │
│            │  │ Classes  │ │   Fees   │ │   CGPA   │    │
│  💳 Fees   │  │  Today   │ │ Pending  │ │          │    │
│            │  └──────────┘ └──────────┘ └──────────┘    │
│  🔔 Alerts │                                             │
│            │  📅 Today's Schedule                        │
│  🎪 Events │  ┌─────────────────────────────────────┐    │
│            │  │ 09:00  Data Structures   Room 301   │    │
│  🪪 ID Card│  │ 11:00  Operating Systems Lab 2     │    │
│            │  │ 14:00  Linear Algebra    Room 108   │    │
│  🎬 Lectures│ │ 15:30  DBMS             Room 205   │    │
│            │  └─────────────────────────────────────┘    │
│  👤 Profile│                                             │
│            │  📢 Recent Notifications                    │
│            │  • Fee deadline extended to 28 Feb          │
│            │  • New lecture uploaded: OS – Unit 4         │
│            │  • Event: Hackathon 2026 registrations open │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  © 2026 CampusConnect · Powered by Rajeev SDK           │
└──────────────────────────────────────────────────────────┘
```

### Fees Page
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ CampusConnect                          🔔  👤 Rajeev │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  🏠 Home   │  💳 Fees & Payments                         │
│            │                                             │
│  📅 Classes│  ┌─────────────────────────────────────┐    │
│            │  │ ░░░░░ gradient banner ░░░░░░░░░░░░░ │    │
│  📝 Notes  │  │                                     │    │
│            │  │   Total Pending: ₹1,24,500          │    │
│  💳 Fees ← │  │   Due by: 28 February 2026          │    │
│            │  │                                     │    │
│  🔔 Alerts │  │          [ Pay All → ]              │    │
│            │  └─────────────────────────────────────┘    │
│  🎪 Events │                                             │
│            │  ┌──────────────────────────────────────┐   │
│  🪪 ID Card│  │ Item          │ Amount  │ Action     │   │
│            │  ├───────────────┼─────────┼────────────┤   │
│  🎬 Lectures│ │ Tuition Fee   │ ₹85,000 │ [Pay Now] │   │
│            │  │ Semester 6    │         │            │   │
│  👤 Profile│  ├───────────────┼─────────┼────────────┤   │
│            │  │ Hostel Fee    │ ₹32,000 │ [Pay Now]  │   │
│            │  │ Jan–Jun 2026  │         │            │   │
│            │  ├───────────────┼─────────┼────────────┤   │
│            │  │ Library Fine  │    ₹500 │ [Pay Now]  │   │
│            │  ├───────────────┼─────────┼────────────┤   │
│            │  │ Lab Fee       │  ₹7,000 │ [Pay Now]  │   │
│            │  └───────────────┴─────────┴────────────┘   │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  © 2026 CampusConnect · Powered by Rajeev SDK           │
└──────────────────────────────────────────────────────────┘
```

### Notes Page
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ CampusConnect                          🔔  👤 Rajeev │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  🏠 Home   │  📝 Notes                    [+ New Note]   │
│            │                                             │
│  📅 Classes│  ┌────────────┐ ┌────────────┐              │
│            │  │ 📄         │ │ 📄         │              │
│  📝 Notes← │  │ Data       │ │ OS Unit 3  │              │
│            │  │ Structures │ │            │              │
│  💳 Fees   │  │ Ch.5 Trees │ │ Memory     │              │
│            │  │            │ │ Management │              │
│  🔔 Alerts │  │ 12 pages   │ │ 8 pages    │              │
│            │  │ 📷 Scanned │ │ 📷 Scanned │              │
│  🎪 Events │  │            │ │            │              │
│            │  │ [🔍 OCR]   │ │ [🔍 OCR]   │              │
│  🪪 ID Card│  │ [📤 Share] │ │ [📤 Share] │              │
│            │  └────────────┘ └────────────┘              │
│  🎬 Lectures│                                            │
│            │  ┌────────────┐ ┌────────────┐              │
│  👤 Profile│  │ 📄         │ │ 📄         │              │
│            │  │ Linear     │ │ DBMS ER    │              │
│            │  │ Algebra    │ │ Diagrams   │              │
│            │  │ Eigen-     │ │            │              │
│            │  │ values     │ │ 5 pages    │              │
│            │  │ 6 pages    │ │ ✏️ Typed   │              │
│            │  │ 📷 Scanned │ │            │              │
│            │  │ [🔍 OCR]   │ │ [📤 Share] │              │
│            │  │ [📤 Share] │ │            │              │
│            │  └────────────┘ └────────────┘              │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  © 2026 CampusConnect · Powered by Rajeev SDK           │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Libraries Used

| # | Package | Version | Pages | Features Powered |
|---|---------|---------|-------|-----------------|
| 1 | `@rajeev02/app-shell` | ^0.2.1 | App | App bootstrap, layout skeleton, sidebar shell |
| 2 | `@rajeev02/auth` | ^0.2.1 | Login, ID Card, Profile | Session management, OAuth, token refresh |
| 3 | `@rajeev02/camera` | ^0.2.1 | Notes, ID Card | WebRTC camera, document scanning |
| 4 | `@rajeev02/deeplink` | ^0.2.1 | Events | Deep link routing, share URLs |
| 5 | `@rajeev02/document` | ^0.2.1 | Notes | PDF viewer, file upload, document export |
| 6 | `@rajeev02/edge-ai` | ^0.2.1 | Notes | Browser-based OCR (WASM), text extraction |
| 7 | `@rajeev02/locale` | ^0.2.1 | Dashboard, Timetable, Fees, Profile | i18n strings, ₹ currency formatting, date locale |
| 8 | `@rajeev02/media` | ^0.2.1 | Lectures | HTML5 video player, adaptive streaming |
| 9 | `@rajeev02/network` | ^0.2.1 | Dashboard, Timetable, Notifications, Lectures | Fetch client, online/offline detection, retries |
| 10 | `@rajeev02/notify` | ^0.2.1 | Notifications, Events | Web Push API, toast notifications |
| 11 | `@rajeev02/payments` | ^0.2.1 | Fees, Events | Payment gateway integration, receipt generation |
| 12 | `@rajeev02/sync` | ^0.2.1 | Dashboard, Timetable, Notes | IndexedDB sync, service worker cache, conflict merge |
| 13 | `@rajeev02/ui` | ^0.2.1 | All | CSS theme tokens, responsive components, dark mode |
| 14 | `@rajeev02/vault` | ^0.2.1 | Login, Fees, ID Card, Profile | Web Crypto API storage, encrypted localStorage |
| 15 | `@rajeev02/video-editor` | ^0.2.1 | Lectures | WASM-based trim/clip editor, export |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- A modern browser (Chrome, Firefox, Safari, Edge)

### Install & Run

```bash
# Navigate to the project
cd examples/campus-connect-web

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🗂️ Project Structure

```
campus-connect-web/
├── index.html                # HTML entry point
├── package.json              # Dependencies — all 15 @rajeev02/* packages
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build config
└── src/
    ├── main.tsx              # React root + SDK initialization
    ├── App.tsx               # Router + sidebar layout
    ├── App.css               # Global styles & theme variables
    ├── services/
    │   └── sdk.ts            # SDK initialization & service registry
    └── pages/
        ├── Dashboard.tsx     # Home — stats, schedule, alerts
        ├── Timetable.tsx     # Weekly class schedule
        ├── Fees.tsx          # Fee breakdown & payments
        ├── Notes.tsx         # Scanned notes with OCR
        ├── Notifications.tsx # Push & in-app notifications
        ├── Events.tsx        # Campus events & registration
        ├── IDCard.tsx        # Digital student ID card
        ├── Lectures.tsx      # Video lecture player
        └── Profile.tsx       # Account settings
```

---

## 📄 License

MIT — see [LICENSE](../../LICENSE) for details.
