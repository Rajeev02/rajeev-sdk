# @rajeev02/deeplink

[![npm version](https://img.shields.io/npm/v/@rajeev02/deeplink.svg)](https://www.npmjs.com/package/@rajeev02/deeplink)
[![license](https://img.shields.io/npm/l/@rajeev02/deeplink.svg)](https://github.com/Rajeev02/rajeev-sdk/blob/main/LICENSE)

**Universal deep linking** with pattern matching, param extraction, UTM attribution, and deferred deep links — includes 19 pre-built super-app routes.

Part of [Rajeev SDK](https://github.com/Rajeev02/rajeev-sdk) — cross-platform infrastructure libraries for building apps that work everywhere.

## Why use this?

- **Route matching** — URL pattern matching with `:param` extraction, query string parsing
- **19 pre-built routes** — Common super-app screens (product, cart, checkout, order tracking, profile, chat, etc.)
- **UTM attribution** — Automatic UTM parameter extraction and analytics callback
- **Deferred deep links** — Handle links that arrive before the app is ready (cold start)
- **Universal + App links** — Generate both `myapp://` scheme links and `https://` universal links
- **Pure TypeScript** — No native link handling dependency. Plug into React Navigation or any router.

## ⚠️ Important: Native Deep Link Setup Required

This library provides the **URL routing and matching engine** — it parses incoming URLs, matches them to registered routes, and extracts parameters. But to actually **receive** deep links in your app, you need native configuration:

**Custom URL Scheme (`myapp://`):**
- **iOS:** Register your URL scheme in Xcode → Info → URL Types
- **Android:** Add intent filters for your scheme in `AndroidManifest.xml`

**Universal Links / App Links (`https://yourdomain.com/...`):**
- **iOS:** Add Associated Domains capability (`applinks:yourdomain.com`) and host an `apple-app-site-association` file on your domain
- **Android:** Host a `.well-known/assetlinks.json` file on your domain + add intent filters

**React Native integration:**
```typescript
import { Linking } from "react-native";
import { DeepLinkRouter } from "@rajeev02/deeplink";

// Feed incoming URLs to the router
Linking.addEventListener("url", ({ url }) => router.handle(url));

// Handle cold start
const initialUrl = await Linking.getInitialURL();
if (initialUrl) router.handle(initialUrl);
```

## Platform Support

| Platform   | Engine     | Status |
| ---------- | ---------- | ------ |
| iOS 16+    | TypeScript | ✅     |
| Android 7+ | TypeScript | ✅     |
| Web        | TypeScript | ✅     |

## Installation

```bash
npm install @rajeev02/deeplink
```

### Peer Dependencies

- `react` >= 18.3.0
- `react-native` >= 0.84.0 _(optional)_

## Quick Start

```typescript
import { DeepLinkRouter, getCommonRoutes } from "@rajeev02/deeplink";

// Create router with 19 pre-built routes
const router = new DeepLinkRouter({
  scheme: "myapp://",
  domains: ["myapp.com", "myapp.page.link"],
  routes: getCommonRoutes(),
  onNoMatch: (url) => console.warn("No route for:", url),
  onAttribution: (data) => analytics.track("deeplink", data),
});

// Mark app ready (processes any deferred links from cold start)
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

const webLink = router.generateUniversalLink("/product/:id", { id: "456" });
// → "https://myapp.com/product/456"

// Add custom routes
router.addRoute({
  pattern: "/store/:storeId/menu",
  screen: "StoreMenuScreen",
  authRequired: false,
});
```

## Pre-Built Routes

`getCommonRoutes()` returns 19 routes for common super-app screens:

| Pattern                  | Screen              | Auth |
| ------------------------ | ------------------- | ---- |
| `/home`                  | HomeScreen          | No   |
| `/product/:id`           | ProductScreen       | No   |
| `/category/:id`          | CategoryScreen      | No   |
| `/search`                | SearchScreen        | No   |
| `/cart`                  | CartScreen          | Yes  |
| `/checkout`              | CheckoutScreen      | Yes  |
| `/order/:orderId`        | OrderDetailScreen   | Yes  |
| `/order/:orderId/track`  | OrderTrackScreen    | Yes  |
| `/payment/:txnId/status` | PaymentStatusScreen | Yes  |
| `/profile`               | ProfileScreen       | Yes  |
| `/profile/edit`          | EditProfileScreen   | Yes  |
| `/settings`              | SettingsScreen      | Yes  |
| `/chat/:roomId`          | ChatScreen          | Yes  |
| `/offer/:offerId`        | OfferScreen         | No   |
| `/refer`                 | ReferralScreen      | Yes  |
| `/scan`                  | ScanScreen          | Yes  |
| `/pay/:vpa`              | PayScreen           | Yes  |
| `/kyc`                   | KycScreen           | Yes  |
| `/support`               | SupportScreen       | No   |

## API Reference

### `DeepLinkRouter`

| Method                                    | Returns                    | Description               |
| ----------------------------------------- | -------------------------- | ------------------------- |
| `handle(url)`                             | `DeepLinkMatch \| null`    | Match URL, extract params |
| `generate(pattern, params?)`              | `string`                   | Generate app-scheme link  |
| `generateUniversalLink(pattern, params?)` | `string`                   | Generate HTTPS link       |
| `setReady()`                              | `void`                     | Process deferred links    |
| `getDeferredLink()`                       | `DeferredDeepLink \| null` | Get cold-start link       |
| `addRoute(route)`                         | `void`                     | Register a route          |
| `getRoutes()`                             | `DeepLinkRoute[]`          | List all routes           |

## Full Documentation

📖 [Complete API docs with types and configuration](https://github.com/Rajeev02/rajeev-sdk/blob/main/docs/usage/DEEPLINK.md)

## License

MIT © 2026 [Rajeev Kumar Joshi](https://rajeev02.github.io)
