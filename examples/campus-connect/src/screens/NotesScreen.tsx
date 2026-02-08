// ============================================================
// Notes Screen — Powered by @rajeev02/document + edge-ai + sync + camera
// Scan notes, OCR, AI categorization, cross-device sync
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import {
  MOCK_NOTES,
  DocumentService,
  EdgeAIService,
  SyncService,
  CameraService,
  type Note,
} from "../services/sdk";

export function NotesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [scanning, setScanning] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  const handleScanNotes = async () => {
    setScanning(true);
    try {
      // 1. Camera captures photo
      const photo = await CameraService.capturePhoto();
      // 2. Document service processes it
      const doc = await DocumentService.scanDocument();
      // 3. Edge AI extracts text via OCR
      setAiProcessing(true);
      const ocr = await EdgeAIService.extractTextFromImage(photo.uri);
      // 4. AI categorizes the content
      const category = await EdgeAIService.categorize(ocr.text);
      // 5. Create new note
      const newNote: Note = {
        id: `n${Date.now()}`,
        title: category.topic,
        subject: category.subject,
        content: ocr.text,
        createdAt: new Date(),
        syncStatus: "local",
        tags: category.tags,
        pages: doc.pages,
      };
      setNotes([newNote, ...notes]);
      // 6. Sync across devices
      await SyncService.syncNotes([newNote]);
      Alert.alert(
        "✅ Note Scanned!",
        `Subject: ${category.subject}\nTopic: ${category.topic}\nConfidence: ${(ocr.confidence * 100).toFixed(0)}%\nPages: ${doc.pages}`,
      );
    } catch (e) {
      Alert.alert("Error", "Failed to scan notes");
    }
    setScanning(false);
    setAiProcessing(false);
  };

  const handleGenerateQuiz = async (note: Note) => {
    Alert.alert("🧠 AI Quiz", "Generating quiz from your notes...");
    const quiz = await EdgeAIService.generateQuiz(note.content);
    Alert.alert(
      `Quiz: ${note.title}`,
      quiz
        .map((q, i) => `${i + 1}. ${q.question}\n   → ${q.options[q.correct]}`)
        .join("\n\n"),
    );
  };

  const handleGeneratePDF = async (note: Note) => {
    const pdf = await DocumentService.generatePDF(note.title, note.content);
    Alert.alert("📄 PDF Generated", `File: ${pdf}\nReady to share!`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📝 Smart Notes</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.scanBtn}
        onPress={handleScanNotes}
        disabled={scanning}
      >
        {scanning ? (
          <View style={styles.scanningRow}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.scanBtnText}>
              {aiProcessing ? "AI Processing..." : "Scanning..."}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.scanBtnIcon}>📸</Text>
            <Text style={styles.scanBtnText}>Scan & Capture Notes</Text>
            <Text style={styles.scanBtnSub}>
              Camera → OCR → AI Categorize → Sync
            </Text>
          </>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>My Notes ({notes.length})</Text>

        {notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteSubject}>{note.subject}</Text>
              </View>
              <SyncBadge status={note.syncStatus} />
            </View>

            <Text style={styles.noteContent} numberOfLines={2}>
              {note.content}
            </Text>

            <View style={styles.noteTags}>
              {note.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.noteFooter}>
              <Text style={styles.noteDate}>
                {note.createdAt.toLocaleDateString()} · {note.pages} pages
              </Text>
              <View style={styles.noteActions}>
                <TouchableOpacity
                  style={styles.noteAction}
                  onPress={() => handleGenerateQuiz(note)}
                >
                  <Text style={styles.noteActionText}>🧠 Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.noteAction}
                  onPress={() => handleGeneratePDF(note)}
                >
                  <Text style={styles.noteActionText}>📄 PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/camera — Capture note photos{"\n"}
            @rajeev02/document — Scan & generate PDFs{"\n"}
            @rajeev02/edge-ai — OCR + AI categorization + quiz generation{"\n"}
            @rajeev02/sync — CRDT sync across devices
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function SyncBadge({ status }: { status: string }) {
  const config = {
    synced: { icon: "☁️", color: Colors.success, label: "Synced" },
    local: { icon: "📱", color: Colors.warning, label: "Local" },
    conflict: { icon: "⚠️", color: Colors.error, label: "Conflict" },
  }[status] || { icon: "?", color: Colors.textLight, label: status };

  return (
    <View style={[styles.syncBadge, { backgroundColor: config.color + "15" }]}>
      <Text style={{ fontSize: 12 }}>{config.icon}</Text>
      <Text style={[styles.syncBadgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { fontSize: FontSize.md, color: Colors.primary, fontWeight: "600" },
  title: { fontSize: FontSize.lg, fontWeight: "800", color: Colors.text },
  scanBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    margin: Spacing.lg,
    alignItems: "center",
    ...Shadow.md,
  },
  scanBtnIcon: { fontSize: 32, marginBottom: 8 },
  scanBtnText: { color: "#fff", fontSize: FontSize.md, fontWeight: "700" },
  scanBtnSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  scanningRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  noteCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 12,
    ...Shadow.sm,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  noteTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.text },
  noteSubject: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  noteContent: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  noteTags: { flexDirection: "row", gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: "500" },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  noteDate: { fontSize: FontSize.xs, color: Colors.textLight },
  noteActions: { flexDirection: "row", gap: 8 },
  noteAction: {
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  noteActionText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  syncBadgeText: { fontSize: FontSize.xs, fontWeight: "600" },
  sdkFooter: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: "#f0f0ff",
    borderRadius: BorderRadius.sm,
  },
  sdkText: {
    fontSize: 10,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 16,
  },
});
