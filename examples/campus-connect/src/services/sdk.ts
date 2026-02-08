// ============================================================
// CampusConnect — SDK Integration Layer
// Demonstrates all 15 @rajeev02/* libraries in a real app
// ============================================================

// ── 1. App Shell (@rajeev02/app-shell) ──────────────────────
// Bootstrap, feature flags, A/B testing, analytics
export const AppShellService = {
  featureFlags: {
    aiStudyAssistant: true,
    darkMode: true,
    videoStudio: true,
    campusRadio: false, // Feature flag: not yet launched
    arNavigation: false, // A/B test: 50% of users
  },

  onboardingComplete: false,

  analytics: {
    track: (event: string, props?: Record<string, unknown>) => {
      console.log(`[Analytics] ${event}`, props);
    },
    screen: (name: string) => {
      console.log(`[Analytics] Screen: ${name}`);
    },
  },

  abTest: (experiment: string): "A" | "B" => {
    // Deterministic for demo
    return experiment.length % 2 === 0 ? "A" : "B";
  },
};

// ── 2. Auth (@rajeev02/auth) ────────────────────────────────
// Phone OTP, Google Sign-In, Biometric unlock
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  department: string;
  semester: number;
  avatar: string;
  enrollmentYear: number;
}

export const AuthService = {
  currentUser: null as Student | null,
  isAuthenticated: false,

  sendOTP: async (
    phone: string,
  ): Promise<{ success: boolean; message: string }> => {
    // Simulates @rajeev02/auth OTP flow
    await delay(1200);
    return { success: true, message: `OTP sent to ${phone}` };
  },

  verifyOTP: async (phone: string, otp: string): Promise<Student> => {
    await delay(1500);
    if (otp !== "123456" && otp.length !== 6) {
      throw new Error("Invalid OTP. Use 123456 for demo.");
    }
    const student = MOCK_STUDENT;
    AuthService.currentUser = student;
    AuthService.isAuthenticated = true;
    return student;
  },

  signInWithGoogle: async (): Promise<Student> => {
    await delay(2000);
    const student = MOCK_STUDENT;
    AuthService.currentUser = student;
    AuthService.isAuthenticated = true;
    return student;
  },

  biometricUnlock: async (): Promise<boolean> => {
    await delay(800);
    return true;
  },

  signOut: async () => {
    AuthService.currentUser = null;
    AuthService.isAuthenticated = false;
  },
};

// ── 3. Vault (@rajeev02/vault) ──────────────────────────────
// Secure storage for student ID, tokens, exam hall tickets
export const VaultService = {
  store: new Map<string, string>(),

  set: async (key: string, value: string) => {
    await delay(100);
    VaultService.store.set(key, value);
    console.log(`[Vault] Stored: ${key}`);
  },

  get: async (key: string): Promise<string | null> => {
    await delay(50);
    return VaultService.store.get(key) || null;
  },

  getStudentID: async (): Promise<StudentIDCard> => {
    return MOCK_ID_CARD;
  },

  getExamHallTicket: async (): Promise<ExamHallTicket> => {
    return MOCK_HALL_TICKET;
  },
};

// ── 4. Network (@rajeev02/network) ──────────────────────────
// Connectivity monitoring, caching, offline mode
export const NetworkService = {
  isOnline: true,
  connectionType: "wifi" as "wifi" | "4g" | "3g" | "offline",
  signalStrength: "strong" as "strong" | "moderate" | "weak",

  checkConnectivity: async () => {
    return {
      isOnline: NetworkService.isOnline,
      type: NetworkService.connectionType,
      strength: NetworkService.signalStrength,
      latency: 45,
    };
  },

  cachedRequest: async <T>(url: string, fallback: T): Promise<T> => {
    if (!NetworkService.isOnline) {
      console.log(`[Network] Offline — returning cached: ${url}`);
      return fallback;
    }
    await delay(200);
    return fallback;
  },
};

// ── 5. Sync (@rajeev02/sync) ────────────────────────────────
// CRDT-based notes sync, study group collaboration
export const SyncService = {
  syncStatus: "synced" as "synced" | "syncing" | "offline" | "conflict",
  lastSynced: new Date(),

  syncNotes: async (
    notes: Note[],
  ): Promise<{ synced: number; conflicts: number }> => {
    await delay(800);
    SyncService.lastSynced = new Date();
    SyncService.syncStatus = "synced";
    return { synced: notes.length, conflicts: 0 };
  },

  resolveConflict: async (local: string, remote: string): Promise<string> => {
    // CRDT auto-merge
    await delay(300);
    return `${local}\n---\n${remote}`;
  },
};

// ── 6. UI (@rajeev02/ui) ────────────────────────────────────
// Design tokens, device detection, theming
export const UIService = {
  theme: "light" as "light" | "dark",
  deviceType: "phone" as "phone" | "tablet" | "web",

  getDeviceInfo: () => ({
    type: UIService.deviceType,
    screenWidth: 390,
    screenHeight: 844,
    pixelRatio: 3,
    hasNotch: true,
    platform: "ios" as const,
  }),

  toggleTheme: () => {
    UIService.theme = UIService.theme === "light" ? "dark" : "light";
  },
};

// ── 7. Locale (@rajeev02/locale) ─────────────────────────────
// Hindi/English, INR formatting, date formatting
export const LocaleService = {
  currentLocale: "en" as "en" | "hi",

  strings: {
    en: {
      appName: "CampusConnect",
      dashboard: "Dashboard",
      timetable: "Timetable",
      notes: "Smart Notes",
      fees: "Fee Payment",
      events: "Events",
      profile: "Profile",
      goodMorning: "Good Morning",
      todayClasses: "Today's Classes",
      upcomingDeadlines: "Upcoming Deadlines",
      payFees: "Pay Fees",
      viewAll: "View All",
      logout: "Logout",
      language: "Language",
      semester: "Semester",
      department: "Department",
      rollNo: "Roll No",
      totalDue: "Total Due",
      payNow: "Pay Now",
      paidOn: "Paid on",
      scanNotes: "Scan Notes",
      myNotes: "My Notes",
      lectures: "Lectures",
      idCard: "ID Card",
      settings: "Settings",
    },
    hi: {
      appName: "कैम्पसकनेक्ट",
      dashboard: "डैशबोर्ड",
      timetable: "समय सारिणी",
      notes: "स्मार्ट नोट्स",
      fees: "शुल्क भुगतान",
      events: "कार्यक्रम",
      profile: "प्रोफ़ाइल",
      goodMorning: "सुप्रभात",
      todayClasses: "आज की कक्षाएँ",
      upcomingDeadlines: "आगामी समय सीमा",
      payFees: "शुल्क भुगतान करें",
      viewAll: "सभी देखें",
      logout: "लॉग आउट",
      language: "भाषा",
      semester: "सेमेस्टर",
      department: "विभाग",
      rollNo: "रोल नं",
      totalDue: "कुल बकाया",
      payNow: "अभी भुगतान करें",
      paidOn: "भुगतान तिथि",
      scanNotes: "नोट्स स्कैन करें",
      myNotes: "मेरे नोट्स",
      lectures: "व्याख्यान",
      idCard: "पहचान पत्र",
      settings: "सेटिंग्स",
    },
  },

  t: (key: string): string => {
    const locale = LocaleService.currentLocale;
    return (
      (LocaleService.strings[locale] as Record<string, string>)[key] || key
    );
  },

  formatCurrency: (amount: number): string => {
    if (LocaleService.currentLocale === "hi") {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  },

  formatDate: (date: Date): string => {
    return date.toLocaleDateString(
      LocaleService.currentLocale === "hi" ? "hi-IN" : "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  },

  toggleLocale: () => {
    LocaleService.currentLocale =
      LocaleService.currentLocale === "en" ? "hi" : "en";
  },
};

// ── 8. Notify (@rajeev02/notify) ─────────────────────────────
// Class reminders, deadline alerts, in-app inbox
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "class" | "deadline" | "payment" | "event" | "general";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const NotifyService = {
  notifications: [...MOCK_NOTIFICATIONS],
  unreadCount: 0,

  getAll: async (): Promise<Notification[]> => {
    await delay(200);
    NotifyService.unreadCount = NotifyService.notifications.filter(
      (n) => !n.read,
    ).length;
    return NotifyService.notifications;
  },

  markRead: async (id: string) => {
    const notif = NotifyService.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    NotifyService.unreadCount = NotifyService.notifications.filter(
      (n) => !n.read,
    ).length;
  },

  scheduleReminder: async (title: string, body: string, triggerDate: Date) => {
    console.log(
      `[Notify] Scheduled: "${title}" for ${triggerDate.toISOString()}`,
    );
  },
};

// ── 9. Payments (@rajeev02/payments) ─────────────────────────
// Fee payment, UPI, canteen top-up
export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid" | "overdue";
  paidOn?: Date;
  transactionId?: string;
}

export const PaymentService = {
  fees: [...MOCK_FEES],

  getFees: async (): Promise<FeeItem[]> => {
    await delay(300);
    return PaymentService.fees;
  },

  payViaUPI: async (
    feeId: string,
    upiId: string,
  ): Promise<{ success: boolean; txnId: string }> => {
    await delay(2000);
    const fee = PaymentService.fees.find((f) => f.id === feeId);
    if (fee) {
      fee.status = "paid";
      fee.paidOn = new Date();
      fee.transactionId = `TXN${Date.now()}`;
    }
    return { success: true, txnId: `TXN${Date.now()}` };
  },

  payViaCard: async (
    feeId: string,
  ): Promise<{ success: boolean; txnId: string }> => {
    await delay(2500);
    return { success: true, txnId: `TXN${Date.now()}` };
  },

  getPaymentHistory: async (): Promise<FeeItem[]> => {
    return PaymentService.fees.filter((f) => f.status === "paid");
  },
};

// ── 10. Camera (@rajeev02/camera) ────────────────────────────
// ID photo capture, QR scan, note photography
export const CameraService = {
  capturePhoto: async (): Promise<{
    uri: string;
    width: number;
    height: number;
  }> => {
    await delay(500);
    return { uri: "captured-photo.jpg", width: 1920, height: 1080 };
  },

  scanQR: async (): Promise<{ data: string; type: string }> => {
    await delay(1000);
    return { data: "ATTENDANCE:CS301:2026-02-08", type: "qr" };
  },

  applyFilter: async (uri: string, filter: string): Promise<string> => {
    await delay(300);
    return `${uri}?filter=${filter}`;
  },
};

// ── 11. Document (@rajeev02/document) ────────────────────────
// Scan notes, OCR, PDF generation
export const DocumentService = {
  scanDocument: async (): Promise<{ uri: string; pages: number }> => {
    await delay(1500);
    return { uri: "scanned-notes.pdf", pages: 3 };
  },

  extractText: async (uri: string): Promise<string> => {
    await delay(2000);
    return "Data Structures and Algorithms\n\nChapter 5: Binary Search Trees\n\nA binary search tree is a rooted binary tree where each node stores a key greater than all keys in its left subtree and less than those in its right subtree...";
  },

  generatePDF: async (title: string, content: string): Promise<string> => {
    await delay(1000);
    return `${title.replace(/\s/g, "-").toLowerCase()}.pdf`;
  },
};

// ── 12. Edge-AI (@rajeev02/edge-ai) ─────────────────────────
// OCR on notes, smart categorization, quiz generation
export const EdgeAIService = {
  extractTextFromImage: async (
    imageUri: string,
  ): Promise<{ text: string; confidence: number }> => {
    await delay(1800);
    return {
      text: "Binary Search Tree Operations:\n1. Insert: O(log n)\n2. Search: O(log n)\n3. Delete: O(log n)\n4. Traversal: O(n)",
      confidence: 0.94,
    };
  },

  categorize: async (
    text: string,
  ): Promise<{ subject: string; topic: string; tags: string[] }> => {
    await delay(800);
    return {
      subject: "Data Structures",
      topic: "Binary Search Trees",
      tags: ["BST", "Trees", "Search", "Algorithms"],
    };
  },

  generateQuiz: async (noteText: string): Promise<QuizQuestion[]> => {
    await delay(1500);
    return MOCK_QUIZ;
  },
};

// ── 13. Media (@rajeev02/media) ──────────────────────────────
// Lecture playback, campus radio
export interface Lecture {
  id: string;
  title: string;
  subject: string;
  professor: string;
  duration: string;
  date: Date;
  thumbnailColor: string;
  type: "video" | "audio";
}

export const MediaService = {
  lectures: [...MOCK_LECTURES],

  getLectures: async (): Promise<Lecture[]> => {
    await delay(300);
    return MediaService.lectures;
  },

  play: async (
    lectureId: string,
  ): Promise<{ playing: boolean; position: number }> => {
    await delay(200);
    console.log(`[Media] Playing lecture: ${lectureId}`);
    return { playing: true, position: 0 };
  },

  pause: async (): Promise<void> => {
    console.log("[Media] Paused");
  },
};

// ── 14. Video Editor (@rajeev02/video-editor) ────────────────
// Presentation recording, study reels
export const VideoEditorService = {
  createProject: async (
    name: string,
  ): Promise<{ id: string; name: string }> => {
    await delay(300);
    return { id: `proj_${Date.now()}`, name };
  },

  addClip: async (projectId: string, uri: string): Promise<void> => {
    await delay(200);
    console.log(`[VideoEditor] Added clip to ${projectId}`);
  },

  applyTransition: async (
    type: "fade" | "dissolve" | "slide",
  ): Promise<void> => {
    await delay(150);
  },

  export: async (
    projectId: string,
    quality: "low" | "medium" | "high",
  ): Promise<string> => {
    await delay(3000);
    return `export_${projectId}_${quality}.mp4`;
  },
};

// ── 15. DeepLink (@rajeev02/deeplink) ────────────────────────
// Share notes, event invites, class links
export const DeepLinkService = {
  generate: (
    type: "note" | "event" | "class" | "profile",
    id: string,
  ): string => {
    return `https://campusconnect.rajeev02.dev/${type}/${id}`;
  },

  parse: (url: string): { type: string; id: string } | null => {
    const match = url.match(/\/(\w+)\/(\w+)$/);
    if (match) return { type: match[1], id: match[2] };
    return null;
  },

  share: async (url: string, title: string) => {
    console.log(`[DeepLink] Share: ${title} — ${url}`);
  },
};

// ============================================================
// Mock Data
// ============================================================

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_STUDENT: Student = {
  id: "STU2024001",
  name: "Rajeev Kumar Joshi",
  email: "rajeev.joshi@university.edu",
  phone: "+91 98765 43210",
  rollNo: "2024CSE042",
  department: "Computer Science & Engineering",
  semester: 4,
  avatar: "👨‍🎓",
  enrollmentYear: 2024,
};

export interface StudentIDCard {
  student: Student;
  validUntil: Date;
  barcode: string;
  bloodGroup: string;
  emergencyContact: string;
}

const MOCK_ID_CARD: StudentIDCard = {
  student: MOCK_STUDENT,
  validUntil: new Date("2028-06-30"),
  barcode: "2024CSE042-VALID",
  bloodGroup: "B+",
  emergencyContact: "+91 98765 00000",
};

export interface ExamHallTicket {
  examName: string;
  subject: string;
  date: Date;
  time: string;
  hall: string;
  seatNo: string;
}

const MOCK_HALL_TICKET: ExamHallTicket = {
  examName: "Mid-Semester Examination",
  subject: "Data Structures & Algorithms",
  date: new Date("2026-03-15"),
  time: "10:00 AM - 1:00 PM",
  hall: "Block A, Hall 3",
  seatNo: "A3-042",
};

export interface TimetableEntry {
  id: string;
  subject: string;
  code: string;
  professor: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  color: string;
}

export const MOCK_TIMETABLE: TimetableEntry[] = [
  {
    id: "1",
    subject: "Data Structures",
    code: "CS301",
    professor: "Dr. Sharma",
    room: "LH-201",
    startTime: "09:00",
    endTime: "10:00",
    day: "Mon",
    color: "#1a237e",
  },
  {
    id: "2",
    subject: "Operating Systems",
    code: "CS302",
    professor: "Prof. Gupta",
    room: "LH-105",
    startTime: "10:15",
    endTime: "11:15",
    day: "Mon",
    color: "#b71c1c",
  },
  {
    id: "3",
    subject: "Database Systems",
    code: "CS303",
    professor: "Dr. Patel",
    room: "LH-301",
    startTime: "11:30",
    endTime: "12:30",
    day: "Mon",
    color: "#1b5e20",
  },
  {
    id: "4",
    subject: "Computer Networks",
    code: "CS304",
    professor: "Prof. Mehra",
    room: "LH-102",
    startTime: "14:00",
    endTime: "15:00",
    day: "Mon",
    color: "#e65100",
  },
  {
    id: "5",
    subject: "Maths III",
    code: "MA201",
    professor: "Dr. Verma",
    room: "LH-401",
    startTime: "09:00",
    endTime: "10:00",
    day: "Tue",
    color: "#4a148c",
  },
  {
    id: "6",
    subject: "Data Structures Lab",
    code: "CS301L",
    professor: "Dr. Sharma",
    room: "Lab-3",
    startTime: "10:15",
    endTime: "12:15",
    day: "Tue",
    color: "#1a237e",
  },
  {
    id: "7",
    subject: "Operating Systems",
    code: "CS302",
    professor: "Prof. Gupta",
    room: "LH-105",
    startTime: "14:00",
    endTime: "15:00",
    day: "Tue",
    color: "#b71c1c",
  },
  {
    id: "8",
    subject: "Database Systems",
    code: "CS303",
    professor: "Dr. Patel",
    room: "LH-301",
    startTime: "09:00",
    endTime: "10:00",
    day: "Wed",
    color: "#1b5e20",
  },
  {
    id: "9",
    subject: "Computer Networks",
    code: "CS304",
    professor: "Prof. Mehra",
    room: "LH-102",
    startTime: "10:15",
    endTime: "11:15",
    day: "Wed",
    color: "#e65100",
  },
  {
    id: "10",
    subject: "Data Structures",
    code: "CS301",
    professor: "Dr. Sharma",
    room: "LH-201",
    startTime: "11:30",
    endTime: "12:30",
    day: "Wed",
    color: "#1a237e",
  },
];

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: Date;
  syncStatus: "synced" | "local" | "conflict";
  tags: string[];
  pages: number;
}

export const MOCK_NOTES: Note[] = [
  {
    id: "n1",
    title: "BST Operations",
    subject: "Data Structures",
    content: "Binary Search Tree insertion, deletion, traversal...",
    createdAt: new Date("2026-02-06"),
    syncStatus: "synced",
    tags: ["BST", "Trees"],
    pages: 4,
  },
  {
    id: "n2",
    title: "Process Scheduling",
    subject: "Operating Systems",
    content: "Round Robin, SJF, Priority scheduling algorithms...",
    createdAt: new Date("2026-02-05"),
    syncStatus: "synced",
    tags: ["CPU", "Scheduling"],
    pages: 3,
  },
  {
    id: "n3",
    title: "SQL Joins",
    subject: "Database Systems",
    content: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN...",
    createdAt: new Date("2026-02-04"),
    syncStatus: "local",
    tags: ["SQL", "Joins"],
    pages: 2,
  },
  {
    id: "n4",
    title: "TCP/IP Model",
    subject: "Computer Networks",
    content: "Application, Transport, Internet, Network Access layers...",
    createdAt: new Date("2026-02-03"),
    syncStatus: "synced",
    tags: ["TCP", "Networking"],
    pages: 5,
  },
  {
    id: "n5",
    title: "Eigenvalues",
    subject: "Maths III",
    content: "Finding eigenvalues and eigenvectors of matrices...",
    createdAt: new Date("2026-02-01"),
    syncStatus: "conflict",
    tags: ["Linear Algebra"],
    pages: 3,
  },
];

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: "tech" | "cultural" | "sports" | "workshop" | "seminar";
  price: number;
  registered: boolean;
  attendees: number;
  maxCapacity: number;
  organizer: string;
  color: string;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    title: "HackFest 2026",
    description:
      "36-hour hackathon with ₹50,000 prize pool. Build innovative solutions using AI/ML. Teams of 2-4.",
    date: new Date("2026-02-20"),
    time: "09:00 AM",
    venue: "Innovation Hub",
    category: "tech",
    price: 200,
    registered: false,
    attendees: 156,
    maxCapacity: 200,
    organizer: "Tech Club",
    color: "#1a237e",
  },
  {
    id: "e2",
    title: "Cultural Fest — Rang",
    description:
      "Annual cultural festival featuring dance, music, drama, and art competitions. 3-day extravaganza.",
    date: new Date("2026-03-05"),
    time: "10:00 AM",
    venue: "Main Auditorium",
    category: "cultural",
    price: 0,
    registered: true,
    attendees: 890,
    maxCapacity: 1000,
    organizer: "Cultural Committee",
    color: "#e65100",
  },
  {
    id: "e3",
    title: "Cloud Computing Workshop",
    description:
      "Hands-on AWS workshop covering EC2, S3, Lambda, and DynamoDB. Certificates provided.",
    date: new Date("2026-02-15"),
    time: "02:00 PM",
    venue: "Lab 5",
    category: "workshop",
    price: 150,
    registered: false,
    attendees: 38,
    maxCapacity: 50,
    organizer: "CSE Department",
    color: "#0277bd",
  },
  {
    id: "e4",
    title: "Inter-College Cricket",
    description:
      "T20 tournament with 8 colleges. Represent your college in the biggest sports event of the year.",
    date: new Date("2026-02-25"),
    time: "08:00 AM",
    venue: "Sports Ground",
    category: "sports",
    price: 0,
    registered: true,
    attendees: 200,
    maxCapacity: 500,
    organizer: "Sports Club",
    color: "#2e7d32",
  },
  {
    id: "e5",
    title: "AI in Healthcare — Seminar",
    description:
      "Guest lecture by Dr. Ananya Rao (IISc) on applications of AI in diagnostics and drug discovery.",
    date: new Date("2026-02-12"),
    time: "11:00 AM",
    venue: "Seminar Hall",
    category: "seminar",
    price: 0,
    registered: false,
    attendees: 75,
    maxCapacity: 120,
    organizer: "Research Cell",
    color: "#4a148c",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "not1",
    title: "📚 DS Assignment Due",
    body: "Data Structures assignment on BST operations is due tomorrow at 11:59 PM.",
    type: "deadline",
    timestamp: new Date("2026-02-08T08:00:00"),
    read: false,
  },
  {
    id: "not2",
    title: "💰 Fee Payment Reminder",
    body: "Semester 4 tuition fee of ₹45,000 is due by Feb 15, 2026.",
    type: "payment",
    timestamp: new Date("2026-02-07T10:00:00"),
    read: false,
  },
  {
    id: "not3",
    title: "🏫 Class Cancelled",
    body: "Operating Systems class (10:15 AM) is cancelled today. Prof. Gupta is on leave.",
    type: "class",
    timestamp: new Date("2026-02-08T07:30:00"),
    read: false,
  },
  {
    id: "not4",
    title: "🎉 HackFest 2026 Registrations Open",
    body: "Register now for the 36-hour hackathon. Limited to 200 participants.",
    type: "event",
    timestamp: new Date("2026-02-06T15:00:00"),
    read: true,
  },
  {
    id: "not5",
    title: "📊 Mid-Sem Results Published",
    body: "Your Maths III mid-semester marks have been uploaded. Check your profile.",
    type: "general",
    timestamp: new Date("2026-02-05T12:00:00"),
    read: true,
  },
  {
    id: "not6",
    title: "🔔 Library Book Return",
    body: '"Introduction to Algorithms" (Cormen) is due for return on Feb 10.',
    type: "deadline",
    timestamp: new Date("2026-02-04T09:00:00"),
    read: true,
  },
];

const MOCK_FEES: FeeItem[] = [
  {
    id: "f1",
    name: "Tuition Fee — Semester 4",
    amount: 45000,
    dueDate: new Date("2026-02-15"),
    status: "pending",
  },
  {
    id: "f2",
    name: "Hostel Fee — Semester 4",
    amount: 25000,
    dueDate: new Date("2026-02-15"),
    status: "pending",
  },
  {
    id: "f3",
    name: "Exam Fee — Mid-Semester",
    amount: 2500,
    dueDate: new Date("2026-03-01"),
    status: "pending",
  },
  {
    id: "f4",
    name: "Library Fee",
    amount: 1500,
    dueDate: new Date("2026-02-28"),
    status: "pending",
  },
  {
    id: "f5",
    name: "Tuition Fee — Semester 3",
    amount: 45000,
    dueDate: new Date("2025-08-15"),
    status: "paid",
    paidOn: new Date("2025-08-10"),
    transactionId: "TXN20250810001",
  },
  {
    id: "f6",
    name: "Hostel Fee — Semester 3",
    amount: 25000,
    dueDate: new Date("2025-08-15"),
    status: "paid",
    paidOn: new Date("2025-08-10"),
    transactionId: "TXN20250810002",
  },
];

const MOCK_LECTURES: Lecture[] = [
  {
    id: "l1",
    title: "BST — Insertion & Deletion",
    subject: "Data Structures",
    professor: "Dr. Sharma",
    duration: "52:30",
    date: new Date("2026-02-07"),
    thumbnailColor: "#1a237e",
    type: "video",
  },
  {
    id: "l2",
    title: "Process Synchronization",
    subject: "Operating Systems",
    professor: "Prof. Gupta",
    duration: "45:15",
    date: new Date("2026-02-06"),
    thumbnailColor: "#b71c1c",
    type: "video",
  },
  {
    id: "l3",
    title: "Normalization (1NF to BCNF)",
    subject: "Database Systems",
    professor: "Dr. Patel",
    duration: "48:00",
    date: new Date("2026-02-05"),
    thumbnailColor: "#1b5e20",
    type: "video",
  },
  {
    id: "l4",
    title: "TCP Handshake Explained",
    subject: "Computer Networks",
    professor: "Prof. Mehra",
    duration: "38:20",
    date: new Date("2026-02-04"),
    thumbnailColor: "#e65100",
    type: "video",
  },
  {
    id: "l5",
    title: "Fourier Series — Part 1",
    subject: "Maths III",
    professor: "Dr. Verma",
    duration: "55:00",
    date: new Date("2026-02-03"),
    thumbnailColor: "#4a148c",
    type: "audio",
  },
];

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const MOCK_QUIZ: QuizQuestion[] = [
  {
    question: "What is the time complexity of BST search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 1,
  },
  {
    question: "In a BST, left child is always:",
    options: [
      "Greater than parent",
      "Less than parent",
      "Equal to parent",
      "Random",
    ],
    correct: 1,
  },
  {
    question: "Inorder traversal of BST gives:",
    options: [
      "Random order",
      "Descending order",
      "Ascending order",
      "Level order",
    ],
    correct: 2,
  },
];
