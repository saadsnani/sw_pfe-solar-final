# ESP32 Firmware

This directory contains the ESP32 firmware for the solar monitoring system.

## Files

- `ESP32_Battery_Temperature_Example.ino` - Main ESP32 code for battery temperature monitoring

## Features

- WiFi connectivity
- Battery temperature sensor reading
- HTTP API communication with backend
- Real-time data transmission

## Setup

1. Open the `.ino` file in Arduino IDE or PlatformIO
2. Configure WiFi credentials in the code
3. Set the backend API URL
4. Upload to your ESP32 board

## Hardware Requirements

- ESP32 Development Board
- DS18B20 Temperature Sensor
- 4.7kΩ Pull-up resistor
- Jumper wires

## Pin Configuration

- Temperature Sensor Data Pin: GPIO 4 (configurable in code)
- Ground: GND
- Power: 3.3V

## Dependencies

- OneWire library
- DallasTemperature library
- WiFi library (built-in)
- HTTPClient library (built-in)
