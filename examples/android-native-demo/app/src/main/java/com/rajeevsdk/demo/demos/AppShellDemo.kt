package com.rajeevsdk.demo.demos

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun AppShellDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("App Shell — API, Cart & Forms", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("API Client", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[AppShell] GET /api/v1/products?featured=true")
                log("[AppShell] Cache: HIT (stale-while-revalidate)")
                log("[AppShell] → 200 OK (12ms, cached)")
                log("[AppShell] Items: 24 products")
            }) { Text("GET (Cached)") }

            Button(onClick = {
                log("[AppShell] POST /api/v1/orders")
                log("[AppShell] Body: { items: 2, total: ₹1,04,998 }")
                log("[AppShell] → 201 Created (287ms)")
                log("[AppShell] Order ID: ORD-2026-1847")
            }) { Text("POST") }
        }

        Text("Onboarding", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[AppShell] ONBOARDING started (4 slides):")
            log("  Slide 1: \"Welcome to Rajeev SDK\" — intro illustration")
            log("  Slide 2: \"Secure by Default\" — vault & encryption")
            log("  Slide 3: \"Works Offline\" — sync & CRDT")
            log("  Slide 4: \"Made for India\" — UPI, Aadhaar, languages")
            log("[AppShell] Progress: ████░░░░ 1/4")
        }) { Text("Start Onboarding") }

        Text("Chat", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[AppShell] CHAT send message:")
            log("  From: Rajeev (usr_42)")
            log("  To: Support (channel: #help)")
            log("  Text: \"How do I enable UPI autopay?\"")
            log("  Sent at: 12:30:45 IST")
            log("  Status: ✓✓ Delivered")
        }) { Text("Send Message") }

        Text("Cart", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[AppShell] CART contents:")
            log("  1. iPhone 16 Pro Max — ₹79,999")
            log("  2. AirPods Pro 3      — ₹24,999")
            log("  ─────────────────────────────────")
            log("  Subtotal:               ₹1,04,998")
            log("  Coupon SAVE10:          -₹10,500")
            log("  After discount:          ₹94,498")
            log("  GST (18%):              +₹17,010")
            log("  ─────────────────────────────────")
            log("  Total:                  ₹1,11,508")
        }) { Text("View Cart") }

        Text("Feature Flags", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[AppShell] Feature flags:")
            log("  dark_mode:       ✓ enabled")
            log("  upi_autopay:     ✓ enabled")
            log("  video_editor_v2: ✗ disabled")
            log("  edge_ai_ocr:     ✓ enabled (rollout: 80%)")
            log("  new_checkout:    ✗ disabled (A/B test: control)")
        }) { Text("Check Flags") }

        Text("Form Validators", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[AppShell] VALIDATE Aadhaar: 2345 6789 0123 → ✓ Valid (Verhoeff)")
            log("[AppShell] VALIDATE PAN: ABCDE1234F → ✓ Valid")
            log("[AppShell] VALIDATE IFSC: ICIC0001234 → ✓ Valid (ICICI Bank)")
            log("[AppShell] VALIDATE Pincode: 400001 → ✓ Valid (Mumbai GPO, Maharashtra)")
        }) { Text("Run Validators") }

        Text("Analytics", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[AppShell] TRACK event:")
            log("  Name: product_viewed")
            log("  Properties:")
            log("    product_id: SKU-42981")
            log("    category:   electronics")
            log("    price:      79999")
            log("    currency:   INR")
            log("    source:     deeplink")
            log("  Session: sess_7d3f1a")
            log("  → Queued for batch upload (14 events pending)")
        }) { Text("Track Event") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
