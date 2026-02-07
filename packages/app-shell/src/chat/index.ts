/**
 * @rajeev02/app-shell — Chat Module
 * Real-time messaging with offline queue, typing indicators, media messages, read receipts
 */

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "location"
  | "contact"
  | "sticker";
export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaSizeBytes?: number;
  replyTo?: string;
  forwardedFrom?: string;
  status: MessageStatus;
  timestamp: number;
  editedAt?: number;
  deletedAt?: number;
  reactions?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: "direct" | "group" | "channel" | "support";
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  muted: boolean;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

/**
 * Chat Engine — manages rooms, messages, offline queue
 */
export class ChatEngine {
  private rooms: Map<string, ChatRoom> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private offlineQueue: ChatMessage[] = [];
  private typingUsers: Map<string, Set<string>> = new Map();
  private listeners: Map<string, Set<(event: ChatEvent) => void>> = new Map();
  private currentUserId: string;

  constructor(userId: string) {
    this.currentUserId = userId;
  }

  /** Send a text message */
  sendMessage(
    roomId: string,
    content: string,
    type: MessageType = "text",
    replyTo?: string,
  ): ChatMessage {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      senderId: this.currentUserId,
      type,
      content,
      status: "sending",
      timestamp: Date.now(),
      replyTo,
    };
    this.addMessage(roomId, message);
    this.offlineQueue.push(message);
    this.emit(roomId, { type: "message_sent", message });
    return message;
  }

  /** Receive a message (from server/websocket) */
  receiveMessage(message: ChatMessage): void {
    this.addMessage(message.roomId, message);
    this.updateRoom(message.roomId, { lastMessage: message });
    this.emit(message.roomId, { type: "message_received", message });
  }

  /** Mark a message as delivered/read */
  updateMessageStatus(
    messageId: string,
    roomId: string,
    status: MessageStatus,
  ): void {
    const messages = this.messages.get(roomId);
    const msg = messages?.find((m) => m.id === messageId);
    if (msg) {
      msg.status = status;
      this.emit(roomId, { type: "status_update", messageId, status });
    }
  }

  /** Mark all messages in room as read */
  markRoomAsRead(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.unreadCount = 0;
    }
    this.emit(roomId, { type: "room_read", roomId });
  }

  /** Delete a message (soft delete) */
  deleteMessage(messageId: string, roomId: string): void {
    const messages = this.messages.get(roomId);
    const msg = messages?.find((m) => m.id === messageId);
    if (msg) {
      msg.deletedAt = Date.now();
      msg.content = "";
    }
    this.emit(roomId, { type: "message_deleted", messageId });
  }

  /** Add reaction */
  addReaction(messageId: string, roomId: string, emoji: string): void {
    const messages = this.messages.get(roomId);
    const msg = messages?.find((m) => m.id === messageId);
    if (msg) {
      if (!msg.reactions) msg.reactions = {};
      if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
      if (!msg.reactions[emoji].includes(this.currentUserId)) {
        msg.reactions[emoji].push(this.currentUserId);
      }
    }
  }

  /** Set typing indicator */
  setTyping(roomId: string, isTyping: boolean): void {
    this.emit(roomId, { type: "typing", userId: this.currentUserId, isTyping });
  }

  /** Handle remote typing indicator */
  onRemoteTyping(roomId: string, userId: string, isTyping: boolean): void {
    if (!this.typingUsers.has(roomId)) this.typingUsers.set(roomId, new Set());
    const users = this.typingUsers.get(roomId)!;
    if (isTyping) users.add(userId);
    else users.delete(userId);
    this.emit(roomId, { type: "typing", userId, isTyping });
  }

  /** Get typing users in a room */
  getTypingUsers(roomId: string): string[] {
    return Array.from(this.typingUsers.get(roomId) ?? []);
  }

  /** Get messages for a room */
  getMessages(
    roomId: string,
    limit: number = 50,
    before?: number,
  ): ChatMessage[] {
    const all = this.messages.get(roomId) ?? [];
    let filtered = before ? all.filter((m) => m.timestamp < before) : all;
    return filtered.slice(-limit);
  }

  /** Get all rooms sorted by last activity */
  getRooms(): ChatRoom[] {
    return Array.from(this.rooms.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  }

  /** Get total unread count */
  getTotalUnread(): number {
    return Array.from(this.rooms.values()).reduce(
      (sum, r) => sum + r.unreadCount,
      0,
    );
  }

  /** Get offline queue for syncing */
  getOfflineQueue(): ChatMessage[] {
    return [...this.offlineQueue];
  }

  /** Clear offline queue after successful sync */
  clearOfflineQueue(): void {
    this.offlineQueue = [];
  }

  /** Search messages across rooms */
  search(query: string, limit: number = 20): ChatMessage[] {
    const results: ChatMessage[] = [];
    const lower = query.toLowerCase();
    for (const messages of this.messages.values()) {
      for (const msg of messages) {
        if (msg.content.toLowerCase().includes(lower) && !msg.deletedAt) {
          results.push(msg);
          if (results.length >= limit) return results;
        }
      }
    }
    return results;
  }

  /** Subscribe to room events */
  onRoomEvent(
    roomId: string,
    listener: (event: ChatEvent) => void,
  ): () => void {
    if (!this.listeners.has(roomId)) this.listeners.set(roomId, new Set());
    this.listeners.get(roomId)!.add(listener);
    return () => this.listeners.get(roomId)?.delete(listener);
  }

  private addMessage(roomId: string, message: ChatMessage): void {
    if (!this.messages.has(roomId)) this.messages.set(roomId, []);
    this.messages.get(roomId)!.push(message);
  }

  private updateRoom(roomId: string, updates: Partial<ChatRoom>): void {
    const room = this.rooms.get(roomId);
    if (room) Object.assign(room, updates, { updatedAt: Date.now() });
  }

  private emit(roomId: string, event: ChatEvent): void {
    const listeners = this.listeners.get(roomId);
    if (listeners)
      for (const l of listeners) {
        try {
          l(event);
        } catch {}
      }
  }
}

export type ChatEvent =
  | { type: "message_sent"; message: ChatMessage }
  | { type: "message_received"; message: ChatMessage }
  | { type: "message_deleted"; messageId: string }
  | { type: "status_update"; messageId: string; status: MessageStatus }
  | { type: "typing"; userId: string; isTyping: boolean }
  | { type: "room_read"; roomId: string };
