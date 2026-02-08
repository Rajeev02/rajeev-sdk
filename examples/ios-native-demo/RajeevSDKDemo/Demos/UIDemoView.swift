import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevUI (React Native module)

struct UIDemoView: View {
    @State private var logs: [String] = []

    private let colorPalette: [(name: String, hex: String, color: Color)] = [
        ("Primary",        "#6366F1", .indigo),
        ("Primary Light",  "#818CF8", Color(red: 0.506, green: 0.549, blue: 0.973)),
        ("Primary Dark",   "#4338CA", Color(red: 0.263, green: 0.220, blue: 0.792)),
        ("Secondary",      "#F59E0B", .orange),
        ("Success",        "#10B981", .green),
        ("Error",          "#EF4444", .red),
        ("Warning",        "#F59E0B", .yellow),
        ("Info",           "#3B82F6", .blue),
        ("Surface",        "#FFFFFF", .white),
        ("Background",     "#F9FAFB", Color(red: 0.976, green: 0.980, blue: 0.984)),
        ("Text Primary",   "#111827", Color(red: 0.067, green: 0.094, blue: 0.153)),
        ("Text Secondary", "#6B7280", .gray),
    ]

    private let spacingScale: [(name: String, value: Int)] = [
        ("xs", 4), ("sm", 8), ("md", 12), ("base", 16),
        ("lg", 20), ("xl", 24), ("2xl", 32), ("3xl", 40), ("4xl", 48),
    ]

    private let typographyScale: [(name: String, size: Int, weight: String)] = [
        ("Display",   36, "Bold"),
        ("Heading 1", 30, "Bold"),
        ("Heading 2", 24, "Semibold"),
        ("Heading 3", 20, "Semibold"),
        ("Body",      16, "Regular"),
        ("Body Sm",   14, "Regular"),
        ("Caption",   12, "Regular"),
        ("Overline",  10, "Medium"),
    ]

    var body: some View {
        VStack(spacing: 0) {
            Text("UI Tokens")
                .font(.title)
                .fontWeight(.bold)
            Text("Design system tokens — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Color Palette
                    sectionHeader("Color Palette")

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
                        ForEach(colorPalette, id: \.name) { item in
                            VStack(spacing: 4) {
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(item.color)
                                    .frame(height: 44)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                    )
                                Text(item.name)
                                    .font(.caption2.weight(.medium))
                                Text(item.hex)
                                    .font(.system(.caption2, design: .monospaced))
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }

                    Button("Log Color Palette") {
                        log("🎨 Color palette (12 tokens):")
                        for item in colorPalette {
                            log("   \(item.name): \(item.hex)")
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Spacing Scale
                    sectionHeader("Spacing Scale")

                    ForEach(spacingScale, id: \.name) { item in
                        HStack {
                            Text(item.name)
                                .font(.system(.caption, design: .monospaced))
                                .frame(width: 40, alignment: .leading)
                            Text("\(item.value)pt")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .frame(width: 36, alignment: .trailing)
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color.indigo.opacity(0.6))
                                .frame(width: CGFloat(item.value * 3), height: 12)
                        }
                    }

                    Button("Log Spacing Scale") {
                        log("📏 Spacing scale (9 tokens):")
                        for item in spacingScale {
                            let bar = String(repeating: "█", count: item.value / 2)
                            log("   \(item.name.padding(toLength: 4, withPad: " ", startingAt: 0)) \(String(item.value).padding(toLength: 3, withPad: " ", startingAt: 0))pt \(bar)")
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Typography
                    sectionHeader("Typography Scale")

                    ForEach(typographyScale, id: \.name) { item in
                        HStack {
                            Text(item.name)
                                .font(.system(size: CGFloat(min(item.size, 20))))
                            Spacer()
                            Text("\(item.size)pt · \(item.weight)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }

                    Button("Log Typography Scale") {
                        log("🔤 Typography scale (8 tokens):")
                        for item in typographyScale {
                            log("   \(item.name.padding(toLength: 12, withPad: " ", startingAt: 0)) \(item.size)pt \(item.weight)")
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Device Detection
                    sectionHeader("Device Detection")

                    Button("Detect Device") {
                        let device = UIDevice.current
                        let screen = UIScreen.main
                        log("📱 Device info:")
                        log("   Model: \(device.model)")
                        log("   System: \(device.systemName) \(device.systemVersion)")
                        log("   Screen: \(Int(screen.bounds.width))×\(Int(screen.bounds.height)) @ \(Int(screen.scale))x")
                        log("   Idiom: \(device.userInterfaceIdiom == .phone ? "Phone" : "Pad")")
                        log("   Battery: \(Int(device.batteryLevel * 100))%")
                        log("   Orientation: \(device.orientation.isLandscape ? "Landscape" : "Portrait")")
                        log("   Dark mode: \(UITraitCollection.current.userInterfaceStyle == .dark ? "ON" : "OFF")")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("List Breakpoints") {
                        log("📐 Responsive breakpoints:")
                        log("   xs:  0 – 374pt   (iPhone SE)")
                        log("   sm:  375 – 413pt  (iPhone 14)")
                        log("   md:  414 – 767pt  (iPhone Pro Max)")
                        log("   lg:  768 – 1023pt (iPad Mini)")
                        log("   xl:  1024pt+      (iPad Pro)")
                        let w = Int(UIScreen.main.bounds.width)
                        let bp: String
                        switch w {
                        case ..<375: bp = "xs"
                        case ..<414: bp = "sm"
                        case ..<768: bp = "md"
                        case ..<1024: bp = "lg"
                        default: bp = "xl"
                        }
                        log("   Current: \(bp) (\(w)pt)")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("UI Tokens")
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
        UIDemoView()
    }
}
