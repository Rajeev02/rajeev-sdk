import SwiftUI

struct SDKModule: Identifiable {
    let id = UUID()
    let icon: String
    let name: String
    let subtitle: String
    let destination: AnyView
}

struct ContentView: View {
    private let rustCoreModules: [SDKModule] = [
        SDKModule(icon: "🔐", name: "Vault", subtitle: "Encrypted key-value storage, hashing, key derivation", destination: AnyView(VaultDemoView())),
        SDKModule(icon: "🌐", name: "Network", subtitle: "Priority queue, HTTP cache, compression", destination: AnyView(NetworkDemoView())),
        SDKModule(icon: "🔄", name: "Sync", subtitle: "CRDT documents, conflict resolution, HLC timestamps", destination: AnyView(SyncDemoView())),
        SDKModule(icon: "🌍", name: "Locale", subtitle: "Translation, currency formatting, transliteration", destination: AnyView(LocaleDemoView())),
    ]

    private let tsModules: [SDKModule] = [
        SDKModule(icon: "🔑", name: "Auth", subtitle: "OTP, session management, providers", destination: AnyView(AuthDemoView())),
        SDKModule(icon: "💳", name: "Payments", subtitle: "UPI, VPA validation, card detection, wallets", destination: AnyView(PaymentsDemoView())),
        SDKModule(icon: "📷", name: "Camera", subtitle: "Capture modes, filters, photo editing", destination: AnyView(CameraDemoView())),
        SDKModule(icon: "🔗", name: "Deeplink", subtitle: "URL routing, link generation", destination: AnyView(DeepLinkDemoView())),
        SDKModule(icon: "📄", name: "Document", subtitle: "File picker, PDF annotation, signatures", destination: AnyView(DocumentDemoView())),
        SDKModule(icon: "🤖", name: "Edge AI", subtitle: "OCR, model pipeline, voice intent", destination: AnyView(EdgeAIDemoView())),
        SDKModule(icon: "🎵", name: "Media", subtitle: "Player, quality selection, DRM, downloads", destination: AnyView(MediaDemoView())),
        SDKModule(icon: "🎬", name: "Video Editor", subtitle: "Timeline, transitions, effects, export", destination: AnyView(VideoEditorDemoView())),
        SDKModule(icon: "🏗️", name: "App Shell", subtitle: "API client, cart, feature flags, forms", destination: AnyView(AppShellDemoView())),
        SDKModule(icon: "🔔", name: "Notify", subtitle: "Scheduled notifications, quiet hours, inbox", destination: AnyView(NotifyDemoView())),
        SDKModule(icon: "🎨", name: "UI", subtitle: "Color palette, spacing, typography, device info", destination: AnyView(UIDemoView())),
    ]

    var body: some View {
        NavigationStack {
            List {
                Section {
                    ForEach(rustCoreModules) { module in
                        NavigationLink(destination: module.destination) {
                            moduleRow(module)
                        }
                    }
                } header: {
                    Label("Rust Core (UniFFI)", systemImage: "gearshape.2")
                        .font(.headline)
                        .foregroundStyle(.orange)
                } footer: {
                    Text("Native Swift bindings generated via UniFFI — no JS bridge overhead.")
                        .font(.caption2)
                }

                Section {
                    ForEach(tsModules) { module in
                        NavigationLink(destination: module.destination) {
                            moduleRow(module)
                        }
                    }
                } header: {
                    Label("TypeScript Modules", systemImage: "chevron.left.forwardslash.chevron.right")
                        .font(.headline)
                        .foregroundStyle(.blue)
                } footer: {
                    Text("Accessed via React Native bridge in production apps.")
                        .font(.caption2)
                }
            }
            .navigationTitle("Rajeev SDK")
            .listStyle(.insetGrouped)
        }
    }

    @ViewBuilder
    private func moduleRow(_ module: SDKModule) -> some View {
        HStack(spacing: 12) {
            Text(module.icon)
                .font(.title2)
                .frame(width: 36)
            VStack(alignment: .leading, spacing: 2) {
                Text(module.name)
                    .font(.body.weight(.semibold))
                Text(module.subtitle)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ContentView()
}
