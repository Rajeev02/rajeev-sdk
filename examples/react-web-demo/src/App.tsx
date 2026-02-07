import { useState } from "react";
import {
  VaultDemo,
  NetworkDemo,
  LocaleDemo,
  SyncDemo,
  NotifyDemo,
  UITokensDemo,
  AuthDemo,
  PaymentsDemo,
  CameraDemo,
  DeepLinkDemo,
  DocumentDemo,
  EdgeAIDemo,
  MediaDemo,
  VideoEditorDemo,
  AppShellDemo,
} from "./demos";

interface LibEntry {
  key: string;
  icon: string;
  name: string;
  desc: string;
  component: React.FC;
}

const libs: LibEntry[] = [
  {
    key: "vault",
    icon: "🔐",
    name: "Vault",
    desc: "Encrypted Storage",
    component: VaultDemo,
  },
  {
    key: "network",
    icon: "🌐",
    name: "Network",
    desc: "Smart Networking",
    component: NetworkDemo,
  },
  {
    key: "locale",
    icon: "🇮🇳",
    name: "Locale",
    desc: "Indian Localization",
    component: LocaleDemo,
  },
  {
    key: "sync",
    icon: "🔄",
    name: "Sync",
    desc: "Offline-first CRDT",
    component: SyncDemo,
  },
  {
    key: "notify",
    icon: "🔔",
    name: "Notify",
    desc: "Notifications",
    component: NotifyDemo,
  },
  {
    key: "ui",
    icon: "🎨",
    name: "UI Tokens",
    desc: "Design System",
    component: UITokensDemo,
  },
  {
    key: "auth",
    icon: "🔑",
    name: "Auth",
    desc: "Authentication",
    component: AuthDemo,
  },
  {
    key: "payments",
    icon: "💳",
    name: "Payments",
    desc: "Payments & UPI",
    component: PaymentsDemo,
  },
  {
    key: "camera",
    icon: "📷",
    name: "Camera",
    desc: "Camera & Editor",
    component: CameraDemo,
  },
  {
    key: "deeplink",
    icon: "🔗",
    name: "Deep Link",
    desc: "Universal Links",
    component: DeepLinkDemo,
  },
  {
    key: "document",
    icon: "📄",
    name: "Document",
    desc: "Document Tools",
    component: DocumentDemo,
  },
  {
    key: "edgeai",
    icon: "🤖",
    name: "Edge AI",
    desc: "On-device ML",
    component: EdgeAIDemo,
  },
  {
    key: "media",
    icon: "▶️",
    name: "Media",
    desc: "Media Player",
    component: MediaDemo,
  },
  {
    key: "video",
    icon: "🎬",
    name: "Video Editor",
    desc: "Video Tools",
    component: VideoEditorDemo,
  },
  {
    key: "appshell",
    icon: "🏗️",
    name: "App Shell",
    desc: "App Framework",
    component: AppShellDemo,
  },
];

export default function App() {
  const [active, setActive] = useState("vault");
  const entry = libs.find((l) => l.key === active)!;
  const ActiveComponent = entry.component;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          minWidth: 250,
          background: "#1a1a2e",
          color: "#e0e0e0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 16px 12px",
            borderBottom: "1px solid #2a2a4a",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
            ⚡ Rajeev SDK
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            React Web Demo
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {libs.map((lib) => {
            const isActive = lib.key === active;
            return (
              <button
                key={lib.key}
                onClick={() => setActive(lib.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 16px",
                  border: "none",
                  background: isActive ? "#4F46E5" : "transparent",
                  color: isActive ? "#fff" : "#ccc",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 14,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#2a2a4a";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 20 }}>{lib.icon}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{lib.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{lib.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#f5f5f5",
        }}
      >
        <ActiveComponent />
      </main>
    </div>
  );
}
