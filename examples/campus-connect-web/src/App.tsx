// ============================================================
// CampusConnect Web — Main App with Sidebar Dashboard Layout
// Demonstrates all 15 @rajeev02/* SDK libraries in a web context
// ============================================================
import React, { useState } from "react";
import {
  STUDENT,
  TIMETABLE,
  NOTES,
  EVENTS,
  NOTIFICATIONS,
  FEES,
  LECTURES,
  AppShellService,
  NetworkService,
  SyncService,
  LocaleService,
  SDK_LIBS,
} from "./sdk";

// ─── Types ────────────────────────────────────────────────
type Page =
  | "dashboard"
  | "timetable"
  | "notes"
  | "fees"
  | "events"
  | "notifications"
  | "lectures"
  | "idcard"
  | "profile";

// ─── Main App ─────────────────────────────────────────────
export function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="app-layout">
      <Sidebar
        activePage={page}
        onNavigate={setPage}
        onLogout={() => setLoggedIn(false)}
      />
      <div className="main-content">
        <HeaderBar page={page} />
        {page === "dashboard" && <DashboardPage onNavigate={setPage} />}
        {page === "timetable" && <TimetablePage />}
        {page === "notes" && <NotesPage />}
        {page === "fees" && <FeesPage />}
        {page === "events" && <EventsPage />}
        {page === "notifications" && <NotificationsPage />}
        {page === "lectures" && <LecturesPage />}
        {page === "idcard" && <IDCardPage />}
        {page === "profile" && <ProfilePage />}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────
function Sidebar({
  activePage,
  onNavigate,
  onLogout,
}: {
  activePage: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
}) {
  const navItems: {
    section: string;
    items: { page: Page; icon: string; label: string }[];
  }[] = [
    {
      section: "Main",
      items: [
        { page: "dashboard", icon: "🏠", label: "Dashboard" },
        { page: "notifications", icon: "🔔", label: "Notifications" },
      ],
    },
    {
      section: "Academics",
      items: [
        { page: "timetable", icon: "📅", label: "Timetable" },
        { page: "notes", icon: "📝", label: "Notes" },
        { page: "lectures", icon: "🎧", label: "Lectures" },
      ],
    },
    {
      section: "Campus",
      items: [
        { page: "events", icon: "🎉", label: "Events" },
        { page: "fees", icon: "💳", label: "Fees" },
        { page: "idcard", icon: "🪪", label: "ID Card" },
      ],
    },
    {
      section: "Account",
      items: [{ page: "profile", icon: "⚙️", label: "Settings" }],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>🎓</span>
        <span>CampusConnect</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div className="nav-section" key={section.section}>
            <div className="nav-section-title">{section.section}</div>
            {section.items.map((item) => (
              <div
                key={item.page}
                className={`nav-link ${activePage === item.page ? "active" : ""}`}
                onClick={() => onNavigate(item.page)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
        <div className="nav-section">
          <div
            className="nav-link"
            style={{ color: "#ef9a9a", marginTop: 12 }}
            onClick={onLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </nav>
      <div className="sidebar-footer">
        Powered by Rajeev SDK v0.2.1
        <br />
        15 libraries · All platforms
      </div>
    </aside>
  );
}

// ─── Header Bar ───────────────────────────────────────────
function HeaderBar({ page }: { page: Page }) {
  const titles: Record<Page, string> = {
    dashboard: "🏠 Dashboard",
    timetable: "📅 Timetable",
    notes: "📝 Notes & Study",
    fees: "💳 Fee Payments",
    events: "🎉 Campus Events",
    notifications: "🔔 Notifications",
    lectures: "🎧 Lecture Library",
    idcard: "🪪 Digital ID Card",
    profile: "⚙️ Profile & Settings",
  };
  return (
    <div className="header-bar">
      <h1>{titles[page]}</h1>
      <div className="header-right">
        <div className="network-pill">
          <span className="dot" />
          {NetworkService.connectionType} · {NetworkService.signalStrength}
          <span className="sdk-tag">@rajeev02/network</span>
        </div>
        <div className="header-badge">
          {STUDENT.avatar} {STUDENT.name}
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: "center", fontSize: 48, marginBottom: 12 }}>
          🎓
        </div>
        <h2>CampusConnect</h2>
        <p>Sign in to your college dashboard</p>
        {!otpSent ? (
          <>
            <div className="form-group">
              <label className="form-label">📱 Phone Number</label>
              <input
                className="form-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <SdkBar libs={["auth", "vault"]} />
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
              onClick={() => setOtpSent(true)}
            >
              Send OTP →
            </button>
            <div
              style={{
                textAlign: "center",
                margin: "16px 0",
                color: "#999",
                fontSize: 13,
              }}
            >
              or continue with
            </div>
            <button
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={onLogin}
            >
              🔐 Google Sign-In
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">🔑 Enter OTP</label>
              <input
                className="form-input"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <SdkBar libs={["auth", "vault", "notify"]} />
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
              onClick={onLogin}
            >
              Verify & Sign In →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────
function DashboardPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const todayClasses = TIMETABLE.filter((t) => t.day === "Mon");
  const pendingFees = FEES.filter((f) => f.status === "pending").reduce(
    (s, f) => s + f.amount,
    0,
  );
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="page">
      {/* Stats */}
      <div className="stats-grid">
        <div
          className="stat-card"
          onClick={() => onNavigate("timetable")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">📚</div>
          <div className="stat-value">{todayClasses.length}</div>
          <div className="stat-label">Classes Today</div>
          <div className="stat-sdk">@rajeev02/sync</div>
        </div>
        <div
          className="stat-card"
          onClick={() => onNavigate("fees")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            {LocaleService.formatCurrency(pendingFees)}
          </div>
          <div className="stat-label">Fees Pending</div>
          <div className="stat-sdk">@rajeev02/payments</div>
        </div>
        <div
          className="stat-card"
          onClick={() => onNavigate("notifications")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{unread}</div>
          <div className="stat-label">Unread Alerts</div>
          <div className="stat-sdk">@rajeev02/notify</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{STUDENT.cgpa}</div>
          <div className="stat-label">Current CGPA</div>
          <div className="stat-sdk">@rajeev02/network</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📅 Today's Schedule</div>
              <div className="card-subtitle">Monday</div>
            </div>
            <span className="sdk-tag">@rajeev02/sync</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Room</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {todayClasses.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.time}</td>
                    <td>{c.subject}</td>
                    <td>{c.room}</td>
                    <td>
                      <span
                        className={`badge ${c.type === "Lab" ? "badge-warning" : "badge-primary"}`}
                      >
                        {c.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚡ Quick Actions</div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              {
                icon: "📝",
                label: "Scan Notes",
                sdk: "camera + document",
                action: "notes" as Page,
              },
              {
                icon: "💳",
                label: "Pay Fees",
                sdk: "payments",
                action: "fees" as Page,
              },
              {
                icon: "🪪",
                label: "Show ID",
                sdk: "vault",
                action: "idcard" as Page,
              },
              {
                icon: "🎧",
                label: "Lectures",
                sdk: "media",
                action: "lectures" as Page,
              },
              {
                icon: "🎉",
                label: "Events",
                sdk: "deeplink",
                action: "events" as Page,
              },
              {
                icon: "📊",
                label: "AI Quiz",
                sdk: "edge-ai",
                action: "notes" as Page,
              },
            ].map((a) => (
              <div
                key={a.label}
                style={{
                  padding: 16,
                  background: "#f5f5f5",
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() => onNavigate(a.action)}
              >
                <div style={{ fontSize: 28 }}>{a.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 6 }}>
                  {a.label}
                </div>
                <div style={{ fontSize: 9, color: "#999", marginTop: 4 }}>
                  @rajeev02/{a.sdk}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🔔 Recent Notifications</div>
          <span className="sdk-tag">@rajeev02/notify</span>
        </div>
        {NOTIFICATIONS.slice(0, 4).map((n) => (
          <div key={n.id} className={`notif-row ${!n.read ? "unread" : ""}`}>
            <div className="notif-icon">
              {n.type === "deadline"
                ? "⏰"
                : n.type === "payment"
                  ? "💰"
                  : n.type === "class"
                    ? "📚"
                    : n.type === "event"
                      ? "🎉"
                      : "📢"}
            </div>
            <div style={{ flex: 1 }}>
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
              <div className="notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>

      <SdkBar
        libs={[
          "app-shell",
          "auth",
          "network",
          "sync",
          "ui",
          "locale",
          "notify",
        ]}
      />
    </div>
  );
}

// ─── Timetable Page ───────────────────────────────────────
function TimetablePage() {
  const [day, setDay] = useState("Mon");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const filtered = TIMETABLE.filter((t) => t.day === day);

  return (
    <div className="page">
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {days.map((d) => (
          <button
            key={d}
            className={`btn ${d === day ? "btn-primary" : "btn-secondary"} btn-sm`}
            onClick={() => setDay(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">📅 {day} Schedule</div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge badge-success">✅ Synced</span>
            <span className="sdk-tag">@rajeev02/sync</span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Code</th>
                <th>Subject</th>
                <th>Professor</th>
                <th>Room</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.time}</td>
                    <td>
                      <span className="badge badge-primary">{c.code}</span>
                    </td>
                    <td>{c.subject}</td>
                    <td>{c.professor}</td>
                    <td>{c.room}</td>
                    <td>
                      <span
                        className={`badge ${c.type === "Lab" ? "badge-warning" : c.type === "Elective" ? "badge-success" : "badge-primary"}`}
                      >
                        {c.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: 32, color: "#999" }}
                  >
                    No classes scheduled
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <SdkBar libs={["sync", "network", "locale", "notify"]} />
      </div>
    </div>
  );
}

// ─── Notes Page ───────────────────────────────────────────
function NotesPage() {
  return (
    <div className="page">
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button className="btn btn-primary">📸 Scan New Note</button>
        <button className="btn btn-secondary">🧠 Generate AI Quiz</button>
      </div>
      <div className="grid-3">
        {NOTES.map((note) => (
          <div key={note.id} className="note-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span className="badge badge-primary">{note.subject}</span>
              <span
                className={`badge ${note.synced ? "badge-success" : "badge-warning"}`}
              >
                {note.synced ? "✅ Synced" : "🔄 Pending"}
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              {note.title}
            </h3>
            <div style={{ fontSize: 12, color: "#999" }}>
              {note.pages} pages · {note.date}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <button className="btn btn-secondary btn-sm">📄 View</button>
              <button className="btn btn-secondary btn-sm">🧠 Quiz</button>
            </div>
          </div>
        ))}
      </div>
      <SdkBar libs={["camera", "document", "edge-ai", "sync", "network"]} />
    </div>
  );
}

// ─── Fees Page ────────────────────────────────────────────
function FeesPage() {
  const totalPending = FEES.filter((f) => f.status === "pending").reduce(
    (s, f) => s + f.amount,
    0,
  );

  return (
    <div className="page">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            {LocaleService.formatCurrency(totalPending)}
          </div>
          <div className="stat-label">Total Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">
            {FEES.filter((f) => f.status === "paid").length}
          </div>
          <div className="stat-label">Paid Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">
            {FEES.filter((f) => f.status === "pending").length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">💳 Fee Breakdown</div>
          <span className="sdk-tag">@rajeev02/payments + locale</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fee Item</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date / Due</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.label}</td>
                  <td>{LocaleService.formatCurrency(f.amount)}</td>
                  <td>
                    <span
                      className={`badge ${f.status === "paid" ? "badge-success" : f.status === "pending" ? "badge-warning" : "badge-error"}`}
                    >
                      {f.status === "paid"
                        ? "✅ Paid"
                        : f.status === "pending"
                          ? "⏳ Pending"
                          : "🔜 Upcoming"}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {(f as any).date || (f as any).due}
                  </td>
                  <td>
                    {f.status !== "paid" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          alert(
                            `Pay ${LocaleService.formatCurrency(f.amount)} via UPI\n\n@rajeev02/payments\n@rajeev02/vault`,
                          )
                        }
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SdkBar libs={["payments", "vault", "locale", "notify", "network"]} />
      </div>
    </div>
  );
}

// ─── Events Page ──────────────────────────────────────────
function EventsPage() {
  return (
    <div className="page">
      <div className="grid-3">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="event-card">
            <div className="event-banner" style={{ background: ev.color }}>
              {ev.emoji}
            </div>
            <div className="event-body">
              <div className="event-title">{ev.title}</div>
              <div className="event-meta">
                📅 {ev.date} · 📍 {ev.venue}
              </div>
              <div style={{ margin: "8px 0", fontSize: 12 }}>
                <span className="badge badge-primary">{ev.type}</span>
                {ev.fee > 0 && (
                  <span
                    className="badge badge-warning"
                    style={{ marginLeft: 6 }}
                  >
                    {LocaleService.formatCurrency(ev.fee)}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
                {ev.registered}/{ev.spots} registered
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className={`btn btn-sm ${ev.registered >= ev.spots ? "btn-secondary" : "btn-primary"}`}
                  disabled={ev.registered >= ev.spots}
                  onClick={() =>
                    alert(
                      `Registered for ${ev.title}!\n\n@rajeev02/deeplink\n@rajeev02/notify`,
                    )
                  }
                >
                  {ev.registered >= ev.spots ? "Full" : "Register"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    alert(
                      `Share link:\ncampusconnect://event/${ev.id}\n\n@rajeev02/deeplink`,
                    )
                  }
                >
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SdkBar libs={["deeplink", "notify", "payments", "network", "locale"]} />
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────
function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const types = ["all", "deadline", "payment", "class", "event", "general"];
  const filtered =
    filter === "all"
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((n) => n.type === filter);

  return (
    <div className="page">
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {types.map((t) => (
          <button
            key={t}
            className={`btn ${t === filter ? "btn-primary" : "btn-secondary"} btn-sm`}
            onClick={() => setFilter(t)}
          >
            {t === "all"
              ? "📋 All"
              : t === "deadline"
                ? "⏰ Deadline"
                : t === "payment"
                  ? "💰 Payment"
                  : t === "class"
                    ? "📚 Class"
                    : t === "event"
                      ? "🎉 Event"
                      : "📢 General"}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">📬 Inbox</div>
          <span className="sdk-tag">@rajeev02/notify</span>
        </div>
        {filtered.map((n) => (
          <div key={n.id} className={`notif-row ${!n.read ? "unread" : ""}`}>
            <div className="notif-icon">
              {n.type === "deadline"
                ? "⏰"
                : n.type === "payment"
                  ? "💰"
                  : n.type === "class"
                    ? "📚"
                    : n.type === "event"
                      ? "🎉"
                      : "📢"}
            </div>
            <div style={{ flex: 1 }}>
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
              <div className="notif-time">{n.time}</div>
            </div>
            {!n.read && <span className="badge badge-primary">New</span>}
          </div>
        ))}
        <SdkBar libs={["notify", "network", "locale"]} />
      </div>
    </div>
  );
}

// ─── Lectures Page ────────────────────────────────────────
function LecturesPage() {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <div className="page">
      {playing !== null && (
        <div className="player-bar" style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 24 }}>🎧</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {LECTURES.find((l) => l.id === playing)?.title}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>
              {LECTURES.find((l) => l.id === playing)?.professor}
            </div>
            <div className="progress" style={{ marginTop: 8 }}>
              <div className="progress-fill" style={{ width: "35%" }} />
            </div>
          </div>
          <span
            style={{ cursor: "pointer", fontSize: 22 }}
            onClick={() => setPlaying(null)}
          >
            ⏹
          </span>
          <span
            className="sdk-tag"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            @rajeev02/media
          </span>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">📚 Recorded Lectures</div>
          <span className="sdk-tag">@rajeev02/media + network</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Professor</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {LECTURES.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.title}</td>
                  <td>
                    <span className="badge badge-primary">{l.subject}</span>
                  </td>
                  <td>{l.professor}</td>
                  <td>{l.duration}</td>
                  <td style={{ fontSize: 13 }}>{l.date}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${playing === l.id ? "btn-danger" : "btn-primary"}`}
                      onClick={() => setPlaying(playing === l.id ? null : l.id)}
                    >
                      {playing === l.id ? "⏹ Stop" : "▶️ Play"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SdkBar libs={["media", "network", "sync"]} />
      </div>
    </div>
  );
}

// ─── ID Card Page ─────────────────────────────────────────
function IDCardPage() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="page">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <button
          className="btn btn-secondary"
          onClick={() => setFlipped(!flipped)}
        >
          🔄 {flipped ? "Show Front" : "Show Back"}
        </button>
      </div>

      <div
        className="id-card"
        style={{ cursor: "pointer" }}
        onClick={() => setFlipped(!flipped)}
      >
        {!flipped ? (
          <div className="id-front">
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Rajeev National University
            </div>
            <div style={{ fontSize: 48, margin: "16px 0" }}>
              {STUDENT.avatar}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{STUDENT.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
              {STUDENT.department}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 24,
                margin: "16px 0",
                fontSize: 13,
              }}
            >
              <div>
                <strong>Roll No</strong>
                <br />
                {STUDENT.rollNo}
              </div>
              <div>
                <strong>Semester</strong>
                <br />
                {STUDENT.semester}
              </div>
              <div>
                <strong>Year</strong>
                <br />
                {STUDENT.year}
              </div>
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                letterSpacing: 4,
                marginTop: 12,
              }}
            >
              ||||| {STUDENT.id} |||||
            </div>
          </div>
        ) : (
          <div className="id-back">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>
              Emergency Information
            </h3>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              <div>
                <strong>Blood Group:</strong> {STUDENT.bloodGroup}
              </div>
              <div>
                <strong>Emergency:</strong> {STUDENT.emergencyContact}
              </div>
              <div>
                <strong>Email:</strong> {STUDENT.email}
              </div>
              <div>
                <strong>Phone:</strong> {STUDENT.phone}
              </div>
            </div>
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#e8f5e9",
                borderRadius: 8,
                fontSize: 11,
                color: "#2e7d32",
              }}
            >
              🔒 Secured with AES-256 encryption via @rajeev02/vault
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <SdkBar libs={["vault", "auth", "camera", "ui"]} />
      </div>
    </div>
  );
}

// ─── Profile & Settings Page ──────────────────────────────
function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [hindi, setHindi] = useState(false);
  const [biometric, setBiometric] = useState(true);

  return (
    <div className="page">
      {/* Profile Card */}
      <div
        className="card"
        style={{ textAlign: "center", marginBottom: 24, padding: 32 }}
      >
        <div style={{ fontSize: 56 }}>{STUDENT.avatar}</div>
        <h2 style={{ marginTop: 12 }}>{STUDENT.name}</h2>
        <p style={{ color: "#999", fontSize: 14 }}>{STUDENT.email}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <span className="badge badge-primary">{STUDENT.department}</span>
          <span className="badge badge-success">Roll: {STUDENT.rollNo}</span>
          <span className="badge badge-warning">Sem {STUDENT.semester}</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Settings */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚙️ Preferences</div>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-icon">🌐</span>
              <div>
                <div className="setting-label">Language</div>
                <div className="setting-desc">
                  @rajeev02/locale — {hindi ? "हिंदी" : "English"}
                </div>
              </div>
            </div>
            <div
              className={`toggle ${hindi ? "active" : ""}`}
              onClick={() => setHindi(!hindi)}
            />
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-icon">🌙</span>
              <div>
                <div className="setting-label">Dark Mode</div>
                <div className="setting-desc">
                  @rajeev02/ui — {darkMode ? "On" : "Off"}
                </div>
              </div>
            </div>
            <div
              className={`toggle ${darkMode ? "active" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
            />
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-icon">🔐</span>
              <div>
                <div className="setting-label">Biometric Lock</div>
                <div className="setting-desc">
                  @rajeev02/auth — Face ID / Touch ID
                </div>
              </div>
            </div>
            <div
              className={`toggle ${biometric ? "active" : ""}`}
              onClick={() => setBiometric(!biometric)}
            />
          </div>
        </div>

        {/* Feature Flags */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🚩 Feature Flags</div>
            <span className="sdk-tag">@rajeev02/app-shell</span>
          </div>
          {Object.entries(AppShellService.featureFlags).map(([key, val]) => (
            <div className="setting-row" key={key}>
              <div className="setting-info">
                <div>
                  <div
                    className="setting-label"
                    style={{ fontFamily: "monospace", fontSize: 13 }}
                  >
                    {key}
                  </div>
                </div>
              </div>
              <span
                className={`badge ${val ? "badge-success" : "badge-error"}`}
              >
                {val ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SDK Versions */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title">📦 Rajeev SDK Libraries</div>
          <span className="badge badge-success">v0.2.1</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SDK_LIBS.map((lib) => (
            <span
              key={lib}
              className="badge badge-primary"
              style={{ fontSize: 12, padding: "6px 14px" }}
            >
              @rajeev02/{lib}
            </span>
          ))}
        </div>
      </div>

      <SdkBar libs={["auth", "vault", "locale", "ui", "app-shell"]} />
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────
function SdkBar({ libs }: { libs: string[] }) {
  return (
    <div className="lib-bar">
      {libs.map((lib) => (
        <span key={lib} className="sdk-tag">
          @rajeev02/{lib}
        </span>
      ))}
    </div>
  );
}
