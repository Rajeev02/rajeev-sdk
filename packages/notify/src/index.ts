/**
 * @rajeev02/notify
 *
 * Unified Notification & Messaging Layer
 * Cross-platform: Android, iOS, Web, Watch, Auto
 *
 * @author Rajeev Kumar Joshi (https://github.com/Rajeev02)
 * @license MIT
 */

export { NotificationScheduler } from './scheduler';
export type {
  NotificationConfig,
  NotificationAction,
  ScheduleConfig,
  PlatformOverrides,
  NotificationGroup,
} from './scheduler';

export { NotificationInbox } from './inbox';
export type { InboxMessage } from './inbox';
