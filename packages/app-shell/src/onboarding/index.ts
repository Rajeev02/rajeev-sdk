/**
 * @rajeev02/app-shell — Onboarding
 * Splash screen, feature carousel, tooltips, first-launch detection
 */

export interface SplashConfig {
  logoSource: string;
  backgroundColor: string;
  minDisplayMs?: number;
  animation?: "fade" | "scale" | "slide" | "none";
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image?: string;
  lottieSource?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FeatureTooltip {
  id: string;
  targetElementId: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  showOnce?: boolean;
}

export interface OnboardingConfig {
  splash: SplashConfig;
  slides: OnboardingSlide[];
  tooltips?: FeatureTooltip[];
  skipText?: string;
  nextText?: string;
  doneText?: string;
  showDots?: boolean;
}

/**
 * Onboarding Manager
 */
export class OnboardingManager {
  private shownSlides: Set<string> = new Set();
  private seenTooltips: Set<string> = new Set();
  private completedOnboarding: boolean = false;
  private launchCount: number = 0;
  private listeners: Set<(event: string) => void> = new Set();

  recordLaunch(): void {
    this.launchCount++;
  }
  isFirstLaunch(): boolean {
    return this.launchCount <= 1;
  }
  getLaunchCount(): number {
    return this.launchCount;
  }

  completeOnboarding(): void {
    this.completedOnboarding = true;
    this.emit("onboarding_complete");
  }

  isOnboardingComplete(): boolean {
    return this.completedOnboarding;
  }
  markSlideShown(slideId: string): void {
    this.shownSlides.add(slideId);
  }
  markTooltipSeen(tooltipId: string): void {
    this.seenTooltips.add(tooltipId);
  }

  shouldShowTooltip(tooltip: FeatureTooltip): boolean {
    if (tooltip.showOnce && this.seenTooltips.has(tooltip.id)) return false;
    return true;
  }

  getUnseenTooltips(tooltips: FeatureTooltip[]): FeatureTooltip[] {
    return tooltips.filter((t) => this.shouldShowTooltip(t));
  }

  onEvent(listener: (event: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  exportState(): Record<string, unknown> {
    return {
      shownSlides: Array.from(this.shownSlides),
      seenTooltips: Array.from(this.seenTooltips),
      completedOnboarding: this.completedOnboarding,
      launchCount: this.launchCount,
    };
  }

  importState(state: Record<string, unknown>): void {
    if (Array.isArray(state.shownSlides))
      this.shownSlides = new Set(state.shownSlides as string[]);
    if (Array.isArray(state.seenTooltips))
      this.seenTooltips = new Set(state.seenTooltips as string[]);
    if (typeof state.completedOnboarding === "boolean")
      this.completedOnboarding = state.completedOnboarding;
    if (typeof state.launchCount === "number")
      this.launchCount = state.launchCount;
  }

  private emit(event: string): void {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch {}
    }
  }
}

/** Default onboarding slides for a super app */
export function getDefaultOnboardingSlides(): OnboardingSlide[] {
  return [
    {
      id: "welcome",
      title: "Welcome to Rajeev App",
      description:
        "One app for payments, shopping, health, government services, and more",
      backgroundColor: "#4F46E5",
    },
    {
      id: "payments",
      title: "Pay Instantly",
      description:
        "UPI payments, bill pay, and money transfers — works even on slow networks",
      backgroundColor: "#059669",
    },
    {
      id: "offline",
      title: "Works Offline",
      description:
        "Core features work without internet. Data syncs automatically when you're back online",
      backgroundColor: "#D97706",
    },
    {
      id: "language",
      title: "Your Language",
      description:
        "Use the app in Hindi, Tamil, Bengali, Telugu, and 6 more Indian languages",
      backgroundColor: "#DC2626",
    },
    {
      id: "voice",
      title: "Voice First",
      description:
        "Just speak! Navigate, search, and pay using voice commands in your language",
      backgroundColor: "#7C3AED",
    },
  ];
}
