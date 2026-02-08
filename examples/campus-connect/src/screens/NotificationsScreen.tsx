// ============================================================
// Notifications Screen — Powered by @rajeev02/notify
// Class reminders, deadline alerts, in-app inbox
// ============================================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import { NotifyService, type Notification } from "../services/sdk";

const TYPE_ICONS: Record<string, string> = {
  class: "🏫",
  deadline: "⏰",
  payment: "💰",
  event: "🎉",
  general: "📢",
};

export function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    NotifyService.getAll().then(setNotifications);
  }, []);

  const handleMarkRead = async (id: string) => {
    await NotifyService.markRead(id);
    setNotifications([...NotifyService.notifications]);
  };

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔔 Notifications</Text>
        <Text style={styles.count}>{unreadCount} new</Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
      >
        {["all", "class", "deadline", "payment", "event", "general"].map(
          (type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                filter === type && styles.filterChipActive,
              ]}
              onPress={() => setFilter(type)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === type && styles.filterTextActive,
                ]}
              >
                {type === "all"
                  ? "📋 All"
                  : `${TYPE_ICONS[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, !notif.read && styles.notifUnread]}
            onPress={() => handleMarkRead(notif.id)}
          >
            <View style={styles.notifIconWrap}>
              <Text style={styles.notifIcon}>
                {TYPE_ICONS[notif.type] || "📢"}
              </Text>
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text
                  style={[
                    styles.notifTitle,
                    !notif.read && { fontWeight: "700" },
                  ]}
                >
                  {notif.title}
                </Text>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifBody} numberOfLines={2}>
                {notif.body}
              </Text>
              <Text style={styles.notifTime}>
                {formatRelativeTime(notif.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/notify — Scheduling, quiet hours, channels, in-app inbox
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { fontSize: FontSize.md, color: Colors.primary, fontWeight: "600" },
  title: { fontSize: FontSize.lg, fontWeight: "800", color: Colors.text },
  count: { fontSize: FontSize.sm, color: Colors.secondary, fontWeight: "600" },
  filters: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  filterTextActive: { color: "#fff" },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  notifCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 8,
    ...Shadow.sm,
  },
  notifUnread: {
    backgroundColor: "#f8f8ff",
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  notifIcon: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifTitle: { fontSize: FontSize.md, color: Colors.text, flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notifBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  notifTime: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 6 },
  sdkFooter: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: "#f0f0ff",
    borderRadius: BorderRadius.sm,
  },
  sdkText: {
    fontSize: 10,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 16,
  },
});
