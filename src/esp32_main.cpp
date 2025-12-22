/*
 * ========================================
 * ESP32 - WiFi Temperature Bridge
 * ========================================
 * Receives temperature data from Arduino Mega via Serial2
 * and sends it to server via WiFi POST request
 * 
 * Hardware:
 * - Serial2 RX (GPIO 4) ← Mega TX3 (Pin 14)
 * - Serial2 TX (GPIO 2) → Mega RX3 (Pin 15) [optional]
 * - GND ↔ Mega GND (REQUIRED!)
 * ========================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ========================================
// CONFIGURATION
// ========================================

// WiFi Credentials
const char* ssid = "SS2";
const char* password = "00000000";

// Server URL (Change to your server)
// Local: http://192.168.137.1:3000/api/sensor-data
// Vercel: https://sw-pfe-solar-final.vercel.app/api/sensor-data
const char* serverUrl = "http://192.168.137.1:3000/api/sensor-data";

// Serial2 Pins (connected to Mega Serial3)
#define RXD2 4  // GPIO 4 ← Mega TX3 (Pin 14)
#define TXD2 2  // GPIO 2 → Mega RX3 (Pin 15)

// Constants
#define SERIAL_MONITOR 115200
#define SERIAL2_BAUD 9600
#define WIFI_TIMEOUT 20000 // 20 seconds

// ========================================
// GLOBAL VARIABLES
// ========================================

float currentTemperature = 0.0;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 2000; // Send every 2 seconds

// ========================================
// FUNCTION PROTOTYPES
// ========================================

void connectWiFi();
void sendDataToServer(float temperature);

// ========================================
// SETUP
// ========================================

void setup() {
  // USB Serial for monitoring
  Serial.begin(SERIAL_MONITOR);
  delay(1000);
  
  Serial.println("\n========================================");
  Serial.println("  ESP32 - Temperature Bridge");
  Serial.println("========================================");
  
  // Serial2 for communication with Mega
  Serial2.begin(SERIAL2_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("[OK] Serial2 initialized @ 9600 baud");
  Serial.print("[INFO] RX: GPIO ");
  Serial.print(RXD2);
  Serial.print(", TX: GPIO ");
  Serial.println(TXD2);
  
  // Connect to WiFi
  connectWiFi();
  
  Serial.println("========================================\n");
}

// ========================================
// MAIN LOOP
// ========================================

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WARNING] WiFi disconnected! Reconnecting...");
    connectWiFi();
  }
  
  // Read data from Mega via Serial2
  if (Serial2.available()) {
    String receivedData = Serial2.readStringUntil('\n');
    receivedData.trim();
    
    Serial.print("[DATA] Received from Mega: ");
    Serial.println(receivedData);
    
    // Parse temperature value
    if (receivedData != "ERROR") {
      currentTemperature = receivedData.toFloat();
      
      // Send to server immediately
      if (currentTemperature > -50 && currentTemperature < 100) {
        sendDataToServer(currentTemperature);
      } else {
        Serial.println("[ERROR] Invalid temperature value!");
      }
    } else {
      Serial.println("[ERROR] Mega reported sensor error");
    }
  }
  
  delay(100); // Small delay to prevent watchdog issues
}

// ========================================
// CONNECT TO WIFI
// ========================================

void connectWiFi() {
  Serial.print("[INFO] Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  unsigned long startAttempt = millis();
  
  while (WiFi.status() != WL_CONNECTED && 
         millis() - startAttempt < WIFI_TIMEOUT) {
    delay(500);
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] WiFi Connected!");
    Serial.print("[INFO] IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("[INFO] Server URL: ");
    Serial.println(serverUrl);
  } else {
    Serial.println("\n[ERROR] WiFi connection failed!");
    Serial.println("[INFO] Will retry...");
  }
}

// ========================================
// SEND DATA TO SERVER
// ========================================

void sendDataToServer(float temperature) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] WiFi not connected!");
    return;
  }
  
  HTTPClient http;
  
  // Initialize HTTP connection
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  String jsonPayload = "{\"temperature\":";
  jsonPayload += String(temperature, 2);
  jsonPayload += "}";
  
  Serial.print("[INFO] Sending to server: ");
  Serial.println(jsonPayload);
  
  // Send POST request
  int httpResponseCode = http.POST(jsonPayload);
  
  // Check response
  if (httpResponseCode > 0) {
    Serial.print("[SUCCESS] Response code: ");
    Serial.println(httpResponseCode);
    
    String response = http.getString();
    Serial.print("[RESPONSE] ");
    Serial.println(response);
  } else {
    Serial.print("[ERROR] HTTP POST failed! Error: ");
    Serial.println(http.errorToString(httpResponseCode));
  }
  
  http.end();
}
