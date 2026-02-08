import SwiftUI

/// Sync demo for watchOS: fitness document CRDT, merge with phone, last sync time.
struct SyncWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🔄 Sync").font(.headline)

                Button("Create Fitness Doc") {
                    log("sync.createDoc(\"fitness-2026-02-08\")")
                    log("✅ CRDT document created")
                }
                .buttonStyle(.bordered)

                Button("Add Steps + HR") {
                    log("doc.set(\"steps\", 4821)")
                    log("doc.set(\"heartRate\", 72)")
                    log("HLC: 2026-02-08T10:30:00.000Z-0001")
                }
                .buttonStyle(.bordered)

                Button("Sync to Phone") {
                    log("sync.merge(phoneDoc, watchDoc)")
                    log("✅ No conflicts – merged cleanly")
                }
                .buttonStyle(.bordered)

                Button("Last Sync Time") {
                    log("sync.lastSync() → 2 min ago")
                }
                .buttonStyle(.bordered)

                Divider()

                VStack(alignment: .leading, spacing: 2) {
                    ForEach(logs, id: \.self) { entry in
                        Text(entry)
                            .font(.caption)
                            .monospaced()
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle("Sync")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    SyncWatchDemo()
}
