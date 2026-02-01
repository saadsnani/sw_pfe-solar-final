/**
 * API Route: Save Sensor Data to Database
 * ESP32 WiFi ysift data hna bach nsaviw-ha f MongoDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollection, COLLECTIONS } from '@/lib/db';
import { validateSensorData, SensorDataModel } from '@/lib/db-models';

export const revalidate = 3600; // Revalidate every hour for static export

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate data
    if (!validateSensorData(data)) {
      return NextResponse.json(
        { error: 'Data machi s7i7a' },
        { status: 400 }
      );
    }

    // Add timestamp
    const sensorData: SensorDataModel = {
      ...data,
      timestamp: new Date(),
    };

    // Save to MongoDB
    const collection = await getCollection(COLLECTIONS.SENSOR_DATA);
    const result = await collection.insertOne(sensorData);

    console.log('[DB] Sensor data saved:', result.insertedId);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Data t-sav-at b-n-ja7'
    });

  } catch (error) {
    console.error('[ERROR] Ma-qderti-ch t-sav-i data:', error);
    return NextResponse.json(
      { error: 'Error f database' },
      { status: 500 }
    );
  }
}

// GET: Jib latest sensor data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const deviceId = searchParams.get('deviceId');

    const collection = await getCollection(COLLECTIONS.SENSOR_DATA);
    
    const query = deviceId ? { deviceId } : {};
    
    const data = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('[ERROR] Ma-qderti-ch njib data:', error);
    return NextResponse.json(
      { error: 'Error f database' },
      { status: 500 }
    );
  }
}
