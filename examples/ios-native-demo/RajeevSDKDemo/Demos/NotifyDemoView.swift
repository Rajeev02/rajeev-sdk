import SwiftUI

// In production, accessed via React Native bridge:
// import RajeevNotify (React Native module)

struct NotifyDemoView: View {
    @State private var logs: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            Text("Notify")
                .font(.title)
                .fontWeight(.bold)
            Text("Notifications, quiet hours & inbox — TypeScript module via RN bridge")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.bottom, 12)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // MARK: – Schedule
                    sectionHeader("Schedule Notifications")

                    Button("Schedule: Order Update") {
                        log("🔔 Notification scheduled:")
                        log("   Title: \"Order Shipped!\"")
                        log("   Body: \"Your order #ORD-42 is on its way\"")
                        log("   Channel: order_updates")
                        log("   Priority: high")
                        log("   Trigger: immediate")
                        log("   Sound: default")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Schedule: Reminder (30m)") {
                        log("⏰ Notification scheduled:")
                        log("   Title: \"Complete your purchase\"")
                        log("   Body: \"Items in your cart are selling fast!\"")
                        log("   Channel: reminders")
                        log("   Priority: normal")
                        log("   Trigger: 30 minutes from now")
                        log("   Repeats: no")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Schedule: Daily Digest (9 AM)") {
                        log("📅 Notification scheduled:")
                        log("   Title: \"Your Daily Digest\"")
                        log("   Body: \"3 new offers, 1 order update\"")
                        log("   Channel: digest")
                        log("   Priority: low")
                        log("   Trigger: daily at 09:00 IST")
                        log("   Repeats: yes (daily)")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Cancel All Scheduled") {
                        log("❌ All scheduled notifications cancelled")
                        log("   Removed: 3 pending notifications")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    // MARK: – Quiet Hours
                    sectionHeader("Quiet Hours")

                    Button("Set Quiet Hours (10 PM – 7 AM)") {
                        log("🌙 Quiet hours configured:")
                        log("   Start: 22:00 IST")
                        log("   End:   07:00 IST")
                        log("   Days: Mon–Sun")
                        log("   Override: critical notifications only")
                        log("   Status: active")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Check Current Status") {
                        let hour = Calendar.current.component(.hour, from: Date())
                        let isQuiet = hour >= 22 || hour < 7
                        log("🔇 Quiet hours status:")
                        log("   Currently: \(isQuiet ? "IN quiet hours" : "OUTSIDE quiet hours")")
                        log("   Next window: 22:00 – 07:00 IST")
                        log("   Suppressed today: 5 notifications")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Disable Quiet Hours") {
                        log("🔊 Quiet hours disabled")
                        log("   All notifications will be delivered immediately")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    // MARK: – Inbox
                    sectionHeader("Inbox Management")

                    Button("Fetch Inbox") {
                        log("📬 Inbox loaded:")
                        log("   Total: 12 notifications")
                        log("   Unread: 4")
                        log("   ──────────────────────────────────")
                        log("   🔴 Order shipped — 2 min ago")
                        log("   🔴 Payment received ₹1,171 — 15 min ago")
                        log("   🔴 New offer: 20% off — 1 hour ago")
                        log("   🔴 Delivery arriving — 2 hours ago")
                        log("   ⚪ Welcome! — 1 day ago")
                        log("   ⚪ ... and 7 more")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Mark All as Read") {
                        log("✅ All notifications marked as read")
                        log("   Updated: 4 notifications")
                        log("   Unread count: 0")
                        log("   Badge cleared")
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Delete Read Notifications") {
                        log("🗑️ Read notifications deleted:")
                        log("   Deleted: 8 notifications")
                        log("   Remaining: 4 (unread)")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.red)

                    Button("Get Notification Stats") {
                        log("📊 Notification statistics:")
                        log("   Total received (30d): 87")
                        log("   Opened: 34 (39.1% open rate)")
                        log("   Dismissed: 41")
                        log("   Suppressed (quiet hours): 12")
                        log("   Top channel: order_updates (28)")
                    }
                    .buttonStyle(.borderedProminent)

                    Divider()
                    clearLogButton
                }
                .padding()
            }

            logOutputView
        }
        .navigationTitle("Notify")
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
        NotifyDemoView()
    }
}
