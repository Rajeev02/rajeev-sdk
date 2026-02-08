package io.github.rajeev02.demo.demos

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun DeepLinkDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("DeepLink — URL Router", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Router Init", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[DeepLink] Router initialized with 19 routes:")
            log("  /product/:id          → ProductScreen")
            log("  /category/:slug       → CategoryScreen")
            log("  /cart                  → CartScreen")
            log("  /checkout             → CheckoutScreen")
            log("  /pay/:txnId           → PaymentScreen")
            log("  /order/:id            → OrderDetailScreen")
            log("  /orders               → OrderListScreen")
            log("  /profile              → ProfileScreen")
            log("  /settings             → SettingsScreen")
            log("  /search?q=:query      → SearchScreen")
            log("  /offers               → OffersScreen")
            log("  /refer/:code          → ReferralScreen")
            log("  /support              → SupportScreen")
            log("  /support/ticket/:id   → TicketScreen")
            log("  /notifications        → NotificationsScreen")
            log("  /story/:id            → StoryScreen")
            log("  /live/:streamId       → LiveScreen")
            log("  /scan                 → ScannerScreen")
            log("  /kyc                  → KYCScreen")
        }) { Text("Init Router (19 routes)") }

        Text("Handle URLs", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[DeepLink] HANDLE: https://app.rajeev.dev/product/SKU-42981")
            log("[DeepLink] Matched: /product/:id")
            log("[DeepLink] Params: { id: \"SKU-42981\" }")
            log("[DeepLink] → Navigate to ProductScreen")
        }) { Text("Product Link") }

        Button(onClick = {
            log("[DeepLink] HANDLE: https://app.rajeev.dev/pay/txn_8f4a2b")
            log("[DeepLink] Matched: /pay/:txnId")
            log("[DeepLink] Params: { txnId: \"txn_8f4a2b\" }")
            log("[DeepLink] → Navigate to PaymentScreen")
        }) { Text("Payment Link") }

        Button(onClick = {
            log("[DeepLink] HANDLE: https://app.rajeev.dev/order/ORD-2026-1847")
            log("[DeepLink] Matched: /order/:id")
            log("[DeepLink] Params: { id: \"ORD-2026-1847\" }")
            log("[DeepLink] → Navigate to OrderDetailScreen")
        }) { Text("Order Link") }

        Text("Generate Links", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[DeepLink] GENERATE for ProductScreen { id: \"SKU-42981\" }")
            log("[DeepLink] → https://app.rajeev.dev/product/SKU-42981")
            log("[DeepLink] Short: https://rjv.link/p42981")
            log("[DeepLink] QR code: 128×128 generated")
        }) { Text("Generate Link") }

        Text("Deferred Links", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[DeepLink] DEFERRED link check on first launch...")
            log("[DeepLink] Found stored link: https://app.rajeev.dev/refer/RAJEEV50")
            log("[DeepLink] Matched: /refer/:code")
            log("[DeepLink] Params: { code: \"RAJEEV50\" }")
            log("[DeepLink] Attribution: Install from referral campaign")
            log("[DeepLink] → Navigate to ReferralScreen (deferred)")
        }) { Text("Check Deferred") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
