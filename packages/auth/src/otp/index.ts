/**
 * @rajeev02/auth — OTP Authentication
 * Phone/email OTP flow with rate limiting, cooldown timer, auto-read
 */

export interface OtpConfig {
  onSendOtp: (
    destination: string,
    method: "sms" | "email" | "whatsapp",
  ) => Promise<{ requestId: string; expiresInSeconds: number }>;
  onVerifyOtp: (
    requestId: string,
    otp: string,
  ) => Promise<{
    success: boolean;
    tokens?: {
      accessToken: string;
      refreshToken: string;
      accessExpiresAt: number;
      refreshExpiresAt: number;
    };
  }>;
  otpLength?: number;
  resendCooldownSeconds?: number;
  maxAttempts?: number;
  lockoutSeconds?: number;
}

export type OtpState =
  | "idle"
  | "sending"
  | "waiting_for_otp"
  | "verifying"
  | "verified"
  | "failed"
  | "locked";

export class OtpManager {
  private config: OtpConfig;
  private state: OtpState = "idle";
  private requestId: string | null = null;
  private attempts: number = 0;
  private resendCooldownEnd: number = 0;
  private lockoutEnd: number = 0;
  private expiresAt: number = 0;
  private listeners: Set<(state: OtpState) => void> = new Set();

  constructor(config: OtpConfig) {
    this.config = config;
  }

  async sendOtp(
    destination: string,
    method: "sms" | "email" | "whatsapp" = "sms",
  ): Promise<boolean> {
    if (this.isLocked()) {
      this.setState("locked");
      return false;
    }
    if (this.isInCooldown()) return false;

    this.setState("sending");
    try {
      const result = await this.config.onSendOtp(destination, method);
      this.requestId = result.requestId;
      this.expiresAt = Date.now() + result.expiresInSeconds * 1000;
      this.resendCooldownEnd =
        Date.now() + (this.config.resendCooldownSeconds ?? 30) * 1000;
      this.setState("waiting_for_otp");
      return true;
    } catch {
      this.setState("failed");
      return false;
    }
  }

  async verifyOtp(
    otp: string,
  ): Promise<{ success: boolean; tokens?: unknown }> {
    if (!this.requestId || this.isLocked()) return { success: false };
    if (this.isExpired()) {
      this.setState("failed");
      return { success: false };
    }

    this.setState("verifying");
    this.attempts++;

    const maxAttempts = this.config.maxAttempts ?? 5;
    if (this.attempts >= maxAttempts) {
      this.lockoutEnd = Date.now() + (this.config.lockoutSeconds ?? 300) * 1000;
      this.setState("locked");
      return { success: false };
    }

    try {
      const result = await this.config.onVerifyOtp(this.requestId, otp);
      if (result.success) {
        this.setState("verified");
        this.reset();
        return { success: true, tokens: result.tokens };
      } else {
        this.setState("waiting_for_otp");
        return { success: false };
      }
    } catch {
      this.setState("failed");
      return { success: false };
    }
  }

  async resendOtp(
    destination: string,
    method: "sms" | "email" | "whatsapp" = "sms",
  ): Promise<boolean> {
    return this.sendOtp(destination, method);
  }

  getResendCooldownSeconds(): number {
    return Math.max(0, Math.ceil((this.resendCooldownEnd - Date.now()) / 1000));
  }

  getExpirySeconds(): number {
    return Math.max(0, Math.ceil((this.expiresAt - Date.now()) / 1000));
  }

  isLocked(): boolean {
    return this.lockoutEnd > Date.now();
  }
  isExpired(): boolean {
    return this.expiresAt > 0 && this.expiresAt < Date.now();
  }
  isInCooldown(): boolean {
    return this.resendCooldownEnd > Date.now();
  }
  getState(): OtpState {
    return this.state;
  }
  getAttempts(): number {
    return this.attempts;
  }

  onStateChange(listener: (state: OtpState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(state: OtpState): void {
    this.state = state;
    for (const l of this.listeners) {
      try {
        l(state);
      } catch {}
    }
  }

  private reset(): void {
    this.attempts = 0;
    this.requestId = null;
    this.expiresAt = 0;
  }
}
