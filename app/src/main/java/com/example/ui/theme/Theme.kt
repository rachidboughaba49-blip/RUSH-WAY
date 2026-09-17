package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val RushDarkColorScheme = darkColorScheme(
    primary = RushPurplePrimary,
    onPrimary = Color.White,
    primaryContainer = RushDeepPurple,
    onPrimaryContainer = RushPurpleLight,
    secondary = RushPurpleGlow,
    onSecondary = Color.Black,
    secondaryContainer = Color(0xFF281848),
    onSecondaryContainer = RushPurpleLight,
    tertiary = RushCyan,
    onTertiary = Color.Black,
    background = RushBlack,
    onBackground = RushTextPrimary,
    surface = RushNavySurface,
    onSurface = RushTextPrimary,
    surfaceVariant = RushNavySurfaceVariant,
    onSurfaceVariant = RushTextSecondary,
    outline = RushBorder,
    outlineVariant = RushBorderPurple
)

// Clean high-contrast fallback scheme maintaining dark navy/purple accents
private val RushLightColorScheme = lightColorScheme(
    primary = RushDeepPurple,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEDE9FE),
    onPrimaryContainer = RushDeepPurple,
    secondary = RushPurplePrimary,
    onSecondary = Color.White,
    background = Color(0xFFF8FAFC),
    onBackground = Color(0xFF0F172A),
    surface = Color.White,
    onSurface = Color(0xFF0F172A),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF475569),
    outline = Color(0xFFCBD5E1)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true, // Default to The Rush Way signature dark navy / black aesthetic
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) RushDarkColorScheme else RushLightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
