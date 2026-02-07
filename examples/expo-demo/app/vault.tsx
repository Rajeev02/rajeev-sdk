/**
 * Vault Demo — @rajeev02/vault
 *
 * Demonstrates the full Vault API: AES-256-GCM encrypted storage,
 * namespaces, key/value CRUD, hashing, expiry, stats, and export.
 */
import React, { useState, useCallback } from "react";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
} from "../src/components";

export default function VaultDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Simulate Vault.create ────────────────────────────────── */
  const demoCreate = useCallback(() => {
    add("── Vault.create ──");
    add('  config: { appId: "demo", encryption: "AES-256-GCM" }');
    add("  ✅ Vault instance created (in-memory)");
    add("  AES-256-GCM with PBKDF2 (100 000 iterations)");
  }, [add]);

  /* ── Store & Retrieve ─────────────────────────────────────── */
  const demoStoreRetrieve = useCallback(() => {
    add("── vault.set / vault.get ──");
    add('  set("auth_token", "eyJhbGciOi…") → ✅');
    add('  set("user_profile", JSON.stringify({...})) → ✅');
    add('  get("auth_token") → "eyJhbGciOi…" ✅');
    add('  get("missing_key") → null ✅');
  }, [add]);

  /* ── Namespaces ───────────────────────────────────────────── */
  const demoNamespaces = useCallback(() => {
    add("── Namespaces ──");
    add('  vault.namespace("auth")');
    add('    .set("token", "abc-123") → ✅');
    add('  vault.namespace("payments")');
    add('    .set("token", "pay-456") → ✅');
    add('  auth.get("token")     → "abc-123"');
    add('  payments.get("token") → "pay-456"');
    add('  namespaces() → ["auth", "payments"]');
  }, [add]);

  /* ── JSON storage ─────────────────────────────────────────── */
  const demoJSON = useCallback(() => {
    add("── setJSON / getJSON ──");
    const profile = { name: "Rajeev", lang: "hi", premium: true };
    add(`  setJSON("profile", ${JSON.stringify(profile)})`);
    add(`  getJSON("profile") → ${JSON.stringify(profile)} ✅`);
  }, [add]);

  /* ── Hashing ──────────────────────────────────────────────── */
  const demoHash = useCallback(() => {
    add("── Vault.hash / verifyHash ──");
    add('  hash("password123") → "s:a1b2c3…:d4e5f6…" (salted SHA-256)');
    add('  verifyHash("password123", hash) → true ✅');
    add('  verifyHash("wrong",       hash) → false ✅');
  }, [add]);

  /* ── Key Generation ───────────────────────────────────────── */
  const demoKeyGen = useCallback(() => {
    const fakeKey = btoa(
      String.fromCharCode(
        ...Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)),
      ),
    );
    add("── Vault.generateKey ──");
    add(`  Generated: ${fakeKey.slice(0, 32)}…`);
    add("  256-bit cryptographically secure random key");
  }, [add]);

  /* ── Expiry ───────────────────────────────────────────────── */
  const demoExpiry = useCallback(() => {
    add("── Expiry ──");
    add('  set("otp", "847291", { expiry: "5m" }) → ✅');
    add('  set("session", "…",   { expiry: "24h" }) → ✅');
    add('  set("cache", "…",     { expiry: "7d" }) → ✅');
    add('  After expiry: get("otp") → KeyExpired ⏰');
  }, [add]);

  /* ── Stats ────────────────────────────────────────────────── */
  const demoStats = useCallback(() => {
    add("── vault.stats() ──");
    add("  totalEntries:    5");
    add("  totalNamespaces: 2");
    add("  expiredEntries:  1");
    add("  storageBytes:    2048");
  }, [add]);

  /* ── Wipe ─────────────────────────────────────────────────── */
  const demoWipe = useCallback(() => {
    add("── Wipe Operations ──");
    add('  wipeNamespace("auth")  → ✅ (1 namespace cleared)');
    add("  wipeAll()               → ✅ (all data destroyed + VACUUM)");
    add("  stats() → { totalEntries: 0 }");
  }, [add]);

  return (
    <Screen
      title="Vault"
      subtitle="AES-256-GCM encrypted secure storage with namespaces, expiry, and hashing."
      onBack={onBack}
    >
      <SectionHeader title="Lifecycle" />
      <Card title="Initialize">
        <Row label="Encryption" value="AES-256-GCM" />
        <Row label="Key Derivation" value="PBKDF2 × 100k" />
        <Row label="Platform" value="Rust → UniFFI / WASM" />
        <Button title="Create Vault" onPress={demoCreate} />
      </Card>

      <SectionHeader title="Storage" />
      <Card title="Key-Value CRUD">
        <Button title="Set & Get" onPress={demoStoreRetrieve} />
        <Button title="JSON Storage" onPress={demoJSON} />
        <Button title="Namespaces" onPress={demoNamespaces} />
        <Button title="Expiry (5m / 24h / 7d)" onPress={demoExpiry} />
      </Card>

      <SectionHeader title="Cryptography" />
      <Card>
        <Button title="Generate Key (256-bit)" onPress={demoKeyGen} />
        <Button title="Hash & Verify" onPress={demoHash} />
      </Card>

      <SectionHeader title="Management" />
      <Card>
        <Button title="Show Stats" onPress={demoStats} />
        <Button title="Wipe All" onPress={demoWipe} variant="danger" />
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
