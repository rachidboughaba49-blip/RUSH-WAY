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
import com.example.therushway.ui.components.AddSupplementDialog
import com.example.therushway.ui.components.RushWayEmblem
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.ui.theme.*

@Composable
fun NutritionScreen(
    viewModel: RushWayViewModel,
    modifier: Modifier = Modifier
) {
    val selectedClient by viewModel.selectedClient.collectAsState()
    val nutritionLogs by viewModel.allNutritionLogs.collectAsState()
    val supplements by viewModel.allSupplements.collectAsState()

    var showAddSupplementDialog by remember { mutableStateOf(false) }

    val activeClientId = selectedClient?.id ?: "TRW-0001"

    // Targets (default to standard high-protein template or from client profile)
    val targetCalories = 2400
    val targetProtein = 210
    val targetCarbs = 220
    val targetFat = 65
    val targetFiber = 35

    // Calculated totals from logs
    val totalCals = nutritionLogs.sumOf { it.calories }
    val totalProtein = nutritionLogs.sumOf { it.protein }
    val totalCarbs = nutritionLogs.sumOf { it.carbohydrates }
    val totalFat = nutritionLogs.sumOf { it.fat }
    val totalFiber = nutritionLogs.sumOf { it.fiber }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 80.dp)
    ) {
        // 1. MACRO TOTALS VS TARGETS
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
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
                                Text("DAILY MACRO TARGETS VS CONSUMED", fontSize = 10.sp, fontWeight = FontWeight.Black, color = RushPurpleLight, letterSpacing = 1.sp)
                                Text("${selectedClient?.fullName ?: "Select Athlete"} (${selectedClient?.id})", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = RushTextPrimary)
                            }
                        }
                        Surface(color = RushPurplePrimary.copy(alpha = 0.2f), shape = RoundedCornerShape(6.dp)) {
                            Text("Tabs 7-10", color = RushPurpleLight, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    // Calories progress bar
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Calories", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = RushTextPrimary)
                            Text("$totalCals / $targetCalories kcal", fontWeight = FontWeight.Black, color = RushPurpleGlow, fontSize = 13.sp)
                        }
                        val calProgress = (totalCals.toFloat() / targetCalories).coerceIn(0f, 1f)
                        LinearProgressIndicator(
                            progress = { calProgress },
                            color = RushPurplePrimary,
                            trackColor = RushDarkNavy,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp))
                        )
                    }

                    // Macronutrients row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        MacroColumn(name = "Protein", current = totalProtein, target = targetProtein, color = RushPurpleLight, modifier = Modifier.weight(1f))
                        MacroColumn(name = "Carbs", current = totalCarbs, target = targetCarbs, color = RushCyan, modifier = Modifier.weight(1f))
                        MacroColumn(name = "Fats", current = totalFat, target = targetFat, color = RushWarning, modifier = Modifier.weight(1f))
                        MacroColumn(name = "Fiber", current = totalFiber, target = targetFiber, color = RushSuccess, modifier = Modifier.weight(1f))
                    }
                }
            }
        }

        // 2. MEAL LOGS SECTION
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TODAY'S LOGGED MEALS (${nutritionLogs.size})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = RushPurpleLight,
                    letterSpacing = 1.sp
                )
                Text("Calculated in Sheets", fontSize = 11.sp, color = RushSuccess)
            }
        }

        if (nutritionLogs.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("No meals logged for today.", modifier = Modifier.padding(16.dp), color = RushTextSecondary, fontSize = 12.sp)
                }
            }
        } else {
            items(nutritionLogs) { log ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, RushBorderPurple.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Text(log.meal, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = RushTextPrimary)
                            Text("${log.food} (${log.quantity})", fontSize = 12.sp, color = RushTextSecondary)
                            Text("P: ${log.protein}g | C: ${log.carbohydrates}g | F: ${log.fat}g | Fiber: ${log.fiber}g", fontSize = 11.sp, color = RushPurpleLight)
                        }

                        Surface(color = RushDarkNavy, shape = RoundedCornerShape(6.dp)) {
                            Text("${log.calories} kcal", fontWeight = FontWeight.Black, fontSize = 12.sp, color = RushPurpleGlow, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                        }
                    }
                }
            }
        }

        // 3. SUPPLEMENT PROTOCOL SECTION
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "SUPPLEMENT PROTOCOL (SHEETS 11 & 12)",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = RushPurpleLight,
                    letterSpacing = 1.sp
                )
                TextButton(onClick = { showAddSupplementDialog = true }) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp), tint = RushPurpleGlow)
                    Spacer(Modifier.width(4.dp))
                    Text("+ Add Supplement", color = RushPurpleGlow, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }

        items(supplements) { sup ->
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(sup.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = RushTextPrimary)
                        Surface(color = RushPurplePrimary.copy(alpha = 0.2f), shape = RoundedCornerShape(4.dp)) {
                            Text(sup.category, color = RushPurpleLight, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    Text("Dosage: ${sup.dosage} • ${sup.timing} (${sup.frequency})", fontSize = 12.sp, color = RushTextSecondary)
                    Text("Purpose: ${sup.purpose}", fontSize = 11.sp, color = RushPurpleLight)
                }
            }
        }
    }

    if (showAddSupplementDialog) {
        AddSupplementDialog(
            clientId = activeClientId,
            onDismiss = { showAddSupplementDialog = false },
            onConfirm = { name, dosage, timing, freq, notes ->
                viewModel.addSupplement(activeClientId, name, dosage, timing, freq, notes)
                showAddSupplementDialog = false
            }
        )
    }
}

@Composable
private fun MacroColumn(name: String, current: Int, target: Int, color: Color, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = RushDarkNavy),
        shape = RoundedCornerShape(8.dp),
        modifier = modifier.border(1.dp, RushBorder, RoundedCornerShape(8.dp))
    ) {
        Column(modifier = Modifier.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(name, fontSize = 10.sp, color = RushTextSecondary)
            Text("${current}g", fontWeight = FontWeight.Black, fontSize = 13.sp, color = color)
            Text("Goal: ${target}g", fontSize = 9.sp, color = RushTextMuted)
        }
    }
}
