// ============================================================
// CampusConnect Android — Jetpack Compose Native App
// Demonstrates @rajeev02/* SDK libraries in a native Android context
// ============================================================
//
// SETUP:
//   1. Create new Android Studio project → Empty Compose Activity
//   2. Copy this file as MainActivity.kt
//   3. Add Gradle dependencies for @rajeev02/* packages
//   4. Min SDK 26, Target SDK 35, Kotlin 2.0+
//
// SDK Libraries Used (all 15):
//   @rajeev02/vault, network, sync, locale, auth, notify, ui,
//   app-shell, payments, camera, deeplink, document, edge-ai,
//   media, video-editor
// ============================================================

package com.rajeevsdk.campusconnect

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.NumberFormat
import java.util.Locale

// ─── Theme ────────────────────────────────────────────────
object CampusColors {
    val Primary = Color(0xFF1A237E)
    val PrimaryLight = Color(0xFF534BAE)
    val PrimaryBg = Color(0xFFE8EAF6)
    val Secondary = Color(0xFFFF6F00)
    val Success = Color(0xFF2E7D32)
    val Error = Color(0xFFC62828)
    val Warning = Color(0xFFF57F17)
    val Background = Color(0xFFF5F5F5)
    val Surface = Color.White
    val TextPrimary = Color(0xFF1A1A2E)
    val TextSecondary = Color(0xFF666666)
    val TextLight = Color(0xFF999999)
    val Border = Color(0xFFE0E0E0)
}

// ─── Models ───────────────────────────────────────────────
data class Student(
    val id: String = "STU-2024-001",
    val name: String = "Rajeev Joshi",
    val email: String = "rajeev@university.edu",
    val phone: String = "+91 98765 43210",
    val rollNo: String = "CS-2024-042",
    val department: String = "Computer Science",
    val semester: Int = 6,
    val cgpa: Double = 8.7,
    val year: String = "3rd Year",
    val bloodGroup: String = "O+",
    val emergencyContact: String = "+91 99887 76655"
)

data class ClassEntry(
    val id: Int, val subject: String, val code: String,
    val time: String, val room: String, val professor: String,
    val day: String, val type: String
)

data class FeeItem(
    val id: Int, val label: String, val amount: Int, val status: String
)

data class CampusEvent(
    val id: Int, val title: String, val date: String, val venue: String,
    val type: String, val emoji: String, val spots: Int, val registered: Int, val fee: Int
)

data class NotificationItem(
    val id: Int, val title: String, val body: String,
    val type: String, val time: String, val read: Boolean
)

// ─── Mock Data ────────────────────────────────────────────
val student = Student()

val timetable = listOf(
    ClassEntry(1, "Data Structures & Algorithms", "CS301", "09:00 AM", "LH-201", "Dr. Sharma", "Mon", "Lecture"),
    ClassEntry(2, "Operating Systems Lab", "CS302L", "11:00 AM", "Lab-3", "Prof. Patel", "Mon", "Lab"),
    ClassEntry(3, "Database Management", "CS303", "02:00 PM", "LH-105", "Dr. Gupta", "Mon", "Lecture"),
    ClassEntry(4, "Computer Networks", "CS304", "09:00 AM", "LH-301", "Dr. Kumar", "Tue", "Lecture"),
    ClassEntry(5, "Software Engineering", "CS305", "11:00 AM", "LH-202", "Prof. Singh", "Tue", "Lecture"),
    ClassEntry(6, "DSA Lab", "CS301L", "02:00 PM", "Lab-1", "Dr. Sharma", "Wed", "Lab"),
    ClassEntry(7, "Mathematics III", "MA301", "09:00 AM", "LH-101", "Dr. Verma", "Thu", "Lecture"),
    ClassEntry(8, "Elective: AI/ML Basics", "CS390", "02:00 PM", "LH-401", "Dr. Iyer", "Fri", "Elective"),
)

val fees = listOf(
    FeeItem(1, "Tuition Fee", 35000, "paid"),
    FeeItem(2, "Lab Fee", 5000, "paid"),
    FeeItem(3, "Library Fee", 2000, "pending"),
    FeeItem(4, "Hostel Fee", 45000, "pending"),
    FeeItem(5, "Exam Fee", 3000, "upcoming"),
)

val events = listOf(
    CampusEvent(1, "Annual Tech Fest — TechSpark 2025", "Feb 15-17", "Main Auditorium", "Tech", "🚀", 500, 342, 0),
    CampusEvent(2, "Hackathon: Build for Bharat", "Feb 22-23", "Innovation Lab", "Hackathon", "💻", 100, 78, 200),
    CampusEvent(3, "Cultural Night — Rang Tarang", "Mar 1", "Open Air Theatre", "Cultural", "🎭", 1000, 650, 0),
    CampusEvent(4, "Workshop: React Native", "Mar 15", "CS Lab-3", "Workshop", "📱", 60, 38, 150),
)

val notifications = listOf(
    NotificationItem(1, "DSA Assignment Due Tomorrow", "Submit linked list implementation by 11:59 PM", "deadline", "2h ago", false),
    NotificationItem(2, "Fee Payment Reminder", "Semester 6 fees of ₹45,000 due by Jan 31", "payment", "5h ago", false),
    NotificationItem(3, "Class Cancelled: OS Lab", "Prof. Patel on leave. Rescheduled to Friday", "class", "Yesterday", true),
    NotificationItem(4, "TechSpark Registration Open", "Register for 10+ events. Early bird until Feb 1", "event", "Yesterday", true),
)

// ─── Helpers ──────────────────────────────────────────────
fun formatINR(amount: Int): String {
    val formatter = NumberFormat.getCurrencyInstance(Locale("en", "IN"))
    formatter.maximumFractionDigits = 0
    return formatter.format(amount)
}

// ─── Activity ─────────────────────────────────────────────
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CampusConnectTheme {
                CampusConnectApp()
            }
        }
    }
}

@Composable
fun CampusConnectTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = CampusColors.Primary,
            secondary = CampusColors.Secondary,
            background = CampusColors.Background,
            surface = CampusColors.Surface,
            error = CampusColors.Error,
        ),
        content = content
    )
}

// ─── App Root ─────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CampusConnectApp() {
    var isLoggedIn by remember { mutableStateOf(false) }

    if (!isLoggedIn) {
        LoginScreen(onLogin = { isLoggedIn = true })
    } else {
        MainScreen(onLogout = { isLoggedIn = false })
    }
}

// ─── Login Screen ─────────────────────────────────────────
@Composable
fun LoginScreen(onLogin: () -> Unit) {
    var phone by remember { mutableStateOf("") }
    var otpSent by remember { mutableStateOf(false) }
    var otp by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.linearGradient(listOf(CampusColors.Primary, CampusColors.PrimaryLight))),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.padding(24.dp).fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)
        ) {
            Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("🎓", fontSize = 48.sp)
                Spacer(Modifier.height(8.dp))
                Text("CampusConnect", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                Text("Sign in to your college", color = CampusColors.TextSecondary, fontSize = 14.sp)
                Spacer(Modifier.height(24.dp))

                if (!otpSent) {
                    OutlinedTextField(
                        value = phone, onValueChange = { phone = it },
                        label = { Text("📱 Phone Number") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    SdkTag("@rajeev02/auth + vault")
                    Spacer(Modifier.height(16.dp))
                    Button(onClick = { otpSent = true }, modifier = Modifier.fillMaxWidth()) {
                        Text("Send OTP →")
                    }
                    Spacer(Modifier.height(12.dp))
                    Text("or", color = CampusColors.TextLight)
                    Spacer(Modifier.height(12.dp))
                    OutlinedButton(onClick = onLogin, modifier = Modifier.fillMaxWidth()) {
                        Text("🔐 Google Sign-In")
                    }
                } else {
                    OutlinedTextField(
                        value = otp, onValueChange = { otp = it },
                        label = { Text("🔑 Enter OTP") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    SdkTag("@rajeev02/auth + vault + notify")
                    Spacer(Modifier.height(16.dp))
                    Button(onClick = onLogin, modifier = Modifier.fillMaxWidth()) {
                        Text("Verify & Sign In →")
                    }
                }
            }
        }
    }
}

// ─── Main Screen with Bottom Nav ──────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(onLogout: () -> Unit) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = CampusColors.Surface) {
                listOf(
                    Triple("Home", Icons.Default.Home, 0),
                    Triple("Classes", Icons.Default.DateRange, 1),
                    Triple("Fees", Icons.Default.AccountBalanceWallet, 2),
                    Triple("Campus", Icons.Default.School, 3),
                    Triple("Profile", Icons.Default.Person, 4),
                ).forEach { (label, icon, index) ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        icon = { Icon(icon, label) },
                        label = { Text(label, fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = CampusColors.Primary,
                            selectedTextColor = CampusColors.Primary,
                        )
                    )
                }
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding).background(CampusColors.Background)) {
            when (selectedTab) {
                0 -> DashboardScreen()
                1 -> TimetableScreen()
                2 -> FeesScreen()
                3 -> CampusScreen()
                4 -> ProfileScreen(onLogout)
            }
        }
    }
}

// ─── Dashboard Screen ─────────────────────────────────────
@Composable
fun DashboardScreen() {
    val todayClasses = timetable.filter { it.day == "Mon" }
    val pendingFees = fees.filter { it.status == "pending" }.sumOf { it.amount }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Greeting
        item {
            Column {
                Text("Good Morning 👋", color = CampusColors.TextSecondary, fontSize = 14.sp)
                Text(student.name, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Stats Grid
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                StatCard("📚", "${todayClasses.size}", "Classes Today", "sync", Modifier.weight(1f))
                StatCard("💰", formatINR(pendingFees), "Fees Pending", "payments", Modifier.weight(1f))
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                StatCard("🔔", "2", "Unread Alerts", "notify", Modifier.weight(1f))
                StatCard("📊", "${student.cgpa}", "Current CGPA", "network", Modifier.weight(1f))
            }
        }

        // Today's Classes
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("📅 Today's Classes", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(Modifier.weight(1f))
                        SdkTag("@rajeev02/sync")
                    }
                    Spacer(Modifier.height(12.dp))
                    todayClasses.forEach { cls ->
                        ClassRow(cls)
                        if (cls != todayClasses.last()) HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                    }
                }
            }
        }

        // Quick Actions
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("⚡ Quick Actions", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        QuickActionChip("📝", "Notes", "document", Modifier.weight(1f))
                        QuickActionChip("💳", "Pay", "payments", Modifier.weight(1f))
                        QuickActionChip("🪪", "ID", "vault", Modifier.weight(1f))
                    }
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        QuickActionChip("🎧", "Lectures", "media", Modifier.weight(1f))
                        QuickActionChip("🎉", "Events", "deeplink", Modifier.weight(1f))
                        QuickActionChip("🧠", "AI Quiz", "edge-ai", Modifier.weight(1f))
                    }
                }
            }
        }

        // Notifications Preview
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🔔 Notifications", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(Modifier.weight(1f))
                        SdkTag("@rajeev02/notify")
                    }
                    Spacer(Modifier.height(8.dp))
                    notifications.take(3).forEach { notif ->
                        NotifRow(notif)
                    }
                }
            }
        }
    }
}

// ─── Timetable Screen ─────────────────────────────────────
@Composable
fun TimetableScreen() {
    var selectedDay by remember { mutableStateOf("Mon") }
    val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri")

    Column(modifier = Modifier.fillMaxSize()) {
        // Day selector
        ScrollableTabRow(
            selectedTabIndex = days.indexOf(selectedDay),
            containerColor = CampusColors.Surface,
            contentColor = CampusColors.Primary,
        ) {
            days.forEach { day ->
                Tab(
                    selected = selectedDay == day,
                    onClick = { selectedDay = day },
                    text = { Text(day, fontWeight = if (selectedDay == day) FontWeight.Bold else FontWeight.Normal) }
                )
            }
        }

        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            val filtered = timetable.filter { it.day == selectedDay }
            if (filtered.isEmpty()) {
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(48.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("😴", fontSize = 48.sp)
                        Text("No classes!", color = CampusColors.TextSecondary)
                    }
                }
            }
            items(filtered) { cls ->
                Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                    ClassRow(cls)
                }
            }
            item { SdkTag("@rajeev02/sync + network + locale") }
        }
    }
}

// ─── Fees Screen ──────────────────────────────────────────
@Composable
fun FeesScreen() {
    val pendingTotal = fees.filter { it.status == "pending" }.sumOf { it.amount }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Total Card
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Brush.horizontalGradient(listOf(CampusColors.Primary, CampusColors.PrimaryLight)))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Total Pending", color = Color.White.copy(alpha = 0.8f), fontSize = 14.sp)
                        Text(formatINR(pendingTotal), color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.ExtraBold)
                        SdkTag("@rajeev02/payments + locale")
                    }
                }
            }
        }

        // Fee Items
        items(fees) { fee ->
            Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Row(
                    modifier = Modifier.padding(16.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(fee.label, fontWeight = FontWeight.SemiBold)
                        Text(
                            fee.status.replaceFirstChar { it.uppercase() },
                            fontSize = 12.sp,
                            color = when (fee.status) {
                                "paid" -> CampusColors.Success
                                "pending" -> CampusColors.Warning
                                else -> CampusColors.Error
                            }
                        )
                    }
                    Text(formatINR(fee.amount), fontWeight = FontWeight.Bold, modifier = Modifier.padding(end = 12.dp))
                    if (fee.status != "paid") {
                        Button(
                            onClick = { },
                            colors = ButtonDefaults.buttonColors(containerColor = CampusColors.Primary),
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                        ) { Text("Pay", fontSize = 12.sp) }
                    }
                }
            }
        }
    }
}

// ─── Campus Screen (Events + ID Card) ─────────────────────
@Composable
fun CampusScreen() {
    var showIdCard by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // ID Card Banner
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                onClick = { showIdCard = !showIdCard }
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Brush.horizontalGradient(listOf(CampusColors.Primary, CampusColors.PrimaryLight)))
                        .padding(20.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("👨‍🎓", fontSize = 36.sp)
                        Spacer(Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Digital ID Card", color = Color.White, fontWeight = FontWeight.Bold)
                            Text("Tap to ${if (showIdCard) "hide" else "view"} · @rajeev02/vault",
                                color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)
                        }
                        Icon(Icons.Default.ChevronRight, null, tint = Color.White.copy(alpha = 0.6f))
                    }
                }
            }
        }

        // ID Card Detail
        if (showIdCard) {
            item {
                Card(shape = RoundedCornerShape(16.dp)) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Brush.linearGradient(listOf(CampusColors.Primary, CampusColors.PrimaryLight)))
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("RAJEEV NATIONAL UNIVERSITY", color = Color.White.copy(alpha = 0.7f), fontSize = 10.sp, letterSpacing = 2.sp)
                            Spacer(Modifier.height(12.dp))
                            Text("👨‍🎓", fontSize = 48.sp)
                            Text(student.name, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                            Text(student.department, color = Color.White.copy(alpha = 0.8f), fontSize = 14.sp)
                            Spacer(Modifier.height(12.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Roll No", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                                    Text(student.rollNo, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Semester", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                                    Text("${student.semester}", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Year", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                                    Text(student.year, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                            }
                            Spacer(Modifier.height(12.dp))
                            Text("||||| ${student.id} |||||", color = Color.White, fontFamily = FontFamily.Monospace, fontSize = 14.sp)
                        }
                    }
                }
            }
        }

        // Events Header
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🎉 Campus Events", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(Modifier.weight(1f))
                SdkTag("@rajeev02/deeplink")
            }
        }

        // Events
        items(events) { event ->
            Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.Top) {
                    Text(event.emoji, fontSize = 32.sp)
                    Spacer(Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(event.title, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Spacer(Modifier.height(4.dp))
                        Text("📅 ${event.date} · 📍 ${event.venue}", fontSize = 12.sp, color = CampusColors.TextSecondary)
                        Spacer(Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Badge(event.type, CampusColors.PrimaryBg, CampusColors.Primary)
                            if (event.fee > 0) Badge(formatINR(event.fee), Color(0xFFFFF3E0), CampusColors.Warning)
                            Spacer(Modifier.weight(1f))
                            Text("${event.registered}/${event.spots}", fontSize = 11.sp, color = CampusColors.TextLight)
                        }
                        Spacer(Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = {},
                                enabled = event.registered < event.spots,
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = CampusColors.Primary)
                            ) { Text(if (event.registered >= event.spots) "Full" else "Register", fontSize = 12.sp) }
                            OutlinedButton(
                                onClick = {},
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp)
                            ) { Text("🔗 Share", fontSize = 12.sp) }
                        }
                    }
                }
            }
        }
    }
}

// ─── Profile Screen ───────────────────────────────────────
@Composable
fun ProfileScreen(onLogout: () -> Unit) {
    var darkMode by remember { mutableStateOf(false) }
    var hindi by remember { mutableStateOf(false) }
    var biometric by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Profile Card
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("👨‍🎓", fontSize = 48.sp)
                    Text(student.name, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Text(student.email, color = CampusColors.TextSecondary, fontSize = 13.sp)
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Badge(student.department, CampusColors.PrimaryBg, CampusColors.Primary)
                        Badge("Sem ${student.semester}", Color(0xFFFFF3E0), CampusColors.Warning)
                    }
                }
            }
        }

        // Settings
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("⚙️ Preferences", fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(12.dp))
                    SettingToggle("🌐", "Language: ${if (hindi) "हिंदी" else "English"}", "@rajeev02/locale", hindi) { hindi = it }
                    SettingToggle("🌙", "Dark Mode", "@rajeev02/ui", darkMode) { darkMode = it }
                    SettingToggle("🔐", "Biometric Lock", "@rajeev02/auth", biometric) { biometric = it }
                }
            }
        }

        // Feature Flags
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🚩 Feature Flags", fontWeight = FontWeight.Bold)
                        Spacer(Modifier.weight(1f))
                        SdkTag("@rajeev02/app-shell")
                    }
                    Spacer(Modifier.height(8.dp))
                    listOf("ai_study_assistant" to true, "video_notes" to true, "campus_map_3d" to false, "peer_tutoring" to false)
                        .forEach { (name, enabled) ->
                            Row(modifier = Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text(name, fontFamily = FontFamily.Monospace, fontSize = 13.sp, modifier = Modifier.weight(1f))
                                Badge(if (enabled) "ON" else "OFF",
                                    if (enabled) Color(0xFFE8F5E9) else Color(0xFFFFEBEE),
                                    if (enabled) CampusColors.Success else CampusColors.Error)
                            }
                        }
                }
            }
        }

        // SDK Packages
        item {
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("📦 Rajeev SDK", fontWeight = FontWeight.Bold)
                        Spacer(Modifier.weight(1f))
                        Badge("v0.2.1", Color(0xFFE8F5E9), CampusColors.Success)
                    }
                    Spacer(Modifier.height(8.dp))
                    listOf("vault", "network", "sync", "locale", "notify", "ui", "auth",
                        "payments", "camera", "deeplink", "document", "edge-ai", "media", "video-editor", "app-shell")
                        .forEach { pkg ->
                            Row(modifier = Modifier.padding(vertical = 4.dp)) {
                                Text("@rajeev02/$pkg", fontFamily = FontFamily.Monospace, fontSize = 12.sp, modifier = Modifier.weight(1f))
                                Text("v0.2.1", fontSize = 11.sp, color = CampusColors.TextLight)
                            }
                        }
                }
            }
        }

        // Logout
        item {
            Button(
                onClick = onLogout,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFEBEE), contentColor = CampusColors.Error),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("🚪 Logout", fontWeight = FontWeight.SemiBold)
            }
            SdkTag("@rajeev02/auth + vault")
        }
    }
}

// ─── Shared Components ────────────────────────────────────
@Composable
fun StatCard(icon: String, value: String, label: String, sdk: String, modifier: Modifier = Modifier) {
    Card(modifier = modifier, shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = CampusColors.Surface)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(icon, fontSize = 24.sp)
            Spacer(Modifier.height(8.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
            Text(label, fontSize = 12.sp, color = CampusColors.TextSecondary)
            Text("@rajeev02/$sdk", fontSize = 9.sp, color = CampusColors.TextLight)
        }
    }
}

@Composable
fun ClassRow(cls: ClassEntry) {
    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(modifier = Modifier.weight(1f)) {
            Text(cls.time, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CampusColors.Primary)
            Text(cls.subject, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text("${cls.professor} · ${cls.room}", fontSize = 12.sp, color = CampusColors.TextSecondary)
        }
        Badge(cls.type,
            if (cls.type == "Lab") Color(0xFFFFF3E0) else CampusColors.PrimaryBg,
            if (cls.type == "Lab") CampusColors.Warning else CampusColors.Primary)
    }
}

@Composable
fun QuickActionChip(icon: String, label: String, sdk: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .background(CampusColors.Background, RoundedCornerShape(12.dp))
            .padding(vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(icon, fontSize = 22.sp)
        Text(label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        Text("@rajeev02/$sdk", fontSize = 7.sp, color = CampusColors.TextLight)
    }
}

@Composable
fun NotifRow(notif: NotificationItem) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .then(if (!notif.read) Modifier.background(CampusColors.PrimaryBg, RoundedCornerShape(8.dp)) else Modifier)
            .padding(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        val icon = when (notif.type) { "deadline" -> "⏰"; "payment" -> "💰"; "class" -> "📚"; "event" -> "🎉"; else -> "📢" }
        Text(icon, fontSize = 20.sp)
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(notif.title, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
            Text(notif.body, fontSize = 12.sp, color = CampusColors.TextSecondary)
            Text(notif.time, fontSize = 10.sp, color = CampusColors.TextLight)
        }
        if (!notif.read) {
            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(CampusColors.Primary))
        }
    }
}

@Composable
fun SettingToggle(icon: String, label: String, sdk: String, value: Boolean, onToggle: (Boolean) -> Unit) {
    Row(modifier = Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(icon, fontSize = 20.sp)
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(label, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(sdk, fontSize = 9.sp, color = CampusColors.TextLight)
        }
        Switch(checked = value, onCheckedChange = onToggle, colors = SwitchDefaults.colors(checkedTrackColor = CampusColors.Primary))
    }
}

@Composable
fun Badge(text: String, bg: Color, fg: Color) {
    Text(
        text = text,
        fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = fg,
        modifier = Modifier
            .background(bg, RoundedCornerShape(20.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    )
}

@Composable
fun SdkTag(text: String) {
    Text(
        text = text,
        fontSize = 9.sp, color = CampusColors.Primary,
        fontFamily = FontFamily.Monospace,
        modifier = Modifier
            .background(CampusColors.PrimaryBg, RoundedCornerShape(4.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    )
}
