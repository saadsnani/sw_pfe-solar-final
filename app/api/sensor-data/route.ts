import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SensorReading {
  temperature?: number;
  humidity?: number;
  batteryTemperature?: number;
  timestamp: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'sensor-readings.json');
const BATTERY_TEMP_FILE = path.join(process.cwd(), 'data', 'battery-temperature.json');

function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataFile();
    
    const body = await request.json();
    const { temperature, humidity, batteryTemperature } = body;
    
    // Validate data - at least one type of data should be present
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
    
    // Handle battery temperature data separately
    if (batteryTemperature !== undefined) {
      const dataDir = path.dirname(BATTERY_TEMP_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      let batteryReadings: SensorReading[] = [];
      if (fs.existsSync(BATTERY_TEMP_FILE)) {
        const fileContent = fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8');
        batteryReadings = JSON.parse(fileContent);
      }
      
      batteryReadings.push(reading);
      
      // Keep only last 500 readings
      if (batteryReadings.length > 500) {
        batteryReadings = batteryReadings.slice(-500);
      }
      
      fs.writeFileSync(BATTERY_TEMP_FILE, JSON.stringify(batteryReadings, null, 2));
    }
    
    // Handle standard sensor data
    if (temperature !== undefined || humidity !== undefined) {
      let readings: SensorReading[] = [];
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        readings = JSON.parse(fileContent);
      }
      
      readings.push(reading);
      
      // Keep only last 1000 readings to avoid file size issues
      if (readings.length > 1000) {
        readings = readings.slice(-1000);
      }
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(readings, null, 2));
    }
    
    console.log('Sensor data saved:', reading);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Sensor data received',
        data: reading 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing sensor data:', error);
    return NextResponse.json(
      { error: 'Failed to process sensor data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    ensureDataFile();
    
    // Check if we need battery temperature data
    const url = new URL(request.url);
    const dataType = url.searchParams.get('type');
    
    if (dataType === 'battery') {
      // Return battery temperature data
      if (!fs.existsSync(BATTERY_TEMP_FILE)) {
        return NextResponse.json({ 
          current: null,
          readings: []
        });
      }
      
      const fileContent = fs.readFileSync(BATTERY_TEMP_FILE, 'utf-8');
      const readings: SensorReading[] = JSON.parse(fileContent);
      
      // Get latest reading
      const current = readings.length > 0 ? readings[readings.length - 1] : null;
      
      return NextResponse.json({
        current,
        readings,
        count: readings.length
      });
    }
    
    // Return standard sensor data
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json([]);
    }
    
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    const readings: SensorReading[] = JSON.parse(fileContent);
    
    return NextResponse.json(readings);
  } catch (error) {
    console.error('Error reading sensor data:', error);
    return NextResponse.json(
      { error: 'Failed to read sensor data' },
      { status: 500 }
    );
  }
}
