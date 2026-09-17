package com.example.therushway.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.ui.components.AddClientDialog
import com.example.therushway.ui.components.RushLogoVariant
import com.example.therushway.ui.components.RushWayEmblem
import com.example.therushway.ui.components.RushWayLogo
import com.example.therushway.ui.components.SyncStatusPill
import com.example.therushway.ui.screens.*
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.ui.theme.*
import kotlinx.coroutines.launch

enum class AppFlowState {
    SPLASH,
    LOGIN,
    MAIN_APP
}

enum class RushWayTab(val title: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector) {
    ATHLETES("Athletes", Icons.Filled.People, Icons.Outlined.People),
    TRAINING("Training", Icons.Filled.FitnessCenter, Icons.Outlined.FitnessCenter),
    NUTRITION("Nutrition", Icons.Filled.Restaurant, Icons.Outlined.Restaurant),
    CHECK_INS("Check-ins", Icons.Filled.FactCheck, Icons.Outlined.FactCheck),
    SHEETS_HUB("Sheets Hub", Icons.Filled.TableChart, Icons.Outlined.TableChart)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TheRushWayApp(
    viewModel: RushWayViewModel,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    var flowState by remember { mutableStateOf(AppFlowState.SPLASH) }
    var currentTab by remember { mutableStateOf(RushWayTab.ATHLETES) }
    var showAddClientDialog by remember { mutableStateOf(false) }
    var showCoachProfileMenu by remember { mutableStateOf(false) }

    val syncState by viewModel.syncState.collectAsState()
    val pendingSyncs by viewModel.pendingSyncs.collectAsState()
    val unreviewedCount by viewModel.unreviewedCheckInCount.collectAsState()
    val statusMessage by viewModel.statusMessage.collectAsState()

    // Observe status messages and display in snackbar
    LaunchedEffect(statusMessage) {
        statusMessage?.let { msg ->
            coroutineScope.launch {
                snackbarHostState.showSnackbar(
                    message = msg,
                    duration = SnackbarDuration.Short
                )
                viewModel.clearStatusMessage()
            }
        }
    }

    Crossfade(targetState = flowState, label = "AppFlowTransition") { state ->
        when (state) {
            AppFlowState.SPLASH -> {
                SplashScreen(
                    onSplashFinished = { flowState = AppFlowState.MAIN_APP }
                )
            }
            AppFlowState.LOGIN -> {
                LoginScreen(
                    onLoginSuccess = { flowState = AppFlowState.MAIN_APP }
                )
            }
            AppFlowState.MAIN_APP -> {
                Scaffold(
                    modifier = modifier.fillMaxSize(),
                    containerColor = RushBlack,
                    snackbarHost = { SnackbarHost(snackbarHostState) },
                    topBar = {
                        TopAppBar(
                            title = {
                                RushWayLogo(
                                    variant = RushLogoVariant.HORIZONTAL,
                                    size = 28.dp,
                                    glowEffect = false
                                )
                            },
                            actions = {
                                SyncStatusPill(
                                    syncState = syncState,
                                    pendingCount = pendingSyncs.size,
                                    onClick = { currentTab = RushWayTab.SHEETS_HUB }
                                )

                                IconButton(onClick = { viewModel.triggerSyncNow() }) {
                                    Icon(
                                        imageVector = Icons.Default.Sync,
                                        contentDescription = "Sync Now",
                                        tint = RushPurpleLight
                                    )
                                }

                                Box {
                                    IconButton(onClick = { showCoachProfileMenu = !showCoachProfileMenu }) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .clip(CircleShape)
                                                .background(RushDeepPurple.copy(alpha = 0.4f))
                                                .border(1.dp, RushPurplePrimary.copy(alpha = 0.6f), CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            RushWayEmblem(size = 18.dp)
                                        }
                                    }

                                    DropdownMenu(
                                        expanded = showCoachProfileMenu,
                                        onDismissRequest = { showCoachProfileMenu = false },
                                        modifier = Modifier
                                            .background(RushNavySurface)
                                            .border(1.dp, RushBorderPurple, RoundedCornerShape(8.dp))
                                    ) {
                                        DropdownMenuItem(
                                            text = {
                                                Column {
                                                    Text("Coach Rush", fontWeight = FontWeight.Bold, color = RushTextPrimary, fontSize = 13.sp)
                                                    Text("coach.rush@therushway.com", fontSize = 11.sp, color = RushTextSecondary)
                                                }
                                            },
                                            onClick = { showCoachProfileMenu = false },
                                            leadingIcon = {
                                                Icon(Icons.Default.AccountCircle, contentDescription = null, tint = RushPurpleLight)
                                            }
                                        )
                                        Divider(color = RushBorder)
                                        DropdownMenuItem(
                                            text = { Text("View Splash Intro", color = RushTextPrimary, fontSize = 12.sp) },
                                            onClick = {
                                                showCoachProfileMenu = false
                                                flowState = AppFlowState.SPLASH
                                            },
                                            leadingIcon = {
                                                Icon(Icons.Default.PlayCircle, contentDescription = null, tint = RushPurpleLight)
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Coach Sign Out", color = RushCrimson, fontSize = 12.sp) },
                                            onClick = {
                                                showCoachProfileMenu = false
                                                flowState = AppFlowState.LOGIN
                                            },
                                            leadingIcon = {
                                                Icon(Icons.Default.Logout, contentDescription = null, tint = RushCrimson)
                                            }
                                        )
                                    }
                                }
                            },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = RushDarkNavy,
                                titleContentColor = RushPurpleLight
                            )
                        )
                    },
                    bottomBar = {
                        NavigationBar(
                            containerColor = RushDarkNavy,
                            tonalElevation = 8.dp,
                            modifier = Modifier.border(width = 0.5.dp, color = RushBorderPurple.copy(alpha = 0.3f))
                        ) {
                            RushWayTab.values().forEach { tab ->
                                val isSelected = currentTab == tab
                                val hasBadge = tab == RushWayTab.CHECK_INS && unreviewedCount > 0

                                NavigationBarItem(
                                    selected = isSelected,
                                    onClick = { currentTab = tab },
                                    icon = {
                                        BadgedBox(
                                            badge = {
                                                if (hasBadge) {
                                                    Badge(containerColor = RushCrimson) {
                                                        Text(unreviewedCount.toString(), color = Color.White)
                                                    }
                                                }
                                            }
                                        ) {
                                            Icon(
                                                imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                                contentDescription = tab.title
                                            )
                                        }
                                    },
                                    label = { Text(tab.title, fontSize = 11.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = RushPurpleLight,
                                        selectedTextColor = RushPurpleLight,
                                        indicatorColor = RushPurplePrimary.copy(alpha = 0.25f),
                                        unselectedIconColor = RushTextSecondary,
                                        unselectedTextColor = RushTextSecondary
                                    )
                                )
                            }
                        }
                    },
                    floatingActionButton = {
                        if (currentTab == RushWayTab.ATHLETES) {
                            FloatingActionButton(
                                onClick = { showAddClientDialog = true },
                                containerColor = RushPurplePrimary,
                                contentColor = Color.White,
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier.border(1.dp, RushPurpleGlow.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
                            ) {
                                Icon(Icons.Default.PersonAdd, contentDescription = "Add Client", tint = Color.White)
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .background(RushBlack)
                    ) {
                        when (currentTab) {
                            RushWayTab.ATHLETES -> DashboardClientsScreen(
                                viewModel = viewModel,
                                onOpenCheckInReview = { currentTab = RushWayTab.CHECK_INS },
                                onNavigateToSheets = { currentTab = RushWayTab.SHEETS_HUB },
                                onOpenAddClient = { showAddClientDialog = true }
                            )
                            RushWayTab.TRAINING -> TrainingScreen(
                                viewModel = viewModel
                            )
                            RushWayTab.NUTRITION -> NutritionScreen(
                                viewModel = viewModel
                            )
                            RushWayTab.CHECK_INS -> CheckInsProgressScreen(
                                viewModel = viewModel
                            )
                            RushWayTab.SHEETS_HUB -> GoogleSheetsHubScreen(
                                viewModel = viewModel
                            )
                        }
                    }
                }
            }
        }
    }

    if (showAddClientDialog) {
        AddClientDialog(
            onDismiss = { showAddClientDialog = false },
            onConfirm = { name, email, phone, dob, age, gender, h, w, goal, act, exp, prog, nut, sub, freq, notes ->
                viewModel.createClient(
                    fullName = name,
                    email = email,
                    phone = phone,
                    dateOfBirth = dob,
                    age = age,
                    gender = gender,
                    height = h,
                    startingWeight = w,
                    goal = goal,
                    activityLevel = act,
                    trainingExperience = exp,
                    currentProgram = prog,
                    currentNutritionPlan = nut,
                    subscriptionStatus = sub,
                    checkInFrequency = freq,
                    coachNotes = notes
                )
                showAddClientDialog = false
            }
        )
    }
}
