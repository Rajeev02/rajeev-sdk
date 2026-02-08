/**
 * @rajeev02/app-shell — Cart & Checkout
 * Cart management, address, coupons, order tracking
 */

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
  variant?: string;
  metadata?: Record<string, unknown>;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  itemCount: number;
}

export interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export type OrderStatus =
  | "created"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  trackingId?: string;
  createdAt: number;
  updatedAt: number;
  estimatedDelivery?: string;
}

/**
 * Cart Manager
 */
export class CartManager {
  private items: Map<string, CartItem> = new Map();
  private couponCode: string | null = null;
  private couponDiscount: number = 0;
  private taxRate: number = 0.18; // 18% GST
  private deliveryFee: number = 0;
  private listeners: Set<() => void> = new Set();

  /** Add item to cart */
  add(item: Omit<CartItem, "quantity">, quantity: number = 1): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        existing.maxQuantity ?? 99,
      );
    } else {
      this.items.set(item.id, { ...item, quantity });
    }
    this.notify();
  }

  /** Update quantity */
  updateQuantity(itemId: string, quantity: number): void {
    const item = this.items.get(itemId);
    if (item) {
      if (quantity <= 0) {
        this.items.delete(itemId);
      } else {
        item.quantity = Math.min(quantity, item.maxQuantity ?? 99);
      }
      this.notify();
    }
  }

  /** Remove item */
  remove(itemId: string): void {
    this.items.delete(itemId);
    this.notify();
  }

  /** Clear cart */
  clear(): void {
    this.items.clear();
    this.couponCode = null;
    this.couponDiscount = 0;
    this.notify();
  }

  /** Apply coupon */
  applyCoupon(code: string, discountAmount: number): void {
    this.couponCode = code;
    this.couponDiscount = discountAmount;
    this.notify();
  }

  /** Remove coupon */
  removeCoupon(): void {
    this.couponCode = null;
    this.couponDiscount = 0;
    this.notify();
  }

  /** Set delivery fee */
  setDeliveryFee(fee: number): void {
    this.deliveryFee = fee;
  }

  /** Get cart summary */
  getSummary(): CartSummary {
    const items = Array.from(this.items.values());
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = this.couponDiscount;
    const taxable = subtotal - discount;
    const tax = Math.max(0, taxable * this.taxRate);
    const total = Math.max(0, taxable + tax + this.deliveryFee);

    return {
      items,
      subtotal,
      discount,
      tax,
      deliveryFee: this.deliveryFee,
      total,
      couponCode: this.couponCode ?? undefined,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }

  /** Check if cart is empty */
  isEmpty(): boolean {
    return this.items.size === 0;
  }

  /** Get item count */
  getItemCount(): number {
    return Array.from(this.items.values()).reduce(
      (sum, i) => sum + i.quantity,
      0,
    );
  }

  /** Subscribe to cart changes */
  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Export cart for persistence */
  export(): Record<string, unknown> {
    return {
      items: Array.from(this.items.values()),
      couponCode: this.couponCode,
      couponDiscount: this.couponDiscount,
    };
  }

  /** Import cart from persistence */
  import(data: Record<string, unknown>): void {
    if (Array.isArray(data.items)) {
      for (const item of data.items as CartItem[]) {
        this.items.set(item.id, item);
      }
    }
    if (typeof data.couponCode === "string") this.couponCode = data.couponCode;
    if (typeof data.couponDiscount === "number")
      this.couponDiscount = data.couponDiscount;
  }

  private notify(): void {
    for (const l of this.listeners) {
      try {
        l();
      } catch {}
    }
  }
}
