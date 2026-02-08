// ============================================================
// Lectures Screen — Powered by @rajeev02/media
// Lecture recordings playback, campus radio
// ============================================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import { MediaService, NetworkService, type Lecture } from "../services/sdk";

export function LecturesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    MediaService.getLectures().then(setLectures);
  }, []);

  const handlePlay = async (lecture: Lecture) => {
    if (playing === lecture.id) {
      await MediaService.pause();
      setPlaying(null);
      return;
    }
    const result = await MediaService.play(lecture.id);
    if (result.playing) {
      setPlaying(lecture.id);
      setProgress(0);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 2;
        });
      }, 300);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎬 Lectures</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Now Playing */}
      {playing && (
        <View style={styles.nowPlaying}>
          <View style={styles.npInfo}>
            <Text style={styles.npLabel}>Now Playing</Text>
            <Text style={styles.npTitle}>
              {lectures.find((l) => l.id === playing)?.title}
            </Text>
            <Text style={styles.npProf}>
              {lectures.find((l) => l.id === playing)?.professor}
            </Text>
          </View>
          <View style={styles.npControls}>
            <TouchableOpacity
              onPress={() =>
                handlePlay(lectures.find((l) => l.id === playing)!)
              }
            >
              <Text style={styles.npPlayBtn}>⏸</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Lectures</Text>

        {lectures.map((lecture) => (
          <TouchableOpacity
            key={lecture.id}
            style={[
              styles.lectureCard,
              playing === lecture.id && styles.lectureActive,
            ]}
            onPress={() => handlePlay(lecture)}
          >
            <View
              style={[
                styles.thumbnail,
                { backgroundColor: lecture.thumbnailColor },
              ]}
            >
              <Text style={styles.thumbnailIcon}>
                {lecture.type === "video" ? "🎬" : "🎧"}
              </Text>
              <Text style={styles.duration}>{lecture.duration}</Text>
            </View>
            <View style={styles.lectureInfo}>
              <Text style={styles.lectureTitle}>{lecture.title}</Text>
              <Text style={styles.lectureSubject}>{lecture.subject}</Text>
              <Text style={styles.lectureMeta}>
                👨‍🏫 {lecture.professor} · {lecture.date.toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.playIcon}>
              {playing === lecture.id ? "⏸" : "▶️"}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Campus Radio */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
          📻 Campus Radio
        </Text>
        <View style={styles.radioCard}>
          <Text style={styles.radioEmoji}>📻</Text>
          <View style={styles.radioInfo}>
            <Text style={styles.radioTitle}>NIT Radio — Live</Text>
            <Text style={styles.radioDesc}>
              Student-run radio station. Music, news, and talks.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.radioPlayBtn}
            onPress={() =>
              Alert.alert(
                "📻 Campus Radio",
                "Streaming requires @rajeev02/media player with streaming CDN.\n\nFeature flag: campusRadio = false",
              )
            }
          >
            <Text style={styles.radioPlayText}>▶️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/media — Audio/video playback, streaming, PiP{"\n"}
            @rajeev02/network — Adaptive quality based on connectivity
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
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
  nowPlaying: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  npInfo: { flex: 1 },
  npLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  npTitle: {
    color: "#fff",
    fontSize: FontSize.md,
    fontWeight: "700",
    marginTop: 2,
  },
  npProf: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  npControls: { position: "absolute", right: Spacing.lg, top: Spacing.md },
  npPlayBtn: { fontSize: 28 },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginTop: 10,
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  lectureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: 10,
    ...Shadow.sm,
  },
  lectureActive: { borderWidth: 2, borderColor: Colors.primary },
  thumbnail: {
    width: 72,
    height: 54,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailIcon: { fontSize: 20 },
  duration: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 2,
  },
  lectureInfo: { flex: 1 },
  lectureTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  lectureSubject: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  lectureMeta: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  playIcon: { fontSize: 20, marginRight: 4 },
  radioCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  radioEmoji: { fontSize: 32 },
  radioInfo: { flex: 1 },
  radioTitle: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  radioDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioPlayText: { fontSize: 18 },
  sdkFooter: {
    marginTop: Spacing.xl,
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
