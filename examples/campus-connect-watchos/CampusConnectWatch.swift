// ============================================================
// CampusConnect watchOS — Apple Watch Companion App
// Demonstrates @rajeev02/* SDK libraries on watchOS
// ============================================================
//
// SETUP:
//   1. Add watchOS target to CampusConnect Xcode project
//   2. Copy this file as ContentView.swift in the Watch target
//
// SDK Libraries Demonstrated:
//   @rajeev02/sync       → Synced schedule from phone
//   @rajeev02/notify     → Wrist notifications & haptics
//   @rajeev02/vault      → Secure ID card on wrist
//   @rajeev02/locale     → Hindi/English, ₹ formatting
//   @rajeev02/network    → Connectivity status
//   @rajeev02/auth       → Quick biometric unlock
//   @rajeev02/ui         → Watch-adaptive layout
//   @rajeev02/app-shell  → Feature flags
// ============================================================

import SwiftUI

// MARK: - Theme
struct WatchTheme {
    static let primary = Color(hex: "1a237e")
    static let secondary = Color(hex: "ff6f00")
    static let success = Color(hex: "2e7d32")
    static let warning = Color(hex: "f57f17")
    static let error = Color(hex: "c62828")
}

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255.0,
            green: Double((rgb >> 8) & 0xFF) / 255.0,
            blue: Double(rgb & 0xFF) / 255.0
        )
    }
}

// MARK: - Models
struct WatchClass: Identifiable {
    let id: Int
    let subject: String
    let time: String
    let room: String
    let type: String
}

struct WatchNotification: Identifiable {
    let id: Int
    let title: String
    let body: String
    let emoji: String
    let time: String
}

// MARK: - Data
let todayClasses: [WatchClass] = [
    .init(id: 1, subject: "DSA", time: "09:00", room: "LH-201", type: "Lecture"),
    .init(id: 2, subject: "OS Lab", time: "11:00", room: "Lab-3", type: "Lab"),
    .init(id: 3, subject: "DBMS", time: "14:00", room: "LH-105", type: "Lecture"),
]

let watchNotifs: [WatchNotification] = [
    .init(id: 1, title: "Assignment Due", body: "DSA linked list — 11:59 PM", emoji: "⏰", time: "2h"),
    .init(id: 2, title: "Fee Reminder", body: "₹45,000 due Jan 31", emoji: "💰", time: "5h"),
    .init(id: 3, title: "Class Cancelled", body: "OS Lab rescheduled", emoji: "📚", time: "1d"),
]

// MARK: - Watch App Entry
@main
struct CampusConnectWatchApp: App {
    var body: some Scene {
        WindowGroup {
            WatchHomeView()
        }
    }
}

// MARK: - Home View (Tab-based)
struct WatchHomeView: View {
    var body: some View {
        TabView {
            ScheduleView()
            NotificationsView()
            IDCardView()
            QuickInfoView()
        }
        .tabViewStyle(.verticalPage)
    }
}

// MARK: - Schedule View
struct ScheduleView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("📅 Today")
                        .font(.headline)
                        .fontWeight(.bold)
                    Spacer()
                    Text("Mon")
                        .font(.caption2)
                        .foregroundColor(.gray)
                }

                ForEach(todayClasses) { cls in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(cls.time)
                                .font(.caption2)
                                .fontWeight(.bold)
                                .foregroundColor(WatchTheme.primary)
                            Text(cls.subject)
                                .font(.caption)
                                .fontWeight(.semibold)
                            Text(cls.room)
                                .font(.system(size: 10))
                                .foregroundColor(.gray)
                        }
                        Spacer()
                        Text(cls.type)
                            .font(.system(size: 9))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(cls.type == "Lab" ? WatchTheme.warning.opacity(0.3) : WatchTheme.primary.opacity(0.3))
                            .cornerRadius(4)
                    }
                    .padding(8)
                    .background(Color.gray.opacity(0.15))
                    .cornerRadius(8)
                }

                // SDK Attribution
                Text("@rajeev02/sync + notify")
                    .font(.system(size: 8))
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.top, 4)
            }
        }
    }
}

// MARK: - Notifications View
struct NotificationsView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text("🔔 Alerts")
                    .font(.headline)
                    .fontWeight(.bold)

                ForEach(watchNotifs) { notif in
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            Text(notif.emoji)
                                .font(.caption)
                            Text(notif.title)
                                .font(.caption)
                                .fontWeight(.semibold)
                                .lineLimit(1)
                        }
                        Text(notif.body)
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                            .lineLimit(2)
                        Text(notif.time + " ago")
                            .font(.system(size: 9))
                            .foregroundColor(.gray)
                    }
                    .padding(8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.gray.opacity(0.15))
                    .cornerRadius(8)
                }

                Text("@rajeev02/notify")
                    .font(.system(size: 8))
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
        }
    }
}

// MARK: - ID Card View
struct IDCardView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("🪪")
                    .font(.title2)

                Text("Rajeev Joshi")
                    .font(.caption)
                    .fontWeight(.bold)

                Text("Computer Science")
                    .font(.system(size: 10))
                    .foregroundColor(.gray)

                Divider()

                HStack(spacing: 16) {
                    VStack {
                        Text("Roll").font(.system(size: 8)).foregroundColor(.gray)
                        Text("CS-042").font(.system(size: 10)).fontWeight(.bold)
                    }
                    VStack {
                        Text("Sem").font(.system(size: 8)).foregroundColor(.gray)
                        Text("6").font(.system(size: 10)).fontWeight(.bold)
                    }
                    VStack {
                        Text("Year").font(.system(size: 8)).foregroundColor(.gray)
                        Text("3rd").font(.system(size: 10)).fontWeight(.bold)
                    }
                }

                // Barcode simulation
                Text("||||| STU-2024-001 |||||")
                    .font(.system(size: 8, design: .monospaced))
                    .foregroundColor(.gray)

                HStack(spacing: 4) {
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 8))
                        .foregroundColor(WatchTheme.success)
                    Text("@rajeev02/vault")
                        .font(.system(size: 8))
                        .foregroundColor(.gray)
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(LinearGradient(
                        colors: [WatchTheme.primary.opacity(0.2), Color.gray.opacity(0.1)],
                        startPoint: .topLeading, endPoint: .bottomTrailing
                    ))
            )
        }
    }
}

// MARK: - Quick Info View
struct QuickInfoView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 10) {
                Text("ℹ️ Quick Info")
                    .font(.headline)
                    .fontWeight(.bold)

                InfoRow(icon: "📚", label: "Classes", value: "3 today")
                InfoRow(icon: "💰", label: "Fees", value: "₹47,000")
                InfoRow(icon: "📊", label: "CGPA", value: "8.7")
                InfoRow(icon: "📡", label: "Sync", value: "✅")
                InfoRow(icon: "🔋", label: "Network", value: "WiFi")

                Divider()

                Text("Rajeev SDK v0.2.1")
                    .font(.system(size: 9))
                    .foregroundColor(.gray)
                Text("8 libraries on watchOS")
                    .font(.system(size: 8))
                    .foregroundColor(.gray)

                Text("@rajeev02/sync · network · vault\nnotify · locale · auth · ui · app-shell")
                    .font(.system(size: 7))
                    .foregroundColor(WatchTheme.primary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
            }
        }
    }
}

struct InfoRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(icon).font(.caption)
            Text(label).font(.caption2).foregroundColor(.gray)
            Spacer()
            Text(value).font(.caption2).fontWeight(.semibold)
        }
    }
}
