export type HealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL'

export interface HealthReport {
  status: HealthStatus
  message: string
}

export interface HistoricalSensorDataPoint {
  timestamp: string | number | Date
  voltage?: unknown
  current?: unknown
  temperature?: unknown
  Vpv?: unknown
  Vbatt?: unknown
  Ipv?: unknown
  Ibatt?: unknown
  batteryTemperature?: unknown
  tempBattery?: unknown
}

interface NormalizedPoint {
  timestampMs: number
  voltage: number | null
  current: number | null
  temperature: number | null
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

function toTimestampMs(value: string | number | Date): number | null {
  if (value instanceof Date) {
    const ms = value.getTime()
    return Number.isFinite(ms) ? ms : null
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null

    // Accept seconds or milliseconds.
    return value < 1_000_000_000_000 ? value * 1000 : value
  }

  if (typeof value === 'string') {
    const ms = Date.parse(value)
    return Number.isFinite(ms) ? ms : null
  }

  return null
}

function pickFirstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed = toFiniteNumber(value)
    if (parsed !== null) {
      return parsed
    }
  }

  return null
}

function median(values: number[]): number | null {
  if (values.length === 0) return null

  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

function normalizePoint(point: HistoricalSensorDataPoint): NormalizedPoint | null {
  const timestampMs = toTimestampMs(point.timestamp)
  if (timestampMs === null) {
    return null
  }

  return {
    timestampMs,
    voltage: pickFirstNumber(point.voltage, point.Vbatt, point.Vpv),
    current: pickFirstNumber(point.current, point.Ibatt, point.Ipv),
    temperature: pickFirstNumber(point.temperature, point.batteryTemperature, point.tempBattery),
  }
}

function getPreviousValues(
  points: NormalizedPoint[],
  currentIndex: number,
  key: 'voltage' | 'current' | 'temperature',
  windowSize = 6,
): number[] {
  const values: number[] = []

  for (let index = currentIndex - 1; index >= 0 && values.length < windowSize; index -= 1) {
    const value = points[index][key]
    if (value !== null) {
      values.push(value)
    }
  }

  return values
}

export function detectAnomalies(historicalData: HistoricalSensorDataPoint[]): HealthReport {
  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    return {
      status: 'WARNING',
      message: 'Health report unavailable: no historical sensor data for the last 24h.',
    }
  }

  const now = Date.now()
  const last24hStart = now - 24 * 60 * 60 * 1000

  const points = historicalData
    .map(normalizePoint)
    .filter((point): point is NormalizedPoint => point !== null)
    .filter((point) => point.timestampMs >= last24hStart)
    .sort((a, b) => a.timestampMs - b.timestampMs)

  if (points.length < 6) {
    return {
      status: 'WARNING',
      message: 'Not enough samples in the last 24h to generate a reliable health report.',
    }
  }

  let voltageDrops = 0
  let severeVoltageDrops = 0
  let temperatureSpikes = 0
  let severeTemperatureSpikes = 0
  let suspiciousConnectionEvents = 0
  let maxVoltageDrop = 0
  let maxTemperature: number | null = null
  let flatTemperatureRun = 1
  let maxFlatTemperatureRun = 1
  let previousTemperature: number | null = null

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index]

    if (point.temperature !== null) {
      maxTemperature = maxTemperature === null ? point.temperature : Math.max(maxTemperature, point.temperature)

      if (previousTemperature !== null && Math.abs(point.temperature - previousTemperature) < 0.01) {
        flatTemperatureRun += 1
      } else {
        flatTemperatureRun = 1
      }

      maxFlatTemperatureRun = Math.max(maxFlatTemperatureRun, flatTemperatureRun)
      previousTemperature = point.temperature
    }

    const previousVoltages = getPreviousValues(points, index, 'voltage')
    const voltageBaseline = median(previousVoltages)

    if (point.voltage !== null && voltageBaseline !== null) {
      const dropAbsolute = voltageBaseline - point.voltage
      const dropRatio = dropAbsolute / Math.max(voltageBaseline, 0.01)
      const isDrop = dropAbsolute >= 1.2 || dropRatio >= 0.15
      const isSevereDrop = dropAbsolute >= 2.5 || dropRatio >= 0.25

      if (isDrop) {
        voltageDrops += 1
        maxVoltageDrop = Math.max(maxVoltageDrop, dropAbsolute)
      }

      if (isSevereDrop) {
        severeVoltageDrops += 1
      }

      if (isDrop) {
        const currentBaseline = median(getPreviousValues(points, index, 'current'))
        if (point.current !== null && currentBaseline !== null) {
          const currentDeviation =
            Math.abs(point.current - currentBaseline) / Math.max(Math.abs(currentBaseline), 0.1)

          // Voltage collapses while current remains stable often indicates wiring/contact issues.
          if (currentDeviation <= 0.2) {
            suspiciousConnectionEvents += 1
          }
        }
      }
    }

    const previousTemperatures = getPreviousValues(points, index, 'temperature')
    const temperatureBaseline = median(previousTemperatures)

    if (point.temperature !== null && temperatureBaseline !== null) {
      const spikeAbsolute = point.temperature - temperatureBaseline
      const previousPointTemperature = index > 0 ? points[index - 1].temperature : null
      const jumpAbsolute =
        previousPointTemperature !== null ? point.temperature - previousPointTemperature : 0

      const isSpike = spikeAbsolute >= 6 || jumpAbsolute >= 8
      const isSevereSpike = point.temperature >= 60 || spikeAbsolute >= 10 || jumpAbsolute >= 12

      if (isSpike) {
        temperatureSpikes += 1
      }

      if (isSevereSpike) {
        severeTemperatureSpikes += 1
      }
    }
  }

  const sensorStuckSuspected = maxFlatTemperatureRun >= 15
  const hasCriticalAnomaly =
    severeVoltageDrops >= 2
    || severeTemperatureSpikes >= 1
    || suspiciousConnectionEvents >= 3
    || sensorStuckSuspected
    || (maxTemperature !== null && maxTemperature >= 65)

  const hasWarningAnomaly =
    voltageDrops > 0 || temperatureSpikes > 0 || suspiciousConnectionEvents > 0 || sensorStuckSuspected

  if (hasCriticalAnomaly) {
    const maxTempText = maxTemperature !== null ? `${maxTemperature.toFixed(1)}C` : 'n/a'

    return {
      status: 'CRITICAL',
      message:
        `Critical anomalies detected in the last 24h: ${voltageDrops} voltage drops, `
        + `${temperatureSpikes} temperature spikes (max ${maxTempText}). `
        + 'Potential loose connection or sensor failure. Immediate inspection is recommended.',
    }
  }

  if (hasWarningAnomaly) {
    return {
      status: 'WARNING',
      message:
        `Warning: ${voltageDrops} voltage drops and ${temperatureSpikes} temperature spikes detected `
        + `in the last 24h. Largest voltage drop: ${maxVoltageDrop.toFixed(2)}V. `
        + 'Check wiring quality and sensor stability.',
    }
  }

  return {
    status: 'NORMAL',
    message: 'No significant voltage drops or temperature spikes detected in the last 24h.',
  }
}
