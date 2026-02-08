# @rajeev02/app-shell

[![npm version](https://img.shields.io/npm/v/@rajeev02/app-shell.svg)](https://www.npmjs.com/package/@rajeev02/app-shell)
[![license](https://img.shields.io/npm/l/@rajeev02/app-shell.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Feature-slice app architecture** with API client, onboarding, chat, cart & checkout (GST), feature flags, multi-step forms with Indian ID validation, and analytics.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **API client** — Offline-first HTTP client with caching (cache-first, stale-while-revalidate), retry, interceptors
- **Cart & checkout** — Add items, apply coupons, calculate GST, generate order summaries
- **Feature flags** — Enable/disable features at runtime with percentage rollouts, user targeting, A/B variants
- **Onboarding** — Configurable onboarding slides with progress tracking and completion callbacks
- **Chat engine** — Real-time messaging with typing indicators, read receipts, and message history
- **Form engine** — Multi-step forms with Indian ID validation (Aadhaar, PAN, IFSC, GSTIN, pincode)
- **Analytics** — Event tracking with session management, user properties, and batched uploads

## ⚠️ Important: Backend Services Required

This is a **client-side orchestration layer** — it manages state, caching, and offline queues. Several modules require your own backend services:

| Module | Backend required? | What you need |
| ------ | ----------------- | ------------- |
| `ApiClient` | **Yes** | Your REST API server (set as `baseUrl`) |
| `ChatEngine` | **Yes** | WebSocket or real-time server ([Firebase](https://firebase.google.com), [Ably](https://ably.com), [Socket.io](https://socket.io)) |
| `AnalyticsEngine` | **Yes** | Analytics endpoint or service ([Mixpanel](https://mixpanel.com), [Amplitude](https://amplitude.com), [PostHog](https://posthog.com), or custom) |
| `FeatureFlagManager` | **Yes** | Feature flag service ([LaunchDarkly](https://launchdarkly.com), [Unleash](https://www.getunleash.io/), or custom API) |
| `FormEngine` | **Yes** | Form submission endpoint (`onSubmit` callback) |
| `CartManager` | **No** | Client-side state only (GST calculation, coupons) |
| `OnboardingManager` | **No** | Client-side state only (slide progress, completion) |

**How callbacks work:** Modules like `ApiClient`, `ChatEngine`, and `AnalyticsEngine` accept configuration callbacks (`onRefreshToken`, `onFlush`, `onSubmit`) that call **your backend endpoints**. The library manages retry, caching, and offline queuing around them.

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |
| Web        | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/app-shell
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### API Client

```typescript
import { ApiClient } from "@rajeev02/app-shell";

const api = new ApiClient({
  baseUrl: "https://api.example.com",
  timeout: 30_000,
  retries: 3,
  cacheStrategy: "stale-while-revalidate",
});

// Add auth interceptor
api.addRequestInterceptor((config) => ({
  ...config,
  headers: { ...config.headers, Authorization: `Bearer ${token}` },
}));

// Make requests
const users = await api.get("/users", { page: 1 });
const order = await api.post("/orders", { items: [...] });
```

### Cart & Checkout

```typescript
import { CartManager } from "@rajeev02/app-shell";

const cart = new CartManager({ gstRate: 0.18, currency: "INR" });

cart.addItem({ id: "1", name: "iPhone 16", price: 79_999, quantity: 1 });
cart.addItem({ id: "2", name: "AirPods Pro", price: 24_999, quantity: 1 });

cart.applyCoupon({ code: "SAVE10", discountPercent: 10 });

const summary = cart.getSummary();
// → {
//     items: 2,
//     subtotal: 104998,
//     gst: 18899,
//     discount: -10499,
//     total: 113398
//   }
```

### Feature Flags

```typescript
import { FeatureFlagManager } from "@rajeev02/app-shell";

const flags = new FeatureFlagManager();

flags.register({
  id: "new_checkout",
  name: "New Checkout Flow",
  enabled: true,
  rolloutPercentage: 50, // 50% of users
  targetUsers: ["beta-group"],
  variants: {
    control: { buttonColor: "blue" },
    treatment: { buttonColor: "green" },
  },
});

if (flags.isEnabled("new_checkout", userId)) {
  const variant = flags.getVariant("new_checkout", userId);
  // → "control" or "treatment"
}
```

### Forms with Indian ID Validation

```typescript
import { FormEngine, getKycFormConfig } from "@rajeev02/app-shell";

const form = new FormEngine(getKycFormConfig());

// Built-in Indian ID validators
form.validateField("aadhaar", "1234 5678 9012"); // → { valid: true }
form.validateField("pan", "ABCPE1234F"); // → { valid: true }
form.validateField("ifsc", "SBIN0001234"); // → { valid: true }
form.validateField("gstin", "22ABCDE1234F1Z5"); // → { valid: true }
form.validateField("pincode", "560001"); // → { valid: true }

// Multi-step form navigation
form.nextStep();
form.prevStep();
const progress = form.getProgress(); // → { current: 2, total: 4, percent: 50 }
```

### Chat Engine

```typescript
import { ChatEngine } from "@rajeev02/app-shell";

const chat = new ChatEngine({
  userId: "user-123",
  onMessageReceived: (msg) => updateUI(msg),
  onTypingStatusChanged: (userId, isTyping) =>
    showTypingIndicator(userId, isTyping),
});

chat.sendMessage({
  roomId: "support",
  text: "Hi, I need help with my order",
  type: "text",
});

chat.markAsRead("support", "msg-001");
chat.setTyping("support", true);
```

### Analytics

```typescript
import { AnalyticsEngine } from "@rajeev02/app-shell";

const analytics = new AnalyticsEngine({
  endpoint: "https://analytics.example.com/events",
  batchSize: 20,
  flushIntervalMs: 30_000,
});

analytics.setUserId("user-123");
analytics.setUserProperties({ plan: "pro", city: "Bengaluru" });

analytics.track("purchase_completed", {
  amount: 999,
  currency: "INR",
  method: "upi",
});

analytics.trackScreen("HomeScreen");
```

## Modules

| Module               | Description                                   |
| -------------------- | --------------------------------------------- |
| `ApiClient`          | HTTP client with caching, retry, interceptors |
| `CartManager`        | Cart with GST, coupons, order summaries       |
| `FeatureFlagManager` | Feature flags, A/B testing, rollouts          |
| `OnboardingManager`  | Configurable onboarding flow                  |
| `ChatEngine`         | Real-time messaging                           |
| `FormEngine`         | Multi-step forms with Indian ID validation    |
| `AnalyticsEngine`    | Event tracking and session management         |

## Indian ID Validators

| Validator | Format        | Example           |
| --------- | ------------- | ----------------- |
| Aadhaar   | 12 digits     | `1234 5678 9012`  |
| PAN       | `AAAAA0000A`  | `ABCPE1234F`      |
| IFSC      | `AAAA0000000` | `SBIN0001234`     |
| GSTIN     | 15 chars      | `22ABCDE1234F1Z5` |
| Pincode   | 6 digits      | `560001`          |
| Phone     | 10 digits     | `9876543210`      |

## Full Documentation

📖 [Complete API docs with all modules and types](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/APP-SHELL.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
