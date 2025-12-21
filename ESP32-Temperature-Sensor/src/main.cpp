#include <Arduino.h>

// Pins li khtariti (GND common darori!)
#define RX_PIN 16 // RX2 Default dyal ESP32 (Ghaliban Pin 16)
#define TX_PIN 17 // TX2 Default dyal ESP32 (Ghaliban Pin 17)
// Oula sta3ml Pins dialk li knti dayr:
// #define RX_PIN 4 
// #define TX_PIN 2

void setup() {
  Serial.begin(9600); // Monitor ESP32 bach tchouf f PC
  
  // Configuration Serial2 (RX, TX)
  // Serial2 3andha pins par defaut f ESP32 (16 et 17 often)
  // Walakin n9dro nbddlohom l ay pin bghina:
  Serial2.begin(9600, SERIAL_8N1, 4, 2); // RX=4, TX=2 kima knti dayr
  
  Serial.println("ESP32 wajda! Kan-tsna l-7arara...");
}

void loop() {
  if (Serial2.available()) {
    // Qra l-message hta l-khr dyal str (newline)
    String temperature = Serial2.readStringUntil('\n');

    // Nqqi l-message
    temperature.trim(); 

    // Affiche f Serial Monitor dyal ESP32
    Serial.print("Ssi3r mn Mega: ");
    Serial.print(temperature);
    Serial.println(" °C");
  }
}