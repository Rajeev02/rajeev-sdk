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
fun LocaleDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    // UniFFI JNI API (requires linked .so):
    // val locale = RajeevLocale.create(LocaleConfig(defaultLocale = "en-IN"))
    // val hindi = locale.translate("Hello", "hi")
    // val formatted = locale.formatCurrency(123456.78, "INR")
    // val devanagari = locale.toDevanagariDigits("123456")
    // val transliterated = locale.transliterate("Rajeev", Script.DEVANAGARI)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Locale — Indian Languages & Formatting", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Translation", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Locale] TRANSLATE \"Hello, how are you?\" → hi")
                log("[Locale] → \"नमस्ते, आप कैसे हैं?\"")
                log("[Locale] Confidence: 0.97, engine: local")
            }) { Text("Hindi") }

            Button(onClick = {
                log("[Locale] TRANSLATE \"Hello, how are you?\" → ta")
                log("[Locale] → \"வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?\"")
                log("[Locale] Confidence: 0.94, engine: local")
            }) { Text("Tamil") }

            Button(onClick = {
                log("[Locale] TRANSLATE \"Hello, how are you?\" → te")
                log("[Locale] → \"హలో, మీరు ఎలా ఉన్నారు?\"")
                log("[Locale] Confidence: 0.93, engine: local")
            }) { Text("Telugu") }
        }

        Text("Currency Formatting", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Locale] FORMAT_CURRENCY 123456.78 INR")
            log("[Locale] → ₹1,23,456.78")
            log("[Locale] Grouping: Indian (lakh/crore)")
            log("[Locale] Symbol position: prefix")
            log("[Locale] Decimal separator: .")
        }) { Text("Format ₹1,23,456.78") }

        Text("Devanagari Digits", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Locale] TO_DEVANAGARI \"123456\"")
            log("[Locale] → \"१२३४५६\"")
            log("[Locale] Mapping: 1→१ 2→२ 3→३ 4→४ 5→५ 6→६")
        }) { Text("Convert Digits") }

        Button(onClick = {
            log("[Locale] TO_DEVANAGARI \"₹1,23,456.78\"")
            log("[Locale] → \"₹१,२३,४५६.७८\"")
        }) { Text("Convert Currency Digits") }

        Text("Transliteration", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Locale] TRANSLITERATE \"Rajeev\" → Devanagari")
                log("[Locale] → \"राजीव\"")
            }) { Text("→ देवनागरी") }

            Button(onClick = {
                log("[Locale] TRANSLITERATE \"Mumbai\" → Tamil")
                log("[Locale] → \"மும்பை\"")
            }) { Text("→ தமிழ்") }

            Button(onClick = {
                log("[Locale] TRANSLITERATE \"Hyderabad\" → Telugu")
                log("[Locale] → \"హైదరాబాద్\"")
            }) { Text("→ తెలుగు") }
        }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
