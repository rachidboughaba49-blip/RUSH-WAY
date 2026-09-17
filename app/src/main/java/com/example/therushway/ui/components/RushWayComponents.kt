package com.example.therushway.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.data.sheets.DataConflict
import com.example.therushway.data.sheets.SyncState
import com.example.ui.theme.*

@Composable
fun SyncStatusPill(
    syncState: SyncState,
    pendingCount: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val (bgColor, borderColor, textColor, text, icon) = when (syncState) {
        is SyncState.Connected -> {
            if (pendingCount > 0) {
                Quintuple(RushWarning.copy(alpha = 0.15f), RushWarning.copy(alpha = 0.4f), RushWarning, "Offline ($pendingCount pending)", Icons.Default.CloudQueue)
            } else {
                Quintuple(RushNavySurfaceVariant, RushPurplePrimary.copy(alpha = 0.4f), RushPurpleGlow, "Sheets: CONNECTED", Icons.Default.CheckCircle)
            }
        }
        is SyncState.Syncing -> Quintuple(RushDeepPurple.copy(alpha = 0.3f), RushPurplePrimary, RushPurpleLight, "Syncing...", Icons.Default.Sync)
        is SyncState.Offline -> Quintuple(RushWarning.copy(alpha = 0.15f), RushWarning.copy(alpha = 0.4f), RushWarning, "Offline ($pendingCount pending)", Icons.Default.CloudOff)
        is SyncState.Disconnected -> Quintuple(RushNavySurfaceVariant, RushBorder, RushTextSecondary, "Sheets: DISCONNECTED", Icons.Default.CloudOff)
        is SyncState.Error -> Quintuple(RushCrimson.copy(alpha = 0.15f), RushCrimson.copy(alpha = 0.5f), RushCrimson, "Sync Error", Icons.Default.Warning)
    }

    Surface(
        color = bgColor,
        shape = RoundedCornerShape(20.dp),
        modifier = modifier
            .border(1.dp, borderColor, RoundedCornerShape(20.dp))
            .clip(RoundedCornerShape(20.dp))
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = textColor,
                modifier = Modifier.size(15.dp)
            )
            Text(
                text = text,
                color = textColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.3.sp
            )
        }
    }
}

private data class Quintuple<A, B, C, D, E>(val first: A, val second: B, val third: C, val fourth: D, val fifth: E)

@Composable
fun MetricStatCard(
    title: String,
    value: String,
    subtitle: String? = null,
    icon: ImageVector,
    iconTint: Color = RushPurpleGlow,
    badgeText: String? = null,
    badgeColor: Color = RushCrimson,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = RushNavySurface
        ),
        shape = RoundedCornerShape(14.dp),
        modifier = modifier
            .border(1.dp, RushBorderPurple.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(iconTint.copy(alpha = 0.15f))
                        .border(1.dp, iconTint.copy(alpha = 0.3f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconTint,
                        modifier = Modifier.size(18.dp)
                    )
                }

                if (badgeText != null) {
                    Surface(
                        color = badgeColor,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = badgeText,
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }

            Text(
                text = value,
                fontSize = 20.sp,
                fontWeight = FontWeight.Black,
                color = RushTextPrimary
            )

            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = RushTextSecondary
            )

            if (subtitle != null) {
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = iconTint
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SimpleDropdownMenu(
    label: String,
    options: List<String>,
    selectedOption: String,
    onOptionSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded },
        modifier = modifier
    ) {
        OutlinedTextField(
            value = selectedOption,
            onValueChange = {},
            readOnly = true,
            label = { Text(label) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(
                focusedContainerColor = RushNavySurface,
                unfocusedContainerColor = RushNavySurface,
                focusedBorderColor = RushPurplePrimary,
                unfocusedBorderColor = RushBorder
            ),
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.background(RushNavySurface)
        ) {
            options.forEach { selectionOption ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = selectionOption,
                            color = if (selectionOption == selectedOption) RushPurpleLight else RushTextPrimary,
                            fontWeight = if (selectionOption == selectedOption) FontWeight.Bold else FontWeight.Normal
                        )
                    },
                    onClick = {
                        onOptionSelected(selectionOption)
                        expanded = false
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                )
            }
        }
    }
}

@Composable
fun ConflictResolutionDialog(
    conflict: DataConflict,
    onKeepApp: () -> Unit,
    onKeepSheets: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Warning,
                    contentDescription = null,
                    tint = RushWarning
                )
                Text(
                    text = "Data Conflict Detected",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = RushTextPrimary
                )
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Information was modified both inside THE RUSH WAY App and in Google Sheets for ${conflict.recordType} ${conflict.recordId}.",
                    fontSize = 13.sp,
                    color = RushTextSecondary
                )

                Text(
                    text = "Field: ${conflict.fieldName}",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp,
                    color = RushPurpleLight
                )

                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurfaceVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("📱 Application Version:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RushPurpleLight)
                        Text(conflict.appValue, fontSize = 12.sp, color = RushTextPrimary)
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = RushNavySurfaceVariant),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("📊 Google Sheets Version:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RushSuccess)
                        Text(conflict.sheetsValue, fontSize = 12.sp, color = RushTextPrimary)
                    }
                }

                Text(
                    text = "Choose which version to preserve. Important coach decisions will not be silently overwritten.",
                    fontSize = 11.sp,
                    color = RushTextSecondary
                )
            }
        },
        confirmButton = {
            Button(
                onClick = onKeepApp,
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Keep App Version", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            OutlinedButton(
                onClick = onKeepSheets,
                border = androidx.compose.foundation.BorderStroke(1.dp, RushBorderPurple)
            ) {
                Text("Keep Google Sheets Version", color = RushTextPrimary)
            }
        }
    )
}
