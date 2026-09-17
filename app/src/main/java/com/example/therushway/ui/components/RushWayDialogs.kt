package com.example.therushway.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.data.model.CheckInEntity
import com.example.therushway.data.model.ClientEntity
import com.example.therushway.data.sheets.GoogleSheetsConstants
import com.example.ui.theme.*

@Composable
fun AddClientDialog(
    onDismiss: () -> Unit,
    onConfirm: (
        fullName: String,
        email: String,
        phone: String,
        dateOfBirth: String,
        age: Int,
        gender: String,
        height: String,
        startingWeight: Double,
        goal: String,
        activityLevel: String,
        trainingExperience: String,
        currentProgram: String,
        currentNutritionPlan: String,
        subscriptionStatus: String,
        checkInFrequency: String,
        coachNotes: String
    ) -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var dateOfBirth by remember { mutableStateOf("1996-04-15") }
    var ageStr by remember { mutableStateOf("30") }
    var gender by remember { mutableStateOf("Male") }
    var height by remember { mutableStateOf("180 cm") }
    var weightStr by remember { mutableStateOf("85.0") }
    var goal by remember { mutableStateOf(GoogleSheetsConstants.GOAL_OPTIONS[0]) }
    var activityLevel by remember { mutableStateOf("Very Active") }
    var trainingExperience by remember { mutableStateOf("Intermediate (2-4 yrs)") }
    var currentProgram by remember { mutableStateOf("Hypertrophy Block A") }
    var currentNutritionPlan by remember { mutableStateOf("High Protein Deficit 2500") }
    var subscriptionStatus by remember { mutableStateOf(GoogleSheetsConstants.SUBSCRIPTION_OPTIONS[1]) } // Premium
    var checkInFrequency by remember { mutableStateOf(GoogleSheetsConstants.CHECK_IN_FREQUENCIES[0]) } // Weekly
    var coachNotes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                RushWayEmblem(size = 32.dp)
                Column {
                    Text("Create Athlete Profile", fontWeight = FontWeight.Black, fontSize = 18.sp, color = RushTextPrimary)
                    Text("Assigned TRW ID & synchronized to Sheets", fontSize = 11.sp, color = RushPurpleLight)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Name *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email *") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = RushPurplePrimary,
                            focusedLabelColor = RushPurpleLight
                        ),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("Phone") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = RushPurplePrimary,
                            focusedLabelColor = RushPurpleLight
                        ),
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = ageStr,
                        onValueChange = { ageStr = it },
                        label = { Text("Age") },
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = height,
                        onValueChange = { height = it },
                        label = { Text("Height") },
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = weightStr,
                        onValueChange = { weightStr = it },
                        label = { Text("Weight (kg)") },
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )
                }

                // Data Validation Dropdowns
                SimpleDropdownMenu(
                    label = "Goal (Google Sheets Validated)",
                    options = GoogleSheetsConstants.GOAL_OPTIONS,
                    selectedOption = goal,
                    onOptionSelected = { goal = it }
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    SimpleDropdownMenu(
                        label = "Subscription",
                        options = GoogleSheetsConstants.SUBSCRIPTION_OPTIONS,
                        selectedOption = subscriptionStatus,
                        onOptionSelected = { subscriptionStatus = it },
                        modifier = Modifier.weight(1f)
                    )
                    SimpleDropdownMenu(
                        label = "Check-in Frequency",
                        options = GoogleSheetsConstants.CHECK_IN_FREQUENCIES,
                        selectedOption = checkInFrequency,
                        onOptionSelected = { checkInFrequency = it },
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = currentProgram,
                    onValueChange = { currentProgram = it },
                    label = { Text("Assigned Training Program") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = currentNutritionPlan,
                    onValueChange = { currentNutritionPlan = it },
                    label = { Text("Assigned Nutrition Plan") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = coachNotes,
                    onValueChange = { coachNotes = it },
                    label = { Text("Coach Initial Notes") },
                    maxLines = 3,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (fullName.isNotBlank()) {
                        val age = ageStr.toIntOrNull() ?: 30
                        val weight = weightStr.toDoubleOrNull() ?: 80.0
                        onConfirm(
                            fullName, email, phone, dateOfBirth, age, gender, height,
                            weight, goal, activityLevel, trainingExperience,
                            currentProgram, currentNutritionPlan, subscriptionStatus,
                            checkInFrequency, coachNotes
                        )
                    }
                },
                enabled = fullName.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Create & Sync Athlete", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = RushTextSecondary)
            }
        }
    )
}

@Composable
fun UpdateWeightDialog(
    client: ClientEntity,
    onDismiss: () -> Unit,
    onConfirm: (weight: Double, waist: Double, chest: Double, arm: Double, thigh: Double, bodyFat: Double) -> Unit
) {
    var weightStr by remember { mutableStateOf(client.currentWeight.toString()) }
    var waistStr by remember { mutableStateOf("") }
    var chestStr by remember { mutableStateOf("") }
    var armStr by remember { mutableStateOf("") }
    var thighStr by remember { mutableStateOf("") }
    var bodyFatStr by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RushWayEmblem(size = 28.dp)
                Text("Record New Measurement", fontWeight = FontWeight.Bold, color = RushTextPrimary)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    "Athlete: ${client.fullName} (${client.id})\nMeasurements append to historical log (never overwritten).",
                    fontSize = 12.sp,
                    color = RushTextSecondary
                )

                OutlinedTextField(
                    value = weightStr,
                    onValueChange = { weightStr = it },
                    label = { Text("Current Weight (kg) *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = waistStr,
                        onValueChange = { waistStr = it },
                        label = { Text("Waist (cm)") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = chestStr,
                        onValueChange = { chestStr = it },
                        label = { Text("Chest (cm)") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = armStr,
                        onValueChange = { armStr = it },
                        label = { Text("Arm (cm)") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = thighStr,
                        onValueChange = { thighStr = it },
                        label = { Text("Thigh (cm)") },
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = bodyFatStr,
                    onValueChange = { bodyFatStr = it },
                    label = { Text("Body Fat %") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val w = weightStr.toDoubleOrNull() ?: client.currentWeight
                    val waist = waistStr.toDoubleOrNull() ?: 0.0
                    val chest = chestStr.toDoubleOrNull() ?: 0.0
                    val arm = armStr.toDoubleOrNull() ?: 0.0
                    val thigh = thighStr.toDoubleOrNull() ?: 0.0
                    val bf = bodyFatStr.toDoubleOrNull() ?: 0.0
                    onConfirm(w, waist, chest, arm, thigh, bf)
                },
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Save & Sync Measurement", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = RushTextSecondary) }
        }
    )
}

@Composable
fun LogWorkoutDialog(
    clientId: String,
    onDismiss: () -> Unit,
    onConfirm: (exercise: String, muscle: String, sets: Int, reps: String, load: String, rpe: Double, rir: Int, tempo: String, rest: String) -> Unit
) {
    var exercise by remember { mutableStateOf("Barbell Back Squat") }
    var muscle by remember { mutableStateOf("Quads / Glutes") }
    var setsStr by remember { mutableStateOf("4") }
    var reps by remember { mutableStateOf("8, 8, 7, 6") }
    var load by remember { mutableStateOf("120 kg") }
    var rpeStr by remember { mutableStateOf("8.5") }
    var rirStr by remember { mutableStateOf("1") }
    var tempo by remember { mutableStateOf("3-1-1-0") }
    var rest by remember { mutableStateOf("120s") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RushWayEmblem(size = 28.dp)
                Text("Log Completed Workout Set", fontWeight = FontWeight.Bold, color = RushTextPrimary)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text("Athlete: $clientId • Synchronizes to Workout Logs worksheet", fontSize = 12.sp, color = RushTextSecondary)

                OutlinedTextField(
                    value = exercise,
                    onValueChange = { exercise = it },
                    label = { Text("Exercise Name") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = muscle,
                    onValueChange = { muscle = it },
                    label = { Text("Target Muscle") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = setsStr,
                        onValueChange = { setsStr = it },
                        label = { Text("Sets") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = reps,
                        onValueChange = { reps = it },
                        label = { Text("Reps") },
                        modifier = Modifier.weight(1.5f)
                    )
                    OutlinedTextField(
                        value = load,
                        onValueChange = { load = it },
                        label = { Text("Load") },
                        modifier = Modifier.weight(1.5f)
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = rpeStr,
                        onValueChange = { rpeStr = it },
                        label = { Text("RPE (1-10)") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = rirStr,
                        onValueChange = { rirStr = it },
                        label = { Text("RIR") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = tempo,
                        onValueChange = { tempo = it },
                        label = { Text("Tempo") },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val sets = setsStr.toIntOrNull() ?: 3
                    val rpe = rpeStr.toDoubleOrNull() ?: 8.0
                    val rir = rirStr.toIntOrNull() ?: 1
                    onConfirm(exercise, muscle, sets, reps, load, rpe, rir, tempo, rest)
                },
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Log Workout", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = RushTextSecondary) }
        }
    )
}

@Composable
fun CheckInReviewDialog(
    checkIn: CheckInEntity,
    onDismiss: () -> Unit,
    onSaveFeedback: (feedback: String) -> Unit
) {
    var feedback by remember { mutableStateOf(checkIn.coachFeedback) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                RushWayEmblem(size = 28.dp)
                Text("Review Athlete Check-in", fontWeight = FontWeight.Bold, color = RushTextPrimary)
                if (!checkIn.isReviewed) {
                    Surface(color = RushCrimson, shape = MaterialTheme.shapes.extraSmall) {
                        Text("NEW CHECK-IN", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text("Date: ${checkIn.date} • Athlete: ${checkIn.clientId}", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = RushPurpleLight)
                Text("Recorded Weight: ${checkIn.weight} kg", fontSize = 13.sp, color = RushTextPrimary)

                Card(colors = CardDefaults.cardColors(containerColor = RushNavySurfaceVariant)) {
                    Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("Weekly Metrics:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RushPurpleGlow)
                        Text("• Training Adherence: ${checkIn.trainingAdherence}%", fontSize = 12.sp)
                        Text("• Nutrition Adherence: ${checkIn.nutritionAdherence}%", fontSize = 12.sp)
                        Text("• Sleep: ${checkIn.sleep}/10 | Energy: ${checkIn.energy}/10", fontSize = 12.sp)
                        Text("• Stress: ${checkIn.stress}/10 | Recovery: ${checkIn.recovery}/10", fontSize = 12.sp)
                    }
                }

                if (checkIn.clientComments.isNotBlank()) {
                    Text("Athlete Comments:", fontWeight = FontWeight.SemiBold, fontSize = 12.sp, color = RushTextSecondary)
                    Text("\"${checkIn.clientComments}\"", fontSize = 12.sp, color = RushTextPrimary)
                }

                Divider(color = RushBorder)

                Text("Coach Feedback & Action Plan:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RushPurpleLight)
                OutlinedTextField(
                    value = feedback,
                    onValueChange = { feedback = it },
                    placeholder = { Text("Write feedback, training/nutrition adjustments...") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3,
                    maxLines = 5
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onSaveFeedback(feedback) },
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Save Feedback & Sync", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Close", color = RushTextSecondary) }
        }
    )
}

@Composable
fun GoogleConnectDialog(
    currentSpreadsheetId: String?,
    onDismiss: () -> Unit,
    onConnect: (token: String?, spreadsheetId: String) -> Unit,
    onCreateMaster: (token: String?) -> Unit
) {
    var token by remember { mutableStateOf("") }
    var spreadsheetId by remember { mutableStateOf(currentSpreadsheetId ?: "") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RushWayEmblem(size = 30.dp)
                Text("Google Sheets Connection", fontWeight = FontWeight.Black, color = RushTextPrimary)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    "Connect Google account securely via OAuth. Master workbook functions as data-management & reporting layer.",
                    fontSize = 12.sp,
                    color = RushTextSecondary
                )

                OutlinedTextField(
                    value = token,
                    onValueChange = { token = it },
                    label = { Text("Google OAuth Token (Optional)") },
                    placeholder = { Text("Enter token or leave blank for connected mode") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = spreadsheetId,
                    onValueChange = { spreadsheetId = it },
                    label = { Text("Existing Spreadsheet ID / URL") },
                    placeholder = { Text("e.g. 1AbC-dEfGh...") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Divider(color = RushBorder)

                Text(
                    "Or automatically create a new workbook:",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 12.sp,
                    color = RushPurpleLight
                )

                Button(
                    onClick = { onCreateMaster(token.ifBlank { null }) },
                    colors = ButtonDefaults.buttonColors(containerColor = RushDeepPurple),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.AddBox, contentDescription = null, modifier = Modifier.size(18.dp), tint = Color.White)
                    Spacer(Modifier.width(6.dp))
                    Text("Create Master 'THE RUSH WAY' Sheet (20 Tabs)", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 12.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val finalId = spreadsheetId.ifBlank { "THE_RUSH_WAY_MASTER_DB" }
                    onConnect(token.ifBlank { null }, finalId)
                },
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Connect", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = RushTextSecondary) }
        }
    )
}

@Composable
fun AddSupplementDialog(
    clientId: String,
    onDismiss: () -> Unit,
    onConfirm: (name: String, dosage: String, timing: String, frequency: String, coachNotes: String) -> Unit
) {
    var name by remember { mutableStateOf("Creatine Monohydrate") }
    var dosage by remember { mutableStateOf("5g") }
    var timing by remember { mutableStateOf("Post-workout with carbs") }
    var frequency by remember { mutableStateOf("Daily") }
    var coachNotes by remember { mutableStateOf("Enhances ATP replenishment and intracellular hydration.") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = RushNavySurface,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RushWayEmblem(size = 28.dp)
                Text("Add Athlete Supplement", fontWeight = FontWeight.Bold, color = RushTextPrimary)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text("Athlete: $clientId • Synchronizes to Worksheets 11 & 12", fontSize = 12.sp, color = RushTextSecondary)

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Supplement Name *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RushPurplePrimary,
                        focusedLabelColor = RushPurpleLight
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = dosage,
                        onValueChange = { dosage = it },
                        label = { Text("Dosage") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = frequency,
                        onValueChange = { frequency = it },
                        label = { Text("Frequency") },
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = timing,
                    onValueChange = { timing = it },
                    label = { Text("Timing") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = coachNotes,
                    onValueChange = { coachNotes = it },
                    label = { Text("Coach Notes & Purpose") },
                    maxLines = 3,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        onConfirm(name, dosage, timing, frequency, coachNotes)
                    }
                },
                enabled = name.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = RushPurplePrimary)
            ) {
                Text("Save & Sync Protocol", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = RushTextSecondary) }
        }
    )
}
