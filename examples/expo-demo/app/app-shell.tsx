/**
 * App Shell Demo — @rajeev02/app-shell
 *
 * Demonstrates the full App Shell API: API client with caching, onboarding flows,
 * real-time chat, cart & checkout, feature flags, form validation, and analytics.
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

export default function AppShellDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── API Client ───────────────────────────────────────────── */
  const demoCreateClient = useCallback(() => {
    add("── APIClient.create ──");
    add("  baseURL: https://api.example.com/v1");
    add("  timeout: 30s");
    add("  retries: 5 (exponential backoff)");
    add("  ✅ API client initialized");
  }, [add]);

  const demoGet = useCallback(() => {
    add("── APIClient.GET /products ──");
    add("  status: 200 OK");
    add("  source: cache (stale-while-revalidate)");
    add("  latency: 145 ms");
    add('  body: [{ id: 1, name: "iPhone 16" }, …]');
    add("  ✅ Cached response returned");
  }, [add]);

  const demoPost = useCallback(() => {
    add("── APIClient.POST /orders ──");
    add("  headers: { Authorization: Bearer eyJ… }");
    add("  interceptor: auth header injected");
    add("  status: 201 Created");
    add('  body: { orderId: "ORD-2026-001" }');
    add("  ✅ Order created");
  }, [add]);

  const demoCacheStrategy = useCallback(() => {
    add("── APIClient.showCacheStrategy ──");
    add("  strategy: stale-while-revalidate");
    add("  TTL: 5 min");
    add("  revalidation: background fetch");
    add("  ✅ Cache config displayed");
  }, [add]);

  /* ── Onboarding ───────────────────────────────────────────── */
  const demoSplash = useCallback(() => {
    add("── Onboarding.showSplash ──");
    add("  duration: 3s");
    add("  logo: ✓ displayed");
    add('  tagline: "Build faster with Rajeev SDK"');
    add("  ✅ Splash screen shown");
  }, [add]);

  const demoStartOnboarding = useCallback(() => {
    add("── Onboarding.start ──");
    add("  slide 1/4: Welcome — get started with the app");
    add("  slide 2/4: Discover — explore products & deals");
    add("  slide 3/4: Pay — seamless checkout experience");
    add("  slide 4/4: Secure — your data is encrypted");
    add("  ✅ Onboarding flow completed");
  }, [add]);

  const demoTooltip = useCallback(() => {
    add("── Onboarding.showTooltip ──");
    add('  target: "Scan" button');
    add('  message: "Tap here to scan any QR or barcode"');
    add("  type: feature discovery");
    add("  ✅ Tooltip displayed");
  }, [add]);

  const demoMarkCompleted = useCallback(() => {
    add("── Onboarding.markCompleted ──");
    add("  flag: onboarding_complete = true");
    add("  ✅ Will not show again");
  }, [add]);

  /* ── Chat ─────────────────────────────────────────────────── */
  const demoCreateRoom = useCallback(() => {
    add("── Chat.createRoom ──");
    add("  roomId: room_123");
    add("  participants: 3");
    add("  type: group");
    add("  ✅ Chat room created");
  }, [add]);

  const demoSendMessage = useCallback(() => {
    add("── Chat.sendMessage ──");
    add("  type: text");
    add('  body: "Hey, order shipped!"');
    add("  status: sent → delivered → read");
    add("  ✅ Message delivered");
  }, [add]);

  const demoSendImage = useCallback(() => {
    add("── Chat.sendImage ──");
    add("  type: media (image)");
    add("  thumbnail: generated (120×120)");
    add("  upload: complete");
    add("  ✅ Image message sent");
  }, [add]);

  const demoTypingIndicator = useCallback(() => {
    add("── Chat.typingIndicator ──");
    add("  user is typing…");
    add("  timeout: 5s");
    add("  ✅ Typing indicator shown");
  }, [add]);

  const demoSearchMessages = useCallback(() => {
    add("── Chat.searchMessages ──");
    add('  query: "payment"');
    add("  results: 5 messages found");
    add('  [1] "Payment received for ₹1,200"');
    add('  [2] "Payment pending for order #45"');
    add('  [3] "Payment method updated"');
    add("  …and 2 more");
    add("  ✅ Search complete");
  }, [add]);

  const demoReactToMessage = useCallback(() => {
    add("── Chat.reactToMessage ──");
    add("  reaction: 👍");
    add("  message: last message");
    add("  ✅ Reaction added");
  }, [add]);

  /* ── Cart & Checkout ──────────────────────────────────────── */
  const demoAddToCart = useCallback(() => {
    add("── Cart.addItem ──");
    add("  item: iPhone 16");
    add("  qty: 1");
    add("  price: ₹79,999");
    add("  ✅ Added to cart");
  }, [add]);

  const demoAddAnother = useCallback(() => {
    add("── Cart.addItem ──");
    add("  item: AirPods Pro");
    add("  qty: 2");
    add("  price: ₹24,999 each");
    add("  ✅ Added to cart");
  }, [add]);

  const demoApplyCoupon = useCallback(() => {
    add("── Cart.applyCoupon ──");
    add('  code: "SAVE10"');
    add("  discount: -10%");
    add("  ✅ Coupon applied");
  }, [add]);

  const demoViewSummary = useCallback(() => {
    add("── Cart.viewSummary ──");
    add("  subtotal:    ₹1,29,997");
    add("  GST (18%):   ₹23,399");
    add("  discount:    -₹12,999");
    add("  ─────────────────────");
    add("  total:       ₹1,40,397");
  }, [add]);

  const demoPlaceOrder = useCallback(() => {
    add("── Checkout.placeOrder ──");
    add("  orderId: ORD-2026-001");
    add("  total: ₹1,40,397");
    add("  status: confirmed");
    add("  ✅ Order placed successfully");
  }, [add]);

  /* ── Feature Flags ────────────────────────────────────────── */
  const demoCheckDarkMode = useCallback(() => {
    add("── FeatureFlags.check ──");
    add('  flag: "dark_mode"');
    add("  enabled: true");
    add("  rollout: 100%");
    add("  ✅ Flag is ON");
  }, [add]);

  const demoCheckNewCheckout = useCallback(() => {
    add("── FeatureFlags.check ──");
    add('  flag: "new_checkout"');
    add("  enabled: true");
    add("  type: A/B test");
    add("  rollout: 50%");
    add("  variant: B");
    add("  ✅ Assigned to variant B");
  }, [add]);

  const demoListFlags = useCallback(() => {
    add("── FeatureFlags.listAll ──");
    add("  [1] dark_mode       — enabled  (100%)");
    add("  [2] new_checkout    — A/B test (50%)");
    add("  [3] redesigned_home — enabled  (80%)");
    add("  [4] voice_search    — disabled (0%)");
    add("  [5] quick_pay       — enabled  (100%)");
    add("  ✅ 5 flags loaded");
  }, [add]);

  /* ── Forms ────────────────────────────────────────────────── */
  const demoLoadKYCForm = useCallback(() => {
    add("── Forms.loadKYCForm ──");
    add("  step 1/4: Personal — name, DOB, gender");
    add("  step 2/4: Address — line1, line2, city, state, pin");
    add("  step 3/4: Documents — Aadhaar, PAN upload");
    add("  step 4/4: Verification — OTP + selfie");
    add("  ✅ KYC form loaded (4 steps)");
  }, [add]);

  const demoValidateAadhaar = useCallback(() => {
    add("── Forms.validateAadhaar ──");
    add("  input: 1234 5678 9012");
    add("  checksum: valid");
    add("  format: valid (12 digits)");
    add("  ✅ Aadhaar number is valid");
  }, [add]);

  const demoValidatePAN = useCallback(() => {
    add("── Forms.validatePAN ──");
    add("  input: ABCPE1234F");
    add("  format: valid (AAAAA9999A)");
    add("  type: Individual");
    add("  ✅ PAN is valid");
  }, [add]);

  const demoValidateIFSC = useCallback(() => {
    add("── Forms.validateIFSC ──");
    add("  input: SBIN0001234");
    add("  bank: State Bank of India");
    add("  format: valid");
    add("  ✅ IFSC code is valid");
  }, [add]);

  const demoValidatePincode = useCallback(() => {
    add("── Forms.validatePincode ──");
    add("  input: 400001");
    add("  city: Mumbai");
    add("  state: Maharashtra");
    add("  ✅ Pincode is valid");
  }, [add]);

  /* ── Analytics ────────────────────────────────────────────── */
  const demoTrackScreen = useCallback(() => {
    add("── Analytics.trackScreenView ──");
    add("  screen: home_screen");
    add("  timestamp: " + new Date().toISOString());
    add("  ✅ Screen view tracked");
  }, [add]);

  const demoTrackPurchase = useCallback(() => {
    add("── Analytics.trackPurchase ──");
    add("  amount: ₹1,40,397");
    add("  orderId: ORD-2026-001");
    add("  items: 2 SKUs");
    add("  ✅ Purchase event tracked");
  }, [add]);

  const demoFlushEvents = useCallback(() => {
    add("── Analytics.flush ──");
    add("  events in queue: 3");
    add("  batch sent to server");
    add("  ✅ 3 events flushed successfully");
  }, [add]);

  return (
    <Screen
      title="App Shell"
      subtitle="API client, onboarding, chat, cart & checkout, feature flags, forms, and analytics."
      onBack={onBack}
    >
      <SectionHeader title="API Client" />
      <Card title="HTTP Client & Caching">
        <Row label="Modules" value="7" />
        <Row label="Form Fields" value="15+" />
        <Row label="Cache Strategies" value="4" />
        <Row label="Validators" value="6" />
        <Button title="Create Client" onPress={demoCreateClient} />
        <Button title="GET /products" onPress={demoGet} />
        <Button title="POST /orders" onPress={demoPost} />
        <Button title="Show Cache Strategy" onPress={demoCacheStrategy} />
      </Card>

      <SectionHeader title="Onboarding" />
      <Card title="Splash & Walkthroughs">
        <Button title="Show Splash" onPress={demoSplash} />
        <Button title="Start Onboarding" onPress={demoStartOnboarding} />
        <Button title="Show Tooltip" onPress={demoTooltip} />
        <Button title="Mark Completed" onPress={demoMarkCompleted} />
      </Card>

      <SectionHeader title="Chat" />
      <Card title="Real-Time Messaging">
        <Button title="Create Room" onPress={demoCreateRoom} />
        <Button title="Send Message" onPress={demoSendMessage} />
        <Button title="Send Image" onPress={demoSendImage} />
        <Button title="Typing Indicator" onPress={demoTypingIndicator} />
        <Button title="Search Messages" onPress={demoSearchMessages} />
        <Button title="React to Message" onPress={demoReactToMessage} />
      </Card>

      <SectionHeader title="Cart & Checkout" />
      <Card title="Shopping Cart">
        <Button title="Add to Cart" onPress={demoAddToCart} />
        <Button title="Add Another Item" onPress={demoAddAnother} />
        <Button title="Apply Coupon: SAVE10" onPress={demoApplyCoupon} />
        <Button title="View Summary" onPress={demoViewSummary} />
        <Button title="Place Order" onPress={demoPlaceOrder} />
      </Card>

      <SectionHeader title="Feature Flags" />
      <Card title="Remote Config & A/B Tests">
        <Button title="Check Flag: dark_mode" onPress={demoCheckDarkMode} />
        <Button
          title="Check Flag: new_checkout"
          onPress={demoCheckNewCheckout}
        />
        <Button title="List All Flags" onPress={demoListFlags} />
      </Card>

      <SectionHeader title="Forms" />
      <Card title="KYC & Validation">
        <Button title="Load KYC Form" onPress={demoLoadKYCForm} />
        <Button title="Validate Aadhaar" onPress={demoValidateAadhaar} />
        <Button title="Validate PAN" onPress={demoValidatePAN} />
        <Button title="Validate IFSC" onPress={demoValidateIFSC} />
        <Button title="Validate Pincode" onPress={demoValidatePincode} />
      </Card>

      <SectionHeader title="Analytics" />
      <Card title="Event Tracking">
        <Button title="Track Screen View" onPress={demoTrackScreen} />
        <Button title="Track Purchase" onPress={demoTrackPurchase} />
        <Button title="Flush Events" onPress={demoFlushEvents} />
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
