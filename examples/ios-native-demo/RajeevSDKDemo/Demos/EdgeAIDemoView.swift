import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevEdgeAI (React Native module)

struct EdgeAIDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Edge AI")
                .font(.title)
                .fontWeight(.bold)
            Text("OCR, model pipeline & voice — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – OCR Detection
                    sectionHeader("OCR Detection")

                    Button("Detect Aadhaar Card") {
                        log("🪪 Aadhaar OCR result:")
                        log("   Document: Aadhaar Card")
                        log("   Confidence: 97.3%")
                        log("   ┌─────────────────┬──────────────────┐")
                        log("   │ Field           │ Value            │")
                        log("   ├─────────────────┼──────────────────┤")
                        log("   │ Name            │ Rajeev Kumar     │")
                        log("   │ DOB             │ 01/01/1990       │")
                        log("   │ Gender          │ Male             │")
                        log("   │ Aadhaar No.     │ XXXX XXXX 1234   │")
                        log("   └─────────────────┴──────────────────┘")
                        log("   Processing: 142ms (on-device, CoreML)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Detect PAN Card") {
                        log("🪪 PAN OCR result:")
                        log("   Document: PAN Card")
                        log("   Confidence: 95.8%")
                        log("   Name: RAJEEV KUMAR")
                        log("   Father's Name: SURESH KUMAR")
                        log("   DOB: 01/01/1990")
                        log("   PAN: ABCDE1234F")
                        log("   Processing: 128ms (on-device)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Detect Driving License") {
                        log("🪪 DL OCR result:")
                        log("   Document: Driving License")
                        log("   Confidence: 93.1%")
                        log("   Name: RAJEEV KUMAR")
                        log("   DL No: KA05 20201234567")
                        log("   Valid till: 2030-01-01")
                        log("   Vehicle class: LMV, MCWG")
                        log("   Processing: 156ms (on-device)")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Model Pipeline
                    sectionHeader("Model Pipeline")

                    Button("Load Model") {
                        log("🧠 Model loaded:")
                        log("   Name: rajeev-doc-classifier-v3")
                        log("   Format: CoreML (.mlmodelc)")
                        log("   Size: 12.4 MB")
                        log("   Input: 224×224 RGB image")
                        log("   Classes: [aadhaar, pan, dl, passport, cheque, other]")
                        log("   Device: Neural Engine (ANE)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Run Inference") {
                        log("⚡ Inference result:")
                        log("   Input: camera_frame_001.jpg")
                        log("   Predictions:")
                        log("     aadhaar:  0.92 ████████████████████░░░░")
                        log("     pan:      0.04 █░░░░░░░░░░░░░░░░░░░░░░")
                        log("     dl:       0.02 ░░░░░░░░░░░░░░░░░░░░░░░")
                        log("     other:    0.02 ░░░░░░░░░░░░░░░░░░░░░░░")
                        log("   Latency: 8ms (Neural Engine)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Benchmark Pipeline") {
                        log("📊 Pipeline benchmark (100 iterations):")
                        log("   Preprocessing:  avg 2.1ms")
                        log("   Inference:      avg 7.8ms")
                        log("   Postprocessing: avg 1.3ms")
                        log("   Total:          avg 11.2ms (89 FPS)")
                        log("   Memory peak:    48 MB")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Voice Intent
                    sectionHeader("Voice Intent Parsing")

                    Button("Parse: \"Send ₹500 to Priya\"") {
                        log("🎤 Voice intent parsed:")
                        log("   Utterance: \"Send ₹500 to Priya\"")
                        log("   Intent: SEND_MONEY")
                        log("   Entities:")
                        log("     amount: ₹500")
                        log("     recipient: \"Priya\"")
                        log("   Confidence: 96.2%")
                        log("   Language: en-IN")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Parse: \"मेरा बैलेंस बताओ\"") {
                        log("🎤 Voice intent parsed:")
                        log("   Utterance: \"मेरा बैलेंस बताओ\"")
                        log("   Intent: CHECK_BALANCE")
                        log("   Entities: (none)")
                        log("   Confidence: 94.7%")
                        log("   Language: hi-IN")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Parse: \"Book cab to airport\"") {
                        log("🎤 Voice intent parsed:")
                        log("   Utterance: \"Book cab to airport\"")
                        log("   Intent: BOOK_RIDE")
                        log("   Entities:")
                        log("     destination: \"airport\"")
                        log("     vehicle_type: \"cab\"")
                        log("   Confidence: 91.5%")
                        log("   Language: en-IN")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Edge AI")
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
        EdgeAIDemoView()
    }
}
