import SwiftUI

/// Compact vault demo for watchOS.
/// In production, calls go through UniFFI-generated Swift bindings
/// into the Rust `rajeev-vault` crate (AES-256-GCM + Keychain).
struct VaultWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🔐 Vault").font(.headline)

                Button("Store PIN") {
                    log("vault.set(\"pin\", \"9247\")")
                    log("✅ PIN stored securely")
                }
                .buttonStyle(.bordered)

                Button("Retrieve PIN") {
                    log("vault.get(\"pin\")")
                    log("→ \"9247\"")
                }
                .buttonStyle(.bordered)

                Button("Key Exists?") {
                    log("vault.has(\"pin\") → true")
                    log("vault.has(\"token\") → false")
                }
                .buttonStyle(.bordered)

                Button("Wipe Vault") {
                    log("vault.wipeAll()")
                    log("🗑️ Vault cleared")
                }
                .buttonStyle(.bordered)
                .tint(.red)

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
        .navigationTitle("Vault")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    VaultWatchDemo()
}
