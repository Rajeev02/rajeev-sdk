# @rajeev02/deeplink

**Universal deep linking** with pattern matching, param extraction, UTM attribution, and deferred deep links.

| Platform            | Engine     | Binding                    |
| ------------------- | ---------- | -------------------------- |
| iOS 16+             | TypeScript | React Native / Expo module |
| Android 7+ (API 24) | TypeScript | React Native / Expo module |
| Web                 | TypeScript | ES module                  |
| watchOS 9+          | TypeScript | React Native module        |
| Wear OS             | TypeScript | React Native module        |
| Android Auto        | TypeScript | React Native module        |

---

## Installation

```bash
npm install @rajeev02/deeplink
```

### Peer Dependencies

| Package        | Version                 |
| -------------- | ----------------------- |
| `react`        | `>=18.3.0`              |
| `react-native` | `>=0.84.0`              |
| `expo`         | `>=54.0.0` _(optional)_ |

---

## Quick Start

```typescript
import { DeepLinkRouter, getCommonRoutes } from "@rajeev02/deeplink";

// Create router with common routes
const router = new DeepLinkRouter({
  scheme: "myapp://",
  domains: ["myapp.com", "myapp.page.link"],
  routes: getCommonRoutes(),
  onNoMatch: (url) => console.warn("No route for:", url),
  onAttribution: (data) => analytics.track("deeplink", data),
});

// Mark app ready (processes deferred links)
router.setReady();

// Handle incoming URL
const match = router.handle("myapp://product/123?utm_source=email");
if (match) {
  console.log(match.route.screen); // → "ProductScreen"
  console.log(match.params.id); // → "123"
  console.log(match.query); // → { utm_source: "email" }
}

// Generate links
const appLink = router.generate("/product/:id", { id: "456" });
// → "myapp://product/456"

const universalLink = router.generateUniversalLink("/product/:id", {
  id: "456",
});
// → "https://myapp.com/product/456"
```

---

## API Reference

### `DeepLinkRouter`

#### Constructor

```typescript
new DeepLinkRouter(config: DeepLinkConfig)
```

#### Methods

| Method                                            | Returns                    | Description                                         |
| ------------------------------------------------- | -------------------------- | --------------------------------------------------- |
| `setReady()`                                      | `void`                     | Mark app ready; processes any deferred links        |
| `handle(url)`                                     | `DeepLinkMatch \| null`    | Match URL against registered routes, extract params |
| `generate(pattern, params?, query?)`              | `string`                   | Generate an app-scheme deep link                    |
| `generateUniversalLink(pattern, params?, query?)` | `string`                   | Generate an HTTPS universal link                    |
| `getDeferredLink()`                               | `DeferredDeepLink \| null` | Get cold-start deferred link                        |
| `addRoute(route)`                                 | `void`                     | Register a route dynamically                        |
| `getRoutes()`                                     | `DeepLinkRoute[]`          | List all registered routes                          |

---

### `getCommonRoutes()`

Returns 19 preset routes for common super-app screens:

| Pattern                  | Screen              | Auth Required |
| ------------------------ | ------------------- | ------------- |
| `/home`                  | HomeScreen          | No            |
| `/product/:id`           | ProductScreen       | No            |
| `/category/:id`          | CategoryScreen      | No            |
| `/search`                | SearchScreen        | No            |
| `/cart`                  | CartScreen          | Yes           |
| `/checkout`              | CheckoutScreen      | Yes           |
| `/order/:orderId`        | OrderDetailScreen   | Yes           |
| `/order/:orderId/track`  | OrderTrackScreen    | Yes           |
| `/payment/:txnId/status` | PaymentStatusScreen | Yes           |
| `/profile`               | ProfileScreen       | Yes           |
| `/profile/edit`          | EditProfileScreen   | Yes           |
| `/settings`              | SettingsScreen      | Yes           |
| `/chat/:roomId`          | ChatScreen          | Yes           |
| `/offer/:offerId`        | OfferScreen         | No            |
| `/refer`                 | ReferralScreen      | Yes           |
| `/scan`                  | ScanScreen          | Yes           |
| `/pay/:vpa`              | PayScreen           | Yes           |
| `/kyc`                   | KycScreen           | Yes           |
| `/support`               | SupportScreen       | No            |

---

## Types

```typescript
interface DeepLinkConfig {
  scheme: string;
  domains: string[];
  routes: DeepLinkRoute[];
  onNoMatch?: (url: string) => void;
  onAttribution?: (data: Record<string, string>) => void;
}

interface DeepLinkRoute {
  pattern: string;
  screen: string;
  authRequired?: boolean;
  handler?: (match: DeepLinkMatch) => void;
}

interface DeepLinkMatch {
  route: DeepLinkRoute;
  params: Record<string, string>;
  query: Record<string, string>;
  fullUrl: string;
}

interface DeferredDeepLink {
  url: string;
  timestamp: number;
  source?: string;
  campaign?: string;
  processed: boolean;
}
```
