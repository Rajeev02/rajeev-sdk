/**
 * @rajeev02/payments — UPI Module
 * UPI intent, collect request, QR code, autopay mandates
 */

export interface UpiConfig {
  /** Merchant VPA (e.g., merchant@paytm) */
  merchantVpa: string;
  /** Merchant name shown in UPI apps */
  merchantName: string;
  /** Merchant category code */
  mcc?: string;
  /** Transaction reference prefix */
  txnRefPrefix?: string;
}

export interface UpiPaymentRequest {
  /** Amount in INR (paisa precision) */
  amount: number;
  /** Payment description */
  note: string;
  /** Unique transaction reference */
  txnRef?: string;
  /** Customer VPA (for collect requests) */
  customerVpa?: string;
  /** Order ID from your backend */
  orderId: string;
}

export interface UpiPaymentResult {
  success: boolean;
  txnId?: string;
  txnRef?: string;
  responseCode?: string;
  approvalRefNo?: string;
  status: "success" | "failed" | "pending" | "cancelled";
  error?: string;
}

export interface UpiMandateRequest {
  /** Customer VPA */
  customerVpa: string;
  /** Maximum amount per debit */
  maxAmount: number;
  /** Frequency: DAILY, WEEKLY, FORTNIGHTLY, MONTHLY, BIMONTHLY, QUARTERLY, HALFYEARLY, YEARLY */
  frequency: string;
  /** Start date (ISO) */
  startDate: string;
  /** End date (ISO) */
  endDate: string;
  /** Purpose description */
  purpose: string;
}

/**
 * Generate UPI deep link URI for intent-based payment
 * Works with all UPI apps (GPay, PhonePe, Paytm, etc.)
 */
export function generateUpiUri(
  config: UpiConfig,
  request: UpiPaymentRequest,
): string {
  const txnRef =
    request.txnRef || `${config.txnRefPrefix || "TXN"}${Date.now()}`;
  const params = new URLSearchParams({
    pa: config.merchantVpa,
    pn: config.merchantName,
    am: request.amount.toFixed(2),
    cu: "INR",
    tn: request.note,
    tr: txnRef,
  });
  if (config.mcc) params.set("mc", config.mcc);
  if (request.orderId) params.set("tid", request.orderId);
  return `upi://pay?${params.toString()}`;
}

/**
 * Generate UPI QR code data string
 */
export function generateUpiQrData(
  config: UpiConfig,
  request: UpiPaymentRequest,
): string {
  return generateUpiUri(config, request);
}

/**
 * Validate a UPI VPA format
 * Format: username@psp (e.g., rajeev@paytm, user@okicici)
 */
export function validateVpa(vpa: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(vpa);
}

/**
 * Known UPI PSP handles
 */
export const UPI_PSP_HANDLES: Record<string, string> = {
  "@paytm": "Paytm",
  "@okicici": "Google Pay (ICICI)",
  "@okhdfcbank": "Google Pay (HDFC)",
  "@oksbi": "Google Pay (SBI)",
  "@ybl": "PhonePe (YES Bank)",
  "@ibl": "PhonePe (ICICI)",
  "@axl": "PhonePe (Axis)",
  "@apl": "Amazon Pay",
  "@freecharge": "Freecharge",
  "@upi": "BHIM",
};

export function getPspName(vpa: string): string | null {
  const handle = "@" + vpa.split("@")[1];
  return UPI_PSP_HANDLES[handle] ?? null;
}
