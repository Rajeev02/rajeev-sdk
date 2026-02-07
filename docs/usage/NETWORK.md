# @rajeev02/network

**Connectivity-aware networking layer** with real-time status monitoring, adaptive quality suggestions, persistent priority request queue, HTTP cache, and gzip compression.

| Platform            | Engine                       | Binding                           |
| ------------------- | ---------------------------- | --------------------------------- |
| iOS 16+             | Rust (`rajeev-network-core`) | UniFFI → Swift native module      |
| Android 7+ (API 24) | Rust (`rajeev-network-core`) | UniFFI → Kotlin JNI native module |
| Web                 | Rust → WASM                  | `wasm-bindgen` + JS glue          |
| watchOS 9+          | Rust                         | UniFFI → Swift                    |
| Wear OS             | Rust                         | UniFFI → Kotlin                   |
| Android Auto        | Rust                         | UniFFI → Kotlin                   |

---

## Installation

```bash
npm install @rajeev02/network
```

---

## Quick Start

```typescript
import { RajeevNetwork } from "@rajeev02/network";

const network = new RajeevNetwork({
  appId: "my-app",
  dbDir: "/data/network",
  enableQueue: true,
  enableCache: true,
  autoCompress: true,
});

// Update connectivity status
network.updateStatus("wifi", 50000, 30, false);

// Check suggestions
const timeout = network.getSuggestedTimeoutMs(); // 10000
const quality = network.getSuggestedImageQuality(); // "High"
```

---

## Platform Usage

### iOS

```typescript
import { RajeevNetwork } from "@rajeev02/network";

const network = new RajeevNetwork({
  appId: "my-ios-app",
  dbDir: NSDocumentsDirectory,
  enableQueue: true,
  enableCache: true,
  maxCacheBytes: 50 * 1024 * 1024, // 50 MB
});

// Listen to NWPathMonitor for connection changes
network.updateStatus("wifi", bandwidth, rtt, saveData);
```

### Android

```typescript
import { RajeevNetwork } from "@rajeev02/network";

const network = new RajeevNetwork({
  appId: "my-android-app",
  dbDir: context.filesDir,
  enableQueue: true,
  enableCache: true,
});

// Use ConnectivityManager callback
network.updateStatus("4g", 25000, 50, false);
```

### Web

```typescript
import { RajeevNetwork } from "@rajeev02/network";

const network = new RajeevNetwork({
  appId: "my-web-app",
  dbDir: "indexeddb",
  enableQueue: true,
  enableCache: true,
});

// Use Navigator.connection API
const conn = navigator.connection;
network.updateStatus(
  conn.effectiveType,
  conn.downlink * 1000,
  conn.rtt,
  conn.saveData,
);
```

---

## API Reference

### Configuration

```typescript
interface NetworkConfig {
  appId: string; // Unique app identifier
  dbDir: string; // Directory for SQLite databases
  maxCacheBytes?: number; // Max cache size in bytes (default: 50 MB)
  enableQueue?: boolean; // Enable request queue (default: true)
  enableCache?: boolean; // Enable HTTP cache (default: true)
  autoCompress?: boolean; // Auto-compress large payloads (default: true)
}
```

---

### Connectivity Monitoring

#### `updateStatus(connectionType, downlinkKbps, rttMs, saveData)`

Update the current network status. Call this whenever connectivity changes.

```typescript
// Connection types: 'offline', '2g', '3g', '4g', '5g', 'wifi', 'ethernet', 'unknown'
network.updateStatus("4g", 25000, 50, false);
```

#### `getStatus(): NetworkStatus`

Get current network state.

```typescript
interface NetworkStatus {
  connectionType: string; // 'offline' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'ethernet'
  downlinkKbps: number; // Measured bandwidth
  rttMs: number; // Round-trip time
  saveData: boolean; // User prefers reduced data
  isMetered: boolean; // Cellular connection
  qualityScore: number; // 0-100 composite score
  isOnline: boolean; // Has any connection
}
```

#### `getSuggestedTimeoutMs(): number`

Get recommended request timeout based on connection quality.

| Quality Score | Timeout   |
| ------------- | --------- |
| 0 (offline)   | 0 ms      |
| 1–20          | 60,000 ms |
| 21–40         | 30,000 ms |
| 41–70         | 15,000 ms |
| 71–90         | 10,000 ms |
| 91–100        | 5,000 ms  |

#### `getSuggestedImageQuality(): ImageQuality`

Get recommended image quality for the current connection.

| Quality Score | Image Quality | Max Width | JPEG Quality | Format |
| ------------- | ------------- | --------- | ------------ | ------ |
| 0–14          | Placeholder   | 0         | 0%           | none   |
| 15–30         | Low           | 144px     | 30%          | jpeg   |
| 31–60         | Medium        | 480px     | 60%          | webp   |
| 61–80         | High          | 1080px    | 80%          | webp   |
| 81–100        | Original      | max       | 95%          | avif   |

```typescript
const quality = network.getSuggestedImageQuality();
// → { quality: "High", maxWidth: 1080, jpegQuality: 80, format: "webp" }
```

---

### Bandwidth Estimation

#### `recordTransfer(bytes, durationMs)`

Record a completed transfer for bandwidth estimation.

```typescript
network.recordTransfer(102400, 150); // 100KB in 150ms
```

#### `getEstimatedBandwidthKbps(): number`

Get estimated bandwidth using exponentially weighted moving average (EWMA).

```typescript
const bw = network.getEstimatedBandwidthKbps(); // → 5461
```

---

### Request Queue

Persistent, priority-based offline request queue with exponential backoff retries.

#### `enqueueRequest(method, url, headers, body, priority, compress, tag): string`

Add a request to the queue. Returns a request ID.

```typescript
const id = network.enqueueRequest(
  "POST",
  "https://api.example.com/payment",
  JSON.stringify({ "Content-Type": "application/json" }),
  JSON.stringify({ amount: 5000 }),
  "critical", // 'low' | 'normal' | 'high' | 'critical'
  true, // compress body
  "payments", // tag for group operations
);
```

#### Priority System

| Priority   | Max Retries | Min Quality Score | Use Case               |
| ---------- | ----------- | ----------------- | ---------------------- |
| `critical` | ∞           | 1                 | Payments, auth         |
| `high`     | 5           | 10                | User-initiated actions |
| `normal`   | 3           | 20                | Background API calls   |
| `low`      | 1           | 50                | Analytics, telemetry   |

#### `dequeueRequest(): QueuedRequest | null`

Get the next request ready to send (respects priority and network quality).

```typescript
const req = network.dequeueRequest();
if (req) {
  try {
    const response = await fetch(req.url, {
      method: req.method,
      headers: JSON.parse(req.headersJson),
      body: req.body,
    });
    network.completeRequest(req.id);
  } catch {
    network.failRequest(req.id); // Schedules retry with exponential backoff
  }
}
```

#### Retry Backoff

Failed requests are retried with exponential backoff: `base 2s, factor 2×, max 5 min`.

| Attempt   | Delay    |
| --------- | -------- |
| 1st retry | 2s       |
| 2nd retry | 4s       |
| 3rd retry | 8s       |
| 4th retry | 16s      |
| 5th retry | 32s      |
| …         | max 300s |

#### Other Queue Methods

```typescript
network.cancelRequest(requestId); // Cancel a specific request
network.cancelByTag("analytics"); // Cancel all requests with tag
network.getQueueSize(); // Total pending count
network.clearQueue(); // Remove all pending requests
```

---

### HTTP Cache

Persistent HTTP response cache with TTL and ETag support.

#### `cacheResponse(method, url, statusCode, headers, body, ttlSeconds, etag?, lastModified?)`

Cache a response.

```typescript
network.cacheResponse(
  "GET",
  "https://api.example.com/users",
  200,
  JSON.stringify({ "content-type": "application/json" }),
  JSON.stringify(usersData),
  300, // TTL: 5 minutes
  '"abc123"', // ETag (optional)
  "2026-02-07T00:00", // Last-Modified (optional)
);
```

#### `getCached(method, url): CachedResponse | null`

Retrieve a cached response (null if miss or expired).

```typescript
interface CachedResponse {
  cacheKey: string;
  statusCode: number;
  headersJson: string;
  body: string;
  cachedAt: string;
  expiresAt: string;
  etag?: string;
  lastModified?: string;
  bodySize: number;
}

const cached = network.getCached("GET", "https://api.example.com/users");
if (cached) {
  // Cache HIT — use cached.body
} else {
  // Cache MISS — fetch from network
}
```

#### Cache Stats

```typescript
const stats = network.getCacheStats();
// → { totalEntries: 42, totalSizeBytes: 524288, hitCount: 156, missCount: 23, hitRate: 0.87 }
```

#### Other Cache Methods

```typescript
network.invalidateCache("GET", "/api/users"); // Invalidate specific entry
network.clearCache(); // Clear all cached responses
network.cleanup(); // Remove expired entries from cache + queue
```

---

### Compression

Automatic gzip compression for request bodies.

```typescript
import {
  compressString,
  decompressString,
  shouldCompress,
} from "@rajeev02/network";

const payload = JSON.stringify(largeData);

if (shouldCompress(payload)) {
  const compressed = compressString(payload);
  // → base64-encoded gzip, typically 70-90% smaller
  const original = decompressString(compressed);
}
```

`shouldCompress(data)` returns `true` if the data is >1 KB and achieves ≥20% size reduction.

---

### Full Example: Offline-First API Client

```typescript
import { RajeevNetwork } from "@rajeev02/network";

const network = new RajeevNetwork({
  appId: "shop",
  dbDir: "/data",
  enableQueue: true,
  enableCache: true,
});

async function apiCall(method: string, url: string, body?: object) {
  const status = network.getStatus();

  // 1. Check cache first (GET only)
  if (method === "GET") {
    const cached = network.getCached(method, url);
    if (cached) return JSON.parse(cached.body);
  }

  // 2. If offline, queue the request
  if (!status.isOnline) {
    network.enqueueRequest(
      method,
      url,
      JSON.stringify({ "Content-Type": "application/json" }),
      body ? JSON.stringify(body) : null,
      "normal",
      true,
      null,
    );
    return null; // Will be sent when back online
  }

  // 3. Fetch with adaptive timeout
  const timeout = network.getSuggestedTimeoutMs();
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  });

  const data = await res.text();

  // 4. Cache successful GET responses
  if (method === "GET" && res.ok) {
    network.cacheResponse(method, url, res.status, "{}", data, 300);
  }

  // 5. Record transfer for bandwidth estimation
  network.recordTransfer(data.length, Date.now() - start);

  return JSON.parse(data);
}
```

---

### Build from Source

```bash
cargo test -p rajeev-network-core          # Run tests (connectivity, queue, cache, optimization)
./tools/rust-build/build-ios.sh network    # Build for iOS
./tools/rust-build/build-android.sh network # Build for Android
./tools/rust-build/build-wasm.sh network   # Build for Web (WASM)
```
