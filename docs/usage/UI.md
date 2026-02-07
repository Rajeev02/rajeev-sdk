# @rajeev02/ui

**Adaptive UI component system** with design tokens, multi-device detection, responsive utilities, accessibility features, and theming — optimized for Indian language typography.

| Platform               | Engine     | Notes                                |
| ---------------------- | ---------- | ------------------------------------ |
| iOS                    | TypeScript | React Native StyleSheet              |
| Android                | TypeScript | React Native StyleSheet              |
| Web                    | TypeScript | react-native-web compatible          |
| watchOS                | TypeScript | Compact tokens + small touch targets |
| Wear OS                | TypeScript | Compact tokens + small touch targets |
| Android Auto           | TypeScript | Voice-friendly, large touch targets  |
| TV (tvOS / Android TV) | TypeScript | D-pad navigation, large text         |

> **Note:** `@rajeev02/ui` is a **pure TypeScript** package. It provides design tokens, device detection, and adaptive layout utilities — not UI components themselves.

---

## Installation

```bash
npm install @rajeev02/ui
```

---

## Quick Start

```typescript
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  detectDeviceType,
  getMinTouchTarget,
  getTheme,
} from "@rajeev02/ui";

// Use design tokens
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg, // 16
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md, // 8
    ...shadows.sm,
  },
  title: {
    fontSize: typography.fontSize.xl, // 20
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans,
    color: colors.text.primary,
  },
});

// Device detection
const device = detectDeviceType(screenWidth, screenHeight);
const touchTarget = getMinTouchTarget(device); // 44dp (phone)
```

---

## Design Tokens

### Colors

#### Primary (Indigo)

```typescript
colors.primary = {
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
};
```

#### Accent (Saffron / Orange)

```typescript
colors.accent = {
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
};
```

#### Semantic

```typescript
colors.success = "#10B981"; // Green
colors.warning = "#F59E0B"; // Amber
colors.error = "#EF4444"; // Red
colors.info = "#3B82F6"; // Blue
```

#### Text & Surface

```typescript
colors.text = {
  primary: "#111827", // Main text
  secondary: "#6B7280", // Subtle text
  disabled: "#D1D5DB", // Disabled state
  inverse: "#FFFFFF", // On dark backgrounds
};

colors.background = {
  primary: "#F9FAFB", // Main background
  secondary: "#FFFFFF", // Cards / surfaces
  tertiary: "#F3F4F6", // Nested surfaces
};

colors.border = {
  light: "#F3F4F6",
  medium: "#E5E7EB",
  dark: "#D1D5DB",
};
```

---

### Spacing

Consistent spacing scale in density-independent pixels:

```typescript
spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};
```

**Usage:**

```typescript
const styles = StyleSheet.create({
  card: {
    padding: spacing.lg, // 16
    marginBottom: spacing.md, // 12
    gap: spacing.sm, // 8
  },
});
```

---

### Typography

Optimized for Indic scripts with proper fallback chains and generous line heights.

```typescript
typography = {
  fontFamily: {
    sans: 'System, -apple-system, "Noto Sans", "Noto Sans Devanagari", "Noto Sans Bengali", "Noto Sans Tamil", sans-serif',
    mono: '"SF Mono", "Roboto Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  lineHeight: {
    tight: 1.2, // Latin-only content
    normal: 1.5, // Mixed content
    relaxed: 1.75, // Indic scripts (recommended)
    loose: 2.0, // Maximum readability
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};
```

**Why `lineHeight: 1.75` for Indic scripts?**

Devanagari, Bengali, Tamil, and other Indic scripts have taller characters with matras (vowel marks) above and below the baseline. The `relaxed` line height (1.75×) prevents overlapping diacritics.

---

### Border Radius

```typescript
borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999, // Pill / circle
};
```

---

### Shadows

Cross-platform shadow definitions (React Native `shadowX` + `elevation`):

```typescript
shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

**Usage:**

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: borderRadius.lg,
    ...shadows.md, // Spread the shadow object
  },
});
```

---

### Breakpoints

```typescript
breakpoints = {
  watch: 200, // < 200px → watch
  phone: 600, // 200-599px → phone
  tablet: 1024, // 600-1023px → tablet
  desktop: 1024, // ≥ 1024px → desktop
};
```

---

## Device Detection

### `detectDeviceType(width, height): DeviceType`

Detect device form factor from screen dimensions.

```typescript
type DeviceType =
  | "phone"
  | "tablet"
  | "watch"
  | "tv"
  | "auto"
  | "desktop"
  | "iot";

detectDeviceType(390, 844); // → 'phone'
detectDeviceType(820, 1180); // → 'tablet'
detectDeviceType(184, 224); // → 'watch'
detectDeviceType(1440, 900); // → 'desktop'
```

### `getMinTouchTarget(device): number`

Get the minimum touch target size in density-independent pixels.

| Device    | Touch Target |
| --------- | ------------ |
| `watch`   | 38 dp        |
| `phone`   | 44 dp        |
| `tablet`  | 44 dp        |
| `desktop` | 32 dp        |
| `tv`      | 56 dp        |
| `auto`    | 56 dp        |

### `getFontMultiplier(device, fontScale?): number`

Get the recommended font size multiplier for the device type.

| Device    | Multiplier |
| --------- | ---------- |
| `watch`   | 0.85×      |
| `phone`   | 1.0×       |
| `tablet`  | 1.1×       |
| `desktop` | 1.0×       |
| `tv`      | 1.8×       |
| `auto`    | 1.5×       |

```typescript
const multiplier = getFontMultiplier("tablet"); // → 1.1
const fontSize = typography.fontSize.md * multiplier; // → 17.6
```

### `isLowEndDevice(totalRamMB?, pixelRatio?): boolean`

Detect low-end devices for performance optimization.

```typescript
isLowEndDevice(1024, 1.0); // → true (< 2GB RAM or < 1.5 pixel ratio)
isLowEndDevice(4096, 3.0); // → false
```

### `getDefaultCapabilities(device): DeviceCapabilities`

Get default capabilities for a device type.

```typescript
interface DeviceCapabilities {
  type: DeviceType;
  screenWidth: number;
  screenHeight: number;
  inputMode: InputMode; // 'touch' | 'keyboard' | 'voice' | 'rotary' | 'dpad' | 'controller'
  haptics: boolean;
  biometrics: boolean;
  hasNotch: boolean;
  pixelRatio: number;
  darkModeSupported: boolean;
  reduceMotion: boolean;
  screenReaderActive: boolean;
  fontScale: number;
  isLowEnd: boolean;
}
```

---

## Theming

### `getTheme(mode): Theme`

Get a complete theme object for a given mode.

```typescript
type ThemeMode = "light" | "dark" | "highContrast";

const theme = getTheme("dark");
// → {
//   colors: { text: { primary: '#F9FAFB', ... }, background: { primary: '#111827', ... } },
//   spacing: { ... },
//   typography: { ... },
//   borderRadius: { ... },
//   shadows: { ... },
//   mode: 'dark',
// }
```

#### Theme Modes

| Mode           | Text      | Background | Focus     |
| -------------- | --------- | ---------- | --------- |
| `light`        | `#111827` | `#F9FAFB`  | Default   |
| `dark`         | `#F9FAFB` | `#111827`  | Default   |
| `highContrast` | `#000000` | `#FFFFFF`  | `#0055FF` |

**High Contrast mode** meets **WCAG AAA** contrast ratios for maximum accessibility.

---

### High Contrast Tokens

```typescript
highContrast = {
  text: {
    primary: "#000000",
    secondary: "#1A1A1A",
    inverse: "#FFFFFF",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F5F5F5",
  },
  border: {
    medium: "#000000",
  },
  focus: "#0055FF", // Visible focus ring
};
```

---

## Responsive Utilities

### `responsive<T>(screenWidth, values): T`

Select a value based on screen width breakpoints.

```typescript
const columns = responsive(screenWidth, {
  phone: 1,
  tablet: 2,
  desktop: 3,
});
// screenWidth 390 → 1, screenWidth 820 → 2, screenWidth 1440 → 3
```

### `resolveAdaptiveContent(props, deviceType): unknown`

Resolve device-specific content from an adaptive props object.

```typescript
const layout = resolveAdaptiveContent(
  {
    phone: { columns: 1, compact: true },
    tablet: { columns: 2, compact: false },
    watch: { columns: 1, compact: true, simplified: true },
    fallback: { columns: 1, compact: false },
  },
  deviceType,
);
```

---

## Accessibility

### Built-in Accessibility Features

| Feature       | Token/Utility                           | Notes                             |
| ------------- | --------------------------------------- | --------------------------------- |
| Line height   | `typography.lineHeight.relaxed` (1.75×) | Prevents Indic diacritic overlap  |
| Font fallback | `typography.fontFamily.sans`            | Includes Noto Sans for 10 scripts |
| Touch targets | `getMinTouchTarget()`                   | Platform-appropriate minimum size |
| High contrast | `getTheme('highContrast')`              | WCAG AAA compliant                |
| Motion        | `DeviceCapabilities.reduceMotion`       | Respect `prefers-reduced-motion`  |
| Screen reader | `DeviceCapabilities.screenReaderActive` | Detect VoiceOver/TalkBack         |
| Font scaling  | `getFontMultiplier()`                   | Respects system font size         |

### Hook Types (for implementing in your app)

```typescript
interface UseAccessibilityResult {
  screenReaderActive: boolean;
  reduceMotion: boolean;
  fontScale: number;
  highContrast: boolean;
  minTouchTarget: number;
  largeText: boolean; // fontScale > 1.3
}
```

---

## Full Example: Adaptive Product Card

```typescript
import {
  colors, spacing, typography, borderRadius, shadows,
  detectDeviceType, getMinTouchTarget, getFontMultiplier,
  responsive, getTheme,
} from '@rajeev02/ui';
import { StyleSheet, useWindowDimensions } from 'react-native';

function ProductCard({ product }: { product: Product }) {
  const { width, height } = useWindowDimensions();
  const device = detectDeviceType(width, height);
  const touchTarget = getMinTouchTarget(device);
  const fontMul = getFontMultiplier(device);
  const theme = getTheme('light');

  const cols = responsive(width, { phone: 1, tablet: 2, desktop: 3 });

  return (
    <View style={[styles.card, { minHeight: touchTarget * 2 }]}>
      <Text style={[styles.title, { fontSize: typography.fontSize.lg * fontMul }]}>
        {product.name}
      </Text>
      <Text style={styles.price}>
        {formatINRShort(product.price)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
  },
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent[600],
    marginTop: spacing.sm,
  },
});
```

---

## Platform-Specific Guidance

### watchOS / Wear OS

- Use `fontMultiplier: 0.85` for smaller text
- Minimum touch target: `38dp`
- Use `spacing.sm` and `spacing.xs` for compact layouts
- Consider `resolveAdaptiveContent` with `watch` key for simplified UI

### Android Auto

- Minimum touch target: `56dp`
- Use `fontMultiplier: 1.5` for glanceable text
- Limit content density — max 6 items visible
- Use `inputMode: 'voice'` for voice-first interactions

### TV (tvOS / Android TV)

- Minimum touch target: `56dp` (D-pad focus area)
- Use `fontMultiplier: 1.8` for 10-foot viewing distance
- Use `spacing.xxl` and `spacing.xxxl` for generous layouts
- `inputMode: 'dpad'` — ensure visible focus states
