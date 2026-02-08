import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevMedia (React Native module)

struct MediaDemoView: View {
    @State private var logs: [String] = []
    @State private var selectedQuality = "Auto"
    private let qualities = ["Auto", "360p", "480p", "720p", "1080p", "4K"]

    var body: some View {
        VStack(spacing: 0) {
            Text("Media")
                .font(.title)
                .fontWeight(.bold)
            Text("Player, DRM & downloads — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Player Controls
                    sectionHeader("Player Controls")

                    HStack(spacing: 12) {
                        Button("⏮") {
                            log("⏮ Previous track")
                        }
                        .buttonStyle(.borderedProminent)

                        Button("▶️ Play") {
                            log("▶️ Playing: \"Midnight Raga\"")
                            log("   Artist: Anoushka Shankar")
                            log("   Duration: 4:32")
                            log("   Codec: AAC-LC 256kbps")
                            log("   Source: CDN (Mumbai edge)")
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.green)

                        Button("⏸ Pause") {
                            log("⏸ Paused at 1:23 / 4:32")
                        }
                        .buttonStyle(.borderedProminent)

                        Button("⏭") {
                            log("⏭ Next track")
                        }
                        .buttonStyle(.borderedProminent)
                    }

                    Button("Seek to 2:30") {
                        log("⏩ Seeked to 2:30 / 4:32")
                        log("   Buffer: 45s ahead")
                        log("   Bitrate: 256 kbps (stable)")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Quality
                    sectionHeader("Quality Selection")

                    Picker("Quality", selection: $selectedQuality) {
                        ForEach(qualities, id: \.self) { q in
                            Text(q).tag(q)
                        }
                    }
                    .pickerStyle(.segmented)
                    .onChange(of: selectedQuality) { newValue in
                        log("📺 Quality changed to: \(newValue)")
                        if newValue == "Auto" {
                            log("   ABR: adaptive bitrate enabled")
                            log("   Current bandwidth: 12.5 Mbps → selecting 1080p")
                        } else {
                            log("   Fixed quality: \(newValue)")
                        }
                    }

                    // MARK: – DRM
                    sectionHeader("DRM Info")

                    Button("Check DRM Status") {
                        log("🔒 DRM status:")
                        log("   System: Apple FairPlay Streaming")
                        log("   License: valid (expires 2026-02-15)")
                        log("   Security level: L1 (hardware)")
                        log("   Offline playback: allowed (72h window)")
                        log("   HDCP: enforced (output protection)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Acquire License") {
                        log("📜 FairPlay license acquired:")
                        log("   Content ID: movie-rajeev-001")
                        log("   License server: drm.rajeev.app")
                        log("   Response time: 234ms")
                        log("   Rental period: 48h playback, 30d download")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Download Manager
                    sectionHeader("Download Manager")

                    Button("Start Download") {
                        log("⬇️ Download started:")
                        log("   Title: \"Midnight Raga\" (Full Album)")
                        log("   Quality: 1080p + FLAC audio")
                        log("   Size: 2.4 GB")
                        log("   Estimated time: 3 min (@ 12 Mbps)")
                        log("   Storage available: 28.3 GB")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Check Progress") {
                        log("📊 Download progress:")
                        log("   ████████████░░░░░░░░ 60%")
                        log("   Downloaded: 1.44 GB / 2.4 GB")
                        log("   Speed: 13.2 Mbps")
                        log("   ETA: 1 min 12s")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("List Downloads") {
                        log("📋 Downloaded content:")
                        log("   1. Midnight Raga (Album) — 2.4 GB — ⬇️ 60%")
                        log("   2. Morning Mantra (Single) — 45 MB — ✅ Complete")
                        log("   3. Classical Fusion (Playlist) — 890 MB — ✅ Complete")
                        log("   Total storage used: 3.3 GB")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Delete All Downloads") {
                        log("🗑️ All downloads deleted")
                        log("   Freed: 3.3 GB")
                        log("   DRM licenses revoked locally")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Media")
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
        MediaDemoView()
    }
}
