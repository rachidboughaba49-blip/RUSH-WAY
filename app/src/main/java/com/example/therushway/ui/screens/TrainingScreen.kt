package com.example.therushway.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.ui.components.LogWorkoutDialog
import com.example.therushway.ui.components.RushWayEmblem
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.ui.theme.*

@Composable
fun TrainingScreen(
    viewModel: RushWayViewModel,
    modifier: Modifier = Modifier
) {
    val clients by viewModel.allClients.collectAsState()
    val selectedClient by viewModel.selectedClient.collectAsState()
    val allLogs by viewModel.allWorkoutLogs.collectAsState()

    var showLogDialog by remember { mutableStateOf(false) }

    val activeClientId = selectedClient?.id ?: "TRW-0001"
    val clientLogs = allLogs.filter { it.clientId == activeClientId }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 80.dp)
    ) {
        // 1. ATHLETE SELECTOR
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("ACTIVE ATHLETE PROTOCOL", fontSize = 11.sp, fontWeight = FontWeight.Black, color = RushPurpleLight, letterSpacing = 1.sp)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(RushDarkNavy)
                                    .border(1.dp, RushPurplePrimary.copy(alpha = 0.5f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                RushWayEmblem(size = 22.dp)
                            }
                            Column {
                                Text(
                                    text = selectedClient?.fullName ?: "Select Athlete",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = RushTextPrimary
                                )
                                Text(
                                    text = "${selectedClient?.id} • Program: ${selectedClient?.currentProgram ?: "Standard"}",
                                    fontSize = 12.sp,
                                    color = RushPurpleLight
                                )
                            }
                        }

                        Button(
                            onClick = { showLogDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Log Set", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // 2. PLANNED VS COMPLETED ARCHITECTURE CARD
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurfaceVariant),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.FitnessCenter, contentDescription = null, tint = RushPurpleLight, modifier = Modifier.size(18.dp))
                            Text("TRAINING PROTOCOL (PLANNED VS COMPLETED)", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RushTextPrimary)
                        }
                        Surface(color = RushPurplePrimary.copy(alpha = 0.2f), shape = RoundedCornerShape(4.dp)) {
                            Text("Sheets 4, 5, 6 Linked", color = RushPurpleLight, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    Text(
                        "Planned training protocols (Workouts & Exercises sheets) are separated from actual completed logs (Workout Logs sheet). This enables progressive overload tracking and adherence analytics in Google Sheets.",
                        fontSize = 11.sp,
                        color = RushTextSecondary
                    )
                }
            }
        }

        // 3. WORKOUT LOGS TABLE HEADER
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "COMPLETED WORKOUT LOGS (${clientLogs.size})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = RushPurpleLight,
                    letterSpacing = 1.sp
                )
                Text("Syncs to Worksheet 6", fontSize = 11.sp, color = RushPurpleGlow)
            }
        }

        // 4. WORKOUT LOG ENTRIES
        if (clientLogs.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp).fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Default.HistoryEdu, contentDescription = null, tint = RushTextSecondary, modifier = Modifier.size(36.dp))
                        Text("No completed workouts logged yet for this athlete.", color = RushTextSecondary, fontSize = 13.sp)
                        TextButton(onClick = { showLogDialog = true }) {
                            Text("Log First Workout Set", color = RushPurpleLight, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        } else {
            items(clientLogs) { log ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, RushBorderPurple.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(log.exercise, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = RushTextPrimary)
                            Surface(color = RushSuccess.copy(alpha = 0.15f), shape = RoundedCornerShape(4.dp)) {
                                Text(log.completion, color = RushSuccess, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                            }
                        }

                        Text("Muscle: ${log.muscle} • Date: ${log.date}", fontSize = 12.sp, color = RushTextSecondary)

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("SETS x REPS", fontSize = 10.sp, color = RushTextSecondary)
                                Text("${log.sets} sets (${log.reps})", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushTextPrimary)
                            }
                            Column {
                                Text("LOAD", fontSize = 10.sp, color = RushTextSecondary)
                                Text(log.load, fontWeight = FontWeight.Black, fontSize = 13.sp, color = RushPurpleLight)
                            }
                            Column {
                                Text("INTENSITY", fontSize = 10.sp, color = RushTextSecondary)
                                Text("RPE ${log.rpe} | RIR ${log.rir}", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushTextPrimary)
                            }
                            Column {
                                Text("TEMPO / REST", fontSize = 10.sp, color = RushTextSecondary)
                                Text("${log.tempo} / ${log.rest}", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushTextPrimary)
                            }
                        }
                    }
                }
            }
        }
    }

    if (showLogDialog) {
        LogWorkoutDialog(
            clientId = activeClientId,
            onDismiss = { showLogDialog = false },
            onConfirm = { ex, m, s, r, l, rpe, rir, tempo, rest ->
                viewModel.logWorkout(activeClientId, ex, m, s, r, l, rpe, rir, tempo, rest)
                showLogDialog = false
            }
        )
    }
}
