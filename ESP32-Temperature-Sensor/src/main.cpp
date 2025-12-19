#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

// --- CONFIG WIFI ---
const char* ssid = "Smiya_Dyal_Wifi";     // Bedel hadi
const char* password = "Code_Dyal_Wifi";  // Bedel hadi
const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";  // Bedel IP

// --- SERIAL2 CONFIG ---
#define RXD2 16  // ESP32 RX2 (khad Mega TX)
#define TXD2 17  // ESP32 TX2 (khad Mega RX)

// Variables bach nkhbiw l-temperature
float batteryTemp = 0.0;
float ambientTemp = 0.0;
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 3000;  // Send kola 3 secondes

// --- FONCTIONS ---

void connectToWiFi() {
  Serial.print("Connexion WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Failed!");
  }
}

void readFromMega() {
  // Aqra mn Serial2 (Mega -> ESP32)
  if (Serial2.available()) {
    String data = Serial2.readStringUntil('\n');
    data.trim();
    
    if (data.length() > 0) {
      Serial.println("Data from Mega: " + data);
      
      // Parse: "TEMP:XX.X|BATT:YY.Y"
      int tempIndex = data.indexOf("TEMP:");
      int battIndex = data.indexOf("BATT:");
      
      if (tempIndex >= 0) {
        int endIndex = data.indexOf("|", tempIndex);
        if (endIndex < 0) endIndex = data.length();
        String tempStr = data.substring(tempIndex + 5, endIndex);
        ambientTemp = tempStr.toFloat();
        Serial.println("Ambient Temp: " + String(ambientTemp) + "C");
      }
      
      if (battIndex >= 0) {
        String battStr = data.substring(battIndex + 5);
        batteryTemp = battStr.toFloat();
        Serial.println("Battery Temp: " + String(batteryTemp) + "C");
      }
    }
  }
}

void sendTemperatureToServer(float temp) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping send");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload - battery temperature
  String jsonPayload = "{\"batteryTemperature\": " + String(temp, 2) + "}";
  
  Serial.println("Sending: " + jsonPayload);
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + String(httpResponseCode));
  } else {
    Serial.println("Error: " + String(httpResponseCode));
  }
  
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP32 DEMARRAGE ===");
  
  // Setup Serial2 bach aqra mn Mega
  // Mega TX (pin 1) -> ESP32 RX2 (pin 16)
  // Mega RX (pin 0) -> ESP32 TX2 (pin 17)
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Serial.println("Serial2 initialized (9600 baud)");
  
  // Connect WiFi
  connectToWiFi();
  
  Serial.println("=== PRET ===\n");
}

void loop() {
  // Aqra data mn Mega continuously
  readFromMega();
  
  // Send data to server kola SEND_INTERVAL
  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;
    
    if (batteryTemp > 0) {  // Verify we have valid data
      sendTemperatureToServer(batteryTemp);
    } else {
      Serial.println("No valid temperature data yet...");
    }
  }
  
  delay(100);  // Small delay to avoid overwhelming the loop
}