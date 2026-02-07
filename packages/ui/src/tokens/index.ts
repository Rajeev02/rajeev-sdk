/**
 * @rajeev02/ui - Design Tokens
 *
 * Centralized design system tokens for consistent theming
 * across phone, tablet, watch, TV, and auto interfaces.
 */

export const colors = {
  // Primary palette
  primary: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81' },
  // Indian-friendly accent (saffron-inspired)
  accent: { 50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12' },
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Neutrals
  text: { primary: '#111827', secondary: '#6B7280', disabled: '#9CA3AF', inverse: '#FFFFFF' },
  background: { primary: '#FFFFFF', secondary: '#F9FAFB', tertiary: '#F3F4F6' },
  border: { light: '#E5E7EB', medium: '#D1D5DB', dark: '#9CA3AF' },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const typography = {
  // Font families with Indian script fallbacks
  fontFamily: {
    sans: 'System, -apple-system, "Noto Sans", "Noto Sans Devanagari", "Noto Sans Bengali", "Noto Sans Tamil", sans-serif',
    mono: '"SF Mono", "Roboto Mono", "Noto Sans Mono", monospace',
  },
  // Size scale
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  // Line heights (slightly higher for Devanagari and other Indian scripts)
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,   // Better for Indian scripts with diacritics
    loose: 2.0,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const breakpoints = {
  /** Watch: < 200px */
  watch: 200,
  /** Phone: 200-599px */
  phone: 600,
  /** Tablet: 600-1023px */
  tablet: 1024,
  /** Desktop/TV: >= 1024px */
  desktop: 1024,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
} as const;

/** Accessibility-focused high contrast palette */
export const highContrast = {
  text: { primary: '#000000', secondary: '#333333', inverse: '#FFFFFF' },
  background: { primary: '#FFFFFF', secondary: '#F0F0F0' },
  border: { light: '#666666', medium: '#333333' },
  focus: '#0055FF',
} as const;

export type ThemeMode = 'light' | 'dark' | 'highContrast';

/** Get complete theme based on mode */
export function getTheme(mode: ThemeMode) {
  return {
    colors: mode === 'highContrast' ? { ...colors, text: highContrast.text, background: highContrast.background, border: highContrast.border } : colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    mode,
  };
}
