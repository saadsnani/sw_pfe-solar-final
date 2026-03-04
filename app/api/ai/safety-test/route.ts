import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FIREBASE_RTDB_URL =
  process.env.FIREBASE_RTDB_URL ||
  'https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app'

async function updateFirebaseSensors(overrides: Record<string, unknown>) {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')

  let current: Record<string, unknown> = {}
  try {
    const readRes = await fetch(`${baseUrl}/sensors.json`, { cache: 'no-store' })
    if (readRes.ok) {
      const data = (await readRes.json()) as Record<string, unknown> | null
      current = data && typeof data === 'object' ? data : {}
    }
  } catch {
    current = {}
  }

  const nextPayload = {
    ...current,
    ...overrides,
    updatedAt: new Date().toISOString(),
    source: 'ai_safety_test',
  }

  const writeRes = await fetch(`${baseUrl}/sensors.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nextPayload),
  })

  if (!writeRes.ok) {
    throw new Error(`Failed to write test sensors (${writeRes.status})`)
  }

  return nextPayload
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      batteryTemperature?: number
      temperature?: number
      batteryLevel?: number
      production?: number
      consumption?: number
      message?: string
      preferredLanguage?: 'darija' | 'fr' | 'en'
    }

    const injected = await updateFirebaseSensors({
      batteryTemperature: Number.isFinite(Number(body.batteryTemperature)) ? Number(body.batteryTemperature) : 55,
      temperature: Number.isFinite(Number(body.temperature)) ? Number(body.temperature) : 30,
      batteryLevel: Number.isFinite(Number(body.batteryLevel)) ? Number(body.batteryLevel) : 80,
      production: Number.isFinite(Number(body.production)) ? Number(body.production) : 1200,
      consumption: Number.isFinite(Number(body.consumption)) ? Number(body.consumption) : 450,
    })

    const chatRequest = {
      message: typeof body.message === 'string' && body.message.trim() ? body.message : 'status check',
      history: [],
      preferredLanguage: body.preferredLanguage || 'en',
    }

    const origin = request.nextUrl.origin
    const aiRes = await fetch(`${origin}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatRequest),
      cache: 'no-store',
    })

    const aiPayload = await aiRes.json()

    return NextResponse.json({
      success: true,
      injectedSensors: injected,
      aiResponse: aiPayload,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run safety test',
        details: String(error),
      },
      { status: 500 },
    )
  }
}
