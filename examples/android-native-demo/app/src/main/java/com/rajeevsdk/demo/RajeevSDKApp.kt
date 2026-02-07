package com.rajeevsdk.demo

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.rajeevsdk.demo.demos.*

data class LibraryItem(
    val name: String,
    val route: String,
    val subtitle: String,
)

val rustCoreLibraries = listOf(
    LibraryItem("Vault", "vault", "Encrypted key-value store via UniFFI JNI"),
    LibraryItem("Network", "network", "Priority queue & HTTP cache via UniFFI JNI"),
    LibraryItem("Sync", "sync", "CRDT conflict-free sync via UniFFI JNI"),
    LibraryItem("Locale", "locale", "Indian locale & translation via UniFFI JNI"),
)

val tsModuleLibraries = listOf(
    LibraryItem("Auth", "auth", "OTP login, sessions, providers"),
    LibraryItem("Payments", "payments", "UPI, cards, wallets, mandates"),
    LibraryItem("Camera", "camera", "Capture modes, filters, editor"),
    LibraryItem("DeepLink", "deeplink", "URL router & deferred links"),
    LibraryItem("Document", "document", "Picker, PDF editor, signature"),
    LibraryItem("Edge-AI", "edge_ai", "OCR, on-device ML, voice"),
    LibraryItem("Media", "media", "HLS player, DRM, downloads"),
    LibraryItem("Video Editor", "video_editor", "Timeline, transitions, export"),
    LibraryItem("App Shell", "app_shell", "API, onboarding, cart, forms"),
    LibraryItem("Notify", "notify", "Scheduled & inbox notifications"),
    LibraryItem("UI", "ui", "Design tokens, typography, colors"),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RajeevSDKApp() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    val title = when (currentRoute) {
        "home" -> "Rajeev SDK"
        else -> {
            val all = rustCoreLibraries + tsModuleLibraries
            all.find { it.route == currentRoute }?.name ?: "Rajeev SDK"
        }
    }

    MaterialTheme(colorScheme = dynamicColorSchemeOrDefault()) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text(title) },
                    navigationIcon = {
                        if (currentRoute != "home" && currentRoute != null) {
                            IconButton(onClick = { navController.popBackStack() }) {
                                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                            }
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    )
                )
            }
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = "home",
                modifier = Modifier.padding(innerPadding)
            ) {
                composable("home") { HomeScreen(navController) }
                composable("vault") { VaultDemo() }
                composable("network") { NetworkDemo() }
                composable("sync") { SyncDemo() }
                composable("locale") { LocaleDemo() }
                composable("auth") { AuthDemo() }
                composable("payments") { PaymentsDemo() }
                composable("camera") { CameraDemo() }
                composable("deeplink") { DeepLinkDemo() }
                composable("document") { DocumentDemo() }
                composable("edge_ai") { EdgeAIDemo() }
                composable("media") { MediaDemo() }
                composable("video_editor") { VideoEditorDemo() }
                composable("app_shell") { AppShellDemo() }
                composable("notify") { NotifyDemo() }
                composable("ui") { UIDemo() }
            }
        }
    }
}

@Composable
fun dynamicColorSchemeOrDefault(): ColorScheme {
    return MaterialTheme.colorScheme
}

@Composable
fun HomeScreen(navController: NavHostController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        item {
            Text(
                "Rust Core (UniFFI JNI)",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        items(rustCoreLibraries) { lib ->
            LibraryCard(lib) { navController.navigate(lib.route) }
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                "TypeScript Modules",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        items(tsModuleLibraries) { lib ->
            LibraryCard(lib) { navController.navigate(lib.route) }
        }
    }
}

@Composable
fun LibraryCard(library: LibraryItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        )
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    library.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    library.subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Text("→", style = MaterialTheme.typography.titleLarge)
        }
    }
}
