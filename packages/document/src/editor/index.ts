/**
 * @rajeev02/document — Editor
 * PDF annotation, highlight, text, stamps, form filling, page management
 */

export type AnnotationTool =
  | "highlight"
  | "underline"
  | "strikethrough"
  | "freehand"
  | "text_note"
  | "text_box"
  | "rectangle"
  | "circle"
  | "arrow"
  | "stamp"
  | "eraser";

export interface Annotation {
  id: string;
  tool: AnnotationTool;
  pageNumber: number;
  /** Position relative to page (0-1 normalized) */
  position: { x: number; y: number };
  size?: { width: number; height: number };
  color: string;
  opacity: number;
  /** Text content (for notes, text boxes) */
  text?: string;
  /** Font size for text */
  fontSize?: number;
  /** Freehand path points */
  path?: { x: number; y: number }[];
  /** Pen thickness for freehand/shapes */
  strokeWidth?: number;
  /** Stamp type */
  stampType?: StampType;
  createdAt: number;
  modifiedAt: number;
}

export type StampType =
  | "approved"
  | "rejected"
  | "draft"
  | "confidential"
  | "reviewed"
  | "final"
  | "copy"
  | "void"
  | "urgent"
  | "custom";

export interface FormField {
  id: string;
  type: "text" | "checkbox" | "radio" | "select" | "date" | "signature";
  label: string;
  pageNumber: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  value?: string;
  required: boolean;
  options?: string[];
}

export interface DocumentPage {
  pageNumber: number;
  width: number;
  height: number;
  thumbnailUri?: string;
  annotations: Annotation[];
  rotation: number;
}

/**
 * Document Editor Controller
 */
export class DocumentEditorController {
  private sourceUri: string;
  private pages: DocumentPage[] = [];
  private annotations: Annotation[] = [];
  private formFields: FormField[] = [];
  private currentPage: number = 1;
  private zoom: number = 1.0;
  private activeTool: AnnotationTool | null = null;
  private activeColor: string = "#FFFF00"; // Yellow highlight
  private activeStrokeWidth: number = 2;
  private history: Annotation[][] = [];
  private historyIndex: number = -1;
  private listeners: Set<(event: DocEditorEvent) => void> = new Set();

  constructor(sourceUri: string, totalPages: number = 1) {
    this.sourceUri = sourceUri;
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push({
        pageNumber: i,
        width: 595,
        height: 842,
        annotations: [],
        rotation: 0,
      });
    }
  }

  // ---- NAVIGATION ----
  goToPage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.pages.length));
  }
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
  getCurrentPage(): number {
    return this.currentPage;
  }
  getTotalPages(): number {
    return this.pages.length;
  }
  setZoom(zoom: number): void {
    this.zoom = Math.max(0.5, Math.min(5.0, zoom));
  }
  getZoom(): number {
    return this.zoom;
  }

  // ---- TOOLS ----
  setActiveTool(tool: AnnotationTool | null): void {
    this.activeTool = tool;
  }
  getActiveTool(): AnnotationTool | null {
    return this.activeTool;
  }
  setActiveColor(color: string): void {
    this.activeColor = color;
  }
  setStrokeWidth(width: number): void {
    this.activeStrokeWidth = width;
  }

  // ---- ANNOTATIONS ----
  addAnnotation(
    annotation: Omit<Annotation, "id" | "createdAt" | "modifiedAt">,
  ): string {
    const id = `ann_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const full: Annotation = {
      ...annotation,
      id,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    this.annotations.push(full);
    this.saveHistory();
    this.emit({ type: "annotation_added", annotation: full });
    return id;
  }

  /** Quick highlight at position on current page */
  addHighlight(x: number, y: number, width: number, height: number): string {
    return this.addAnnotation({
      tool: "highlight",
      pageNumber: this.currentPage,
      position: { x, y },
      size: { width, height },
      color: this.activeColor,
      opacity: 0.4,
    });
  }

  /** Add text note */
  addTextNote(x: number, y: number, text: string): string {
    return this.addAnnotation({
      tool: "text_note",
      pageNumber: this.currentPage,
      position: { x, y },
      text,
      color: "#FEF3C7",
      opacity: 1,
      fontSize: 12,
    });
  }

  /** Add text box */
  addTextBox(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
  ): string {
    return this.addAnnotation({
      tool: "text_box",
      pageNumber: this.currentPage,
      position: { x, y },
      size: { width, height },
      text,
      color: "#000000",
      opacity: 1,
      fontSize: 14,
    });
  }

  /** Add stamp */
  addStamp(x: number, y: number, stampType: StampType): string {
    return this.addAnnotation({
      tool: "stamp",
      pageNumber: this.currentPage,
      position: { x, y },
      size: { width: 0.2, height: 0.06 },
      color: stampType === "approved" ? "#10B981" : "#EF4444",
      opacity: 0.9,
      stampType,
    });
  }

  /** Add freehand drawing */
  addFreehand(path: { x: number; y: number }[]): string {
    return this.addAnnotation({
      tool: "freehand",
      pageNumber: this.currentPage,
      position: path[0] ?? { x: 0, y: 0 },
      path,
      color: this.activeColor,
      opacity: 1,
      strokeWidth: this.activeStrokeWidth,
    });
  }

  removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter((a) => a.id !== id);
    this.saveHistory();
    this.emit({ type: "annotation_removed", annotationId: id });
  }

  getAnnotations(pageNumber?: number): Annotation[] {
    if (pageNumber)
      return this.annotations.filter((a) => a.pageNumber === pageNumber);
    return [...this.annotations];
  }

  clearAnnotations(pageNumber?: number): void {
    if (pageNumber)
      this.annotations = this.annotations.filter(
        (a) => a.pageNumber !== pageNumber,
      );
    else this.annotations = [];
    this.saveHistory();
  }

  // ---- PAGE MANAGEMENT ----
  rotatePage(pageNumber: number, degrees: number): void {
    const page = this.pages.find((p) => p.pageNumber === pageNumber);
    if (page) page.rotation = (page.rotation + degrees) % 360;
  }

  deletePage(pageNumber: number): void {
    if (this.pages.length <= 1) return;
    this.pages = this.pages.filter((p) => p.pageNumber !== pageNumber);
    this.annotations = this.annotations.filter(
      (a) => a.pageNumber !== pageNumber,
    );
    // Renumber
    this.pages.forEach((p, i) => {
      p.pageNumber = i + 1;
    });
  }

  reorderPages(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= this.pages.length ||
      toIndex >= this.pages.length
    )
      return;
    const [page] = this.pages.splice(fromIndex, 1);
    this.pages.splice(toIndex, 0, page);
    this.pages.forEach((p, i) => {
      p.pageNumber = i + 1;
    });
  }

  // ---- FORM FILLING ----
  setFormFieldValue(fieldId: string, value: string): void {
    const field = this.formFields.find((f) => f.id === fieldId);
    if (field) field.value = value;
  }

  getFormFields(): FormField[] {
    return [...this.formFields];
  }
  loadFormFields(fields: FormField[]): void {
    this.formFields = fields;
  }

  // ---- UNDO/REDO ----
  undo(): boolean {
    if (this.historyIndex <= 0) return false;
    this.historyIndex--;
    this.annotations = [...this.history[this.historyIndex]];
    return true;
  }

  redo(): boolean {
    if (this.historyIndex >= this.history.length - 1) return false;
    this.historyIndex++;
    this.annotations = [...this.history[this.historyIndex]];
    return true;
  }

  canUndo(): boolean {
    return this.historyIndex > 0;
  }
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  /** Export state for saving */
  getEditState(): Record<string, unknown> {
    return {
      sourceUri: this.sourceUri,
      annotations: this.annotations,
      formFields: this.formFields,
      pages: this.pages,
    };
  }

  on(listener: (event: DocEditorEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private saveHistory(): void {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push([...this.annotations]);
    this.historyIndex = this.history.length - 1;
  }

  private emit(event: DocEditorEvent): void {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch {}
    }
  }
}

export type DocEditorEvent =
  | { type: "annotation_added"; annotation: Annotation }
  | { type: "annotation_removed"; annotationId: string }
  | { type: "page_changed"; page: number };
