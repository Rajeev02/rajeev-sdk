import SwiftUI

// In production, import the UniFFI-generated module:
// import RajeevNetwork

struct NetworkDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Network")
                .font(.title)
                .fontWeight(.bold)
            Text("Priority queue, caching & compression via Rust + UniFFI")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Connectivity
                    sectionHeader("Connectivity")

                    Button("Check Connectivity") {
                        // In production:
                        // let status = try RajeevNetwork.checkConnectivity()
                        // status.isConnected, status.connectionType, status.effectiveBandwidth
                        log("📶 Connectivity check:")
                        log("   Connected: true")
                        log("   Type: WiFi (802.11ac)")
                        log("   Effective bandwidth: 45.2 Mbps")
                        log("   Latency: 12ms")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Start Monitoring") {
                        // In production:
                        // RajeevNetwork.startMonitoring { event in ... }
                        log("👁️ Network monitor started")
                        log("   Listening for connectivity changes…")
                        log("   Callback registered for: wifi, cellular, offline transitions")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Priority Queue
                    sectionHeader("Priority Queue")

                    HStack(spacing: 8) {
                        Button("High ⬆️") {
                            // In production:
                            // try queue.enqueue(request: req, priority: .high)
                            log("🔴 Enqueued HIGH priority request")
                            log("   POST /api/v1/payments/confirm")
                            log("   Queue position: 1 (immediate)")
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.red)

                        Button("Medium ➡️") {
                            // In production:
                            // try queue.enqueue(request: req, priority: .medium)
                            log("🟡 Enqueued MEDIUM priority request")
                            log("   GET /api/v1/catalog/products?page=2")
                            log("   Queue position: 3")
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.orange)

                        Button("Low ⬇️") {
                            // In production:
                            // try queue.enqueue(request: req, priority: .low)
                            log("🟢 Enqueued LOW priority request")
                            log("   GET /api/v1/analytics/session")
                            log("   Queue position: 5 (deferred)")
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.green)
                    }

                    Button("Flush Queue") {
                        // In production:
                        // let results = try queue.flush()
                        log("🚀 Queue flushed — 3 requests dispatched")
                        log("   ✅ POST /api/v1/payments/confirm → 200 (34ms)")
                        log("   ✅ GET /api/v1/catalog/products → 200 (67ms)")
                        log("   ✅ GET /api/v1/analytics/session → 200 (112ms)")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – HTTP Cache
                    sectionHeader("HTTP Cache")

                    Button("Cache Stats") {
                        // In production:
                        // let stats = try RajeevNetwork.cacheStats()
                        log("📊 HTTP Cache Statistics:")
                        log("   Entries: 142")
                        log("   Size: 2.8 MiB / 50 MiB capacity")
                        log("   Hit rate: 73.4%")
                        log("   Hits: 1,247  Misses: 452")
                        log("   Evictions (LRU): 38")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Purge Cache") {
                        // In production:
                        // try RajeevNetwork.purgeCache()
                        log("🗑️ Cache purged — 142 entries removed, 2.8 MiB freed")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    // MARK: – Compression
                    sectionHeader("Compression")

                    Button("Compress Payload") {
                        // In production:
                        // let compressed = try RajeevNetwork.compress(
                        //     data: payload,
                        //     algorithm: .brotli,
                        //     level: 6
                        // )
                        log("🗜️ Compression results (Brotli level 6):")
                        log("   Original: 48,320 bytes")
                        log("   Compressed: 8,114 bytes")
                        log("   Ratio: 83.2% reduction")
                        log("   Duration: 1.4ms")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Decompress") {
                        // In production:
                        // let original = try RajeevNetwork.decompress(data: compressed)
                        log("📦 Decompressed: 8,114 → 48,320 bytes")
                        log("   Algorithm auto-detected: Brotli")
                        log("   Duration: 0.3ms")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Network")
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
        NetworkDemoView()
    }
}
