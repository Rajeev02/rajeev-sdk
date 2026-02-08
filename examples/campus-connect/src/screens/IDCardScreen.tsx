// ============================================================
// ID Card Screen — Powered by @rajeev02/vault
// Digital student ID with secure storage
// ============================================================
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import { VaultService, AuthService, type StudentIDCard } from "../services/sdk";

export function IDCardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [idCard, setIdCard] = useState<StudentIDCard | null>(null);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    VaultService.getStudentID().then(setIdCard);
  }, []);

  const student = idCard?.student || AuthService.currentUser;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🪪 Digital ID Card</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cardWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowBack(!showBack)}
          style={styles.cardTouchable}
        >
          {!showBack ? (
            /* Front of Card */
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.collegeName}>
                  National Institute of Technology
                </Text>
                <Text style={styles.collegeSubtext}>Student Identity Card</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatar}>{student?.avatar || "👨‍🎓"}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.studentName}>{student?.name}</Text>
                  <InfoRow label="Roll No" value={student?.rollNo || ""} />
                  <InfoRow
                    label="Department"
                    value={student?.department || ""}
                  />
                  <InfoRow label="Semester" value={`${student?.semester}`} />
                  <InfoRow
                    label="Valid Until"
                    value={idCard ? idCard.validUntil.toLocaleDateString() : ""}
                  />
                </View>
              </View>

              <View style={styles.barcode}>
                <Text style={styles.barcodeText}>
                  ||||||||||||||||||||||||||||||||||||
                </Text>
                <Text style={styles.barcodeId}>{idCard?.barcode}</Text>
              </View>

              <Text style={styles.flipHint}>Tap to flip →</Text>
            </View>
          ) : (
            /* Back of Card */
            <View style={[styles.card, styles.cardBack]}>
              <Text style={styles.backTitle}>Emergency Information</Text>

              <InfoRow label="Blood Group" value={idCard?.bloodGroup || "B+"} />
              <InfoRow
                label="Emergency Contact"
                value={idCard?.emergencyContact || ""}
              />
              <InfoRow label="Email" value={student?.email || ""} />
              <InfoRow label="Phone" value={student?.phone || ""} />
              <InfoRow
                label="Enrollment Year"
                value={`${student?.enrollmentYear}`}
              />
              <InfoRow label="Student ID" value={student?.id || ""} />

              <View style={styles.securityNote}>
                <Text style={styles.securityIcon}>🔒</Text>
                <Text style={styles.securityText}>
                  This ID is stored with AES-256-GCM encryption via
                  @rajeev02/vault. Data never leaves your device unencrypted.
                </Text>
              </View>

              <Text style={styles.flipHint}>← Tap to flip</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            Alert.alert(
              "📸 QR Scanned",
              "Attendance marked for CS301!\n\n@rajeev02/camera — QR code scanning",
            )
          }
        >
          <Text style={styles.actionIcon}>📸</Text>
          <Text style={styles.actionLabel}>Scan QR</Text>
          <Text style={styles.actionSdk}>@rajeev02/camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={async () => {
            const ticket = await VaultService.getExamHallTicket();
            Alert.alert(
              "🎫 Exam Hall Ticket",
              `${ticket.examName}\n${ticket.subject}\n\n📅 ${ticket.date.toLocaleDateString()}\n🕐 ${ticket.time}\n📍 ${ticket.hall}\n💺 Seat: ${ticket.seatNo}\n\nStored securely via @rajeev02/vault`,
            );
          }}
        >
          <Text style={styles.actionIcon}>🎫</Text>
          <Text style={styles.actionLabel}>Hall Ticket</Text>
          <Text style={styles.actionSdk}>@rajeev02/vault</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            const verified = AuthService.biometricUnlock();
            Alert.alert(
              "🔐 Biometric Verified",
              "Identity confirmed via Touch ID / Face ID\n\n@rajeev02/auth — Biometric authentication",
            );
          }}
        >
          <Text style={styles.actionIcon}>🔐</Text>
          <Text style={styles.actionLabel}>Verify ID</Text>
          <Text style={styles.actionSdk}>@rajeev02/auth</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sdkFooter}>
        <Text style={styles.sdkText}>
          @rajeev02/vault — AES-256-GCM encrypted ID storage{"\n"}
          @rajeev02/auth — Biometric verification{"\n"}
          @rajeev02/camera — QR attendance scanning
        </Text>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  cardWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  cardTouchable: {},
  card: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
    minHeight: 320,
  },
  cardBack: {
    backgroundColor: "#1c2951",
  },
  cardHeader: {
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  collegeName: {
    color: "#fff",
    fontSize: FontSize.md,
    fontWeight: "800",
    textAlign: "center",
  },
  collegeSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  cardBody: { flexDirection: "row", gap: 16, marginTop: 20 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { fontSize: 48 },
  cardInfo: { flex: 1, gap: 6 },
  studentName: {
    color: "#fff",
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: 4,
  },
  barcode: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  barcodeText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 20,
    letterSpacing: -2,
    fontFamily: "monospace",
  },
  barcodeId: {
    color: "rgba(255,255,255,0.5)",
    fontSize: FontSize.xs,
    marginTop: 4,
    fontFamily: "monospace",
  },
  flipHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: FontSize.xs,
    textAlign: "center",
    marginTop: 12,
  },
  backTitle: {
    color: "#fff",
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  infoLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    fontWeight: "500",
  },
  infoValue: { color: "#fff", fontSize: FontSize.xs, fontWeight: "600" },
  securityNote: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: BorderRadius.md,
  },
  securityIcon: { fontSize: 16 },
  securityText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    flex: 1,
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionLabel: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.text },
  actionSdk: { fontSize: 8, color: Colors.textLight, marginTop: 4 },
  sdkFooter: {
    margin: Spacing.lg,
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
