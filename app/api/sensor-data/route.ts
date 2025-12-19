import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SensorReading {
  temperature?: number;
  humidity?: number;
  batteryTemperature?: number;
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
    const { temperature, humidity, batteryTemperature } = body;
    
    // Validate data
    if (temperature === undefined && humidity === undefined && batteryTemperature === undefined) {
      return NextResponse.json(
        { error: 'At least one sensor reading is required' },
        { status: 400 }
      );
    }
    
    // Create reading object
    const reading: SensorReading = {
      ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
      ...(humidity !== undefined && { humidity: parseFloat(humidity) }),
      ...(batteryTemperature !== undefined && { batteryTemperature: parseFloat(batteryTemperature) }),
      timestamp: new Date().toISOString(),
    };
    
    // ALWAYS store in memory (works in both dev and production)
    memoryStorage.push(reading);
    if (memoryStorage.length > MAX_READINGS) {
      memoryStorage = memoryStorage.slice(-MAX_READINGS);
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
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    // In production, use memory storage
    if (isProduction || memoryStorage.length > 0) {
      const readings = memoryStorage.slice(-limit).reverse();
      const current = readings.length > 0 ? readings[0] : null;
      
      return NextResponse.json({
        current,
        readings,
        count: readings.length,
        source: 'memory',
        totalInMemory: memoryStorage.length
      });
    }
    
    // In development, try to read from files
    ensureDataFile();
    
    if (dataType === 'all') {
      let batteryReadings: SensorReading[] = [];
      let standardReadings: SensorReading[] = [];
      
      if (fs.existsSync(BATTERY_TEMP_FILE)) {
        batteryReadings = JSON.parse(fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8'));
      }
      
      if (fs.existsSync(DATA_FILE)) {
        standardReadings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      }
      
      const allReadings = [...batteryReadings, ...standardReadings]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      
      const current = allReadings.length > 0 ? allReadings[0] : null;
      
      return NextResponse.json({
        current,
        readings: allReadings,
        count: allReadings.length,
        source: 'file'
      });
    }
    
    if (dataType === 'battery') {
      if (!fs.existsSync(BATTERY_TEMP_FILE)) {
        return NextResponse.json({ 
          current: null,
          readings: [],
          source: 'file'
        });
      }
      
      const readings: SensorReading[] = JSON.parse(fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8'));
      const current = readings.length > 0 ? readings[readings.length - 1] : null;
      
      return NextResponse.json({
        current,
        readings: readings.slice(-limit),
        count: readings.length,
        source: 'file'
      });
    }
    
    // Default: return standard sensor data
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ 
        current: null, 
        readings: [],
        source: 'file'
      });
    }
    
    const readings: SensorReading[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    return NextResponse.json({
      readings: readings.slice(-limit),
      source: 'file'
    });
    
  } catch (error) {
    console.error('[API] Error reading sensor data:', error);
    return NextResponse.json(
      { error: 'Failed to read sensor data', details: String(error) },
      { status: 500 }
    );
  }
}
