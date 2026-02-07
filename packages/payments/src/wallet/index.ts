/**
 * @rajeev02/payments — Wallet Module
 * Abstraction over PhonePe, Paytm, Amazon Pay, Freecharge wallets
 */

export type WalletProvider = 'paytm' | 'phonepe' | 'amazon_pay' | 'freecharge' | 'mobikwik' | 'jio_pay';

export interface WalletConfig {
  provider: WalletProvider;
  merchantId: string;
  merchantKey?: string;
  environment: 'sandbox' | 'production';
  callbackUrl: string;
}

export interface WalletPaymentRequest {
  orderId: string;
  amount: number;
  customerId: string;
  customerPhone?: string;
  customerEmail?: string;
  description?: string;
}

export interface WalletPaymentResult {
  success: boolean;
  provider: WalletProvider;
  txnId?: string;
  orderId: string;
  status: 'success' | 'failed' | 'pending' | 'cancelled';
  walletBalance?: number;
  error?: string;
}

/**
 * Wallet Manager — handles payment flow across wallet providers
 */
export class WalletManager {
  private configs: Map<WalletProvider, WalletConfig> = new Map();

  /** Register a wallet provider */
  register(config: WalletConfig): void {
    this.configs.set(config.provider, config);
  }

  /** Get all registered wallet providers */
  getAvailableWallets(): WalletProvider[] {
    return Array.from(this.configs.keys());
  }

  /** Check if a wallet is registered */
  isAvailable(provider: WalletProvider): boolean {
    return this.configs.has(provider);
  }

  /** Generate checkout URL/payload for a wallet */
  generateCheckout(provider: WalletProvider, request: WalletPaymentRequest): Record<string, unknown> | null {
    const config = this.configs.get(provider);
    if (!config) return null;

    return {
      provider,
      merchantId: config.merchantId,
      environment: config.environment,
      callbackUrl: config.callbackUrl,
      orderId: request.orderId,
      amount: request.amount,
      customerId: request.customerId,
      phone: request.customerPhone,
      email: request.customerEmail,
    };
  }
}
