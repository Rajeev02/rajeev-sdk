import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevPayments (React Native module)

struct PaymentsDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Payments")
                .font(.title)
                .fontWeight(.bold)
            Text("UPI, cards & wallets — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – UPI
                    sectionHeader("UPI")

                    Button("Generate UPI URI") {
                        log("🏦 UPI URI generated:")
                        log("   upi://pay?pa=merchant@ybl&pn=RajeevStore&am=499.00&cu=INR&tn=Order%23001")
                        log("   Payee VPA: merchant@ybl")
                        log("   Amount: ₹499.00")
                        log("   Transaction note: Order#001")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Validate VPA") {
                        log("✅ VPA validation:")
                        log("   \"rajeev@upi\" → Valid")
                        log("   \"user@paytm\" → Valid")
                        log("   \"invalid@@bad\" → ❌ Invalid (malformed)")
                        log("   \"test@\" → ❌ Invalid (missing handle)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("UPI Intent Pay (₹249)") {
                        log("💸 UPI Intent initiated:")
                        log("   Amount: ₹249.00")
                        log("   Apps available: PhonePe, GPay, Paytm, BHIM")
                        log("   Status: awaiting user selection…")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Card Detection
                    sectionHeader("Card Network Detection")

                    Button("Detect Card Network") {
                        log("💳 Card network detection:")
                        log("   4111 1111 → Visa")
                        log("   5500 0000 → Mastercard")
                        log("   3782 8224 → Amex")
                        log("   6521 0000 → RuPay")
                        log("   3528 0000 → JCB")
                        log("   6011 0000 → Discover")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Validate Card (Luhn)") {
                        log("🔢 Luhn validation:")
                        log("   4111 1111 1111 1111 → ✅ Valid")
                        log("   4111 1111 1111 1112 → ❌ Invalid checksum")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Wallet
                    sectionHeader("Wallet Checkout")

                    Button("Start Wallet Checkout") {
                        log("🛒 Wallet checkout started:")
                        log("   Items: 3")
                        log("   Subtotal:  ₹1,247.00")
                        log("   GST (18%): ₹224.46")
                        log("   Discount:  −₹100.00")
                        log("   Total:     ₹1,371.46")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Apply Coupon: SAVE20") {
                        log("🎟️ Coupon applied: SAVE20")
                        log("   Discount: 20% (max ₹200)")
                        log("   New total: ₹1,171.46")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)

                    Button("Confirm Payment") {
                        log("✅ Payment confirmed:")
                        log("   Transaction ID: txn_9f8e7d6c5b4a")
                        log("   Method: UPI (rajeev@upi)")
                        log("   Amount: ₹1,171.46")
                        log("   Status: SUCCESS")
                        log("   Receipt sent to: rajeev@example.com")
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
        .navigationTitle("Payments")
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
        PaymentsDemoView()
    }
}
