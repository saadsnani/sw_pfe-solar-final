# Arduino Mega Firmware

This directory contains the Arduino Mega firmware for the solar monitoring system.

## Files

- `Arduino_Mega_Temperature_Sensor.ino` - Temperature sensor reading code
- `Arduino_Mega_To_ESP32.ino` - Communication bridge to ESP32

## Features

- Multiple temperature sensor support
- Serial communication with ESP32
- Data aggregation and buffering
- Sensor error detection

## Setup

1. Open the `.ino` file in Arduino IDE
2. Configure sensor pins in the code
3. Set serial communication baud rate (default: 9600)
4. Upload to your Arduino Mega board

## Hardware Requirements

- Arduino Mega 2560
- DS18B20 Temperature Sensors
- 4.7kΩ Pull-up resistors
- Jumper wires

## Pin Configuration

- Sensor Bus Pin: Digital Pin 2 (configurable in code)
- Serial TX to ESP32: TX1 (Pin 18)
- Serial RX from ESP32: RX1 (Pin 19)
- Ground: GND
- Power: 5V

## Communication Protocol

Data format sent to ESP32:
```
TEMP:25.5|BATT:35.2
```

## Dependencies

- OneWire library
- DallasTemperature library
