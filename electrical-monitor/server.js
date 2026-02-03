/**
 * Electrical Monitoring System - WebSocket Server
 * 
 * This server simulates real-time electrical monitoring data.
 * Currently generates random values, but can be easily modified
 * to read from Arduino sensors via serial port.
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create WebSocket server on port 3000
const wss = new WebSocket.Server({ server });

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the dashboard at root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Generate simulated sensor data
 * Replace this function with Arduino serial data reading
 * when connecting real sensors
 */
function generateSensorData() {
  return {
    timestamp: new Date().toISOString(),
    voltage1: (Math.random() * 25).toFixed(2),      // 0-25V
    current1: (Math.random() * 5).toFixed(2),       // 0-5A
    voltage2: (Math.random() * 25).toFixed(2),      // 0-25V
    current2: (Math.random() * 5).toFixed(2),       // 0-5A
    power1: 0,  // Will be calculated
    power2: 0   // Will be calculated
  };
}

/**
 * Calculate power (P = V × I) for each channel
 */
function calculatePower(data) {
  data.power1 = (parseFloat(data.voltage1) * parseFloat(data.current1)).toFixed(2);
  data.power2 = (parseFloat(data.voltage2) * parseFloat(data.current2)).toFixed(2);
  return data;
}

// Store connected clients
let clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('✅ New client connected');
  clients.push(ws);

  // Send initial welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to Electrical Monitoring System'
  }));

  // Handle client disconnection
  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients = clients.filter(client => client !== ws);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

/**
 * Broadcast sensor data to all connected clients
 * Runs every 1 second
 */
function broadcastSensorData() {
  // Generate and calculate sensor readings
  let data = generateSensorData();
  data = calculatePower(data);

  // Create JSON message
  const message = JSON.stringify({
    type: 'sensor_data',
    data: data
  });

  // Send to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  // Log data for debugging
  console.log(`📊 Broadcasting: V1=${data.voltage1}V, I1=${data.current1}A, P1=${data.power1}W | V2=${data.voltage2}V, I2=${data.current2}A, P2=${data.power2}W`);
}

// Start broadcasting data every 1000ms (1 second)
setInterval(broadcastSensorData, 1000);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   Electrical Monitoring System Server            ║
║   🚀 Server running at http://localhost:${PORT}    ║
║   📡 WebSocket ready for connections              ║
║   📊 Broadcasting data every 1 second             ║
╚═══════════════════════════════════════════════════╝
  `);
});

/**
 * TODO: Arduino Integration
 * 
 * To connect Arduino sensors, replace generateSensorData() with:
 * 
 * const SerialPort = require('serialport');
 * const Readline = require('@serialport/parser-readline');
 * 
 * const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
 * const parser = port.pipe(new Readline({ delimiter: '\n' }));
 * 
 * parser.on('data', (line) => {
 *   const data = JSON.parse(line);
 *   // Broadcast Arduino data to clients
 * });
 */
