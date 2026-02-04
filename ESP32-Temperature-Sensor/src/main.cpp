#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

// معلومات الويفي ديال Hotspot ديالك
const char* ssid = "SS2";
const char* password = "00000000";

// 🔥 BDEL IP DYALEK HENA (jpuri ipconfig f terminal)
// Local dev: http://192.168.X.X:3000 (no SSL)
// Production: https://sw-pfe-solar-final.vercel.app
const char* serverName = "http://100.97.114.66:3000/api/sensor-data";  // 👈 IP DYALEK

// Pins ربط Mega مع ESP32
#define RX_PIN 16 // ركب فيه خيط Mega TX (14)
#define TX_PIN 17 // ركب فيه خيط Mega RX (15)

void setup() {
  Serial.begin(9600); // Monitor USB
  
  // ديماري Port باش تهضر مع Mega
  Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

  // ديماري الويفي
  Serial.print("Connexion à ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connecté!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 1. واش Mega صيفطات شي حاجة؟
  if (Serial2.available()) {
    String tempString = Serial2.readStringUntil('\n');
    tempString.trim(); // مسح الفراغات

    if (tempString.length() > 0) {
      Serial.print("Wasla mn Mega: ");
      Serial.println(tempString);

      // 2. صيفط للسيرفر دابا
      if(WiFi.status() == WL_CONNECTED){
        HTTPClient http;
        http.begin(serverName);
        http.addHeader("Content-Type", "application/json");

        // قاد JSON: نخلي القيمة ديال DS18B20 كبطارية + نزيد SSID
        String jsonData = "{\"batteryTemperature\":" + tempString + ", \"wifiSsid\":\"" + String(ssid) + "\"}";
        
        Serial.println("Envoi au serveur...");
        int httpResponseCode = http.POST(jsonData);
        
        if(httpResponseCode > 0){
          Serial.print("Réponse Serveur: ");
          Serial.println(httpResponseCode); // خاص تكون 200
          Serial.println(http.getString());
        } else {
          Serial.print("Erreur HTTP: ");
          Serial.println(httpResponseCode);
        }
        http.end();
      } else {
        Serial.println("WiFi M9to3!");
      }
    }
  }
}