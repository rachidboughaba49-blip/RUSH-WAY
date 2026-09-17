package com.example.therushway.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.therushway.data.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface RushWayDao {

    // Clients
    @Query("SELECT * FROM clients ORDER BY id ASC")
    fun getAllClients(): Flow<List<ClientEntity>>

    @Query("SELECT * FROM clients WHERE id = :id LIMIT 1")
    suspend fun getClientById(id: String): ClientEntity?

    @Query("SELECT id FROM clients ORDER BY id DESC LIMIT 1")
    suspend fun getLatestClientId(): String?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClient(client: ClientEntity)

    @Update
    suspend fun updateClient(client: ClientEntity)

    @Query("DELETE FROM clients WHERE id = :id")
    suspend fun deleteClient(id: String)

    // Measurements
    @Query("SELECT * FROM client_measurements WHERE clientId = :clientId ORDER BY id DESC")
    fun getMeasurementsForClient(clientId: String): Flow<List<MeasurementEntity>>

    @Query("SELECT * FROM client_measurements ORDER BY id DESC")
    fun getAllMeasurements(): Flow<List<MeasurementEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeasurement(measurement: MeasurementEntity): Long

    // Training Programs
    @Query("SELECT * FROM training_programs WHERE clientId = :clientId")
    fun getProgramsForClient(clientId: String): Flow<List<TrainingProgramEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProgram(program: TrainingProgramEntity)

    // Workouts
    @Query("SELECT * FROM workouts WHERE programId = :programId")
    fun getWorkoutsForProgram(programId: String): Flow<List<WorkoutEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkout(workout: WorkoutEntity)

    // Workout Logs
    @Query("SELECT * FROM workout_logs WHERE clientId = :clientId ORDER BY id DESC")
    fun getWorkoutLogsForClient(clientId: String): Flow<List<WorkoutLogEntity>>

    @Query("SELECT * FROM workout_logs ORDER BY id DESC")
    fun getAllWorkoutLogs(): Flow<List<WorkoutLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkoutLog(log: WorkoutLogEntity): Long

    // Nutrition Plans
    @Query("SELECT * FROM nutrition_plans WHERE clientId = :clientId")
    fun getNutritionPlansForClient(clientId: String): Flow<List<NutritionPlanEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNutritionPlan(plan: NutritionPlanEntity)

    // Nutrition Logs
    @Query("SELECT * FROM nutrition_logs WHERE clientId = :clientId AND date = :date")
    fun getNutritionLogsForDate(clientId: String, date: String): Flow<List<NutritionLogEntity>>

    @Query("SELECT * FROM nutrition_logs WHERE clientId = :clientId ORDER BY id DESC")
    fun getAllNutritionLogsForClient(clientId: String): Flow<List<NutritionLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNutritionLog(log: NutritionLogEntity): Long

    // Supplements
    @Query("SELECT * FROM supplements")
    fun getAllSupplements(): Flow<List<SupplementEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSupplement(supplement: SupplementEntity)

    // Client Supplements
    @Query("SELECT * FROM client_supplements WHERE clientId = :clientId")
    fun getSupplementsForClient(clientId: String): Flow<List<ClientSupplementEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClientSupplement(cs: ClientSupplementEntity): Long

    // Check-ins
    @Query("SELECT * FROM check_ins ORDER BY id DESC")
    fun getAllCheckIns(): Flow<List<CheckInEntity>>

    @Query("SELECT * FROM check_ins WHERE clientId = :clientId ORDER BY id DESC")
    fun getCheckInsForClient(clientId: String): Flow<List<CheckInEntity>>

    @Query("SELECT COUNT(*) FROM check_ins WHERE isReviewed = 0")
    fun getUnreviewedCheckInCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCheckIn(checkIn: CheckInEntity): Long

    @Update
    suspend fun updateCheckIn(checkIn: CheckInEntity)

    // Fitness Tests
    @Query("SELECT * FROM fitness_tests WHERE clientId = :clientId ORDER BY id DESC")
    fun getFitnessTestsForClient(clientId: String): Flow<List<FitnessTestEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFitnessTest(test: FitnessTestEntity): Long

    // Coach Notes
    @Query("SELECT * FROM coach_notes WHERE clientId = :clientId ORDER BY id DESC")
    fun getCoachNotesForClient(clientId: String): Flow<List<CoachNoteEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCoachNote(note: CoachNoteEntity): Long

    // Sync Logs
    @Query("SELECT * FROM sync_logs ORDER BY id DESC LIMIT 100")
    fun getAllSyncLogs(): Flow<List<SyncLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSyncLog(syncLog: SyncLogEntity): Long

    @Query("DELETE FROM sync_logs")
    suspend fun clearSyncLogs()

    // Pending Syncs (Offline Queue)
    @Query("SELECT * FROM pending_syncs ORDER BY id ASC")
    fun getAllPendingSyncs(): Flow<List<PendingSyncEntity>>

    @Query("SELECT * FROM pending_syncs ORDER BY id ASC")
    suspend fun getPendingSyncsList(): List<PendingSyncEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPendingSync(pending: PendingSyncEntity): Long

    @Query("DELETE FROM pending_syncs WHERE id = :id")
    suspend fun deletePendingSync(id: Long)

    @Query("DELETE FROM pending_syncs")
    suspend fun clearAllPendingSyncs()
}
