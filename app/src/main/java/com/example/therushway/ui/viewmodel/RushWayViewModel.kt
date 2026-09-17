package com.example.therushway.ui.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.therushway.data.db.RushWayDao
import com.example.therushway.data.model.*
import com.example.therushway.data.pdf.PdfReportGenerator
import com.example.therushway.data.sheets.DataConflict
import com.example.therushway.data.sheets.GoogleSheetsManager
import com.example.therushway.data.sheets.SyncState
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class RushWayViewModel(
    private val dao: RushWayDao,
    private val sheetsManager: GoogleSheetsManager
) : ViewModel() {

    val allClients: StateFlow<List<ClientEntity>> = dao.getAllClients()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _selectedClientId = MutableStateFlow<String?>("TRW-0001")
    val selectedClientId: StateFlow<String?> = _selectedClientId.asStateFlow()

    val selectedClient: StateFlow<ClientEntity?> = combine(allClients, _selectedClientId) { clients, id ->
        clients.firstOrNull { it.id == id } ?: clients.firstOrNull()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val allMeasurements: StateFlow<List<MeasurementEntity>> = dao.getAllMeasurements()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val selectedClientMeasurements: StateFlow<List<MeasurementEntity>> = combine(allMeasurements, _selectedClientId) { list, id ->
        if (id == null) emptyList() else list.filter { it.clientId == id }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allWorkoutLogs: StateFlow<List<WorkoutLogEntity>> = dao.getAllWorkoutLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allNutritionLogs: StateFlow<List<NutritionLogEntity>> = combine(allClients, _selectedClientId) { _, id ->
        id ?: "TRW-0001"
    }.flatMapLatest { id ->
        dao.getAllNutritionLogsForClient(id)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allSupplements: StateFlow<List<SupplementEntity>> = dao.getAllSupplements()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allCheckIns: StateFlow<List<CheckInEntity>> = dao.getAllCheckIns()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val unreviewedCheckInCount: StateFlow<Int> = dao.getUnreviewedCheckInCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val syncLogs: StateFlow<List<SyncLogEntity>> = dao.getAllSyncLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val pendingSyncs: StateFlow<List<PendingSyncEntity>> = dao.getAllPendingSyncs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val syncState: StateFlow<SyncState> = sheetsManager.syncState
    val lastSyncTime: StateFlow<String> = sheetsManager.lastSyncTime
    val recordsSyncedCount: StateFlow<Int> = sheetsManager.recordsSyncedCount
    val errorsCount: StateFlow<Int> = sheetsManager.errorsCount
    val activeConflict: StateFlow<DataConflict?> = sheetsManager.activeConflict

    private val _statusMessage = MutableStateFlow<String?>(null)
    val statusMessage: StateFlow<String?> = _statusMessage.asStateFlow()

    private val _generatedPdfFile = MutableStateFlow<File?>(null)
    val generatedPdfFile: StateFlow<File?> = _generatedPdfFile.asStateFlow()

    fun selectClient(clientId: String) {
        _selectedClientId.value = clientId
    }

    fun clearStatusMessage() {
        _statusMessage.value = null
    }

    fun createClient(
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
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            // Generate next TRW ID
            val currentMax = allClients.value.mapNotNull {
                it.id.removePrefix("TRW-").toIntOrNull()
            }.maxOrNull() ?: 0
            val nextId = "TRW-%04d".format(nextMax(currentMax + 1))

            val newClient = ClientEntity(
                id = nextId,
                fullName = fullName,
                email = email,
                phone = phone,
                dateOfBirth = dateOfBirth,
                age = age,
                gender = gender,
                height = height,
                startingWeight = startingWeight,
                currentWeight = startingWeight,
                goal = goal,
                activityLevel = activityLevel,
                trainingExperience = trainingExperience,
                startDate = dateStr,
                currentProgram = currentProgram.ifBlank { "Standard Hypertrophy Protocol" },
                currentNutritionPlan = currentNutritionPlan.ifBlank { "Balanced Maintenance" },
                subscriptionStatus = subscriptionStatus,
                checkInFrequency = checkInFrequency,
                lastCheckIn = "None",
                nextCheckIn = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date(System.currentTimeMillis() + 7 * 86400000L)),
                coachNotes = coachNotes,
                status = "Active",
                isSynced = false
            )

            dao.insertClient(newClient)
            // Record initial baseline measurement
            dao.insertMeasurement(
                MeasurementEntity(
                    clientId = nextId,
                    date = dateStr,
                    weight = startingWeight,
                    waist = 0.0,
                    chest = 0.0,
                    arm = 0.0,
                    thigh = 0.0,
                    bodyFat = 0.0
                )
            )

            _selectedClientId.value = nextId
            _statusMessage.value = "Created $fullName ($nextId). Synchronizing with Google Sheets..."

            // Trigger sync
            triggerSyncNow()
        }
    }

    private fun nextMax(candidate: Int): Int = if (candidate < 1) 1 else candidate

    fun updateWeight(
        clientId: String,
        newWeight: Double,
        waist: Double = 0.0,
        chest: Double = 0.0,
        arm: Double = 0.0,
        thigh: Double = 0.0,
        bodyFat: Double = 0.0
    ) {
        viewModelScope.launch {
            val client = dao.getClientById(clientId) ?: return@launch
            val updated = client.copy(currentWeight = newWeight, isSynced = false, updatedAt = System.currentTimeMillis())
            dao.updateClient(updated)

            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            dao.insertMeasurement(
                MeasurementEntity(
                    clientId = clientId,
                    date = dateStr,
                    weight = newWeight,
                    waist = waist,
                    chest = chest,
                    arm = arm,
                    thigh = thigh,
                    bodyFat = bodyFat,
                    isSynced = false
                )
            )

            _statusMessage.value = "Weight updated to ${newWeight}kg for $clientId. Saved locally & syncing..."
            triggerSyncNow()
        }
    }

    fun logWorkout(
        clientId: String,
        exercise: String,
        muscle: String,
        sets: Int,
        reps: String,
        load: String,
        rpe: Double,
        rir: Int,
        tempo: String = "3-0-1-0",
        rest: String = "90s"
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val log = WorkoutLogEntity(
                clientId = clientId,
                programId = "PRG-ACTIVE",
                week = 1,
                day = 1,
                exercise = exercise,
                muscle = muscle,
                sets = sets,
                reps = reps,
                load = load,
                rir = rir,
                rpe = rpe,
                rest = rest,
                tempo = tempo,
                completion = "100%",
                date = dateStr,
                isSynced = false
            )
            dao.insertWorkoutLog(log)
            _statusMessage.value = "Logged workout set: $exercise ($load). Syncing to Workout Logs worksheet..."
            triggerSyncNow()
        }
    }

    fun submitCheckIn(
        clientId: String,
        weight: Double,
        measurements: String,
        trainingAdh: Int,
        nutritionAdh: Int,
        sleep: Int,
        energy: Int,
        stress: Int,
        hunger: Int,
        recovery: Int,
        performance: Int,
        comments: String
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val checkIn = CheckInEntity(
                clientId = clientId,
                date = dateStr,
                weight = weight,
                measurements = measurements,
                trainingAdherence = trainingAdh,
                nutritionAdherence = nutritionAdh,
                sleep = sleep,
                energy = energy,
                stress = stress,
                hunger = hunger,
                recovery = recovery,
                performance = performance,
                clientComments = comments,
                coachFeedback = "",
                isReviewed = false,
                isSynced = false
            )
            dao.insertCheckIn(checkIn)

            // Update client current weight and lastCheckIn
            val client = dao.getClientById(clientId)
            if (client != null) {
                dao.updateClient(client.copy(currentWeight = weight, lastCheckIn = dateStr))
            }

            _statusMessage.value = "NEW CHECK-IN submitted for $clientId. Added to Check-ins sheet."
            triggerSyncNow()
        }
    }

    fun reviewCheckIn(checkInId: Long, coachFeedback: String) {
        viewModelScope.launch {
            val checkIns = allCheckIns.value
            val target = checkIns.firstOrNull { it.id == checkInId } ?: return@launch
            dao.updateCheckIn(target.copy(coachFeedback = coachFeedback, isReviewed = true))
            _statusMessage.value = "Check-in reviewed. Coach feedback saved & synchronized."
            triggerSyncNow()
        }
    }

    fun addSupplement(
        clientId: String,
        name: String,
        dosage: String,
        timing: String,
        frequency: String,
        coachNotes: String
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            dao.insertClientSupplement(
                ClientSupplementEntity(
                    clientId = clientId,
                    supplementId = "SUP-" + System.currentTimeMillis().toString().takeLast(4),
                    supplementName = name,
                    dosage = dosage,
                    timing = timing,
                    frequency = frequency,
                    startDate = dateStr,
                    endDate = "Ongoing",
                    coachNotes = coachNotes
                )
            )
            _statusMessage.value = "Added supplement '$name' for $clientId. Synchronizing to Supplements sheet..."
            triggerSyncNow()
        }
    }

    fun connectGoogleAccount(token: String?, spreadsheetId: String) {
        viewModelScope.launch {
            _statusMessage.value = "Connecting to Google Spreadsheet..."
            val result = sheetsManager.testConnection(token, spreadsheetId)
            if (result.isSuccess) {
                sheetsManager.saveConnection(token, spreadsheetId)
                _statusMessage.value = "Google Sheets CONNECTED. Initiating data synchronization..."
                triggerSyncNow()
            } else {
                _statusMessage.value = "Connection failed: ${result.exceptionOrNull()?.message}"
            }
        }
    }

    fun createMasterSpreadsheet(token: String?) {
        viewModelScope.launch {
            _statusMessage.value = "Creating 'THE RUSH WAY — COACHING DATABASE' with 20 worksheets..."
            val result = sheetsManager.createMasterSpreadsheet(token)
            if (result.isSuccess) {
                val (id, _) = result.getOrThrow()
                _statusMessage.value = "Master Spreadsheet created (ID: $id). Performing full sync..."
                triggerSyncNow()
            } else {
                _statusMessage.value = "Creation error: ${result.exceptionOrNull()?.message}"
            }
        }
    }

    fun triggerSyncNow() {
        viewModelScope.launch {
            val clients = allClients.value
            val measurements = allMeasurements.value
            val workouts = allWorkoutLogs.value
            val nutritions = allNutritionLogs.value
            val checkins = allCheckIns.value
            val supplements = allSupplements.value

            val report = sheetsManager.synchronizeData(
                clients = clients,
                measurements = measurements,
                workoutLogs = workouts,
                nutritionLogs = nutritions,
                checkIns = checkins,
                supplements = supplements
            )

            _statusMessage.value = if (report.isSuccess) {
                "Synchronized ${report.recordsSynced} records with Google Sheets."
            } else {
                report.message
            }
        }
    }

    fun disconnectGoogle() {
        sheetsManager.disconnect()
        _statusMessage.value = "Disconnected from Google Sheets."
    }

    fun testConnection() {
        viewModelScope.launch {
            val token = sheetsManager.getOAuthToken()
            val id = sheetsManager.getSpreadsheetId()
            if (id.isNullOrBlank()) {
                _statusMessage.value = "No spreadsheet configured to test."
                return@launch
            }
            val result = sheetsManager.testConnection(token, id)
            _statusMessage.value = if (result.isSuccess) {
                result.getOrNull()
            } else {
                "Connection failed: ${result.exceptionOrNull()?.message}"
            }
        }
    }

    fun resolveConflict(conflict: DataConflict, keepAppVersion: Boolean) {
        viewModelScope.launch {
            sheetsManager.resolveConflict(conflict, keepAppVersion)
            _statusMessage.value = if (keepAppVersion) {
                "Conflict resolved: Retained App Version."
            } else {
                "Conflict resolved: Synchronized Sheets Version."
            }
            triggerSyncNow()
        }
    }

    fun simulateRemoteConflict(clientId: String) {
        sheetsManager.triggerSimulatedRemoteChange(clientId)
        _statusMessage.value = "Simulated remote edit in Google Sheets for $clientId. Tap 'SYNC NOW' to see two-way conflict detection."
    }

    fun generatePdfReport(context: Context, client: ClientEntity) {
        viewModelScope.launch {
            _statusMessage.value = "Generating THE RUSH WAY Professional PDF for ${client.fullName}..."
            try {
                val file = PdfReportGenerator.generateClientReportPdf(
                    context = context,
                    client = client,
                    measurements = selectedClientMeasurements.value,
                    programs = emptyList(),
                    workoutLogs = allWorkoutLogs.value.filter { it.clientId == client.id },
                    nutritionPlans = emptyList(),
                    supplements = emptyList(),
                    checkIns = allCheckIns.value.filter { it.clientId == client.id }
                )
                _generatedPdfFile.value = file
                _statusMessage.value = "PDF Generated: ${file.name}"
                PdfReportGenerator.openPdf(context, file)
            } catch (e: Exception) {
                _statusMessage.value = "PDF Generation failed: ${e.message}"
            }
        }
    }
}

class RushWayViewModelFactory(
    private val dao: RushWayDao,
    private val sheetsManager: GoogleSheetsManager
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RushWayViewModel::class.java)) {
            return RushWayViewModel(dao, sheetsManager) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
