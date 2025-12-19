// ========================================
// Code Arduino MEGA - Capteur Temperature
// ========================================
// Ce code lit un capteur de temperature et l'envoie a l'ESP32
// Capteur: DS18B20 Digital Temperature Sensor
// Output: "TEMP:XX.X|BATT:YY.Y"

#include <OneWire.h>
#include <DallasTemperature.h>

// --- PINS ---
#define ONE_WIRE_BUS 2  // Pin 2 pour le capteur temperature
#define BATTERY_TEMP_PIN A0  // Pin A0 pour capteur batterie (analogique)

// --- OBJECTS ---
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// --- VARIABLES ---
float tempAmbient = 0.0;
float tempBattery = 0.0;
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 3000;  // Lire chaque 3 secondes

// --- SETUP ---
void setup() {
  Serial.begin(9600);
  Serial.println("=== MEGA BOOT ===");
  Serial.println("Initialisation capteurs...");
  
  // Initialize temperature sensors
  sensors.begin();
  
  if (sensors.getDeviceCount() == 0) {
    Serial.println("ERREUR: Capteur DS18B20 non detecte!");
  } else {
    Serial.print("Capteurs detectes: ");
    Serial.println(sensors.getDeviceCount());
  }
  
  Serial.println("=== MEGA PRET ===\n");
}

// --- LOOP ---
void loop() {
  unsigned long currentTime = millis();
  
  // Lire les capteurs chaque READ_INTERVAL ms
  if (currentTime - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentTime;
    
    readTemperatures();
    sendData();
  }
}

// --- FONCTION: Lire les temperatures ---
void readTemperatures() {
  // Temperature ambiante (DS18B20)
  sensors.requestTemperatures();
  tempAmbient = sensors.getTempCByIndex(0);
  
  // Temperature batterie (capteur analogique)
  tempBattery = readBatteryTemperature();
}

// --- FONCTION: Lire temperature batterie (analogique) ---
float readBatteryTemperature() {
  // Lecture analogique (0-1023 pour 0-5V)
  int analogValue = analogRead(BATTERY_TEMP_PIN);
  
  // Conversion 0-1023 vers 0-5V
  float voltage = (analogValue / 1023.0) * 5.0;
  
  // Conversion voltage vers temperature
  // Pour capteur LM35: 10mV par degree C
  // Pour capteur TMP36: 0.5V a 25C + 10mV/C
  // Adaptez selon votre capteur!
  
  // Exemple LM35:
  float temp = voltage * 100;  // LM35: 10mV/C = 100 C/V
  
  return temp;
}

// --- FONCTION: Envoyer les donnees ---
void sendData() {
  // Format: "TEMP:XX.X|BATT:YY.Y"
  Serial.print("TEMP:");
  Serial.print(tempAmbient, 1);
  Serial.print("|BATT:");
  Serial.println(tempBattery, 1);
}

// --- FONCTION: Affichage debug (optionnel) ---
void debugPrint() {
  Serial.print("Ambient: ");
  Serial.print(tempAmbient);
  Serial.print("C | Battery: ");
  Serial.print(tempBattery);
  Serial.println("C");
}
