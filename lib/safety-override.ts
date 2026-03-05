export interface SafetySensorDataInput {
  temperature?: unknown
  batteryTemperature?: unknown
  tempBattery?: unknown
  voltage?: unknown
  Vbatt?: unknown
  batteryVoltage?: unknown
}

export interface SafetyOverrideResult {
  emergencyShutdown: boolean
  reason: string
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function pickNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed = toFiniteNumber(value)
    if (parsed !== null) {
      return parsed
    }
  }

  return null
}

export function enforceSafetyRules(sensorData: SafetySensorDataInput | null | undefined): SafetyOverrideResult {
  const temperature = pickNumber(
    sensorData?.batteryTemperature,
    sensorData?.tempBattery,
    sensorData?.temperature,
  )
  const voltage = pickNumber(sensorData?.voltage, sensorData?.Vbatt, sensorData?.batteryVoltage)

  const reasons: string[] = []

  if (temperature !== null && temperature > 65) {
    reasons.push(`Temperature critical (${temperature.toFixed(1)}C > 65C)`)
  }

  if (voltage !== null && voltage < 10) {
    reasons.push(`Voltage critical (${voltage.toFixed(2)}V < 10V)`)
  }

  if (reasons.length > 0) {
    return {
      emergencyShutdown: true,
      reason: reasons.join(' | '),
    }
  }

  return {
    emergencyShutdown: false,
    reason: 'No emergency safety thresholds triggered.',
  }
}
