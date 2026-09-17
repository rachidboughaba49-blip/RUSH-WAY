package com.example.therushway.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.therushway.data.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        ClientEntity::class,
        MeasurementEntity::class,
        TrainingProgramEntity::class,
        WorkoutEntity::class,
        WorkoutExerciseEntity::class,
        WorkoutLogEntity::class,
        NutritionPlanEntity::class,
        NutritionLogEntity::class,
        SupplementEntity::class,
        ClientSupplementEntity::class,
        CheckInEntity::class,
        FitnessTestEntity::class,
        CoachNoteEntity::class,
        SyncLogEntity::class,
        PendingSyncEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class RushWayDatabase : RoomDatabase() {
    abstract fun rushWayDao(): RushWayDao
    fun dao(): RushWayDao = rushWayDao()

    companion object {
        @Volatile
        private var INSTANCE: RushWayDatabase? = null

        fun getInstance(context: Context): RushWayDatabase {
            return getDatabase(context, CoroutineScope(Dispatchers.IO))
        }

        fun getDatabase(context: Context, scope: CoroutineScope): RushWayDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    RushWayDatabase::class.java,
                    "rush_way_coaching.db"
                )
                    .addCallback(RushWayDatabaseCallback(scope))
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class RushWayDatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database.rushWayDao())
                    }
                }
            }
        }

        private suspend fun populateInitialData(dao: RushWayDao) {
            // Seed clients
            val client1 = ClientEntity(
                id = "TRW-0001",
                fullName = "Marcus Sterling",
                email = "marcus.sterling@example.com",
                phone = "+1 (555) 234-5678",
                dateOfBirth = "1994-05-12",
                age = 32,
                gender = "Male",
                height = "183 cm",
                startingWeight = 94.5,
                currentWeight = 88.2,
                goal = "Fat Loss",
                activityLevel = "Very Active",
                trainingExperience = "Advanced (5+ yrs)",
                startDate = "2026-06-01",
                currentProgram = "Hypertrophy Cut Phase II",
                currentNutritionPlan = "High Protein Deficit 2400",
                subscriptionStatus = "Premium",
                checkInFrequency = "Weekly",
                lastCheckIn = "2026-09-10",
                nextCheckIn = "2026-09-17",
                coachNotes = "Focus on explosive leg drive and sleep recovery protocol.",
                status = "Active",
                isSynced = false
            )

            val client2 = ClientEntity(
                id = "TRW-0002",
                fullName = "Elena Vance",
                email = "elena.vance@example.com",
                phone = "+1 (555) 876-5432",
                dateOfBirth = "1998-11-20",
                age = 27,
                gender = "Female",
                height = "168 cm",
                startingWeight = 62.0,
                currentWeight = 64.8,
                goal = "Muscle Gain",
                activityLevel = "Moderate",
                trainingExperience = "Intermediate (2-4 yrs)",
                startDate = "2026-07-15",
                currentProgram = "Glute & Posterior Chain Hypertrophy",
                currentNutritionPlan = "Lean Surplus 2250",
                subscriptionStatus = "Premium",
                checkInFrequency = "Weekly",
                lastCheckIn = "2026-09-12",
                nextCheckIn = "2026-09-19",
                coachNotes = "Squat depth improved. Add 2.5kg to hip thrust next week.",
                status = "Active",
                isSynced = false
            )

            val client3 = ClientEntity(
                id = "TRW-0003",
                fullName = "David Kalu",
                email = "david.kalu@example.com",
                phone = "+1 (555) 345-9876",
                dateOfBirth = "1991-03-08",
                age = 35,
                gender = "Male",
                height = "178 cm",
                startingWeight = 82.0,
                currentWeight = 81.5,
                goal = "Recomposition",
                activityLevel = "Active",
                trainingExperience = "Advanced (6+ yrs)",
                startDate = "2026-08-01",
                currentProgram = "Powerbuilding 4-Day Split",
                currentNutritionPlan = "Iso-Caloric Performance 2700",
                subscriptionStatus = "Trial",
                checkInFrequency = "Weekly",
                lastCheckIn = "2026-09-08",
                nextCheckIn = "2026-09-15",
                coachNotes = "Review shoulder mobility drills before pressing.",
                status = "Active",
                isSynced = false
            )

            dao.insertClient(client1)
            dao.insertClient(client2)
            dao.insertClient(client3)

            // Seed measurements
            dao.insertMeasurement(
                MeasurementEntity(
                    clientId = "TRW-0001",
                    date = "2026-06-01",
                    weight = 94.5,
                    waist = 96.0,
                    chest = 108.0,
                    arm = 39.0,
                    thigh = 63.0,
                    bodyFat = 22.4
                )
            )
            dao.insertMeasurement(
                MeasurementEntity(
                    clientId = "TRW-0001",
                    date = "2026-07-15",
                    weight = 91.0,
                    waist = 91.5,
                    chest = 107.5,
                    arm = 39.5,
                    thigh = 62.0,
                    bodyFat = 19.2
                )
            )
            dao.insertMeasurement(
                MeasurementEntity(
                    clientId = "TRW-0001",
                    date = "2026-09-10",
                    weight = 88.2,
                    waist = 87.0,
                    chest = 107.0,
                    arm = 40.0,
                    thigh = 61.5,
                    bodyFat = 16.5
                )
            )

            // Seed Training Program & Workouts
            dao.insertProgram(
                TrainingProgramEntity(
                    id = "PRG-001",
                    clientId = "TRW-0001",
                    programName = "Hypertrophy Cut Phase II",
                    description = "High density 4-day upper/lower split focusing on metabolic stress and mechanical tension preservation.",
                    totalWeeks = 12,
                    currentWeek = 8,
                    startDate = "2026-07-20"
                )
            )

            dao.insertWorkout(
                WorkoutEntity(
                    id = "WKT-001",
                    programId = "PRG-001",
                    clientId = "TRW-0001",
                    week = 8,
                    day = 1,
                    workoutName = "Upper Body Heavy Strength"
                )
            )

            dao.insertWorkoutLog(
                WorkoutLogEntity(
                    clientId = "TRW-0001",
                    programId = "PRG-001",
                    week = 8,
                    day = 1,
                    exercise = "Barbell Incline Bench Press",
                    muscle = "Upper Chest / Triceps",
                    sets = 4,
                    reps = "8, 8, 7, 6",
                    load = "92.5 kg",
                    rir = 1,
                    rpe = 9.0,
                    rest = "120s",
                    tempo = "3-1-1-0",
                    completion = "100%",
                    date = "2026-09-14"
                )
            )
            dao.insertWorkoutLog(
                WorkoutLogEntity(
                    clientId = "TRW-0001",
                    programId = "PRG-001",
                    week = 8,
                    day = 1,
                    exercise = "Weighted Pull-Ups",
                    muscle = "Lats / Biceps",
                    sets = 4,
                    reps = "6, 6, 5, 5",
                    load = "+15 kg",
                    rir = 2,
                    rpe = 8.5,
                    rest = "90s",
                    tempo = "2-1-1-1",
                    completion = "100%",
                    date = "2026-09-14"
                )
            )

            // Seed Nutrition Plan & Logs
            dao.insertNutritionPlan(
                NutritionPlanEntity(
                    id = "NUT-001",
                    clientId = "TRW-0001",
                    planName = "High Protein Deficit 2400",
                    targetCalories = 2400,
                    targetProtein = 210,
                    targetCarbohydrates = 220,
                    targetFat = 65,
                    targetFiber = 35,
                    startDate = "2026-06-01"
                )
            )

            dao.insertNutritionLog(
                NutritionLogEntity(
                    clientId = "TRW-0001",
                    nutritionPlanId = "NUT-001",
                    date = "2026-09-16",
                    meal = "Breakfast",
                    food = "Egg White Omelet & Steel Cut Oats",
                    quantity = "1 bowl + 4 whites",
                    calories = 520,
                    protein = 48,
                    carbohydrates = 55,
                    fat = 12,
                    fiber = 8
                )
            )
            dao.insertNutritionLog(
                NutritionLogEntity(
                    clientId = "TRW-0001",
                    nutritionPlanId = "NUT-001",
                    date = "2026-09-16",
                    meal = "Post-Workout Lunch",
                    food = "Grilled Chicken Breast, Jasmine Rice & Broccoli",
                    quantity = "220g chicken, 200g rice",
                    calories = 680,
                    protein = 62,
                    carbohydrates = 78,
                    fat = 10,
                    fiber = 6
                )
            )

            // Seed Supplements & Client Supplements
            val sup1 = SupplementEntity(
                id = "SUP-001",
                name = "Creatine Monohydrate",
                category = "Performance",
                purpose = "ATP regeneration & muscle cell hydration",
                dosage = "5g",
                timing = "Post-workout or morning",
                frequency = "Daily",
                duration = "Ongoing",
                notes = "Creapure quality grade"
            )
            val sup2 = SupplementEntity(
                id = "SUP-002",
                name = "Omega-3 Triglyceride",
                category = "Health / Recovery",
                purpose = "Cardiovascular & joint inflammation support",
                dosage = "2000mg (1000mg EPA/DHA)",
                timing = "With meal 1",
                frequency = "Daily",
                duration = "Ongoing",
                notes = "High purity molecularly distilled"
            )
            val sup3 = SupplementEntity(
                id = "SUP-003",
                name = "Whey Protein Isolate",
                category = "Nutrition",
                purpose = "Rapid muscle protein synthesis",
                dosage = "30g",
                timing = "Post-workout",
                frequency = "Training Days",
                duration = "Ongoing",
                notes = "Grass-fed unflavored"
            )
            dao.insertSupplement(sup1)
            dao.insertSupplement(sup2)
            dao.insertSupplement(sup3)

            dao.insertClientSupplement(
                ClientSupplementEntity(
                    clientId = "TRW-0001",
                    supplementId = "SUP-001",
                    supplementName = "Creatine Monohydrate",
                    dosage = "5g",
                    timing = "Post-workout",
                    frequency = "Daily",
                    startDate = "2026-06-01",
                    endDate = "Ongoing",
                    coachNotes = "Take consistently with carbohydrate source for enhanced uptake."
                )
            )
            dao.insertClientSupplement(
                ClientSupplementEntity(
                    clientId = "TRW-0001",
                    supplementId = "SUP-002",
                    supplementName = "Omega-3 Triglyceride",
                    dosage = "2000mg",
                    timing = "With Breakfast",
                    frequency = "Daily",
                    startDate = "2026-06-01",
                    endDate = "Ongoing",
                    coachNotes = "Supports joints during heavy cutting cycles."
                )
            )

            // Seed Check-ins (one unreviewed with NEW CHECK-IN status)
            dao.insertCheckIn(
                CheckInEntity(
                    clientId = "TRW-0001",
                    date = "2026-09-17",
                    weight = 88.0,
                    measurements = "Waist: 86.5cm, Arm: 40.2cm",
                    trainingAdherence = 95,
                    nutritionAdherence = 92,
                    sleep = 8,
                    energy = 8,
                    stress = 4,
                    hunger = 6,
                    recovery = 9,
                    performance = 9,
                    clientComments = "Hit a new personal record on incline press! Feeling dialed in, energy was steady all week.",
                    coachFeedback = "",
                    isReviewed = false
                )
            )
            dao.insertCheckIn(
                CheckInEntity(
                    clientId = "TRW-0002",
                    date = "2026-09-12",
                    weight = 64.8,
                    measurements = "Waist: 67cm, Hip: 98cm",
                    trainingAdherence = 100,
                    nutritionAdherence = 96,
                    sleep = 7,
                    energy = 8,
                    stress = 3,
                    hunger = 5,
                    recovery = 8,
                    performance = 9,
                    clientComments = "Felt great on barbell squats. Glute pumps were unreal.",
                    coachFeedback = "Phenomenal work Elena! Increased hip thrust target by 2.5kg. Keep nutrition on point.",
                    isReviewed = true
                )
            )

            // Seed initial sync log
            dao.insertSyncLog(
                SyncLogEntity(
                    dateTime = "2026-09-17 08:30:15",
                    action = "System Initialized",
                    recordType = "Database",
                    recordId = "TRW-INIT",
                    direction = "App → Local",
                    status = "Success",
                    errorMessage = ""
                )
            )
        }
    }
}
