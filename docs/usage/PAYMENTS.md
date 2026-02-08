# @rajeev02/payments

**India-focused payments SDK** with UPI deep links, card validation, wallet integration, and subscription management.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | React Native / Expo module |
| watchOS 9+          | TypeScript | React Native / Expo module |
| Wear OS             | TypeScript | React Native / Expo module |
| Android Auto        | TypeScript | React Native / Expo module |

---

## Prerequisites

> **⚠️ This library does NOT process payments, charge cards, or communicate with payment gateways directly.** It provides client-side utilities for UPI intent generation, card validation, wallet checkout payloads, and subscription management.

Before using `@rajeev02/payments`, you need:

1. **A payment gateway account** — [Razorpay](https://razorpay.com), [Cashfree](https://cashfree.com), [Juspay](https://juspay.in), [PayU](https://payu.in), or [Stripe India](https://stripe.com/in)
2. **A backend server** for:
   - Creating payment orders and verifying payment signatures
   - Handling wallet checkout callbacks (Paytm/PhonePe merchant integration)
   - Processing refunds and managing subscriptions
3. **Merchant credentials** — `merchantId`, `merchantKey`, `merchantVpa` from your payment provider
4. **UPI apps** (for UPI payments) — GPay, PhonePe, Paytm, or BHIM must be installed on the user's device

The library generates UPI intent URIs, validates card numbers, and creates checkout payloads — your backend and payment gateway handle the actual money movement.

---

## Installation

```bash
npm install @rajeev02/payments
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
  generateUpiUri,
  validateVpa,
  getPspName,
  detectCardNetwork,
  formatCardNumber,
  validateCardNumber,
  WalletManager,
} from "@rajeev02/payments";

// 1. Generate a UPI payment link for ₹499
const upiUri = generateUpiUri(
  { merchantVpa: "store@paytm", merchantName: "My Store" },
  { amount: 499, note: "Order #1234", orderId: "ORD_1234" },
);
console.log(upiUri);
// → "upi://pay?pa=store%40paytm&pn=My+Store&am=499.00&cu=INR&tn=Order+%231234&tr=TXN1738972800000&tid=ORD_1234"

// 2. Validate a UPI VPA
console.log(validateVpa("rajeev@paytm")); // → true
console.log(validateVpa("invalid")); // → false
console.log(getPspName("rajeev@paytm")); // → "Paytm"

// 3. Detect card network & validate
console.log(detectCardNetwork("4111111111111111")); // → "visa"
console.log(formatCardNumber("4111111111111111")); // → "4111 1111 1111 1111"
console.log(validateCardNumber("4111111111111111")); // → true (Luhn check)

// 4. Create a wallet checkout
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

---

## API Reference

### UPI Functions

#### `generateUpiUri(config, request): string`

Generate a UPI deep link URI for intent-based payment. Works with all UPI apps (Google Pay, PhonePe, Paytm, BHIM, etc.).

```typescript
const uri = generateUpiUri(
  {
    merchantVpa: "merchant@okicici",
    merchantName: "Chai Corner",
    mcc: "5812", // Merchant category code (optional)
    txnRefPrefix: "CHAI", // Transaction reference prefix (optional)
  },
  {
    amount: 150.5,
    note: "2x Masala Chai",
    orderId: "ORD_5678",
    txnRef: "CHAI_CUSTOM_REF", // Custom ref (optional, auto-generated if omitted)
    customerVpa: "customer@ybl", // For collect requests (optional)
  },
);
// → "upi://pay?pa=merchant%40okicici&pn=Chai+Corner&am=150.50&cu=INR&tn=2x+Masala+Chai&tr=CHAI_CUSTOM_REF&mc=5812&tid=ORD_5678"
```

#### `generateUpiQrData(config, request): string`

Generate a UPI QR code data string. Returns the same URI format used by `generateUpiUri` — pass this to any QR code renderer.

```typescript
import QRCode from "react-native-qrcode-svg";

const qrData = generateUpiQrData(
  { merchantVpa: "store@paytm", merchantName: "My Store" },
  { amount: 999, note: "Premium Plan", orderId: "ORD_9999" },
);

<QRCode value={qrData} size={200} />;
```

#### `validateVpa(vpa): boolean`

Validate a UPI VPA format (`username@psp`).

```typescript
validateVpa("rajeev@paytm"); // → true
validateVpa("user@okicici"); // → true
validateVpa("invalid-vpa"); // → false
validateVpa("user@"); // → false
```

#### `getPspName(vpa): string | null`

Get the PSP (Payment Service Provider) display name from a VPA handle. Returns `null` for unknown handles.

```typescript
getPspName("rajeev@paytm"); // → "Paytm"
getPspName("user@ybl"); // → "PhonePe (YES Bank)"
getPspName("user@okicici"); // → "Google Pay (ICICI)"
getPspName("user@unknown"); // → null
```

---

### Card Functions

#### `detectCardNetwork(cardNumber): string | null`

Detect card network from the card number prefix (first 6 digits). Returns `null` for unrecognized networks.

```typescript
detectCardNetwork("4111111111111111"); // → "visa"
detectCardNetwork("5500000000000004"); // → "mastercard"
detectCardNetwork("6521000000000000"); // → "rupay"
detectCardNetwork("371449635398431"); // → "amex"
detectCardNetwork("30569309025904"); // → "dinersclub"
detectCardNetwork("0000000000000000"); // → null
```

**Supported networks:** `visa`, `mastercard`, `rupay`, `amex`, `dinersclub`

#### `formatCardNumber(cardNumber): string`

Format a card number with spaces for display. Uses AMEX format (4-6-5) for AMEX cards, standard format (4-4-4-4) for all others.

```typescript
formatCardNumber("4111111111111111"); // → "4111 1111 1111 1111"
formatCardNumber("371449635398431"); // → "3714 496353 98431"  (AMEX)
```

#### `validateCardNumber(cardNumber): boolean`

Validate a card number using the Luhn algorithm. Accepts 13–19 digit numbers.

```typescript
validateCardNumber("4111111111111111"); // → true
validateCardNumber("1234567890123456"); // → false
```

---

### Subscription Functions

#### `getNextBillingDate(plan, currentDate?): Date`

Calculate the next billing date for a subscription plan. Supports daily, weekly, monthly, quarterly, and yearly intervals.

```typescript
import { getNextBillingDate } from "@rajeev02/payments";
import type { SubscriptionPlan } from "@rajeev02/payments";

const plan: SubscriptionPlan = {
  id: "pro_monthly",
  name: "Pro Monthly",
  amount: 499,
  currency: "INR",
  interval: "monthly",
  intervalCount: 1,
};

const nextBilling = getNextBillingDate(plan, new Date("2026-02-07"));
// → Date(2026-03-07)
```

---

### `WalletManager` (class)

Manages payment flows across multiple wallet providers (Paytm, PhonePe, Amazon Pay, etc.).

#### `new WalletManager()`

Create a new wallet manager instance.

#### `wallets.register(config): void`

Register a wallet provider with merchant credentials.

```typescript
const wallets = new WalletManager();

wallets.register({
  provider: "paytm",
  merchantId: "MID_123",
  merchantKey: "KEY_abc", // optional
  environment: "production", // "sandbox" | "production"
  callbackUrl: "https://myapp.com/paytm/callback",
});

wallets.register({
  provider: "phonepe",
  merchantId: "MID_456",
  environment: "sandbox",
  callbackUrl: "https://myapp.com/phonepe/callback",
});
```

#### `wallets.getAvailableWallets(): WalletProvider[]`

Returns all registered wallet provider names.

```typescript
wallets.getAvailableWallets(); // → ["paytm", "phonepe"]
```

#### `wallets.isAvailable(provider): boolean`

Check if a wallet provider is registered.

```typescript
wallets.isAvailable("paytm"); // → true
wallets.isAvailable("amazon_pay"); // → false
```

#### `wallets.generateCheckout(provider, request): Record<string, unknown> | null`

Generate a checkout payload for a wallet provider. Returns `null` if the provider is not registered.

```typescript
const checkout = wallets.generateCheckout("paytm", {
  orderId: "ORD_1234",
  amount: 999,
  customerId: "cust_abc",
  customerPhone: "+919876543210",
  customerEmail: "user@example.com",
  description: "Premium Plan",
});
// → {
//   provider: "paytm",
//   merchantId: "MID_123",
//   environment: "production",
//   callbackUrl: "https://myapp.com/paytm/callback",
//   orderId: "ORD_1234",
//   amount: 999,
//   customerId: "cust_abc",
//   phone: "+919876543210",
//   email: "user@example.com",
// }
```

---

### Constants

#### `UPI_PSP_HANDLES`

Map of known UPI PSP handles to display names.

```typescript
import { UPI_PSP_HANDLES } from "@rajeev02/payments";

console.log(UPI_PSP_HANDLES);
// → {
//   "@paytm":      "Paytm",
//   "@okicici":    "Google Pay (ICICI)",
//   "@okhdfcbank": "Google Pay (HDFC)",
//   "@oksbi":      "Google Pay (SBI)",
//   "@ybl":        "PhonePe (YES Bank)",
//   "@ibl":        "PhonePe (ICICI)",
//   "@axl":        "PhonePe (Axis)",
//   "@apl":        "Amazon Pay",
//   "@freecharge": "Freecharge",
//   "@upi":        "BHIM",
// }
```

---

## Types

### `UpiConfig`

```typescript
interface UpiConfig {
  merchantVpa: string; // e.g., "merchant@paytm"
  merchantName: string; // Displayed in UPI apps
  mcc?: string; // Merchant category code
  txnRefPrefix?: string; // Transaction reference prefix
}
```

### `UpiPaymentRequest`

```typescript
interface UpiPaymentRequest {
  amount: number; // Amount in INR
  note: string; // Payment description
  txnRef?: string; // Custom transaction reference
  customerVpa?: string; // Customer VPA (for collect requests)
  orderId: string; // Order ID from backend
}
```

### `UpiPaymentResult`

```typescript
interface UpiPaymentResult {
  success: boolean;
  txnId?: string;
  txnRef?: string;
  responseCode?: string;
  approvalRefNo?: string;
  status: "success" | "failed" | "pending" | "cancelled";
  error?: string;
}
```

### `UpiMandateRequest`

```typescript
interface UpiMandateRequest {
  customerVpa: string; // Customer VPA
  maxAmount: number; // Maximum amount per debit
  frequency: string; // "DAILY" | "WEEKLY" | "FORTNIGHTLY" | "MONTHLY" | "BIMONTHLY" | "QUARTERLY" | "HALFYEARLY" | "YEARLY"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  purpose: string; // Purpose description
}
```

### `CardInfo`

```typescript
interface CardInfo {
  tokenRef: string; // Tokenized card reference (RBI compliant — never store raw numbers)
  last4: string; // Last 4 digits for display
  network: "visa" | "mastercard" | "rupay" | "amex" | "dinersclub";
  type: "credit" | "debit" | "prepaid";
  issuerBank?: string;
  expiryMonth: number;
  expiryYear: number;
  holderName?: string;
  supportsRecurring: boolean;
}
```

### `SubscriptionPlan`

```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  intervalCount: number;
  trialDays?: number;
  features?: string[];
}
```

### `Subscription`

```typescript
interface Subscription {
  id: string;
  planId: string;
  customerId: string;
  status:
    | "active"
    | "paused"
    | "cancelled"
    | "past_due"
    | "trialing"
    | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  paymentMethod: "card" | "upi_mandate" | "emandate";
  tokenRef?: string;
  nextBillingDate: string;
  amount: number;
}
```

### `WalletProvider`

```typescript
type WalletProvider =
  | "paytm"
  | "phonepe"
  | "amazon_pay"
  | "freecharge"
  | "mobikwik"
  | "jio_pay";
```

### `WalletConfig`

```typescript
interface WalletConfig {
  provider: WalletProvider;
  merchantId: string;
  merchantKey?: string;
  environment: "sandbox" | "production";
  callbackUrl: string;
}
```

### `WalletPaymentRequest`

```typescript
interface WalletPaymentRequest {
  orderId: string;
  amount: number;
  customerId: string;
  customerPhone?: string;
  customerEmail?: string;
  description?: string;
}
```

### `WalletPaymentResult`

```typescript
interface WalletPaymentResult {
  success: boolean;
  provider: WalletProvider;
  txnId?: string;
  orderId: string;
  status: "success" | "failed" | "pending" | "cancelled";
  walletBalance?: number;
  error?: string;
}
```
