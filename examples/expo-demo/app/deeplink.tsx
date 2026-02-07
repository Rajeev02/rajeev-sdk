/**
 * DeepLink Demo — @rajeev02/deeplink
 *
 * Demonstrates the full DeepLink API: router setup, route matching,
 * link generation, universal links, and deferred deep links.
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

export default function DeepLinkDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Initialize Router ────────────────────────────────────── */
  const demoInitRouter = useCallback(() => {
    add("── Router.init ──");
    add("  scheme: myapp://");
    add("  domains: [myapp.com, myapp.page.link]");
    add("  Registering routes…");
    add("  19 common routes registered ✅");
    add("  Router initialized");
  }, [add]);

  /* ── Set Ready ────────────────────────────────────────────── */
  const demoSetReady = useCallback(() => {
    add("── Router.setReady ──");
    add("  App marked ready ✅");
    add("  Processing deferred links…");
    add("  No deferred links pending");
  }, [add]);

  /* ── Handle: product ──────────────────────────────────────── */
  const demoHandleProduct = useCallback(() => {
    add("── Router.handle ──");
    add("  input: myapp://product/123");
    add('  ✅ Match → ProductScreen, params: { id: "123" }');
  }, [add]);

  /* ── Handle: pay ──────────────────────────────────────────── */
  const demoHandlePay = useCallback(() => {
    add("── Router.handle ──");
    add("  input: myapp://pay/rajeev@upi");
    add('  ✅ Match → PayScreen, params: { vpa: "rajeev@upi" }');
  }, [add]);

  /* ── Handle: order track ──────────────────────────────────── */
  const demoHandleTrack = useCallback(() => {
    add("── Router.handle ──");
    add("  input: myapp://order/ORD456/track");
    add('  ✅ Match → TrackScreen, params: { orderId: "ORD456" }');
  }, [add]);

  /* ── Handle: unknown ──────────────────────────────────────── */
  const demoHandleUnknown = useCallback(() => {
    add("── Router.handle ──");
    add("  input: myapp://unknown");
    add("  ❌ No matching route found");
    add("  onNoMatch callback invoked → redirect to HomeScreen");
  }, [add]);

  /* ── Generate App Link ────────────────────────────────────── */
  const demoAppLink = useCallback(() => {
    add("── Router.generateLink ──");
    add('  route: "product", params: { id: "789" }');
    add("  → myapp://product/789 ✅");
  }, [add]);

  /* ── Generate Universal Link ──────────────────────────────── */
  const demoUniversalLink = useCallback(() => {
    add("── Router.generateUniversalLink ──");
    add('  route: "product", params: { id: "789" }');
    add("  → https://myapp.com/product/789 ✅");
  }, [add]);

  /* ── Generate with UTM ────────────────────────────────────── */
  const demoUTMLink = useCallback(() => {
    add("── Router.generateLink (UTM) ──");
    add('  route: "product", params: { id: "789" }');
    add('  utm: { source: "email", campaign: "sale" }');
    add("  → myapp://product/789?utm_source=email&utm_campaign=sale ✅");
  }, [add]);

  /* ── Deferred Link ────────────────────────────────────────── */
  const demoDeferredLink = useCallback(() => {
    add("── Router.getDeferredLink ──");
    add("  Cold-start link detected:");
    add("    url: myapp://product/42");
    add("    referrer: com.android.chrome");
    add('    attribution: { channel: "social", campaign: "launch" }');
    add("  ✅ Deferred link consumed");
  }, [add]);

  return (
    <Screen
      title="DeepLink"
      subtitle="Route matching, universal links, link generation, and deferred deep links."
      onBack={onBack}
    >
      <SectionHeader title="Router Setup" />
      <Card title="Initialize">
        <Row label="Scheme" value="myapp://" />
        <Row label="Routes" value="19" />
        <Row label="Domains" value="2" />
        <Button title="Initialize Router" onPress={demoInitRouter} />
        <Button title="Set Ready" onPress={demoSetReady} />
      </Card>

      <SectionHeader title="Route Matching" />
      <Card title="Handle URLs">
        <Button
          title="Handle: myapp://product/123"
          onPress={demoHandleProduct}
        />
        <Button
          title="Handle: myapp://pay/rajeev@upi"
          onPress={demoHandlePay}
        />
        <Button
          title="Handle: myapp://order/ORD456/track"
          onPress={demoHandleTrack}
        />
        <Button title="Handle: myapp://unknown" onPress={demoHandleUnknown} />
      </Card>

      <SectionHeader title="Link Generation" />
      <Card title="Generate Links">
        <Button title="Generate App Link" onPress={demoAppLink} />
        <Button title="Generate Universal Link" onPress={demoUniversalLink} />
        <Button title="Generate with UTM" onPress={demoUTMLink} />
      </Card>

      <SectionHeader title="Deferred Links" />
      <Card title="Cold-Start Attribution">
        <Button title="Get Deferred Link" onPress={demoDeferredLink} />
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
