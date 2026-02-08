# @rajeev02/payments

[![npm version](https://img.shields.io/npm/v/@rajeev02/payments.svg)](https://www.npmjs.com/package/@rajeev02/payments)
[![license](https://img.shields.io/npm/l/@rajeev02/payments.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**India-focused payments SDK** with UPI deep links, card validation (Luhn), wallet integration, and subscription management.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **UPI-first** — Generate UPI intent URIs for Google Pay, PhonePe, Paytm, BHIM. VPA validation, PSP detection.
- **Card support** — Visa/Mastercard/Amex/RuPay detection, Luhn validation, formatted display
- **Wallet integration** — Paytm, PhonePe, Amazon Pay — unified checkout flow
- **Subscriptions** — Create, upgrade, downgrade, cancel — with proration and GST
- **Refunds** — Full/partial refund flow with reason tracking
- **Indian-optimized** — INR formatting, GST calculation, UPI 2.0 collect, merchant category codes
- **Pure TypeScript** — No payment gateway SDK dependency. Bring your own backend.

## ⚠️ Important: Payment Gateway Required

This library provides **client-side payment utilities** — it does **NOT** process payments, charge cards, or communicate with payment gateways directly.

| What the library does (client-side)        | What YOU must build (backend)                        |
| ------------------------------------------ | ---------------------------------------------------- |
| Generate UPI intent URIs (`upi://pay?...`) | Merchant VPA registration with your bank             |
| Validate card numbers (Luhn algorithm)     | Card tokenization via Razorpay/Stripe/Juspay         |
| Detect card network (Visa/MC/RuPay/Amex)   | PCI-compliant card processing                        |
| Generate wallet checkout payloads          | Paytm/PhonePe merchant integration + callback server |
| Manage subscription state                  | Recurring billing via payment gateway                |
| Calculate GST and format INR amounts       | Tax reporting and invoicing                          |

**UPI:** The generated `upi://pay?...` URI only works when a UPI app (GPay, PhonePe, Paytm, BHIM) is installed on the user's device. On web, UPI intent links are not supported.

**Recommended payment gateways for India:** [Razorpay](https://razorpay.com), [Cashfree](https://cashfree.com), [Juspay](https://juspay.in), [PayU](https://payu.in), [Stripe India](https://stripe.com/in)

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |
| Web        | TypeScript | ✅     |
| watchOS 9+ | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/payments
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### UPI Payments

```typescript
import { generateUpiUri, validateVpa, getPspName } from "@rajeev02/payments";

// Generate UPI intent link
const uri = generateUpiUri(
  { merchantVpa: "store@paytm", merchantName: "My Store" },
  { amount: 499, note: "Order #1234", orderId: "ORD_1234" },
);
// → "upi://pay?pa=store%40paytm&pn=My+Store&am=499.00&cu=INR&..."

// Open with Linking.openURL(uri) on React Native
// or window.location.href = uri on Web

// Validate VPA
validateVpa("rajeev@paytm"); // → true
validateVpa("invalid"); // → false
getPspName("rajeev@paytm"); // → "Paytm"
getPspName("rajeev@okicici"); // → "iMobile Pay"
```

### Card Payments

```typescript
import {
  detectCardNetwork,
  formatCardNumber,
  validateCardNumber,
} from "@rajeev02/payments";

detectCardNetwork("4111111111111111"); // → "visa"
detectCardNetwork("5500000000000004"); // → "mastercard"
detectCardNetwork("6521000000000000"); // → "rupay"

formatCardNumber("4111111111111111"); // → "4111 1111 1111 1111"
validateCardNumber("4111111111111111"); // → true (Luhn check)
```

### Wallet Checkout

```typescript
import { WalletManager } from "@rajeev02/payments";

const wallets = new WalletManager();

wallets.register({
  provider: "paytm",
  merchantId: "MID_123",
  environment: "production",
  callbackUrl: "https://myapp.com/callback",
});

const checkout = wallets.generateCheckout("paytm", {
  orderId: "ORD_1234",
  amount: 499,
  customerId: "cust_abc",
});
```

### Subscriptions

```typescript
import { SubscriptionManager } from "@rajeev02/payments";

const subs = new SubscriptionManager();

const sub = subs.create({
  planId: "pro_monthly",
  customerEmail: "rajeev@example.com",
  amount: 999,
  currency: "INR",
  interval: "month",
  trialDays: 14,
});
```

## API Reference

| Export                 | Type       | Description                                |
| ---------------------- | ---------- | ------------------------------------------ |
| `generateUpiUri()`     | `function` | Generate UPI deep link URI                 |
| `validateVpa()`        | `function` | Validate UPI Virtual Payment Address       |
| `getPspName()`         | `function` | Get PSP name from VPA handle               |
| `detectCardNetwork()`  | `function` | Detect Visa/MC/Amex/RuPay from card number |
| `formatCardNumber()`   | `function` | Format card with spaces                    |
| `validateCardNumber()` | `function` | Luhn algorithm validation                  |
| `WalletManager`        | `class`    | Register and manage wallet providers       |
| `SubscriptionManager`  | `class`    | Subscription lifecycle management          |
| `RefundManager`        | `class`    | Full/partial refund processing             |

## Full Documentation

📖 [Complete API docs with all payment flows](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/PAYMENTS.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
