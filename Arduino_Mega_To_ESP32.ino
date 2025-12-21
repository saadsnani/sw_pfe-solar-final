/*
 * ========================================
 * Arduino Mega - DS18B20 to ESP32
 * ========================================
 * Description: Reads temperature from DS18B20 sensor
 *              and sends to ESP32 via Serial3
 * 
 * Hardware: Arduino Mega + DS18B20 (OneWire) + ESP32
 * Communication: Serial3 (TX:14, RX:15) @ 9600 baud
 * Sensor Pin: Digital Pin 2
 * ========================================
 */

#include <OneWire.h>
#include <DallasTemperature.h>

// ========================================
// PIN CONFIGURATION
// ========================================

// OneWire Bus Pin for DS18B20
#define ONE_WIRE_BUS 2

// Ambient temperature sensor (optional second sensor)
#define AMBIENT_TEMP_PIN A0  // Change if using another sensor

// Serial ports
// Serial:  Serial0 - USB/Monitor (115200)
// Serial1: RX:19, TX:18
// Serial2: RX:17, TX:16
// Serial3: RX:15, TX:14 -> Connected to ESP32

// ========================================
// CONSTANTS
// ========================================

#define SERIAL_BAUD 9600
#define LOOP_DELAY 2000      // Send data every 2 seconds
#define SENSOR_TIMEOUT 1000  // Max time to wait for sensor reading

// ========================================
// SETUP OneWire and DallasTemperature
// ========================================

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Array to hold device addresses
DeviceAddress batteryTempSensor;

// ========================================
// SETUP FUNCTION
// ========================================

void setup() {
  // Serial Monitor (USB)
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("================================");
  Serial.println("  Arduino Mega - Temperature");
  Serial.println("================================");
  
  // Serial3 to ESP32
  Serial3.begin(SERIAL_BAUD);
  Serial.println("[OK] Serial3 initialized (9600 baud)");
  Serial.println("[INFO] Connected to ESP32 via pins TX:14, RX:15");
  
  // Initialize DS18B20 sensors
  sensors.begin();
  
  // Check for connected devices
  int deviceCount = sensors.getDeviceCount();
  Serial.print("[INFO] Found ");
  Serial.print(deviceCount);
  Serial.println(" DS18B20 sensor(s)");
  
  if (deviceCount > 0) {
    // Get address of first sensor
    if (sensors.getAddress(batteryTempSensor, 0)) {
      Serial.println("[OK] Battery Temperature Sensor detected");
      // Set resolution to 12-bit (0.0625°C precision)
      sensors.setResolution(batteryTempSensor, 12);
    } else {
      Serial.println("[ERROR] Could not get sensor address!");
    }
  } else {
    Serial.println("[WARNING] No DS18B20 sensors found!");
    Serial.println("[INFO] Check connections on pin 2");
  }
  
  Serial.println("\n================================");
  Serial.println("  System Ready");
  Serial.println("================================\n");
}

// ========================================
// MAIN LOOP
// ========================================

void loop() {
  // Request temperature reading
  sensors.requestTemperatures();
  
  // Get battery temperature
  float batteryTemp = sensors.getTempC(batteryTempSensor);
  
  // Get ambient temperature (using internal reading or second sensor)
  float ambientTemp = 25.0; // Default or read from second sensor
  
  // Check if readings are valid (not -127 which is error code)
  if (batteryTemp != DEVICE_DISCONNECTED_C && batteryTemp > -50 && batteryTemp < 100) {
    
    // Format: "TEMP:25.5|BATT:35.2"
    String dataToSend = "TEMP:";
    dataToSend += String(ambientTemp, 1);
    dataToSend += "|BATT:";
    dataToSend += String(batteryTemp, 1);
    
    // Send via Serial3 to ESP32
    Serial3.println(dataToSend);
    
    // Display on monitor
    Serial.print("[DATA] Sending: ");
    Serial.println(dataToSend);
    Serial.print("[INFO] Battery: ");
    Serial.print(batteryTemp);
    Serial.print("°C | Ambient: ");
    Serial.print(ambientTemp);
    Serial.println("°C");
    
  } else {
    // Error case
    Serial.print("[ERROR] Invalid reading: ");
    Serial.println(batteryTemp);
    
    // Send error message
    Serial3.println("TEMP:-----|BATT:-----");
  }
  
  delay(LOOP_DELAY);
}

// ========================================
// HELPER FUNCTION: Print Sensor Address
// ========================================

void printAddress(DeviceAddress deviceAddress) {
  for (uint8_t i = 0; i < 8; i++) {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}
