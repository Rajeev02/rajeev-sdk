/**
 * @rajeev02/payments
 * Payments Abstraction SDK — India focused
 * UPI, wallets, cards, subscriptions
 *
 * @author Rajeev Joshi
 * @license MIT
 */
export {
  generateUpiUri,
  generateUpiQrData,
  validateVpa,
  getPspName,
  UPI_PSP_HANDLES,
} from "./upi";
export type {
  UpiConfig,
  UpiPaymentRequest,
  UpiPaymentResult,
  UpiMandateRequest,
} from "./upi";

export { WalletManager } from "./wallet";
export type {
  WalletProvider,
  WalletConfig,
  WalletPaymentRequest,
  WalletPaymentResult,
} from "./wallet";

export {
  detectCardNetwork,
  formatCardNumber,
  validateCardNumber,
  getNextBillingDate,
} from "./cards";
export type { CardInfo, SubscriptionPlan, Subscription } from "./cards";
