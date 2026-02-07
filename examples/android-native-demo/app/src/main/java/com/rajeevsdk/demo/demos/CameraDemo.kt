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
fun CameraDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Camera — Capture & Editing", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Capture Modes", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { log("[Camera] Mode → PHOTO (12MP, 4032×3024)") }) { Text("Photo") }
            Button(onClick = { log("[Camera] Mode → VIDEO (4K@30fps, H.265)") }) { Text("Video") }
            Button(onClick = { log("[Camera] Mode → PORTRAIT (f/1.8 bokeh sim)") }) { Text("Portrait") }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { log("[Camera] Mode → PANORAMA (270° stitch)") }) { Text("Panorama") }
            Button(onClick = { log("[Camera] Mode → NIGHT (multi-frame, 3s exposure)") }) { Text("Night") }
            Button(onClick = { log("[Camera] Mode → BURST (10fps, 20 frames)") }) { Text("Burst") }
        }

        Text("Controls", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Camera] Flash: AUTO → ON → OFF → AUTO")
                log("[Camera] Current: ON")
            }) { Text("Flash") }

            Button(onClick = {
                log("[Camera] HDR: enabled")
                log("[Camera] Bracket exposures: -2EV, 0EV, +2EV")
            }) { Text("HDR") }

            Button(onClick = {
                log("[Camera] Zoom: 1.0× → 2.0× → 5.0× → 10.0×")
                log("[Camera] Current: 2.0× (optical)")
            }) { Text("Zoom") }
        }

        Text("Capture", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Camera] 📸 CAPTURED")
                log("[Camera] File: IMG_20260208_123045.heic")
                log("[Camera] Size: 4032×3024 (3.2 MB)")
                log("[Camera] EXIF: f/1.8, 1/120s, ISO 100")
            }) { Text("Capture Photo") }

            Button(onClick = {
                log("[Camera] 🎥 RECORDING started")
                log("[Camera] Format: H.265 4K@30fps + AAC 48kHz")
                log("[Camera] Timer: 00:00:00")
                log("[Camera] ... 00:00:15 (32 MB)")
                log("[Camera] 🎥 RECORDING stopped → VID_20260208_123100.mp4")
            }) { Text("Record Video") }
        }

        Text("Filters", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Camera] Available filters:")
            log("  • Original • Vivid • Warm • Cool")
            log("  • Mono • Noir • Dramatic • Silvertone")
            log("  • Fade • Chrome • Process • Transfer")
            log("[Camera] Applied: Vivid (GPU shader, 2ms)")
        }) { Text("List Filters") }

        Text("Editor Adjustments", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Camera] Editor adjustments:")
            log("  Brightness:  +15")
            log("  Contrast:    +10")
            log("  Saturation:  +20")
            log("  Sharpness:   +8")
            log("  Vignette:    30%")
            log("  Crop:        16:9")
            log("[Camera] Preview updated (GPU, 4ms)")
        }) { Text("Apply Adjustments") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
