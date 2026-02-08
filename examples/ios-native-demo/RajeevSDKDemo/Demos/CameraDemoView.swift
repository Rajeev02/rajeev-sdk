import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevCamera (React Native module)

struct CameraDemoView: View {
    @State private var logs: [String] = []
    @State private var flashOn = false
    @State private var hdrOn = true
    @State private var selectedMode = "Photo"
    private let modes = ["Photo", "Video", "Portrait", "Pano", "Night", "Burst"]

    private let filters = [
        "Original", "Vivid", "Dramatic", "Mono", "Noir", "Silvertone",
        "Fade", "Chrome", "Instant", "Process", "Transfer", "Tonal",
        "Sepia", "Warm", "Cool", "Emerald", "Sakura", "Sunset",
        "Mumbai", "Jaipur", "Kerala", "Himalaya", "Ganga", "Thar"
    ]

    var body: some View {
        VStack(spacing: 0) {
            Text("Camera")
                .font(.title)
                .fontWeight(.bold)
            Text("Capture, filters & editing — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Capture Mode
                    sectionHeader("Capture Mode")

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(modes, id: \.self) { mode in
                                Button(mode) {
                                    selectedMode = mode
                                    log("📷 Capture mode: \(mode)")
                                    log("   Resolution: \(mode == "Video" ? "4K@60fps" : "12MP")")
                                }
                                .buttonStyle(.borderedProminent)
                                .tint(selectedMode == mode ? .blue : .gray)
                            }
                        }
                    }

                    // MARK: – Controls
                    sectionHeader("Controls")

                    HStack(spacing: 16) {
                        Toggle("Flash", isOn: $flashOn)
                            .onChange(of: flashOn) { newValue in
                                log("⚡ Flash: \(newValue ? "ON" : "OFF")")
                            }
                        Toggle("HDR", isOn: $hdrOn)
                            .onChange(of: hdrOn) { newValue in
                                log("🌈 HDR: \(newValue ? "ON" : "OFF")")
                            }
                    }

                    Button("Capture") {
                        log("📸 Captured!")
                        log("   Mode: \(selectedMode)")
                        log("   Flash: \(flashOn ? "ON" : "OFF")")
                        log("   HDR: \(hdrOn ? "ON" : "OFF")")
                        log("   File: IMG_20260208_\(Int.random(in: 1000...9999)).heic")
                        log("   Size: \(Int.random(in: 2...8)).\(Int.random(in: 0...9)) MB")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    // MARK: – Filters
                    sectionHeader("Filter Gallery (24 filters)")

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 6), count: 4), spacing: 6) {
                        ForEach(filters, id: \.self) { filter in
                            Button {
                                log("🎨 Filter applied: \(filter)")
                                log("   Processing time: \(Int.random(in: 5...45))ms")
                            } label: {
                                Text(filter)
                                    .font(.caption2)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 8)
                            }
                            .buttonStyle(.bordered)
                        }
                    }

                    // MARK: – Photo Editor
                    sectionHeader("Photo Editor Adjustments")

                    Button("Auto Enhance") {
                        log("✨ Auto-enhance applied:")
                        log("   Brightness: +12%")
                        log("   Contrast: +8%")
                        log("   Saturation: +5%")
                        log("   Sharpness: +15%")
                        log("   Noise reduction: applied")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Crop & Rotate") {
                        log("✂️ Crop & rotate:")
                        log("   Aspect ratio: 4:3")
                        log("   Rotation: 0°")
                        log("   Perspective correction: auto-applied")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Export Edited") {
                        log("💾 Photo exported:")
                        log("   Format: HEIC")
                        log("   Quality: 95%")
                        log("   Metadata preserved: EXIF, GPS, orientation")
                        log("   Saved to Camera Roll")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Camera")
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
        CameraDemoView()
    }
}
