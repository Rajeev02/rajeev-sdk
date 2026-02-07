/**
 * @rajeev02/notify - In-App Inbox
 *
 * Persistent in-app notification inbox with read/unread tracking,
 * categories, and mark-all-read support.
 */

export interface InboxMessage {
  id: string;
  title: string;
  body: string;
  category?: string;
  imageUrl?: string;
  deepLink?: string;
  data?: Record<string, unknown>;
  read: boolean;
  archived: boolean;
  receivedAt: number;
  expiresAt?: number;
}

/**
 * In-App Notification Inbox
 */
export class NotificationInbox {
  private messages: Map<string, InboxMessage> = new Map();
  private maxMessages: number;
  private onChangeCallbacks: Set<() => void> = new Set();

  constructor(maxMessages: number = 100) {
    this.maxMessages = maxMessages;
  }

  /**
   * Add a message to the inbox
   */
  add(message: Omit<InboxMessage, 'read' | 'archived' | 'receivedAt'>): InboxMessage {
    const full: InboxMessage = {
      ...message,
      read: false,
      archived: false,
      receivedAt: Date.now(),
    };

    this.messages.set(message.id, full);
    this.enforceLimit();
    this.notifyChange();
    return full;
  }

  /**
   * Mark a message as read
   */
  markRead(id: string): boolean {
    const msg = this.messages.get(id);
    if (msg) {
      msg.read = true;
      this.notifyChange();
      return true;
    }
    return false;
  }

  /**
   * Mark all messages as read
   */
  markAllRead(): number {
    let count = 0;
    for (const msg of this.messages.values()) {
      if (!msg.read) {
        msg.read = true;
        count++;
      }
    }
    if (count > 0) this.notifyChange();
    return count;
  }

  /**
   * Archive a message (soft delete)
   */
  archive(id: string): boolean {
    const msg = this.messages.get(id);
    if (msg) {
      msg.archived = true;
      this.notifyChange();
      return true;
    }
    return false;
  }

  /**
   * Delete a message permanently
   */
  delete(id: string): boolean {
    const result = this.messages.delete(id);
    if (result) this.notifyChange();
    return result;
  }

  /**
   * Get all non-archived messages, newest first
   */
  getAll(category?: string): InboxMessage[] {
    const now = Date.now();
    return Array.from(this.messages.values())
      .filter(m => !m.archived)
      .filter(m => !m.expiresAt || m.expiresAt > now)
      .filter(m => !category || m.category === category)
      .sort((a, b) => b.receivedAt - a.receivedAt);
  }

  /**
   * Get unread count
   */
  getUnreadCount(category?: string): number {
    return this.getAll(category).filter(m => !m.read).length;
  }

  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const cats = new Set<string>();
    for (const msg of this.messages.values()) {
      if (msg.category) cats.add(msg.category);
    }
    return Array.from(cats);
  }

  /**
   * Subscribe to inbox changes
   */
  onChange(callback: () => void): () => void {
    this.onChangeCallbacks.add(callback);
    return () => this.onChangeCallbacks.delete(callback);
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messages.clear();
    this.notifyChange();
  }

  /**
   * Remove expired messages
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [id, msg] of this.messages) {
      if (msg.expiresAt && msg.expiresAt <= now) {
        this.messages.delete(id);
        removed++;
      }
    }
    if (removed > 0) this.notifyChange();
    return removed;
  }

  private enforceLimit(): void {
    if (this.messages.size > this.maxMessages) {
      const sorted = Array.from(this.messages.entries())
        .sort(([, a], [, b]) => a.receivedAt - b.receivedAt);
      const toRemove = sorted.slice(0, this.messages.size - this.maxMessages);
      for (const [id] of toRemove) {
        this.messages.delete(id);
      }
    }
  }

  private notifyChange(): void {
    for (const cb of this.onChangeCallbacks) {
      try { cb(); } catch (_) { /* ignore */ }
    }
  }
}
