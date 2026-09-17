package com.example.therushway.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.therushway.ui.components.RushLogoVariant
import com.example.therushway.ui.components.RushWayLogo
import com.example.ui.theme.*
import kotlinx.coroutines.delay

/**
 * High-impact Splash Screen featuring THE RUSH WAY brand emblem,
 * signature deep purple ambient glow, and high-performance tagline.
 */
@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    var startAnimation by remember { mutableStateOf(false) }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.8f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    LaunchedEffect(Unit) {
        startAnimation = true
        delay(2200) // Brief cinematic entrance
        onSplashFinished()
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.radialGradient(
                    colors = listOf(
                        RushDeepPurple.copy(alpha = 0.35f * glowAlpha),
                        RushDarkNavy,
                        RushBlack
                    ),
                    radius = 900f
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(24.dp)
        ) {
            AnimatedVisibility(
                visible = startAnimation,
                enter = fadeIn(animationSpec = tween(900)) + slideInVertically(initialOffsetY = { 40 })
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    // Master Stacked Brand Logo with Glow
                    RushWayLogo(
                        variant = RushLogoVariant.STACKED,
                        size = 110.dp,
                        glowEffect = true
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Minimalist fitness OS loading line
                    LinearProgressIndicator(
                        color = RushPurplePrimary,
                        trackColor = RushNavySurfaceVariant,
                        modifier = Modifier
                            .width(160.dp)
                            .height(3.dp)
                            .clip(RoundedCornerShape(2.dp))
                    )

                    Text(
                        text = "CONNECTING COACHING SYSTEM...",
                        fontSize = 10.sp,
                        letterSpacing = 2.sp,
                        fontWeight = FontWeight.Bold,
                        color = RushTextSecondary
                    )
                }
            }
        }

        // Bottom confidentiality signature
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "THE RUSH WAY • COACHING OS",
                fontSize = 11.sp,
                letterSpacing = 1.5.sp,
                fontWeight = FontWeight.Bold,
                color = RushTextMuted
            )
            Text(
                text = "Google Sheets Enterprise Sync Layer",
                fontSize = 9.sp,
                color = RushTextMuted.copy(alpha = 0.7f)
            )
        }
    }
}

/**
 * Modern, premium Coach Login / Access screen built strictly with
 * The Rush Way visual identity: dark navy, deep purple, and black.
 */
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    modifier: Modifier = Modifier
) {
    var email by remember { mutableStateOf("coach.rush@therushway.com") }
    var password by remember { mutableStateOf("••••••••••••") }
    var passwordVisible by remember { mutableStateOf(false) }
    var rememberMe by remember { mutableStateOf(true) }
    var isSigningIn by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        RushDarkNavy,
                        RushBlack
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 40.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Prominent Stacked Brand Logo Header
            RushWayLogo(
                variant = RushLogoVariant.STACKED,
                size = 72.dp,
                glowEffect = true
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Main Login Card
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = RushNavySurface
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 1.dp,
                        color = RushBorderPurple.copy(alpha = 0.6f),
                        shape = RoundedCornerShape(16.dp)
                    )
            ) {
                Column(
                    modifier = Modifier.padding(22.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "COACH ACCESS PORTAL",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.2.sp,
                            color = RushPurpleGlow
                        )
                        Text(
                            text = "Sign in to access athlete roster and Google Sheets database",
                            fontSize = 11.sp,
                            color = RushTextSecondary
                        )
                    }

                    // Email Field
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Coach Email") },
                        leadingIcon = {
                            Icon(Icons.Default.AlternateEmail, contentDescription = null, tint = RushPurpleLight)
                        },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = RushPurplePrimary,
                            unfocusedBorderColor = RushBorder,
                            focusedLabelColor = RushPurpleLight,
                            cursorColor = RushPurplePrimary
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Password Field
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Access Key") },
                        leadingIcon = {
                            Icon(Icons.Default.Lock, contentDescription = null, tint = RushPurpleLight)
                        },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    contentDescription = null,
                                    tint = RushTextSecondary
                                )
                            }
                        },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = RushPurplePrimary,
                            unfocusedBorderColor = RushBorder,
                            focusedLabelColor = RushPurpleLight,
                            cursorColor = RushPurplePrimary
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Remember Me and Forgot Password
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Checkbox(
                                checked = rememberMe,
                                onCheckedChange = { rememberMe = it },
                                colors = CheckboxDefaults.colors(
                                    checkedColor = RushPurplePrimary,
                                    checkmarkColor = Color.White
                                )
                            )
                            Text("Keep session active", fontSize = 12.sp, color = RushTextSecondary)
                        }
                    }

                    // Primary Sign In Button
                    Button(
                        onClick = {
                            isSigningIn = true
                            onLoginSuccess()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = RushPurplePrimary
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "ENTER COACHING OS",
                                fontWeight = FontWeight.Black,
                                fontSize = 13.sp,
                                letterSpacing = 1.sp,
                                color = Color.White
                            )
                            Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                    }

                    Divider(color = RushBorder.copy(alpha = 0.5f))

                    // Connect with Google Workspace OAuth
                    OutlinedButton(
                        onClick = {
                            isSigningIn = true
                            onLoginSuccess()
                        },
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = Color.Transparent
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.dp, RushBorderPurple),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Icon(Icons.Default.CloudSync, contentDescription = null, tint = RushPurpleLight, modifier = Modifier.size(18.dp))
                            Text(
                                text = "Sign In with Google Workspace",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = RushTextPrimary
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Quick bypass for immediate testing
            TextButton(onClick = onLoginSuccess) {
                Text(
                    text = "Quick Demo Access (Coach Mode)",
                    color = RushPurpleLight,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
