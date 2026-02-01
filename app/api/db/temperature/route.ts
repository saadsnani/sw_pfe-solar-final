/**
 * API Route: Temperature Logs Database
 * Sav w jib temperature logs mn database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollection, COLLECTIONS } from '@/lib/db';
import { validateTemperatureLog, TemperatureLogModel } from '@/lib/db-models';

export const revalidate = 3600; // Revalidate every hour for static export

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!validateTemperatureLog(data)) {
      return NextResponse.json(
        { error: 'Temperature data machi s7i7a' },
        { status: 400 }
      );
    }

    const tempLog: TemperatureLogModel = {
      ...data,
      timestamp: new Date(),
    };

    const collection = await getCollection(COLLECTIONS.TEMPERATURE_LOGS);
    const result = await collection.insertOne(tempLog);

    return NextResponse.json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    console.error('[ERROR] Temperature log save error:', error);
    return NextResponse.json(
      { error: 'Error f database' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const deviceId = searchParams.get('deviceId');

    const collection = await getCollection(COLLECTIONS.TEMPERATURE_LOGS);
    
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const query: any = { timestamp: { $gte: startTime } };
    
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const logs = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error) {
    console.error('[ERROR] Temperature logs fetch error:', error);
    return NextResponse.json(
      { error: 'Error f database' },
      { status: 500 }
    );
  }
}
