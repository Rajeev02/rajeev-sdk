# @rajeev02/notify

[![npm version](https://img.shields.io/npm/v/@rajeev02/notify.svg)](https://www.npmjs.com/package/@rajeev02/notify)
[![license](https://img.shields.io/npm/l/@rajeev02/notify.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Unified notification layer** with cross-platform scheduling, priority-based delivery, quiet hours, grouped channels, and an in-app notification inbox.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **One API for all platforms** — Schedule local/push notifications with a single call. Platform-specific config (APNs, FCM, Web Push) is handled via overrides.
- **Smart scheduling** — Quiet hours, repeat intervals (daily/weekly/monthly), timezone-aware delivery
- **Priority system** — Critical, high, normal, low — with platform-appropriate behavior
- **In-app inbox** — Built-in notification inbox with read/unread, categories, actions, and persistence
- **Channel management** — Grouped notification channels for Android (auto-created), categories for iOS
- **Pure TypeScript** — No native dependencies. Drop in and use immediately.

## ⚠️ Important: Local State Management Only

This library manages **notification scheduling logic and an in-app inbox** entirely in TypeScript. It does **NOT**:

- Send push notifications (FCM, APNs, Web Push)
- Register push tokens with any service
- Display OS-level notification banners or alerts
- Access native notification APIs

The `PlatformOverrides` (iOS sound/badge, Android channel/icon) are **configuration data structures** that you pass to your actual notification delivery layer.

**You need a notification delivery library to actually show notifications:**

| Use case | Recommended library |
| -------- | ------------------- |
| Expo apps | [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) |
| Bare React Native | [`@notifee/react-native`](https://notifee.app/) |
| Push notifications | [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) |
| Web | [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) |

**Think of this library as the scheduling brain + inbox state manager** — you pair it with a delivery layer that actually displays notifications on device.

## Platform Support

| Platform | Engine     | Status |
| -------- | ---------- | ------ |
| iOS      | TypeScript | ✅     |
| Android  | TypeScript | ✅     |
| Web      | TypeScript | ✅     |
| watchOS  | TypeScript | ✅     |
| Wear OS  | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/notify
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Schedule Notifications

```typescript
import { NotificationScheduler } from "@rajeev02/notify";

const scheduler = new NotificationScheduler();

// Schedule a daily reminder
scheduler.schedule({
  id: "meditation-001",
  title: "Time to meditate 🧘",
  body: "Your daily 10-minute session awaits",
  priority: "normal",
  schedule: { at: "2026-02-08T07:00:00", repeat: "day" },
});

// Schedule with platform-specific overrides
scheduler.schedule({
  id: "payment-received",
  title: "Payment received",
  body: "₹5,000 from Rajeev",
  priority: "high",
  platform: {
    ios: {
      sound: "payment.wav",
      badge: 1,
      categoryId: "payments",
      threadId: "transactions",
    },
    android: {
      channelId: "payments",
      smallIcon: "ic_payment",
      color: "#10B981",
      autoCancel: true,
    },
  },
});

// Cancel or manage
scheduler.cancel("meditation-001");
const pending = scheduler.getPending();
```

### In-App Inbox

```typescript
import { NotificationInbox } from "@rajeev02/notify";

const inbox = new NotificationInbox();

// Add notifications to inbox
inbox.add({
  id: "msg-001",
  title: "Order shipped!",
  body: "Your order #1234 is on its way",
  category: "orders",
  actions: [
    { id: "track", label: "Track Order" },
    { id: "details", label: "View Details" },
  ],
});

// Query inbox
const unread = inbox.getUnread();
const orders = inbox.getByCategory("orders");
const count = inbox.getUnreadCount(); // → 1

// Mark as read
inbox.markRead("msg-001");
inbox.markAllRead();
```

## API Reference

### `NotificationScheduler`

| Method                     | Returns                   | Description                               |
| -------------------------- | ------------------------- | ----------------------------------------- |
| `schedule(notification)`   | `string`                  | Schedule a notification, returns ID       |
| `cancel(id)`               | `void`                    | Cancel a scheduled notification           |
| `cancelAll()`              | `void`                    | Cancel all scheduled notifications        |
| `getPending()`             | `ScheduledNotification[]` | List all pending notifications            |
| `reschedule(id, schedule)` | `void`                    | Update schedule for existing notification |

### `NotificationInbox`

| Method               | Returns               | Description           |
| -------------------- | --------------------- | --------------------- |
| `add(notification)`  | `void`                | Add to inbox          |
| `remove(id)`         | `void`                | Remove from inbox     |
| `markRead(id)`       | `void`                | Mark as read          |
| `markAllRead()`      | `void`                | Mark all as read      |
| `getAll()`           | `InboxNotification[]` | Get all inbox items   |
| `getUnread()`        | `InboxNotification[]` | Get unread items      |
| `getByCategory(cat)` | `InboxNotification[]` | Filter by category    |
| `getUnreadCount()`   | `number`              | Count of unread items |
| `clear()`            | `void`                | Clear entire inbox    |

## Full Documentation

📖 [Complete API docs with platform-specific examples](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/NOTIFY.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
