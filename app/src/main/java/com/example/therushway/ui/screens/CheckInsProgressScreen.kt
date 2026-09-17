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
import com.example.therushway.data.model.CheckInEntity
import com.example.therushway.ui.components.CheckInReviewDialog
import com.example.therushway.ui.components.RushWayEmblem
import com.example.therushway.ui.components.UpdateWeightDialog
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.ui.theme.*

@Composable
fun CheckInsProgressScreen(
    viewModel: RushWayViewModel,
    modifier: Modifier = Modifier
) {
    val selectedClient by viewModel.selectedClient.collectAsState()
    val allCheckIns by viewModel.allCheckIns.collectAsState()
    val measurements by viewModel.selectedClientMeasurements.collectAsState()

    var activeReviewCheckIn by remember { mutableStateOf<CheckInEntity?>(null) }
    var showRecordMeasurement by remember { mutableStateOf(false) }

    val activeClientId = selectedClient?.id ?: "TRW-0001"

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 80.dp)
    ) {
        // 1. HEADER & SIMULATE ACTIONS
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
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
                                Text("CHECK-IN & PROGRESS QUEUE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = RushPurpleLight, letterSpacing = 1.sp)
                                Text("${selectedClient?.fullName ?: "Select Athlete"} (${selectedClient?.id})", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = RushTextPrimary)
                            }
                        }

                        Button(
                            onClick = {
                                // Simulate athlete check-in
                                viewModel.submitCheckIn(
                                    clientId = activeClientId,
                                    weight = (selectedClient?.currentWeight ?: 88.0) - 0.4,
                                    measurements = "Waist: -0.5cm, Arm: +0.2cm",
                                    trainingAdh = 98,
                                    nutritionAdh = 95,
                                    sleep = 8,
                                    energy = 9,
                                    stress = 3,
                                    hunger = 5,
                                    recovery = 9,
                                    performance = 9,
                                    comments = "Crushed all training sessions this week! Feeling strong and recovery was optimal."
                                )
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.AddComment, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Simulate Check-In", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }

                    Text(
                        "Athlete check-ins automatically sync to Worksheet 14 (Check-ins). Coach reviews trigger feedback sync and progress tracking.",
                        fontSize = 11.sp,
                        color = RushTextSecondary
                    )
                }
            }
        }

        // 2. CHECK-IN FEED
        item {
            Text(
                text = "ATHLETE CHECK-IN SUBMISSIONS",
                fontSize = 12.sp,
                fontWeight = FontWeight.Black,
                color = RushPurpleLight,
                letterSpacing = 1.sp
            )
        }

        if (allCheckIns.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("No check-in submissions yet.", modifier = Modifier.padding(16.dp), color = RushTextSecondary, fontSize = 12.sp)
                }
            }
        } else {
            items(allCheckIns) { checkIn ->
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (!checkIn.isReviewed) RushNavySurfaceVariant else RushNavySurface
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = if (!checkIn.isReviewed) 1.5.dp else 1.dp,
                            color = if (!checkIn.isReviewed) RushCrimson else RushBorderPurple.copy(alpha = 0.4f),
                            shape = RoundedCornerShape(12.dp)
                        )
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text(checkIn.date, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = RushTextPrimary)
                                Text("• ${checkIn.clientId}", fontSize = 12.sp, color = RushPurpleLight)
                            }

                            if (!checkIn.isReviewed) {
                                Surface(color = RushCrimson, shape = RoundedCornerShape(4.dp)) {
                                    Text(
                                        "NEW CHECK-IN",
                                        color = Color.White,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            } else {
                                Surface(color = RushSuccess.copy(alpha = 0.15f), shape = RoundedCornerShape(4.dp)) {
                                    Text(
                                        "REVIEWED",
                                        color = RushSuccess,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Weight: ${checkIn.weight} kg", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushTextPrimary)
                            Text("Training: ${checkIn.trainingAdherence}%", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushPurpleLight)
                            Text("Nutrition: ${checkIn.nutritionAdherence}%", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushSuccess)
                            Text("Energy: ${checkIn.energy}/10", fontSize = 12.sp, color = RushTextSecondary)
                        }

                        if (checkIn.clientComments.isNotBlank()) {
                            Text(
                                "\"${checkIn.clientComments}\"",
                                fontSize = 12.sp,
                                color = RushTextSecondary
                            )
                        }

                        if (checkIn.coachFeedback.isNotBlank()) {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = RushDarkNavy),
                                modifier = Modifier.fillMaxWidth().border(1.dp, RushBorder, RoundedCornerShape(8.dp))
                            ) {
                                Column(modifier = Modifier.padding(8.dp)) {
                                    Text("Coach Feedback:", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = RushPurpleLight)
                                    Text(checkIn.coachFeedback, fontSize = 12.sp, color = RushTextPrimary)
                                }
                            }
                        }

                        Button(
                            onClick = { activeReviewCheckIn = checkIn },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (!checkIn.isReviewed) RushPurplePrimary else RushNavySurfaceVariant
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth(),
                            contentPadding = PaddingValues(vertical = 6.dp)
                        ) {
                            Text(
                                if (!checkIn.isReviewed) "Review & Write Feedback" else "Edit Feedback",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }

        // 3. LONGITUDINAL MEASUREMENTS TABLE
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "LONGITUDINAL MEASUREMENTS (SHEET 2)",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = RushPurpleLight,
                        letterSpacing = 1.sp
                    )
                    Text("Historical log is never deleted when new measurements are added", fontSize = 10.sp, color = RushTextSecondary)
                }

                IconButton(onClick = { showRecordMeasurement = true }) {
                    Icon(Icons.Default.AddCircle, contentDescription = null, tint = RushPurpleGlow)
                }
            }
        }

        items(measurements) { m ->
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.35f), RoundedCornerShape(10.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(m.date, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RushTextPrimary)
                        Text(m.clientId, fontSize = 11.sp, color = RushTextSecondary)
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text("${m.weight} kg", fontWeight = FontWeight.Black, fontSize = 14.sp, color = RushPurpleLight)
                        val details = buildString {
                            if (m.waist > 0) append("Waist: ${m.waist}cm  ")
                            if (m.bodyFat > 0) append("BF: ${m.bodyFat}%")
                        }
                        if (details.isNotBlank()) {
                            Text(details, fontSize = 11.sp, color = RushTextSecondary)
                        }
                    }
                }
            }
        }
    }

    activeReviewCheckIn?.let { targetCheckIn ->
        CheckInReviewDialog(
            checkIn = targetCheckIn,
            onDismiss = { activeReviewCheckIn = null },
            onSaveFeedback = { feedback ->
                viewModel.reviewCheckIn(targetCheckIn.id, feedback)
                activeReviewCheckIn = null
            }
        )
    }

    if (showRecordMeasurement && selectedClient != null) {
        UpdateWeightDialog(
            client = selectedClient!!,
            onDismiss = { showRecordMeasurement = false },
            onConfirm = { w, waist, chest, arm, thigh, bf ->
                viewModel.updateWeight(selectedClient!!.id, w, waist, chest, arm, thigh, bf)
                showRecordMeasurement = false
            }
        )
    }
}
