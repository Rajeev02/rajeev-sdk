/**
 * @rajeev02/app-shell — Analytics Pipeline
 * Event tracking, user properties, funnel analysis, offline buffer
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}

export interface AnalyticsConfig {
  /** Flush events to server handler */
  onFlush: (events: AnalyticsEvent[]) => Promise<void>;
  /** Flush interval in ms (default: 30000) */
  flushIntervalMs?: number;
  /** Max batch size (default: 50) */
  maxBatchSize?: number;
  /** Whether to track automatically (screen views, etc.) */
  autoTrack?: boolean;
}

export class AnalyticsEngine {
  private config: AnalyticsConfig;
  private buffer: AnalyticsEvent[] = [];
  private userProperties: Record<string, unknown> = {};
  private sessionId: string;
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: AnalyticsConfig) {
    this.config = {
      flushIntervalMs: 30000,
      maxBatchSize: 50,
      autoTrack: true,
      ...config,
    };
    this.sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.startFlushTimer();
  }

  /** Track an event */
  track(name: string, properties?: Record<string, unknown>): void {
    this.buffer.push({
      name,
      properties: { ...this.userProperties, ...properties },
      timestamp: Date.now(),
      sessionId: this.sessionId,
    });
    if (this.buffer.length >= (this.config.maxBatchSize ?? 50)) this.flush();
  }

  /** Set user properties (included in all future events) */
  setUserProperties(props: Record<string, unknown>): void {
    Object.assign(this.userProperties, props);
  }

  /** Track screen view */
  trackScreen(screenName: string, properties?: Record<string, unknown>): void {
    this.track("screen_view", { screen_name: screenName, ...properties });
  }

  /** Flush events to server */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    const batch = [...this.buffer];
    this.buffer = [];
    try {
      await this.config.onFlush(batch);
    } catch {
      this.buffer = [...batch, ...this.buffer];
    }
  }

  /** Get buffer size */
  getBufferSize(): number {
    return this.buffer.length;
  }

  /** Destroy — flush and stop timer */
  async destroy(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    await this.flush();
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(
      () => this.flush(),
      this.config.flushIntervalMs ?? 30000,
    );
  }
}
