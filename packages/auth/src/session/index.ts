/**
 * @rajeev02/auth — Session Manager
 * Handles JWT access/refresh tokens, auto-refresh, secure persistence, session expiry
 */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

export interface SessionConfig {
  onRefreshToken: (refreshToken: string) => Promise<TokenPair | null>;
  onSessionExpired: () => void;
  onPersistTokens?: (tokens: TokenPair) => Promise<void>;
  onLoadTokens?: () => Promise<TokenPair | null>;
  refreshBufferMs?: number;
}

export type AuthState =
  | "initializing"
  | "authenticated"
  | "unauthenticated"
  | "refreshing";

export class SessionManager {
  private tokens: TokenPair | null = null;
  private config: SessionConfig;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private state: AuthState = "initializing";
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor(config: SessionConfig) {
    this.config = config;
  }

  async initialize(): Promise<AuthState> {
    if (this.config.onLoadTokens) {
      try {
        const tokens = await this.config.onLoadTokens();
        if (tokens && tokens.refreshExpiresAt > Date.now()) {
          this.tokens = tokens;
          if (tokens.accessExpiresAt > Date.now()) {
            this.setState("authenticated");
            this.scheduleRefresh();
          } else {
            await this.refresh();
          }
          return this.state;
        }
      } catch (_) {
        /* persisted tokens invalid */
      }
    }
    this.setState("unauthenticated");
    return this.state;
  }

  async setTokens(tokens: TokenPair): Promise<void> {
    this.tokens = tokens;
    this.setState("authenticated");
    this.scheduleRefresh();
    if (this.config.onPersistTokens) {
      await this.config.onPersistTokens(tokens);
    }
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.tokens) return null;
    const buffer = this.config.refreshBufferMs ?? 60000;
    if (this.tokens.accessExpiresAt - Date.now() < buffer) {
      await this.refresh();
    }
    return this.tokens?.accessToken ?? null;
  }

  getState(): AuthState {
    return this.state;
  }
  isAuthenticated(): boolean {
    return this.state === "authenticated" && this.tokens !== null;
  }

  async logout(): Promise<void> {
    this.tokens = null;
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = null;
    this.setState("unauthenticated");
    if (this.config.onPersistTokens) {
      await this.config.onPersistTokens({
        accessToken: "",
        refreshToken: "",
        accessExpiresAt: 0,
        refreshExpiresAt: 0,
      });
    }
  }

  onStateChange(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  static decodeToken(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getUserFromToken(): Record<string, unknown> | null {
    if (!this.tokens) return null;
    return SessionManager.decodeToken(this.tokens.accessToken);
  }

  private async refresh(): Promise<void> {
    if (!this.tokens?.refreshToken) {
      this.setState("unauthenticated");
      this.config.onSessionExpired();
      return;
    }
    this.setState("refreshing");
    try {
      const newTokens = await this.config.onRefreshToken(
        this.tokens.refreshToken,
      );
      if (newTokens) {
        this.tokens = newTokens;
        this.setState("authenticated");
        this.scheduleRefresh();
        if (this.config.onPersistTokens) {
          await this.config.onPersistTokens(newTokens);
        }
      } else {
        this.tokens = null;
        this.setState("unauthenticated");
        this.config.onSessionExpired();
      }
    } catch {
      this.tokens = null;
      this.setState("unauthenticated");
      this.config.onSessionExpired();
    }
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (!this.tokens) return;
    const buffer = this.config.refreshBufferMs ?? 60000;
    const delay = Math.max(
      0,
      this.tokens.accessExpiresAt - Date.now() - buffer,
    );
    this.refreshTimer = setTimeout(() => this.refresh(), delay);
  }

  private setState(state: AuthState): void {
    this.state = state;
    for (const l of this.listeners) {
      try {
        l(state);
      } catch {}
    }
  }
}
