# @rajeev02/app-shell

**Feature-slice app architecture** with API client, onboarding, chat, cart & checkout, feature flags, multi-step forms with Indian ID validation, and analytics.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | ES module                  |
| watchOS 9+          | TypeScript | React Native module        |
| Wear OS             | TypeScript | React Native module        |
| Android Auto        | TypeScript | React Native module        |

---

## Prerequisites

> **⚠️ This is a client-side orchestration layer.** It manages state, caching, and offline queues but requires your own backend services for several modules.

| Module               | Backend required? | What you need                                                                                                                        |
| -------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ApiClient`          | **Yes**           | Your REST API server (set as `baseUrl`)                                                                                              |
| `ChatEngine`         | **Yes**           | WebSocket or real-time server ([Firebase](https://firebase.google.com), [Ably](https://ably.com), [Socket.io](https://socket.io))    |
| `AnalyticsEngine`    | **Yes**           | Analytics endpoint or service ([Mixpanel](https://mixpanel.com), [Amplitude](https://amplitude.com), [PostHog](https://posthog.com)) |
| `FeatureFlagManager` | **Yes**           | Feature flag service ([LaunchDarkly](https://launchdarkly.com), [Unleash](https://www.getunleash.io/), or custom API)                |
| `FormEngine`         | **Yes**           | Form submission endpoint (`onSubmit` callback)                                                                                       |
| `CartManager`        | **No**            | Client-side state only                                                                                                               |
| `OnboardingManager`  | **No**            | Client-side state only                                                                                                               |

Modules accept configuration callbacks (`onRefreshToken`, `onFlush`, `onSubmit`) that call your backend endpoints. The library manages retry, caching, and offline queuing around them.

---

## Installation

```bash
npm install @rajeev02/app-shell
```

### Peer Dependencies

| Package        | Version                 |
| -------------- | ----------------------- |
| `react`        | `>=18.3.0`              |
| `react-native` | `>=0.84.0`              |
| `expo`         | `>=54.0.0` _(optional)_ |

---

## Quick Start

```typescript
import {
  ApiClient,
  OnboardingManager,
  ChatEngine,
  CartManager,
  FeatureFlagManager,
  FormEngine,
  AnalyticsEngine,
  getDefaultOnboardingSlides,
  getKycFormConfig,
} from "@rajeev02/app-shell";

// API Client with caching & interceptors
const api = new ApiClient({
  baseUrl: "https://api.example.com",
  timeout: 30_000,
  retries: 3,
  cacheStrategy: "stale-while-revalidate",
});

// Cart & Checkout
const cart = new CartManager({ gstRate: 0.18, currency: "INR" });
cart.addItem({ id: "1", name: "iPhone 16", price: 79_999, quantity: 1 });
cart.applyCoupon({ code: "SAVE10", discountPercent: 10 });
const summary = cart.getSummary();
// → { subtotal: 79999, gst: 14399, discount: -7999, total: 86399 }

// Forms with Indian ID validation
const form = new FormEngine(getKycFormConfig());
form.validateField("aadhaar", "1234 5678 9012"); // → valid
form.validateField("pan", "ABCPE1234F"); // → valid
form.validateField("ifsc", "SBIN0001234"); // → valid
```

---

## Modules

### API Client

Offline-first HTTP client with request/response interceptors, caching, and automatic retry.

```typescript
const api = new ApiClient(config: ApiConfig);
```

| Method                       | Returns                | Description                |
| ---------------------------- | ---------------------- | -------------------------- |
| `request(config)`            | `Promise<ApiResponse>` | Execute HTTP request       |
| `get(url, params?)`          | `Promise<ApiResponse>` | GET request                |
| `post(url, body?)`           | `Promise<ApiResponse>` | POST request               |
| `put(url, body?)`            | `Promise<ApiResponse>` | PUT request                |
| `delete(url)`                | `Promise<ApiResponse>` | DELETE request             |
| `addRequestInterceptor(fn)`  | `void`                 | Add request interceptor    |
| `addResponseInterceptor(fn)` | `void`                 | Add response interceptor   |
| `clearCache()`               | `void`                 | Clear all cached responses |

**Cache Strategies:** `"no-cache"` | `"cache-first"` | `"network-first"` | `"stale-while-revalidate"`

---

### Onboarding

```typescript
const onboarding = new OnboardingManager(config: OnboardingConfig);
```

| Method                    | Description                    |
| ------------------------- | ------------------------------ |
| `showSplash(config)`      | Display splash screen          |
| `startOnboarding(slides)` | Start slide-based onboarding   |
| `showTooltip(tooltip)`    | Show feature discovery tooltip |
| `markCompleted()`         | Mark onboarding as completed   |
| `isCompleted()`           | Check if onboarding done       |
| `reset()`                 | Reset onboarding state         |

`getDefaultOnboardingSlides()` returns 4 preset slides: Welcome, Discover, Pay, Secure.

---

### Chat Engine

```typescript
const chat = new ChatEngine();
```

| Method                             | Returns         | Description              |
| ---------------------------------- | --------------- | ------------------------ |
| `createRoom(config)`               | `ChatRoom`      | Create chat room         |
| `sendMessage(roomId, message)`     | `ChatMessage`   | Send text/media message  |
| `getMessages(roomId)`              | `ChatMessage[]` | Get room messages        |
| `setTyping(roomId, userId)`        | `void`          | Send typing indicator    |
| `searchMessages(roomId, query)`    | `ChatMessage[]` | Search messages          |
| `reactToMessage(messageId, emoji)` | `void`          | Add reaction             |
| `on(listener)`                     | `() => void`    | Subscribe to chat events |

**Message Types:** `"text"` | `"image"` | `"video"` | `"audio"` | `"file"` | `"location"` | `"contact"` | `"sticker"`

---

### Cart & Checkout

```typescript
const cart = new CartManager(config?: CartConfig);
```

| Method                        | Returns       | Description                                       |
| ----------------------------- | ------------- | ------------------------------------------------- |
| `addItem(item)`               | `void`        | Add item to cart                                  |
| `removeItem(itemId)`          | `void`        | Remove item                                       |
| `updateQuantity(itemId, qty)` | `void`        | Update quantity                                   |
| `applyCoupon(coupon)`         | `boolean`     | Apply discount coupon                             |
| `removeCoupon()`              | `void`        | Remove applied coupon                             |
| `getSummary()`                | `CartSummary` | Get cart summary (subtotal, GST, discount, total) |
| `getItems()`                  | `CartItem[]`  | Get all items                                     |
| `clear()`                     | `void`        | Clear cart                                        |
| `placeOrder(address)`         | `Order`       | Place order                                       |
| `getOrders()`                 | `Order[]`     | Get order history                                 |

---

### Feature Flags

```typescript
const flags = new FeatureFlagManager();
```

| Method                         | Returns               | Description              |
| ------------------------------ | --------------------- | ------------------------ |
| `register(flag)`               | `void`                | Register a feature flag  |
| `isEnabled(flagId)`            | `boolean`             | Check if flag is enabled |
| `getVariant(flagId)`           | `string \| undefined` | Get A/B test variant     |
| `getAll()`                     | `FeatureFlag[]`       | List all flags           |
| `setOverride(flagId, enabled)` | `void`                | Override flag value      |
| `clearOverrides()`             | `void`                | Clear all overrides      |

---

### Forms & Validation

```typescript
const form = new FormEngine(config: FormConfig);
```

| Method                          | Returns               | Description                 |
| ------------------------------- | --------------------- | --------------------------- |
| `getCurrentStep()`              | `FormStep`            | Get current form step       |
| `nextStep()`                    | `boolean`             | Move to next step           |
| `prevStep()`                    | `boolean`             | Move to previous step       |
| `setFieldValue(fieldId, value)` | `void`                | Set field value             |
| `validateField(fieldId, value)` | `ValidationResult`    | Validate single field       |
| `validateCurrentStep()`         | `boolean`             | Validate all fields in step |
| `getFormState()`                | `FormState`           | Get full form state         |
| `submit()`                      | `Record<string, any>` | Submit form data            |

**Indian Validators:** Aadhaar (Verhoeff checksum), PAN (format), IFSC (format + bank lookup), Pincode (6-digit + city/state), Phone (+91 10-digit), GST (15-char).

`getKycFormConfig()` returns a 4-step KYC form: Personal → Address → Documents → Verification.

---

### Analytics

```typescript
const analytics = new AnalyticsEngine(config: AnalyticsConfig);
```

| Method                     | Description              |
| -------------------------- | ------------------------ |
| `track(event)`             | Track an analytics event |
| `screenView(screenName)`   | Track screen view        |
| `setUserId(userId)`        | Set user identifier      |
| `setUserProperties(props)` | Set user properties      |
| `flush()`                  | Send all queued events   |
| `reset()`                  | Reset analytics state    |

---

## Types

```typescript
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  cacheStrategy: CacheStrategy;
  headers?: Record<string, string>;
}

type CacheStrategy =
  | "no-cache"
  | "cache-first"
  | "network-first"
  | "stale-while-revalidate";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variant?: string;
}

interface CartSummary {
  items: CartItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  couponApplied?: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: Address;
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  type: MessageType;
  content: string;
  status: MessageStatus;
  timestamp: number;
  reactions?: Record<string, string[]>;
}

type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "location"
  | "contact"
  | "sticker";
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  rolloutPercent: number;
  variant?: string;
  description?: string;
}

type FieldType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "select"
  | "date"
  | "file"
  | "aadhaar"
  | "pan"
  | "ifsc"
  | "pincode"
  | "gst";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
}

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormConfig {
  steps: FormStep[];
  onSubmit?: (data: Record<string, any>) => void;
}
```
