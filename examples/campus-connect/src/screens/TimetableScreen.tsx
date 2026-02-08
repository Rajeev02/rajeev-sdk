// ============================================================
// Timetable Screen — Powered by @rajeev02/sync + network
// Weekly class schedule with offline sync
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import {
  MOCK_TIMETABLE,
  SyncService,
  type TimetableEntry,
} from "../services/sdk";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function TimetableScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(
    DAYS[Math.min(new Date().getDay() - 1, 4)] || "Mon",
  );

  const dayClasses = MOCK_TIMETABLE.filter((c) => c.day === selectedDay);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Timetable</Text>
        <View style={styles.syncRow}>
          <View
            style={[
              styles.syncDot,
              {
                backgroundColor:
                  SyncService.syncStatus === "synced"
                    ? Colors.success
                    : Colors.warning,
              },
            ]}
          />
          <Text style={styles.syncText}>
            {SyncService.syncStatus === "synced" ? "Synced" : "Syncing..."}
          </Text>
        </View>
      </View>

      {/* Day Tabs */}
      <View style={styles.dayTabs}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayTab, selectedDay === day && styles.dayTabActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayTabText,
                selectedDay === day && styles.dayTabTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation to Notes / Lectures */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("Notes")}
        >
          <Text style={styles.navBtnIcon}>📝</Text>
          <Text style={styles.navBtnText}>Smart Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("Lectures")}
        >
          <Text style={styles.navBtnIcon}>🎬</Text>
          <Text style={styles.navBtnText}>Lectures</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("VideoStudio")}
        >
          <Text style={styles.navBtnIcon}>🎥</Text>
          <Text style={styles.navBtnText}>Video Studio</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Timeline */}
        {dayClasses.length > 0 ? (
          dayClasses.map((cls, index) => (
            <View key={cls.id} style={styles.timelineItem}>
              {/* Time Column */}
              <View style={styles.timeCol}>
                <Text style={styles.timeStart}>{cls.startTime}</Text>
                <View style={styles.timeLine} />
                <Text style={styles.timeEnd}>{cls.endTime}</Text>
              </View>

              {/* Class Card */}
              <View style={[styles.classCard, { borderLeftColor: cls.color }]}>
                <Text style={styles.classSubject}>{cls.subject}</Text>
                <Text style={styles.classCode}>{cls.code}</Text>
                <View style={styles.classInfoRow}>
                  <Text style={styles.classInfoItem}>👨‍🏫 {cls.professor}</Text>
                  <Text style={styles.classInfoItem}>📍 {cls.room}</Text>
                </View>
                <View style={styles.classActions}>
                  <TouchableOpacity style={styles.classAction}>
                    <Text style={styles.classActionText}>📝 Take Notes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.classAction}>
                    <Text style={styles.classActionText}>📸 Scan QR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>😴</Text>
            <Text style={styles.emptyTitle}>No Classes</Text>
            <Text style={styles.emptySubtitle}>Enjoy your day off!</Text>
          </View>
        )}

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/sync — CRDT timetable sync across devices{"\n"}
            @rajeev02/network — Offline caching for no-connectivity areas
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
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
  title: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.text },
  syncRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  syncDot: { width: 8, height: 8, borderRadius: 4 },
  syncText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  dayTabs: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  dayTabActive: { backgroundColor: Colors.primary },
  dayTabText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  dayTabTextActive: { color: "#fff" },
  navRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  navBtnIcon: { fontSize: 16 },
  navBtnText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.text },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  timelineItem: { flexDirection: "row", gap: 16, marginBottom: 16 },
  timeCol: { width: 50, alignItems: "center" },
  timeStart: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.text },
  timeLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  timeEnd: {
    fontSize: FontSize.xs,
    fontWeight: "500",
    color: Colors.textLight,
  },
  classCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    ...Shadow.sm,
  },
  classSubject: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
  },
  classCode: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  classInfoRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  classInfoItem: { fontSize: FontSize.xs, color: Colors.textSecondary },
  classActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  classAction: {
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  classActionText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.text },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sdkFooter: {
    marginTop: Spacing.xl,
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
