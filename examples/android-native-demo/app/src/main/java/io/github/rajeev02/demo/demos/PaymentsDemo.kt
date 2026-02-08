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
fun PaymentsDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Payments — UPI, Cards & Wallets", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("UPI", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Payments] GENERATE UPI URI:")
            log("  upi://pay?pa=rajeev@okicici&pn=Rajeev%20Joshi&am=999.00&cu=INR&tn=SDK%20Demo")
            log("[Payments] QR generated: 174×174 modules")
        }) { Text("Generate UPI URI") }

        Button(onClick = {
            log("[Payments] VALIDATE VPA: rajeev@okicici")
            log("[Payments] → ✓ Valid")
            log("[Payments] Name: Rajeev Joshi")
            log("[Payments] Bank: ICICI Bank")
            log("[Payments] Handle: @okicici")
        }) { Text("Validate VPA") }

        Text("Card Detection", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Payments] DETECT 4111-XXXX → Visa (Credit)")
                log("[Payments] Issuer: HDFC Bank")
            }) { Text("Visa") }

            Button(onClick = {
                log("[Payments] DETECT 5500-XXXX → Mastercard (Debit)")
                log("[Payments] Issuer: SBI")
            }) { Text("MC") }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Payments] DETECT 6521-XXXX → RuPay (Debit)")
                log("[Payments] Issuer: Bank of Baroda")
                log("[Payments] Network: NPCI domestic")
            }) { Text("RuPay") }

            Button(onClick = {
                log("[Payments] DETECT 3782-XXXX → Amex (Credit)")
                log("[Payments] Issuer: American Express India")
            }) { Text("Amex") }
        }

        Text("Wallets", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Payments] WALLET Paytm → balance: ₹4,230.50")
            }) { Text("Paytm") }

            Button(onClick = {
                log("[Payments] WALLET PhonePe → linked UPI: rajeev@ybl")
            }) { Text("PhonePe") }

            Button(onClick = {
                log("[Payments] WALLET GPay → linked UPI: rajeev@oksbi")
            }) { Text("GPay") }
        }

        Text("Mandate", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Payments] CREATE_MANDATE:")
            log("  Type: UPI Autopay")
            log("  Amount: ₹499/month")
            log("  VPA: rajeev@okicici")
            log("  Start: 2026-03-01")
            log("  End: 2027-02-28")
            log("  Status: PENDING_APPROVAL")
        }) { Text("Create Mandate") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
