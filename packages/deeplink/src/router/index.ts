/**
 * @rajeev02/deeplink — Router
 * Universal deep link router — pattern matching, parameter extraction,
 * auth guards, deferred deep links, analytics attribution
 */

export interface DeepLinkRoute {
  /** Pattern: "/product/:id", "/payment/:orderId/status", "/chat/:roomId" */
  pattern: string;
  /** Screen/page name to navigate to */
  screen: string;
  /** Required auth state ('authenticated' | 'any') */
  authRequired?: boolean;
  /** Handler function */
  handler?: (
    params: Record<string, string>,
    query: Record<string, string>,
  ) => void;
}

export interface DeepLinkMatch {
  route: DeepLinkRoute;
  params: Record<string, string>;
  query: Record<string, string>;
  fullUrl: string;
}

export interface DeferredDeepLink {
  url: string;
  timestamp: number;
  source?: string;
  campaign?: string;
  processed: boolean;
}

export interface DeepLinkConfig {
  /** App scheme (e.g., "rajeevapp://") */
  scheme: string;
  /** Universal link domains (e.g., ["rajeevapp.com", "link.rajeevapp.com"]) */
  domains: string[];
  /** Route definitions */
  routes: DeepLinkRoute[];
  /** Callback when no route matches */
  onNoMatch?: (url: string) => void;
  /** Callback for attribution tracking */
  onAttribution?: (source: string, campaign?: string, medium?: string) => void;
}

/**
 * Deep Link Router
 */
export class DeepLinkRouter {
  private config: DeepLinkConfig;
  private deferredLink: DeferredDeepLink | null = null;
  private isReady: boolean = false;

  constructor(config: DeepLinkConfig) {
    this.config = config;
  }

  /** Mark the app as ready to handle deep links (after auth check, navigation ready) */
  setReady(): void {
    this.isReady = true;
    if (this.deferredLink && !this.deferredLink.processed) {
      this.handle(this.deferredLink.url);
      this.deferredLink.processed = true;
    }
  }

  /** Handle an incoming deep link URL */
  handle(url: string): DeepLinkMatch | null {
    const parsed = this.parseUrl(url);
    if (!parsed) return null;

    // Extract UTM params for attribution
    if (parsed.query.utm_source && this.config.onAttribution) {
      this.config.onAttribution(
        parsed.query.utm_source,
        parsed.query.utm_campaign,
        parsed.query.utm_medium,
      );
    }

    // If app not ready yet, defer the link
    if (!this.isReady) {
      this.deferredLink = {
        url,
        timestamp: Date.now(),
        source: parsed.query.utm_source,
        processed: false,
      };
      return null;
    }

    // Match against routes
    for (const route of this.config.routes) {
      const params = this.matchPattern(route.pattern, parsed.path);
      if (params !== null) {
        const match: DeepLinkMatch = {
          route,
          params,
          query: parsed.query,
          fullUrl: url,
        };
        if (route.handler) route.handler(params, parsed.query);
        return match;
      }
    }

    // No match
    if (this.config.onNoMatch) this.config.onNoMatch(url);
    return null;
  }

  /** Generate a deep link URL */
  generate(
    pattern: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {},
  ): string {
    let path = pattern;
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, encodeURIComponent(value));
    }
    const queryStr = Object.entries(query)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    const base = `${this.config.scheme}${path}`;
    return queryStr ? `${base}?${queryStr}` : base;
  }

  /** Generate a universal link (HTTPS) */
  generateUniversalLink(
    pattern: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {},
  ): string {
    let path = pattern;
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, encodeURIComponent(value));
    }
    const queryStr = Object.entries(query)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    const domain = this.config.domains[0] || "app.example.com";
    const base = `https://${domain}${path}`;
    return queryStr ? `${base}?${queryStr}` : base;
  }

  /** Get deferred deep link (for cold start handling) */
  getDeferredLink(): DeferredDeepLink | null {
    return this.deferredLink;
  }

  /** Get all registered routes */
  getRoutes(): DeepLinkRoute[] {
    return [...this.config.routes];
  }

  /** Add a route dynamically */
  addRoute(route: DeepLinkRoute): void {
    this.config.routes.push(route);
  }

  private parseUrl(
    url: string,
  ): { path: string; query: Record<string, string> } | null {
    try {
      let path: string;
      let queryStr: string = "";

      if (url.includes("://")) {
        const afterScheme = url.split("://")[1] || "";
        // Remove domain for universal links
        let pathPart = afterScheme;
        for (const domain of this.config.domains) {
          if (pathPart.startsWith(domain)) {
            pathPart = pathPart.substring(domain.length);
            break;
          }
        }
        const [p, q] = pathPart.split("?");
        path = p.startsWith("/") ? p : `/${p}`;
        queryStr = q || "";
      } else {
        const [p, q] = url.split("?");
        path = p.startsWith("/") ? p : `/${p}`;
        queryStr = q || "";
      }

      const query: Record<string, string> = {};
      if (queryStr) {
        for (const pair of queryStr.split("&")) {
          const [k, v] = pair.split("=");
          if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
        }
      }

      return { path, query };
    } catch {
      return null;
    }
  }

  private matchPattern(
    pattern: string,
    path: string,
  ): Record<string, string> | null {
    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        params[patternParts[i].substring(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }
}

/**
 * Common deep link routes for super apps
 */
export function getCommonRoutes(): DeepLinkRoute[] {
  return [
    { pattern: "/home", screen: "HomeScreen" },
    { pattern: "/product/:id", screen: "ProductScreen" },
    { pattern: "/product/:id/reviews", screen: "ReviewsScreen" },
    { pattern: "/cart", screen: "CartScreen", authRequired: true },
    { pattern: "/checkout", screen: "CheckoutScreen", authRequired: true },
    {
      pattern: "/order/:orderId",
      screen: "OrderDetailScreen",
      authRequired: true,
    },
    {
      pattern: "/order/:orderId/track",
      screen: "OrderTrackingScreen",
      authRequired: true,
    },
    {
      pattern: "/payment/:txnId/status",
      screen: "PaymentStatusScreen",
      authRequired: true,
    },
    { pattern: "/chat/:roomId", screen: "ChatScreen", authRequired: true },
    { pattern: "/profile", screen: "ProfileScreen", authRequired: true },
    {
      pattern: "/profile/settings",
      screen: "SettingsScreen",
      authRequired: true,
    },
    {
      pattern: "/notifications",
      screen: "NotificationsScreen",
      authRequired: true,
    },
    { pattern: "/scan", screen: "QrScanScreen" },
    { pattern: "/pay", screen: "PaymentScreen", authRequired: true },
    { pattern: "/pay/:vpa", screen: "PayToVpaScreen", authRequired: true },
    { pattern: "/refer", screen: "ReferralScreen" },
    { pattern: "/offers", screen: "OffersScreen" },
    { pattern: "/help", screen: "HelpScreen" },
    { pattern: "/kyc", screen: "KycScreen", authRequired: true },
  ];
}
