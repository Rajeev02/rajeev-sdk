/**
 * @rajeev02/notify - Notification Scheduler
 *
 * Schedule, group, deduplicate, and manage notifications across platforms.
 */

export interface NotificationConfig {
  /** Unique notification ID */
  id: string;
  /** Notification title */
  title: string;
  /** Notification body text */
  body: string;
  /** Optional subtitle (iOS) */
  subtitle?: string;
  /** Group/channel ID for grouping */
  groupId?: string;
  /** Priority: 'low' | 'normal' | 'high' | 'critical' */
  priority?: 'low' | 'normal' | 'high' | 'critical';
  /** Optional data payload (JSON) */
  data?: Record<string, unknown>;
  /** Action buttons */
  actions?: NotificationAction[];
  /** Schedule for future delivery */
  schedule?: ScheduleConfig;
  /** Platform-specific overrides */
  platform?: PlatformOverrides;
}

export interface NotificationAction {
  id: string;
  title: string;
  /** Whether tapping opens the app */
  opensApp?: boolean;
  /** Whether this is a destructive action (shown in red) */
  destructive?: boolean;
}

export interface ScheduleConfig {
  /** Deliver at specific timestamp (ISO string) */
  at?: string;
  /** Deliver after delay in milliseconds */
  afterMs?: number;
  /** Repeat interval: 'minute' | 'hour' | 'day' | 'week' */
  repeat?: 'minute' | 'hour' | 'day' | 'week';
  /** Allow delivery during quiet hours (default: false) */
  ignoreQuietHours?: boolean;
}

export interface PlatformOverrides {
  android?: {
    channelId?: string;
    smallIcon?: string;
    color?: string;
    ongoing?: boolean;
    autoCancel?: boolean;
  };
  ios?: {
    sound?: string;
    badge?: number;
    categoryId?: string;
    threadId?: string;
  };
  watch?: {
    /** Compact format for watch display */
    shortTitle?: string;
    shortBody?: string;
  };
  auto?: {
    /** TTS-friendly text for Android Auto */
    ttsText?: string;
  };
}

export interface NotificationGroup {
  id: string;
  name: string;
  description?: string;
  /** Default importance: 'min' | 'low' | 'default' | 'high' | 'max' */
  importance?: string;
  /** Whether notifications in this group should be silent */
  silent?: boolean;
}

/** Scheduled notification record */
interface ScheduledNotification {
  config: NotificationConfig;
  scheduledAt: number;
  deliverAt: number;
  delivered: boolean;
  cancelled: boolean;
}

/**
 * Notification Scheduler
 *
 * Manages local notification scheduling with deduplication,
 * grouping, and quiet hours support.
 */
export class NotificationScheduler {
  private scheduled: Map<string, ScheduledNotification> = new Map();
  private groups: Map<string, NotificationGroup> = new Map();
  private quietHoursStart: number = 22; // 10 PM
  private quietHoursEnd: number = 7;    // 7 AM
  private quietHoursEnabled: boolean = false;

  /**
   * Schedule a notification
   */
  schedule(config: NotificationConfig): string {
    const now = Date.now();
    let deliverAt = now;

    if (config.schedule?.at) {
      deliverAt = new Date(config.schedule.at).getTime();
    } else if (config.schedule?.afterMs) {
      deliverAt = now + config.schedule.afterMs;
    }

    // Dedup: cancel existing notification with same ID
    this.cancel(config.id);

    const record: ScheduledNotification = {
      config,
      scheduledAt: now,
      deliverAt,
      delivered: false,
      cancelled: false,
    };

    this.scheduled.set(config.id, record);
    return config.id;
  }

  /**
   * Cancel a scheduled notification
   */
  cancel(id: string): boolean {
    const record = this.scheduled.get(id);
    if (record && !record.delivered) {
      record.cancelled = true;
      this.scheduled.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Cancel all notifications in a group
   */
  cancelGroup(groupId: string): number {
    let count = 0;
    for (const [id, record] of this.scheduled) {
      if (record.config.groupId === groupId && !record.delivered) {
        record.cancelled = true;
        this.scheduled.delete(id);
        count++;
      }
    }
    return count;
  }

  /**
   * Cancel all pending notifications
   */
  cancelAll(): number {
    const count = this.scheduled.size;
    this.scheduled.clear();
    return count;
  }

  /**
   * Register a notification group/channel
   */
  registerGroup(group: NotificationGroup): void {
    this.groups.set(group.id, group);
  }

  /**
   * Configure quiet hours
   */
  setQuietHours(startHour: number, endHour: number, enabled: boolean): void {
    this.quietHoursStart = startHour;
    this.quietHoursEnd = endHour;
    this.quietHoursEnabled = enabled;
  }

  /**
   * Check if current time is in quiet hours
   */
  isQuietTime(): boolean {
    if (!this.quietHoursEnabled) return false;
    const hour = new Date().getHours();
    if (this.quietHoursStart > this.quietHoursEnd) {
      // Wraps midnight (e.g., 22-07)
      return hour >= this.quietHoursStart || hour < this.quietHoursEnd;
    }
    return hour >= this.quietHoursStart && hour < this.quietHoursEnd;
  }

  /**
   * Get all pending (undelivered) notifications
   */
  getPending(): NotificationConfig[] {
    return Array.from(this.scheduled.values())
      .filter(r => !r.delivered && !r.cancelled)
      .sort((a, b) => a.deliverAt - b.deliverAt)
      .map(r => r.config);
  }

  /**
   * Get count of pending notifications
   */
  getPendingCount(): number {
    return this.getPending().length;
  }

  /**
   * Get notifications ready to deliver now
   */
  getReadyToDeliver(): NotificationConfig[] {
    const now = Date.now();
    return Array.from(this.scheduled.values())
      .filter(r => !r.delivered && !r.cancelled && r.deliverAt <= now)
      .filter(r => {
        if (this.isQuietTime() && !r.config.schedule?.ignoreQuietHours) {
          return r.config.priority === 'critical';
        }
        return true;
      })
      .map(r => {
        r.delivered = true;
        return r.config;
      });
  }
}
