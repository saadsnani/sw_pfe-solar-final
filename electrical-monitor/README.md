# ⚡ Electrical Monitoring System

Real-time electrical monitoring dashboard using Node.js and WebSocket.

## 🚀 Features

- **Real-time data streaming** - WebSocket for instant updates (no page refresh)
- **Dual channel monitoring** - Track 2 independent electrical circuits
- **Live calculations** - Automatic power calculation (P = V × I)
- **Clean UI** - Modern, responsive dashboard
- **Arduino-ready** - Structure prepared for sensor integration

## 📊 Monitored Parameters

### Channel 1 & 2
- **Voltage** (0-25V)
- **Current** (0-5A)
- **Power** (calculated automatically)

## 🛠️ Installation

1. **Navigate to project folder:**
```bash
cd electrical-monitor
```

2. **Install dependencies:**
```bash
npm install
```

## ▶️ Running the Server

**Start the server:**
```bash
npm start
```

Or with auto-restart on changes:
```bash
npm run dev
```

The server will start at: **http://localhost:3000**

## 📁 Project Structure

```
electrical-monitor/
│
├── server.js          # WebSocket server + data simulation
├── index.html         # Dashboard interface
├── package.json       # Dependencies
└── README.md          # This file
```

## 🔧 How It Works

### Server (server.js)
1. Creates Express HTTP server
2. Initializes WebSocket server on same port
3. Generates simulated sensor data every 1 second
4. Broadcasts JSON data to all connected clients

### Client (index.html)
1. Connects to WebSocket server
2. Receives real-time sensor data
3. Updates dashboard without page refresh
4. Handles connection/disconnection gracefully

## 📡 Data Format

The server sends data in this JSON format:

```json
{
  "type": "sensor_data",
  "data": {
    "timestamp": "2026-02-02T12:00:00.000Z",
    "voltage1": "18.45",
    "current1": "3.21",
    "power1": "59.23",
    "voltage2": "22.10",
    "current2": "4.50",
    "power2": "99.45"
  }
}
```

## 🔌 Arduino Integration (Future)

To connect real Arduino sensors:

1. **Install serial port library:**
```bash
npm install serialport @serialport/parser-readline
```

2. **Update server.js** - Replace `generateSensorData()` with:

```javascript
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (line) => {
  const data = JSON.parse(line);
  // Broadcast to clients
});
```

3. **Arduino code** should send JSON like:
```cpp
Serial.println("{\"voltage1\":18.5,\"current1\":3.2}");
```

## 🎨 Customization

### Change Update Interval
In `server.js`, modify the interval (in milliseconds):
```javascript
setInterval(broadcastSensorData, 1000); // Change 1000 to desired ms
```

### Change Voltage/Current Ranges
In `generateSensorData()`:
```javascript
voltage1: (Math.random() * 50).toFixed(2), // 0-50V instead of 0-25V
```

### Change Port
In `server.js`:
```javascript
const PORT = 8080; // Change from 3000 to 8080
```

## 🐛 Troubleshooting

**Server won't start:**
- Check if port 3000 is already in use
- Try: `taskkill /F /IM node.exe` (Windows) or `killall node` (Linux/Mac)

**Dashboard not updating:**
- Check browser console (F12) for WebSocket errors
- Verify server is running
- Try refreshing the page

**Can't access from another device:**
- Make sure both devices are on same network
- Use the Network URL shown in terminal: `http://100.97.114.176:3000`
- Check firewall settings

## 📝 License

MIT License - Feel free to use for your projects!

## 🤝 Contributing

Suggestions and improvements welcome!
