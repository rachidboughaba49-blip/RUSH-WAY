package com.example.therushway.data.pdf

import android.content.Context
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.pdf.PdfDocument
import androidx.core.content.FileProvider
import com.example.therushway.data.model.*
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

object PdfReportGenerator {

    fun generateClientReportPdf(
        context: Context,
        client: ClientEntity,
        measurements: List<MeasurementEntity>,
        programs: List<TrainingProgramEntity>,
        workoutLogs: List<WorkoutLogEntity>,
        nutritionPlans: List<NutritionPlanEntity>,
        supplements: List<ClientSupplementEntity>,
        checkIns: List<CheckInEntity>
    ): File {
        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // A4 at 72dpi
        val page = pdfDocument.startPage(pageInfo)
        val canvas: Canvas = page.canvas

        val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        val titlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(168, 85, 247) // Brand Electric Violet / Glow
            textSize = 22f
            isFakeBoldText = true
        }
        val subtitlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE
            textSize = 10f
            letterSpacing = 0.15f
        }
        val headerPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(15, 23, 42) // Dark Navy
            textSize = 12f
            isFakeBoldText = true
        }
        val bodyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(51, 65, 85)
            textSize = 9.5f
        }
        val mutedPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(100, 116, 139)
            textSize = 8.5f
        }

        var y = 0f

        // 1. TOP HEADER BANNER (THE RUSH WAY BRANDING)
        paint.color = Color.rgb(11, 17, 32) // Signature Dark Navy
        canvas.drawRect(0f, 0f, 595f, 90f, paint)

        // Accent deep purple line
        paint.color = Color.rgb(124, 58, 237)
        canvas.drawRect(0f, 87f, 595f, 90f, paint)

        canvas.drawText("THE RUSH WAY", 36f, 42f, titlePaint)
        canvas.drawText("HIGH PERFORMANCE COACHING REPORT", 36f, 60f, subtitlePaint)

        val dateStr = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault()).format(Date())
        val rightAlignPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(203, 213, 225)
            textSize = 9f
            textAlign = Paint.Align.RIGHT
        }
        canvas.drawText("CLIENT ID: ${client.id}", 559f, 42f, rightAlignPaint)
        canvas.drawText("GENERATED: $dateStr", 559f, 58f, rightAlignPaint)
        canvas.drawText("STATUS: ${client.status.uppercase()} | ${client.subscriptionStatus.uppercase()}", 559f, 74f, rightAlignPaint)

        y = 110f

        // 2. CLIENT PROFILE CARD
        val cardRect = RectF(36f, y, 559f, y + 68f)
        paint.color = Color.rgb(248, 250, 252)
        canvas.drawRoundRect(cardRect, 8f, 8f, paint)
        paint.color = Color.rgb(226, 232, 240)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 1f
        canvas.drawRoundRect(cardRect, 8f, 8f, paint)
        paint.style = Paint.Style.FILL

        canvas.drawText("CLIENT PROFILE: ${client.fullName.uppercase()}", 50f, y + 20f, headerPaint)
        canvas.drawText("Goal: ${client.goal}   |   Age: ${client.age}   |   Height: ${client.height}   |   Activity: ${client.activityLevel}", 50f, y + 36f, bodyPaint)

        val deltaWeight = client.currentWeight - client.startingWeight
        val deltaSign = if (deltaWeight > 0) "+" else ""
        canvas.drawText("Starting Weight: ${client.startingWeight} kg   →   Current Weight: ${client.currentWeight} kg  (${deltaSign}%.1f kg)".format(deltaWeight), 50f, y + 52f, bodyPaint)

        y += 85f

        // 3. TRAINING PROTOCOL
        canvas.drawText("TRAINING PROTOCOL (PLANNED VS COMPLETED)", 36f, y, headerPaint)
        y += 14f

        val prog = programs.firstOrNull()
        val progTitle = prog?.let { "${it.programName} (Week ${it.currentWeek} of ${it.totalWeeks})" } ?: client.currentProgram
        canvas.drawText("Program: $progTitle", 36f, y, bodyPaint)
        y += 14f

        // Training log table header
        val tHeaderRect = RectF(36f, y, 559f, y + 18f)
        paint.color = Color.rgb(241, 245, 249)
        canvas.drawRect(tHeaderRect, paint)
        val colPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(71, 85, 105)
            textSize = 8.5f
            isFakeBoldText = true
        }
        canvas.drawText("EXERCISE", 42f, y + 12f, colPaint)
        canvas.drawText("MUSCLE FOCUS", 210f, y + 12f, colPaint)
        canvas.drawText("SETS x REPS", 340f, y + 12f, colPaint)
        canvas.drawText("LOAD / RPE", 430f, y + 12f, colPaint)
        canvas.drawText("COMPLETION", 500f, y + 12f, colPaint)
        y += 22f

        val recentWorkouts = workoutLogs.take(3)
        if (recentWorkouts.isEmpty()) {
            canvas.drawText("• Standard assigned compound lifts: Squat, Incline Bench, Weighted Pull-Ups (RPE 8-9)", 42f, y + 10f, mutedPaint)
            y += 18f
        } else {
            recentWorkouts.forEach { log ->
                canvas.drawText(log.exercise, 42f, y + 10f, bodyPaint)
                canvas.drawText(log.muscle, 210f, y + 10f, mutedPaint)
                canvas.drawText("${log.sets} x ${log.reps}", 340f, y + 10f, bodyPaint)
                canvas.drawText("${log.load} @ RPE ${log.rpe}", 430f, y + 10f, bodyPaint)
                canvas.drawText(log.completion, 500f, y + 10f, bodyPaint)
                y += 16f
            }
        }
        y += 10f

        // 4. NUTRITION PLAN & MACROS
        canvas.drawText("NUTRITION PLAN & TARGET MACROS", 36f, y, headerPaint)
        y += 14f

        val nut = nutritionPlans.firstOrNull()
        val cals = nut?.targetCalories ?: 2400
        val p = nut?.targetProtein ?: 210
        val c = nut?.targetCarbohydrates ?: 220
        val f = nut?.targetFat ?: 65
        val fib = nut?.targetFiber ?: 35

        val nutRect = RectF(36f, y, 559f, y + 36f)
        paint.color = Color.rgb(254, 243, 199) // Light amber tint
        canvas.drawRoundRect(nutRect, 6f, 6f, paint)
        paint.color = Color.rgb(217, 119, 6)
        paint.style = Paint.Style.STROKE
        canvas.drawRoundRect(nutRect, 6f, 6f, paint)
        paint.style = Paint.Style.FILL

        canvas.drawText("Daily Calorie Target: $cals kcal", 50f, y + 16f, headerPaint)
        canvas.drawText("Protein: ${p}g   |   Carbohydrates: ${c}g   |   Fats: ${f}g   |   Fiber: ${fib}g", 50f, y + 28f, bodyPaint)
        y += 50f

        // 5. SUPPLEMENT PROTOCOL
        canvas.drawText("DAILY SUPPLEMENT PROTOCOL", 36f, y, headerPaint)
        y += 14f
        val suppList = supplements.take(3)
        if (suppList.isEmpty()) {
            canvas.drawText("• Creatine Monohydrate 5g Daily Post-workout", 42f, y + 10f, bodyPaint)
            y += 14f
            canvas.drawText("• High Purity Omega-3 (1000mg EPA/DHA) with Meal 1", 42f, y + 10f, bodyPaint)
            y += 14f
        } else {
            suppList.forEach { s ->
                canvas.drawText("• ${s.supplementName}: ${s.dosage} (${s.timing} - ${s.frequency})", 42f, y + 10f, bodyPaint)
                y += 14f
            }
        }
        y += 12f

        // 6. LONGITUDINAL MEASUREMENTS
        canvas.drawText("LONGITUDINAL BODY MEASUREMENTS & PROGRESS", 36f, y, headerPaint)
        y += 14f

        val mHeaderRect = RectF(36f, y, 559f, y + 18f)
        paint.color = Color.rgb(241, 245, 249)
        canvas.drawRect(mHeaderRect, paint)
        canvas.drawText("DATE", 42f, y + 12f, colPaint)
        canvas.drawText("WEIGHT", 130f, y + 12f, colPaint)
        canvas.drawText("WAIST", 210f, y + 12f, colPaint)
        canvas.drawText("CHEST", 290f, y + 12f, colPaint)
        canvas.drawText("ARM", 370f, y + 12f, colPaint)
        canvas.drawText("THIGH", 440f, y + 12f, colPaint)
        canvas.drawText("BODY FAT", 505f, y + 12f, colPaint)
        y += 22f

        measurements.take(4).forEach { m ->
            canvas.drawText(m.date, 42f, y + 10f, bodyPaint)
            canvas.drawText("${m.weight} kg", 130f, y + 10f, bodyPaint)
            canvas.drawText("${m.waist} cm", 210f, y + 10f, bodyPaint)
            canvas.drawText("${m.chest} cm", 290f, y + 10f, bodyPaint)
            canvas.drawText("${m.arm} cm", 370f, y + 10f, bodyPaint)
            canvas.drawText("${m.thigh} cm", 440f, y + 10f, bodyPaint)
            canvas.drawText("${m.bodyFat} %", 505f, y + 10f, bodyPaint)
            y += 16f
        }
        y += 10f

        // 7. COACH NOTES & RECOMMENDATIONS
        canvas.drawText("COACH NOTES & STRATEGIC RECOMMENDATIONS", 36f, y, headerPaint)
        y += 14f
        val notesRect = RectF(36f, y, 559f, y + 54f)
        paint.color = Color.rgb(248, 250, 252)
        canvas.drawRoundRect(notesRect, 6f, 6f, paint)
        val coachText = client.coachNotes.ifBlank {
            "Maintain strict execution on the current training block. Ensure 8+ hours sleep and prioritize hydration pre-workout."
        }
        canvas.drawText(coachText, 50f, y + 20f, bodyPaint)
        canvas.drawText("Next Check-in scheduled for: ${client.nextCheckIn}", 50f, y + 38f, mutedPaint)
        y += 70f

        // 8. FOOTER
        paint.color = Color.rgb(148, 163, 184)
        paint.strokeWidth = 0.5f
        canvas.drawLine(36f, 800f, 559f, 800f, paint)
        val footerPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(148, 163, 184)
            textSize = 8f
            textAlign = Paint.Align.CENTER
        }
        canvas.drawText("THE RUSH WAY COACHING SYSTEM • SYNCHRONIZED WITH GOOGLE SHEETS MASTER DATABASE", 297f, 814f, footerPaint)
        canvas.drawText("CONFIDENTIAL & PROPRIETARY TO ATHLETE AND COACH", 297f, 825f, footerPaint)

        pdfDocument.finishPage(page)

        // Save PDF to cache dir
        val reportsDir = File(context.cacheDir, "reports")
        if (!reportsDir.exists()) reportsDir.mkdirs()
        val file = File(reportsDir, "THE_RUSH_WAY_${client.id}_REPORT.pdf")
        FileOutputStream(file).use { out ->
            pdfDocument.writeTo(out)
        }
        pdfDocument.close()
        return file
    }

    fun openPdf(context: Context, file: File) {
        val uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            file
        )
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/pdf")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        val chooser = Intent.createChooser(intent, "Open THE RUSH WAY PDF Report").apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(chooser)
    }
}
