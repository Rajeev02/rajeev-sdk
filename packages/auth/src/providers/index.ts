/**
 * @rajeev02/auth — Identity Providers
 * Abstraction layer for Aadhaar eKYC, DigiLocker, Google, Apple, Facebook login
 */

export type ProviderType =
  | "phone_otp"
  | "google"
  | "apple"
  | "facebook"
  | "aadhaar"
  | "digilocker"
  | "custom";

export interface AuthProvider {
  type: ProviderType;
  name: string;
  icon?: string;
  enabled: boolean;
}

export interface ProviderResult {
  success: boolean;
  provider: ProviderType;
  providerToken?: string;
  profile?: UserProfile;
  error?: string;
}

export interface UserProfile {
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

export type AadhaarStep =
  | "enter_aadhaar"
  | "consent"
  | "otp_sent"
  | "otp_verify"
  | "kyc_complete"
  | "failed";

export interface AadhaarConfig {
  initiateOtpUrl: string;
  verifyOtpUrl: string;
  apiKey: string;
  sandbox?: boolean;
}

export interface DigiLockerConfig {
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

/**
 * Auth Provider Registry — manages available login methods
 */
export class AuthProviderRegistry {
  private providers: Map<ProviderType, AuthProvider> = new Map();
  private callbacks: Map<
    ProviderType,
    (config?: unknown) => Promise<ProviderResult>
  > = new Map();

  register(
    provider: AuthProvider,
    handler: (config?: unknown) => Promise<ProviderResult>,
  ): void {
    this.providers.set(provider.type, provider);
    this.callbacks.set(provider.type, handler);
  }

  getAvailable(): AuthProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.enabled);
  }

  async login(type: ProviderType, config?: unknown): Promise<ProviderResult> {
    const handler = this.callbacks.get(type);
    if (!handler) {
      return {
        success: false,
        provider: type,
        error: `Provider ${type} not registered`,
      };
    }
    try {
      return await handler(config);
    } catch (e) {
      return { success: false, provider: type, error: String(e) };
    }
  }

  isAvailable(type: ProviderType): boolean {
    const p = this.providers.get(type);
    return p?.enabled ?? false;
  }

  setEnabled(type: ProviderType, enabled: boolean): void {
    const p = this.providers.get(type);
    if (p) p.enabled = enabled;
  }
}

export function getIndianAuthProviders(): AuthProvider[] {
  return [
    { type: "phone_otp", name: "Phone OTP", enabled: true },
    { type: "google", name: "Google", icon: "google", enabled: true },
    { type: "aadhaar", name: "Aadhaar eKYC", icon: "aadhaar", enabled: false },
    {
      type: "digilocker",
      name: "DigiLocker",
      icon: "digilocker",
      enabled: false,
    },
    { type: "apple", name: "Apple", icon: "apple", enabled: false },
  ];
}
