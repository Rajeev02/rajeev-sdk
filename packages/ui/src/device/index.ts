/**
 * @rajeev02/ui - Device Detection
 *
 * Detect device type, capabilities, input mode, and accessibility
 * settings to drive adaptive UI rendering.
 */

export type DeviceType = 'phone' | 'tablet' | 'watch' | 'tv' | 'auto' | 'desktop' | 'iot';
export type InputMode = 'touch' | 'keyboard' | 'voice' | 'rotary' | 'dpad' | 'controller';

export interface DeviceCapabilities {
  /** Device type */
  type: DeviceType;
  /** Screen width in dp/px */
  screenWidth: number;
  /** Screen height in dp/px */
  screenHeight: number;
  /** Primary input mode */
  inputMode: InputMode;
  /** Whether haptic feedback is available */
  haptics: boolean;
  /** Whether biometric auth is available */
  biometrics: boolean;
  /** Whether the device has a notch/dynamic island */
  hasNotch: boolean;
  /** Device pixel ratio */
  pixelRatio: number;
  /** Whether the device supports dark mode */
  darkModeSupported: boolean;
  /** Whether reduce motion is enabled */
  reduceMotion: boolean;
  /** Whether a screen reader is active */
  screenReaderActive: boolean;
  /** Font scale set by user */
  fontScale: number;
  /** Whether the device is low-end (for performance optimization) */
  isLowEnd: boolean;
}

/**
 * Detect device type from screen dimensions
 */
export function detectDeviceType(width: number, height: number): DeviceType {
  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height);

  if (minDim < 200) return 'watch';
  if (minDim < 600 && maxDim < 1000) return 'phone';
  if (minDim >= 600 && maxDim < 1400) return 'tablet';
  if (minDim >= 1400) return 'tv';
  return 'phone'; // Default
}

/**
 * Get default capabilities for a device type
 */
export function getDefaultCapabilities(type: DeviceType): DeviceCapabilities {
  const defaults: Record<DeviceType, Partial<DeviceCapabilities>> = {
    phone: { screenWidth: 390, screenHeight: 844, inputMode: 'touch', haptics: true, pixelRatio: 3, hasNotch: true },
    tablet: { screenWidth: 820, screenHeight: 1180, inputMode: 'touch', haptics: true, pixelRatio: 2, hasNotch: false },
    watch: { screenWidth: 184, screenHeight: 224, inputMode: 'touch', haptics: true, pixelRatio: 2, hasNotch: false },
    tv: { screenWidth: 1920, screenHeight: 1080, inputMode: 'dpad', haptics: false, pixelRatio: 1, hasNotch: false },
    auto: { screenWidth: 1280, screenHeight: 720, inputMode: 'touch', haptics: true, pixelRatio: 2, hasNotch: false },
    desktop: { screenWidth: 1440, screenHeight: 900, inputMode: 'keyboard', haptics: false, pixelRatio: 2, hasNotch: false },
    iot: { screenWidth: 320, screenHeight: 240, inputMode: 'touch', haptics: false, pixelRatio: 1, hasNotch: false },
  };

  return {
    type,
    screenWidth: 390,
    screenHeight: 844,
    inputMode: 'touch',
    haptics: false,
    biometrics: false,
    hasNotch: false,
    pixelRatio: 2,
    darkModeSupported: true,
    reduceMotion: false,
    screenReaderActive: false,
    fontScale: 1.0,
    isLowEnd: false,
    ...defaults[type],
  };
}

/**
 * Determine if device is "low-end" based on characteristics
 * Used to disable animations, reduce image quality, simplify UI
 */
export function isLowEndDevice(totalRamMB?: number, pixelRatio?: number): boolean {
  if (totalRamMB && totalRamMB < 2048) return true;  // < 2GB RAM
  if (pixelRatio && pixelRatio < 1.5) return true;
  return false;
}

/**
 * Get recommended touch target size for device type
 * Follows WCAG 2.5.8 (44x44 minimum for mobile)
 */
export function getMinTouchTarget(type: DeviceType): number {
  switch (type) {
    case 'watch': return 38;  // Smaller screen, slightly smaller targets
    case 'phone': return 44;  // WCAG standard
    case 'tablet': return 44;
    case 'tv': return 56;     // Larger for distance viewing with remote
    case 'auto': return 56;   // Larger for driving safety
    case 'desktop': return 32; // Mouse is more precise
    case 'iot': return 44;
    default: return 44;
  }
}

/**
 * Get recommended font size multiplier for device type
 */
export function getFontMultiplier(type: DeviceType, fontScale: number = 1.0): number {
  const baseMultiplier: Record<DeviceType, number> = {
    watch: 0.85,
    phone: 1.0,
    tablet: 1.1,
    tv: 1.8,      // Much larger for 10-foot UI
    auto: 1.4,    // Larger for glance-ability
    desktop: 1.0,
    iot: 0.9,
  };
  return (baseMultiplier[type] ?? 1.0) * fontScale;
}
