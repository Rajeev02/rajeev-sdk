import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevAppShell (React Native module)

struct AppShellDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("App Shell")
                .font(.title)
                .fontWeight(.bold)
            Text("API client, cart, flags & forms — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – API Client
                    sectionHeader("API Client")

                    Button("GET /products") {
                        log("📡 GET /api/v1/products")
                        log("   Status: 200 OK")
                        log("   Latency: 89ms")
                        log("   Items: 24")
                        log("   Cache: HIT (max-age: 300)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("POST /orders") {
                        log("📡 POST /api/v1/orders")
                        log("   Status: 201 Created")
                        log("   Latency: 234ms")
                        log("   Order ID: ord_f1e2d3c4b5")
                        log("   Total: ₹2,499.00")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Retry with Backoff") {
                        log("🔄 Request failed — starting retry:")
                        log("   Attempt 1: 503 — wait 1s")
                        log("   Attempt 2: 503 — wait 2s")
                        log("   Attempt 3: 200 OK ✅")
                        log("   Strategy: exponential backoff + jitter")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    // MARK: – Cart
                    sectionHeader("Cart (Indian Pricing)")

                    Button("Add: Masala Dosa ₹149") {
                        log("🛒 Item added to cart:")
                        log("   Masala Dosa × 1 — ₹149.00")
                        log("   Cart total: ₹149.00")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Add: Paneer Tikka ₹299") {
                        log("🛒 Item added to cart:")
                        log("   Paneer Tikka × 1 — ₹299.00")
                        log("   Cart total: ₹448.00")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Add: Biryani ₹349") {
                        log("🛒 Item added to cart:")
                        log("   Hyderabadi Biryani × 1 — ₹349.00")
                        log("   Cart total: ₹797.00")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("View Cart Summary") {
                        log("🧾 Cart Summary:")
                        log("   ┌─────────────────────┬───────┬─────────┐")
                        log("   │ Item                │ Qty   │ Price   │")
                        log("   ├─────────────────────┼───────┼─────────┤")
                        log("   │ Masala Dosa          │ 1     │ ₹149.00 │")
                        log("   │ Paneer Tikka         │ 1     │ ₹299.00 │")
                        log("   │ Hyderabadi Biryani   │ 1     │ ₹349.00 │")
                        log("   ├─────────────────────┼───────┼─────────┤")
                        log("   │ Subtotal             │       │ ₹797.00 │")
                        log("   │ GST (5%)             │       │  ₹39.85 │")
                        log("   │ Delivery             │       │  ₹49.00 │")
                        log("   │ Total                │       │ ₹885.85 │")
                        log("   └─────────────────────┴───────┴─────────┘")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.purple)

                    // MARK: – Feature Flags
                    sectionHeader("Feature Flags")

                    Button("Check Flags") {
                        log("🚩 Feature flags:")
                        log("   dark_mode:        ✅ enabled")
                        log("   upi_autopay:      ✅ enabled")
                        log("   voice_search:     ❌ disabled")
                        log("   new_checkout:     ✅ enabled (50% rollout)")
                        log("   ar_try_on:        ❌ disabled")
                        log("   hindi_ui:         ✅ enabled")
                        log("   Source: remote config (cached 5m ago)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Toggle: voice_search") {
                        log("🔀 Flag toggled (local override):")
                        log("   voice_search: ❌ → ✅")
                        log("   ⚠️ Local override — will reset on next remote sync")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    // MARK: – Form Validators
                    sectionHeader("Form Validators")

                    Button("Validate Form") {
                        log("📋 Form validation results:")
                        log("   ✅ name: \"Rajeev Kumar\" — valid")
                        log("   ✅ email: \"rajeev@example.com\" — valid")
                        log("   ❌ phone: \"12345\" — invalid (must be 10 digits)")
                        log("   ✅ pincode: \"560001\" — valid (Bangalore)")
                        log("   ❌ pan: \"ABCDE\" — invalid (format: AAAAA0000A)")
                        log("   ✅ gstin: \"29ABCDE1234F1Z5\" — valid")
                        log("   Result: 4/6 fields valid")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("App Shell")
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
        AppShellDemoView()
    }
}
