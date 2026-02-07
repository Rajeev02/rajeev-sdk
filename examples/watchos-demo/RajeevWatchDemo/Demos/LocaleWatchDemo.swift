import SwiftUI

/// Locale demo for watchOS: quick translate, format currency.
struct LocaleWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🌍 Locale").font(.headline)

                Button("Translate → Hindi") {
                    log("locale.t(\"Good morning\", \"hi\")")
                    log("→ \"सुप्रभात\"")
                }
                .buttonStyle(.bordered)

                Button("Translate → Tamil") {
                    log("locale.t(\"Good morning\", \"ta\")")
                    log("→ \"காலை வணக்கம்\"")
                }
                .buttonStyle(.bordered)

                Button("Format ₹ Amount") {
                    log("locale.formatCurrency(1499.50, \"INR\")")
                    log("→ \"₹1,499.50\"")
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
        .navigationTitle("Locale")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    LocaleWatchDemo()
}
