/**
 * @rajeev02/camera — Photo Editor
 * Full photo editing: crop, rotate, adjust, draw, text, stickers, blur, frames, heal, collage
 */

export type EditTool =
  | "crop"
  | "rotate"
  | "flip"
  | "adjust"
  | "filter"
  | "draw"
  | "text"
  | "sticker"
  | "blur"
  | "frame"
  | "vignette"
  | "sharpen"
  | "heal"
  | "red_eye"
  | "perspective"
  | "collage"
  | "background_remove"
  | "resize";

export interface CropPreset {
  id: string;
  label: string;
  aspectRatio: number | null; // null = freeform
}

export interface AdjustmentValues {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  exposure: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  warmth: number; // -100 to 100 (temperature)
  tint: number; // -100 to 100
  sharpness: number; // 0 to 100
  grain: number; // 0 to 100
  vignette: number; // 0 to 100
  clarity: number; // -100 to 100
  fadeAmount: number; // 0 to 100
  hue: number; // -180 to 180
}

export interface DrawConfig {
  color: string;
  brushSize: number; // 1-50
  brushType:
    | "pen"
    | "marker"
    | "pencil"
    | "spray"
    | "neon"
    | "eraser"
    | "blur_brush";
  opacity: number; // 0-100
}

export interface TextOverlay {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: "left" | "center" | "right";
  rotation: number;
  position: { x: number; y: number };
  opacity: number;
  shadow?: { color: string; offsetX: number; offsetY: number; blur: number };
  outline?: { color: string; width: number };
}

export interface StickerOverlay {
  id: string;
  source: string; // URI or asset name
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
  flipHorizontal: boolean;
}

export interface BlurRegion {
  id: string;
  type: "circle" | "rectangle" | "freeform";
  center: { x: number; y: number };
  radius?: number;
  width?: number;
  height?: number;
  intensity: number; // 1-100
  blurType: "gaussian" | "motion" | "radial" | "pixelate";
  /** Freeform path points */
  path?: { x: number; y: number }[];
}

export interface FrameConfig {
  id: string;
  type:
    | "solid"
    | "gradient"
    | "pattern"
    | "rounded"
    | "polaroid"
    | "film_strip"
    | "torn_paper";
  color?: string;
  width: number; // pixels
  cornerRadius?: number;
  innerPadding?: number;
}

export interface EditAction {
  id: string;
  tool: EditTool;
  timestamp: number;
  params: Record<string, unknown>;
}

/**
 * Photo Editor Controller — manages edit state, history, undo/redo
 */
export class PhotoEditorController {
  private sourceUri: string;
  private adjustments: AdjustmentValues;
  private textOverlays: TextOverlay[] = [];
  private stickerOverlays: StickerOverlay[] = [];
  private blurRegions: BlurRegion[] = [];
  private drawPaths: {
    config: DrawConfig;
    points: { x: number; y: number }[];
  }[] = [];
  private frame: FrameConfig | null = null;
  private cropRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null = null;
  private rotation: number = 0; // degrees
  private flipH: boolean = false;
  private flipV: boolean = false;
  private history: EditAction[] = [];
  private historyIndex: number = -1;
  private activeFilter: string | null = null;
  private listeners: Set<(event: string) => void> = new Set();

  constructor(sourceUri: string) {
    this.sourceUri = sourceUri;
    this.adjustments = this.getDefaultAdjustments();
  }

  // ---- CROP & TRANSFORM ----

  setCrop(x: number, y: number, width: number, height: number): void {
    this.cropRegion = { x, y, width, height };
    this.addToHistory("crop", { x, y, width, height });
  }

  rotate(degrees: number): void {
    this.rotation = (this.rotation + degrees) % 360;
    this.addToHistory("rotate", { degrees: this.rotation });
  }

  rotateLeft(): void {
    this.rotate(-90);
  }
  rotateRight(): void {
    this.rotate(90);
  }

  flipHorizontal(): void {
    this.flipH = !this.flipH;
    this.addToHistory("flip", { horizontal: true });
  }
  flipVertical(): void {
    this.flipV = !this.flipV;
    this.addToHistory("flip", { vertical: true });
  }

  straighten(degrees: number): void {
    this.rotation = Math.max(-45, Math.min(45, degrees));
    this.addToHistory("rotate", { degrees });
  }

  setPerspective(
    topLeft: { x: number; y: number },
    topRight: { x: number; y: number },
    bottomLeft: { x: number; y: number },
    bottomRight: { x: number; y: number },
  ): void {
    this.addToHistory("perspective", {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    });
  }

  // ---- ADJUSTMENTS ----

  setAdjustment(key: keyof AdjustmentValues, value: number): void {
    (this.adjustments as Record<string, number>)[key] = value;
    this.addToHistory("adjust", { key, value });
  }

  resetAdjustments(): void {
    this.adjustments = this.getDefaultAdjustments();
  }
  getAdjustments(): AdjustmentValues {
    return { ...this.adjustments };
  }

  // ---- FILTER ----

  applyFilter(filterId: string): void {
    this.activeFilter = filterId;
    this.addToHistory("filter", { filterId });
  }

  removeFilter(): void {
    this.activeFilter = null;
  }
  getActiveFilter(): string | null {
    return this.activeFilter;
  }

  // ---- TEXT ----

  addText(overlay: Omit<TextOverlay, "id">): string {
    const id = `text_${Date.now()}`;
    this.textOverlays.push({ ...overlay, id });
    this.addToHistory("text", { id, action: "add" });
    return id;
  }

  updateText(id: string, updates: Partial<TextOverlay>): void {
    const t = this.textOverlays.find((o) => o.id === id);
    if (t) Object.assign(t, updates);
  }

  removeText(id: string): void {
    this.textOverlays = this.textOverlays.filter((o) => o.id !== id);
  }

  getTextOverlays(): TextOverlay[] {
    return [...this.textOverlays];
  }

  // ---- STICKERS ----

  addSticker(sticker: Omit<StickerOverlay, "id">): string {
    const id = `sticker_${Date.now()}`;
    this.stickerOverlays.push({ ...sticker, id });
    this.addToHistory("sticker", { id, action: "add" });
    return id;
  }

  updateSticker(id: string, updates: Partial<StickerOverlay>): void {
    const s = this.stickerOverlays.find((o) => o.id === id);
    if (s) Object.assign(s, updates);
  }

  removeSticker(id: string): void {
    this.stickerOverlays = this.stickerOverlays.filter((o) => o.id !== id);
  }

  getStickers(): StickerOverlay[] {
    return [...this.stickerOverlays];
  }

  // ---- DRAWING ----

  startDrawPath(config: DrawConfig): void {
    this.drawPaths.push({ config: { ...config }, points: [] });
  }

  addDrawPoint(x: number, y: number): void {
    const current = this.drawPaths[this.drawPaths.length - 1];
    if (current) current.points.push({ x, y });
  }

  endDrawPath(): void {
    this.addToHistory("draw", { pathIndex: this.drawPaths.length - 1 });
  }

  clearDrawing(): void {
    this.drawPaths = [];
  }
  getDrawPaths(): typeof this.drawPaths {
    return [...this.drawPaths];
  }

  // ---- BLUR ----

  addBlurRegion(region: Omit<BlurRegion, "id">): string {
    const id = `blur_${Date.now()}`;
    this.blurRegions.push({ ...region, id });
    return id;
  }

  removeBlurRegion(id: string): void {
    this.blurRegions = this.blurRegions.filter((r) => r.id !== id);
  }

  getBlurRegions(): BlurRegion[] {
    return [...this.blurRegions];
  }

  // ---- FRAME ----

  setFrame(frame: FrameConfig): void {
    this.frame = frame;
  }
  removeFrame(): void {
    this.frame = null;
  }
  getFrame(): FrameConfig | null {
    return this.frame;
  }

  // ---- HISTORY (Undo/Redo) ----

  undo(): boolean {
    if (this.historyIndex < 0) return false;
    this.historyIndex--;
    this.emit("undo");
    return true;
  }

  redo(): boolean {
    if (this.historyIndex >= this.history.length - 1) return false;
    this.historyIndex++;
    this.emit("redo");
    return true;
  }

  canUndo(): boolean {
    return this.historyIndex >= 0;
  }
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }
  getHistoryCount(): number {
    return this.history.length;
  }

  // ---- EXPORT ----

  getEditState(): Record<string, unknown> {
    return {
      sourceUri: this.sourceUri,
      adjustments: this.adjustments,
      textOverlays: this.textOverlays,
      stickerOverlays: this.stickerOverlays,
      blurRegions: this.blurRegions,
      drawPaths: this.drawPaths,
      frame: this.frame,
      cropRegion: this.cropRegion,
      rotation: this.rotation,
      flipH: this.flipH,
      flipV: this.flipV,
      activeFilter: this.activeFilter,
    };
  }

  /** Reset all edits */
  resetAll(): void {
    this.adjustments = this.getDefaultAdjustments();
    this.textOverlays = [];
    this.stickerOverlays = [];
    this.blurRegions = [];
    this.drawPaths = [];
    this.frame = null;
    this.cropRegion = null;
    this.rotation = 0;
    this.flipH = false;
    this.flipV = false;
    this.activeFilter = null;
    this.history = [];
    this.historyIndex = -1;
  }

  on(listener: (event: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private addToHistory(tool: string, params: Record<string, unknown>): void {
    // Remove any redo history
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({
      id: `action_${Date.now()}`,
      tool: tool as EditTool,
      timestamp: Date.now(),
      params,
    });
    this.historyIndex = this.history.length - 1;
  }

  private emit(event: string): void {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch {}
    }
  }

  private getDefaultAdjustments(): AdjustmentValues {
    return {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      warmth: 0,
      tint: 0,
      sharpness: 0,
      grain: 0,
      vignette: 0,
      clarity: 0,
      fadeAmount: 0,
      hue: 0,
    };
  }
}

/** Standard crop presets */
export function getCropPresets(): CropPreset[] {
  return [
    { id: "free", label: "Free", aspectRatio: null },
    { id: "original", label: "Original", aspectRatio: null },
    { id: "1:1", label: "Square", aspectRatio: 1 },
    { id: "4:3", label: "4:3", aspectRatio: 4 / 3 },
    { id: "3:4", label: "3:4", aspectRatio: 3 / 4 },
    { id: "16:9", label: "16:9", aspectRatio: 16 / 9 },
    { id: "9:16", label: "9:16 (Story)", aspectRatio: 9 / 16 },
    { id: "3:2", label: "3:2", aspectRatio: 3 / 2 },
    { id: "2:3", label: "2:3", aspectRatio: 2 / 3 },
    { id: "aadhaar", label: "Aadhaar Size", aspectRatio: 3.5 / 4.5 },
    { id: "passport", label: "Passport Size", aspectRatio: 3.5 / 4.5 },
  ];
}
