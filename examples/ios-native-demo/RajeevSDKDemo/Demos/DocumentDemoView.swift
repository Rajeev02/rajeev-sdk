import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevDocument (React Native module)

struct DocumentDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Document")
                .font(.title)
                .fontWeight(.bold)
            Text("File picker, PDF annotation & signatures — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – File Picker
                    sectionHeader("File Picker")

                    Button("Pick Document") {
                        log("📂 File picker opened")
                        log("   Allowed types: [pdf, docx, xlsx, jpg, png]")
                        log("   Max size: 25 MB")
                        log("   Multi-select: enabled")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Simulate Selection") {
                        log("✅ Files selected:")
                        log("   1. invoice_2026.pdf (1.2 MB)")
                        log("   2. aadhaar_front.jpg (3.4 MB)")
                        log("   3. pan_card.png (2.1 MB)")
                        log("   Total: 6.7 MB")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Scan Document (Camera)") {
                        log("📱 Document scanner activated")
                        log("   Auto-detection: ON")
                        log("   Edge detection: active")
                        log("   Perspective correction: auto")
                        log("   Output format: PDF")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – PDF Annotation
                    sectionHeader("PDF Annotation")

                    Button("Open PDF") {
                        log("📄 PDF opened: invoice_2026.pdf")
                        log("   Pages: 3")
                        log("   Size: 1.2 MB")
                        log("   Annotations supported: highlight, underline, freehand, text, stamp")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Add Highlight") {
                        log("🟡 Highlight added:")
                        log("   Page: 1")
                        log("   Region: (x: 72, y: 340, w: 280, h: 18)")
                        log("   Color: yellow (opacity: 0.4)")
                        log("   Text: \"Total Amount: ₹12,450.00\"")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.yellow)

                    Button("Add Text Note") {
                        log("📝 Text note added:")
                        log("   Page: 2")
                        log("   Position: (x: 50, y: 120)")
                        log("   Content: \"Verify GST number\"")
                        log("   Author: Rajeev")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Save Annotated PDF") {
                        log("💾 PDF saved with annotations:")
                        log("   Annotations: 2 (1 highlight, 1 note)")
                        log("   Output: invoice_2026_annotated.pdf")
                        log("   Size: 1.3 MB (+100 KB)")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)

                    // MARK: – Signature
                    sectionHeader("Signature")

                    Button("Create Signature") {
                        log("✍️ Signature pad opened:")
                        log("   Canvas: 400×200")
                        log("   Stroke color: #1A1A1A")
                        log("   Stroke width: 2.0")
                        log("   Background: transparent")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Save Signature") {
                        log("✅ Signature saved:")
                        log("   Format: PNG (transparent background)")
                        log("   Size: 400×200 @ 2x (12 KB)")
                        log("   Stored in Vault (encrypted)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Apply Signature to PDF") {
                        log("📄 Signature applied to invoice_2026.pdf:")
                        log("   Page: 3")
                        log("   Position: (x: 72, y: 680)")
                        log("   Scale: 50%")
                        log("   Timestamp: 2026-02-08T10:30:00Z")
                        log("   Certificate: self-signed")
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
        .navigationTitle("Document")
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
        DocumentDemoView()
    }
}
