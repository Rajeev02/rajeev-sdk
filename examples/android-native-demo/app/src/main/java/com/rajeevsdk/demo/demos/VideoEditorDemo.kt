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
fun VideoEditorDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Video Editor — Timeline & Export", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Timeline Clips", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[VideoEditor] ADD_VIDEO clip: \"intro.mp4\"")
            log("[VideoEditor] Duration: 00:00:08.240")
            log("[VideoEditor] Resolution: 1080×1920 (9:16)")
            log("[VideoEditor] Track: V1, position: 0s")
        }) { Text("Add Video Clip") }

        Button(onClick = {
            log("[VideoEditor] ADD_AUDIO clip: \"bgm_chill.mp3\"")
            log("[VideoEditor] Duration: 00:03:42.000")
            log("[VideoEditor] Sample rate: 44.1 kHz, stereo")
            log("[VideoEditor] Track: A1, position: 0s")
            log("[VideoEditor] Volume: 60%")
        }) { Text("Add Audio Clip") }

        Text("Editing", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[VideoEditor] TRIM clip: \"intro.mp4\"")
                log("[VideoEditor] In: 00:00:01.500")
                log("[VideoEditor] Out: 00:00:06.800")
                log("[VideoEditor] New duration: 00:00:05.300")
            }) { Text("Trim") }

            Button(onClick = {
                log("[VideoEditor] SPLIT clip: \"intro.mp4\" at 00:00:03.000")
                log("[VideoEditor] Created: intro_part1.mp4 (3.0s)")
                log("[VideoEditor] Created: intro_part2.mp4 (5.24s)")
            }) { Text("Split") }
        }

        Text("Transitions", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[VideoEditor] TRANSITION: Crossfade")
                log("[VideoEditor] Between: clip1 → clip2")
                log("[VideoEditor] Duration: 0.5s")
                log("[VideoEditor] Curve: ease-in-out")
            }) { Text("Crossfade") }

            Button(onClick = {
                log("[VideoEditor] TRANSITION: Dissolve")
                log("[VideoEditor] Between: clip2 → clip3")
                log("[VideoEditor] Duration: 0.8s")
                log("[VideoEditor] Curve: linear")
            }) { Text("Dissolve") }
        }

        Text("Color & Speed", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[VideoEditor] COLOR_GRADE applied:")
                log("  Temperature: +15 (warm)")
                log("  Tint:        -5")
                log("  Saturation:  +20")
                log("  Contrast:    +10")
                log("  Shadows:     +5")
                log("  Highlights:  -10")
                log("[VideoEditor] LUT: \"Cinematic Warm\" applied")
            }) { Text("Color Grade") }

            Button(onClick = {
                log("[VideoEditor] SPEED_RAMP on clip1:")
                log("  0.0s–1.0s:  1.0× (normal)")
                log("  1.0s–2.0s:  0.3× (slow-mo)")
                log("  2.0s–3.0s:  2.0× (fast)")
                log("  3.0s–end:   1.0× (normal)")
                log("[VideoEditor] Frame interpolation: optical flow")
            }) { Text("Speed Ramp") }
        }

        Text("Export Presets", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[VideoEditor] EXPORT preset=Instagram Reel")
                log("[VideoEditor] Resolution: 1080×1920 (9:16)")
                log("[VideoEditor] Codec: H.264, 8 Mbps")
                log("[VideoEditor] Duration limit: 90s")
                log("[VideoEditor] Exporting... 100%")
                log("[VideoEditor] → reel_export.mp4 (18.2 MB)")
            }) { Text("Instagram") }

            Button(onClick = {
                log("[VideoEditor] EXPORT preset=YouTube")
                log("[VideoEditor] Resolution: 3840×2160 (16:9)")
                log("[VideoEditor] Codec: H.265, 45 Mbps")
                log("[VideoEditor] Audio: AAC 320kbps")
                log("[VideoEditor] Exporting... 100%")
                log("[VideoEditor] → youtube_export.mp4 (284 MB)")
            }) { Text("YouTube") }
        }

        Button(onClick = {
            log("[VideoEditor] EXPORT preset=WhatsApp Status")
            log("[VideoEditor] Resolution: 720×1280 (9:16)")
            log("[VideoEditor] Codec: H.264, 3 Mbps")
            log("[VideoEditor] Duration limit: 30s")
            log("[VideoEditor] Max size: 16 MB")
            log("[VideoEditor] Exporting... 100%")
            log("[VideoEditor] → status_export.mp4 (7.8 MB)")
        }) { Text("WhatsApp") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
