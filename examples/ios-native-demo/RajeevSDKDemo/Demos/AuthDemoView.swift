import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevAuth (React Native module)

struct AuthDemoView: View {
    @State private var logs: [String] = []
    @State private var selectedProvider = "Phone"
    private let providers = ["Phone", "Google", "Apple", "Aadhaar"]

    var body: some View {
        VStack(spacing: 0) {
            Text("Auth")
                .font(.title)
                .fontWeight(.bold)
            Text("OTP, sessions & providers — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Provider Selection
                    sectionHeader("Provider Selection")

                    Picker("Provider", selection: $selectedProvider) {
                        ForEach(providers, id: \.self) { provider in
                            Text(provider).tag(provider)
                        }
                    }
                    .pickerStyle(.segmented)

                    Button("Initialize Provider") {
                        log("🔌 Provider initialized: \(selectedProvider)")
                        switch selectedProvider {
                        case "Phone":
                            log("   Method: SMS OTP")
                            log("   Auto-read: enabled (iOS SMS autofill)")
                        case "Google":
                            log("   Method: OAuth 2.0 + PKCE")
                            log("   Client ID: com.rajeev.demo")
                        case "Apple":
                            log("   Method: Sign in with Apple")
                            log("   Scopes: [email, fullName]")
                        case "Aadhaar":
                            log("   Method: Aadhaar eKYC (UIDAI)")
                            log("   Mode: OTP-based verification")
                        default:
                            break
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    // MARK: – OTP Flow
                    sectionHeader("OTP Flow")

                    Button("Send OTP") {
                        log("📤 OTP sent to +91 98765 43210")
                        log("   Channel: SMS (fallback: WhatsApp)")
                        log("   Length: 6 digits")
                        log("   Expiry: 300s")
                        log("   Rate limit: 3 attempts / 10 min")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Verify OTP (mock: 123456)") {
                        log("✅ OTP verified successfully")
                        log("   Code: 123456")
                        log("   Verified at: \(timestamp)")
                        log("   Token issued: eyJhbGciOiJSUzI1Ni...")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Resend OTP") {
                        log("🔄 OTP resent to +91 98765 43210")
                        log("   Channel: WhatsApp (fallback triggered)")
                        log("   Remaining attempts: 2")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    // MARK: – Session
                    sectionHeader("Session Management")

                    Button("Get Session") {
                        log("📋 Current session:")
                        log("   User ID: usr_a1b2c3d4e5")
                        log("   Provider: \(selectedProvider)")
                        log("   Access token: eyJhbGci…(expires in 3540s)")
                        log("   Refresh token: dGhpcyBpc…(expires in 29d)")
                        log("   Scopes: [profile, payments, vault]")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Refresh Token") {
                        log("🔄 Token refreshed")
                        log("   New access token issued")
                        log("   Expiry: +3600s from now")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Logout") {
                        log("👋 Logged out")
                        log("   Session destroyed")
                        log("   Tokens revoked on server")
                        log("   Local storage cleared")
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
        .navigationTitle("Auth")
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
        AuthDemoView()
    }
}
