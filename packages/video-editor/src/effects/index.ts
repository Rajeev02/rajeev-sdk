/**
 * @rajeev02/video-editor — Effects
 * Color grading, video filters, speed ramp, reverse, ken burns, chroma key
 */

export type VideoEffect = 'color_grade' | 'filter' | 'speed_ramp' | 'reverse' | 'ken_burns' | 'chroma_key' | 'stabilize' | 'noise_reduction' | 'slow_motion' | 'timelapse' | 'glitch' | 'vhs' | 'cinema_bars';

export interface ColorGrade {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
  vibrance: number;
}

export interface SpeedRamp {
  id: string;
  /** Keyframes: [{ timeMs, speed }] */
  keyframes: { timeMs: number; speed: number }[];
  /** Smooth transition between keyframes */
  smooth: boolean;
}

export interface KenBurnsEffect {
  /** Start position and zoom */
  start: { x: number; y: number; zoom: number };
  /** End position and zoom */
  end: { x: number; y: number; zoom: number };
  /** Easing function */
  easing: 'linear' | 'ease_in' | 'ease_out' | 'ease_in_out';
}

export interface ChromaKeyConfig {
  /** Key color (hex) — typically #00FF00 for green screen */
  keyColor: string;
  /** Similarity threshold (0-100) */
  similarity: number;
  /** Smoothness (0-100) */
  smoothness: number;
  /** Spill suppression (0-100) */
  spillSuppression: number;
  /** Replacement background URI */
  backgroundUri?: string;
  /** Replacement background color */
  backgroundColor?: string;
}

/** Built-in video filter presets */
export interface VideoFilterPreset {
  id: string;
  name: string;
  category: string;
  grade: Partial<ColorGrade>;
}

export function getVideoFilterPresets(): VideoFilterPreset[] {
  return [
    { id: 'original', name: 'Original', category: 'basic', grade: {} },
    { id: 'cinematic', name: 'Cinematic', category: 'film', grade: { contrast: 20, saturation: -10, warmth: -5, shadows: -15, highlights: -10 } },
    { id: 'teal_orange', name: 'Teal & Orange', category: 'film', grade: { warmth: 15, tint: -10, saturation: 20, contrast: 15 } },
    { id: 'vintage_film', name: 'Vintage Film', category: 'vintage', grade: { warmth: 20, saturation: -20, contrast: 10 } },
    { id: 'desaturated', name: 'Desaturated', category: 'dramatic', grade: { saturation: -40, contrast: 15 } },
    { id: 'warm_glow', name: 'Warm Glow', category: 'warm', grade: { warmth: 30, brightness: 5, saturation: 10 } },
    { id: 'cold_blue', name: 'Cold Blue', category: 'cool', grade: { warmth: -25, tint: -10, contrast: 10 } },
    { id: 'bw_film', name: 'B&W Film', category: 'bw', grade: { saturation: -100, contrast: 25 } },
    { id: 'vhs_retro', name: 'VHS Retro', category: 'vintage', grade: { saturation: -15, warmth: 10, contrast: -5 } },
    { id: 'neon_night', name: 'Neon Night', category: 'night', grade: { contrast: 30, saturation: 35, brightness: -10 } },
    { id: 'dreamy', name: 'Dreamy', category: 'soft', grade: { brightness: 10, contrast: -10, saturation: 10, warmth: 5 } },
    { id: 'high_contrast', name: 'High Contrast', category: 'dramatic', grade: { contrast: 40, shadows: -20, highlights: 15 } },
  ];
}

/** Available video transition types with labels */
export function getTransitionTypes(): { id: string; label: string; category: string }[] {
  return [
    { id: 'none', label: 'None', category: 'basic' },
    { id: 'crossfade', label: 'Crossfade', category: 'basic' },
    { id: 'dissolve', label: 'Dissolve', category: 'basic' },
    { id: 'slide_left', label: 'Slide Left', category: 'slide' },
    { id: 'slide_right', label: 'Slide Right', category: 'slide' },
    { id: 'slide_up', label: 'Slide Up', category: 'slide' },
    { id: 'slide_down', label: 'Slide Down', category: 'slide' },
    { id: 'zoom_in', label: 'Zoom In', category: 'zoom' },
    { id: 'zoom_out', label: 'Zoom Out', category: 'zoom' },
    { id: 'wipe_left', label: 'Wipe Left', category: 'wipe' },
    { id: 'wipe_right', label: 'Wipe Right', category: 'wipe' },
    { id: 'spin', label: 'Spin', category: 'creative' },
    { id: 'blur', label: 'Blur', category: 'creative' },
    { id: 'glitch', label: 'Glitch', category: 'creative' },
  ];
}
