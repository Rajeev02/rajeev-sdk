import SwiftUI

/// Payments demo for watchOS: Quick Pay via UPI, last transaction, tap-to-pay.
struct PaymentsWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("💳 Payments").font(.headline)

                Button("Quick Pay ₹100") {
                    log("payments.quickPay({")
                    log("  amount: 100, currency: \"INR\",")
                    log("  method: \"upi\",")
                    log("  vpa: \"rajeev@upi\"")
                    log("})")
                    log("✅ ₹100.00 paid via UPI")
                }
                .buttonStyle(.bordered)

                Button("Last Transaction") {
                    log("payments.lastTxn()")
                    log("→ ₹250.00 | Swiggy | 2 hr ago")
                }
                .buttonStyle(.bordered)

                Button("Tap to Pay Status") {
                    log("payments.tapToPayStatus()")
                    log("→ { nfc: true, ready: true }")
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
        .navigationTitle("Payments")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    PaymentsWatchDemo()
}
