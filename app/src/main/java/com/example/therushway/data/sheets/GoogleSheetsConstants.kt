package com.example.therushway.data.sheets

object GoogleSheetsConstants {
    const val MASTER_SPREADSHEET_TITLE = "THE RUSH WAY — COACHING DATABASE"

    // 20 Worksheets specified in requirements
    val WORKSHEET_NAMES = listOf(
        "Clients",
        "Client Measurements",
        "Training Programs",
        "Workouts",
        "Workout Exercises",
        "Workout Logs",
        "Nutrition Plans",
        "Meals",
        "Foods",
        "Nutrition Logs",
        "Supplements",
        "Cardio",
        "Progress",
        "Check-ins",
        "Fitness Tests",
        "Coach Notes",
        "Payments / Subscriptions",
        "Reports",
        "Exercise Library",
        "Program Templates"
    )

    // Column headers for all sheets
    val CLIENTS_HEADERS = listOf(
        "Client ID", "Full Name", "Email", "Phone", "Date of Birth", "Age", "Gender",
        "Height", "Starting Weight", "Current Weight", "Goal", "Activity Level",
        "Training Experience", "Start Date", "Current Program", "Current Nutrition Plan",
        "Subscription Status", "Check-in Frequency", "Last Check-in", "Next Check-in",
        "Coach Notes", "Status"
    )

    val MEASUREMENTS_HEADERS = listOf(
        "Date", "Client ID", "Weight (kg)", "Waist (cm)", "Chest (cm)",
        "Arm (cm)", "Thigh (cm)", "Body Fat (%)"
    )

    val TRAINING_PROGRAMS_HEADERS = listOf(
        "Program ID", "Client ID", "Program Name", "Description",
        "Total Weeks", "Current Week", "Start Date"
    )

    val WORKOUTS_HEADERS = listOf(
        "Workout ID", "Program ID", "Client ID", "Week", "Day", "Workout Name"
    )

    val WORKOUT_EXERCISES_HEADERS = listOf(
        "Exercise ID", "Workout ID", "Exercise Name", "Muscle Group",
        "Target Sets", "Target Reps", "Target Load", "RIR", "RPE",
        "Rest", "Tempo", "Completed"
    )

    val WORKOUT_LOGS_HEADERS = listOf(
        "Log ID", "Client ID", "Program ID", "Week", "Day", "Exercise",
        "Muscle", "Sets Completed", "Reps Completed", "Load (kg)",
        "RIR", "RPE", "Rest", "Tempo", "Completion %", "Date"
    )

    val NUTRITION_PLANS_HEADERS = listOf(
        "Plan ID", "Client ID", "Plan Name", "Target Calories",
        "Target Protein (g)", "Target Carbs (g)", "Target Fat (g)",
        "Target Fiber (g)", "Start Date"
    )

    val MEALS_HEADERS = listOf(
        "Meal ID", "Nutrition Plan ID", "Meal Name", "Scheduled Time"
    )

    val FOODS_HEADERS = listOf(
        "Food ID", "Meal ID", "Food Name", "Portion Size",
        "Calories", "Protein (g)", "Carbs (g)", "Fat (g)", "Fiber (g)"
    )

    val NUTRITION_LOGS_HEADERS = listOf(
        "Log ID", "Client ID", "Nutrition Plan ID", "Date", "Meal",
        "Food", "Quantity", "Calories", "Protein (g)", "Carbohydrates (g)",
        "Fat (g)", "Fiber (g)"
    )

    val SUPPLEMENTS_HEADERS = listOf(
        "Supplement ID", "Supplement Name", "Category", "Purpose",
        "Dosage", "Timing", "Frequency", "Duration", "Notes"
    )

    val CLIENT_SUPPLEMENTS_HEADERS = listOf(
        "Record ID", "Client ID", "Supplement ID", "Supplement Name",
        "Dosage", "Timing", "Frequency", "Start Date", "End Date", "Coach Notes"
    )

    val CARDIO_HEADERS = listOf(
        "Cardio ID", "Client ID", "Date", "Modality", "Duration (mins)",
        "Intensity / HR Zone", "Distance (km)", "Calories Burned", "Coach Notes"
    )

    val PROGRESS_HEADERS = listOf(
        "Progress ID", "Client ID", "Date", "Weight Change (kg)",
        "Total Fat Lost (%)", "Lean Mass Gained", "Adherence Avg (%)", "Milestone"
    )

    val CHECK_INS_HEADERS = listOf(
        "Check-in ID", "Date", "Client ID", "Weight (kg)", "Measurements Summary",
        "Training Adherence (%)", "Nutrition Adherence (%)", "Sleep (1-10)",
        "Energy (1-10)", "Stress (1-10)", "Hunger (1-10)", "Recovery (1-10)",
        "Performance (1-10)", "Client Comments", "Coach Feedback", "Reviewed"
    )

    val FITNESS_TESTS_HEADERS = listOf(
        "Test ID", "Client ID", "Test Name", "Date", "Score", "Unit", "Notes"
    )

    val COACH_NOTES_HEADERS = listOf(
        "Note ID", "Client ID", "Date", "Title", "Content", "Category"
    )

    val PAYMENTS_HEADERS = listOf(
        "Payment ID", "Client ID", "Date", "Amount", "Currency",
        "Plan", "Status", "Renewal Date"
    )

    val REPORTS_HEADERS = listOf(
        "Report ID", "Client ID", "Generated Date", "Report Type",
        "Summary", "PDF Export URI"
    )

    val EXERCISE_LIBRARY_HEADERS = listOf(
        "Exercise ID", "Name", "Primary Muscle", "Secondary Muscle",
        "Equipment", "Movement Pattern", "Video / Reference URL"
    )

    val PROGRAM_TEMPLATES_HEADERS = listOf(
        "Template ID", "Template Name", "Focus", "Split Type",
        "Difficulty", "Weeks Duration", "Notes"
    )

    // Data Validation Options
    val GOAL_OPTIONS = listOf(
        "Fat Loss", "Muscle Gain", "Recomposition", "Strength", "Performance", "Maintenance"
    )

    val SUBSCRIPTION_OPTIONS = listOf(
        "Free", "Premium", "Expired", "Trial"
    )

    val STATUS_OPTIONS = listOf(
        "Active", "Paused", "Inactive"
    )

    val CHECK_IN_FREQUENCIES = listOf(
        "Weekly", "Bi-weekly", "Monthly"
    )

    // Pre-calculated Dashboard Formulas for the master sheet
    val CLIENT_DASHBOARD_FORMULAS = mapOf(
        "Total Clients" to "=COUNTA(Clients!A2:A)",
        "Active Clients" to "=COUNTIF(Clients!V2:V, \"Active\")",
        "New Clients" to "=COUNTIF(Clients!Q2:Q, \"Trial\")",
        "Inactive Clients" to "=COUNTIF(Clients!V2:V, \"Inactive\")",
        "Clients Requiring Check-in" to "=COUNTIF(Check-ins!P2:P, \"FALSE\")",
        "Average Training Adherence" to "=AVERAGE(Check-ins!F2:F)",
        "Average Nutrition Adherence" to "=AVERAGE(Check-ins!G2:G)",
        "Average Weight Change" to "=AVERAGE(Progress!D2:D)"
    )
}
