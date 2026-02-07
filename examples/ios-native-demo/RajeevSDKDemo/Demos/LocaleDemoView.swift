import SwiftUI

// In production, import the UniFFI-generated module:
// import RajeevLocale

struct LocaleDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Locale")
                .font(.title)
                .fontWeight(.bold)
            Text("i18n, currency formatting & transliteration via Rust + UniFFI")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Translation
                    sectionHeader("Translation")

                    Button("Translate to Hindi") {
                        // In production:
                        // let result = try RajeevLocale.translate(
                        //     text: "Welcome to Rajeev SDK",
                        //     from: .en,
                        //     to: .hi
                        // )
                        log("🇮🇳 Translation (en → hi):")
                        log("   Input:  \"Welcome to Rajeev SDK\"")
                        log("   Output: \"राजीव SDK में आपका स्वागत है\"")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Translate to Tamil") {
                        // In production:
                        // let result = try RajeevLocale.translate(text: "Welcome to Rajeev SDK", from: .en, to: .ta)
                        log("🇮🇳 Translation (en → ta):")
                        log("   Input:  \"Welcome to Rajeev SDK\"")
                        log("   Output: \"ராஜீவ் SDK க்கு வரவேற்கிறோம்\"")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Translate to Telugu") {
                        // In production:
                        // let result = try RajeevLocale.translate(text: "Welcome to Rajeev SDK", from: .en, to: .te)
                        log("🇮🇳 Translation (en → te):")
                        log("   Input:  \"Welcome to Rajeev SDK\"")
                        log("   Output: \"రాజీవ్ SDK కి స్వాగతం\"")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Currency
                    sectionHeader("Currency Formatting")

                    Button("Format INR") {
                        // In production:
                        // let formatted = try RajeevLocale.formatCurrency(
                        //     amount: 1234567.89,
                        //     currency: .inr,
                        //     locale: .enIN
                        // )
                        log("💰 Currency formatting (INR):")
                        log("   Amount: 1234567.89")
                        log("   en-IN: ₹12,34,567.89")
                        log("   hi-IN: ₹12,34,567.89")
                        log("   Words: Twelve lakh thirty-four thousand five hundred sixty-seven rupees and eighty-nine paise")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Format Compact") {
                        // In production:
                        // let compact = try RajeevLocale.formatCompact(amount: 4500000, currency: .inr)
                        log("💰 Compact currency:")
                        log("   4500000 → ₹45L")
                        log("   75000   → ₹75K")
                        log("   120000000 → ₹12Cr")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Digit Conversion
                    sectionHeader("Digit Conversion")

                    Button("Convert to Devanagari Digits") {
                        // In production:
                        // let result = try RajeevLocale.convertDigits(
                        //     text: "Order #12345, Total: 6,789",
                        //     script: .devanagari
                        // )
                        log("🔢 Digit conversion (→ Devanagari):")
                        log("   Input:  \"Order #12345, Total: 6,789\"")
                        log("   Output: \"Order #१२३४५, Total: ६,७८९\"")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Transliteration
                    sectionHeader("Transliteration")

                    Button("Latin → Devanagari") {
                        // In production:
                        // let result = try RajeevLocale.transliterate(
                        //     text: "namaste bharat",
                        //     from: .latin,
                        //     to: .devanagari
                        // )
                        log("✍️ Transliteration (Latin → Devanagari):")
                        log("   Input:  \"namaste bharat\"")
                        log("   Output: \"नमस्ते भारत\"")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Latin → Tamil") {
                        // In production:
                        // let result = try RajeevLocale.transliterate(text: "vanakkam", from: .latin, to: .tamil)
                        log("✍️ Transliteration (Latin → Tamil):")
                        log("   Input:  \"vanakkam\"")
                        log("   Output: \"வணக்கம்\"")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Detect Script") {
                        // In production:
                        // let script = try RajeevLocale.detectScript(text: "नमस्ते")
                        log("🔎 Script detection:")
                        log("   \"नमस्ते\"  → Devanagari (confidence: 99.8%)")
                        log("   \"வணக்கம்\" → Tamil (confidence: 99.6%)")
                        log("   \"Hello\"   → Latin (confidence: 98.2%)")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Locale")
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
        LocaleDemoView()
    }
}
