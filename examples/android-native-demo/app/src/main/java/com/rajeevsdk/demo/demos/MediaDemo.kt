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
fun MediaDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Media — HLS Player & DRM", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Playback", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Media] LOAD HLS: https://stream.rajeev.dev/live/master.m3u8")
            log("[Media] Variants: 360p, 480p, 720p, 1080p, 4K")
            log("[Media] Audio: AAC 48kHz stereo")
            log("[Media] Duration: LIVE (DVR: 2h window)")
            log("[Media] Manifest parsed in 38ms")
        }) { Text("Load HLS Stream") }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Media] ▶ PLAY")
                log("[Media] Playing at 1080p, buffer: 12.4s")
            }) { Text("Play") }

            Button(onClick = {
                log("[Media] ⏸ PAUSE at 00:14:32")
            }) { Text("Pause") }

            Button(onClick = {
                log("[Media] SEEK → 00:30:00")
                log("[Media] Buffering... ready in 340ms")
                log("[Media] Resumed at 00:30:00")
            }) { Text("Seek") }
        }

        Text("Rate Control", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { log("[Media] Rate → 0.5× (slow motion)") }) { Text("0.5×") }
            Button(onClick = { log("[Media] Rate → 1.0× (normal)") }) { Text("1.0×") }
            Button(onClick = { log("[Media] Rate → 1.5×") }) { Text("1.5×") }
            Button(onClick = { log("[Media] Rate → 2.0× (fast forward)") }) { Text("2.0×") }
        }

        Text("Quality Selection", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Media] Quality options:")
            log("  Auto (ABR) — currently 1080p")
            log("  4K    (2160p) — 15.2 Mbps")
            log("  1080p (Full HD) — 5.8 Mbps")
            log("  720p  (HD) — 3.2 Mbps")
            log("  480p  (SD) — 1.5 Mbps")
            log("  360p  (Low) — 0.8 Mbps")
            log("[Media] Selected: 1080p (manual)")
        }) { Text("Select Quality") }

        Text("PiP & DRM", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Media] PiP: ENABLED")
                log("[Media] Window: 240×135, bottom-right")
                log("[Media] Controls: play/pause, close")
            }) { Text("PiP") }

            Button(onClick = {
                log("[Media] DRM: Widevine L1")
                log("[Media] Security level: HW_SECURE_ALL")
                log("[Media] License server: https://drm.rajeev.dev/widevine")
                log("[Media] License acquired in 142ms")
                log("[Media] HDCP: 2.2 compliant")
            }) { Text("Widevine DRM") }
        }

        Text("Downloads", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Media] DOWNLOAD_ENQUEUE: \"Movie_1080p\"")
                log("[Media] Quality: 1080p (2.4 GB estimated)")
                log("[Media] DRM: Offline license acquired (48h)")
                log("[Media] → Downloading...")
            }) { Text("Enqueue Download") }

            Button(onClick = {
                log("[Media] DOWNLOAD_PROGRESS:")
                log("  Movie_1080p: 67.3% (1.62 GB / 2.4 GB)")
                log("  Speed: 18.4 MB/s")
                log("  ETA: 42s")
            }) { Text("Check Progress") }
        }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
