// ============================================================
// Events Screen — Powered by @rajeev02/deeplink + payments + notify
// Browse events, buy tickets, share invites via deep links
// ============================================================
import React, { useState } from "react";
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
import {
  MOCK_EVENTS,
  DeepLinkService,
  PaymentService,
  NotifyService,
  LocaleService,
  type Event,
} from "../services/sdk";

const CATEGORY_ICONS: Record<string, string> = {
  tech: "💻",
  cultural: "🎭",
  sports: "🏏",
  workshop: "🔧",
  seminar: "🎤",
};

export function EventsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const handleRegister = async (event: Event) => {
    if (event.price > 0) {
      Alert.alert(
        `Register for ${event.title}`,
        `Ticket Price: ${LocaleService.formatCurrency(event.price)}\n\nPay via UPI to confirm registration.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: `Pay ${LocaleService.formatCurrency(event.price)}`,
            onPress: async () => {
              setEvents(
                events.map((e) =>
                  e.id === event.id
                    ? { ...e, registered: true, attendees: e.attendees + 1 }
                    : e,
                ),
              );
              await NotifyService.scheduleReminder(
                `🎉 ${event.title}`,
                `Event starts at ${event.time} at ${event.venue}`,
                event.date,
              );
              Alert.alert(
                "✅ Registered!",
                `You're in! Reminder set for ${event.date.toLocaleDateString()}.`,
              );
            },
          },
        ],
      );
    } else {
      setEvents(
        events.map((e) =>
          e.id === event.id
            ? { ...e, registered: true, attendees: e.attendees + 1 }
            : e,
        ),
      );
      Alert.alert("✅ Registered!", "You're in! See you there.");
    }
  };

  const handleShare = (event: Event) => {
    const link = DeepLinkService.generate("event", event.id);
    Alert.alert(
      "🔗 Share Event",
      `Deep Link generated:\n\n${link}\n\nThis link opens directly in CampusConnect on any device.`,
      [
        {
          text: "Copy Link",
          onPress: () => DeepLinkService.share(link, event.title),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>🎓 Campus Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate("IDCard")}>
          <Text style={styles.idCardBtn}>🪪 ID Card</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {["all", "tech", "cultural", "sports", "workshop", "seminar"].map(
          (cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catChip,
                selectedCategory === cat && styles.catChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.catText,
                  selectedCategory === cat && styles.catTextActive,
                ]}
              >
                {cat === "all"
                  ? "📋 All"
                  : `${CATEGORY_ICONS[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View
              style={[styles.eventBanner, { backgroundColor: event.color }]}
            >
              <Text style={styles.eventEmoji}>
                {CATEGORY_ICONS[event.category]}
              </Text>
              <View style={styles.eventDateBadge}>
                <Text style={styles.eventDateDay}>{event.date.getDate()}</Text>
                <Text style={styles.eventDateMonth}>
                  {event.date.toLocaleString("en", { month: "short" })}
                </Text>
              </View>
            </View>

            <View style={styles.eventBody}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDesc} numberOfLines={2}>
                {event.description}
              </Text>

              <View style={styles.eventMeta}>
                <Text style={styles.metaItem}>📍 {event.venue}</Text>
                <Text style={styles.metaItem}>🕐 {event.time}</Text>
                <Text style={styles.metaItem}>
                  👥 {event.attendees}/{event.maxCapacity}
                </Text>
                <Text style={styles.metaItem}>🎫 {event.organizer}</Text>
              </View>

              <View style={styles.eventFooter}>
                <Text style={styles.eventPrice}>
                  {event.price > 0
                    ? LocaleService.formatCurrency(event.price)
                    : "Free"}
                </Text>
                <View style={styles.eventActions}>
                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={() => handleShare(event)}
                  >
                    <Text style={styles.shareBtnText}>🔗 Share</Text>
                  </TouchableOpacity>
                  {event.registered ? (
                    <View style={styles.registeredBadge}>
                      <Text style={styles.registeredText}>✓ Registered</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.registerBtn}
                      onPress={() => handleRegister(event)}
                    >
                      <Text style={styles.registerBtnText}>Register</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/deeplink — Universal deep links for event sharing{"\n"}
            @rajeev02/payments — Event ticket purchases via UPI{"\n"}
            @rajeev02/notify — Event reminder scheduling
          </Text>
        </View>
        <View style={{ height: 100 }} />
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
  title: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.text },
  idCardBtn: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: "600",
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  categories: {
    flexGrow: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  catTextActive: { color: "#fff" },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  eventCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: 16,
    overflow: "hidden",
    ...Shadow.md,
  },
  eventBanner: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  eventEmoji: { fontSize: 48, opacity: 0.3 },
  eventDateBadge: {
    backgroundColor: "#fff",
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  eventDateDay: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.text,
  },
  eventDateMonth: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  eventBody: { padding: Spacing.md },
  eventTitle: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.text },
  eventDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  eventMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  metaItem: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  eventPrice: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.text },
  eventActions: { flexDirection: "row", gap: 8 },
  shareBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  shareBtnText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  registerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
  },
  registerBtnText: { fontSize: FontSize.sm, fontWeight: "700", color: "#fff" },
  registeredBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: "#e8f5e9",
  },
  registeredText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.success,
  },
  sdkFooter: {
    marginTop: Spacing.md,
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
