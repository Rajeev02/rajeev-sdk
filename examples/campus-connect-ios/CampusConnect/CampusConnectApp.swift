// ============================================================
// CampusConnect iOS — SwiftUI Native App
// Demonstrates @rajeev02/* SDK libraries in a native iOS context
// ============================================================
//
// SETUP:
//   1. Create new Xcode project → App → SwiftUI
//   2. Copy this file as ContentView.swift
//   3. Add SPM dependencies or CocoaPods for @rajeev02/* packages
//
// SDK Libraries Used:
//   @rajeev02/vault       → Keychain storage, encrypted ID card
//   @rajeev02/network     → Connectivity monitoring, caching
//   @rajeev02/sync        → CRDT data sync across devices
//   @rajeev02/locale      → Hindi/English, ₹ formatting
//   @rajeev02/auth        → Biometric auth (Face ID / Touch ID)
//   @rajeev02/notify      → Push notifications, local alerts
//   @rajeev02/ui          → Adaptive layout, design tokens
//   @rajeev02/app-shell   → Feature flags, analytics
//   @rajeev02/payments    → UPI payments, fee processing
//   @rajeev02/camera      → QR scanner for attendance
//   @rajeev02/deeplink    → Universal links for event sharing
//   @rajeev02/document    → PDF generation for receipts
//   @rajeev02/edge-ai     → On-device OCR for note scanning
//   @rajeev02/media       → Lecture audio playback
//   @rajeev02/video-editor → Video project management
// ============================================================

import SwiftUI

// MARK: - Theme
struct CampusTheme {
    static let primary = Color(hex: "1a237e")
    static let primaryLight = Color(hex: "534bae")
    static let secondary = Color(hex: "ff6f00")
    static let success = Color(hex: "2e7d32")
    static let error = Color(hex: "c62828")
    static let warning = Color(hex: "f57f17")
    static let background = Color(hex: "f5f5f5")
    static let surface = Color.white
    static let textPrimary = Color(hex: "1a1a2e")
    static let textSecondary = Color.gray
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
struct Student {
    let id = "STU-2024-001"
    let name = "Rajeev Joshi"
    let email = "rajeev@university.edu"
    let phone = "+91 98765 43210"
    let rollNo = "CS-2024-042"
    let department = "Computer Science"
    let semester = 6
    let cgpa = 8.7
    let year = "3rd Year"
    let bloodGroup = "O+"
    let emergencyContact = "+91 99887 76655"
}

struct ClassEntry: Identifiable {
    let id: Int
    let subject: String
    let code: String
    let time: String
    let room: String
    let professor: String
    let day: String
    let type: String // Lecture, Lab, Elective
}

struct Note: Identifiable {
    let id: Int
    let title: String
    let subject: String
    let date: String
    let pages: Int
    let synced: Bool
}

struct CampusEvent: Identifiable {
    let id: Int
    let title: String
    let date: String
    let venue: String
    let type: String
    let emoji: String
    let spots: Int
    let registered: Int
    let fee: Int
}

struct Notification: Identifiable {
    let id: Int
    let title: String
    let body: String
    let type: String
    let time: String
    let read: Bool
}

struct FeeItem: Identifiable {
    let id: Int
    let label: String
    let amount: Int
    let status: String // paid, pending, upcoming
}

struct Lecture: Identifiable {
    let id: Int
    let title: String
    let subject: String
    let duration: String
    let professor: String
}

// MARK: - Mock Data
let student = Student()

let timetable: [ClassEntry] = [
    .init(id: 1, subject: "Data Structures & Algorithms", code: "CS301", time: "09:00 AM", room: "LH-201", professor: "Dr. Sharma", day: "Mon", type: "Lecture"),
    .init(id: 2, subject: "Operating Systems Lab", code: "CS302L", time: "11:00 AM", room: "Lab-3", professor: "Prof. Patel", day: "Mon", type: "Lab"),
    .init(id: 3, subject: "Database Management", code: "CS303", time: "02:00 PM", room: "LH-105", professor: "Dr. Gupta", day: "Mon", type: "Lecture"),
    .init(id: 4, subject: "Computer Networks", code: "CS304", time: "09:00 AM", room: "LH-301", professor: "Dr. Kumar", day: "Tue", type: "Lecture"),
    .init(id: 5, subject: "Software Engineering", code: "CS305", time: "11:00 AM", room: "LH-202", professor: "Prof. Singh", day: "Tue", type: "Lecture"),
    .init(id: 6, subject: "DSA Lab", code: "CS301L", time: "02:00 PM", room: "Lab-1", professor: "Dr. Sharma", day: "Wed", type: "Lab"),
    .init(id: 7, subject: "Mathematics III", code: "MA301", time: "09:00 AM", room: "LH-101", professor: "Dr. Verma", day: "Thu", type: "Lecture"),
    .init(id: 8, subject: "Elective: AI/ML Basics", code: "CS390", time: "02:00 PM", room: "LH-401", professor: "Dr. Iyer", day: "Fri", type: "Elective"),
]

let notes: [Note] = [
    .init(id: 1, title: "Binary Trees & BST", subject: "DSA", date: "Jan 15", pages: 8, synced: true),
    .init(id: 2, title: "SQL Joins & Subqueries", subject: "DBMS", date: "Jan 14", pages: 5, synced: true),
    .init(id: 3, title: "TCP/IP Protocol Stack", subject: "Networks", date: "Jan 13", pages: 12, synced: false),
    .init(id: 4, title: "Process Scheduling", subject: "OS", date: "Jan 12", pages: 6, synced: true),
    .init(id: 5, title: "Graph Algorithms", subject: "DSA", date: "Jan 10", pages: 10, synced: true),
]

let events: [CampusEvent] = [
    .init(id: 1, title: "Annual Tech Fest — TechSpark 2025", date: "Feb 15-17", venue: "Main Auditorium", type: "Tech", emoji: "🚀", spots: 500, registered: 342, fee: 0),
    .init(id: 2, title: "Hackathon: Build for Bharat", date: "Feb 22-23", venue: "Innovation Lab", type: "Hackathon", emoji: "💻", spots: 100, registered: 78, fee: 200),
    .init(id: 3, title: "Cultural Night — Rang Tarang", date: "Mar 1", venue: "Open Air Theatre", type: "Cultural", emoji: "🎭", spots: 1000, registered: 650, fee: 0),
    .init(id: 4, title: "Workshop: React Native & Expo", date: "Mar 15", venue: "CS Lab-3", type: "Workshop", emoji: "📱", spots: 60, registered: 38, fee: 150),
]

let notifications: [Notification] = [
    .init(id: 1, title: "DSA Assignment Due Tomorrow", body: "Submit linked list implementation by 11:59 PM", type: "deadline", time: "2h ago", read: false),
    .init(id: 2, title: "Fee Payment Reminder", body: "Semester 6 fees of ₹45,000 due by Jan 31", type: "payment", time: "5h ago", read: false),
    .init(id: 3, title: "Class Cancelled: OS Lab", body: "Prof. Patel on leave. Rescheduled to Friday", type: "class", time: "Yesterday", read: true),
    .init(id: 4, title: "TechSpark Registration Open", body: "Register for 10+ events. Early bird until Feb 1", type: "event", time: "Yesterday", read: true),
]

let fees: [FeeItem] = [
    .init(id: 1, label: "Tuition Fee", amount: 35000, status: "paid"),
    .init(id: 2, label: "Lab Fee", amount: 5000, status: "paid"),
    .init(id: 3, label: "Library Fee", amount: 2000, status: "pending"),
    .init(id: 4, label: "Hostel Fee", amount: 45000, status: "pending"),
    .init(id: 5, label: "Exam Fee", amount: 3000, status: "upcoming"),
]

let lectures: [Lecture] = [
    .init(id: 1, title: "Introduction to Binary Trees", subject: "DSA", duration: "45 min", professor: "Dr. Sharma"),
    .init(id: 2, title: "SQL Basics & DDL Commands", subject: "DBMS", duration: "50 min", professor: "Dr. Gupta"),
    .init(id: 3, title: "OSI Model Deep Dive", subject: "Networks", duration: "55 min", professor: "Dr. Kumar"),
    .init(id: 4, title: "Semaphores & Deadlocks", subject: "OS", duration: "40 min", professor: "Prof. Patel"),
]

// MARK: - Formatters
func formatINR(_ amount: Int) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.currencySymbol = "₹"
    formatter.locale = Locale(identifier: "en_IN")
    formatter.maximumFractionDigits = 0
    return formatter.string(from: NSNumber(value: amount)) ?? "₹\(amount)"
}

// MARK: - App Entry
@main
struct CampusConnectApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    @State private var isLoggedIn = false

    var body: some View {
        if isLoggedIn {
            MainTabView(onLogout: { isLoggedIn = false })
        } else {
            LoginView(onLogin: { isLoggedIn = true })
        }
    }
}

// MARK: - Login View
struct LoginView: View {
    let onLogin: () -> Void
    @State private var phone = ""
    @State private var otpSent = false
    @State private var otp = ""

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [CampusTheme.primary, CampusTheme.primaryLight],
                startPoint: .topLeading, endPoint: .bottomTrailing
            ).ignoresSafeArea()

            VStack(spacing: 24) {
                Text("🎓").font(.system(size: 64))
                Text("CampusConnect").font(.title).fontWeight(.heavy).foregroundColor(.white)
                Text("Sign in to your college").foregroundColor(.white.opacity(0.7))

                VStack(spacing: 16) {
                    if !otpSent {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("📱 Phone Number").font(.caption).fontWeight(.semibold)
                            TextField("+91 98765 43210", text: $phone)
                                .textFieldStyle(.roundedBorder)
                                .keyboardType(.phonePad)
                        }
                        SDKTag("@rajeev02/auth + vault")
                        Button("Send OTP →") { otpSent = true }
                            .buttonStyle(.borderedProminent)
                            .tint(CampusTheme.primary)
                            .frame(maxWidth: .infinity)

                        Text("or").foregroundColor(.gray)

                        Button("🔐 Google Sign-In") { onLogin() }
                            .buttonStyle(.bordered)
                            .frame(maxWidth: .infinity)
                    } else {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("🔑 Enter OTP").font(.caption).fontWeight(.semibold)
                            TextField("123456", text: $otp)
                                .textFieldStyle(.roundedBorder)
                                .keyboardType(.numberPad)
                        }
                        SDKTag("@rajeev02/auth + vault + notify")
                        Button("Verify & Sign In →") { onLogin() }
                            .buttonStyle(.borderedProminent)
                            .tint(CampusTheme.primary)
                            .frame(maxWidth: .infinity)
                    }
                }
                .padding(32)
                .background(.regularMaterial)
                .cornerRadius(20)
                .padding(.horizontal)
            }
        }
    }
}

// MARK: - Main Tab View
struct MainTabView: View {
    let onLogout: () -> Void

    var body: some View {
        TabView {
            DashboardView()
                .tabItem { Label("Home", systemImage: "house.fill") }
            TimetableView()
                .tabItem { Label("Classes", systemImage: "calendar") }
            FeesView()
                .tabItem { Label("Fees", systemImage: "creditcard.fill") }
            CampusView()
                .tabItem { Label("Campus", systemImage: "graduationcap.fill") }
            ProfileView(onLogout: onLogout)
                .tabItem { Label("Profile", systemImage: "person.fill") }
        }
        .tint(CampusTheme.primary)
    }
}

// MARK: - Dashboard
struct DashboardView: View {
    let todayClasses = timetable.filter { $0.day == "Mon" }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Greeting
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Good Morning 👋").font(.headline).foregroundColor(.gray)
                            Text(student.name).font(.title2).fontWeight(.bold)
                        }
                        Spacer()
                        NavigationLink(destination: NotificationsView()) {
                            ZStack(alignment: .topTrailing) {
                                Image(systemName: "bell.fill").font(.title3).foregroundColor(CampusTheme.primary)
                                Circle().fill(.red).frame(width: 8, height: 8)
                            }
                        }
                    }.padding(.horizontal)

                    // Stats
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        StatCard(icon: "📚", value: "\(todayClasses.count)", label: "Classes Today", sdk: "sync")
                        StatCard(icon: "💰", value: formatINR(47000), label: "Fees Pending", sdk: "payments")
                        StatCard(icon: "🔔", value: "2", label: "Unread Alerts", sdk: "notify")
                        StatCard(icon: "📊", value: "\(student.cgpa)", label: "Current CGPA", sdk: "network")
                    }.padding(.horizontal)

                    // Today's Classes
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("📅 Today's Classes").font(.headline)
                            Spacer()
                            SDKTag("@rajeev02/sync")
                        }
                        ForEach(todayClasses) { cls in
                            ClassCard(entry: cls)
                        }
                    }
                    .padding()
                    .background(.regularMaterial)
                    .cornerRadius(16)
                    .padding(.horizontal)

                    // Quick Actions
                    VStack(alignment: .leading, spacing: 12) {
                        Text("⚡ Quick Actions").font(.headline)
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 12) {
                            QuickAction(icon: "📝", label: "Notes", sdk: "document")
                            QuickAction(icon: "💳", label: "Pay Fees", sdk: "payments")
                            QuickAction(icon: "🪪", label: "ID Card", sdk: "vault")
                            QuickAction(icon: "🎧", label: "Lectures", sdk: "media")
                            QuickAction(icon: "🎉", label: "Events", sdk: "deeplink")
                            QuickAction(icon: "🧠", label: "AI Quiz", sdk: "edge-ai")
                        }
                    }
                    .padding()
                    .background(.regularMaterial)
                    .cornerRadius(16)
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Dashboard")
            .background(CampusTheme.background)
        }
    }
}

// MARK: - Timetable
struct TimetableView: View {
    @State private var selectedDay = "Mon"
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri"]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Day picker
                Picker("Day", selection: $selectedDay) {
                    ForEach(days, id: \.self) { Text($0) }
                }
                .pickerStyle(.segmented)
                .padding()

                ScrollView {
                    VStack(spacing: 12) {
                        let filtered = timetable.filter { $0.day == selectedDay }
                        if filtered.isEmpty {
                            VStack(spacing: 12) {
                                Text("😴").font(.system(size: 48))
                                Text("No classes!").font(.headline).foregroundColor(.gray)
                            }.padding(.top, 60)
                        } else {
                            ForEach(filtered) { cls in
                                ClassCard(entry: cls)
                            }
                        }
                        SDKTag("@rajeev02/sync + network + locale")
                    }.padding()
                }
            }
            .navigationTitle("📅 Timetable")
            .background(CampusTheme.background)
        }
    }
}

// MARK: - Fees
struct FeesView: View {
    @State private var showingPayment = false
    let pendingTotal = fees.filter { $0.status == "pending" }.reduce(0) { $0 + $1.amount }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Total Card
                    VStack(spacing: 8) {
                        Text("Total Pending").font(.subheadline).foregroundColor(.white.opacity(0.8))
                        Text(formatINR(pendingTotal)).font(.system(size: 36, weight: .heavy)).foregroundColor(.white)
                        SDKTag("@rajeev02/payments + locale").foregroundColor(.white.opacity(0.6))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(24)
                    .background(LinearGradient(colors: [CampusTheme.primary, CampusTheme.primaryLight], startPoint: .leading, endPoint: .trailing))
                    .cornerRadius(20)
                    .padding(.horizontal)

                    // Fee List
                    ForEach(fees) { fee in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(fee.label).fontWeight(.semibold)
                                Text(fee.status.capitalized)
                                    .font(.caption)
                                    .foregroundColor(fee.status == "paid" ? CampusTheme.success : fee.status == "pending" ? CampusTheme.warning : CampusTheme.error)
                            }
                            Spacer()
                            Text(formatINR(fee.amount)).fontWeight(.bold)
                            if fee.status != "paid" {
                                Button("Pay") { showingPayment = true }
                                    .buttonStyle(.borderedProminent)
                                    .tint(CampusTheme.primary)
                                    .controlSize(.small)
                            }
                        }
                        .padding()
                        .background(.regularMaterial)
                        .cornerRadius(12)
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("💳 Fees")
            .background(CampusTheme.background)
            .alert("Pay via UPI", isPresented: $showingPayment) {
                TextField("UPI ID", text: .constant(""))
                Button("Pay Now") {}
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("@rajeev02/payments + vault")
            }
        }
    }
}

// MARK: - Campus (Events + ID Card)
struct CampusView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // ID Card Preview
                    NavigationLink(destination: IDCardDetailView()) {
                        IDCardPreview()
                    }
                    .padding(.horizontal)

                    // Events
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("🎉 Upcoming Events").font(.headline)
                            Spacer()
                            SDKTag("@rajeev02/deeplink")
                        }
                        ForEach(events) { event in
                            EventCard(event: event)
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("🎓 Campus")
            .background(CampusTheme.background)
        }
    }
}

// MARK: - Profile
struct ProfileView: View {
    let onLogout: () -> Void
    @State private var darkMode = false
    @State private var hindi = false
    @State private var biometric = true

    var body: some View {
        NavigationStack {
            List {
                // Student Info
                Section {
                    HStack(spacing: 16) {
                        Text("👨‍🎓").font(.system(size: 44))
                        VStack(alignment: .leading) {
                            Text(student.name).font(.headline)
                            Text(student.email).font(.caption).foregroundColor(.gray)
                            Text("\(student.department) · Sem \(student.semester)")
                                .font(.caption2).foregroundColor(.gray)
                        }
                    }.padding(.vertical, 8)
                }

                // Settings
                Section("Preferences") {
                    Toggle(isOn: $hindi) {
                        Label("Language: \(hindi ? "हिंदी" : "English")", systemImage: "globe")
                    }
                    .tint(CampusTheme.primary)
                    SDKTag("@rajeev02/locale")

                    Toggle(isOn: $darkMode) {
                        Label("Dark Mode", systemImage: "moon.fill")
                    }
                    .tint(CampusTheme.primary)
                    SDKTag("@rajeev02/ui")

                    Toggle(isOn: $biometric) {
                        Label("Biometric Lock", systemImage: "faceid")
                    }
                    .tint(CampusTheme.primary)
                    SDKTag("@rajeev02/auth")
                }

                // Feature Flags
                Section("Feature Flags — @rajeev02/app-shell") {
                    FeatureFlag(name: "ai_study_assistant", enabled: true)
                    FeatureFlag(name: "video_notes", enabled: true)
                    FeatureFlag(name: "campus_map_3d", enabled: false)
                    FeatureFlag(name: "peer_tutoring", enabled: false)
                }

                // SDK Packages
                Section("Rajeev SDK v0.2.1") {
                    ForEach(["vault", "network", "sync", "locale", "notify", "ui", "auth",
                             "payments", "camera", "deeplink", "document", "edge-ai",
                             "media", "video-editor", "app-shell"], id: \.self) { pkg in
                        HStack {
                            Text("@rajeev02/\(pkg)").font(.caption).monospaced()
                            Spacer()
                            Text("v0.2.1").font(.caption2).foregroundColor(.gray)
                        }
                    }
                }

                // Logout
                Section {
                    Button(role: .destructive) { onLogout() } label: {
                        Label("Logout", systemImage: "rectangle.portrait.and.arrow.right")
                    }
                    SDKTag("@rajeev02/auth + vault")
                }
            }
            .navigationTitle("⚙️ Profile")
        }
    }
}

// MARK: - Notifications
struct NotificationsView: View {
    var body: some View {
        List {
            ForEach(notifications) { notif in
                HStack(alignment: .top, spacing: 12) {
                    Text(notif.type == "deadline" ? "⏰" : notif.type == "payment" ? "💰" : notif.type == "class" ? "📚" : "🎉")
                        .font(.title2)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(notif.title).fontWeight(.semibold)
                        Text(notif.body).font(.caption).foregroundColor(.gray)
                        Text(notif.time).font(.caption2).foregroundColor(.gray)
                    }
                    Spacer()
                    if !notif.read {
                        Circle().fill(CampusTheme.primary).frame(width: 8, height: 8)
                    }
                }
                .padding(.vertical, 4)
            }
        }
        .navigationTitle("🔔 Notifications")
    }
}

// MARK: - ID Card Detail
struct IDCardDetailView: View {
    @State private var showBack = false

    var body: some View {
        VStack(spacing: 24) {
            if !showBack {
                // Front
                VStack(spacing: 12) {
                    Text("RAJEEV NATIONAL UNIVERSITY").font(.caption).tracking(2)
                    Text("👨‍🎓").font(.system(size: 64))
                    Text(student.name).font(.title2).fontWeight(.heavy)
                    Text(student.department).foregroundColor(.white.opacity(0.8))
                    HStack(spacing: 24) {
                        VStack { Text("Roll No").font(.caption2); Text(student.rollNo).fontWeight(.bold) }
                        VStack { Text("Semester").font(.caption2); Text("\(student.semester)").fontWeight(.bold) }
                        VStack { Text("Year").font(.caption2); Text(student.year).fontWeight(.bold) }
                    }
                    Text("||||| \(student.id) |||||").font(.caption).monospaced().padding(.top, 8)
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(32)
                .background(LinearGradient(colors: [CampusTheme.primary, CampusTheme.primaryLight], startPoint: .topLeading, endPoint: .bottomTrailing))
                .cornerRadius(20)
            } else {
                // Back
                VStack(alignment: .leading, spacing: 12) {
                    Text("Emergency Information").font(.headline)
                    Group {
                        InfoRow(label: "Blood Group", value: student.bloodGroup)
                        InfoRow(label: "Emergency", value: student.emergencyContact)
                        InfoRow(label: "Email", value: student.email)
                        InfoRow(label: "Phone", value: student.phone)
                    }
                    HStack {
                        Image(systemName: "lock.shield.fill").foregroundColor(CampusTheme.success)
                        Text("AES-256 encrypted via @rajeev02/vault").font(.caption).foregroundColor(CampusTheme.success)
                    }
                    .padding()
                    .background(Color.green.opacity(0.1))
                    .cornerRadius(12)
                }
                .padding(32)
                .background(.regularMaterial)
                .cornerRadius(20)
            }

            Button(showBack ? "Show Front" : "Show Back") { showBack.toggle() }
                .buttonStyle(.bordered)

            SDKTag("@rajeev02/vault + auth + camera + ui")
        }
        .padding()
        .navigationTitle("🪪 ID Card")
    }
}

// MARK: - Shared Components
struct StatCard: View {
    let icon: String; let value: String; let label: String; let sdk: String
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(icon).font(.title2)
            Text(value).font(.title3).fontWeight(.heavy)
            Text(label).font(.caption).foregroundColor(.gray)
            Text("@rajeev02/\(sdk)").font(.system(size: 8)).foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.regularMaterial)
        .cornerRadius(16)
    }
}

struct ClassCard: View {
    let entry: ClassEntry
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(entry.time).font(.caption).fontWeight(.bold).foregroundColor(CampusTheme.primary)
                Text(entry.subject).fontWeight(.semibold)
                Text("\(entry.professor) · \(entry.room)").font(.caption).foregroundColor(.gray)
            }
            Spacer()
            Text(entry.type)
                .font(.caption2).fontWeight(.semibold)
                .padding(.horizontal, 10).padding(.vertical, 4)
                .background(entry.type == "Lab" ? Color.orange.opacity(0.15) : CampusTheme.primary.opacity(0.1))
                .foregroundColor(entry.type == "Lab" ? CampusTheme.warning : CampusTheme.primary)
                .cornerRadius(8)
        }
        .padding()
        .background(.regularMaterial)
        .cornerRadius(12)
    }
}

struct QuickAction: View {
    let icon: String; let label: String; let sdk: String
    var body: some View {
        VStack(spacing: 6) {
            Text(icon).font(.title2)
            Text(label).font(.caption).fontWeight(.semibold)
            Text("@rajeev02/\(sdk)").font(.system(size: 7)).foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(CampusTheme.background)
        .cornerRadius(12)
    }
}

struct EventCard: View {
    let event: CampusEvent
    var body: some View {
        HStack(spacing: 16) {
            Text(event.emoji).font(.system(size: 36))
            VStack(alignment: .leading, spacing: 4) {
                Text(event.title).fontWeight(.semibold).lineLimit(1)
                Text("📅 \(event.date) · 📍 \(event.venue)").font(.caption).foregroundColor(.gray)
                HStack(spacing: 8) {
                    Text(event.type).font(.caption2).padding(.horizontal, 8).padding(.vertical, 2)
                        .background(CampusTheme.primary.opacity(0.1)).cornerRadius(6)
                    if event.fee > 0 {
                        Text(formatINR(event.fee)).font(.caption2).padding(.horizontal, 8).padding(.vertical, 2)
                            .background(Color.orange.opacity(0.1)).cornerRadius(6)
                    }
                    Spacer()
                    Text("\(event.registered)/\(event.spots)").font(.caption2).foregroundColor(.gray)
                }
            }
        }
        .padding()
        .background(.regularMaterial)
        .cornerRadius(12)
    }
}

struct IDCardPreview: View {
    var body: some View {
        HStack(spacing: 16) {
            Text("👨‍🎓").font(.system(size: 40))
            VStack(alignment: .leading) {
                Text("Digital ID Card").fontWeight(.bold)
                Text("Tap to view · Encrypted with @rajeev02/vault").font(.caption).foregroundColor(.white.opacity(0.8))
            }
            Spacer()
            Image(systemName: "chevron.right").foregroundColor(.white.opacity(0.6))
        }
        .foregroundColor(.white)
        .padding()
        .background(LinearGradient(colors: [CampusTheme.primary, CampusTheme.primaryLight], startPoint: .leading, endPoint: .trailing))
        .cornerRadius(16)
    }
}

struct FeatureFlag: View {
    let name: String; let enabled: Bool
    var body: some View {
        HStack {
            Text(name).font(.caption).monospaced()
            Spacer()
            Text(enabled ? "ON" : "OFF")
                .font(.caption2).fontWeight(.bold)
                .foregroundColor(enabled ? CampusTheme.success : CampusTheme.error)
                .padding(.horizontal, 10).padding(.vertical, 4)
                .background(enabled ? Color.green.opacity(0.1) : Color.red.opacity(0.1))
                .cornerRadius(6)
        }
    }
}

struct InfoRow: View {
    let label: String; let value: String
    var body: some View {
        HStack {
            Text(label).foregroundColor(.gray)
            Spacer()
            Text(value).fontWeight(.semibold)
        }
    }
}

struct SDKTag: View {
    let text: String
    init(_ text: String) { self.text = text }
    var body: some View {
        Text(text)
            .font(.system(size: 9))
            .foregroundColor(CampusTheme.primary)
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(CampusTheme.primary.opacity(0.08))
            .cornerRadius(4)
    }
}
