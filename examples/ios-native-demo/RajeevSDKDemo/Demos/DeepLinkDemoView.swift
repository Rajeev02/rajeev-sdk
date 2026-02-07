import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevDeeplink (React Native module)

struct DeepLinkDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Deep Link")
                .font(.title)
                .fontWeight(.bold)
            Text("URL routing & link generation — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Router Setup
                    sectionHeader("Router Setup")

                    Button("Register Routes") {
                        log("🗺️ Route table registered:")
                        log("   /product/:id       → ProductScreen")
                        log("   /cart              → CartScreen")
                        log("   /profile/:userId   → ProfileScreen")
                        log("   /payment/status    → PaymentStatusScreen")
                        log("   /offers/:category  → OffersScreen")
                        log("   Wildcard: /**      → NotFoundScreen")
                        log("   Total routes: 6")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Show Route Table") {
                        log("📋 Active routes:")
                        log("   ┌─────────────────────┬───────────────────┐")
                        log("   │ Pattern             │ Screen            │")
                        log("   ├─────────────────────┼───────────────────┤")
                        log("   │ /product/:id        │ ProductScreen     │")
                        log("   │ /cart               │ CartScreen        │")
                        log("   │ /profile/:userId    │ ProfileScreen     │")
                        log("   │ /payment/status     │ PaymentStatusScreen│")
                        log("   │ /offers/:category   │ OffersScreen      │")
                        log("   │ /**                 │ NotFoundScreen    │")
                        log("   └─────────────────────┴───────────────────┘")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Handle URLs
                    sectionHeader("Handle URLs")

                    Button("Handle: rajeev://product/42") {
                        log("🔗 Handling URL: rajeev://product/42")
                        log("   Matched route: /product/:id")
                        log("   Params: { id: \"42\" }")
                        log("   → Navigating to ProductScreen(id: 42)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Handle: https://rajeev.app/offers/diwali") {
                        log("🔗 Handling URL: https://rajeev.app/offers/diwali")
                        log("   Universal Link detected")
                        log("   Matched route: /offers/:category")
                        log("   Params: { category: \"diwali\" }")
                        log("   → Navigating to OffersScreen(category: diwali)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Handle: rajeev://unknown/path") {
                        log("🔗 Handling URL: rajeev://unknown/path")
                        log("   ⚠️ No matching route found")
                        log("   Fallback: /** wildcard matched")
                        log("   → Navigating to NotFoundScreen")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    // MARK: – Generate Links
                    sectionHeader("Generate Links")

                    Button("Generate Product Link") {
                        log("🔗 Link generated:")
                        log("   Short:     https://rjv.link/p42")
                        log("   Universal: https://rajeev.app/product/42")
                        log("   Deep:      rajeev://product/42")
                        log("   QR code:   ready (200×200)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Generate Share Link") {
                        log("📤 Share link created:")
                        log("   URL: https://rjv.link/s/abc123")
                        log("   Title: \"Check out Masala Dosa on Rajeev!\"")
                        log("   Image: og-image-product-42.jpg")
                        log("   Expiry: 30 days")
                        log("   Attribution: utm_source=share&utm_medium=ios")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Generate Deferred Deep Link") {
                        log("🕐 Deferred deep link created:")
                        log("   URL: https://rjv.link/d/xyz789")
                        log("   Target: /product/42")
                        log("   Fallback: App Store listing")
                        log("   Fingerprinting: enabled")
                        log("   Survives: install → first open")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.purple)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Deep Link")
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
        DeepLinkDemoView()
    }
}
