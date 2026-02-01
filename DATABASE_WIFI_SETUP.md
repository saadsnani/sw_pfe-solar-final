# Setup Database (MongoDB) m3a WiFi - Guide Darija

## Achno darna?

Zedna database (MongoDB) li khdama m3a WiFi connection dial ESP32. Daba data li tayji mn ESP32 tatsave f database automatiquement!

## Files li t-create-aw:

### 1. Database Configuration
- **`lib/db.ts`** - MongoDB connection w setup
- **`lib/db-models.ts`** - Data models w types

### 2. API Routes (WiFi Data Storage)
- **`app/api/db/sensor-data/route.ts`** - Sav w jib sensor data
- **`app/api/db/temperature/route.ts`** - Temperature logs
- **`app/api/db/system-status/route.ts`** - System status

### 3. Integration
- **`app/api/sensor-data/route.ts`** - Updated bach tsave f DB

## Kifach n-setup?

### Step 1: Install MongoDB

#### Option A: Local MongoDB (Recommended lbda)
```powershell
# Install MongoDB Community Edition
# Download mn: https://www.mongodb.com/try/download/community
# Run installer w follow instructions
```

#### Option B: MongoDB Atlas (Cloud - Free)
1. Khdel l https://www.mongodb.com/cloud/atlas
2. Create account gratuit
3. Create cluster (M0 Free tier)
4. Get connection string

### Step 2: Install Dependencies
```powershell
npm install mongodb
```

### Step 3: Configure Environment Variables

Create file `.env.local` f root dial project:

```env
# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/solar-monitoring
MONGODB_DB=solar-monitoring

# Wla MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solar-monitoring
# MONGODB_DB=solar-monitoring
```

### Step 4: Start l-project
```powershell
npm run dev
```

## Kifach khdama?

### 1. ESP32 ysift data via WiFi
```cpp
// ESP32 code (deja configured)
// POST to: http://your-server/api/sensor-data
// Data: { temperature: 25.5, humidity: 60, deviceId: "ESP32-001" }
```

### 2. API takhod data w tsave f MongoDB
```
ESP32 WiFi → API Route → MongoDB Database
```

### 3. Frontend t-query data mn database
```typescript
// Get latest sensor data
const response = await fetch('/api/db/sensor-data?limit=100');
const data = await response.json();
```

## API Endpoints li khdamin

### Save Sensor Data (ESP32 POST hna)
```bash
POST /api/db/sensor-data
Body: {
  "temperature": 25.5,
  "humidity": 60,
  "deviceId": "ESP32-SS2",
  "source": "esp32"
}
```

### Get Sensor Data
```bash
GET /api/db/sensor-data?limit=100&deviceId=ESP32-SS2
```

### Save Temperature Log
```bash
POST /api/db/temperature
Body: {
  "batteryTemp": 28.5,
  "deviceId": "ESP32-SS2",
  "status": "normal"
}
```

### Get Temperature Logs
```bash
GET /api/db/temperature?hours=24&deviceId=ESP32-SS2
```

### System Status
```bash
POST /api/db/system-status
GET /api/db/system-status
```

## Features

✅ **WiFi Data Storage** - Data mn ESP32 tatsave automatically  
✅ **Persistent Storage** - Data ma-tat-tay7-ch even ila reset server  
✅ **Query History** - Tqad tjib data 9dima  
✅ **Multiple Devices** - Support l bzzaf dial ESP32 devices  
✅ **Real-time Updates** - Data fresh w up-to-date  
✅ **Error Handling** - Ila database ma-khdamatch, memory storage still works  

## Troubleshooting

### MongoDB ma-khdamatch?
```powershell
# Check MongoDB service
net start MongoDB

# Wla mn MongoDB Compass
# Open MongoDB Compass → localhost:27017
```

### Connection Error?
1. Verify `MONGODB_URI` f `.env.local`
2. Check MongoDB service running
3. Firewall settings (port 27017)

### Data ma-tat-save-ch?
1. Check console logs f terminal
2. Verify API route kayn: `/api/db/sensor-data`
3. Test with Postman/curl

## Test Database

```powershell
# Test connection w save data
curl -X POST http://localhost:3000/api/db/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature":25.5,"deviceId":"TEST","source":"esp32"}'

# Get data
curl http://localhost:3000/api/db/sensor-data?limit=10
```

## Next Steps

1. ✅ Database configured
2. ✅ WiFi integration ready
3. ⏳ Run `npm install mongodb`
4. ⏳ Setup `.env.local` file
5. ⏳ Start MongoDB service
6. ⏳ Test m3a ESP32

---

**Mzyan!** Database w WiFi integration ready. ESP32 data ghadi tsave f MongoDB automatically! 🚀

