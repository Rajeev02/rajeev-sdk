# @rajeev02/auth

[![npm version](https://img.shields.io/npm/v/@rajeev02/auth.svg)](https://www.npmjs.com/package/@rajeev02/auth)
[![license](https://img.shields.io/npm/l/@rajeev02/auth.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Universal Auth & Identity SDK** with phone OTP, social sign-in (Google/Apple/Facebook), Aadhaar eKYC, biometric authentication, and JWT session management.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **India-first auth flows** — Phone OTP (SMS/WhatsApp), Aadhaar eKYC with DigiLocker, UPI handle verification
- **Social sign-in** — Google, Apple, Facebook with unified callback API
- **Biometric auth** — Face ID, Touch ID, Android fingerprint — with graceful fallback
- **Session management** — JWT access/refresh tokens, auto-refresh, persistence, expiry tracking
- **MFA support** — TOTP (Google Authenticator), SMS OTP, biometric as second factor
- **Pure TypeScript** — No native dependencies. Plug in your own backend endpoints.

## ⚠️ Important: Backend Required

**This library does NOT send OTPs, generate tokens, or communicate with SMS providers directly.** It is a **client-side orchestrator** that manages auth flows (state machine, cooldowns, rate limiting, token refresh, session persistence).

**You must provide your own backend** that handles the actual work:

| What the library does (client-side)              | What YOU must build (backend)                                |
| ------------------------------------------------ | ------------------------------------------------------------ |
| OTP state machine (sending → waiting → verified) | API endpoint that sends SMS/WhatsApp via Twilio, MSG91, etc. |
| Resend cooldown timer (30s default)              | OTP code generation & storage                                |
| Max attempts & lockout tracking                  | OTP verification & token issuance                            |
| JWT token storage & auto-refresh                 | Token generation (JWT signing)                               |
| Session expiry detection                         | Refresh token endpoint                                       |
| OAuth flow orchestration                         | OAuth client credentials & callback handling                 |

**Recommended OTP/SMS providers for India:** [MSG91](https://msg91.com), [Twilio](https://twilio.com), [Firebase Auth](https://firebase.google.com/docs/auth), [AWS SNS](https://aws.amazon.com/sns/)

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |
| Web        | TypeScript | ✅     |
| watchOS 9+ | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/auth
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Session Management

> **Note:** `onRefreshToken`, `onPersistTokens`, and `onLoadTokens` are callbacks to **your backend/storage**. The library calls them at the right time — you implement the actual logic.

```typescript
import { SessionManager } from "@rajeev02/auth";

const session = new SessionManager({
  onRefreshToken: async (refreshToken) => {
    const res = await fetch("/api/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    return res.json(); // { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt }
  },
  onSessionExpired: () => navigation.navigate("Login"),
  onPersistTokens: async (tokens) => {
    await SecureStore.setItemAsync("tokens", JSON.stringify(tokens));
  },
  onLoadTokens: async () => {
    const raw = await SecureStore.getItemAsync("tokens");
    return raw ? JSON.parse(raw) : null;
  },
});

// Initialize (loads persisted tokens, auto-refreshes if needed)
const state = await session.initialize(); // → 'authenticated' | 'unauthenticated'

// Get access token for API calls (auto-refreshes if expired)
const token = await session.getAccessToken();
```

### Phone OTP Login

> **Note:** `onSendOtp` and `onVerifyOtp` call **your backend API**, which must integrate with an SMS provider (Twilio, MSG91, etc.). The library does NOT send SMS — it manages the OTP flow around your endpoints.

```typescript
import { OtpManager } from "@rajeev02/auth";

const otp = new OtpManager({
  onSendOtp: async (phone, method) => {
    const res = await fetch("/api/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone, method }),
    });
    return res.json(); // { requestId, expiresInSeconds }
  },
  onVerifyOtp: async (requestId, code) => {
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({ requestId, otp: code }),
    });
    return res.json(); // { success, tokens? }
  },
  resendCooldownSeconds: 30,
  maxAttempts: 5,
});

// Send OTP
await otp.sendOtp("+919876543210", "sms");

// Verify (user enters code)
const result = await otp.verifyOtp("483921");
if (result.success) {
  await session.setTokens(result.tokens);
}
```

### Social Sign-In

```typescript
import { AuthProviderRegistry } from "@rajeev02/auth";

const providers = new AuthProviderRegistry();

providers.register({
  id: "google",
  name: "Google",
  clientId: "YOUR_GOOGLE_CLIENT_ID",
  scopes: ["profile", "email"],
  redirectUri: "myapp://auth/google/callback",
});

const url = providers.getAuthorizationUrl("google");
// → redirect user to this URL
// → handle callback with providers.handleCallback("google", callbackUrl)
```

## API Reference

### `SessionManager`

| Method              | Returns              | Description                                     |
| ------------------- | -------------------- | ----------------------------------------------- |
| `initialize()`      | `Promise<AuthState>` | Load tokens, auto-refresh, determine auth state |
| `setTokens(tokens)` | `Promise<void>`      | Store new token pair                            |
| `getAccessToken()`  | `Promise<string>`    | Get valid access token (auto-refreshes)         |
| `logout()`          | `Promise<void>`      | Clear all tokens                                |
| `getState()`        | `AuthState`          | Current auth state                              |
| `isTokenExpired()`  | `boolean`            | Check if access token is expired                |

### `OtpManager`

| Method                         | Returns                 | Description                                            |
| ------------------------------ | ----------------------- | ------------------------------------------------------ |
| `sendOtp(destination, method)` | `Promise<OtpResponse>`  | Triggers your `onSendOtp` callback + starts cooldown   |
| `verifyOtp(code)`              | `Promise<VerifyResult>` | Triggers your `onVerifyOtp` callback + tracks attempts |
| `canResend()`                  | `boolean`               | Check if resend cooldown has passed                    |
| `getRemainingCooldown()`       | `number`                | Seconds until resend is allowed                        |

### `AuthProviderRegistry`

| Method                            | Returns               | Description                 |
| --------------------------------- | --------------------- | --------------------------- |
| `register(config)`                | `void`                | Register an OAuth provider  |
| `getAuthorizationUrl(providerId)` | `string`              | Get OAuth authorization URL |
| `handleCallback(providerId, url)` | `Promise<AuthResult>` | Process OAuth callback      |
| `getProviders()`                  | `AuthProvider[]`      | List registered providers   |

## Full Documentation

📖 [Complete API docs with Aadhaar eKYC, biometric, and MFA examples](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/AUTH.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
