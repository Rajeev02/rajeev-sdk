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
fun AuthDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Auth — OTP & Sessions", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("OTP Flow", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Auth] SEND_OTP to +91 98765 43210")
            log("[Auth] Channel: SMS")
            log("[Auth] OTP length: 6 digits")
            log("[Auth] Expires in: 300s")
            log("[Auth] Request ID: otp_req_8f4a2b")
        }) { Text("Send OTP → +91 98765 43210") }

        Button(onClick = {
            log("[Auth] VERIFY_OTP code=924816, reqId=otp_req_8f4a2b")
            log("[Auth] → ✓ Verified")
            log("[Auth] Token issued: eyJhbGciOiJSUzI1NiIs...")
            log("[Auth] Expires: 2026-02-09T12:30:00Z")
        }) { Text("Verify OTP (924816)") }

        Text("Session", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Auth] SESSION_INIT")
                log("[Auth] User: rajeev@example.com")
                log("[Auth] Session ID: sess_7d3f1a")
                log("[Auth] Access token: eyJhbG... (3600s)")
                log("[Auth] Refresh token: rt_9f8e7d... (30d)")
            }) { Text("Init Session") }

            Button(onClick = {
                log("[Auth] AUTH_STATE_CHECK")
                log("[Auth] Authenticated: true")
                log("[Auth] User ID: usr_rajeev_42")
                log("[Auth] Email: rajeev@example.com")
                log("[Auth] Session valid for: 2847s")
            }) { Text("Check State") }
        }

        Text("Providers", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Auth] Available providers:")
            log("  1. SMS OTP (+91)")
            log("  2. WhatsApp OTP")
            log("  3. Google Sign-In")
            log("  4. Apple Sign-In")
            log("  5. Email Magic Link")
            log("  6. Biometric (Fingerprint/Face)")
        }) { Text("List Providers") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
