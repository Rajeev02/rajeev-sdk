// ============================================================
// CampusConnect Web — SDK Integration Layer (All 15 Libraries)
// Simulates real SDK usage patterns for web dashboard demo
// ============================================================

// ─── Mock Data ────────────────────────────────────────────

export const STUDENT = {
  id: 'STU-2024-001', name: 'Rajeev Joshi', email: 'rajeev@university.edu',
  phone: '+91 98765 43210', rollNo: 'CS-2024-042', department: 'Computer Science',
  semester: 6, cgpa: 8.7, year: '3rd Year', avatar: '👨‍🎓',
  bloodGroup: 'O+', emergencyContact: '+91 99887 76655',
};

export const TIMETABLE = [
  { id: 1, subject: 'Data Structures & Algorithms', code: 'CS301', time: '09:00 AM', room: 'LH-201', professor: 'Dr. Sharma', day: 'Mon', type: 'Lecture' },
  { id: 2, subject: 'Operating Systems Lab', code: 'CS302L', time: '11:00 AM', room: 'Lab-3', professor: 'Prof. Patel', day: 'Mon', type: 'Lab' },
  { id: 3, subject: 'Database Management', code: 'CS303', time: '02:00 PM', room: 'LH-105', professor: 'Dr. Gupta', day: 'Mon', type: 'Lecture' },
  { id: 4, subject: 'Computer Networks', code: 'CS304', time: '09:00 AM', room: 'LH-301', professor: 'Dr. Kumar', day: 'Tue', type: 'Lecture' },
  { id: 5, subject: 'Software Engineering', code: 'CS305', time: '11:00 AM', room: 'LH-202', professor: 'Prof. Singh', day: 'Tue', type: 'Lecture' },
  { id: 6, subject: 'DSA Lab', code: 'CS301L', time: '02:00 PM', room: 'Lab-1', professor: 'Dr. Sharma', day: 'Wed', type: 'Lab' },
  { id: 7, subject: 'Mathematics III', code: 'MA301', time: '09:00 AM', room: 'LH-101', professor: 'Dr. Verma', day: 'Thu', type: 'Lecture' },
  { id: 8, subject: 'Computer Networks Lab', code: 'CS304L', time: '11:00 AM', room: 'Lab-2', professor: 'Dr. Kumar', day: 'Thu', type: 'Lab' },
  { id: 9, subject: 'Database Management', code: 'CS303', time: '09:00 AM', room: 'LH-105', professor: 'Dr. Gupta', day: 'Fri', type: 'Lecture' },
  { id: 10, subject: 'Elective: AI/ML Basics', code: 'CS390', time: '02:00 PM', room: 'LH-401', professor: 'Dr. Iyer', day: 'Fri', type: 'Elective' },
];

export const NOTES = [
  { id: 1, title: 'Binary Trees & BST', subject: 'DSA', date: '2025-01-15', pages: 8, synced: true },
  { id: 2, title: 'SQL Joins & Subqueries', subject: 'DBMS', date: '2025-01-14', pages: 5, synced: true },
  { id: 3, title: 'TCP/IP Protocol Stack', subject: 'Networks', date: '2025-01-13', pages: 12, synced: false },
  { id: 4, title: 'Process Scheduling', subject: 'OS', date: '2025-01-12', pages: 6, synced: true },
  { id: 5, title: 'Agile Methodology', subject: 'SE', date: '2025-01-11', pages: 4, synced: true },
  { id: 6, title: 'Graph Algorithms', subject: 'DSA', date: '2025-01-10', pages: 10, synced: true },
];

export const EVENTS = [
  { id: 1, title: 'Annual Tech Fest — TechSpark 2025', date: 'Feb 15-17', venue: 'Main Auditorium', type: 'Tech', emoji: '🚀', color: '#e8eaf6', spots: 500, registered: 342, fee: 0 },
  { id: 2, title: 'Hackathon: Build for Bharat', date: 'Feb 22-23', venue: 'Innovation Lab', type: 'Hackathon', emoji: '💻', color: '#e3f2fd', spots: 100, registered: 78, fee: 200 },
  { id: 3, title: 'Cultural Night — Rang Tarang', date: 'Mar 1', venue: 'Open Air Theatre', type: 'Cultural', emoji: '🎭', color: '#fce4ec', spots: 1000, registered: 650, fee: 0 },
  { id: 4, title: 'Industry Visit: Google Bangalore', date: 'Mar 10', venue: 'Depart from Gate 1', type: 'Industrial', emoji: '🏢', color: '#e8f5e9', spots: 45, registered: 45, fee: 500 },
  { id: 5, title: 'Workshop: React Native & Expo', date: 'Mar 15', venue: 'CS Lab-3', type: 'Workshop', emoji: '📱', color: '#fff3e0', spots: 60, registered: 38, fee: 150 },
  { id: 6, title: 'Sports Day 2025', date: 'Mar 20-21', venue: 'Sports Complex', type: 'Sports', emoji: '🏆', color: '#f3e5f5', spots: 300, registered: 210, fee: 0 },
];

export const NOTIFICATIONS = [
  { id: 1, title: 'DSA Assignment Due Tomorrow', body: 'Submit linked list implementation by 11:59 PM', type: 'deadline', time: '2 hours ago', read: false },
  { id: 2, title: 'Fee Payment Reminder', body: 'Semester 6 fees of ₹45,000 due by Jan 31', type: 'payment', time: '5 hours ago', read: false },
  { id: 3, title: 'Class Cancelled: OS Lab', body: 'Prof. Patel is on leave. Class rescheduled to Friday', type: 'class', time: 'Yesterday', read: true },
  { id: 4, title: 'TechSpark Registration Open', body: 'Register for 10+ events. Early bird until Feb 1', type: 'event', time: 'Yesterday', read: true },
  { id: 5, title: 'Library Book Return', body: 'Return "CLRS Introduction to Algorithms" by Jan 28', type: 'general', time: '2 days ago', read: true },
  { id: 6, title: 'Exam Schedule Published', body: 'End-semester exams start March 25. Check timetable.', type: 'general', time: '3 days ago', read: true },
];

export const FEES = [
  { id: 1, label: 'Tuition Fee', amount: 35000, status: 'paid', date: '2025-01-05' },
  { id: 2, label: 'Lab Fee', amount: 5000, status: 'paid', date: '2025-01-05' },
  { id: 3, label: 'Library Fee', amount: 2000, status: 'pending', due: '2025-01-31' },
  { id: 4, label: 'Hostel Fee', amount: 45000, status: 'pending', due: '2025-02-15' },
  { id: 5, label: 'Exam Fee', amount: 3000, status: 'upcoming', due: '2025-03-01' },
  { id: 6, label: 'Sports Fee', amount: 1500, status: 'paid', date: '2025-01-05' },
];

export const LECTURES = [
  { id: 1, title: 'Introduction to Binary Trees', subject: 'DSA', duration: '45 min', professor: 'Dr. Sharma', date: '2025-01-15' },
  { id: 2, title: 'SQL Basics & DDL Commands', subject: 'DBMS', duration: '50 min', professor: 'Dr. Gupta', date: '2025-01-14' },
  { id: 3, title: 'OSI Model Deep Dive', subject: 'Networks', duration: '55 min', professor: 'Dr. Kumar', date: '2025-01-13' },
  { id: 4, title: 'Semaphores & Deadlocks', subject: 'OS', duration: '40 min', professor: 'Prof. Patel', date: '2025-01-12' },
  { id: 5, title: 'UML Diagrams & Use Cases', subject: 'SE', duration: '35 min', professor: 'Prof. Singh', date: '2025-01-11' },
];

// ─── Service Simulations ──────────────────────────────────

export const AppShellService = {
  featureFlags: { ai_study_assistant: true, video_notes: true, campus_map_3d: false, peer_tutoring: false },
  analytics: { screensViewed: 47, sessionsToday: 3, avgDuration: '12m' },
};

export const NetworkService = {
  isOnline: true, connectionType: 'wifi', signalStrength: 'Excellent',
  cachedEndpoints: 12, pendingRequests: 0,
};

export const SyncService = {
  status: 'synced' as 'synced' | 'syncing' | 'offline',
  lastSynced: new Date(),
  devices: ['MacBook Pro', 'iPhone 15', 'iPad Air'],
};

export const LocaleService = {
  locale: 'en' as 'en' | 'hi',
  formatCurrency: (n: number) => `₹${n.toLocaleString('en-IN')}`,
  translations: {
    en: { dashboard: 'Dashboard', timetable: 'Timetable', logout: 'Logout', settings: 'Settings' },
    hi: { dashboard: 'डैशबोर्ड', timetable: 'समय सारणी', logout: 'लॉग आउट', settings: 'सेटिंग्स' },
  } as Record<string, Record<string, string>>,
  t(key: string) { return this.translations[this.locale]?.[key] || key; },
};

export const SDK_LIBS = [
  'app-shell', 'auth', 'vault', 'network', 'sync', 'locale', 'notify', 'ui',
  'payments', 'camera', 'deeplink', 'document', 'edge-ai', 'media', 'video-editor',
] as const;
