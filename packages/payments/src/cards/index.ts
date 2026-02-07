/**
 * @rajeev02/payments — Cards & Subscriptions
 * Card tokenization (RBI compliant), saved cards, recurring billing
 */

export interface CardInfo {
  /** Tokenized card reference (never store raw card numbers) */
  tokenRef: string;
  /** Last 4 digits for display */
  last4: string;
  /** Card network */
  network: 'visa' | 'mastercard' | 'rupay' | 'amex' | 'dinersclub';
  /** Card type */
  type: 'credit' | 'debit' | 'prepaid';
  /** Issuing bank name */
  issuerBank?: string;
  /** Expiry month */
  expiryMonth: number;
  /** Expiry year */
  expiryYear: number;
  /** Cardholder name */
  holderName?: string;
  /** Whether card supports recurring/mandate */
  supportsRecurring: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  intervalCount: number;
  trialDays?: number;
  features?: string[];
}

export interface Subscription {
  id: string;
  planId: string;
  customerId: string;
  status: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  paymentMethod: 'card' | 'upi_mandate' | 'emandate';
  tokenRef?: string;
  nextBillingDate: string;
  amount: number;
}

/**
 * Detect card network from number prefix (first 6 digits)
 */
export function detectCardNetwork(cardNumber: string): CardInfo['network'] | null {
  const digits = cardNumber.replace(/\s/g, '');
  if (digits.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^6(0|5|52[12]|53[89]|5[4-9]|[6-9])/.test(digits)) return 'rupay';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^3(0[0-5]|[68])/.test(digits)) return 'dinersclub';
  return null;
}

/**
 * Format card number with spaces: 4111111111111111 → 4111 1111 1111 1111
 */
export function formatCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (detectCardNetwork(digits) === 'amex') {
    return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }
  return digits.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

/**
 * Calculate subscription renewal dates
 */
export function getNextBillingDate(plan: SubscriptionPlan, currentDate: Date = new Date()): Date {
  const next = new Date(currentDate);
  switch (plan.interval) {
    case 'daily': next.setDate(next.getDate() + plan.intervalCount); break;
    case 'weekly': next.setDate(next.getDate() + 7 * plan.intervalCount); break;
    case 'monthly': next.setMonth(next.getMonth() + plan.intervalCount); break;
    case 'quarterly': next.setMonth(next.getMonth() + 3 * plan.intervalCount); break;
    case 'yearly': next.setFullYear(next.getFullYear() + plan.intervalCount); break;
  }
  return next;
}
