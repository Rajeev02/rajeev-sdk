import SwiftUI

// In production, import the UniFFI-generated module:
// import RajeevSync

struct SyncDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Sync")
                .font(.title)
                .fontWeight(.bold)
            Text("CRDT documents & conflict resolution via Rust + UniFFI")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Document
                    sectionHeader("CRDT Document")

                    Button("Create Document") {
                        // In production:
                        // let doc = try RajeevSync.createDocument(id: "cart-001", schema: .lwwMap)
                        log("📄 CRDT document created")
                        log("   ID: cart-001")
                        log("   Type: LWW-Element-Map")
                        log("   Node ID: A (this device)")
                        log("   HLC: 2026-02-08T10:00:00.000Z/0/A")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Set Field: 'item'") {
                        // In production:
                        // try doc.set(field: "item", value: .string("Masala Dosa"))
                        log("✏️ Set field on Node A:")
                        log("   field: \"item\" → \"Masala Dosa\"")
                        log("   HLC: 2026-02-08T10:00:01.000Z/0/A")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Set Field: 'qty'") {
                        // In production:
                        // try doc.set(field: "qty", value: .int(2))
                        log("✏️ Set field on Node A:")
                        log("   field: \"qty\" → 2")
                        log("   HLC: 2026-02-08T10:00:02.000Z/0/A")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Conflict Resolution
                    sectionHeader("Conflict Resolution")

                    Button("Simulate Remote Edit (Node B)") {
                        // In production:
                        // let remoteOp = SyncOperation(
                        //     field: "qty", value: .int(5),
                        //     hlc: HybridLogicalClock(ts: ..., counter: 0, nodeId: "B")
                        // )
                        // try doc.applyRemote(op: remoteOp)
                        log("📡 Remote operation received from Node B:")
                        log("   field: \"qty\" → 5")
                        log("   HLC: 2026-02-08T10:00:02.500Z/0/B")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    Button("Merge & Resolve") {
                        // In production:
                        // let merged = try doc.merge()
                        log("🔀 Merge conflict detected on field: \"qty\"")
                        log("   Local (A):  qty = 2  @ …02.000Z/0/A")
                        log("   Remote (B): qty = 5  @ …02.500Z/0/B")
                        log("   ─────────────────────────────────")
                        log("   Winner: Node B (later HLC timestamp)")
                        log("   Resolved: qty = 5")
                        log("   Strategy: Last-Writer-Wins (LWW)")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.purple)

                    // MARK: – Diff View
                    sectionHeader("Diff View")

                    Button("Show Document State") {
                        // In production:
                        // let state = try doc.snapshot()
                        log("📋 Document Snapshot (cart-001):")
                        log("   ┌──────────┬───────────────┬─────────────────────┐")
                        log("   │ Field    │ Value         │ HLC                 │")
                        log("   ├──────────┼───────────────┼─────────────────────┤")
                        log("   │ item     │ Masala Dosa   │ …01.000Z/0/A        │")
                        log("   │ qty      │ 5             │ …02.500Z/0/B        │")
                        log("   └──────────┴───────────────┴─────────────────────┘")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Show Operation Log") {
                        // In production:
                        // let ops = try doc.operationLog()
                        log("📜 Operation Log (4 entries):")
                        log("   1. CREATE  cart-001       @ …00.000Z/0/A")
                        log("   2. SET     item=Masala…   @ …01.000Z/0/A")
                        log("   3. SET     qty=2          @ …02.000Z/0/A")
                        log("   4. MERGE   qty=5 (B wins) @ …02.500Z/0/B")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Compute Diff (A vs B)") {
                        // In production:
                        // let diff = try RajeevSync.diff(local: docA, remote: docB)
                        log("🔍 Diff (local vs remote):")
                        log("   ~ qty: 2 → 5  (conflict, remote wins)")
                        log("   = item: unchanged (\"Masala Dosa\")")
                        log("   Δ Total changes: 1 modified, 1 unchanged")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Sync")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: – Helpers

    private func log(_ message: String) {
        logs.append("[\(timestamp)] \(message)")
    }

    private var timestamp: String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm:ss.SSS"
        return f.string(from: Date())
    }

    @ViewBuilder
    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(.headline)
            .foregroundStyle(.primary)
            .padding(.top, 4)
    }

    private var clearLogButton: some View {
        Button("Clear Log", role: .destructive) {
            logs.removeAll()
        }
        .buttonStyle(.bordered)
    }

    private var logOutputView: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 2) {
                    ForEach(Array(logs.enumerated()), id: \.offset) { index, entry in
                        Text(entry)
                            .font(.system(.caption, design: .monospaced))
                            .foregroundColor(.green)
                            .id(index)
                    }
                }
                .padding(8)
            }
            .frame(maxHeight: 200)
            .background(Color.black)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .padding(.horizontal)
            .padding(.bottom, 8)
            .onChange(of: logs.count) { _ in
                if let last = logs.indices.last {
                    proxy.scrollTo(last, anchor: .bottom)
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        SyncDemoView()
    }
}
