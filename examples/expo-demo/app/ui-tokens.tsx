/**
 * UI Tokens Demo — @rajeev02/ui
 *
 * Visualizes the design system: color palette, spacing scale, typography,
 * border radii, shadows, device detection, and adaptive theming.
 */
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
} from "../src/components";
import { colors, spacing, borderRadius } from "../src/theme";

/* ── Token data (mirrors @rajeev02/ui/tokens) ────────────────── */

const palette = {
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  accent: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
};

const semanticColors = [
  { name: "Success", color: "#10B981" },
  { name: "Warning", color: "#F59E0B" },
  { name: "Error", color: "#EF4444" },
  { name: "Info", color: "#3B82F6" },
];

const spacingScale = [
  { name: "xxs", value: 2 },
  { name: "xs", value: 4 },
  { name: "sm", value: 8 },
  { name: "md", value: 12 },
  { name: "lg", value: 16 },
  { name: "xl", value: 24 },
  { name: "xxl", value: 32 },
  { name: "xxxl", value: 48 },
];

const fontSizes = [
  { name: "xs", size: 10 },
  { name: "sm", size: 12 },
  { name: "base", size: 14 },
  { name: "md", size: 16 },
  { name: "lg", size: 18 },
  { name: "xl", size: 20 },
  { name: "2xl", size: 24 },
  { name: "3xl", size: 30 },
];

const radii = [
  { name: "none", value: 0 },
  { name: "sm", value: 4 },
  { name: "md", value: 8 },
  { name: "lg", value: 12 },
  { name: "xl", value: 16 },
  { name: "full", value: 9999 },
];

type DeviceType = "phone" | "tablet" | "watch" | "tv" | "desktop";

function detectDevice(w: number, h: number): DeviceType {
  const min = Math.min(w, h);
  if (min < 200) return "watch";
  if (min < 600) return "phone";
  if (min < 1024) return "tablet";
  return "desktop";
}

function touchTarget(t: DeviceType) {
  return (
    { watch: 38, phone: 44, tablet: 44, tv: 56, desktop: 32 } as Record<
      DeviceType,
      number
    >
  )[t];
}

function fontMultiplier(t: DeviceType) {
  return (
    { watch: 0.85, phone: 1.0, tablet: 1.1, tv: 1.8, desktop: 1.0 } as Record<
      DeviceType,
      number
    >
  )[t];
}

/* ── Color Swatch ────────────────────────────────────────────── */

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={s.swatch}>
      <View style={[s.swatchColor, { backgroundColor: color }]} />
      <Text style={s.swatchLabel}>{label}</Text>
    </View>
  );
}

/* ── Main Screen ─────────────────────────────────────────────── */

export default function UITokensDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "highContrast">(
    "light",
  );
  const { width, height } = useWindowDimensions();
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  const device = detectDevice(width, height);

  const demoDevice = useCallback(() => {
    add("── Device Detection ──");
    add(`  Screen: ${width} × ${height}`);
    add(`  Type: ${device}`);
    add(`  Touch target: ${touchTarget(device)}dp`);
    add(`  Font multiplier: ${fontMultiplier(device).toFixed(2)}×`);
    add("");
    const demos: [string, number, number][] = [
      ["Watch", 184, 224],
      ["Phone", 390, 844],
      ["Tablet", 820, 1180],
      ["Desktop", 1440, 900],
    ];
    demos.forEach(([n, w, h]) => {
      const t = detectDevice(w, h);
      add(`  ${n.padEnd(8)} (${w}×${h}) → ${t}, touch: ${touchTarget(t)}dp`);
    });
  }, [add, width, height, device]);

  const demoTheme = useCallback(() => {
    add(`── Theme: ${themeMode} ──`);
    if (themeMode === "highContrast") {
      add("  WCAG AAA contrast ratios");
      add("  Text: #000000, Background: #FFFFFF, Focus: #0055FF");
    } else if (themeMode === "dark") {
      add("  Text: #F9FAFB, Background: #111827, Surface: #1F2937");
    } else {
      add("  Text: #111827, Background: #F9FAFB, Surface: #FFFFFF");
    }
    add(`  Primary: ${palette.primary[500]}, Accent: ${palette.accent[500]}`);
  }, [add, themeMode]);

  return (
    <Screen
      title="UI Tokens"
      subtitle="Design system: colors, spacing, typography, device detection, and adaptive theming."
      onBack={onBack}
    >
      <SectionHeader title="Color Palette" />
      <Card title="Primary (Indigo)">
        <View style={s.swatchRow}>
          {Object.entries(palette.primary).map(([shade, color]) => (
            <Swatch key={shade} color={color} label={shade} />
          ))}
        </View>
      </Card>
      <Card title="Accent (Saffron)">
        <View style={s.swatchRow}>
          {Object.entries(palette.accent).map(([shade, color]) => (
            <Swatch key={shade} color={color} label={shade} />
          ))}
        </View>
      </Card>
      <Card title="Semantic">
        <View style={s.swatchRow}>
          {semanticColors.map((sc) => (
            <Swatch key={sc.name} color={sc.color} label={sc.name} />
          ))}
        </View>
      </Card>

      <SectionHeader title="Spacing Scale" />
      <Card>
        {spacingScale.map((sp) => (
          <View key={sp.name} style={s.spacingRow}>
            <Text style={s.spacingLabel}>
              {sp.name} ({sp.value})
            </Text>
            <View style={[s.spacingBar, { width: sp.value * 4 }]} />
          </View>
        ))}
      </Card>

      <SectionHeader title="Typography" />
      <Card>
        {fontSizes.map((f) => (
          <Text
            key={f.name}
            style={{ fontSize: f.size, color: colors.text, marginBottom: 4 }}
          >
            {f.name} — {f.size}px — The quick brown fox
          </Text>
        ))}
      </Card>

      <SectionHeader title="Border Radius" />
      <Card>
        <View style={s.swatchRow}>
          {radii.map((r) => (
            <View key={r.name} style={s.swatch}>
              <View
                style={[s.radiusBox, { borderRadius: Math.min(r.value, 24) }]}
              />
              <Text style={s.swatchLabel}>{r.name}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader title="Shadows" />
      <Card>
        <View style={s.shadowRow}>
          {(["sm", "md", "lg"] as const).map((size) => {
            const shadow = {
              sm: { shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
              md: { shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
              lg: { shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
            }[size];
            return (
              <View
                key={size}
                style={[
                  s.shadowBox,
                  {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    ...shadow,
                  },
                ]}
              >
                <Text style={s.shadowLabel}>{size}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <SectionHeader title="Device Detection" />
      <Card title={`Detected: ${device}`}>
        <Row label="Screen" value={`${width} × ${height}`} />
        <Row label="Touch Target" value={`${touchTarget(device)}dp`} />
        <Row
          label="Font Scale"
          value={`${fontMultiplier(device).toFixed(2)}×`}
        />
        <Button title="Detect All Devices" onPress={demoDevice} />
      </Card>

      <SectionHeader title="Theming" />
      <Card title={`Mode: ${themeMode}`}>
        {(["light", "dark", "highContrast"] as const).map((mode) => (
          <Button
            key={mode}
            title={mode}
            variant={themeMode === mode ? "primary" : "secondary"}
            onPress={() => setThemeMode(mode)}
          />
        ))}
        <Button title="Show Theme Details" onPress={demoTheme} />
      </Card>

      <SectionHeader title="Accessibility" />
      <Card>
        <Row label="Line Height" value="1.75× (Indic scripts)" />
        <Row label="Font Fallback" value="Noto Sans + Devanagari, Bengali…" />
        <Row label="High Contrast" value="WCAG AAA" />
        <Row label="Motion" value="prefers-reduced-motion aware" />
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

const s = StyleSheet.create({
  swatchRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  swatch: { alignItems: "center", marginBottom: 4 },
  swatchColor: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swatchLabel: { fontSize: 9, color: colors.textSecondary, marginTop: 2 },
  spacingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  spacingLabel: { fontSize: 12, color: colors.textSecondary, width: 70 },
  spacingBar: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 12,
    minWidth: 8,
  },
  radiusBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    marginBottom: 4,
  },
  shadowRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    paddingVertical: 12,
  },
  shadowBox: {
    width: 72,
    height: 72,
    backgroundColor: "#fff",
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowLabel: { fontSize: 14, fontWeight: "600", color: colors.text },
});
