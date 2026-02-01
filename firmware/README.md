# Firmware Directory

This directory contains all firmware code for the solar monitoring system hardware components.

## Structure

```
firmware/
├── esp32/           # ESP32 firmware and configuration
├── arduino/         # Arduino Mega firmware
├── platformio.ini   # PlatformIO configuration file
└── README.md        # This file
```

## Hardware Architecture

```
[Temperature Sensors] 
        ↓
[Arduino Mega 2560] 
        ↓ (Serial)
    [ESP32]
        ↓ (WiFi/HTTP)
  [Backend API]
```

## Getting Started

### Option 1: Arduino IDE

1. Install Arduino IDE from [arduino.cc](https://www.arduino.cc/en/software)
2. Install required libraries:
   - OneWire
   - DallasTemperature
3. Open the `.ino` files from respective directories
4. Configure and upload to your boards

### Option 2: PlatformIO (Recommended)

1. Install PlatformIO from [platformio.org](https://platformio.org/)
2. Open this firmware directory in VS Code with PlatformIO extension
3. Use `platformio.ini` for configuration
4. Build and upload using PlatformIO commands

## Configuration

### WiFi Credentials (ESP32)

Edit the ESP32 code to set:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### API Endpoint (ESP32)

Set your backend URL:
```cpp
const char* serverUrl = "http://your-domain.com/api/sensor-data";
```

### Serial Communication

- **Baud Rate**: 9600 (default)
- **Data Format**: `TEMP:XX.X|BATT:YY.Y`

## Troubleshooting

### ESP32 Won't Connect to WiFi
- Check credentials
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Check WiFi signal strength

### Arduino Not Sending Data
- Verify serial connection between Arduino and ESP32
- Check baud rates match on both devices
- Test sensors individually

### Temperature Readings Incorrect
- Check sensor wiring
- Verify pull-up resistor (4.7kΩ) is present
- Test sensor with example sketches

## Pin Diagrams

See individual README files in each subdirectory for detailed pin configurations.

## License

See main project LICENSE file.
