/**
 * Reusable UI components for demo screens
 */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { colors, spacing, borderRadius, fontSize } from "./theme";

/* ── Screen wrapper ─────────────────────────────────────────── */

export function Screen({
  title,
  subtitle,
  children,
  onBack,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
        {children}
      </ScrollView>
    </View>
  );
}

/* ── Card ───────────────────────────────────────────────────── */

export function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
}

/* ── Button ─────────────────────────────────────────────────── */

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const bg =
    variant === "danger"
      ? colors.error
      : variant === "secondary"
        ? colors.borderLight
        : colors.primary;
  const fg = variant === "secondary" ? colors.text : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </TouchableOpacity>
  );
}

/* ── Output Log ─────────────────────────────────────────────── */

export function OutputLog({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <View style={styles.logBox}>
      <Text style={styles.logHeader}>Output</Text>
      {lines.map((line, i) => (
        <Text key={i} style={styles.logLine}>
          {line}
        </Text>
      ))}
    </View>
  );
}

/* ── Row ────────────────────────────────────────────────────── */

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/* ── Section Header ─────────────────────────────────────────── */

export function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

/* ── Badge ──────────────────────────────────────────────────── */

export function Badge({
  label,
  color = colors.primary,
}: {
  label: string;
  color?: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  backBtn: {
    marginBottom: spacing.sm,
  },
  backText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  screenTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
      },
    }),
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    alignItems: "center",
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  logBox: {
    backgroundColor: "#1E1E2E",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  logHeader: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  logLine: {
    fontSize: fontSize.sm,
    color: "#A5F3FC",
    fontFamily: Platform.OS === "web" ? "monospace" : "Menlo",
    lineHeight: 18,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
    flexShrink: 1,
  },
  sectionHeader: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
  },
});
