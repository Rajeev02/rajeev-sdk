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
fun DocumentDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Document — Picker, Editor & Signature", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("File Picker", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Document] PICK source=GALLERY")
                log("[Document] Selected: IMG_20260208_101530.jpg")
                log("[Document] Size: 4032×3024, 3.8 MB")
                log("[Document] MIME: image/jpeg")
            }) { Text("Gallery") }

            Button(onClick = {
                log("[Document] PICK source=CAMERA")
                log("[Document] Captured: DOC_20260208_123045.jpg")
                log("[Document] Auto-crop: detected A4 edges")
                log("[Document] Enhanced: contrast +20, sharpen +15")
            }) { Text("Camera") }

            Button(onClick = {
                log("[Document] PICK source=FILES")
                log("[Document] Selected: contract_v3.pdf")
                log("[Document] Size: 14 pages, 2.1 MB")
                log("[Document] MIME: application/pdf")
            }) { Text("Files") }
        }

        Text("PDF Editor", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Document] HIGHLIGHT page=3, rect=(120,340,480,360)")
                log("[Document] Color: yellow, opacity: 40%")
                log("[Document] Text: \"Payment terms: Net 30 days\"")
            }) { Text("Highlight") }

            Button(onClick = {
                log("[Document] STAMP page=1, position=TOP_RIGHT")
                log("[Document] Type: CONFIDENTIAL")
                log("[Document] Color: red, rotation: -15°")
                log("[Document] Size: 180×48 px")
            }) { Text("Stamp") }
        }

        Button(onClick = {
            log("[Document] ADD_NOTE page=5, position=(350, 220)")
            log("[Document] Note: \"Review clause 4.2 with legal team\"")
            log("[Document] Author: Rajeev Joshi")
            log("[Document] Date: 2026-02-08")
        }) { Text("Add Note") }

        Text("Signature", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Document] SIGNATURE mode=DRAWN")
                log("[Document] Stroke points: 847")
                log("[Document] Smoothing: cubic bezier interpolation")
                log("[Document] Color: #1A1A2E, width: 2.5pt")
                log("[Document] Preview: ✓ signature captured")
            }) { Text("Draw Signature") }

            Button(onClick = {
                log("[Document] SIGNATURE mode=TYPED")
                log("[Document] Text: \"Rajeev Joshi\"")
                log("[Document] Font: Dancing Script, 28pt")
                log("[Document] Color: #1A1A2E")
            }) { Text("Type Signature") }
        }

        Text("Place on Document", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Document] PLACE_SIGNATURE")
            log("[Document] Page: 14 (last page)")
            log("[Document] Position: (320, 680) — signature field detected")
            log("[Document] Scale: 1.2×")
            log("[Document] Timestamp: 2026-02-08T12:30:45+05:30")
            log("[Document] → Saved: contract_v3_signed.pdf")
        }) { Text("Place on Document") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
