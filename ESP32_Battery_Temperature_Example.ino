/*
 * ========================================
 * ESP32 Battery Temperature Monitoring
 * ========================================
 * Description: This system reads temperature data from Arduino Mega
 *              and sends it to Next.js dashboard via WiFi
 * 
 * Hardware: ESP32 + Arduino Mega + Temperature Sensors
 * Communication: Serial2 (RX:16, TX:17) @ 9600 baud
 * ========================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>

// ========================================
// CONFIGURATION SECTION
// ========================================

// WiFi Credentials (Update these)
const char* ssid = "Smiya_Dyal_Wifi";
const char* password = "Code_Dyal_Wifi";

// Server URL (Update with your Next.js server IP)
const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";

// Serial2 Pins (Communication with Arduino Mega)
#define RXD2 16
#define TXD2 17
#define SERIAL_BAUD 9600

// Timing Constants
#define WIFI_TIMEOUT 20
#define LOOP_DELAY 100

// ========================================
// GLOBAL VARIABLES
// ========================================
String temperature = "--";
String batteryTemperature = "--";

// Web Server on Port 80 (Optional - for browser access)
WebServer server(80);

// ========================================
// WEB SERVER FUNCTIONS
// ========================================

/**
 * Handle root web page request
 * Displays current temperature readings in HTML format
 * Auto-refreshes every 3 seconds
 */
void handleRoot() {
  String html = "<!DOCTYPE html><html>";
  html += "<head><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<meta http-equiv='refresh' content='3'>";
  html += "<style>";
  html += "body { font-family: Arial; text-align: center; margin-top: 50px; background-color: #f0f2f5; }";
  html += ".card { background: white; padding: 30px; border-radius: 15px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 10px; }";
  html += "h1 { color: #333; }";
  html += ".temp { font-size: 3rem; color: #ff5722; font-weight: bold; margin: 20px 0; }";
  html += ".unit { font-size: 1.5rem; color: #666; }";
  html += ".battery-temp { font-size: 3rem; color: #2196F3; font-weight: bold; margin: 20px 0; }";
  html += "</style></head>";
  
  html += "<body>";
  html += "<div class='card'>";
  html += "<h1>Temperature Atmosphere</h1>";
  html += "<div class='temp'>" + temperature + "<span class='unit'> &deg;C</span></div>";
  html += "</div>";
  
  html += "<div class='card'>";
  html += "<h1>Temperature Batterie</h1>";
  html += "<div class='battery-temp'>" + batteryTemperature + "<span class='unit'> &deg;C</span></div>";
  html += "</div>";
  
  html += "<p>Mise a jour automatique...</p>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

// ========================================
// DATA TRANSMISSION FUNCTIONS
// ========================================

/**
 * Send battery temperature data to Next.js server
 * @param batteryTemp: Battery temperature value in Celsius
 * @param ambientTemp: Ambient temperature value in Celsius
 */
void sendSensorDataToServer(float batteryTemp, float ambientTemp) {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] WiFi not connected!");
    return;
  }

  // Initialize HTTP client
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000); // 5 second timeout
  
  // Create JSON payload with both temperatures
  String jsonPayload = "{\"batteryTemperature\": " + String(batteryTemp, 2) + 
                       ", \"temperature\": " + String(ambientTemp, 2) + "}";
  
  Serial.println("[INFO] Sending data: " + jsonPayload);
  
  // Send POST request
  int httpResponseCode = http.POST(jsonPayload);
  
  // Handle response
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("[SUCCESS] Response code: " + String(httpResponseCode));
    Serial.println("[INFO] Response: " + response);
  } else {
    Serial.println("[ERROR] Failed to send data. Code: " + String(httpResponseCode));
  }
  
  http.end();
}

// ========================================
// SETUP FUNCTION
// ========================================

/**
 * Initialize system components
 * - Serial communication (115200 for monitoring, 9600 for Mega)
 * - WiFi connection
 * - Web server
 */
void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("================================");
  Serial.println("  ESP32 Temperature Monitor");
  Serial.println("================================");
  
  // Initialize Serial2 for Arduino Mega communication
  // Must match Mega's baud rate (9600)
  Serial2.begin(SERIAL_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("[OK] Serial2 initialized (RX:16, TX:17)");

  // Connect to WiFi
  Serial.print("[INFO] Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  // Wait for connection
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < WIFI_TIMEOUT) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  // Display connection status
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] WiFi Connected!");
    Serial.print("[INFO] IP Address: http://");
    Serial.println(WiFi.localIP());
    Serial.println("[INFO] Open browser to view readings");
  } else {
    Serial.println("\n[WARNING] WiFi not connected - Local mode only");
  }

  // Start web server
  server.on("/", handleRoot);
  server.begin();
  Serial.println("[OK] Web server started on port 80");
  
  Serial.println("\n================================");
  Serial.println("  System Ready");
  Serial.println("================================\n");
}

// ========================================
// MAIN LOOP
// ========================================

/**
 * Main loop - continuously:
 * 1. Handle web server requests
 * 2. Read data from Arduino Mega via Serial2
 * 3. Parse and display temperature data
 * 4. Send data to Next.js server
 */
void loop() {
  // Handle web server client requests
  server.handleClient();

  // Check for incoming data from Arduino Mega
  if (Serial2.available()) {
    // Read incoming data
    String data = Serial2.readStringUntil('\n');
    data.trim();
    
    if (data.length() > 0) {
      Serial.println("[DATA] Received: " + data);
      
      // Parse data - Expected format: "TEMP:25.5|BATT:35.2"
      int tempIndex = data.indexOf("TEMP:");
      int battIndex = data.indexOf("BATT:");
      
      // Extract ambient temperature
      if (tempIndex >= 0) {
        int endIndex = data.indexOf("|", tempIndex);
        if (endIndex < 0) endIndex = data.length();
        temperature = data.substring(tempIndex + 5, endIndex);
        Serial.println("[INFO] Ambient Temp: " + temperature + "°C");
      }
      
      // Extract battery temperature and send to server
      if (battIndex >= 0) {
        batteryTemperature = data.substring(battIndex + 5);
        float battTemp = batteryTemperature.toFloat();
        float ambTemp = temperature.toFloat();
        
        // Validate temperature readings
        if (battTemp > -50 && battTemp < 100) {
          Serial.println("[INFO] Battery Temp: " + batteryTemperature + "°C");
          
          // Send both temperatures to server
          sendSensorDataToServer(battTemp, ambTemp);
        } else {
          Serial.println("[WARNING] Invalid temperature reading: " + String(battTemp));
        }
      }
    }
  }
  
  delay(LOOP_DELAY);
}
