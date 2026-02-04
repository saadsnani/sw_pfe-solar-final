package com.solardashboard.app;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Capacitor automatically loads the web app
        Log.d("MainActivity", "Application started successfully");
    }

    @Override
    public void onStart() {
        super.onStart();
        Log.d("MainActivity", "Activity started");
    }
}
