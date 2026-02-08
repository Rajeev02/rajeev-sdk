/**
 * @rajeev02/auth
 * Universal Auth & Identity SDK
 * OTP, biometric, Aadhaar/DigiLocker, session management, social login
 *
 * @author Rajeev Kumar Joshi
 * @license MIT
 */
export { SessionManager } from "./session";
export type { TokenPair, SessionConfig, AuthState } from "./session";

export { OtpManager } from "./otp";
export type { OtpConfig, OtpState } from "./otp";

export { AuthProviderRegistry, getIndianAuthProviders } from "./providers";
export type {
  ProviderType,
  AuthProvider,
  ProviderResult,
  UserProfile,
  AadhaarConfig,
  DigiLockerConfig,
  AadhaarStep,
} from "./providers";
