# Arduino Mega ↔ ESP32 Wiring Guide

## Hardware Connections

### Serial Communication (Mega Serial3 ↔ ESP32 Serial2)

```
Arduino Mega              ESP32
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pin 14 (TX3)     ──────►  GPIO 4 (RX)
Pin 15 (RX3)     ◄──────  GPIO 2 (TX)  [Optional - for bidirectional]
GND              ◄──────► GND           [REQUIRED!]
5V or 3.3V       ──────►  Power         [If not USB powered]
```

### DS18B20 Temperature Sensor (Connected to Mega)

```
DS18B20          Arduino Mega
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VDD (Red)   ──►  3.3V or 5V
GND (Black) ──►  GND
DATA (Yellow)──► Pin 2  + [4.7kΩ pull-up resistor to VDD]
```

**Important:** DS18B20 requires a 4.7kΩ resistor between DATA and VDD!

## Voltage Levels

- **Arduino Mega:** 5V logic
- **ESP32:** 3.3V logic

⚠️ **Warning:** Direct connection from Mega TX (5V) to ESP32 RX (3.3V) can damage ESP32!

### Solution Options:

**Option 1: Voltage Divider (Recommended)**
```
Mega TX3 (Pin 14) ──[1kΩ]──┬─── ESP32 GPIO 4 (RX)
                            │
                           [2kΩ]
                            │
                           GND
```

**Option 2: Logic Level Shifter**
Use a bidirectional logic level converter (3.3V ↔ 5V)

**Option 3: Direct Connection (Risk)**
Many ESP32 boards have 5V-tolerant inputs, but check your board specs!

## PlatformIO Project Structure

```
solar-dashboard-pfe/
├── platformio.ini          # Configuration for both boards
├── src/
│   ├── mega_main.cpp       # Arduino Mega code
│   └── esp32_main.cpp      # ESP32 code
└── lib/                    # Libraries (auto-downloaded)
```

## Upload Instructions

### 1. Upload to Arduino Mega

```bash
# In VS Code terminal or CMD
platformio run --target upload --environment mega
```

Or in VS Code:
1. Open PlatformIO sidebar
2. Click "mega" → "Upload"

### 2. Upload to ESP32

```bash
platformio run --target upload --environment esp32dev
```

Or in VS Code:
1. Open PlatformIO sidebar
2. Click "esp32dev" → "Upload"

## Monitor Serial Output

### Monitor Mega (COM16)
```bash
platformio device monitor --port COM16 --baud 115200
```

### Monitor ESP32 (COM17)
```bash
platformio device monitor --port COM17 --baud 115200
```

## Troubleshooting

### Mega not sending data
- Check DS18B20 wiring (especially 4.7kΩ pull-up)
- Open Mega serial monitor @ 115200 baud
- Look for "[DATA] Sent to ESP32: XX.XX °C"

### ESP32 not receiving data
- Check wiring: Mega Pin 14 → ESP32 GPIO 4
- Check common GND connection
- Open ESP32 serial monitor @ 115200 baud
- Look for "[DATA] Received from Mega: XX.XX"

### ESP32 WiFi not connecting
- Verify SSID "SS2" and password "00000000"
- Check 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Look for "[OK] WiFi Connected!" in serial monitor

### Server not receiving data
- Verify server URL in esp32_main.cpp
- Check server is running: `http://192.168.137.1:3000`
- Look for "[SUCCESS] Response code: 200" in serial monitor

## Configuration Changes

### Change WiFi Credentials

Edit `src/esp32_main.cpp`:
```cpp
const char* ssid = "YourWiFiName";
const char* password = "YourPassword";
```

### Change Server URL

Edit `src/esp32_main.cpp`:
```cpp
// For local server
const char* serverUrl = "http://192.168.137.1:3000/api/sensor-data";

// For Vercel production
const char* serverUrl = "https://sw-pfe-solar-final.vercel.app/api/sensor-data";
```

### Change Send Interval

Edit `src/mega_main.cpp`:
```cpp
#define READ_INTERVAL 2000  // milliseconds (2000 = 2 seconds)
```

## Expected Serial Output

### Arduino Mega (COM16 @ 115200)
```
========================================
  Arduino Mega - Temperature Sensor
========================================
[OK] Serial3 initialized @ 9600 baud
[INFO] Found 1 DS18B20 sensor(s)
[OK] Sensor detected and configured
========================================

[DATA] Sent to ESP32: 25.37 °C
[DATA] Sent to ESP32: 25.42 °C
[DATA] Sent to ESP32: 25.39 °C
```

### ESP32 (COM17 @ 115200)
```
========================================
  ESP32 - Temperature Bridge
========================================
[OK] Serial2 initialized @ 9600 baud
[INFO] RX: GPIO 4, TX: GPIO 2
[INFO] Connecting to WiFi: SS2
.....
[OK] WiFi Connected!
[INFO] IP Address: 192.168.137.XXX
[INFO] Server URL: http://192.168.137.1:3000/api/sensor-data
========================================

[DATA] Received from Mega: 25.37
[INFO] Sending to server: {"temperature":25.37}
[SUCCESS] Response code: 200
[RESPONSE] {"status":"success","temperature":25.37}
```
