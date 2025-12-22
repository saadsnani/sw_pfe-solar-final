/*
 * ========================================
 * Arduino Mega 2560 - DS18B20 Temperature
 * ========================================
 * Reads DS18B20 sensor and sends data to ESP32 via Serial3
 * 
 * Hardware:
 * - DS18B20 sensor on Pin 2 (with 4.7kΩ pull-up resistor)
 * - Serial3 TX (Pin 14) → ESP32 RX (GPIO 4)
 * - Serial3 RX (Pin 15) → ESP32 TX (GPIO 2) [optional]
 * - GND → ESP32 GND (REQUIRED!)
 * ========================================
 */

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ========================================
// CONFIGURATION
// ========================================

#define ONE_WIRE_BUS 2        // DS18B20 data pin
#define SERIAL_MONITOR 115200 // USB Serial for debugging
#define SERIAL3_BAUD 9600     // Serial3 to ESP32
#define READ_INTERVAL 2000    // Read every 2 seconds

// ========================================
// SETUP
// ========================================

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DeviceAddress tempSensor;

void setup() {
  // USB Serial for monitoring
  Serial.begin(SERIAL_MONITOR);
  delay(1000);
  
  Serial.println("\n========================================");
  Serial.println("  Arduino Mega - Temperature Sensor");
  Serial.println("========================================");
  
  // Serial3 to ESP32 (TX: Pin 14, RX: Pin 15)
  Serial3.begin(SERIAL3_BAUD);
  Serial.println("[OK] Serial3 initialized @ 9600 baud");
  
  // Initialize DS18B20
  sensors.begin();
  int deviceCount = sensors.getDeviceCount();
  
  Serial.print("[INFO] Found ");
  Serial.print(deviceCount);
  Serial.println(" DS18B20 sensor(s)");
  
  if (deviceCount > 0 && sensors.getAddress(tempSensor, 0)) {
    Serial.println("[OK] Sensor detected and configured");
    sensors.setResolution(tempSensor, 12); // 12-bit precision
  } else {
    Serial.println("[ERROR] No sensor found on Pin 2!");
    Serial.println("[INFO] Check wiring and 4.7kΩ pull-up resistor");
  }
  
  Serial.println("========================================\n");
}

// ========================================
// MAIN LOOP
// ========================================

void loop() {
  // Request temperature reading
  sensors.requestTemperatures();
  
  // Get temperature in Celsius
  float tempC = sensors.getTempC(tempSensor);
  
  // Validate reading (DS18B20 returns -127.0 on error)
  if (tempC != DEVICE_DISCONNECTED_C && tempC > -50 && tempC < 100) {
    
    // Send to ESP32 via Serial3 (just the float value)
    Serial3.println(tempC, 2); // 2 decimal places
    
    // Debug output to USB Serial
    Serial.print("[DATA] Sent to ESP32: ");
    Serial.print(tempC, 2);
    Serial.println(" °C");
    
  } else {
    // Error case
    Serial.println("[ERROR] Invalid sensor reading!");
    Serial3.println("ERROR");
  }
  
  delay(READ_INTERVAL);
}
