// ============================================================
// Profile & Settings Screen — Powered by @rajeev02/auth + vault + locale + ui
// Language toggle, theme switch, biometric settings, logout
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import {
  AuthService,
  VaultService,
  LocaleService,
  UIService,
  AppShellService,
  NetworkService,
  SyncService,
} from "../services/sdk";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const student = AuthService.currentUser;
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [hindi, setHindi] = useState(LocaleService.currentLocale === "hi");
  const [offlineMode, setOfflineMode] = useState(false);

  const toggleLanguage = () => {
    LocaleService.toggleLocale();
    setHindi(!hindi);
    Alert.alert(
      hindi ? "Language Changed" : "भाषा बदली गई",
      hindi ? "Switched to English" : "हिंदी में बदला गया\n\n@rajeev02/locale",
    );
  };

  const toggleDarkMode = () => {
    UIService.toggleTheme();
    setDarkMode(!darkMode);
  };

  const toggleOffline = () => {
    NetworkService.isOnline = offlineMode;
    NetworkService.connectionType = offlineMode ? "wifi" : "offline";
    SyncService.syncStatus = offlineMode ? "synced" : "offline";
    setOfflineMode(!offlineMode);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 {LocaleService.t("profile")}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Student Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{student?.avatar || "👨‍🎓"}</Text>
          </View>
          <Text style={styles.studentName}>{student?.name}</Text>
          <Text style={styles.studentEmail}>{student?.email}</Text>
          <View style={styles.infoRow}>
            <InfoChip icon="🏛" label={student?.department || ""} />
            <InfoChip
              icon="📋"
              label={`${LocaleService.t("rollNo")}: ${student?.rollNo}`}
            />
            <InfoChip
              icon="📚"
              label={`${LocaleService.t("semester")} ${student?.semester}`}
            />
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>{LocaleService.t("settings")}</Text>

        <View style={styles.settingsGroup}>
          <SettingRow
            icon="🌐"
            label={LocaleService.t("language")}
            subtitle={hindi ? "हिंदी" : "English"}
            sdk="@rajeev02/locale"
            toggle={hindi}
            onToggle={toggleLanguage}
          />
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            subtitle={darkMode ? "On" : "Off"}
            sdk="@rajeev02/ui"
            toggle={darkMode}
            onToggle={toggleDarkMode}
          />
          <SettingRow
            icon="🔐"
            label="Biometric Lock"
            subtitle="Face ID / Touch ID"
            sdk="@rajeev02/auth"
            toggle={biometric}
            onToggle={() => setBiometric(!biometric)}
          />
          <SettingRow
            icon="📡"
            label="Offline Mode"
            subtitle={offlineMode ? "Using cached data" : "Connected"}
            sdk="@rajeev02/network"
            toggle={offlineMode}
            onToggle={toggleOffline}
          />
        </View>

        {/* Feature Flags */}
        <Text style={styles.sectionTitle}>Feature Flags</Text>
        <View style={styles.settingsGroup}>
          {Object.entries(AppShellService.featureFlags).map(([key, value]) => (
            <View key={key} style={styles.flagRow}>
              <View style={styles.flagInfo}>
                <Text style={styles.flagName}>{key}</Text>
                <Text style={styles.flagSdk}>@rajeev02/app-shell</Text>
              </View>
              <View
                style={[
                  styles.flagBadge,
                  { backgroundColor: value ? "#e8f5e9" : "#ffebee" },
                ]}
              >
                <Text
                  style={[
                    styles.flagValue,
                    { color: value ? Colors.success : Colors.error },
                  ]}
                >
                  {value ? "ON" : "OFF"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Device Info */}
        <Text style={styles.sectionTitle}>Device Info</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceLabel}>Platform</Text>
            <Text style={styles.deviceValue}>
              {UIService.getDeviceInfo().platform}
            </Text>
          </View>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceLabel}>Device Type</Text>
            <Text style={styles.deviceValue}>
              {UIService.getDeviceInfo().type}
            </Text>
          </View>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceLabel}>Network</Text>
            <Text style={styles.deviceValue}>
              {NetworkService.connectionType} · {NetworkService.signalStrength}
            </Text>
          </View>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceLabel}>Sync Status</Text>
            <Text style={styles.deviceValue}>{SyncService.syncStatus}</Text>
          </View>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceLabel}>Last Synced</Text>
            <Text style={styles.deviceValue}>
              {SyncService.lastSynced.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* SDK Versions */}
        <Text style={styles.sectionTitle}>Rajeev SDK Libraries</Text>
        <View style={styles.settingsGroup}>
          {[
            "vault",
            "network",
            "sync",
            "locale",
            "notify",
            "ui",
            "auth",
            "payments",
            "camera",
            "deeplink",
            "document",
            "edge-ai",
            "media",
            "video-editor",
            "app-shell",
          ].map((pkg) => (
            <View key={pkg} style={styles.pkgRow}>
              <Text style={styles.pkgName}>@rajeev02/{pkg}</Text>
              <Text style={styles.pkgVersion}>v0.2.1</Text>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() =>
            Alert.alert(
              LocaleService.t("logout"),
              "Sign out and clear session?\n\nSession via @rajeev02/auth\nTokens via @rajeev02/vault",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: LocaleService.t("logout"),
                  style: "destructive",
                  onPress: () => AuthService.signOut(),
                },
              ],
            )
          }
        >
          <Text style={styles.logoutText}>🚪 {LocaleService.t("logout")}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.infoChip}>
      <Text style={{ fontSize: 12 }}>{icon}</Text>
      <Text style={styles.infoChipText}>{label}</Text>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  subtitle,
  sdk,
  toggle,
  onToggle,
}: {
  icon: string;
  label: string;
  subtitle: string;
  sdk: string;
  toggle: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
        <Text style={styles.settingSdk}>{sdk}</Text>
      </View>
      <Switch
        value={toggle}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primaryLight }}
        thumbColor={toggle ? Colors.primary : "#f4f3f4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.text },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  profileCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginTop: Spacing.lg,
    ...Shadow.md,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatar: { fontSize: 44 },
  studentName: { color: "#fff", fontSize: FontSize.xl, fontWeight: "700" },
  studentEmail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  infoRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  infoChipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: FontSize.xs,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: { fontSize: 22 },
  settingInfo: { flex: 1 },
  settingLabel: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingSdk: { fontSize: 9, color: Colors.textLight, marginTop: 2 },
  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  flagInfo: {},
  flagName: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.text,
    fontFamily: "monospace",
  },
  flagSdk: { fontSize: 9, color: Colors.textLight, marginTop: 2 },
  flagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  flagValue: { fontSize: FontSize.xs, fontWeight: "700" },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  deviceLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  deviceValue: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.text },
  pkgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pkgName: {
    fontSize: FontSize.xs,
    fontWeight: "500",
    color: Colors.text,
    fontFamily: "monospace",
  },
  pkgVersion: { fontSize: FontSize.xs, color: Colors.textLight },
  logoutBtn: {
    backgroundColor: "#ffebee",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  logoutText: { fontSize: FontSize.md, fontWeight: "600", color: Colors.error },
});
