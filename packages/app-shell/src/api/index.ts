/**
 * @rajeev02/app-shell — API Client
 * Offline-first API layer with interceptors, token refresh, retry, cache-first strategy
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type CacheStrategy =
  | "network_first"
  | "cache_first"
  | "network_only"
  | "cache_only"
  | "stale_while_revalidate";

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  /** Get current access token */
  getToken?: () => Promise<string | null>;
  /** Refresh token when 401 received */
  onRefreshToken?: () => Promise<string | null>;
  /** Called on network error (for queueing) */
  onNetworkError?: (request: ApiRequest) => void;
  /** Default cache strategy */
  defaultCacheStrategy?: CacheStrategy;
  /** Default cache TTL in seconds */
  defaultCacheTtl?: number;
}

export interface ApiRequest {
  method: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  cacheStrategy?: CacheStrategy;
  cacheTtl?: number;
  retryCount?: number;
  maxRetries?: number;
  tag?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  fromCache: boolean;
  duration: number;
}

export interface RequestInterceptor {
  name: string;
  onRequest: (request: ApiRequest) => ApiRequest | Promise<ApiRequest>;
}

export interface ResponseInterceptor {
  name: string;
  onResponse: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onError?: (error: unknown, request: ApiRequest) => unknown;
}

/**
 * Offline-First API Client
 */
export class ApiClient {
  private config: ApiConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private pendingRequests: Map<string, ApiRequest> = new Map();
  private cache: Map<string, { response: ApiResponse; expiresAt: number }> =
    new Map();
  private isRefreshing: boolean = false;
  private refreshQueue: ((token: string | null) => void)[] = [];

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 15000,
      defaultCacheStrategy: "network_first",
      defaultCacheTtl: 300,
      ...config,
    };
  }

  /** Add request interceptor */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /** Add response interceptor */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /** Main request method */
  async request<T = unknown>(req: ApiRequest): Promise<ApiResponse<T>> {
    let request = {
      ...req,
      retryCount: req.retryCount ?? 0,
      maxRetries: req.maxRetries ?? 2,
    };
    const strategy =
      request.cacheStrategy ??
      this.config.defaultCacheStrategy ??
      "network_first";
    const cacheKey = this.getCacheKey(request);

    // Run request interceptors
    for (const interceptor of this.requestInterceptors) {
      const intercepted = await interceptor.onRequest(request);
      request = {
        ...intercepted,
        retryCount: intercepted.retryCount ?? request.retryCount,
        maxRetries: intercepted.maxRetries ?? request.maxRetries,
      };
    }

    // Cache strategies
    if (strategy === "cache_only" || strategy === "cache_first") {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
      if (strategy === "cache_only") {
        throw new Error("No cached response available");
      }
    }

    if (strategy === "stale_while_revalidate") {
      const cached = this.getFromCache<T>(cacheKey);
      // Return stale cache immediately, revalidate in background
      if (cached) {
        this.fetchFromNetwork<T>(request, cacheKey).catch(() => {});
        return cached;
      }
    }

    try {
      const response = await this.fetchFromNetwork<T>(request, cacheKey);
      return response;
    } catch (error) {
      // On network error, try cache as fallback
      if (strategy === "network_first") {
        const cached = this.getFromCache<T>(cacheKey);
        if (cached) return cached;
      }
      // Queue for later if offline
      if (this.config.onNetworkError && request.method !== "GET") {
        this.config.onNetworkError(request);
      }
      throw error;
    }
  }

  // Convenience methods
  async get<T = unknown>(
    path: string,
    query?: Record<string, string>,
    options?: Partial<ApiRequest>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "GET", path, query, ...options });
  }
  async post<T = unknown>(
    path: string,
    body?: unknown,
    options?: Partial<ApiRequest>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "POST", path, body, ...options });
  }
  async put<T = unknown>(
    path: string,
    body?: unknown,
    options?: Partial<ApiRequest>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "PUT", path, body, ...options });
  }
  async patch<T = unknown>(
    path: string,
    body?: unknown,
    options?: Partial<ApiRequest>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "PATCH", path, body, ...options });
  }
  async delete<T = unknown>(
    path: string,
    options?: Partial<ApiRequest>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "DELETE", path, ...options });
  }

  /** Clear API cache */
  clearCache(): void {
    this.cache.clear();
  }

  /** Get pending (queued) requests count */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  private async fetchFromNetwork<T>(
    request: ApiRequest,
    cacheKey: string,
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const url = this.buildUrl(request);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.defaultHeaders,
      ...request.headers,
    };

    // Add auth token
    if (this.config.getToken) {
      const token = await this.config.getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = { method: request.method, headers };
    if (request.body && request.method !== "GET") {
      fetchOptions.body = JSON.stringify(request.body);
    }

    const httpResponse = await fetch(url, fetchOptions);

    // Handle 401 — token expired
    if (httpResponse.status === 401 && this.config.onRefreshToken) {
      const newToken = await this.handleTokenRefresh();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...fetchOptions, headers });
        return this.processResponse<T>(retryResponse, cacheKey, start);
      }
    }

    return this.processResponse<T>(httpResponse, cacheKey, start);
  }

  private async processResponse<T>(
    httpResponse: Response,
    cacheKey: string,
    start: number,
  ): Promise<ApiResponse<T>> {
    const data = (await httpResponse.json()) as T;
    const responseHeaders: Record<string, string> = {};
    httpResponse.headers.forEach((v, k) => {
      responseHeaders[k] = v;
    });

    let response: ApiResponse<T> = {
      data,
      status: httpResponse.status,
      headers: responseHeaders,
      fromCache: false,
      duration: Date.now() - start,
    };

    // Run response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = (await interceptor.onResponse(
        response as ApiResponse,
      )) as ApiResponse<T>;
    }

    // Cache successful GET responses
    if (httpResponse.ok) {
      const ttl = this.config.defaultCacheTtl ?? 300;
      this.cache.set(cacheKey, {
        response: response as ApiResponse,
        expiresAt: Date.now() + ttl * 1000,
      });
    }

    if (!httpResponse.ok) {
      throw {
        status: httpResponse.status,
        data,
        message: `HTTP ${httpResponse.status}`,
      };
    }

    return response;
  }

  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshQueue.push(resolve);
      });
    }
    this.isRefreshing = true;
    try {
      const token = await this.config.onRefreshToken!();
      this.refreshQueue.forEach((cb) => cb(token));
      this.refreshQueue = [];
      return token;
    } finally {
      this.isRefreshing = false;
    }
  }

  private getFromCache<T>(key: string): ApiResponse<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return { ...entry.response, fromCache: true } as ApiResponse<T>;
  }

  private getCacheKey(req: ApiRequest): string {
    const queryStr = req.query ? JSON.stringify(req.query) : "";
    return `${req.method}:${req.path}:${queryStr}`;
  }

  private buildUrl(req: ApiRequest): string {
    let url = `${this.config.baseUrl}${req.path}`;
    if (req.query) {
      const params = new URLSearchParams(req.query).toString();
      if (params) url += `?${params}`;
    }
    return url;
  }
}
