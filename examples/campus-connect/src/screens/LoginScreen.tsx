// ============================================================
// Login Screen — Powered by @rajeev02/auth
// Phone OTP, Google Sign-In, Biometric unlock
// ============================================================
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import { AuthService } from "../services/sdk";

interface Props {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [phone, setPhone] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.replace(/\s/g, "").length < 13) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10-digit phone number.",
      );
      return;
    }
    setLoading(true);
    try {
      const result = await AuthService.sendOTP(phone);
      if (result.success) {
        setStep("otp");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await AuthService.verifyOTP(phone, otp);
      onLogin();
    } catch (e: any) {
      Alert.alert("Invalid OTP", e.message || "Please try again");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await AuthService.signInWithGoogle();
      onLogin();
    } catch (e) {
      Alert.alert("Error", "Google sign-in failed");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>🎓</Text>
        <Text style={styles.appName}>CampusConnect</Text>
        <Text style={styles.tagline}>Sign in to your college account</Text>
      </View>

      <View style={styles.card}>
        {step === "phone" ? (
          <>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+91 98765 43210"
              placeholderTextColor={Colors.textLight}
              maxLength={16}
            />
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.btnDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <Text style={styles.otpHint}>
              Sent to {phone} · Use 123456 for demo
            </Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              placeholder="_ _ _ _ _ _"
              placeholderTextColor={Colors.textLight}
              maxLength={6}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.btnDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Verify & Login</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep("phone")}>
              <Text style={styles.linkText}>← Change Phone Number</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.biometricBtn} onPress={onLogin}>
          <Text style={styles.biometricIcon}>🔐</Text>
          <Text style={styles.biometricText}>Biometric Unlock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sdkRow}>
        <Text style={styles.sdkLabel}>Powered by @rajeev02/auth</Text>
        <Text style={styles.sdkLabel}>Tokens stored via @rajeev02/vault</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: "#fff",
  },
  tagline: {
    fontSize: FontSize.md,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  otpHint: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: 16,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    letterSpacing: 2,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: 12,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  linkText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textLight,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
    marginBottom: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
  },
  googleText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },
  biometricBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  biometricIcon: {
    fontSize: 20,
  },
  biometricText: {
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.primary,
  },
  sdkRow: {
    marginTop: 24,
    alignItems: "center",
    gap: 4,
  },
  sdkLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: FontSize.xs,
  },
});
