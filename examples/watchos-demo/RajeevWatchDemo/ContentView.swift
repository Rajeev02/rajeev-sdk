import SwiftUI

struct ContentView: View {
    private let demos: [(emoji: String, name: String, destination: AnyView)] = [
        ("🔐", "Vault",    AnyView(VaultWatchDemo())),
        ("🌐", "Network",  AnyView(NetworkWatchDemo())),
        ("🔄", "Sync",     AnyView(SyncWatchDemo())),
        ("🌍", "Locale",   AnyView(LocaleWatchDemo())),
        ("🔔", "Notify",   AnyView(NotifyWatchDemo())),
        ("🛡️", "Auth",     AnyView(AuthWatchDemo())),
        ("💳", "Payments", AnyView(PaymentsWatchDemo())),
        ("🎨", "UI Tokens", AnyView(UIWatchDemo())),
    ]

    var body: some View {
        NavigationStack {
            List(demos, id: \.name) { demo in
                NavigationLink(destination: demo.destination) {
                    HStack(spacing: 8) {
                        Text(demo.emoji)
                        Text(demo.name)
                            .font(.body)
                    }
                }
            }
            .navigationTitle("Rajeev SDK")
        }
    }
}

#Preview {
    ContentView()
}
