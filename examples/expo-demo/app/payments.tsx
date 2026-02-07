/**
 * Payments Demo — @rajeev02/payments
 *
 * Demonstrates the full Payments API: UPI payments, card validation,
 * UPI mandates, wallets, and subscription billing.
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

export default function PaymentsDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── UPI Payments ─────────────────────────────────────────── */
  const demoGenerateUPI = useCallback(() => {
    add("── UPI.generateURI ──");
    add("  payee: shop@paytm");
    add("  name: RajeevShop");
    add("  amount: ₹499.00");
    add("  txnNote: Order123");
    add("  ✅ URI generated:");
    add("  upi://pay?pa=shop@paytm&pn=RajeevShop&am=499.00&tn=Order123");
  }, [add]);

  const demoValidateVPA = useCallback(() => {
    add("── UPI.validateVPA ──");
    add('  vpa: "rajeev@okicici"');
    add("  ✅ VPA is valid");
    add("  accountHolder: Rajeev Joshi");
    add("  PSP: ICICI Bank");
    add("  handle: @okicici");
    add("  status: ACTIVE");
  }, [add]);

  const demoGenerateQR = useCallback(() => {
    add("── UPI.generateQR ──");
    add("  Encoding UPI URI to QR data…");
    add("  ✅ QR string generated:");
    add("  upi://pay?pa=shop@paytm&pn=RajeevShop&am=499.00&tn=Order123&cu=INR");
    add("  format: alphanumeric");
    add("  errorCorrection: M");
    add("  size: 256×256px");
  }, [add]);

  /* ── Card Payments ────────────────────────────────────────── */
  const demoDetectNetwork = useCallback(() => {
    add("── Cards.detectNetwork ──");
    add('  "4111…" → Visa');
    add('  "5500…" → Mastercard');
    add('  "6521…" → RuPay');
    add('  "3782…" → Amex');
    add("  ✅ All networks detected");
  }, [add]);

  const demoValidateCard = useCallback(() => {
    add("── Cards.validate ──");
    add('  number: "4111111111111111"');
    add("  Luhn checksum: ✅ valid");
    add("  network: Visa");
    add("  type: Credit");
    add("  issuer: (test card)");
  }, [add]);

  const demoFormatCard = useCallback(() => {
    add("── Cards.format ──");
    add('  input:  "4111111111111111"');
    add('  output: "4111 1111 1111 1111"');
    add("  grouping: [4, 4, 4, 4]");
  }, [add]);

  /* ── UPI Mandate ──────────────────────────────────────────── */
  const demoCreateMandate = useCallback(() => {
    add("── UPI.createMandate ──");
    add("  type: RECURRING");
    add("  amount: ₹999/month");
    add("  payer: rajeev@okaxis");
    add("  payee: merchant@ybl");
    add("  validity: 2026-02-07 → 2027-02-07");
    add("  ✅ Mandate created");
    add("  mandateId: mdt_r02x9k3m7p");
    add("  status: PENDING_APPROVAL");
    add("  approvalMode: UPI_COLLECT");
  }, [add]);

  /* ── Wallets ──────────────────────────────────────────────── */
  const demoListWallets = useCallback(() => {
    add("── Wallets.list ──");
    add("  Available wallet providers:");
    add("    1. Paytm           (balance: ₹1,240)");
    add("    2. PhonePe         (linked)");
    add("    3. Amazon Pay      (linked)");
    add("    4. Freecharge      (linked)");
    add("    5. Mobikwik        (linked)");
    add("    6. JioPay          (linked)");
  }, [add]);

  const demoCheckoutPaytm = useCallback(() => {
    add("── Wallets.checkout ──");
    add("  provider: Paytm");
    add("  ✅ Checkout payload:");
    add("  {");
    add('    orderId: "ORD_20260207_001",');
    add("    amount: 499.00,");
    add('    currency: "INR",');
    add('    callbackUrl: "https://api.rajeev.dev/pay/cb",');
    add('    merchantId: "MID_RAJEEV02",');
    add('    channel: "WAP"');
    add("  }");
    add("  Redirecting to Paytm checkout…");
  }, [add]);

  /* ── Subscriptions ────────────────────────────────────────── */
  const demoCalculateBilling = useCallback(() => {
    add("── Subscriptions.calculateBilling ──");
    add('  plan: "Pro Monthly"');
    add("  amount: ₹999/month");
    add("  currentPeriod: 2026-02-07 → 2026-03-06");
    add("  nextBillingDate: 2026-03-07");
    add("  daysRemaining: 27");
    add("  status: ACTIVE");
    add("  autoRenew: true");
  }, [add]);

  return (
    <Screen
      title="Payments"
      subtitle="UPI payments, card validation, wallets, mandates, and subscription billing for India."
      onBack={onBack}
    >
      <SectionHeader title="UPI Payments" />
      <Card title="UPI">
        <Badge label="UPI 2.0" />
        <Button title="Generate UPI URI" onPress={demoGenerateUPI} />
        <Button title="Validate VPA" onPress={demoValidateVPA} />
        <Button title="Generate QR Data" onPress={demoGenerateQR} />
      </Card>

      <SectionHeader title="Card Payments" />
      <Card title="Cards">
        <Button title="Detect Network" onPress={demoDetectNetwork} />
        <Button title="Validate Card" onPress={demoValidateCard} />
        <Button title="Format Card" onPress={demoFormatCard} />
      </Card>

      <SectionHeader title="UPI Mandate" />
      <Card title="Recurring Payments">
        <Button title="Create Mandate" onPress={demoCreateMandate} />
      </Card>

      <SectionHeader title="Wallets" />
      <Card title="Wallet Providers">
        <Button title="List Wallets" onPress={demoListWallets} />
        <Button title="Checkout with Paytm" onPress={demoCheckoutPaytm} />
      </Card>

      <SectionHeader title="Subscriptions" />
      <Card title="Billing">
        <Button title="Calculate Billing" onPress={demoCalculateBilling} />
      </Card>

      <SectionHeader title="Configuration" />
      <Card>
        <Row label="Supported Networks" value="5" />
        <Row label="PSP Handles" value="10+" />
        <Row label="Wallet Providers" value="6" />
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
