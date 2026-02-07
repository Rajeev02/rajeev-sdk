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
fun EdgeAIDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Edge-AI — On-Device ML", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("OCR Detection", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Edge-AI] OCR_DETECT document=AADHAAR_FRONT")
            log("[Edge-AI] Confidence: 0.98")
            log("[Edge-AI] Fields detected:")
            log("  Name:     Rajeev Kumar Joshi")
            log("  DOB:      15/08/1992")
            log("  Gender:   Male")
            log("  Aadhaar:  XXXX XXXX 4829")
            log("[Edge-AI] Processing: 124ms (GPU delegate)")
        }) { Text("Aadhaar Front") }

        Button(onClick = {
            log("[Edge-AI] OCR_DETECT document=PAN_CARD")
            log("[Edge-AI] Confidence: 0.96")
            log("[Edge-AI] Fields detected:")
            log("  Name:      RAJEEV KUMAR JOSHI")
            log("  Father:    SURESH JOSHI")
            log("  DOB:       15/08/1992")
            log("  PAN:       ABCDE1234F")
            log("[Edge-AI] Processing: 98ms (GPU delegate)")
        }) { Text("PAN Card") }

        Button(onClick = {
            log("[Edge-AI] OCR_DETECT document=DRIVING_LICENSE")
            log("[Edge-AI] Confidence: 0.94")
            log("[Edge-AI] Fields detected:")
            log("  Name:     Rajeev Kumar Joshi")
            log("  DL No:    MH-01-2014-0029481")
            log("  Valid:    2014-2034")
            log("  Class:    LMV, MCWG")
        }) { Text("Driving License") }

        Text("Extract & Validate", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Edge-AI] VALIDATE Aadhaar: XXXX XXXX 4829")
                log("[Edge-AI] Verhoeff checksum: ✓ Valid")
                log("[Edge-AI] Format: ✓ 12 digits")
            }) { Text("Validate Aadhaar") }

            Button(onClick = {
                log("[Edge-AI] VALIDATE PAN: ABCDE1234F")
                log("[Edge-AI] Format: ✓ [A-Z]{5}[0-9]{4}[A-Z]")
                log("[Edge-AI] Type: Individual (4th char = E)")
            }) { Text("Validate PAN") }
        }

        Text("TFLite Model Management", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Edge-AI] REGISTER model: aadhaar_ocr_v3.tflite")
            log("[Edge-AI] Size: 12.4 MB")
            log("[Edge-AI] Input: [1, 640, 480, 3] float32")
            log("[Edge-AI] Output: [1, 50, 128] float32 (text)")
            log("[Edge-AI] Delegate: GPU (fallback: NNAPI → CPU)")
        }) { Text("Register Model") }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Edge-AI] LOAD model: aadhaar_ocr_v3.tflite")
                log("[Edge-AI] Interpreter created, 4 threads")
                log("[Edge-AI] Warm-up inference: 45ms")
                log("[Edge-AI] Ready for inference")
            }) { Text("Load") }

            Button(onClick = {
                log("[Edge-AI] UNLOAD model: aadhaar_ocr_v3.tflite")
                log("[Edge-AI] Memory freed: 48 MB")
                log("[Edge-AI] Interpreter destroyed")
            }) { Text("Unload") }
        }

        Text("Voice Intent", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Edge-AI] VOICE_PARSE: \"मुझे कल सुबह दस बजे अलार्म लगाओ\"")
            log("[Edge-AI] Language: Hindi (hi-IN)")
            log("[Edge-AI] Intent: SET_ALARM")
            log("[Edge-AI] Entities:")
            log("  time:  10:00 AM")
            log("  date:  tomorrow (2026-02-09)")
            log("[Edge-AI] Confidence: 0.92")
        }) { Text("Parse Voice Intent") }

        Text("Supported Languages", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Edge-AI] Supported Indian languages (11):")
            log("  1. Hindi (hi)")
            log("  2. Tamil (ta)")
            log("  3. Telugu (te)")
            log("  4. Bengali (bn)")
            log("  5. Marathi (mr)")
            log("  6. Gujarati (gu)")
            log("  7. Kannada (kn)")
            log("  8. Malayalam (ml)")
            log("  9. Odia (or)")
            log("  10. Punjabi (pa)")
            log("  11. Assamese (as)")
        }) { Text("List Languages") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
