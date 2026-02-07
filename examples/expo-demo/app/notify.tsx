/**
 * Notify Demo — @rajeev02/notify
 *
 * Demonstrates notification scheduling with quiet hours, priority,
 * grouping, platform overrides, and in-app notification inbox.
 */
import React, { useState, useCallback } from "react";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
  Badge,
} from "../src/components";
import { colors } from "../src/theme";

export default function NotifyDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Schedule Notification ────────────────────────────────── */
  const demoSchedule = useCallback(() => {
    add("── Schedule Notification ──");
    add("  scheduler.schedule({");
    add('    title: "Time to meditate 🧘",');
    add('    body: "Your daily 10-minute session",');
    add('    priority: "normal",');
    add('    schedule: { at: "2026-02-07T07:00:00", repeat: "day" },');
    add('    groupId: "wellness",');
    add('  }) → "notif-001"');
    add("  Pending: 1 notification");
  }, [add]);

  /* ── Priority Levels ──────────────────────────────────────── */
  const demoPriority = useCallback(() => {
    add("── Priority Levels ──");
    add("  low:      Silent, no vibration (promotions)");
    add("  normal:   Default sound + vibration");
    add("  high:     Heads-up display, persistent");
    add("  critical: Alarm-level, bypasses DND (payments)");
    add("");
    add('  schedule({...priority: "critical"}) → bypasses quiet hours');
  }, [add]);

  /* ── Quiet Hours ──────────────────────────────────────────── */
  const demoQuietHours = useCallback(() => {
    const hour = new Date().getHours();
    const isQuiet = hour >= 22 || hour < 7;
    add("── Quiet Hours ──");
    add("  setQuietHours(22, 7, true)");
    add(`  Current hour: ${hour}:00`);
    add(`  isQuietTime() → ${isQuiet}`);
    add("");
    add("  During quiet hours:");
    add("    Normal/Low → held until 7:00 AM");
    add("    High       → held until 7:00 AM");
    add("    Critical   → delivered immediately");
  }, [add]);

  /* ── Groups ───────────────────────────────────────────────── */
  const demoGroups = useCallback(() => {
    add("── Notification Groups ──");
    add(
      '  registerGroup({ id: "social",   name: "Social",    importance: "default" })',
    );
    add(
      '  registerGroup({ id: "payments", name: "Payments",  importance: "high" })',
    );
    add(
      '  registerGroup({ id: "promo",    name: "Promotions", importance: "low", silent: true })',
    );
    add("");
    add('  schedule({...groupId: "social"})   → grouped');
    add('  cancelGroup("promo") → 3 cancelled');
  }, [add]);

  /* ── Platform Overrides ───────────────────────────────────── */
  const demoPlatform = useCallback(() => {
    add("── Platform Overrides ──");
    add("  schedule({");
    add('    title: "Payment received",');
    add("    platform: {");
    add('      android: { channelId: "payments", color: "#10B981" },');
    add('      ios:     { sound: "payment.wav", badge: 1 },');
    add('      watch:   { subtitle: "₹5,000 from Rajeev" },');
    add('      auto:    { title: "💰 Payment", tts: true },');
    add("    }");
    add("  })");
  }, [add]);

  /* ── Actions ──────────────────────────────────────────────── */
  const demoActions = useCallback(() => {
    add("── Notification Actions ──");
    add("  schedule({");
    add('    title: "Friend request from Priya",');
    add("    actions: [");
    add('      { id: "accept",  title: "Accept",  opensApp: true },');
    add('      { id: "decline", title: "Decline", destructive: true },');
    add("    ]");
    add("  })");
    add('  User taps "Accept" → app opens with action context');
  }, [add]);

  /* ── Inbox ────────────────────────────────────────────────── */
  const demoInbox = useCallback(() => {
    const count = unread + 3;
    setUnread(count);
    add("── Notification Inbox ──");
    add('  inbox.add({ title: "Order shipped", category: "orders" })');
    add('  inbox.add({ title: "New follower",  category: "social" })');
    add('  inbox.add({ title: "Flash sale!",   category: "promo" })');
    add(`  getUnreadCount() → ${count}`);
    add('  getCategories() → ["orders", "social", "promo"]');
    add('  getAll("orders") → [1 message]');
  }, [add, unread]);

  const demoInboxActions = useCallback(() => {
    add("── Inbox Actions ──");
    add('  markRead("msg-001") → true');
    add("  markAllRead() → 3 marked");
    add('  archive("msg-002") → true');
    add('  delete("msg-003")  → true');
    add("  cleanup() → 2 expired messages removed");
    setUnread(0);
  }, [add]);

  return (
    <Screen
      title="Notify"
      subtitle="Cross-platform notification scheduling with inbox, quiet hours, and platform overrides."
      onBack={onBack}
    >
      <SectionHeader title="Scheduling" />
      <Card>
        <Button title="Schedule Daily Reminder" onPress={demoSchedule} />
        <Button title="Priority Levels" onPress={demoPriority} />
        <Button title="Quiet Hours" onPress={demoQuietHours} />
      </Card>

      <SectionHeader title="Organization" />
      <Card>
        <Button title="Groups & Channels" onPress={demoGroups} />
        <Button title="Actions (Accept/Decline)" onPress={demoActions} />
        <Button title="Platform Overrides" onPress={demoPlatform} />
      </Card>

      <SectionHeader title={`Inbox (${unread} unread)`} />
      <Card>
        <Row label="Categories" value="orders, social, promo" />
        <Row label="Unread" value={String(unread)} />
        <Button title="Add 3 Messages" onPress={demoInbox} />
        <Button title="Mark All Read & Cleanup" onPress={demoInboxActions} />
      </Card>

      <Button
        title="Clear Log"
        onPress={() => setLog([])}
        variant="secondary"
      />
      <OutputLog lines={log} />
    </Screen>
  );
}
