/**
 * Sync Demo — @rajeev02/sync
 *
 * Demonstrates offline-first sync: CRDT documents, Hybrid Logical Clock,
 * operation log, conflict resolution, and multi-device merge.
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

export default function SyncDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── CRDT Document ────────────────────────────────────────── */
  const demoCRDT = useCallback(() => {
    add("── CRDT Document ──");
    add('  doc = CrdtDocument.new("tasks", "doc-001")');
    add('  doc.setField("title", "Buy groceries")');
    add('  doc.setField("done",  "false")');
    add('  doc.setField("assignee", "Rajeev")');
    add(
      `  doc.toJSON() → ${JSON.stringify({ id: "doc-001", title: "Buy groceries", done: "false", assignee: "Rajeev" })}`,
    );
  }, [add]);

  /* ── Hybrid Logical Clock ─────────────────────────────────── */
  const demoHLC = useCallback(() => {
    const ts = Date.now();
    add("── Hybrid Logical Clock ──");
    add(`  HLC.new("device-A")`);
    add(`  hlc.next() → { ts: ${ts}, counter: 0, node: "device-A" }`);
    add(`  hlc.next() → { ts: ${ts}, counter: 1, node: "device-A" }`);
    add("");
    add("  HLC merges physical + logical time for causal ordering");
    add("  Guarantees unique timestamps even with clock skew");
  }, [add]);

  /* ── Storage Operations ───────────────────────────────────── */
  const demoStorage = useCallback(() => {
    add("── SyncStorage CRUD ──");
    add('  storage = SyncStorage.new(":memory:", "device-A")');
    add('  insert("tasks", {title:"Cook dinner"}) → "uuid-001"');
    add('  insert("tasks", {title:"Read book"})   → "uuid-002"');
    add('  get("tasks", "uuid-001") → {title:"Cook dinner"} ✅');
    add('  update("tasks", "uuid-001", "done", "true") → ✅');
    add('  query("tasks", limit=10) → [2 docs]');
    add('  delete("tasks", "uuid-002") → true (soft-delete)');
  }, [add]);

  /* ── Operation Log ────────────────────────────────────────── */
  const demoOpLog = useCallback(() => {
    add("── Operation Log ──");
    add("  Every mutation is recorded in the op_log:");
    add("  [Insert] tasks/uuid-001 @ HLC(ts:1707312000, c:0)");
    add("  [Insert] tasks/uuid-002 @ HLC(ts:1707312001, c:0)");
    add('  [Update] tasks/uuid-001 done="true" @ HLC(ts:1707312002, c:0)');
    add("  [Delete] tasks/uuid-002 @ HLC(ts:1707312003, c:0)");
    add("");
    add("  getUnsyncedOps(100) → 4 pending operations");
    add('  markSynced(["op1","op2"]) → 2 marked ✅');
  }, [add]);

  /* ── Conflict Resolution ──────────────────────────────────── */
  const demoConflict = useCallback(() => {
    add("── Conflict Resolution (LWW) ──");
    add('  Device A: setField("title", "Cook pasta")  @ HLC(ts:100, c:0, A)');
    add('  Device B: setField("title", "Cook risotto") @ HLC(ts:101, c:0, B)');
    add("");
    add("  doc.merge(remoteDoc) →");
    add('    title: "Cook risotto" (Remote wins — later HLC)');
    add("");
    add("  Tie-breaking: ts > counter > nodeId (lexicographic)");
    add("  Result: deterministic across all devices");
  }, [add]);

  /* ── Multi-Device Sync Scenario ───────────────────────────── */
  const demoMultiDevice = useCallback(() => {
    add("── Multi-Device Sync ──");
    add("");
    add("  📱 Device A (phone):");
    add('     Creates "Buy milk" → uuid-abc');
    add("     Goes offline ✈️");
    add('     Updates "Buy milk" → "Buy oat milk"');
    add("");
    add("  💻 Device B (laptop):");
    add('     Sees "Buy milk" (synced earlier)');
    add('     Updates "Buy milk" → "Buy almond milk"');
    add("");
    add("  🔄 Both come online:");
    add("     Exchange op_logs via server");
    add("     HLC comparison: B wins (later timestamp)");
    add('     Both converge: "Buy almond milk" ✅');
  }, [add]);

  /* ── Stats ────────────────────────────────────────────────── */
  const demoStats = useCallback(() => {
    add("── Sync Stats ──");
    add("  getStats() → {");
    add("    total_documents:     8,");
    add("    total_operations:   24,");
    add("    unsynced_operations: 3,");
    add("    collections:         2");
    add("  }");
    add("  purgeOldOps(24) → 12 old synced ops purged");
  }, [add]);

  return (
    <Screen
      title="Sync"
      subtitle="Offline-first sync engine with CRDT conflict resolution and Hybrid Logical Clock."
      onBack={onBack}
    >
      <SectionHeader title="Data Model" />
      <Card title="CRDT Documents">
        <Row label="Strategy" value="Last-Writer-Wins (LWW)" />
        <Row label="Clock" value="Hybrid Logical Clock" />
        <Row label="Storage" value="SQLite (bundled)" />
        <Button title="CRDT Document" onPress={demoCRDT} />
        <Button title="Hybrid Logical Clock" onPress={demoHLC} />
      </Card>

      <SectionHeader title="Storage" />
      <Card>
        <Button title="CRUD Operations" onPress={demoStorage} />
        <Button title="Operation Log" onPress={demoOpLog} />
        <Button title="Show Stats" onPress={demoStats} />
      </Card>

      <SectionHeader title="Conflict Resolution" />
      <Card>
        <Button title="LWW Merge" onPress={demoConflict} />
        <Button title="Multi-Device Scenario" onPress={demoMultiDevice} />
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
