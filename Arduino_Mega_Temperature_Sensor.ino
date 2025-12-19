/*
 * ========================================
 * Arduino MEGA - Temperature Sensor System
 * ========================================
 * Description: Reads temperature from DS18B20 (ambient) and 
 *              analog sensor (battery), then sends data to ESP32
 * 
 * Hardware:
 *  - Arduino Mega 2560
 *  - DS18B20 Digital Temperature Sensor (Pin 2)
 *  - LM35/TMP36 Analog Temperature Sensor (Pin A0)
 *  - Serial connection to ESP32 @ 9600 baud
 * 
 * Output Format: "TEMP:XX.X|BATT:YY.Y"
 * ========================================
 */

#include <OneWire.h>
#include <DallasTemperature.h>

// ========================================
// CONFIGURATION SECTION
// ========================================

// Pin Assignments
#define ONE_WIRE_BUS 2          // DS18B20 sensor pin
#define BATTERY_TEMP_PIN A0     // Analog battery temperature sensor

// Timing Configuration
#define READ_INTERVAL 3000      // Read sensors every 3 seconds (ms)
#define SERIAL_BAUD 9600        // Must match ESP32 baud rate

// ========================================
// SENSOR OBJECTS
// ========================================
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// ========================================
// GLOBAL VARIABLES
// ========================================
float tempAmbient = 0.0;
float tempBattery = 0.0;
unsigned long lastReadTime = 0;

// ========================================
// SETUP FUNCTION
// ========================================

/**
 * Initialize system components
 * - Serial communication @ 9600 baud
 * - DS18B20 temperature sensors
 */
void setup() {
  // Initialize Serial for communication with ESP32
  Serial.begin(SERIAL_BAUD);
  delay(500);
  
  Serial.println("\n================================");
  Serial.println("  Arduino Mega Temperature System");
  Serial.println("================================");
  Serial.println("[INFO] Initializing sensors...");
  
  // Initialize DS18B20 sensor
  sensors.begin();
  
  // Verify sensor detection
  int deviceCount = sensors.getDeviceCount();
  if (deviceCount == 0) {
    Serial.println("[ERROR] DS18B20 sensor not detected!");
    Serial.println("[INFO] Check wiring and connections");
  } else {
    Serial.print("[OK] Detected ");
    Serial.print(deviceCount);
    Serial.println(" DS18B20 sensor(s)");
  }
  
  Serial.println("[OK] Analog sensor on pin A0");
  Serial.println("\n================================");
  Serial.println("  System Ready");
  Serial.println("================================\n");
}

// ========================================
// MAIN LOOP
// ========================================

/**
 * Main loop - reads sensors at specified interval
 * and sends formatted data to ESP32 via Serial
 */
void loop() {
  unsigned long currentTime = millis();
  
  // Read sensors at defined interval
  if (currentTime - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentTime;
    
    readTemperatures();
    sendData();
  }
}

// ========================================
// SENSOR READING FUNCTIONS
// ========================================

/**
 * Read both temperature sensors
 * - DS18B20 for ambient temperature
 * - Analog sensor for battery temperature
 */
void readTemperatures() {
  // Read ambient temperature from DS18B20
  sensors.requestTemperatures();
  tempAmbient = sensors.getTempCByIndex(0);
  
  // Validate ambient reading
  if (tempAmbient == DEVICE_DISCONNECTED_C) {
    Serial.println("[ERROR] DS18B20 disconnected!");
    tempAmbient = 0.0;
  }
  
  // Read battery temperature from analog sensor
  tempBattery = readBatteryTemperature();
}

/**
 * Read battery temperature from analog sensor
 * Supports LM35 and TMP36 sensors
 * @return Temperature in Celsius
 */
float readBatteryTemperature() {
  // Read analog value (0-1023 for 0-5V)
  int analogValue = analogRead(BATTERY_TEMP_PIN);
  
  // Convert to voltage (0-5V)
  float voltage = (analogValue / 1023.0) * 5.0;
  
  // Convert voltage to temperature
  // ---------------------------------
  // LM35:  10mV per °C  = 100°C per V
  //        temp = voltage * 100
  // 
  // TMP36: 0.5V at 25°C, then 10mV/°C
  //        temp = (voltage - 0.5) * 100
  // ---------------------------------
  
  // Using LM35 formula (adjust if using TMP36)
  float temp = voltage * 100.0;
  
  // Validate reading (reasonable temperature range)
  if (temp < -50 || temp > 100) {
    Serial.println("[WARNING] Analog sensor reading out of range");
    return 0.0;
  }
  
  return temp;
}

// ========================================
// DATA TRANSMISSION FUNCTIONS
// ========================================

/**
 * Send formatted temperature data to ESP32
 * Format: "TEMP:XX.X|BATT:YY.Y"
 */
void sendData() {
  // Build and send data string
  Serial.print("TEMP:");
  Serial.print(tempAmbient, 1);  // 1 decimal place
  Serial.print("|");
  Serial.print("BATT:");
  Serial.println(tempBattery, 1);  // 1 decimal place
  
  // Optional: Print to Serial Monitor for debugging
  // debugPrint();
}

/**
 * Debug function - prints temperatures in human-readable format
 * Uncomment call in sendData() to enable
 */
void debugPrint() {
  Serial.print("[DEBUG] Ambient: ");
  Serial.print(tempAmbient, 1);
  Serial.print("°C | Battery: ");
  Serial.print(tempBattery, 1);
  Serial.println("°C");
}
