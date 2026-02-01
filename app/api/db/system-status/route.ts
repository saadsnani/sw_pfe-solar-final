/**
 * API Route: System Status Database
 * Track system status f database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollection, COLLECTIONS } from '@/lib/db';
import { SystemStatusModel } from '@/lib/db-models';

export const revalidate = 3600; // Revalidate every hour for static export

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const statusData: SystemStatusModel = {
      ...data,
      timestamp: new Date(),
    };

    const collection = await getCollection(COLLECTIONS.SYSTEM_STATUS);
    const result = await collection.insertOne(statusData);

    return NextResponse.json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    console.error('[ERROR] System status save error:', error);
    return NextResponse.json(
      { error: 'Error f database' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection(COLLECTIONS.SYSTEM_STATUS);
    
    const latest = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    return NextResponse.json({
      success: true,
      data: latest[0] || null
    });

  } catch (error) {
    console.error('[ERROR] System status fetch error:', error);
    return NextResponse.json(
      { error: 'Error f database' },
      { status: 500 }
    );
  }
}
