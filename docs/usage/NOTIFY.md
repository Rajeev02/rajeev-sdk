# @rajeev02/notify

**Unified notification layer** with cross-platform scheduling, priority-based delivery, quiet hours, grouped channels, platform-specific overrides, and an in-app notification inbox.

| Platform     | Engine                   | Notes                                 |
| ------------ | ------------------------ | ------------------------------------- |
| iOS          | TypeScript + native APIs | APNs, local notifications             |
| Android      | TypeScript + native APIs | FCM, notification channels            |
| Web          | TypeScript               | Web Notifications API                 |
| watchOS      | TypeScript               | Compact layout via platform overrides |
| Wear OS      | TypeScript               | Bundled with Android                  |
| Android Auto | TypeScript               | TTS-friendly via platform overrides   |

> **Note:** `@rajeev02/notify` is a **pure TypeScript** package — no Rust core. It provides a unified scheduling and inbox API that wraps platform-specific notification systems.

## Prerequisites

> **⚠️ This library manages notification scheduling logic and an in-app inbox entirely in TypeScript.** It does NOT send push notifications, register push tokens, or display OS-level notification banners.

Before using `@rajeev02/notify`, you need a **notification delivery layer** to actually show notifications:

| Use case           | Recommended library                                                              |
| ------------------ | -------------------------------------------------------------------------------- |
| Expo apps          | [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) |
| Bare React Native  | [`@notifee/react-native`](https://notifee.app/)                                  |
| Push notifications | [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)     |
| Web                | [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)        |

**Platform-specific setup:**

- **iOS:** Enable Push Notifications capability in Xcode, configure APNs certificate
- **Android:** Add `google-services.json` for FCM, configure notification channels

The `PlatformOverrides` (iOS sound/badge, Android channel/icon) are configuration data structures you pass to your delivery layer. This library is the scheduling brain + inbox state manager.

---

## Installation

```bash
npm install @rajeev02/notify
```

---

## Quick Start

```typescript
import { NotificationScheduler, NotificationInbox } from "@rajeev02/notify";

// Schedule a notification
const scheduler = new NotificationScheduler();
const id = scheduler.schedule({
  id: "reminder-001",
  title: "Time to meditate 🧘",
  body: "Your daily 10-minute session awaits",
  priority: "normal",
  schedule: { at: "2026-02-07T07:00:00", repeat: "day" },
});

// In-app inbox
const inbox = new NotificationInbox();
inbox.add({
  id: "msg-001",
  title: "Order shipped!",
  body: "Your order #1234 is on its way",
  category: "orders",
});
```

---

## Platform Usage

### iOS

```typescript
import { NotificationScheduler } from "@rajeev02/notify";

const scheduler = new NotificationScheduler();

scheduler.schedule({
  id: "payment-received",
  title: "Payment received",
  body: "₹5,000 from Rajeev",
  priority: "high",
  platform: {
    ios: {
      sound: "payment.wav", // Custom sound file
      badge: 1, // App badge count
      categoryId: "payments", // UNNotificationCategory
      threadId: "transactions", // Group in Notification Center
    },
  },
});
```

### Android

```typescript
scheduler.schedule({
  id: "payment-received",
  title: "Payment received",
  body: "₹5,000 from Rajeev",
  priority: "high",
  platform: {
    android: {
      channelId: "payments", // NotificationChannel
      smallIcon: "ic_payment", // Drawable resource name
      color: "#10B981", // Accent color
      ongoing: false, // Persistent notification
      autoCancel: true, // Dismiss on tap
    },
  },
});
```

### Web

```typescript
// Request permission first
if (Notification.permission === "default") {
  await Notification.requestPermission();
}

scheduler.schedule({
  id: "web-notif",
  title: "New message",
  body: "You have a new message from Priya",
  priority: "normal",
});
// Uses the Web Notifications API
```

### watchOS

```typescript
scheduler.schedule({
  id: "health-reminder",
  title: "Stand up!",
  body: "You've been sitting for an hour",
  platform: {
    watch: {
      shortTitle: "Stand", // Compact title for small screen
      shortBody: "1hr sitting", // Abbreviated body
    },
  },
});
```

### Android Auto

```typescript
scheduler.schedule({
  id: "nav-alert",
  title: "Traffic ahead",
  body: "Accident on NH48, 2 km ahead",
  priority: "high",
  platform: {
    auto: {
      ttsText:
        "Traffic alert. Accident on National Highway 48, two kilometers ahead.",
    },
  },
});
```

---

## API Reference

### `NotificationScheduler`

#### `scheduler.schedule(config): string`

Schedule a notification. Returns the notification ID.

```typescript
interface NotificationConfig {
  id: string; // Unique identifier
  title: string; // Title text
  body: string; // Body text
  subtitle?: string; // iOS subtitle
  groupId?: string; // Group/channel ID
  priority?: "low" | "normal" | "high" | "critical";
  data?: Record<string, unknown>; // Custom payload
  actions?: NotificationAction[]; // Interactive actions
  schedule?: ScheduleConfig; // Timing configuration
  platform?: PlatformOverrides; // Platform-specific settings
}
```

#### Priority Behavior

| Priority   | Sound   | Vibration  | Display  | Quiet Hours    |
| ---------- | ------- | ---------- | -------- | -------------- |
| `low`      | Silent  | None       | Standard | Held until end |
| `normal`   | Default | Default    | Standard | Held until end |
| `high`     | Default | Strong     | Heads-up | Held until end |
| `critical` | Alarm   | Persistent | Alert    | **Bypasses**   |

#### Schedule Configuration

```typescript
interface ScheduleConfig {
  at?: string; // ISO 8601 timestamp: '2026-02-07T07:00:00'
  afterMs?: number; // Delay in milliseconds: 5000
  repeat?: "minute" | "hour" | "day" | "week";
  ignoreQuietHours?: boolean;
}

// Fire immediately
scheduler.schedule({ id: "now", title: "Alert", body: "Now!" });

// Fire at specific time
scheduler.schedule({
  id: "morning",
  title: "Good morning",
  body: "Rise and shine!",
  schedule: { at: "2026-02-08T07:00:00" },
});

// Fire after delay
scheduler.schedule({
  id: "delayed",
  title: "Reminder",
  body: "Check back in 5 minutes",
  schedule: { afterMs: 300000 },
});

// Recurring
scheduler.schedule({
  id: "daily",
  title: "Daily standup",
  body: "Join the team call",
  schedule: { at: "2026-02-07T09:30:00", repeat: "day" },
});
```

#### Interactive Actions

```typescript
interface NotificationAction {
  id: string; // Action identifier
  title: string; // Button label
  opensApp?: boolean; // Open app on tap (default: false)
  destructive?: boolean; // Red color on iOS (default: false)
}

scheduler.schedule({
  id: "friend-request",
  title: "Friend request",
  body: "Priya wants to connect",
  actions: [
    { id: "accept", title: "Accept", opensApp: true },
    { id: "decline", title: "Decline", destructive: true },
  ],
});
```

#### Platform Overrides

```typescript
interface PlatformOverrides {
  android?: {
    channelId?: string; // Notification channel
    smallIcon?: string; // Drawable resource name
    color?: string; // Hex accent color
    ongoing?: boolean; // Persistent (can't swipe away)
    autoCancel?: boolean; // Dismiss on tap
  };
  ios?: {
    sound?: string; // Sound file name
    badge?: number; // App badge count
    categoryId?: string; // UNNotificationCategory
    threadId?: string; // Thread for grouping
  };
  watch?: {
    shortTitle?: string; // Compact title
    shortBody?: string; // Compact body
  };
  auto?: {
    ttsText?: string; // Text-to-speech override
  };
}
```

---

### Cancellation

```typescript
scheduler.cancel("reminder-001"); // Cancel by ID → boolean
scheduler.cancelGroup("promo"); // Cancel all in group → count
scheduler.cancelAll(); // Cancel everything → count
```

---

### Quiet Hours

Configure do-not-disturb periods. Non-critical notifications are held until the quiet period ends.

```typescript
scheduler.setQuietHours(22, 7, true); // 10 PM → 7 AM, enabled

scheduler.isQuietTime(); // → true (if current time is between 22:00-07:00)
```

| Priority   | During Quiet Hours        |
| ---------- | ------------------------- |
| `low`      | Held until 7:00 AM        |
| `normal`   | Held until 7:00 AM        |
| `high`     | Held until 7:00 AM        |
| `critical` | **Delivered immediately** |

---

### Groups / Channels

Register notification groups (maps to Android notification channels).

```typescript
interface NotificationGroup {
  id: string;
  name: string;
  description?: string;
  importance?: "min" | "low" | "default" | "high" | "max";
  silent?: boolean;
}

scheduler.registerGroup({
  id: "payments",
  name: "Payments",
  description: "Payment confirmations and alerts",
  importance: "high",
});

scheduler.registerGroup({
  id: "promo",
  name: "Promotions",
  importance: "low",
  silent: true,
});
```

---

### Inspection

```typescript
scheduler.getPending(); // → NotificationConfig[] (all scheduled)
scheduler.getPendingCount(); // → number
scheduler.getReadyToDeliver(); // → NotificationConfig[] (due now, not in quiet hours)
```

---

### `NotificationInbox`

In-app notification inbox for persistent messaging.

#### `new NotificationInbox(maxMessages?)`

```typescript
const inbox = new NotificationInbox(100); // Max 100 messages (default)
```

#### `inbox.add(message): InboxMessage`

Add a message to the inbox.

```typescript
interface InboxMessage {
  id: string;
  title: string;
  body: string;
  category?: string; // 'orders', 'social', 'promo', etc.
  imageUrl?: string; // Optional image
  deepLink?: string; // In-app navigation link
  data?: Record<string, unknown>; // Custom payload
  read: boolean; // Auto-set to false
  archived: boolean; // Auto-set to false
  receivedAt: number; // Auto-set to Date.now()
  expiresAt?: number; // Optional expiry timestamp
}

const msg = inbox.add({
  id: "msg-001",
  title: "Order shipped!",
  body: "Your order #1234 is on its way",
  category: "orders",
  deepLink: "/orders/1234",
  expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
});
```

#### Reading & Managing

```typescript
inbox.markRead("msg-001"); // → true
inbox.markAllRead(); // → count of marked
inbox.archive("msg-001"); // → true
inbox.delete("msg-001"); // → true

inbox.getAll(); // → InboxMessage[]
inbox.getAll("orders"); // → filtered by category
inbox.getUnreadCount(); // → number
inbox.getUnreadCount("social"); // → filtered count
inbox.getCategories(); // → ['orders', 'social', 'promo']

inbox.cleanup(); // Remove expired messages → count
inbox.clear(); // Remove all messages
```

#### Change Listener

```typescript
const unsubscribe = inbox.onChange(() => {
  console.log("Inbox updated!");
  console.log("Unread:", inbox.getUnreadCount());
});

// Later...
unsubscribe();
```

---

### Full Example: E-Commerce Notifications

```typescript
import { NotificationScheduler, NotificationInbox } from "@rajeev02/notify";

const scheduler = new NotificationScheduler();
const inbox = new NotificationInbox();

// Set up quiet hours
scheduler.setQuietHours(22, 7, true);

// Register channels
scheduler.registerGroup({ id: "orders", name: "Orders", importance: "high" });
scheduler.registerGroup({
  id: "promo",
  name: "Offers",
  importance: "low",
  silent: true,
});

// Order confirmation (high priority — shows immediately)
function onOrderPlaced(order: { id: string; total: number }) {
  scheduler.schedule({
    id: `order-${order.id}`,
    title: "Order confirmed! 🎉",
    body: `Order #${order.id} — ₹${order.total.toLocaleString("en-IN")}`,
    priority: "high",
    groupId: "orders",
    platform: {
      ios: { badge: 1 },
      android: { channelId: "orders", color: "#10B981" },
    },
  });

  inbox.add({
    id: `inbox-order-${order.id}`,
    title: "Order confirmed",
    body: `₹${order.total.toLocaleString("en-IN")}`,
    category: "orders",
    deepLink: `/orders/${order.id}`,
  });
}

// Promotional (low priority — silent, respects quiet hours)
function sendPromo(title: string, body: string) {
  scheduler.schedule({
    id: `promo-${Date.now()}`,
    title,
    body,
    priority: "low",
    groupId: "promo",
  });
}
```
