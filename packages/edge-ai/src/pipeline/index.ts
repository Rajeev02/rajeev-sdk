/**
 * @rajeev02/edge-ai — ML Pipeline
 * Abstract pipeline for on-device ML: model loading, inference, post-processing
 * Backends: TFLite (Android), CoreML (iOS), ONNX (Web)
 */

export type MLBackend = "tflite" | "coreml" | "onnx" | "wasm";
export type ModelState =
  | "unloaded"
  | "loading"
  | "ready"
  | "inferring"
  | "error";

export interface ModelConfig {
  id: string;
  name: string;
  /** Path or URL to the model file */
  modelPath: string;
  /** Which backend to use */
  backend: MLBackend;
  /** Model input dimensions [batch, height, width, channels] */
  inputShape?: number[];
  /** Labels file path (for classification) */
  labelsPath?: string;
  /** Whether to use GPU acceleration */
  useGpu?: boolean;
  /** Number of threads for CPU inference */
  numThreads?: number;
  /** Maximum model file size in bytes (for download check) */
  maxSizeBytes?: number;
}

export interface InferenceResult {
  modelId: string;
  /** Time taken for inference in ms */
  inferenceTimeMs: number;
  /** Raw output tensor(s) */
  outputs: Record<string, number[]>;
  /** Post-processed results (model-specific) */
  results: unknown;
  /** Confidence of top result (0-1) */
  topConfidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

/**
 * ML Model Manager — handles loading, caching, and lifecycle of ML models
 */
export class ModelManager {
  private models: Map<string, ModelConfig & { state: ModelState }> = new Map();
  private listeners: Set<(modelId: string, state: ModelState) => void> =
    new Set();

  /** Register a model */
  register(config: ModelConfig): void {
    this.models.set(config.id, { ...config, state: "unloaded" });
  }

  /** Load a model into memory */
  async load(modelId: string): Promise<boolean> {
    const model = this.models.get(modelId);
    if (!model) return false;
    model.state = "loading";
    this.notify(modelId, "loading");
    // Native layer would actually load the model here
    model.state = "ready";
    this.notify(modelId, "ready");
    return true;
  }

  /** Unload a model from memory */
  unload(modelId: string): boolean {
    const model = this.models.get(modelId);
    if (!model) return false;
    model.state = "unloaded";
    this.notify(modelId, "unloaded");
    return true;
  }

  /** Get model state */
  getState(modelId: string): ModelState {
    return this.models.get(modelId)?.state ?? "unloaded";
  }

  /** Check if a model is ready */
  isReady(modelId: string): boolean {
    return this.getState(modelId) === "ready";
  }

  /** Get all registered models */
  getAll(): (ModelConfig & { state: ModelState })[] {
    return Array.from(this.models.values());
  }

  /** Subscribe to model state changes */
  onStateChange(
    listener: (modelId: string, state: ModelState) => void,
  ): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(modelId: string, state: ModelState): void {
    for (const l of this.listeners) {
      try {
        l(modelId, state);
      } catch {}
    }
  }
}
