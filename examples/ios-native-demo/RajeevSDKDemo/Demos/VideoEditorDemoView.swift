import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevVideoEditor (React Native module)

struct VideoEditorDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Video Editor")
                .font(.title)
                .fontWeight(.bold)
            Text("Timeline, effects & export — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Timeline
                    sectionHeader("Timeline Clips")

                    Button("Add Clip: intro.mp4") {
                        log("🎬 Clip added to timeline:")
                        log("   File: intro.mp4")
                        log("   Duration: 0:00 – 0:05")
                        log("   Resolution: 1920×1080")
                        log("   FPS: 30")
                        log("   Track: V1")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Add Clip: main.mp4") {
                        log("🎬 Clip added to timeline:")
                        log("   File: main.mp4")
                        log("   Duration: 0:05 – 0:35")
                        log("   Resolution: 3840×2160 (4K)")
                        log("   FPS: 60")
                        log("   Track: V1")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Add Clip: outro.mp4") {
                        log("🎬 Clip added to timeline:")
                        log("   File: outro.mp4")
                        log("   Duration: 0:35 – 0:40")
                        log("   Resolution: 1920×1080")
                        log("   FPS: 30")
                        log("   Track: V1")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Trim Active Clip") {
                        log("✂️ Clip trimmed:")
                        log("   File: main.mp4")
                        log("   Original: 0:05 – 0:35 (30s)")
                        log("   Trimmed:  0:08 – 0:30 (22s)")
                        log("   Removed: 8s")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Transitions
                    sectionHeader("Transitions")

                    HStack(spacing: 8) {
                        ForEach(["Dissolve", "Wipe", "Slide", "Fade"], id: \.self) { t in
                            Button(t) {
                                log("🔀 Transition added: \(t)")
                                log("   Between: intro.mp4 → main.mp4")
                                log("   Duration: 0.5s")
                            }
                            .buttonStyle(.borderedProminent)
                            .tint(.indigo)
                        }
                    }

                    // MARK: – Effects
                    sectionHeader("Effects")

                    HStack(spacing: 8) {
                        Button("Color Grade") {
                            log("🎨 Color grade applied:")
                            log("   LUT: Cinematic Warm")
                            log("   Intensity: 80%")
                            log("   Shadows: +10, Highlights: -5")
                        }
                        .buttonStyle(.borderedProminent)

                        Button("Speed Ramp") {
                            log("⏩ Speed ramp applied:")
                            log("   0:08 – 0:12: 0.5× (slow motion)")
                            log("   0:12 – 0:14: 2.0× (fast forward)")
                            log("   0:14 – 0:30: 1.0× (normal)")
                        }
                        .buttonStyle(.borderedProminent)
                    }

                    Button("Add Text Overlay") {
                        log("📝 Text overlay added:")
                        log("   Text: \"Rajeev SDK Demo\"")
                        log("   Font: SF Pro Display Bold, 48pt")
                        log("   Position: center-bottom")
                        log("   Time: 0:00 – 0:05")
                        log("   Animation: fade in + fade out")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Add Audio Track") {
                        log("🎵 Audio track added:")
                        log("   File: background_music.m4a")
                        log("   Duration: 0:40")
                        log("   Volume: 60%")
                        log("   Fade out: last 3s")
                        log("   Track: A2")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Export
                    sectionHeader("Export Presets")

                    Button("Export: Instagram Reel") {
                        log("📤 Exporting — Instagram Reel preset:")
                        log("   Resolution: 1080×1920 (9:16)")
                        log("   Codec: H.265 (HEVC)")
                        log("   Bitrate: 8 Mbps")
                        log("   FPS: 30")
                        log("   Duration: 0:32")
                        log("   Estimated size: 32 MB")
                        log("   ████████████████████ 100% — Complete!")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.purple)

                    Button("Export: YouTube 4K") {
                        log("📤 Exporting — YouTube 4K preset:")
                        log("   Resolution: 3840×2160")
                        log("   Codec: H.265 (HEVC)")
                        log("   Bitrate: 45 Mbps")
                        log("   FPS: 60")
                        log("   Duration: 0:32")
                        log("   Estimated size: 180 MB")
                        log("   ████████████████████ 100% — Complete!")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    Button("Export: WhatsApp Status") {
                        log("📤 Exporting — WhatsApp Status preset:")
                        log("   Resolution: 720×1280")
                        log("   Codec: H.264")
                        log("   Bitrate: 3 Mbps")
                        log("   Max duration: 0:30 (trimmed)")
                        log("   Max size: 16 MB")
                        log("   ████████████████████ 100% — Complete!")
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
        .navigationTitle("Video Editor")
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
        VideoEditorDemoView()
    }
}
