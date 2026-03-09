import { NextRequest, NextResponse } from 'next/server'
import {
  evaluateSystemState,
  relayCommandsToBooleanState,
  type RelayCommandState,
  type SystemSensorDataInput,
} from '@/lib/autonomous-decision-engine'
import {
  enforceSafetyRules,
  type SafetyOverrideResult,
  type SafetySensorDataInput,
} from '@/lib/safety-override'

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
  safetyOverride?: SafetyOverrideState
}

interface SafetyOverrideState extends SafetyOverrideResult {
  triggeredAt: string
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === '1' || normalized === 'true' || normalized === 'on') {
      return true
    }

    if (normalized === '0' || normalized === 'false' || normalized === 'off') {
      return false
    }
  }

  return fallback
}

function relayStateToCommands(relays: RelayState): RelayCommandState {
  return {
    inverter: relays.inverter ? 'ON' : 'OFF',
    block1: relays.block1 ? 'ON' : 'OFF',
    block2: relays.block2 ? 'ON' : 'OFF',
  }
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

async function readLatestSensorsFromFirebase(): Promise<SafetySensorDataInput | null> {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/sensors.json`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Firebase sensors read failed (${response.status})`)
  }

  const data = (await response.json()) as SafetySensorDataInput | null
  if (!data || typeof data !== 'object') {
    return null
  }

  return data
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

async function mirrorControlToSensors(state: ControlState) {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')
  const mirrorPayload = {
    inverter: state.relays.inverter,
    block1: state.relays.block1,
    block2: state.relays.block2,
    mode: state.mode,
    controlSource: state.source,
    controlUpdatedAt: state.updatedAt,
    relayMirrorUpdatedAt: new Date().toISOString(),
  }

  const response = await fetch(`${baseUrl}/sensors.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mirrorPayload),
  })

  if (!response.ok) {
    throw new Error(`Firebase sensors mirror failed (${response.status})`)
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
    const currentRelayStateFromBody = body?.currentRelayState ?? {}
    const rawSensorData =
      body?.sensorData && typeof body.sensorData === 'object'
        ? (body.sensorData as Record<string, unknown>)
        : null

    let safetySensorData: SafetySensorDataInput | null = rawSensorData
      ? (rawSensorData as SafetySensorDataInput)
      : null

    if (!safetySensorData) {
      try {
        safetySensorData = await readLatestSensorsFromFirebase()
      } catch (firebaseError) {
        console.error('[RelayControl] Safety snapshot read warning:', firebaseError)
      }
    }

    const safetyOverride = enforceSafetyRules(safetySensorData)

    const mode: ControlMode = body?.mode === 'ai' ? 'ai' : 'manual'
    const requestedRelays: RelayState = {
      inverter: parseBoolean(
        body?.relays?.inverter,
        parseBoolean(currentRelayStateFromBody?.inverter, memoryControlState.relays.inverter),
      ),
      block1: parseBoolean(
        body?.relays?.block1,
        parseBoolean(currentRelayStateFromBody?.block1, memoryControlState.relays.block1),
      ),
      block2: parseBoolean(
        body?.relays?.block2,
        parseBoolean(currentRelayStateFromBody?.block2, memoryControlState.relays.block2),
      ),
    }

    // Safety override always wins over AI/manual relay requests.
    if (safetyOverride.emergencyShutdown) {
      const triggeredAt = new Date().toISOString()
      const emergencyState: ControlState = {
        mode,
        relays: {
          inverter: false,
          block1: false,
          block2: false,
        },
        updatedAt: triggeredAt,
        source: 'safety_override',
        safetyOverride: {
          ...safetyOverride,
          triggeredAt,
        },
      }

      memoryControlState = emergencyState

      try {
        await writeControlToFirebase(emergencyState)
        await mirrorControlToSensors(emergencyState)
        console.warn('[RelayControl] 🚨 Emergency shutdown synced to Firebase /control')
      } catch (firebaseError) {
        console.error('[RelayControl] ⚠️ Safety override sync failed:', firebaseError)
      }

      return NextResponse.json({
        success: true,
        data: emergencyState,
        commands: relayStateToCommands(emergencyState.relays),
        safetyOverride: emergencyState.safetyOverride,
      })
    }

    const sensorData: SystemSensorDataInput | null = rawSensorData
      ? (rawSensorData as SystemSensorDataInput)
      : null

    let evaluatedCommands: RelayCommandState | null = null

    const relays =
      mode === 'ai' && sensorData
        ? (() => {
            evaluatedCommands = evaluateSystemState(sensorData, requestedRelays)
            return enforceRelayDependency(relayCommandsToBooleanState(evaluatedCommands))
          })()
        : enforceRelayDependency(requestedRelays)

    const commands = evaluatedCommands ?? relayStateToCommands(relays)

    const nextState: ControlState = {
      mode,
      relays,
      updatedAt: new Date().toISOString(),
      source: body?.source ? String(body.source) : 'dashboard',
    }

    memoryControlState = nextState

    try {
      await writeControlToFirebase(nextState)
      await mirrorControlToSensors(nextState)
      console.log('[RelayControl] ✅ Synced to Firebase /control')
    } catch (firebaseError) {
      console.error('[RelayControl] ⚠️ Firebase sync failed:', firebaseError)
    }

    return NextResponse.json({
      success: true,
      data: nextState,
      commands,
      safetyOverride,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update control state', details: String(error) },
      { status: 500 },
    )
  }
}
