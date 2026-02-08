// ============================================================
// Onboarding Screen — Powered by @rajeev02/app-shell
// 3-step intro to CampusConnect
// ============================================================
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "🎓",
    title: "Welcome to CampusConnect",
    subtitle: "Your entire college life — in one app",
    features: [
      "Timetable & Attendance",
      "Smart Notes with AI",
      "Fee Payments via UPI",
    ],
    sdk: "@rajeev02/app-shell — Bootstrap & Onboarding",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    subtitle: "Phone, tablet, web, even your Apple Watch",
    features: ["Offline-first sync", "Hindi & English", "Dark mode support"],
    sdk: "@rajeev02/ui + @rajeev02/locale + @rajeev02/sync",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    subtitle: "Your data is encrypted end-to-end",
    features: ["AES-256 encryption", "Biometric unlock", "Digital ID Card"],
    sdk: "@rajeev02/vault + @rajeev02/auth",
  },
];

interface Props {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={onComplete}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <View style={styles.featuresBox}>
              {item.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sdkBadge}>
              <Text style={styles.sdkText}>{item.sdk}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  skipBtn: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 32,
  },
  featuresBox: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureCheck: {
    color: Colors.secondary,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  featureText: {
    color: "#fff",
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  sdkBadge: {
    marginTop: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  sdkText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    gap: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 24,
  },
  nextBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
});
