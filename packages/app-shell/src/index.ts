/**
 * @rajeev02/app-shell
 * Feature-Slice App Architecture
 * API client, onboarding, chat, forms/KYC, cart/checkout, analytics, feature flags
 *
 * @author Rajeev Kumar Joshi
 * @license MIT
 */

// API Client
export { ApiClient } from "./api";
export type {
  ApiConfig,
  ApiRequest,
  ApiResponse,
  CacheStrategy,
  RequestInterceptor,
  ResponseInterceptor,
} from "./api";

// Onboarding
export { OnboardingManager, getDefaultOnboardingSlides } from "./onboarding";
export type {
  SplashConfig,
  OnboardingSlide,
  FeatureTooltip,
  OnboardingConfig,
} from "./onboarding";

// Chat
export { ChatEngine } from "./chat";
export type {
  ChatMessage,
  ChatRoom,
  MessageType,
  MessageStatus,
  TypingIndicator,
  ChatEvent,
} from "./chat";

// Cart & Checkout
export { CartManager } from "./cart";
export type {
  CartItem,
  CartSummary,
  Address,
  Order,
  OrderStatus,
} from "./cart";

// Analytics
export { AnalyticsEngine } from "./analytics";
export type { AnalyticsEvent, AnalyticsConfig } from "./analytics";

// Feature Flags
export { FeatureFlagManager } from "./config";
export type { FeatureFlag } from "./config";

// Forms & KYC
export { FormEngine, getKycFormConfig } from "./forms";
export type {
  FormField,
  FormStep,
  FormConfig,
  FormState,
  FieldType,
  ValidationRule,
} from "./forms";
