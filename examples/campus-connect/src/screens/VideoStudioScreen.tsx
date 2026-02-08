// ============================================================
// Video Studio Screen — Powered by @rajeev02/video-editor + camera
// Record presentations, create study reels
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
  VideoEditorService,
  CameraService,
  DeepLinkService,
} from "../services/sdk";

interface Project {
  id: string;
  name: string;
  status: "editing" | "exporting" | "done";
  clips: number;
  duration: string;
}

export function VideoStudioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "p1",
      name: "DSA Presentation — BST",
      status: "done",
      clips: 3,
      duration: "5:30",
    },
    {
      id: "p2",
      name: "OS Lab Demo — Scheduling",
      status: "editing",
      clips: 2,
      duration: "3:15",
    },
  ]);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleNewProject = async () => {
    setCreating(true);
    try {
      // 1. Capture video
      const photo = await CameraService.capturePhoto();
      // 2. Create project
      const project =
        await VideoEditorService.createProject("New Presentation");
      // 3. Add clip
      await VideoEditorService.addClip(project.id, photo.uri);

      setProjects([
        {
          id: project.id,
          name: project.name,
          status: "editing",
          clips: 1,
          duration: "0:00",
        },
        ...projects,
      ]);
      Alert.alert(
        "🎥 Project Created",
        "Video clip captured and added to timeline.",
      );
    } catch (e) {
      Alert.alert("Error", "Failed to create project");
    }
    setCreating(false);
  };

  const handleExport = async (project: Project) => {
    setExporting(project.id);
    try {
      await VideoEditorService.applyTransition("fade");
      const uri = await VideoEditorService.export(project.id, "high");
      setProjects(
        projects.map((p) =>
          p.id === project.id ? { ...p, status: "done" as const } : p,
        ),
      );
      Alert.alert(
        "✅ Export Complete",
        `File: ${uri}\n\nReady to share via deep link.`,
        [
          {
            text: "Share",
            onPress: () => {
              const link = DeepLinkService.generate("note", project.id);
              Alert.alert("🔗 Share Link", link);
            },
          },
          { text: "OK" },
        ],
      );
    } catch (e) {
      Alert.alert("Export Failed", "Please try again");
    }
    setExporting(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎥 Video Studio</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* New Project */}
        <TouchableOpacity
          style={styles.newProjectBtn}
          onPress={handleNewProject}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.newProjectIcon}>📹</Text>
              <Text style={styles.newProjectText}>Record New Presentation</Text>
              <Text style={styles.newProjectSub}>
                Camera → Trim → Transitions → Export
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tools Grid */}
        <Text style={styles.sectionTitle}>Editing Tools</Text>
        <View style={styles.toolsGrid}>
          {[
            { icon: "✂️", label: "Trim", desc: "Cut & splice" },
            { icon: "🎨", label: "Filters", desc: "Color grading" },
            { icon: "✨", label: "Transitions", desc: "Fade, slide" },
            { icon: "📝", label: "Subtitles", desc: "Auto-caption" },
            { icon: "🎵", label: "Audio", desc: "Background music" },
            { icon: "📤", label: "Export", desc: "HD / 4K" },
          ].map((tool, i) => (
            <TouchableOpacity
              key={i}
              style={styles.toolItem}
              onPress={() =>
                Alert.alert(
                  `${tool.icon} ${tool.label}`,
                  `${tool.desc}\n\n@rajeev02/video-editor`,
                )
              }
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
              <Text style={styles.toolDesc}>{tool.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Projects */}
        <Text style={styles.sectionTitle}>My Projects ({projects.length})</Text>
        {projects.map((project) => (
          <View key={project.id} style={styles.projectCard}>
            <View
              style={[
                styles.projectThumb,
                {
                  backgroundColor:
                    project.status === "done" ? Colors.success : Colors.primary,
                },
              ]}
            >
              <Text style={styles.projectThumbIcon}>
                {project.status === "done" ? "✅" : "🎬"}
              </Text>
            </View>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectMeta}>
                {project.clips} clips · {project.duration} ·{" "}
                <Text
                  style={{
                    color:
                      project.status === "done"
                        ? Colors.success
                        : Colors.warning,
                    fontWeight: "600",
                  }}
                >
                  {project.status === "done" ? "Complete" : "Editing"}
                </Text>
              </Text>
            </View>
            {project.status !== "done" && (
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={() => handleExport(project)}
                disabled={exporting === project.id}
              >
                {exporting === project.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.exportBtnText}>Export</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/video-editor — Timeline, trim, transitions, filters,
            export{"\n"}
            @rajeev02/camera — Video recording{"\n"}
            @rajeev02/deeplink — Share exported videos via deep links
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
  scroll: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  newProjectBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadow.md,
  },
  newProjectIcon: { fontSize: 36, marginBottom: 8 },
  newProjectText: { color: "#fff", fontSize: FontSize.lg, fontWeight: "700" },
  newProjectSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  toolItem: {
    width: "31%",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadow.sm,
  },
  toolIcon: { fontSize: 24, marginBottom: 4 },
  toolLabel: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.text },
  toolDesc: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 10,
    ...Shadow.sm,
  },
  projectThumb: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  projectThumbIcon: { fontSize: 22 },
  projectInfo: { flex: 1 },
  projectName: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  projectMeta: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  exportBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    minWidth: 70,
    alignItems: "center",
  },
  exportBtnText: { color: "#fff", fontSize: FontSize.sm, fontWeight: "700" },
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
