// ============================================================
// Fee Payment Screen — Powered by @rajeev02/payments + locale + vault
// UPI/card payments, INR formatting, payment history
// ============================================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from "../theme";
import {
  PaymentService,
  LocaleService,
  VaultService,
  type FeeItem,
} from "../services/sdk";

export function FeesScreen() {
  const insets = useSafeAreaInsets();
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "paid">("pending");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    const data = await PaymentService.getFees();
    setFees(data);
    setLoading(false);
  };

  const pendingFees = fees.filter((f) => f.status !== "paid");
  const paidFees = fees.filter((f) => f.status === "paid");
  const totalDue = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  const handlePayUPI = async (fee: FeeItem) => {
    if (!upiId.includes("@")) {
      Alert.alert("Invalid UPI ID", "Enter a valid UPI ID (e.g., name@upi)");
      return;
    }
    setPaying(fee.id);
    try {
      const result = await PaymentService.payViaUPI(fee.id, upiId);
      if (result.success) {
        // Store transaction securely
        await VaultService.set(`txn_${fee.id}`, result.txnId);
        Alert.alert(
          "✅ Payment Successful!",
          `${fee.name}\nAmount: ${LocaleService.formatCurrency(fee.amount)}\nTxn ID: ${result.txnId}`,
        );
        loadFees();
      }
    } catch (e) {
      Alert.alert("Payment Failed", "Please try again");
    }
    setPaying(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>💳 {LocaleService.t("fees")}</Text>
      </View>

      {/* Total Due Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{LocaleService.t("totalDue")}</Text>
        <Text style={styles.totalAmount}>
          {LocaleService.formatCurrency(totalDue)}
        </Text>
        <Text style={styles.totalItems}>
          {pendingFees.length} pending items
        </Text>
      </View>

      {/* UPI Input */}
      <View style={styles.upiRow}>
        <TextInput
          style={styles.upiInput}
          placeholder="Enter UPI ID (e.g., rajeev@upi)"
          placeholderTextColor={Colors.textLight}
          value={upiId}
          onChangeText={setUpiId}
          autoCapitalize="none"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "pending" && styles.tabActive]}
          onPress={() => setTab("pending")}
        >
          <Text
            style={[styles.tabText, tab === "pending" && styles.tabTextActive]}
          >
            Pending ({pendingFees.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "paid" && styles.tabActive]}
          onPress={() => setTab("paid")}
        >
          <Text
            style={[styles.tabText, tab === "paid" && styles.tabTextActive]}
          >
            Paid ({paidFees.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          (tab === "pending" ? pendingFees : paidFees).map((fee) => (
            <View key={fee.id} style={styles.feeCard}>
              <View style={styles.feeInfo}>
                <Text style={styles.feeName}>{fee.name}</Text>
                <Text style={styles.feeDue}>
                  {fee.status === "paid"
                    ? `${LocaleService.t("paidOn")} ${LocaleService.formatDate(fee.paidOn!)}`
                    : `Due: ${LocaleService.formatDate(fee.dueDate)}`}
                </Text>
                {fee.transactionId && (
                  <Text style={styles.feeTxn}>Txn: {fee.transactionId}</Text>
                )}
              </View>
              <View style={styles.feeRight}>
                <Text
                  style={[
                    styles.feeAmount,
                    fee.status === "paid" && { color: Colors.success },
                  ]}
                >
                  {LocaleService.formatCurrency(fee.amount)}
                </Text>
                {fee.status !== "paid" && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => handlePayUPI(fee)}
                    disabled={paying === fee.id}
                  >
                    {paying === fee.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.payBtnText}>
                        {LocaleService.t("payNow")}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                {fee.status === "paid" && (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>✓ Paid</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.sdkFooter}>
          <Text style={styles.sdkText}>
            @rajeev02/payments — UPI intent, card validation, payment processing
            {"\n"}
            @rajeev02/locale — ₹ INR formatting (Lakh/Crore system){"\n"}
            @rajeev02/vault — Secure transaction ID storage
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.text },
  totalCard: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    ...Shadow.md,
  },
  totalLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  totalAmount: {
    color: "#fff",
    fontSize: FontSize.hero,
    fontWeight: "800",
    marginTop: 4,
  },
  totalItems: {
    color: "rgba(255,255,255,0.6)",
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  upiRow: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  upiInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: 8,
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tabTextActive: { color: "#fff" },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  feeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 10,
    ...Shadow.sm,
  },
  feeInfo: { flex: 1 },
  feeName: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  feeDue: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  feeTxn: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
    fontFamily: "monospace",
  },
  feeRight: { alignItems: "flex-end", gap: 8 },
  feeAmount: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.text },
  payBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    minWidth: 80,
    alignItems: "center",
  },
  payBtnText: { color: "#fff", fontSize: FontSize.sm, fontWeight: "700" },
  paidBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  paidBadgeText: {
    color: Colors.success,
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
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
