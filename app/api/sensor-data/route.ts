import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCollection, COLLECTIONS } from '@/lib/db';
import { SensorDataModel } from '@/lib/db-models';

// Allow static export for mobile app
// This will be cached when used with "output: export"
export const revalidate = 3600; // Revalidate every hour

interface SensorReading {
  temperature?: number;
  humidity?: number;
  batteryTemperature?: number;
  wifiSsid?: string;
  sensorError?: boolean;
  timestamp: string;
}

// In-memory storage for Vercel (since filesystem is read-only in production)
let memoryStorage: SensorReading[] = [];
const MAX_READINGS = 1000;

const DATA_FILE = path.join(process.cwd(), 'data', 'sensor-readings.json');
const BATTERY_TEMP_FILE = path.join(process.cwd(), 'data', 'battery-temperature.json');

// Check if we're in production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

function ensureDataFile() {
  // Skip file operations in production
  if (isProduction) return;
  
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { temperature, humidity, batteryTemperature, wifiSsid, sensorError } = body;
    
    // 🔥 LOG: Show incoming data in terminal
    console.log('\n' + '='.repeat(60));
    console.log('📥 DATA MN ESP32 WASSAL:');
    console.log('='.repeat(60));
    console.log('🌡️  Battery Temperature:', batteryTemperature !== undefined ? `${batteryTemperature}°C` : 'N/A');
    console.log('🌡️  Temperature:', temperature !== undefined ? `${temperature}°C` : 'N/A');
    console.log('💧 Humidity:', humidity !== undefined ? `${humidity}%` : 'N/A');
    console.log('📡 WiFi SSID:', wifiSsid || 'N/A');
    console.log('⚠️  Sensor Error:', sensorError ? 'YES' : 'NO');
    console.log('🕐 Time:', new Date().toLocaleTimeString('fr-FR'));
    console.log('='.repeat(60) + '\n');
    
    // Validate data - allow error status even without readings
    if (temperature === undefined && humidity === undefined && batteryTemperature === undefined && !sensorError) {
      return NextResponse.json(
        { error: 'At least one sensor reading is required' },
        { status: 400 }
      );
    }
    
    // Create reading object
    const reading: SensorReading = {
      ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
      ...(humidity !== undefined && { humidity: parseFloat(humidity) }),
      ...(batteryTemperature !== undefined && batteryTemperature !== null && { batteryTemperature: parseFloat(batteryTemperature) }),
      ...(wifiSsid !== undefined && { wifiSsid: String(wifiSsid) }),
      ...(sensorError && { sensorError: true }),
      timestamp: new Date().toISOString(),
    };
    
    // ALWAYS store in memory (works in both dev and production)
    memoryStorage.push(reading);
    if (memoryStorage.length > MAX_READINGS) {
      memoryStorage = memoryStorage.slice(-MAX_READINGS);
    }
    
    // Try to save to MongoDB database (WiFi data storage)
    try {
      const sensorData: SensorDataModel = {
        timestamp: new Date(),
        temperature: temperature !== undefined ? parseFloat(temperature) : 0,
        humidity: humidity !== undefined ? parseFloat(humidity) : undefined,
        voltage: undefined,
        current: undefined,
        power: undefined,
        deviceId: wifiSsid || 'unknown',
        wifiSignal: undefined,
        source: 'esp32',
      };
      
      const collection = await getCollection(COLLECTIONS.SENSOR_DATA);
      await collection.insertOne(sensorData);
      console.log('[DB] ✅ Data t-sav-at f MongoDB via WiFi');
    } catch (dbError) {
      console.error('[DB] ⚠️ Ma-qderti-ch tsave f database:', dbError);
      // Continue even if DB fails - memory storage still works
    }
    
    // Also try to save to file in development only
    if (!isProduction) {
      try {
        ensureDataFile();
        
        // Read existing data
        let readings: SensorReading[] = [];
        if (fs.existsSync(DATA_FILE)) {
          const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
          readings = JSON.parse(fileContent);
        }
        
        readings.push(reading);
        if (readings.length > 1000) {
          readings = readings.slice(-1000);
        }
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(readings, null, 2));
        
        // Battery temperature file
        if (batteryTemperature !== undefined) {
          const dataDir = path.dirname(BATTERY_TEMP_FILE);
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          
          let batteryReadings: SensorReading[] = [];
          if (fs.existsSync(BATTERY_TEMP_FILE)) {
            batteryReadings = JSON.parse(fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8'));
          }
          
          batteryReadings.push(reading);
          if (batteryReadings.length > 1000) {
            batteryReadings = batteryReadings.slice(-1000);
          }
          
          fs.writeFileSync(BATTERY_TEMP_FILE, JSON.stringify(batteryReadings, null, 2));
        }
      } catch (fileError) {
        console.error('File write error (non-fatal):', fileError);
      }
    }
    
    console.log('[API] Sensor data saved:', reading, '| Storage:', isProduction ? 'memory' : 'file+memory');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Sensor data received',
        data: reading,
        storage: isProduction ? 'memory' : 'file+memory',
        memoryCount: memoryStorage.length
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error processing sensor data:', error);
    return NextResponse.json(
      { error: 'Failed to process sensor data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const dataType = url.searchParams.get('type');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100') || 100, 500);
    
    // Validate limit
    if (limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit parameter', current: null, readings: [], count: 0 },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In production, use memory storage
    if (isProduction || memoryStorage.length > 0) {
      const readings = memoryStorage.slice(-limit).reverse();
      const current = readings.length > 0 ? readings[0] : null;
      
      return NextResponse.json(
        {
          current,
          readings,
          count: readings.length,
          source: 'memory',
          totalInMemory: memoryStorage.length,
          timestamp: new Date().toISOString()
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In development, try to read from files
    ensureDataFile();
    
    if (dataType === 'all') {
      let batteryReadings: SensorReading[] = [];
      let standardReadings: SensorReading[] = [];
      
      try {
        if (fs.existsSync(BATTERY_TEMP_FILE)) {
          const batteryContent = fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8');
          batteryReadings = JSON.parse(batteryContent);
        }
      } catch (e) {
        console.error('[API] Battery file parse error:', e);
        // Continue with empty array if parse fails
      }
      
      try {
        if (fs.existsSync(DATA_FILE)) {
          const dataContent = fs.readFileSync(DATA_FILE, 'utf-8');
          standardReadings = JSON.parse(dataContent);
        }
      } catch (e) {
        console.error('[API] Data file parse error:', e);
        // Continue with empty array if parse fails
      }
      
      const allReadings = [...batteryReadings, ...standardReadings]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      
      const current = allReadings.length > 0 ? allReadings[0] : null;
      
      return NextResponse.json(
        {
          current,
          readings: allReadings,
          count: allReadings.length,
          source: 'file',
          timestamp: new Date().toISOString()
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (dataType === 'battery') {
      if (!fs.existsSync(BATTERY_TEMP_FILE)) {
        return NextResponse.json(
          { 
            current: null,
            readings: [],
            count: 0,
            source: 'file',
            timestamp: new Date().toISOString()
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        const batteryContent = fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8');
        const readings: SensorReading[] = JSON.parse(batteryContent);
        const current = readings.length > 0 ? readings[readings.length - 1] : null;
        
        return NextResponse.json(
          {
            current,
            readings: readings.slice(-limit),
            count: readings.length,
            source: 'file',
            timestamp: new Date().toISOString()
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('[API] Battery temp file parse error:', parseError);
        // Return empty response instead of error to prevent JSON parse errors in client
        return NextResponse.json(
          {
            current: null,
            readings: [],
            count: 0,
            source: 'file',
            timestamp: new Date().toISOString()
          },
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }
    
    // Default: return standard sensor data
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { 
          current: null, 
          readings: [],
          count: 0,
          source: 'file',
          timestamp: new Date().toISOString()
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    try {
      const dataContent = fs.readFileSync(DATA_FILE, 'utf-8');
      const readings: SensorReading[] = JSON.parse(dataContent);
      return NextResponse.json(
        {
          current: readings.length > 0 ? readings[readings.length - 1] : null,
          readings: readings.slice(-limit),
          count: readings.length,
          source: 'file',
          timestamp: new Date().toISOString()
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('[API] Data file parse error:', parseError);
      // Return empty response instead of error
      return NextResponse.json(
        {
          current: null,
          readings: [],
          count: 0,
          source: 'file',
          timestamp: new Date().toISOString()
        },
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
  } catch (error) {
    console.error('[API] Error reading sensor data:', error);
    return NextResponse.json(
      { error: 'Failed to read sensor data', details: String(error) },
      { status: 500 }
    );
  }
}
