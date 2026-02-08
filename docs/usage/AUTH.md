# @rajeev02/auth

**Universal Auth & Identity SDK** with phone OTP, social sign-in, Aadhaar eKYC, and JWT session management.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | React Native / Expo module |
| watchOS 9+          | TypeScript | React Native / Expo module |
| Wear OS             | TypeScript | React Native / Expo module |
| Android Auto        | TypeScript | React Native / Expo module |

---

## Installation

```bash
npm install @rajeev02/auth
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
  SessionManager,
  OtpManager,
  AuthProviderRegistry,
  getIndianAuthProviders,
} from "@rajeev02/auth";

// 1. Create a session manager
const session = new SessionManager({
  onRefreshToken: async (refreshToken) => {
    const res = await fetch("/api/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    return res.json(); // { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt }
  },
  onSessionExpired: () => {
    console.log("Session expired — redirect to login");
  },
  onPersistTokens: async (tokens) => {
    await AsyncStorage.setItem("tokens", JSON.stringify(tokens));
  },
  onLoadTokens: async () => {
    const raw = await AsyncStorage.getItem("tokens");
    return raw ? JSON.parse(raw) : null;
  },
});

// 2. Initialize (loads persisted tokens, auto-refreshes if needed)
const state = await session.initialize();
console.log(state); // 'authenticated' | 'unauthenticated'

// 3. Create OTP manager for phone login
const otp = new OtpManager({
  onSendOtp: async (destination, method) => {
    const res = await fetch("/api/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone: destination, method }),
    });
    return res.json(); // { requestId, expiresInSeconds }
  },
  onVerifyOtp: async (requestId, otp) => {
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({ requestId, otp }),
    });
    return res.json(); // { success, tokens? }
  },
  resendCooldownSeconds: 30,
  maxAttempts: 5,
});

// 4. Send OTP
await otp.sendOtp("+919876543210", "sms");

// 5. Verify OTP (user enters "123456")
const result = await otp.verifyOtp("123456");
if (result.success) {
  await session.setTokens(result.tokens);
  const token = await session.getAccessToken();
  console.log("Logged in!", token);
}
```

---

## API Reference

### `SessionManager` (class)

Manages JWT access/refresh token lifecycle with auto-refresh, secure persistence, and session expiry.

#### `new SessionManager(config: SessionConfig)`

```typescript
interface SessionConfig {
  /** Called when access token needs refreshing */
  onRefreshToken: (refreshToken: string) => Promise<TokenPair | null>;
  /** Called when session is fully expired (refresh token invalid) */
  onSessionExpired: () => void;
  /** Persist tokens to storage (optional) */
  onPersistTokens?: (tokens: TokenPair) => Promise<void>;
  /** Load tokens from storage on initialize (optional) */
  onLoadTokens?: () => Promise<TokenPair | null>;
  /** Buffer time before expiry to trigger refresh (default: 60000ms) */
  refreshBufferMs?: number;
}
```

#### `session.initialize(): Promise<AuthState>`

Load persisted tokens and determine auth state. Auto-refreshes if access token is expired but refresh token is valid.

#### `session.setTokens(tokens: TokenPair): Promise<void>`

Set new tokens (e.g., after login). Schedules auto-refresh and persists tokens.

```typescript
await session.setTokens({
  accessToken: "eyJhbGciOi…",
  refreshToken: "rft_abc123…",
  accessExpiresAt: Date.now() + 3600000, // 1 hour
  refreshExpiresAt: Date.now() + 604800000, // 7 days
});
```

#### `session.getAccessToken(): Promise<string | null>`

Returns the current access token. Automatically refreshes if close to expiry (within `refreshBufferMs`).

```typescript
const token = await session.getAccessToken();
// Use in API calls: Authorization: Bearer ${token}
```

#### `session.logout(): Promise<void>`

Clear all tokens, cancel refresh timers, and set state to `unauthenticated`. Calls `onPersistTokens` with empty tokens.

#### `session.isAuthenticated(): boolean`

Returns `true` if state is `authenticated` and tokens are present.

#### `session.getState(): AuthState`

Returns the current session state.

#### `session.getUserFromToken(): Record<string, unknown> | null`

Decode the current access token's JWT payload and return the user claims.

```typescript
const user = session.getUserFromToken();
// → { sub: "user_123", name: "Rajeev", email: "rajeev@example.com", iat: … }
```

#### `session.onStateChange(listener): () => void`

Subscribe to state changes. Returns an unsubscribe function.

```typescript
const unsubscribe = session.onStateChange((state) => {
  console.log("Auth state:", state); // 'initializing' | 'authenticated' | 'unauthenticated' | 'refreshing'
});
```

#### `SessionManager.decodeToken(token: string): Record<string, unknown> | null`

Static method to decode any JWT token payload (base64url → JSON). Returns `null` if invalid.

```typescript
const payload = SessionManager.decodeToken("eyJhbGciOiJIUzI1NiIs…");
// → { sub: "user_123", exp: 1738972800, … }
```

---

### `OtpManager` (class)

Phone/email OTP authentication flow with rate limiting, cooldown timer, lockout protection, and auto-read support.

#### `new OtpManager(config: OtpConfig)`

```typescript
interface OtpConfig {
  /** Backend call to send OTP */
  onSendOtp: (
    destination: string,
    method: "sms" | "email" | "whatsapp",
  ) => Promise<{ requestId: string; expiresInSeconds: number }>;
  /** Backend call to verify OTP */
  onVerifyOtp: (
    requestId: string,
    otp: string,
  ) => Promise<{ success: boolean; tokens?: TokenPair }>;
  /** OTP digit length (default: 6) */
  otpLength?: number;
  /** Cooldown between resends in seconds (default: 30) */
  resendCooldownSeconds?: number;
  /** Max verification attempts before lockout (default: 5) */
  maxAttempts?: number;
  /** Lockout duration in seconds (default: 300) */
  lockoutSeconds?: number;
}
```

#### `otp.sendOtp(destination, method?): Promise<boolean>`

Send an OTP to the given phone number or email. Returns `false` if locked or in cooldown.

```typescript
const sent = await otp.sendOtp("+919876543210", "sms");
const sentEmail = await otp.sendOtp("user@example.com", "email");
const sentWa = await otp.sendOtp("+919876543210", "whatsapp");
```

#### `otp.verifyOtp(otp): Promise<{ success: boolean; tokens?: unknown }>`

Verify the OTP entered by the user. Increments attempt counter; locks out after `maxAttempts`.

```typescript
const result = await otp.verifyOtp("123456");
if (result.success) {
  console.log("Verified!", result.tokens);
}
```

#### `otp.resendOtp(destination, method?): Promise<boolean>`

Resend OTP. Respects cooldown timer — returns `false` if cooldown is active.

#### `otp.getResendCooldownSeconds(): number`

Returns seconds remaining before resend is allowed. `0` means resend is available.

#### `otp.getExpirySeconds(): number`

Returns seconds remaining before the current OTP expires.

#### `otp.isLocked(): boolean`

Returns `true` if the user is locked out due to too many failed attempts.

#### `otp.onStateChange(listener): () => void`

Subscribe to OTP state changes. Returns an unsubscribe function.

```typescript
const unsubscribe = otp.onStateChange((state) => {
  console.log(state); // 'idle' | 'sending' | 'waiting_for_otp' | 'verifying' | 'verified' | 'failed' | 'locked'
});
```

---

### `AuthProviderRegistry` (class)

Manages available login methods (social sign-in, Aadhaar eKYC, DigiLocker, etc.).

#### `registry.register(provider, handler): void`

Register a login provider with its handler function.

```typescript
const registry = new AuthProviderRegistry();

registry.register(
  { type: "google", name: "Google", icon: "google", enabled: true },
  async (config) => {
    // Trigger Google Sign-In SDK
    const googleUser = await GoogleSignIn.signIn();
    return {
      success: true,
      provider: "google",
      providerToken: googleUser.idToken,
      profile: { name: googleUser.name, email: googleUser.email },
    };
  },
);
```

#### `registry.login(type, config?): Promise<ProviderResult>`

Trigger login for a specific provider.

```typescript
const result = await registry.login("google");
if (result.success) {
  console.log("Welcome", result.profile?.name);
}
```

#### `registry.getAvailable(): AuthProvider[]`

Returns all enabled providers.

#### `registry.setEnabled(type, enabled): void`

Enable or disable a provider at runtime.

#### `registry.isAvailable(type): boolean`

Check if a provider is registered and enabled.

---

### `getIndianAuthProviders(): AuthProvider[]`

Returns a preset list of auth providers common in Indian apps:

```typescript
const providers = getIndianAuthProviders();
// → [
//   { type: "phone_otp", name: "Phone OTP", enabled: true },
//   { type: "google",    name: "Google",     enabled: true },
//   { type: "aadhaar",   name: "Aadhaar eKYC", enabled: false },
//   { type: "digilocker", name: "DigiLocker", enabled: false },
//   { type: "apple",     name: "Apple",      enabled: false },
// ]
```

---

## Types

### `TokenPair`

```typescript
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number; // Unix timestamp (ms)
  refreshExpiresAt: number; // Unix timestamp (ms)
}
```

### `AuthState`

```typescript
type AuthState =
  | "initializing"
  | "authenticated"
  | "unauthenticated"
  | "refreshing";
```

### `OtpState`

```typescript
type OtpState =
  | "idle"
  | "sending"
  | "waiting_for_otp"
  | "verifying"
  | "verified"
  | "failed"
  | "locked";
```

### `ProviderType`

```typescript
type ProviderType =
  | "phone_otp"
  | "google"
  | "apple"
  | "facebook"
  | "aadhaar"
  | "digilocker"
  | "custom";
```

### `AuthProvider`

```typescript
interface AuthProvider {
  type: ProviderType;
  name: string;
  icon?: string;
  enabled: boolean;
}
```

### `ProviderResult`

```typescript
interface ProviderResult {
  success: boolean;
  provider: ProviderType;
  providerToken?: string;
  profile?: UserProfile;
  error?: string;
}
```

### `UserProfile`

```typescript
interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  aadhaarMasked?: string;
  digilockerDocs?: string[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  raw?: Record<string, unknown>;
}
```

### `AadhaarConfig`

```typescript
interface AadhaarConfig {
  initiateOtpUrl: string;
  verifyOtpUrl: string;
  apiKey: string;
  sandbox?: boolean;
}
```

### `AadhaarStep`

```typescript
type AadhaarStep =
  | "enter_aadhaar"
  | "consent"
  | "otp_sent"
  | "otp_verify"
  | "kyc_complete"
  | "failed";
```

### `DigiLockerConfig`

```typescript
interface DigiLockerConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  requestedDocTypes?: (
    | "aadhaar"
    | "pan"
    | "driving_license"
    | "voter_id"
    | "passport"
  )[];
}
```
