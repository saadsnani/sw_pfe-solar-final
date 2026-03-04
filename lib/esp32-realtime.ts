export interface Esp32RealtimePayload {
  Vpv?: unknown
  Ipv?: unknown
  Vbatt?: unknown
  Ibatt?: unknown
  block1?: unknown
  block2?: unknown
  timestamp?: unknown
}

export interface Esp32RealtimeData {
  Vpv: number | null
  Ipv: number | null
  Vbatt: number | null
  Ibatt: number | null
  block1: boolean
  block2: boolean
  timestamp: string
}

export interface Esp32RealtimePower {
  Ppv: number | null
  Pbatt: number | null
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === '1' || normalized === 'true' || normalized === 'on'
  }

  return false
}

export function normalizeEsp32RealtimeData(input: unknown): Esp32RealtimeData | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const payload = input as Esp32RealtimePayload

  return {
    Vpv: toNumber(payload.Vpv),
    Ipv: toNumber(payload.Ipv),
    Vbatt: toNumber(payload.Vbatt),
    Ibatt: toNumber(payload.Ibatt),
    block1: toBoolean(payload.block1),
    block2: toBoolean(payload.block2),
    timestamp:
      typeof payload.timestamp === 'string' && payload.timestamp.length > 0
        ? payload.timestamp
        : new Date().toISOString(),
  }
}

export function calculateRealtimePower(data: Pick<Esp32RealtimeData, 'Vpv' | 'Ipv' | 'Vbatt' | 'Ibatt'>): Esp32RealtimePower {
  const Ppv = data.Vpv !== null && data.Ipv !== null ? data.Vpv * data.Ipv : null
  const Pbatt = data.Vbatt !== null && data.Ibatt !== null ? data.Vbatt * data.Ibatt : null

  return { Ppv, Pbatt }
}

export function deriveBatterySocFromVoltage(vbatt: number | null): number | null {
  if (vbatt === null) {
    return null
  }

  const minVoltage = 11.8
  const maxVoltage = 12.8
  const normalized = ((vbatt - minVoltage) / (maxVoltage - minVoltage)) * 100

  return Math.max(0, Math.min(100, normalized))
}
