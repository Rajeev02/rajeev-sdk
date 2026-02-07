package com.rajeevsdk.demo.demos

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun UIDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    val colors = listOf(
        "Primary" to Color(0xFF6750A4),
        "On Primary" to Color(0xFFFFFFFF),
        "Primary Container" to Color(0xFFEADDFF),
        "Secondary" to Color(0xFF625B71),
        "Tertiary" to Color(0xFF7D5260),
        "Error" to Color(0xFFB3261E),
        "Surface" to Color(0xFFFFFBFE),
        "Inverse" to Color(0xFF313033),
        "Success" to Color(0xFF198754),
        "Warning" to Color(0xFFFFC107),
        "Info" to Color(0xFF0DCAF0),
        "Accent" to Color(0xFFFF5722),
    )

    val spacings = listOf(4, 8, 12, 16, 20, 24, 32, 40, 48, 64)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("UI — Design Tokens", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Color Swatches (12)", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)

        // Color grid: 3 per row
        for (row in colors.chunked(3)) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                for ((name, color) in row) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.weight(1f)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(color)
                        )
                        Text(
                            name,
                            style = MaterialTheme.typography.labelSmall,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }

        Button(onClick = {
            log("[UI] Color tokens loaded: 12")
            colors.forEach { (name, color) ->
                val hex = String.format("#%06X", 0xFFFFFF and color.hashCode())
                log("  $name: $hex")
            }
        }) { Text("Log Colors") }

        Spacer(modifier = Modifier.height(8.dp))
        Text("Spacing Scale", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)

        for (sp in spacings) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "${sp}dp",
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.width(40.dp)
                )
                Box(
                    modifier = Modifier
                        .height(12.dp)
                        .width(sp.dp * 3)
                        .clip(RoundedCornerShape(2.dp))
                        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.6f))
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))
        Text("Typography Scale", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)

        Text("Display Large (57sp)", style = MaterialTheme.typography.displayLarge.copy(fontSize = 28.sp))
        Text("Display Medium (45sp)", style = MaterialTheme.typography.displayMedium.copy(fontSize = 24.sp))
        Text("Headline Large (32sp)", style = MaterialTheme.typography.headlineLarge.copy(fontSize = 22.sp))
        Text("Headline Medium (28sp)", style = MaterialTheme.typography.headlineMedium)
        Text("Title Large (22sp)", style = MaterialTheme.typography.titleLarge)
        Text("Title Medium (16sp)", style = MaterialTheme.typography.titleMedium)
        Text("Body Large (16sp)", style = MaterialTheme.typography.bodyLarge)
        Text("Body Medium (14sp)", style = MaterialTheme.typography.bodyMedium)
        Text("Label Large (14sp)", style = MaterialTheme.typography.labelLarge)
        Text("Label Small (11sp)", style = MaterialTheme.typography.labelSmall)

        Spacer(modifier = Modifier.height(8.dp))
        Text("Device Info", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[UI] Device Info:")
            log("  Platform:       Android")
            log("  API Level:      35")
            log("  Density:        3.0× (xxhdpi)")
            log("  Screen:         1080×2400 px")
            log("  Dark mode:      system")
            log("  Dynamic color:  supported")
            log("  Font scale:     1.0×")
            log("  Layout dir:     LTR")
        }) { Text("Show Device Info") }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
