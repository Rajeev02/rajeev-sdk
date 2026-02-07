/**
 * Network Demo — @rajeev02/network
 *
 * Demonstrates connectivity monitoring, adaptive quality, persistent
 * request queue with priority, HTTP cache, and compression.
 */
import React, { useState, useCallback } from "react";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
  Badge,
} from "../src/components";
import { colors } from "../src/theme";

export default function NetworkDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const [connType, setConnType] = useState<string>("WiFi");
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* Connection types with realistic values */
  const connections: Record<
    string,
    { quality: number; bandwidth: number; rtt: number }
  > = {
    Offline: { quality: 0, bandwidth: 0, rtt: 0 },
    "2G": { quality: 15, bandwidth: 50, rtt: 800 },
    "3G": { quality: 40, bandwidth: 1500, rtt: 200 },
    "4G": { quality: 75, bandwidth: 25000, rtt: 50 },
    "5G": { quality: 95, bandwidth: 100000, rtt: 10 },
    WiFi: { quality: 85, bandwidth: 50000, rtt: 30 },
    Ethernet: { quality: 98, bandwidth: 100000, rtt: 5 },
  };

  const conn = connections[connType] || connections.WiFi;

  /* ── Connectivity Status ──────────────────────────────────── */
  const demoStatus = useCallback(() => {
    add(`── Network Status: ${connType} ──`);
    add(`  Quality Score: ${conn.quality}/100`);
    add(`  Bandwidth: ${conn.bandwidth.toLocaleString()} Kbps`);
    add(`  RTT: ${conn.rtt}ms`);
    add(
      `  Metered: ${["2G", "3G", "4G", "5G"].includes(connType) ? "YES" : "NO"}`,
    );
    add(`  Online: ${connType !== "Offline" ? "YES" : "NO"}`);
  }, [add, connType, conn]);

  /* ── Adaptive Quality ─────────────────────────────────────── */
  const demoAdaptive = useCallback(() => {
    const imgQuality =
      conn.quality <= 14
        ? "Placeholder"
        : conn.quality <= 30
          ? "Low (144p)"
          : conn.quality <= 60
            ? "Medium (480p)"
            : conn.quality <= 80
              ? "High (1080p)"
              : "Original";
    const timeout =
      conn.quality === 0
        ? "0s (offline)"
        : conn.quality <= 20
          ? "60s"
          : conn.quality <= 40
            ? "30s"
            : conn.quality <= 70
              ? "15s"
              : conn.quality <= 90
                ? "10s"
                : "5s";
    add(`── Adaptive Suggestions (${connType}) ──`);
    add(`  Image Quality: ${imgQuality}`);
    add(`  Timeout: ${timeout}`);
    add(`  Should compress: ${conn.bandwidth < 5000 ? "YES" : "NO"}`);
  }, [add, connType, conn]);

  /* ── Request Queue ────────────────────────────────────────── */
  const demoQueue = useCallback(() => {
    add("── Request Queue ──");
    add("  enqueue(POST, /api/payment, Critical) → req-001");
    add("  enqueue(POST, /api/analytics, Low)    → req-002");
    add("  enqueue(PUT,  /api/profile, Normal)   → req-003");
    add("  Queue size: 3");
    add("  dequeue() → req-001 (Critical first)");
    add("  complete(req-001) → true ✅");
    add("  fail(req-002) → retry in 4s (exponential backoff)");
    add('  cancelByTag("analytics") → 1 cancelled');
  }, [add]);

  /* ── Priority System ──────────────────────────────────────── */
  const demoPriority = useCallback(() => {
    add("── Priority Levels ──");
    add("  Critical: ∞ retries, min quality 1  (payments, auth)");
    add("  High:     5 retries, min quality 10 (user actions)");
    add("  Normal:   3 retries, min quality 20 (API calls)");
    add("  Low:      1 retry,   min quality 50 (analytics)");
    add(
      `  Current quality: ${conn.quality} → ` +
        `${conn.quality >= 50 ? "All" : conn.quality >= 20 ? "Normal+" : conn.quality >= 10 ? "High+" : conn.quality >= 1 ? "Critical only" : "None"} can send`,
    );
  }, [add, conn]);

  /* ── HTTP Cache ───────────────────────────────────────────── */
  const demoCache = useCallback(() => {
    add("── HTTP Cache ──");
    add("  cache(GET, /api/users, 200, body, ttl=300s) → ✅");
    add("  get(GET, /api/users) → HIT (status=200, age=42s)");
    add("  get(GET, /api/unknown) → MISS");
    add("  stats: { entries: 12, size: 45KB, hitRate: 0.78 }");
    add("  invalidate(GET, /api/users) → true");
    add("  cleanup() → 3 expired entries removed");
  }, [add]);

  /* ── Compression ──────────────────────────────────────────── */
  const demoCompression = useCallback(() => {
    const original = JSON.stringify({
      users: Array(50).fill({ name: "Rajeev", email: "r@r.com" }),
    });
    add("── Compression ──");
    add(`  Original: ${original.length.toLocaleString()} bytes`);
    add(
      `  Compressed: ~${Math.round(original.length * 0.15).toLocaleString()} bytes`,
    );
    add(`  Ratio: ~85% reduction (flate2/gzip)`);
    add("  shouldCompress(payload) → true (> 1KB repetitive)");
  }, [add]);

  /* ── Bandwidth Estimation ─────────────────────────────────── */
  const demoBandwidth = useCallback(() => {
    add("── Bandwidth Estimator ──");
    add("  recordTransfer(100KB, 100ms) → 8000 Kbps");
    add("  recordTransfer(50KB, 200ms)  → 2000 Kbps");
    add("  recordTransfer(200KB, 80ms)  → 20000 Kbps");
    add("  estimateKbps() → ~14200 (EWMA weighted)");
  }, [add]);

  return (
    <Screen
      title="Network"
      subtitle="Connectivity-aware networking with priority queue, HTTP cache, and adaptive quality."
      onBack={onBack}
    >
      <SectionHeader title="Connection Simulator" />
      <Card title={`Current: ${connType}`}>
        <Row label="Quality" value={`${conn.quality}/100`} />
        <Row
          label="Bandwidth"
          value={`${conn.bandwidth.toLocaleString()} Kbps`}
        />
        <Row label="RTT" value={`${conn.rtt}ms`} />
        {Object.keys(connections).map((type) => (
          <Button
            key={type}
            title={type}
            variant={connType === type ? "primary" : "secondary"}
            onPress={() => setConnType(type)}
          />
        ))}
      </Card>

      <SectionHeader title="Connectivity" />
      <Card>
        <Button title="Show Status" onPress={demoStatus} />
        <Button title="Adaptive Suggestions" onPress={demoAdaptive} />
        <Button title="Bandwidth Estimation" onPress={demoBandwidth} />
      </Card>

      <SectionHeader title="Request Queue" />
      <Card>
        <Button title="Queue Operations" onPress={demoQueue} />
        <Button title="Priority System" onPress={demoPriority} />
      </Card>

      <SectionHeader title="Cache & Compression" />
      <Card>
        <Button title="HTTP Cache" onPress={demoCache} />
        <Button title="Compression" onPress={demoCompression} />
      </Card>

      <Button
        title="Clear Log"
        onPress={() => setLog([])}
        variant="secondary"
      />
      <OutputLog lines={log} />
    </Screen>
  );
}
