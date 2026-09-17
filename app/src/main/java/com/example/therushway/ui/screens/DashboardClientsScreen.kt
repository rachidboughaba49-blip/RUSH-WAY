package com.example.therushway.ui.screens

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.data.model.ClientEntity
import com.example.therushway.ui.components.MetricStatCard
import com.example.therushway.ui.components.RushLogoVariant
import com.example.therushway.ui.components.RushWayEmblem
import com.example.therushway.ui.components.RushWayLogo
import com.example.therushway.ui.components.UpdateWeightDialog
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.ui.theme.*

@Composable
fun DashboardClientsScreen(
    viewModel: RushWayViewModel,
    onOpenCheckInReview: () -> Unit,
    onNavigateToSheets: () -> Unit,
    onOpenAddClient: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val clients by viewModel.allClients.collectAsState()
    val selectedClient by viewModel.selectedClient.collectAsState()
    val unreviewedCount by viewModel.unreviewedCheckInCount.collectAsState()
    val lastSync by viewModel.lastSyncTime.collectAsState()
    val recordsSynced by viewModel.recordsSyncedCount.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }
    var clientToUpdateWeight by remember { mutableStateOf<ClientEntity?>(null) }

    val filteredClients = clients.filter { client ->
        val matchesSearch = client.fullName.contains(searchQuery, ignoreCase = true) ||
                client.id.contains(searchQuery, ignoreCase = true) ||
                client.goal.contains(searchQuery, ignoreCase = true)
        val matchesFilter = when (selectedFilter) {
            "Active" -> client.status == "Active"
            "Paused" -> client.status == "Paused"
            "Inactive" -> client.status == "Inactive"
            else -> true
        }
        matchesSearch && matchesFilter
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 80.dp)
    ) {
        // 1. BRAND HERO BANNER - THE RUSH WAY
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.6f), RoundedCornerShape(16.dp))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.horizontalGradient(
                                colors = listOf(
                                    RushNavySurface,
                                    RushDarkNavy,
                                    RushDeepPurple.copy(alpha = 0.35f)
                                )
                            )
                        )
                        .padding(18.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            RushWayLogo(
                                variant = RushLogoVariant.HORIZONTAL,
                                size = 32.dp,
                                glowEffect = true
                            )
                            Spacer(Modifier.height(4.dp))
                            Text(
                                text = "HIGH PERFORMANCE COACHING OS",
                                fontSize = 11.sp,
                                letterSpacing = 1.2.sp,
                                fontWeight = FontWeight.Bold,
                                color = RushPurpleLight
                            )
                            Text(
                                text = "Connected to Master Google Sheets Database",
                                fontSize = 11.sp,
                                color = RushTextSecondary
                            )
                        }

                        // Circular emblem accent
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(RushDeepPurple.copy(alpha = 0.4f))
                                .border(1.dp, RushPurplePrimary.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            RushWayEmblem(size = 28.dp)
                        }
                    }
                }
            }
        }

        // 2. STATS OVERVIEW ROW
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                MetricStatCard(
                    title = "Total Athletes",
                    value = clients.size.toString(),
                    subtitle = "${clients.count { it.status == "Active" }} Active",
                    icon = Icons.Default.Groups,
                    iconTint = RushPurpleGlow,
                    modifier = Modifier.weight(1f)
                )

                MetricStatCard(
                    title = "Check-ins",
                    value = if (unreviewedCount > 0) "$unreviewedCount New" else "All Reviewed",
                    subtitle = if (unreviewedCount > 0) "Requires Review" else "Up to date",
                    icon = Icons.Default.FactCheck,
                    iconTint = if (unreviewedCount > 0) RushCrimson else RushSuccess,
                    badgeText = if (unreviewedCount > 0) "NEW CHECK-IN" else null,
                    badgeColor = RushCrimson,
                    modifier = Modifier.weight(1f),
                    onClick = { if (unreviewedCount > 0) onOpenCheckInReview() }
                )
            }
        }

        // 3. GOOGLE SHEETS LIVE BANNER
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                    .clickable { onNavigateToSheets() }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(CircleShape)
                                .background(RushPurplePrimary.copy(alpha = 0.2f))
                                .border(1.dp, RushPurplePrimary.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.TableChart, contentDescription = null, tint = RushPurpleLight, modifier = Modifier.size(20.dp))
                        }
                        Column {
                            Text("Google Sheets Enterprise Sync", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RushTextPrimary)
                            Text("Synced: $recordsSynced records • Last: $lastSync", fontSize = 11.sp, color = RushTextSecondary)
                        }
                    }
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = RushPurpleLight)
                }
            }
        }

        // 4. SEARCH & STATUS FILTER
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search athletes (Name, TRW-ID, Goal)...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = RushPurpleLight) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Close, contentDescription = null, tint = RushTextSecondary)
                            }
                        }
                    },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = RushNavySurface,
                        unfocusedContainerColor = RushNavySurface,
                        focusedBorderColor = RushPurplePrimary,
                        unfocusedBorderColor = RushBorder
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    listOf("All", "Active", "Paused", "Inactive").forEach { filter ->
                        val isSelected = selectedFilter == filter
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedFilter = filter },
                            label = { Text(filter, fontSize = 12.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = RushPurplePrimary.copy(alpha = 0.25f),
                                selectedLabelColor = RushPurpleLight,
                                containerColor = RushNavySurface,
                                labelColor = RushTextSecondary
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true,
                                selected = isSelected,
                                borderColor = if (isSelected) RushPurplePrimary else RushBorder
                            )
                        )
                    }
                }
            }
        }

        // 5. CLIENT DIRECTORY HEADER
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "ATHLETE ROSTER (${filteredClients.size})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = RushPurpleLight,
                    letterSpacing = 1.sp
                )
                TextButton(onClick = onOpenAddClient) {
                    Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(16.dp), tint = RushPurpleGlow)
                    Spacer(Modifier.width(4.dp))
                    Text("+ Add Athlete", color = RushPurpleGlow, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }

        // 6. CLIENT LIST ITEMS
        if (filteredClients.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.SearchOff, contentDescription = null, tint = RushTextSecondary, modifier = Modifier.size(40.dp))
                        Text("No athletes found matching '$searchQuery'", color = RushTextSecondary, fontSize = 13.sp)
                    }
                }
            }
        } else {
            items(filteredClients, key = { it.id }) { client ->
                val isSelected = selectedClient?.id == client.id

                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) RushNavySurfaceVariant else RushNavySurface
                    ),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = if (isSelected) 1.5.dp else 1.dp,
                            color = if (isSelected) RushPurplePrimary else RushBorderPurple.copy(alpha = 0.4f),
                            shape = RoundedCornerShape(14.dp)
                        )
                        .clickable { viewModel.selectClient(client.id) }
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Athlete Header Row
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
                                        .size(40.dp)
                                        .clip(CircleShape)
                                        .background(RushDarkNavy)
                                        .border(1.dp, RushPurplePrimary.copy(alpha = 0.5f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    RushWayEmblem(size = 24.dp)
                                }
                                Column {
                                    Text(
                                        text = client.fullName,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = RushTextPrimary
                                    )
                                    Text(
                                        text = "${client.id} • ${client.gender}, ${client.age} yrs • ${client.height}",
                                        fontSize = 11.sp,
                                        color = RushTextSecondary
                                    )
                                }
                            }

                            Surface(
                                color = when (client.status) {
                                    "Active" -> RushSuccess.copy(alpha = 0.15f)
                                    "Paused" -> RushWarning.copy(alpha = 0.15f)
                                    else -> RushNavySurfaceVariant
                                },
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text(
                                    text = client.status.uppercase(),
                                    color = when (client.status) {
                                        "Active" -> RushSuccess
                                        "Paused" -> RushWarning
                                        else -> RushTextSecondary
                                    },
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }

                        Divider(color = RushBorder.copy(alpha = 0.5f))

                        // Biometric & Goal Pills
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Current Weight", fontSize = 10.sp, color = RushTextSecondary)
                                Text("${client.currentWeight} kg", fontWeight = FontWeight.Black, fontSize = 14.sp, color = RushPurpleLight)
                            }
                            Column {
                                Text("Primary Goal", fontSize = 10.sp, color = RushTextSecondary)
                                Text(client.goal, fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushTextPrimary)
                            }
                            Column {
                                Text("Tier", fontSize = 10.sp, color = RushTextSecondary)
                                Text(client.subscriptionStatus, fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushPurpleGlow)
                            }
                            Column {
                                Text("Check-in", fontSize = 10.sp, color = RushTextSecondary)
                                Text(client.checkInFrequency, fontWeight = FontWeight.Normal, fontSize = 12.sp, color = RushTextPrimary)
                            }
                        }

                        // Programs
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Surface(
                                color = RushDarkNavy,
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.weight(1f).border(1.dp, RushBorder, RoundedCornerShape(6.dp))
                            ) {
                                Row(
                                    modifier = Modifier.padding(6.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(Icons.Default.FitnessCenter, contentDescription = null, tint = RushPurpleLight, modifier = Modifier.size(13.dp))
                                    Text(client.currentProgram, fontSize = 10.sp, color = RushTextPrimary, maxLines = 1)
                                }
                            }
                            Surface(
                                color = RushDarkNavy,
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.weight(1f).border(1.dp, RushBorder, RoundedCornerShape(6.dp))
                            ) {
                                Row(
                                    modifier = Modifier.padding(6.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(Icons.Default.Restaurant, contentDescription = null, tint = RushCyan, modifier = Modifier.size(13.dp))
                                    Text(client.currentNutritionPlan, fontSize = 10.sp, color = RushTextPrimary, maxLines = 1)
                                }
                            }
                        }

                        // Quick Actions
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedButton(
                                onClick = { clientToUpdateWeight = client },
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = RushPurpleLight),
                                border = androidx.compose.foundation.BorderStroke(1.dp, RushBorderPurple),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.height(34.dp)
                            ) {
                                Icon(Icons.Default.Scale, contentDescription = null, modifier = Modifier.size(14.dp))
                                Spacer(Modifier.width(4.dp))
                                Text("Log Weight", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }

                            Spacer(Modifier.width(8.dp))

                            Button(
                                onClick = {
                                    viewModel.generatePdfReport(context, client)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.height(34.dp)
                            ) {
                                Icon(Icons.Default.PictureAsPdf, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color.White)
                                Spacer(Modifier.width(4.dp))
                                Text("PDF Report", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }

    // Weight & Measurement Dialog
    clientToUpdateWeight?.let { client ->
        UpdateWeightDialog(
            client = client,
            onDismiss = { clientToUpdateWeight = null },
            onConfirm = { weight, waist, chest, arm, thigh, bodyFat ->
                viewModel.updateWeight(
                    clientId = client.id,
                    newWeight = weight,
                    waist = waist,
                    chest = chest,
                    arm = arm,
                    thigh = thigh,
                    bodyFat = bodyFat
                )
                clientToUpdateWeight = null
            }
        )
    }
}
