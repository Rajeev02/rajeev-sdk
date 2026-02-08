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
fun NetworkDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    // UniFFI JNI API (requires linked .so):
    // val net = RajeevNetwork.create(NetworkConfig(maxConcurrent = 6, cache = CachePolicy.LRU(50_000_000)))
    // val state = net.connectivityState()
    // net.enqueue(Request.get("https://api.example.com/data"), Priority.HIGH)
    // val cached = net.getCached("https://api.example.com/data")
    // val stats = net.compressionStats()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Network — Priority Queue & Cache", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Connectivity", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Network] Connectivity: WIFI")
            log("[Network] Signal strength: Excellent (-42 dBm)")
            log("[Network] Effective type: 4g")
            log("[Network] Downlink: 28.5 Mbps")
            log("[Network] RTT: 18ms")
        }) { Text("Check State") }

        Text("Priority Queue", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Network] ENQUEUE GET /api/v1/user/profile [Priority: HIGH]")
                log("[Network] Queue position: 1 of 3")
                log("[Network] → 200 OK (143ms, 2.1 KB)")
            }) { Text("High Priority") }

            Button(onClick = {
                log("[Network] ENQUEUE GET /api/v1/feed [Priority: NORMAL]")
                log("[Network] Queue position: 3 of 4")
                log("[Network] → 200 OK (287ms, 18.4 KB)")
            }) { Text("Normal Priority") }
        }

        Button(onClick = {
            log("[Network] ENQUEUE POST /api/v1/analytics/batch [Priority: LOW]")
            log("[Network] Queue position: 5 of 5")
            log("[Network] Deferred — waiting for idle")
        }) { Text("Low Priority (Deferred)") }

        Text("HTTP Cache", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Network] CACHE HIT: /api/v1/config")
                log("[Network] Cached at: 2026-02-08T09:15:00Z")
                log("[Network] TTL remaining: 847s")
                log("[Network] Size: 1.2 KB (gzip)")
            }) { Text("Cache Hit") }

            Button(onClick = {
                log("[Network] CACHE MISS: /api/v1/notifications")
                log("[Network] Fetching from origin...")
                log("[Network] → 200 OK, cached for 300s")
            }) { Text("Cache Miss") }
        }

        Text("Compression", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Network] Compression Stats:")
            log("  Total requests: 142")
            log("  Original size:  4.8 MB")
            log("  Compressed:     1.2 MB")
            log("  Ratio:          74.8% savings")
            log("  Algorithm:      brotli (94), gzip (48)")
        }) { Text("Compression Stats") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
