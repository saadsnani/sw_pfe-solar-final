#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>

// --- WIFI CREDENTIALS ---
const char* ssid = "Smiya_Dyal_Wifi";     // Bedel hadi
const char* password = "Code_Dyal_Wifi";  // Bedel hadi

// --- SERVER URL (Bedel l-IP ta3 Serveur Next.js Dyal3 ---
const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";  // Bedel X.X dyal IP ta3k

// Pins Serial 2 (Communication m3a Mega)
#define RXD2 16
#define TXD2 17

// Variable bach nghankhbiw l-temperature
String temperature = "--";
String batteryTemperature = "--";

// Server Web f Port 80 (Optional - bach tchouf temperature f browser)
WebServer server(80);

// --- PAGE HTML ---
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

// Function bach t3ati data l server Next.js
void sendSensorDataToServer(float batteryTemp) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi pas connecte!");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  String jsonPayload = "{\"batteryTemperature\": " + String(batteryTemp, 2) + "}";
  
  Serial.println("Envoi donnees: " + jsonPayload);
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error sending data: " + String(httpResponseCode));
  }
  
  http.end();
}

void setup() {
  // Serial bach nchoufo l-IP
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("=== DEMARRAGE SYSTEME ===");
  
  // Serial2 bach ntsnto l Mega (RX=16, TX=17)
  // Lazem tkun 9600 hit Mega dayra 9600
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  // Connection WiFi
  Serial.print("Connexion WiFi...");
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connecte!");
    Serial.print("IP: http://");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Pas Connecte - Mode Local Uniquement");
  }

  // Demarrage Server (optional)
  server.on("/", handleRoot);
  server.begin();
  
  Serial.println("=== SYSTEME PRET ===\n");
}

void loop() {
  server.handleClient();

  // Wach kayna chi haja jat mn Mega?
  if (Serial2.available()) {
    String data = Serial2.readStringUntil('\n');
    data.trim();
    
    if (data.length() > 0) {
      // Parse data - format: "TEMP:25.5|BATT:35.2"
      int tempIndex = data.indexOf("TEMP:");
      int battIndex = data.indexOf("BATT:");
      
      if (tempIndex >= 0) {
        int endIndex = data.indexOf("|", tempIndex);
        if (endIndex < 0) endIndex = data.length();
        temperature = data.substring(tempIndex + 5, endIndex);
      }
      
      if (battIndex >= 0) {
        batteryTemperature = data.substring(battIndex + 5);
        // Try to parse as float
        float battTemp = batteryTemperature.toFloat();
        
        // Send to server
        sendSensorDataToServer(battTemp);
      }
      
      Serial.println("Data received: " + data);
    }
  }
  
  delay(100);
}
