import { NextResponse } from 'next/server'

const FIREBASE_RTDB_URL =
  process.env.FIREBASE_RTDB_URL ||
  'https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app'

type JsonObject = Record<string, unknown>

type RelaySnapshot = {
  inverter: boolean | null
  block1: boolean | null
  block2: boolean | null
}

function toBooleanOrNull(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === '1' || normalized === 'true' || normalized === 'on') return true
    if (normalized === '0' || normalized === 'false' || normalized === 'off') return false
  }
  return null
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function pickRelaySnapshot(control: JsonObject | null, sensors: JsonObject | null): RelaySnapshot {
  const controlRelays =
    control && typeof control.relays === 'object' && control.relays !== null
      ? (control.relays as JsonObject)
      : null

  return {
    inverter: toBooleanOrNull(controlRelays?.inverter) ?? toBooleanOrNull(sensors?.inverter),
    block1: toBooleanOrNull(controlRelays?.block1) ?? toBooleanOrNull(sensors?.block1),
    block2: toBooleanOrNull(controlRelays?.block2) ?? toBooleanOrNull(sensors?.block2),
  }
}

async function readFirebaseNode(nodePath: string): Promise<JsonObject | null> {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/${nodePath}.json`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Firebase read failed for ${nodePath} (${response.status})`)
  }

  const data = (await response.json()) as JsonObject | null
  if (!data || typeof data !== 'object') {
    return null
  }

  return data
}

export async function GET() {
  try {
    const [sensors, control] = await Promise.all([
      readFirebaseNode('sensors'),
      readFirebaseNode('control'),
    ])

    const relays = pickRelaySnapshot(control, sensors)

    return NextResponse.json({
      success: true,
      data: {
        sensors: {
          temperature: toNumberOrNull(sensors?.temperature),
          batteryTemperature: toNumberOrNull(sensors?.batteryTemperature),
          humidity: toNumberOrNull(sensors?.humidity),
          Vpv: toNumberOrNull(sensors?.Vpv),
          Ipv: toNumberOrNull(sensors?.Ipv),
          Vbatt: toNumberOrNull(sensors?.Vbatt),
          Ibatt: toNumberOrNull(sensors?.Ibatt),
          Ppv: toNumberOrNull(sensors?.Ppv),
          Pbatt: toNumberOrNull(sensors?.Pbatt),
          timestamp: toStringOrNull(sensors?.timestamp),
          updatedAt: toStringOrNull(sensors?.updatedAt),
          wifiSsid: toStringOrNull(sensors?.wifiSsid),
          source: toStringOrNull(sensors?.source),
        },
        relays: {
          mode: toStringOrNull(control?.mode) ?? toStringOrNull(sensors?.mode),
          inverter: relays.inverter,
          block1: relays.block1,
          block2: relays.block2,
          source: toStringOrNull(control?.source) ?? toStringOrNull(sensors?.controlSource),
          updatedAt: toStringOrNull(control?.updatedAt) ?? toStringOrNull(sensors?.controlUpdatedAt),
        },
        safetyOverride:
          control && typeof control.safetyOverride === 'object' && control.safetyOverride !== null
            ? control.safetyOverride
            : null,
        links: {
          sensorsNode: `${FIREBASE_RTDB_URL.replace(/\/$/, '')}/sensors.json?print=pretty`,
          controlNode: `${FIREBASE_RTDB_URL.replace(/\/$/, '')}/control.json?print=pretty`,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to build system overview',
        details: String(error),
      },
      { status: 500 },
    )
  }
}
