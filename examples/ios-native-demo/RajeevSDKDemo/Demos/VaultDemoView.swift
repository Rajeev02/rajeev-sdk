import SwiftUI

// In production, import the UniFFI-generated module:
// import RajeevVault

struct VaultDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Vault")
                .font(.title)
                .fontWeight(.bold)
            Text("Encrypted key-value storage via Rust + UniFFI")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Vault Lifecycle
                    sectionHeader("Vault Lifecycle")

                    Button("Create Vault") {
                        // In production:
                        // let config = VaultConfig(appId: "demo", encryption: .aes256gcm)
                        // let vault = try RajeevVault.create(config: config)
                        log("✅ Vault created — appId: \"demo\", encryption: AES-256-GCM")
                        log("   Storage backend: Keychain (iOS), encrypted SQLCipher")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Wipe All") {
                        // In production:
                        // try vault.wipeAll()
                        log("🗑️ Vault wiped — all keys and values destroyed")
                        log("   Secure memory zeroed via zeroize crate")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    // MARK: – Key-Value Operations
                    sectionHeader("Key-Value Operations")

                    Button("Store Value") {
                        // In production:
                        // try vault.set(key: "user.token", value: Data("eyJhbGciOi...".utf8))
                        let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
                        log("📥 Stored key: \"user.token\"")
                        log("   Value: \(token.prefix(32))… (\(token.count) bytes)")
                        log("   Encrypted with AES-256-GCM, nonce auto-generated")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Retrieve Value") {
                        // In production:
                        // let data = try vault.get(key: "user.token")
                        log("📤 Retrieved key: \"user.token\"")
                        log("   Decrypted value: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...")
                        log("   Decryption took 0.12ms")
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – Cryptography
                    sectionHeader("Cryptography")

                    Button("Hash Password") {
                        // In production:
                        // let hash = try RajeevVault.hashPassword(
                        //     password: "hunter2",
                        //     algorithm: .argon2id,
                        //     memCost: 65536,
                        //     timeCost: 3
                        // )
                        log("🔒 Password hashed with Argon2id")
                        log("   Memory cost: 64 MiB, time cost: 3 iterations")
                        log("   Hash: $argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHQ$WmFs...")
                        log("   Duration: 287ms")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Generate Key") {
                        // In production:
                        // let key = try RajeevVault.generateKey(
                        //     algorithm: .x25519,
                        //     purpose: .keyAgreement
                        // )
                        log("🔑 Key pair generated — algorithm: X25519")
                        log("   Public:  mc4kLz1f2eQp8rT7vXw9yBnAhCjDkFlGmHiOpQrS...")
                        log("   Purpose: Key Agreement (ECDH)")
                        log("   Key stored in Secure Enclave where available")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Set Expiry") {
                        // In production:
                        // try vault.setExpiry(key: "user.token", ttl: .seconds(3600))
                        log("⏱️ Expiry set for key: \"user.token\"")
                        log("   TTL: 3600s (1 hour)")
                        log("   Auto-wipe scheduled via background task")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Vault")
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
        VaultDemoView()
    }
}
