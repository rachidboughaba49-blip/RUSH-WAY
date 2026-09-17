package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.therushway.data.db.RushWayDatabase
import com.example.therushway.data.sheets.GoogleSheetsManager
import com.example.therushway.ui.TheRushWayApp
import com.example.therushway.ui.viewmodel.RushWayViewModel
import com.example.therushway.ui.viewmodel.RushWayViewModelFactory
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

    private val viewModel: RushWayViewModel by viewModels {
        val database = RushWayDatabase.getInstance(applicationContext)
        val sheetsManager = GoogleSheetsManager(applicationContext, database.dao())
        RushWayViewModelFactory(database.dao(), sheetsManager)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                TheRushWayApp(viewModel = viewModel)
            }
        }
    }
}

