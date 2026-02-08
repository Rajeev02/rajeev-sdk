import SwiftUI

/// Network demo for watchOS: connectivity status, priority queue, health data sync.
struct NetworkWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🌐 Network").font(.headline)

                Button("Check Connectivity") {
                    log("network.getStatus()")
                    log("→ { connected: true, type: \"bluetooth+wifi\" }")
                }
                .buttonStyle(.bordered)

                Button("Send Health Data") {
                    log("network.enqueue({")
                    log("  url: \"/api/health\",")
                    log("  priority: \"high\",")
                    log("  payload: { hr: 72, steps: 1204 }")
                    log("})")
                    log("✅ Queued – will sync via phone")
                }
                .buttonStyle(.bordered)

                Button("Queue Count") {
                    log("network.queueCount() → 3 pending")
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
        .navigationTitle("Network")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    NetworkWatchDemo()
}
