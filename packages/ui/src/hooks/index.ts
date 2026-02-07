/**
 * @rajeev02/ui - React Hooks
 *
 * Hooks for device-aware rendering, theming, and accessibility.
 */

// Note: These hooks are designed for React Native but the types
// and logic work in any React environment. Platform-specific
// imports would be resolved at build time.

import type { DeviceType, DeviceCapabilities, InputMode } from '../device';
import type { ThemeMode } from '../tokens';

/**
 * Hook return type for useDevice
 */
export interface UseDeviceResult {
  type: DeviceType;
  isPhone: boolean;
  isTablet: boolean;
  isWatch: boolean;
  isTv: boolean;
  isAuto: boolean;
  isDesktop: boolean;
  inputMode: InputMode;
  isLowEnd: boolean;
  screenWidth: number;
  screenHeight: number;
  fontScale: number;
  pixelRatio: number;
}

/**
 * Hook return type for useAccessibility
 */
export interface UseAccessibilityResult {
  screenReaderActive: boolean;
  reduceMotion: boolean;
  fontScale: number;
  highContrast: boolean;
  /** Minimum touch target size for current device */
  minTouchTarget: number;
  /** Whether to show large text */
  largeText: boolean;
}

/**
 * Hook return type for useTheme
 */
export interface UseThemeResult {
  mode: ThemeMode;
  colors: Record<string, unknown>;
  spacing: Record<string, number>;
  isDark: boolean;
  isHighContrast: boolean;
}

/**
 * Adaptive layout props — define different content per device type
 *
 * @example
 * ```tsx
 * <AdaptiveLayout
 *   phone={<PhoneView />}
 *   tablet={<TabletView />}
 *   watch={<WatchView />}
 *   tv={<TvView />}
 *   auto={<AutoView />}
 * />
 * ```
 */
export interface AdaptiveLayoutProps {
  phone?: unknown;
  tablet?: unknown;
  watch?: unknown;
  tv?: unknown;
  auto?: unknown;
  desktop?: unknown;
  /** Fallback if specific device view not provided */
  fallback?: unknown;
}

/**
 * Get the appropriate content for the current device type
 */
export function resolveAdaptiveContent(
  props: AdaptiveLayoutProps,
  deviceType: DeviceType,
): unknown {
  const map: Record<string, unknown> = {
    phone: props.phone,
    tablet: props.tablet ?? props.phone,      // Tablet falls back to phone
    watch: props.watch,
    tv: props.tv ?? props.tablet ?? props.phone,  // TV falls back to tablet then phone
    auto: props.auto ?? props.phone,
    desktop: props.desktop ?? props.tablet ?? props.phone,
    iot: props.phone,
  };

  return map[deviceType] ?? props.fallback ?? props.phone;
}

/**
 * Responsive value helper — pick value based on screen width
 *
 * @example
 * ```ts
 * const padding = responsive(screenWidth, {
 *   watch: 4,
 *   phone: 16,
 *   tablet: 24,
 *   desktop: 32,
 * });
 * ```
 */
export function responsive<T>(
  screenWidth: number,
  values: Partial<Record<DeviceType, T>> & { phone: T },
): T {
  if (screenWidth < 200 && values.watch !== undefined) return values.watch;
  if (screenWidth < 600) return values.phone;
  if (screenWidth < 1024 && values.tablet !== undefined) return values.tablet;
  if (values.desktop !== undefined) return values.desktop;
  return values.phone;
}
