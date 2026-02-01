# Arduino Mega ↔ ESP32 Connection Guide

## 📌 Hardware Setup

### Arduino Mega Pinout
```
DS18B20 Temperature Sensor:
├─ GND → GND (black wire)
├─ VCC → 5V (red wire)
└─ DQ → Pin 2 (yellow wire) with 4.7kΩ pull-up resistor

Serial3 to ESP32:
├─ TX (Pin 14) → ESP32 RX (GPIO16)
├─ RX (Pin 15) → ESP32 TX (GPIO17) [Not used currently]
└─ GND → ESP32 GND (Common Ground - IMPORTANT!)
```

### ESP32 Pinout
```
Serial2 from Mega:
├─ RX (GPIO16) ← Mega TX3 (Pin 14)
├─ TX (GPIO17) → Mega RX3 (Pin 15) [Not used currently]
└─ GND ← Mega GND (Common Ground)
```

## 📊 Data Format

The Arduino Mega sends data to ESP32 in this format:
```
TEMP:25.5|BATT:35.2
    ^^^^      ^^^^
  Ambient   Battery
   Temp     Temp
```

## 🔧 Wiring Checklist

- [ ] DS18B20 Data pin → Mega pin 2
- [ ] DS18B20 4.7kΩ pull-up resistor between pin 2 and 5V
- [ ] Mega TX3 (pin 14) → ESP32 GPIO16 (RXD2)
- [ ] Mega RX3 (pin 15) → ESP32 GPIO17 (TXD2)
- [ ] **CRITICAL:** Mega GND → ESP32 GND (common ground)
- [ ] Mega powered via USB or external power
- [ ] ESP32 powered via USB

## 🔍 Troubleshooting

### No data received on ESP32:
1. Check wiring - especially the GND connection
2. Verify Serial3 on Mega is initialized at 9600 baud
3. Verify ESP32 Serial2 is initialized with RX:16, TX:17
4. Use Serial monitor on Mega to verify data is being sent

### Wrong temperature readings:
1. Check DS18B20 is properly connected
2. Verify 4.7kΩ pull-up resistor is in place
3. Try re-seating the sensor

### Garbled data:
1. Verify baud rate is 9600 on both devices
2. Check for loose connections
3. Try a shorter cable between Mega and ESP32

## 🚀 Testing Steps

1. **Load Mega sketch:** `Arduino_Mega_To_ESP32.ino`
2. **Load ESP32 sketch:** `ESP32_Battery_Temperature_Example.ino`
3. **Open Mega Serial Monitor** (115200 baud) - should show readings
4. **Open ESP32 Serial Monitor** (115200 baud) - should show received data
5. **Open browser** to ESP32 IP address (shown in Serial Monitor) to view dashboard

## 📝 Notes

- Default loop delay: 2 seconds (configurable via `LOOP_DELAY`)
- DS18B20 resolution: 12-bit (±0.0625°C)
- All temperatures in Celsius
- Ambient temp currently hardcoded to 25.0°C (modify line in Arduino_Mega_To_ESP32.ino to add real sensor)
