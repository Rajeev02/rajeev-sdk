import SwiftUI

/// UI Tokens demo for watchOS: color palette, device info.
struct UIWatchDemo: View {
    @State private var logs: [String] = []

    private let palette: [(name: String, color: Color)] = [
        ("Primary",  Color(red: 0.31, green: 0.27, blue: 0.90)),  // #4F46E5
        ("Success",  Color(red: 0.06, green: 0.73, blue: 0.42)),  // #10B981
        ("Warning",  Color(red: 0.96, green: 0.62, blue: 0.04)),  // #F59E0B
        ("Error",    Color(red: 0.94, green: 0.27, blue: 0.27)),  // #EF4444
        ("Surface",  Color(red: 0.95, green: 0.96, blue: 0.97)),  // #F3F4F6
        ("Text",     Color(red: 0.07, green: 0.09, blue: 0.15)),  // #111827
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🎨 UI Tokens").font(.headline)

                HStack(spacing: 6) {
                    ForEach(palette, id: \.name) { item in
                        Circle()
                            .fill(item.color)
                            .frame(width: 24, height: 24)
                    }
                }

                Button("Show Palette Names") {
                    for item in palette {
                        log("\(item.name): ●")
                    }
                }
                .buttonStyle(.bordered)

                Button("Device Info") {
                    log("ui.deviceInfo()")
                    log("→ platform: watchOS")
                    log("→ screen: 198×242 @2x")
                    log("→ haptics: true")
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
        .navigationTitle("UI Tokens")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    UIWatchDemo()
}
