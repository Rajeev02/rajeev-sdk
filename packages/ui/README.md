# @rajeev02/ui

[![npm version](https://img.shields.io/npm/v/@rajeev02/ui.svg)](https://www.npmjs.com/package/@rajeev02/ui)
[![license](https://img.shields.io/npm/l/@rajeev02/ui.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Adaptive UI system** with design tokens, multi-device detection, responsive utilities, accessibility features, and theming — optimized for Indian language typography.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Device-aware design** — Automatically adapts touch targets, font sizes, and layouts for phone, tablet, watch, TV, and car
- **Complete token system** — Colors, spacing, typography, border radius, shadows, z-index — all in one package
- **Indian language support** — Typography stack with proper line heights for Devanagari, Tamil, Bengali, Telugu, and 6 more scripts
- **Dark mode built-in** — `getTheme("light")` / `getTheme("dark")` — full semantic token set for both
- **Accessibility-first** — WCAG contrast ratios, minimum touch targets (44dp+ on phone, 48dp+ on watch)
- **Pure TypeScript** — No native dependencies. Works with React Native, Expo, and react-native-web.

## Platform Support

| Platform     | Engine     | Status |
| ------------ | ---------- | ------ |
| iOS          | TypeScript | ✅     |
| Android      | TypeScript | ✅     |
| Web          | TypeScript | ✅     |
| watchOS      | TypeScript | ✅     |
| Wear OS      | TypeScript | ✅     |
| Android Auto | TypeScript | ✅     |
| TV           | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/ui
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

### Design Tokens

```typescript
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from "@rajeev02/ui";

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
```

### Device Detection

```typescript
import {
  detectDeviceType,
  getMinTouchTarget,
  getResponsiveValue,
} from "@rajeev02/ui";

const device = detectDeviceType(screenWidth, screenHeight);
// → "phone" | "tablet" | "watch" | "tv" | "car" | "desktop"

const touchTarget = getMinTouchTarget(device);
// phone → 44, tablet → 44, watch → 48, tv → 56, car → 64

const fontSize = getResponsiveValue(device, {
  phone: 16,
  tablet: 18,
  watch: 12,
  tv: 24,
  car: 20,
  desktop: 16,
});
```

### Theming

```typescript
import { getTheme } from "@rajeev02/ui";

const lightTheme = getTheme("light");
const darkTheme = getTheme("dark");

// Use in your app
<View style={{ backgroundColor: theme.colors.background.primary }}>
  <Text style={{ color: theme.colors.text.primary }}>Hello</Text>
</View>
```

## Color Palette

| Token                | Light     | Dark      | Usage                  |
| -------------------- | --------- | --------- | ---------------------- |
| `colors.primary.500` | `#6366F1` | `#818CF8` | Primary actions, links |
| `colors.accent.500`  | `#F97316` | `#FB923C` | Saffron accent, CTAs   |
| `colors.success`     | `#10B981` | `#34D399` | Success states         |
| `colors.error`       | `#EF4444` | `#F87171` | Error states           |
| `colors.warning`     | `#F59E0B` | `#FBBF24` | Warning states         |

## Spacing Scale

| Token         | Value | Usage            |
| ------------- | ----- | ---------------- |
| `spacing.xs`  | 4     | Tight gaps       |
| `spacing.sm`  | 8     | Small padding    |
| `spacing.md`  | 12    | Medium padding   |
| `spacing.lg`  | 16    | Standard padding |
| `spacing.xl`  | 24    | Section spacing  |
| `spacing.xxl` | 32    | Large sections   |

## API Reference

| Export                 | Type       | Description                                                      |
| ---------------------- | ---------- | ---------------------------------------------------------------- |
| `colors`               | `object`   | Full color palette (primary, accent, semantic, background, text) |
| `spacing`              | `object`   | Spacing scale (xs through xxxl)                                  |
| `typography`           | `object`   | Font families, sizes, weights, line heights                      |
| `borderRadius`         | `object`   | Border radius scale (xs through full)                            |
| `shadows`              | `object`   | Shadow presets (xs through xxl)                                  |
| `zIndex`               | `object`   | Z-index layers (base through overlay)                            |
| `detectDeviceType()`   | `function` | Detect current device form factor                                |
| `getMinTouchTarget()`  | `function` | Get accessible touch target size for device                      |
| `getResponsiveValue()` | `function` | Get device-specific value from a map                             |
| `getTheme()`           | `function` | Get complete light/dark theme object                             |

## Full Documentation

📖 [Complete API docs with all token values](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/UI.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
