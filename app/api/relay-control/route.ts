import { NextRequest, NextResponse } from 'next/server'

type ControlMode = 'manual' | 'ai'

interface RelayState {
  inverter: boolean
  block1: boolean
  block2: boolean
}

interface ControlState {
  mode: ControlMode
  relays: RelayState
  updatedAt: string
  source: string
}

function enforceRelayDependency(relays: RelayState): RelayState {
  if (!relays.inverter) {
    return {
      inverter: false,
      block1: false,
      block2: false,
    }
  }

  return relays
}

const FIREBASE_RTDB_URL = process.env.FIREBASE_RTDB_URL || 'https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app'

let memoryControlState: ControlState = {
  mode: 'manual',
  relays: {
    inverter: false,
    block1: false,
    block2: false,
  },
  updatedAt: new Date().toISOString(),
  source: 'server_default',
}

async function writeControlToFirebase(state: ControlState) {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/control.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })

  if (!response.ok) {
    throw new Error(`Firebase control write failed (${response.status})`)
  }
}

async function readControlFromFirebase(): Promise<ControlState | null> {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/control.json`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Firebase control read failed (${response.status})`)
  }

  const data = (await response.json()) as ControlState | null
  if (!data || !data.relays) return null
  return data
}

export async function GET() {
  try {
    try {
      const firebaseState = await readControlFromFirebase()
      if (firebaseState) {
        memoryControlState = {
          ...firebaseState,
          relays: enforceRelayDependency(firebaseState.relays),
        }
      }
    } catch (firebaseError) {
      console.error('[RelayControl] Firebase read warning:', firebaseError)
    }

    return NextResponse.json({
      success: true,
      data: memoryControlState,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read control state', details: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const mode: ControlMode = body?.mode === 'ai' ? 'ai' : 'manual'
    const requestedRelays: RelayState = {
      inverter: Boolean(body?.relays?.inverter),
      block1: Boolean(body?.relays?.block1),
      block2: Boolean(body?.relays?.block2),
    }
    const relays = enforceRelayDependency(requestedRelays)

    const nextState: ControlState = {
      mode,
      relays,
      updatedAt: new Date().toISOString(),
      source: body?.source ? String(body.source) : 'dashboard',
    }

    memoryControlState = nextState

    try {
      await writeControlToFirebase(nextState)
      console.log('[RelayControl] ✅ Synced to Firebase /control')
    } catch (firebaseError) {
      console.error('[RelayControl] ⚠️ Firebase sync failed:', firebaseError)
    }

    return NextResponse.json({
      success: true,
      data: nextState,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update control state', details: String(error) },
      { status: 500 },
    )
  }
}
