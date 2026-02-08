/**
 * @rajeev02/ui
 *
 * Adaptive UI Component System
 * Device-aware rendering for phone, tablet, watch, TV, auto, IoT
 *
 * @author Rajeev Kumar Joshi (https://github.com/Rajeev02)
 * @license MIT
 */

// Design Tokens
export {
  colors, spacing, typography, breakpoints, borderRadius, shadows,
  highContrast, getTheme,
} from './tokens';
export type { ThemeMode } from './tokens';

// Device Detection
export {
  detectDeviceType, getDefaultCapabilities, isLowEndDevice,
  getMinTouchTarget, getFontMultiplier,
} from './device';
export type { DeviceType, InputMode, DeviceCapabilities } from './device';

// Hooks & Adaptive Layout
export {
  resolveAdaptiveContent, responsive,
} from './hooks';
export type {
  UseDeviceResult, UseAccessibilityResult, UseThemeResult,
  AdaptiveLayoutProps,
} from './hooks';
