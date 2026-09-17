package com.example.therushway.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "clients")
data class ClientEntity(
    @PrimaryKey val id: String, // e.g., "TRW-0001"
    val fullName: String,
    val email: String,
    val phone: String,
    val dateOfBirth: String,
    val age: Int,
    val gender: String,
    val height: String,
    val startingWeight: Double,
    val currentWeight: Double,
    val goal: String, // Fat Loss, Muscle Gain, Recomposition, Strength, Performance, Maintenance
    val activityLevel: String,
    val trainingExperience: String,
    val startDate: String,
    val currentProgram: String,
    val currentNutritionPlan: String,
    val subscriptionStatus: String, // Free, Premium, Expired, Trial
    val checkInFrequency: String, // Weekly, Bi-weekly, Monthly
    val lastCheckIn: String,
    val nextCheckIn: String,
    val coachNotes: String,
    val status: String, // Active, Paused, Inactive
    val updatedAt: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false
)

@Entity(tableName = "client_measurements")
data class MeasurementEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val date: String,
    val weight: Double,
    val waist: Double,
    val chest: Double,
    val arm: Double,
    val thigh: Double,
    val bodyFat: Double,
    val isSynced: Boolean = false
)

@Entity(tableName = "training_programs")
data class TrainingProgramEntity(
    @PrimaryKey val id: String, // e.g., "PRG-001"
    val clientId: String,
    val programName: String,
    val description: String,
    val totalWeeks: Int,
    val currentWeek: Int,
    val startDate: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "workouts")
data class WorkoutEntity(
    @PrimaryKey val id: String, // e.g., "WKT-001"
    val programId: String,
    val clientId: String,
    val week: Int,
    val day: Int,
    val workoutName: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "workout_exercises")
data class WorkoutExerciseEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val workoutId: String,
    val exerciseName: String,
    val muscle: String,
    val targetSets: Int,
    val targetReps: String,
    val targetLoad: String,
    val rir: Int,
    val rpe: Double,
    val rest: String,
    val tempo: String,
    val isCompleted: Boolean = false,
    val isSynced: Boolean = false
)

@Entity(tableName = "workout_logs")
data class WorkoutLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val programId: String,
    val week: Int,
    val day: Int,
    val exercise: String,
    val muscle: String,
    val sets: Int,
    val reps: String,
    val load: String,
    val rir: Int,
    val rpe: Double,
    val rest: String,
    val tempo: String,
    val completion: String, // "100%", "90%", etc.
    val date: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "nutrition_plans")
data class NutritionPlanEntity(
    @PrimaryKey val id: String, // e.g., "NUT-001"
    val clientId: String,
    val planName: String,
    val targetCalories: Int,
    val targetProtein: Int,
    val targetCarbohydrates: Int,
    val targetFat: Int,
    val targetFiber: Int,
    val startDate: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "nutrition_logs")
data class NutritionLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val nutritionPlanId: String,
    val date: String,
    val meal: String,
    val food: String,
    val quantity: String,
    val calories: Int,
    val protein: Int,
    val carbohydrates: Int,
    val fat: Int,
    val fiber: Int,
    val isSynced: Boolean = false
)

@Entity(tableName = "supplements")
data class SupplementEntity(
    @PrimaryKey val id: String, // e.g., "SUP-001"
    val name: String,
    val category: String,
    val purpose: String,
    val dosage: String,
    val timing: String,
    val frequency: String,
    val duration: String,
    val notes: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "client_supplements")
data class ClientSupplementEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val supplementId: String,
    val supplementName: String,
    val dosage: String,
    val timing: String,
    val frequency: String,
    val startDate: String,
    val endDate: String,
    val coachNotes: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "check_ins")
data class CheckInEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val date: String,
    val weight: Double,
    val measurements: String,
    val trainingAdherence: Int, // percentage 0-100
    val nutritionAdherence: Int, // percentage 0-100
    val sleep: Int, // 1-10
    val energy: Int, // 1-10
    val stress: Int, // 1-10
    val hunger: Int, // 1-10
    val recovery: Int, // 1-10
    val performance: Int, // 1-10
    val clientComments: String,
    val coachFeedback: String = "",
    val isReviewed: Boolean = false,
    val isSynced: Boolean = false
)

@Entity(tableName = "fitness_tests")
data class FitnessTestEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val testName: String,
    val date: String,
    val score: String,
    val unit: String,
    val notes: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "coach_notes")
data class CoachNoteEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val clientId: String,
    val date: String,
    val title: String,
    val content: String,
    val category: String,
    val isSynced: Boolean = false
)

@Entity(tableName = "sync_logs")
data class SyncLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val dateTime: String,
    val action: String,
    val recordType: String,
    val recordId: String,
    val direction: String, // "App → Sheets" or "Sheets → App"
    val status: String, // "Success", "Error", "Pending", "Conflict"
    val errorMessage: String = ""
)

@Entity(tableName = "pending_syncs")
data class PendingSyncEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val recordType: String,
    val recordId: String,
    val action: String, // "CREATE", "UPDATE", "DELETE"
    val payloadJson: String,
    val createdAt: Long = System.currentTimeMillis()
)
