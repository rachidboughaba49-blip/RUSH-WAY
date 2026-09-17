package com.example.therushway.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

enum class RushLogoVariant {
    ICON_ONLY,
    HORIZONTAL,
    STACKED
}

@Composable
fun RushWayLogo(
    variant: RushLogoVariant = RushLogoVariant.ICON_ONLY,
    size: Dp = 48.dp,
    textColor: Color = RushTextPrimary,
    glowEffect: Boolean = false,
    modifier: Modifier = Modifier
) {
    when (variant) {
        RushLogoVariant.ICON_ONLY -> {
            RushWayEmblem(size = size, glowEffect = glowEffect, modifier = modifier)
        }
        RushLogoVariant.HORIZONTAL -> {
            Row(
                modifier = modifier,
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy((size.value * 0.25f).dp)
            ) {
                RushWayEmblem(size = size, glowEffect = glowEffect)
                Column(verticalArrangement = Arrangement.Center) {
                    Text(
                        text = "THE RUSH",
                        fontWeight = FontWeight.Black,
                        fontSize = (size.value * 0.42f).sp,
                        letterSpacing = 1.2.sp,
                        color = textColor,
                        lineHeight = (size.value * 0.44f).sp
                    )
                    Text(
                        text = "WAY",
                        fontWeight = FontWeight.Black,
                        fontSize = (size.value * 0.42f).sp,
                        letterSpacing = 2.0.sp,
                        color = RushPurpleGlow,
                        lineHeight = (size.value * 0.44f).sp
                    )
                }
            }
        }
        RushLogoVariant.STACKED -> {
            Column(
                modifier = modifier,
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy((size.value * 0.18f).dp)
            ) {
                RushWayEmblem(size = size, glowEffect = glowEffect)
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "THE RUSH WAY",
                        fontWeight = FontWeight.Black,
                        fontSize = (size.value * 0.28f).sp,
                        letterSpacing = 2.5.sp,
                        color = textColor
                    )
                    Text(
                        text = "HIGH PERFORMANCE COACHING",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = (size.value * 0.12f).coerceAtLeast(8f).sp,
                        letterSpacing = 1.5.sp,
                        color = RushPurpleLight
                    )
                }
            }
        }
    }
}

/**
 * Geometric, faceted warrior-shield emblem representing THE RUSH WAY brand identity.
 * Faithfully matches the uploaded visual specifications:
 * - Angular outer wings
 * - Purple faceted visors/eyes
 * - Six-pack abdominal / grille mask in lower jaw
 * - Sharp inverted triangular chin
 * - Dark navy, deep purple, black, and light contour accents
 */
@Composable
fun RushWayEmblem(
    size: Dp = 48.dp,
    glowEffect: Boolean = false,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.size(size)) {
        val w = this.size.width
        val h = this.size.height

        // Optional ambient glow behind emblem
        if (glowEffect) {
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(RushPurplePrimary.copy(alpha = 0.35f), Color.Transparent),
                    center = Offset(w * 0.5f, h * 0.5f),
                    radius = w * 0.6f
                )
            )
        }

        // Palette for the facets
        val darkNavy = Color(0xFF0D1424)
        val outerNavy = Color(0xFF090E1A)
        val deepPurple = Color(0xFF3E1F73)
        val midPurple = Color(0xFF5B21B6)
        val brightPurple = Color(0xFF7C3AED)
        val neonViolet = Color(0xFFA855F7)
        val highlightWhite = Color(0xFFFFFFFF)
        val accentStroke = Color(0xFFCBD5E1)

        // COORDINATE SYSTEM: normalized to (0..100, 0..100)
        fun x(v: Float) = v * 0.01f * w
        fun y(v: Float) = v * 0.01f * h

        // 1. OUTER HEAD / CHEEK SILHOUETTE (Deep navy / dark base)
        val outerLeftWing = Path().apply {
            moveTo(x(10f), y(14f)) // Outer wing top
            lineTo(x(22f), y(32f))
            lineTo(x(8f), y(40f))  // Outer side point
            lineTo(x(20f), y(60f))
            lineTo(x(50f), y(96f)) // Chin tip
            lineTo(x(50f), y(35f)) // Center interior
            close()
        }
        drawPath(outerLeftWing, color = outerNavy)

        val outerRightWing = Path().apply {
            moveTo(x(90f), y(14f)) // Outer wing top
            lineTo(x(78f), y(32f))
            lineTo(x(92f), y(40f)) // Outer side point
            lineTo(x(80f), y(60f))
            lineTo(x(50f), y(96f)) // Chin tip
            lineTo(x(50f), y(35f)) // Center interior
            close()
        }
        drawPath(outerRightWing, color = outerNavy)

        // 2. UPPER CREST / TOP BROW HORNS (Angular wings)
        val leftHorn = Path().apply {
            moveTo(x(10f), y(14f))
            lineTo(x(28f), y(24f))
            lineTo(x(48f), y(24f))
            lineTo(x(50f), y(34f))
            lineTo(x(24f), y(32f))
            close()
        }
        drawPath(leftHorn, color = deepPurple)

        val rightHorn = Path().apply {
            moveTo(x(90f), y(14f))
            lineTo(x(72f), y(24f))
            lineTo(x(52f), y(24f))
            lineTo(x(50f), y(34f))
            lineTo(x(76f), y(32f))
            close()
        }
        drawPath(rightHorn, color = deepPurple)

        // 3. VISOR EYES (Angular deep purple and electric violet pentagons)
        val leftEye = Path().apply {
            moveTo(x(22f), y(28f))
            lineTo(x(46f), y(35f))
            lineTo(x(46f), y(54f))
            lineTo(x(34f), y(64f))
            lineTo(x(20f), y(44f))
            close()
        }
        drawPath(
            path = leftEye,
            brush = Brush.linearGradient(
                colors = listOf(brightPurple, deepPurple),
                start = Offset(x(20f), y(28f)),
                end = Offset(x(46f), y(64f))
            )
        )

        val rightEye = Path().apply {
            moveTo(x(78f), y(28f))
            lineTo(x(54f), y(35f))
            lineTo(x(54f), y(54f))
            lineTo(x(66f), y(64f))
            lineTo(x(80f), y(44f))
            close()
        }
        drawPath(
            path = rightEye,
            brush = Brush.linearGradient(
                colors = listOf(neonViolet, deepPurple),
                start = Offset(x(80f), y(28f)),
                end = Offset(x(54f), y(64f))
            )
        )

        // Visor inner facets (highlights)
        val leftEyeFacet = Path().apply {
            moveTo(x(26f), y(34f))
            lineTo(x(44f), y(38f))
            lineTo(x(44f), y(50f))
            lineTo(x(34f), y(58f))
            close()
        }
        drawPath(leftEyeFacet, color = midPurple)

        val rightEyeFacet = Path().apply {
            moveTo(x(74f), y(34f))
            lineTo(x(56f), y(38f))
            lineTo(x(56f), y(50f))
            lineTo(x(66f), y(58f))
            close()
        }
        drawPath(rightEyeFacet, color = midPurple)

        // 4. LOWER CHIN SHIELD / MASK GRILLE (The 6-segment athletic abdominal plate)
        val maskBase = Path().apply {
            moveTo(x(32f), y(62f))
            lineTo(x(68f), y(62f))
            lineTo(x(50f), y(94f))
            close()
        }
        drawPath(maskBase, color = darkNavy)

        // Grille horizontal and vertical divider lines (White/light crisp lines as in logo)
        val strokeWidth = (w * 0.022f).coerceAtLeast(1.5f)

        // Outer mask perimeter outline
        val maskOutline = Path().apply {
            moveTo(x(32f), y(62f))
            lineTo(x(68f), y(62f))
            lineTo(x(50f), y(94f))
            close()
        }
        drawPath(
            path = maskOutline,
            color = highlightWhite,
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round, join = StrokeJoin.Miter)
        )

        // Grille row 1
        drawLine(
            color = highlightWhite,
            start = Offset(x(36f), y(70f)),
            end = Offset(x(64f), y(70f)),
            strokeWidth = strokeWidth
        )
        // Grille row 2
        drawLine(
            color = highlightWhite,
            start = Offset(x(41f), y(78f)),
            end = Offset(x(59f), y(78f)),
            strokeWidth = strokeWidth
        )
        // Grille row 3
        drawLine(
            color = highlightWhite,
            start = Offset(x(45f), y(86f)),
            end = Offset(x(55f), y(86f)),
            strokeWidth = strokeWidth
        )

        // Center vertical spine dividing the grille into 6 cells
        drawLine(
            color = highlightWhite,
            start = Offset(x(50f), y(62f)),
            end = Offset(x(50f), y(94f)),
            strokeWidth = strokeWidth
        )

        // 5. CRISP LIGHT CONTOURS & FACET ACCENTS
        // Center brow bridge line
        drawLine(
            color = highlightWhite,
            start = Offset(x(50f), y(24f)),
            end = Offset(x(50f), y(62f)),
            strokeWidth = strokeWidth * 1.2f
        )

        // Cheek angled contours (connecting eye corners to chin)
        drawLine(
            color = accentStroke,
            start = Offset(x(18f), y(42f)),
            end = Offset(x(32f), y(62f)),
            strokeWidth = strokeWidth
        )
        drawLine(
            color = accentStroke,
            start = Offset(x(82f), y(42f)),
            end = Offset(x(68f), y(62f)),
            strokeWidth = strokeWidth
        )

        // Upper horn top edge highlights
        drawLine(
            color = accentStroke,
            start = Offset(x(10f), y(14f)),
            end = Offset(x(48f), y(24f)),
            strokeWidth = strokeWidth
        )
        drawLine(
            color = accentStroke,
            start = Offset(x(90f), y(14f)),
            end = Offset(x(52f), y(24f)),
            strokeWidth = strokeWidth
        )

        // Jaw edge down to chin tip
        drawLine(
            color = accentStroke,
            start = Offset(x(32f), y(62f)),
            end = Offset(x(50f), y(96f)),
            strokeWidth = strokeWidth * 1.1f
        )
        drawLine(
            color = accentStroke,
            start = Offset(x(68f), y(62f)),
            end = Offset(x(50f), y(96f)),
            strokeWidth = strokeWidth * 1.1f
        )
    }
}
