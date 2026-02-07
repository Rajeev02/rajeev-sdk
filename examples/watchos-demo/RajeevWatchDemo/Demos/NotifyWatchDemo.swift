import SwiftUI

/// Notify demo for watchOS: reminders, snooze, quiet hours.
struct NotifyWatchDemo: View {
    @State private var logs: [String] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🔔 Notify").font(.headline)

                Button("Next Reminder") {
                    log("notify.nextReminder()")
                    log("→ \"Take medicine\" in 12 min")
                }
                .buttonStyle(.bordered)

                Button("Snooze 10 min") {
                    log("notify.snooze(reminderId, 10)")
                    log("⏰ Snoozed until 10:42 AM")
                }
                .buttonStyle(.bordered)

                Button("Mark Done") {
                    log("notify.markDone(reminderId)")
                    log("✅ Reminder completed")
                }
                .buttonStyle(.bordered)

                Button("Quiet Hours?") {
                    log("notify.isQuietHours()")
                    log("→ false (active 10 PM – 7 AM)")
                }
                .buttonStyle(.bordered)

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
        .navigationTitle("Notify")
    }

    private func log(_ msg: String) {
        logs.append(msg)
    }
}

#Preview {
    NotifyWatchDemo()
}
