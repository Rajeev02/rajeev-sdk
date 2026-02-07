/**
 * @rajeev02/app-shell — Feature Flags & Remote Config
 * A/B testing, gradual rollout, kill switch, remote configuration
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercent?: number;
  segments?: string[];
  variant?: string;
  metadata?: Record<string, unknown>;
}

export class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private config: Map<string, unknown> = new Map();
  private userId: string = "";

  /** Load flags from server response */
  loadFlags(flags: FeatureFlag[]): void {
    for (const f of flags) this.flags.set(f.key, f);
  }

  /** Load remote config */
  loadConfig(config: Record<string, unknown>): void {
    for (const [k, v] of Object.entries(config)) this.config.set(k, v);
  }

  /** Check if feature is enabled */
  isEnabled(key: string): boolean {
    const flag = this.flags.get(key);
    if (!flag) return false;
    if (!flag.enabled) return false;
    if (flag.rolloutPercent !== undefined) {
      const hash = this.hashUser(this.userId + key);
      return hash < flag.rolloutPercent;
    }
    return true;
  }

  /** Get A/B variant */
  getVariant(key: string): string | null {
    return this.flags.get(key)?.variant ?? null;
  }

  /** Get config value */
  getConfig<T = unknown>(key: string, defaultValue: T): T {
    return (this.config.get(key) as T) ?? defaultValue;
  }

  /** Set user ID for consistent rollout */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /** Get all flags */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  private hashUser(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % 100;
  }
}
