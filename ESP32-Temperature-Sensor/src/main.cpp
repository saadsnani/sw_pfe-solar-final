#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

// 1. MA3LOUMAT WIFI (Badlhom ila mbddlin)
const char* ssid = "SS2";
const char* password = "00000000";

// 2. SERVER (IP Dyalek)
const char* serverName = "http://192.168.137.1:3000/api/sensor-data";

// 3. PINS (Liaison Directe m3a Mega)
#define RXD2 16
#define TXD2 17

void setup() {
  Serial.begin(115200); // Monitor d PC
  // Mohim: 9600 bach ytfahm m3a Mega
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2); 

  Serial.println();
  Serial.print("Kanhawel n-connecta l ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi Connecté!");
  Serial.print("IP ESP32: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Wach kayna chi data jat mn Mega?
  if (Serial2.available()) {
    String tempString = Serial2.readStringUntil('\n');
    tempString.trim(); // Nqiyha mn l-khrbich

    // Ila kan raqm mzyan (fih ktar mn 0 huruf)
    if (tempString.length() > 0) {
      Serial.print("Reçu via Serial2: ");
      Serial.println(tempString);

      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverName);
        http.addHeader("Content-Type", "application/json");

        // --- TSHIH JSON (Hada li kan dayr mochkil 500) ---
        // Server baghi: {"batteryTemperature": 25.5}
        String jsonData = "{\"batteryTemperature\": " + tempString + "}";

        int httpCode = http.POST(jsonData);
        
        if (httpCode > 0) {
          Serial.print("Server jawb b: ");
          Serial.println(httpCode); // Daba khassha tkon 200!
        } else {
          Serial.print("Error f l-envoi: ");
          Serial.println(httpCode);
        }
        http.end();
      }
    }
  }
}