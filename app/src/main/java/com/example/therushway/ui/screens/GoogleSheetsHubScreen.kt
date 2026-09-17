package com.example.therushway.ui.screens

import android.content.Context
import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.data.sheets.GoogleSheetsConstants
import com.example.therushway.data.sheets.SyncState
import com.example.therushway.ui.components.ConflictResolutionDialog
import com.example.therushway.ui.components.GoogleConnectDialog
import com.example.therushway.ui.components.RushWayEmblem
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.ui.theme.*

@Composable
fun GoogleSheetsHubScreen(
    viewModel: RushWayViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val syncState by viewModel.syncState.collectAsState()
    val lastSync by viewModel.lastSyncTime.collectAsState()
    val recordsSynced by viewModel.recordsSyncedCount.collectAsState()
    val errorsCount by viewModel.errorsCount.collectAsState()
    val syncLogs by viewModel.syncLogs.collectAsState()
    val pendingSyncs by viewModel.pendingSyncs.collectAsState()
    val activeConflict by viewModel.activeConflict.collectAsState()
    val selectedClient by viewModel.selectedClient.collectAsState()

    var showConnectDialog by remember { mutableStateOf(false) }
    var showWorksheetList by remember { mutableStateOf(false) }
    var showSyncLogDialog by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 80.dp)
    ) {
        // 1. MASTER SYNC STATUS CARD (Section 17)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.6f), RoundedCornerShape(14.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when (syncState) {
                                            is SyncState.Connected -> RushSuccess.copy(alpha = 0.15f)
                                            is SyncState.Syncing -> RushPurplePrimary.copy(alpha = 0.25f)
                                            else -> RushDarkNavy
                                        }
                                    )
                                    .border(1.dp, RushBorderPurple, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Default.CloudSync,
                                    contentDescription = null,
                                    tint = when (syncState) {
                                        is SyncState.Connected -> RushSuccess
                                        is SyncState.Syncing -> RushPurpleLight
                                        else -> RushTextSecondary
                                    },
                                    modifier = Modifier.size(24.dp)
                                )
                            }

                            Column {
                                Text("GOOGLE SHEETS INTEGRATION", fontSize = 10.sp, fontWeight = FontWeight.Black, color = RushPurpleLight, letterSpacing = 1.sp)
                                Text(
                                    text = when (syncState) {
                                        is SyncState.Connected -> "CONNECTED"
                                        is SyncState.Syncing -> "SYNCHRONIZING..."
                                        is SyncState.Offline -> "OFFLINE QUEUED"
                                        is SyncState.Disconnected -> "DISCONNECTED"
                                        is SyncState.Error -> "CONNECTION ERROR"
                                    },
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = when (syncState) {
                                        is SyncState.Connected -> RushSuccess
                                        is SyncState.Syncing -> RushPurpleLight
                                        is SyncState.Offline -> RushWarning
                                        else -> RushTextSecondary
                                    }
                                )
                            }
                        }

                        if (syncState is SyncState.Connected) {
                            val id = (syncState as SyncState.Connected).spreadsheetId
                            Surface(color = RushPurplePrimary.copy(alpha = 0.2f), shape = RoundedCornerShape(6.dp)) {
                                Text(
                                    text = id.take(12) + "...",
                                    fontSize = 11.sp,
                                    color = RushPurpleLight,
                                    fontWeight = FontWeight.SemiBold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    Divider(color = RushBorder.copy(alpha = 0.5f))

                    // Sync Metrics
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("LAST SYNCHRONIZATION", fontSize = 10.sp, color = RushTextSecondary)
                            Text(lastSync, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = RushTextPrimary)
                        }
                        Column {
                            Text("RECORDS SYNCHRONIZED", fontSize = 10.sp, color = RushTextSecondary)
                            Text(recordsSynced.toString(), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = RushPurpleLight)
                        }
                        Column {
                            Text("ERRORS", fontSize = 10.sp, color = RushTextSecondary)
                            Text(errorsCount.toString(), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (errorsCount > 0) RushCrimson else RushSuccess)
                        }
                    }

                    // Offline queue notification if any (Section 19)
                    if (pendingSyncs.isNotEmpty()) {
                        Surface(
                            color = RushWarning.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.HourglassBottom, contentDescription = null, tint = RushWarning, modifier = Modifier.size(18.dp))
                                Text(
                                    "Changes saved locally. Synchronization pending (${pendingSyncs.size} records).",
                                    color = RushWarning,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }

                    // PRIMARY BUTTONS (Section 17)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { viewModel.triggerSyncNow() },
                            colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Sync, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("SYNC NOW", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }

                        OutlinedButton(
                            onClick = { showSyncLogDialog = true },
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = RushPurpleLight),
                            border = androidx.compose.foundation.BorderStroke(1.dp, RushBorderPurple),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.ListAlt, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("AUDIT LOG", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = { showConnectDialog = true },
                            border = androidx.compose.foundation.BorderStroke(1.dp, RushBorder),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(if (syncState is SyncState.Connected) "RECONNECT GOOGLE" else "CONNECT GOOGLE", fontSize = 11.sp, color = RushTextPrimary)
                        }

                        if (syncState is SyncState.Connected) {
                            OutlinedButton(
                                onClick = { viewModel.disconnectGoogle() },
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = RushCrimson),
                                border = androidx.compose.foundation.BorderStroke(1.dp, RushCrimson.copy(alpha = 0.5f)),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(0.8f)
                            ) {
                                Text("DISCONNECT", fontSize = 11.sp)
                            }
                        } else {
                            OutlinedButton(
                                onClick = { viewModel.testConnection() },
                                border = androidx.compose.foundation.BorderStroke(1.dp, RushBorderPurple),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(0.8f)
                            ) {
                                Text("TEST LINK", fontSize = 10.sp, color = RushPurpleLight)
                            }
                        }
                    }
                }
            }
        }

        // 2. MASTER WORKBOOK WORKSPACES (Section 2)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RushWayEmblem(size = 20.dp)
                            Column {
                                Text("THE RUSH WAY — COACHING DATABASE", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RushTextPrimary)
                                Text("20 Worksheets Configured • Unique ID Architecture", fontSize = 11.sp, color = RushTextSecondary)
                            }
                        }
                        IconButton(onClick = { showWorksheetList = !showWorksheetList }) {
                            Icon(
                                if (showWorksheetList) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                                contentDescription = null,
                                tint = RushPurpleLight
                            )
                        }
                    }

                    AnimatedVisibility(visible = showWorksheetList) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            GoogleSheetsConstants.WORKSHEET_NAMES.forEachIndexed { index, name ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("${index + 1}. $name", fontSize = 12.sp, fontWeight = FontWeight.Medium, color = RushTextPrimary)
                                    Surface(color = RushSuccess.copy(alpha = 0.15f), shape = RoundedCornerShape(4.dp)) {
                                        Text("ACTIVE SYNC", color = RushSuccess, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. TWO-WAY CONFLICT DETECTION TESTER (Section 5)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurfaceVariant),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CompareArrows, contentDescription = null, tint = RushPurpleLight, modifier = Modifier.size(18.dp))
                            Text("Two-Way Sync & Conflict Safety", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RushTextPrimary)
                        }
                        Surface(color = RushPurplePrimary.copy(alpha = 0.2f), shape = RoundedCornerShape(4.dp)) {
                            Text("Section 5 Guard", color = RushPurpleLight, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp))
                        }
                    }

                    Text(
                        "Google Sheets edits never silently overwrite coach decisions. When changes collide between App and Sheets, the Coach manually selects which version to keep.",
                        fontSize = 11.sp,
                        color = RushTextSecondary
                    )

                    Button(
                        onClick = {
                            selectedClient?.let { viewModel.simulateRemoteConflict(it.id) }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RushDarkNavy),
                        border = androidx.compose.foundation.BorderStroke(1.dp, RushBorderPurple),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Simulate Remote Sheet Edit & Conflict Test", color = RushPurpleLight, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }

        // 4. PROFESSIONAL PDF EXPORT (Section 12)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorderPurple.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.PictureAsPdf, contentDescription = null, tint = RushPurpleLight, modifier = Modifier.size(20.dp))
                            Text("THE RUSH WAY PROFESSIONAL PDF", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RushTextPrimary)
                        }
                    }

                    Text(
                        "Compiles synchronized Sheets data: Client Profile + Longitudinal Measurements + Training Logs + Target Macros + Supplement Protocol + Coach Notes into a branded presentation PDF.",
                        fontSize = 11.sp,
                        color = RushTextSecondary
                    )

                    Button(
                        onClick = {
                            selectedClient?.let { viewModel.generatePdfReport(context, it) }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Generate & View PDF Report (${selectedClient?.fullName ?: "Athlete"})", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        // 5. RECENT SYNC LOG AUDIT (Section 18)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "SYNCHRONIZATION AUDIT LOG (${syncLogs.size})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = RushPurpleLight,
                    letterSpacing = 1.sp
                )
                TextButton(onClick = { showSyncLogDialog = true }) {
                    Text("Expand All", fontSize = 11.sp, color = RushPurpleGlow)
                }
            }
        }

        items(syncLogs.take(5)) { log ->
            Card(
                colors = CardDefaults.cardColors(containerColor = RushNavySurface),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, RushBorder.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(log.recordType, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RushTextPrimary)
                            Text("• ${log.recordId}", fontSize = 11.sp, color = RushPurpleLight)
                        }
                        Text("${log.dateTime} • ${log.direction}", fontSize = 10.sp, color = RushTextSecondary)
                        if (log.errorMessage.isNotBlank()) {
                            Text(log.errorMessage, fontSize = 10.sp, color = if (log.status == "Error") RushCrimson else RushTextSecondary)
                        }
                    }

                    Surface(
                        color = when (log.status) {
                            "Success" -> RushSuccess.copy(alpha = 0.15f)
                            "Error" -> RushCrimson.copy(alpha = 0.15f)
                            "Conflict" -> RushWarning.copy(alpha = 0.15f)
                            else -> RushNavySurfaceVariant
                        },
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = log.status.uppercase(),
                            color = when (log.status) {
                                "Success" -> RushSuccess
                                "Error" -> RushCrimson
                                "Conflict" -> RushWarning
                                else -> RushTextSecondary
                            },
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
        }
    }

    // DIALOGS
    if (showConnectDialog) {
        val currentId = if (syncState is SyncState.Connected) (syncState as SyncState.Connected).spreadsheetId else null
        GoogleConnectDialog(
            currentSpreadsheetId = currentId,
            onDismiss = { showConnectDialog = false },
            onConnect = { token, id ->
                viewModel.connectGoogleAccount(token, id)
                showConnectDialog = false
            },
            onCreateMaster = { token ->
                viewModel.createMasterSpreadsheet(token)
                showConnectDialog = false
            }
        )
    }

    // Active conflict dialog (Section 5)
    activeConflict?.let { conflict ->
        ConflictResolutionDialog(
            conflict = conflict,
            onKeepApp = { viewModel.resolveConflict(conflict, keepAppVersion = true) },
            onKeepSheets = { viewModel.resolveConflict(conflict, keepAppVersion = false) },
            onDismiss = { /* Must resolve */ }
        )
    }

    // Detailed Sync Log Viewer Modal
    if (showSyncLogDialog) {
        AlertDialog(
            onDismissRequest = { showSyncLogDialog = false },
            containerColor = RushNavySurface,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.ReceiptLong, contentDescription = null, tint = RushPurpleLight)
                    Text("Complete Sync Audit Log", fontWeight = FontWeight.Bold, color = RushTextPrimary)
                }
            },
            text = {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 400.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(syncLogs) { log ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = RushDarkNavy),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth().border(1.dp, RushBorder, RoundedCornerShape(8.dp))
                        ) {
                            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("${log.action}: ${log.recordType} (${log.recordId})", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RushTextPrimary)
                                    Text(log.status, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = if (log.status == "Success") RushSuccess else RushCrimson)
                                }
                                Text("${log.dateTime} • Direction: ${log.direction}", fontSize = 10.sp, color = RushTextSecondary)
                                if (log.errorMessage.isNotBlank()) {
                                    Text(log.errorMessage, fontSize = 10.sp, color = RushPurpleLight)
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showSyncLogDialog = false }) {
                    Text("Close", fontWeight = FontWeight.Bold, color = RushPurpleLight)
                }
            }
        )
    }
}
