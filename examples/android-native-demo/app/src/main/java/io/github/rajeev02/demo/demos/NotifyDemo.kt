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
fun NotifyDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Notify — Scheduled & Inbox", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Schedule Notifications", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Notify] SCHEDULE in 5 minutes:")
            log("  Title: \"Don't forget!\"")
            log("  Body:  \"Your cart has 2 items waiting\"")
            log("  Channel: reminders")
            log("  ID: notif_5min_001")
            log("  Fire at: ${System.currentTimeMillis() / 1000 + 300} (5m from now)")
        }) { Text("In 5 Minutes") }

        Button(onClick = {
            log("[Notify] SCHEDULE in 1 hour:")
            log("  Title: \"Flash Sale Starting!\"")
            log("  Body:  \"Up to 60% off electronics — ends midnight\"")
            log("  Channel: promotions")
            log("  ID: notif_1hr_002")
            log("  Fire at: ${System.currentTimeMillis() / 1000 + 3600} (1h from now)")
        }) { Text("In 1 Hour") }

        Button(onClick = {
            log("[Notify] SCHEDULE tomorrow 9:00 AM:")
            log("  Title: \"Good Morning! ☀\"")
            log("  Body:  \"Your daily summary: 3 orders shipped\"")
            log("  Channel: daily_digest")
            log("  ID: notif_daily_003")
            log("  Fire at: 2026-02-09T09:00:00+05:30")
        }) { Text("Tomorrow 9 AM") }

        Text("Quiet Hours", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Notify] QUIET_HOURS configured:")
            log("  Start: 10:00 PM (22:00)")
            log("  End:   7:00 AM (07:00)")
            log("  Mode:  Silent (no sound, no vibration)")
            log("  Exceptions: critical_alerts channel")
            log("  Status: currently ${if (System.currentTimeMillis() % 2 == 0L) "ACTIVE" else "INACTIVE"}")
        }) { Text("Set Quiet Hours (10pm–7am)") }

        Text("Inbox", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Notify] INBOX (3 notifications):")
            log("  ─────────────────────────────────")
            log("  1. [UNREAD] 📦 Order Shipped")
            log("     \"ORD-2026-1847 shipped via BlueDart\"")
            log("     2 hours ago · channel: orders")
            log("  ─────────────────────────────────")
            log("  2. [UNREAD] 💳 Payment Received")
            log("     \"₹1,11,508 received from UPI\"")
            log("     5 hours ago · channel: payments")
            log("  ─────────────────────────────────")
            log("  3. [READ]   🎉 Welcome!")
            log("     \"Thanks for joining Rajeev SDK\"")
            log("     1 day ago · channel: general")
        }) { Text("Show Inbox (3)") }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Notify] MARK_READ: notif_001 (Order Shipped)")
                log("[Notify] Unread count: 2 → 1")
            }) { Text("Mark Read") }

            Button(onClick = {
                log("[Notify] CLEAR_ALL")
                log("[Notify] Removed 3 notifications from inbox")
                log("[Notify] Pending scheduled: 3 remaining")
                log("[Notify] Badge count: 0")
            }) { Text("Clear All") }
        }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
