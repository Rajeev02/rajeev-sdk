/**
 * Rajeev SDK — Expo Demo App
 *
 * Simple state-based navigation between home screen and 15 demo screens.
 * No external navigation library needed.
 */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { colors, spacing, borderRadius, fontSize } from "./src/theme";

/* ── Demo Screens ────────────────────────────────────────────── */
import VaultDemo from "./app/vault";
import NetworkDemo from "./app/network";
import LocaleDemo from "./app/locale";
import SyncDemo from "./app/sync";
import NotifyDemo from "./app/notify";
import UITokensDemo from "./app/ui-tokens";
import AuthDemo from "./app/auth";
import PaymentsDemo from "./app/payments";
import CameraDemo from "./app/camera";
import DeepLinkDemo from "./app/deeplink";
import DocumentDemo from "./app/document";
import EdgeAIDemo from "./app/edge-ai";
import MediaDemo from "./app/media";
import VideoEditorDemo from "./app/video-editor";
import AppShellDemo from "./app/app-shell";

/* ── Screen id type ──────────────────────────────────────────── */
type ScreenId =
  | "home"
  | "vault"
  | "network"
  | "locale"
  | "sync"
  | "notify"
  | "ui-tokens"
  | "auth"
  | "payments"
  | "camera"
  | "deeplink"
  | "document"
  | "edge-ai"
  | "media"
  | "video-editor"
  | "app-shell";

/* ── Card data ───────────────────────────────────────────────── */
const cards: {
  id: ScreenId;
  icon: string;
  title: string;
  subtitle: string;
  tech: string;
}[] = [
  {
    id: "vault",
    icon: "🔐",
    title: "Vault",
    subtitle:
      "AES-256-GCM encrypted key-value storage with namespaces and expiry",
    tech: "Rust → UniFFI / WASM",
  },
  {
    id: "network",
    icon: "🌐",
    title: "Network",
    subtitle:
      "Connectivity monitoring, priority queue, HTTP cache, and compression",
    tech: "Rust → UniFFI / WASM",
  },
  {
    id: "locale",
    icon: "🇮🇳",
    title: "Locale",
    subtitle:
      "Indian language localization, INR formatting, and Indic transliteration",
    tech: "Rust → UniFFI / WASM",
  },
  {
    id: "sync",
    icon: "🔄",
    title: "Sync",
    subtitle:
      "Offline-first CRDT sync with Hybrid Logical Clock conflict resolution",
    tech: "Rust → UniFFI / WASM",
  },
  {
    id: "notify",
    icon: "🔔",
    title: "Notify",
    subtitle:
      "Notification scheduling with quiet hours, inbox, and platform overrides",
    tech: "TypeScript",
  },
  {
    id: "ui-tokens",
    icon: "🎨",
    title: "UI Tokens",
    subtitle:
      "Design system: colors, spacing, typography, device detection, and theming",
    tech: "TypeScript",
  },
  {
    id: "auth",
    icon: "🔑",
    title: "Auth",
    subtitle:
      "Phone OTP, Google/Apple sign-in, Aadhaar eKYC, JWT session management",
    tech: "TypeScript",
  },
  {
    id: "payments",
    icon: "💳",
    title: "Payments",
    subtitle:
      "UPI deep links, card validation (Visa/MC/RuPay), wallets, subscriptions",
    tech: "TypeScript",
  },
  {
    id: "camera",
    icon: "📷",
    title: "Camera",
    subtitle:
      "Photo/video capture with HDR, 24 filters, full photo editor with undo/redo",
    tech: "TypeScript",
  },
  {
    id: "deeplink",
    icon: "🔗",
    title: "Deep Link",
    subtitle:
      "Universal deep linking with pattern matching, UTM attribution, deferred links",
    tech: "TypeScript",
  },
  {
    id: "document",
    icon: "📄",
    title: "Document",
    subtitle:
      "Document picker, PDF annotation/stamps, digital signatures, form filling",
    tech: "TypeScript",
  },
  {
    id: "edge-ai",
    icon: "🤖",
    title: "Edge AI",
    subtitle:
      "On-device OCR for Indian IDs, ML model pipeline, voice commands in 11 languages",
    tech: "TypeScript",
  },
  {
    id: "media",
    icon: "▶️",
    title: "Media",
    subtitle:
      "Adaptive streaming, PiP, DRM (Widevine/FairPlay), offline downloads",
    tech: "TypeScript",
  },
  {
    id: "video-editor",
    icon: "🎬",
    title: "Video Editor",
    subtitle:
      "Multi-track timeline, transitions, color grading, chroma key, export presets",
    tech: "TypeScript",
  },
  {
    id: "app-shell",
    icon: "🏗️",
    title: "App Shell",
    subtitle:
      "API client, onboarding, chat, cart, feature flags, forms, analytics",
    tech: "TypeScript",
  },
];

/* ── Home Screen ─────────────────────────────────────────────── */

function HomeScreen({ onNavigate }: { onNavigate: (id: ScreenId) => void }) {
  return (
    <View style={s.container}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>Rajeev SDK</Text>
          <Text style={s.tagline}>
            Cross-platform SDK for React Native, Expo & Web{"\n"}
            Powered by Rust
          </Text>
        </View>

        {/* Cards */}
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={s.card}
            activeOpacity={0.7}
            onPress={() => onNavigate(card.id)}
          >
            <View style={s.cardRow}>
              <Text style={s.cardIcon}>{card.icon}</Text>
              <View style={s.cardContent}>
                <Text style={s.cardTitle}>{card.title}</Text>
                <Text style={s.cardSub}>{card.subtitle}</Text>
                <View style={s.techBadge}>
                  <Text style={s.techText}>{card.tech}</Text>
                </View>
              </View>
              <Text style={s.cardArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            15 packages · Rust core · iOS · Android · Web · watchOS · Android
            Auto
          </Text>
          <Text style={s.footerVersion}>v0.1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Main App ────────────────────────────────────────────────── */

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const navigate = useCallback((id: ScreenId) => setScreen(id), []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      {screen === "home" && <HomeScreen onNavigate={navigate} />}
      {screen === "vault" && <VaultDemo onBack={goHome} />}
      {screen === "network" && <NetworkDemo onBack={goHome} />}
      {screen === "locale" && <LocaleDemo onBack={goHome} />}
      {screen === "sync" && <SyncDemo onBack={goHome} />}
      {screen === "notify" && <NotifyDemo onBack={goHome} />}
      {screen === "ui-tokens" && <UITokensDemo onBack={goHome} />}
      {screen === "auth" && <AuthDemo onBack={goHome} />}
      {screen === "payments" && <PaymentsDemo onBack={goHome} />}
      {screen === "camera" && <CameraDemo onBack={goHome} />}
      {screen === "deeplink" && <DeepLinkDemo onBack={goHome} />}
      {screen === "document" && <DocumentDemo onBack={goHome} />}
      {screen === "edge-ai" && <EdgeAIDemo onBack={goHome} />}
      {screen === "media" && <MediaDemo onBack={goHome} />}
      {screen === "video-editor" && <VideoEditorDemo onBack={goHome} />}
      {screen === "app-shell" && <AppShellDemo onBack={goHome} />}
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : spacing.xl,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
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
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        cursor: "pointer",
      } as any,
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
      },
    }),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  techBadge: {
    backgroundColor: colors.primary + "12",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  techText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
  },
  cardArrow: {
    fontSize: 24,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: "center",
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  footerVersion: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
