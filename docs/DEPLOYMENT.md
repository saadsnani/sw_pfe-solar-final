# 🚀 Deployment Guide - Solar Dashboard PFE

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [GitHub Repository](#github-repository)
- [Deploy to Vercel](#deploy-to-vercel)
- [Hardware Setup](#hardware-setup)
- [Environment Variables](#environment-variables)

## 🌐 GitHub Repository

Your project is now live on GitHub:
**https://github.com/saadsnani/sw_pfe-solar-final**

### Latest Updates
✅ Enhanced temperature monitoring system  
✅ Real-time ESP32/Arduino integration  
✅ Dual sensor display (battery + ambient)  
✅ Live charts with 20-point history  
✅ Professional code organization  

---

## 🚀 Deploy to Vercel (Free Hosting)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Add New Project"

### Step 2: Import Repository
1. Select `saadsnani/sw_pfe-solar-final`
2. Click "Import"
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables (Optional)
```env
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at: `https://your-project.vercel.app`

### Automatic Deployments
- Every `git push` to `main` branch automatically deploys
- Preview deployments for pull requests
- Rollback to previous versions anytime

---

## 🔧 Hardware Setup (ESP32 + Arduino Mega)

### Required Hardware
- ESP32 Development Board
- Arduino Mega 2560
- DS18B20 Temperature Sensor (Digital)
- LM35/TMP36 Temperature Sensor (Analog)
- Jumper wires
- USB cables (2x)

### Wiring Diagram

#### ESP32 ↔ Arduino Mega Serial Connection
```
ESP32 Pin 16 (RX2) → Arduino Mega TX1 (Pin 18)
ESP32 Pin 17 (TX2) → Arduino Mega RX1 (Pin 19)
ESP32 GND         → Arduino Mega GND
```

#### Arduino Mega ↔ Sensors
```
DS18B20 (Digital):
- VCC    → 5V
- DATA   → Pin 2
- GND    → GND

LM35/TMP36 (Analog):
- VCC    → 5V
- OUTPUT → A0
- GND    → GND
```

### Upload Code

#### 1. Arduino Mega
```bash
# Open Arduino IDE
# Select: Tools > Board > Arduino Mega 2560
# Select: Tools > Port > (Your Mega Port)
# Open: Arduino_Mega_Temperature_Sensor.ino
# Click Upload
```

#### 2. ESP32
```bash
# Install ESP32 Board Support in Arduino IDE
# Open: ESP32_Battery_Temperature_Example.ino
# Update WiFi credentials (lines 23-24):
const char* ssid = "Your_WiFi_Name";
const char* password = "Your_WiFi_Password";

# Update server URL (line 27):
const char* serverUrl = "https://your-project.vercel.app/api/sensor-data";

# Select: Tools > Board > ESP32 Dev Module
# Select: Tools > Port > (Your ESP32 Port)
# Click Upload
```

### Testing Connection
1. Open Serial Monitor (115200 baud for ESP32, 9600 for Mega)
2. ESP32 should display:
   ```
   ================================
     ESP32 Temperature Monitor
   ================================
   [OK] Serial2 initialized
   [OK] WiFi Connected!
   [INFO] IP Address: http://192.168.x.x
   ```
3. Check dashboard: Data should update every 3 seconds

---

## 🌍 Access Your Dashboard

### Local Development
```bash
npm install
npm run dev
# Open: http://localhost:3000
```

### Production (After Vercel Deploy)
```
https://your-project.vercel.app
```

### Features Available
✅ Real-time temperature monitoring  
✅ Battery + Ambient temperature display  
✅ Historical data charts (20 readings)  
✅ Status indicators (Cold/Normal/Hot/Critical)  
✅ Trend arrows (↑ ↓ →)  
✅ Auto-refresh every 3 seconds  
✅ Mobile responsive design  

---

## 📊 API Endpoints

### Send Sensor Data (ESP32 → Server)
```http
POST /api/sensor-data
Content-Type: application/json

{
  "batteryTemperature": 35.2,
  "temperature": 25.5
}
```

### Get Latest Data (Dashboard → Server)
```http
GET /api/sensor-data?type=all&limit=20
```

Response:
```json
{
  "current": {
    "batteryTemperature": 35.2,
    "temperature": 25.5,
    "timestamp": "2025-12-19T10:30:00.000Z"
  },
  "readings": [...],
  "count": 20
}
```

---

## 🔐 Security Notes

### Data Files Ignored
The following files are NOT pushed to GitHub:
- `data/sensor-readings.json`
- `data/battery-temperature.json`
- `data/login-logs.json`
- `.env.local`

### WiFi Credentials
⚠️ Never commit WiFi passwords to GitHub!
- Keep them in `.env.local` or update directly in Arduino code
- Use different credentials for production

---

## 📱 Mobile Access

Your dashboard is fully responsive and works on:
- 📱 Smartphones
- 💻 Tablets
- 🖥️ Desktop computers

Simply access the Vercel URL from any device!

---

## 🆘 Troubleshooting

### ESP32 Not Connecting to WiFi
```cpp
// Check credentials in ESP32 code
const char* ssid = "Your_WiFi_Name";      // Line 23
const char* password = "Your_WiFi_Password"; // Line 24
```

### No Data in Dashboard
1. Check ESP32 Serial Monitor for errors
2. Verify server URL is correct (should be Vercel URL)
3. Test API endpoint: `https://your-project.vercel.app/api/sensor-data?type=all`

### Sensor Reading Error
- Verify wiring connections
- Check sensor power (5V for DS18B20, LM35)
- Install required Arduino libraries:
  - `OneWire`
  - `DallasTemperature`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
- [DS18B20 Guide](https://randomnerdtutorials.com/esp32-ds18b20-temperature-arduino-ide/)

---

## 🎓 Project Info

**Project**: Solar Dashboard PFE  
**GitHub**: https://github.com/saadsnani/sw_pfe-solar-final  
**Author**: Saad Snani  
**Date**: December 2025  

---

## ✨ Next Steps

1. ✅ Code is on GitHub
2. 🚀 Deploy to Vercel
3. 🔧 Upload code to ESP32/Arduino
4. 📊 Watch real-time data flow!

**Your dashboard is ready to go live! 🎉**
