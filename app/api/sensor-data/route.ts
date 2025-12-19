import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SensorReading {
  temperature: number;
  humidity: number;
  timestamp: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'sensor-readings.json');

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
    const { temperature, humidity, timestamp } = body;
    
    // Validate data
    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: 'Temperature and humidity are required' },
        { status: 400 }
      );
    }
    
    // Create reading object
    const reading: SensorReading = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      timestamp: new Date().toISOString(),
    };
    
    // Read existing data
    let readings: SensorReading[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      readings = JSON.parse(fileContent);
    }
    
    // Add new reading
    readings.push(reading);
    
    // Keep only last 1000 readings to avoid file size issues
    if (readings.length > 1000) {
      readings = readings.slice(-1000);
    }
    
    // Save to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(readings, null, 2));
    
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

export async function GET() {
  try {
    ensureDataFile();
    
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
