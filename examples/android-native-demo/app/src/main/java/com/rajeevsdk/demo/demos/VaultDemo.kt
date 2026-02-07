package com.rajeevsdk.demo.demos

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun VaultDemo() {
    val logs = remember { mutableStateListOf<String>() }
    fun log(msg: String) { logs.add(msg) }

    // UniFFI JNI API (requires linked .so):
    // val vault = RajeevVault.create(VaultConfig("demo", Encryption.AES_256_GCM))
    // vault.set("token", "abc123")
    // val value = vault.get("token")
    // vault.setNamespace("user_prefs")
    // vault.setJson("profile", mapOf("name" to "Rajeev", "city" to "Mumbai"))
    // val hash = vault.hash("password123")
    // val valid = vault.verify("password123", hash)
    // val key = vault.generateKey(KeyType.AES_256)
    // vault.setWithExpiry("otp", "924816", Duration.ofMinutes(5))
    // vault.wipe()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Vault — Encrypted Storage", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        Text("Lifecycle", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Vault] Created vault: config=AES_256_GCM, namespace=\"demo\"")
                log("[Vault] Storage path: /data/data/com.rajeevsdk.demo/vault.db")
            }) { Text("Create Vault") }

            Button(onClick = {
                log("[Vault] ⚠ Vault wiped — all data destroyed")
            }) { Text("Wipe") }
        }

        Text("Key-Value Operations", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Vault] SET \"auth_token\" = \"eyJhbGciOiJBMjU2R0NNIiwidHlwIjoiSld...\" (encrypted)")
            }) { Text("Set Key") }

            Button(onClick = {
                log("[Vault] GET \"auth_token\" → \"eyJhbGciOiJBMjU2R0NNIiwidHlwIjoiSld...\"")
                log("[Vault] Decrypted in 0.3ms")
            }) { Text("Get Key") }
        }

        Text("Namespaces", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Vault] Namespace → \"user_prefs\"")
                log("[Vault] SET \"theme\" = \"dark\"")
                log("[Vault] SET \"language\" = \"hi-IN\"")
            }) { Text("User Prefs NS") }

            Button(onClick = {
                log("[Vault] Namespace → \"session\"")
                log("[Vault] SET \"refresh_token\" = \"rt_9f8e7d...\" (encrypted)")
            }) { Text("Session NS") }
        }

        Text("JSON Storage", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Button(onClick = {
            log("[Vault] SET_JSON \"profile\" = {")
            log("  \"name\": \"Rajeev Joshi\",")
            log("  \"city\": \"Mumbai\",")
            log("  \"plan\": \"premium\"")
            log("}")
            log("[Vault] Serialized + encrypted: 184 bytes")
        }) { Text("Store JSON") }

        Text("Crypto", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Vault] HASH \"password123\" → \"\$argon2id\$v=19\$m=65536,t=3,p=4\$...\"")
                log("[Vault] Cost: 42ms")
            }) { Text("Hash") }

            Button(onClick = {
                log("[Vault] VERIFY password against stored hash → ✓ Match")
            }) { Text("Verify") }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                log("[Vault] GENERATE_KEY type=AES_256 → 32 bytes generated")
                log("[Vault] Key ID: vk_a1b2c3d4")
            }) { Text("Key Gen") }

            Button(onClick = {
                log("[Vault] SET_EXPIRY \"otp\" = \"924816\", ttl=300s")
                log("[Vault] Auto-purge scheduled at ${System.currentTimeMillis() / 1000 + 300}")
            }) { Text("Set w/ Expiry") }
        }

        LogOutput(logs)

        Button(onClick = { logs.clear() }) { Text("Clear Log") }
    }
}
