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
fun SyncDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    // UniFFI JNI API (requires linked .so):
    // val engine = RajeevSync.create(SyncConfig(strategy = MergeStrategy.LWW))
    // val doc = engine.createDocument("notes/meeting")
    // doc.set("title", "Sprint Planning")
    // val merged = engine.merge(localDoc, remoteDoc)
    // val clock = engine.hlcTimestamp()
    // val diff = engine.diff(docV1, docV2)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Sync — CRDT Conflict-Free Sync", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Document CRUD", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Sync] CREATE doc: \"notes/meeting\"")
                log("[Sync] Type: LWW-Register Map")
                log("[Sync] Node ID: node_a7f3")
                log("[Sync] Clock: HLC(1707350400000, 0, node_a7f3)")
            }) { Text("Create Doc") }

            Button(onClick = {
                log("[Sync] READ doc: \"notes/meeting\"")
                log("[Sync] {")
                log("  \"title\": \"Sprint Planning\",")
                log("  \"attendees\": [\"Rajeev\", \"Priya\", \"Amit\"],")
                log("  \"status\": \"in_progress\"")
                log("}")
            }) { Text("Read Doc") }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Sync] UPDATE doc: \"notes/meeting\"")
                log("[Sync] SET \"status\" = \"completed\"")
                log("[Sync] Clock: HLC(1707350400120, 1, node_a7f3)")
                log("[Sync] Delta: 1 field changed, 24 bytes")
            }) { Text("Update Doc") }

            Button(onClick = {
                log("[Sync] DELETE doc: \"notes/meeting\"")
                log("[Sync] Tombstone placed at HLC(1707350400250, 0, node_a7f3)")
                log("[Sync] Pending GC in 7 days")
            }) { Text("Delete Doc") }
        }

        Text("Merge Conflicts", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Sync] MERGE local ⊕ remote for \"notes/meeting\"")
            log("[Sync] Local:  {\"title\": \"Sprint Planning v2\"}")
            log("[Sync]         Clock: HLC(..120, 1, node_a7f3)")
            log("[Sync] Remote: {\"title\": \"Sprint Retro\"}")
            log("[Sync]         Clock: HLC(..115, 0, node_b2e1)")
            log("[Sync] Winner: LOCAL (higher HLC timestamp)")
            log("[Sync] Result: {\"title\": \"Sprint Planning v2\"}")
            log("[Sync] Conflicts resolved: 1, auto-merged: 2")
        }) { Text("Merge Conflict") }

        Text("HLC Timestamps", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Sync] HLC Timestamp:")
            log("  Physical: 2026-02-08T12:30:00.000Z")
            log("  Logical:  3")
            log("  Node:     node_a7f3")
            log("  Encoded:  HLC(1707393000000, 3, node_a7f3)")
            log("[Sync] Monotonicity: ✓ guaranteed")
        }) { Text("Get HLC") }

        Text("Diff", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Sync] DIFF v1 → v2 of \"notes/meeting\"")
            log("  + added:   \"priority\" = \"high\"")
            log("  ~ changed: \"status\" \"in_progress\" → \"completed\"")
            log("  - removed: \"draft\" (was: true)")
            log("[Sync] Total ops: 3 (add: 1, modify: 1, remove: 1)")
        }) { Text("Compute Diff") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
