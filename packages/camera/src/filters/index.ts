/**
 * @rajeev02/camera — Photo Filters
 * Preset filters (Instagram/Snapchat style) with adjustable intensity
 */

export interface PhotoFilter {
  id: string;
  name: string;
  category: FilterCategory;
  /** Thumbnail preview URI */
  thumbnail?: string;
  /** Adjustment values this filter applies */
  adjustments: Partial<FilterAdjustments>;
  /** Whether this is a premium filter */
  premium: boolean;
}

export type FilterCategory =
  | "natural"
  | "warm"
  | "cool"
  | "vintage"
  | "dramatic"
  | "bw"
  | "film"
  | "portrait"
  | "food"
  | "landscape"
  | "night"
  | "artistic";

export interface FilterAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  grain: number;
  vignette: number;
  fadeAmount: number;
  hue: number;
}

/** Built-in filter presets */
export function getBuiltInFilters(): PhotoFilter[] {
  return [
    // Natural
    {
      id: "original",
      name: "Original",
      category: "natural",
      premium: false,
      adjustments: {},
    },
    {
      id: "vivid",
      name: "Vivid",
      category: "natural",
      premium: false,
      adjustments: { saturation: 30, contrast: 15, sharpness: 10 },
    },
    {
      id: "natural_boost",
      name: "Natural+",
      category: "natural",
      premium: false,
      adjustments: { brightness: 5, saturation: 15, shadows: 10, sharpness: 8 },
    },

    // Warm
    {
      id: "golden_hour",
      name: "Golden Hour",
      category: "warm",
      premium: false,
      adjustments: {
        warmth: 35,
        brightness: 10,
        saturation: 20,
        highlights: 15,
      },
    },
    {
      id: "sunset",
      name: "Sunset",
      category: "warm",
      premium: false,
      adjustments: { warmth: 50, saturation: 25, contrast: 10, vignette: 15 },
    },
    {
      id: "honey",
      name: "Honey",
      category: "warm",
      premium: false,
      adjustments: { warmth: 40, brightness: 8, fadeAmount: 10 },
    },

    // Cool
    {
      id: "arctic",
      name: "Arctic",
      category: "cool",
      premium: false,
      adjustments: {
        warmth: -30,
        brightness: 10,
        contrast: 15,
        saturation: -10,
      },
    },
    {
      id: "ocean",
      name: "Ocean",
      category: "cool",
      premium: false,
      adjustments: { warmth: -20, tint: -10, saturation: 15, shadows: -10 },
    },
    {
      id: "moonlight",
      name: "Moonlight",
      category: "cool",
      premium: false,
      adjustments: { warmth: -25, brightness: -5, contrast: 20, vignette: 20 },
    },

    // Vintage
    {
      id: "retro",
      name: "Retro",
      category: "vintage",
      premium: false,
      adjustments: {
        warmth: 20,
        fadeAmount: 25,
        grain: 20,
        saturation: -15,
        contrast: 15,
      },
    },
    {
      id: "polaroid",
      name: "Polaroid",
      category: "vintage",
      premium: false,
      adjustments: { warmth: 15, fadeAmount: 20, brightness: 10, vignette: 10 },
    },
    {
      id: "sepia",
      name: "Sepia",
      category: "vintage",
      premium: false,
      adjustments: {
        warmth: 40,
        saturation: -60,
        fadeAmount: 15,
        contrast: 10,
      },
    },
    {
      id: "film_70s",
      name: "70s Film",
      category: "vintage",
      premium: false,
      adjustments: {
        warmth: 25,
        grain: 30,
        fadeAmount: 20,
        saturation: -10,
        vignette: 25,
      },
    },

    // Black & White
    {
      id: "bw_classic",
      name: "B&W Classic",
      category: "bw",
      premium: false,
      adjustments: { saturation: -100, contrast: 20, sharpness: 15 },
    },
    {
      id: "bw_high_contrast",
      name: "B&W Drama",
      category: "bw",
      premium: false,
      adjustments: {
        saturation: -100,
        contrast: 50,
        shadows: -20,
        highlights: 20,
      },
    },
    {
      id: "bw_film_noir",
      name: "Film Noir",
      category: "bw",
      premium: false,
      adjustments: { saturation: -100, contrast: 40, vignette: 40, grain: 15 },
    },

    // Dramatic
    {
      id: "hdr",
      name: "HDR",
      category: "dramatic",
      premium: false,
      adjustments: {
        contrast: 30,
        highlights: -20,
        shadows: 30,
        sharpness: 25,
        saturation: 15,
      },
    },
    {
      id: "moody",
      name: "Moody",
      category: "dramatic",
      premium: false,
      adjustments: {
        contrast: 20,
        brightness: -10,
        saturation: -10,
        vignette: 30,
        tint: 5,
      },
    },

    // Food
    {
      id: "foodie",
      name: "Foodie",
      category: "food",
      premium: false,
      adjustments: {
        warmth: 15,
        saturation: 25,
        brightness: 10,
        sharpness: 10,
        vignette: 5,
      },
    },
    {
      id: "fresh",
      name: "Fresh",
      category: "food",
      premium: false,
      adjustments: {
        saturation: 20,
        brightness: 15,
        warmth: 5,
        contrast: 10,
        sharpness: 12,
      },
    },

    // Portrait
    {
      id: "glow",
      name: "Glow",
      category: "portrait",
      premium: false,
      adjustments: {
        brightness: 10,
        warmth: 10,
        highlights: 15,
        sharpness: -5,
        fadeAmount: 8,
      },
    },
    {
      id: "soft_skin",
      name: "Soft Skin",
      category: "portrait",
      premium: false,
      adjustments: { brightness: 5, warmth: 8, sharpness: -10, contrast: -5 },
    },

    // Night
    {
      id: "neon",
      name: "Neon",
      category: "night",
      premium: true,
      adjustments: {
        contrast: 30,
        saturation: 40,
        brightness: -10,
        vignette: 20,
        tint: 15,
      },
    },
    {
      id: "city_lights",
      name: "City Lights",
      category: "night",
      premium: true,
      adjustments: { contrast: 25, warmth: -10, highlights: 20, vignette: 15 },
    },
  ];
}

/** Get filters by category */
export function getFiltersByCategory(category: FilterCategory): PhotoFilter[] {
  return getBuiltInFilters().filter((f) => f.category === category);
}

/** Get all filter categories */
export function getFilterCategories(): { id: FilterCategory; label: string }[] {
  return [
    { id: "natural", label: "Natural" },
    { id: "warm", label: "Warm" },
    { id: "cool", label: "Cool" },
    { id: "vintage", label: "Vintage" },
    { id: "dramatic", label: "Dramatic" },
    { id: "bw", label: "B&W" },
    { id: "film", label: "Film" },
    { id: "portrait", label: "Portrait" },
    { id: "food", label: "Food" },
    { id: "landscape", label: "Landscape" },
    { id: "night", label: "Night" },
    { id: "artistic", label: "Artistic" },
  ];
}
