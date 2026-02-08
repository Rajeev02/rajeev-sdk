// ============================================================
// Dashboard Screen — Powered by @rajeev02/ui + network + locale
// Today's schedule, quick actions, upcoming deadlines
// ============================================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import {
  AuthService,
  NetworkService,
  LocaleService,
  NotifyService,
  MOCK_TIMETABLE,
  AppShellService,
  type TimetableEntry,
} from "../services/sdk";

export function DashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const student = AuthService.currentUser;
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayName = dayNames[today.getDay()];
  const todayClasses = MOCK_TIMETABLE.filter((c) => c.day === todayName);

  useEffect(() => {
    AppShellService.analytics.screen("Dashboard");
    NotifyService.getAll().then(() =>
      setUnreadCount(NotifyService.unreadCount),
    );
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await NetworkService.checkConnectivity();
    await NotifyService.getAll();
    setUnreadCount(NotifyService.unreadCount);
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return LocaleService.t("goodMorning");
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.studentName}>{student?.name || "Student"}</Text>
          <Text style={styles.semester}>
            {student?.department} · Sem {student?.semester}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Network Status */}
        <View style={styles.networkBar}>
          <Text style={styles.networkDot}>●</Text>
          <Text style={styles.networkText}>
            {NetworkService.connectionType.toUpperCase()} ·{" "}
            {NetworkService.signalStrength}
          </Text>
          <Text style={styles.networkSdk}>@rajeev02/network</Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { icon: "📋", label: "Timetable", screen: "Academics" },
            { icon: "📝", label: "Notes", screen: "Academics" },
            { icon: "💳", label: "Pay Fees", screen: "Fees" },
            { icon: "🪪", label: "ID Card", screen: "Campus" },
            { icon: "🎬", label: "Lectures", screen: "Academics" },
            { icon: "🎉", label: "Events", screen: "Campus" },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickAction}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={styles.quickActionIcon}>
                <Text style={{ fontSize: 24 }}>{action.icon}</Text>
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Classes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {LocaleService.t("todayClasses")}
          </Text>
          <Text style={styles.dayBadge}>
            {todayName}, {LocaleService.formatDate(today)}
          </Text>
        </View>

        {todayClasses.length > 0 ? (
          todayClasses.map((cls) => <ClassCard key={cls.id} entry={cls} />)
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>No classes today!</Text>
          </View>
        )}

        {/* Upcoming Deadlines */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
          {LocaleService.t("upcomingDeadlines")}
        </Text>
        <View style={styles.deadlineCard}>
          <View
            style={[styles.deadlineDot, { backgroundColor: Colors.error }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.deadlineTitle}>
              DS Assignment — BST Operations
            </Text>
            <Text style={styles.deadlineDate}>Due: Tomorrow, 11:59 PM</Text>
          </View>
          <Text style={styles.deadlineUrgent}>⏰</Text>
        </View>
        <View style={styles.deadlineCard}>
          <View
            style={[styles.deadlineDot, { backgroundColor: Colors.warning }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.deadlineTitle}>OS Lab Report — Scheduling</Text>
            <Text style={styles.deadlineDate}>Due: Feb 12, 2026</Text>
          </View>
        </View>
        <View style={styles.deadlineCard}>
          <View
            style={[styles.deadlineDot, { backgroundColor: Colors.info }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.deadlineTitle}>DBMS Project Proposal</Text>
            <Text style={styles.deadlineDate}>Due: Feb 18, 2026</Text>
          </View>
        </View>

        {/* SDK Footer */}
        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            This screen uses: @rajeev02/ui · @rajeev02/network ·
            @rajeev02/locale · @rajeev02/notify · @rajeev02/app-shell
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function ClassCard({ entry }: { entry: TimetableEntry }) {
  return (
    <View style={styles.classCard}>
      <View style={[styles.classStripe, { backgroundColor: entry.color }]} />
      <View style={styles.classTime}>
        <Text style={styles.classTimeText}>{entry.startTime}</Text>
        <Text style={styles.classTimeDash}>|</Text>
        <Text style={styles.classTimeText}>{entry.endTime}</Text>
      </View>
      <View style={styles.classInfo}>
        <Text style={styles.className}>{entry.subject}</Text>
        <Text style={styles.classDetails}>
          {entry.code} · {entry.professor} · {entry.room}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    paddingBottom: 20,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerLeft: { flex: 1 },
  greeting: { color: "rgba(255,255,255,0.8)", fontSize: FontSize.md },
  studentName: {
    color: "#fff",
    fontSize: FontSize.xl,
    fontWeight: "800",
    marginTop: 4,
  },
  semester: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  notifBtn: { padding: 8 },
  notifIcon: { fontSize: 24 },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  networkBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e8f5e9",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: Spacing.md,
  },
  networkDot: { color: Colors.success, fontSize: 10 },
  networkText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: "600",
    flex: 1,
  },
  networkSdk: { fontSize: 9, color: Colors.textLight },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayBadge: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
    backgroundColor: "#e8eaf6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    width: "30%",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.text,
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 8,
    ...Shadow.sm,
  },
  classStripe: { width: 4, height: 40, borderRadius: 2 },
  classTime: { alignItems: "center", width: 50 },
  classTimeText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.text,
  },
  classTimeDash: { fontSize: 8, color: Colors.textLight },
  classInfo: { flex: 1 },
  className: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  classDetails: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadow.sm,
  },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  deadlineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 8,
    ...Shadow.sm,
  },
  deadlineDot: { width: 10, height: 10, borderRadius: 5 },
  deadlineTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },
  deadlineDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deadlineUrgent: { fontSize: 20 },
  sdkFooter: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: "#f0f0ff",
    borderRadius: BorderRadius.sm,
  },
  sdkText: { fontSize: 10, color: Colors.textLight, textAlign: "center" },
});
