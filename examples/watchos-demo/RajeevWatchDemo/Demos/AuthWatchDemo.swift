import SwiftUI

/// Auth demo for watchOS: session status, user info, quick logout.
struct AuthWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🛡️ Auth").font(.headline)

                Button("Session Status") {
                    log("auth.sessionStatus()")
                    log("→ { active: true, expiresIn: \"47 min\" }")
                }
                .buttonStyle(.bordered)

                Button("Show User") {
                    log("auth.currentUser()")
                    log("→ { name: \"Rajeev\", id: \"u_8x3k\" }")
                }
                .buttonStyle(.bordered)

                Button("Quick Logout") {
                    log("auth.logout()")
                    log("🔓 Session ended on watch")
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
        .navigationTitle("Auth")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    AuthWatchDemo()
}
