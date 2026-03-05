export type RelayCommand = 'ON' | 'OFF'

export interface RelayCommandState {
  inverter: RelayCommand
  block1: RelayCommand
  block2: RelayCommand
}

export interface RelayBooleanState {
  inverter: boolean
  block1: boolean
  block2: boolean
}

export interface CurrentRelayStateInput {
  inverter?: unknown
  block1?: unknown
  block2?: unknown
}

export interface SystemSensorDataInput {
  voltage?: unknown
  Vbatt?: unknown
  batteryVoltage?: unknown
  current?: unknown
  Ibatt?: unknown
  batteryCurrent?: unknown
  batteryTemperature?: unknown
  batteryTemp?: unknown
  tempBattery?: unknown
  temperature?: unknown
  batteryLevel?: unknown
  soc?: unknown
  stateOfCharge?: unknown
}

interface NormalizedSensorData {
  voltage: number | null
  current: number | null
  batteryTemperature: number | null
  batteryLevel: number | null
}

export interface DecisionRuleContext {
  sensorData: NormalizedSensorData
  currentRelayState: RelayCommandState
  proposedRelayState: RelayCommandState
}

export interface DecisionRule {
  id: string
  evaluate: (context: DecisionRuleContext) => Partial<RelayCommandState> | null
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

function toRelayCommand(value: unknown, fallback: RelayCommand): RelayCommand {
  if (typeof value === 'boolean') {
    return value ? 'ON' : 'OFF'
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value !== 0 ? 'ON' : 'OFF'
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'on' || normalized === 'true' || normalized === '1') {
      return 'ON'
    }

    if (normalized === 'off' || normalized === 'false' || normalized === '0') {
      return 'OFF'
    }
  }

  return fallback
}

function normalizeSensorData(input: SystemSensorDataInput | null | undefined): NormalizedSensorData {
  return {
    voltage: pickNumber(input?.voltage, input?.Vbatt, input?.batteryVoltage),
    current: pickNumber(input?.current, input?.Ibatt, input?.batteryCurrent),
    batteryTemperature: pickNumber(
      input?.batteryTemperature,
      input?.batteryTemp,
      input?.tempBattery,
      input?.temperature,
    ),
    batteryLevel: pickNumber(input?.batteryLevel, input?.soc, input?.stateOfCharge),
  }
}

function normalizeRelayState(input: CurrentRelayStateInput | null | undefined): RelayCommandState {
  return {
    inverter: toRelayCommand(input?.inverter, 'OFF'),
    block1: toRelayCommand(input?.block1, 'OFF'),
    block2: toRelayCommand(input?.block2, 'OFF'),
  }
}

function mergeRelayCommands(
  current: RelayCommandState,
  patch: Partial<RelayCommandState>,
): RelayCommandState {
  return {
    inverter: patch.inverter ?? current.inverter,
    block1: patch.block1 ?? current.block1,
    block2: patch.block2 ?? current.block2,
  }
}

function enforceRelayDependency(commands: RelayCommandState): RelayCommandState {
  if (commands.inverter === 'OFF') {
    return {
      inverter: 'OFF',
      block1: 'OFF',
      block2: 'OFF',
    }
  }

  return commands
}

// Rules are intentionally independent so you can add/remove them without
// changing the engine function.
export const DEFAULT_DECISION_RULES: DecisionRule[] = [
  {
    id: 'critical-battery-level',
    evaluate: ({ sensorData }) => {
      if (sensorData.batteryLevel !== null && sensorData.batteryLevel < 20) {
        return { inverter: 'OFF', block1: 'OFF', block2: 'OFF' }
      }

      return null
    },
  },
  {
    id: 'critical-low-voltage',
    evaluate: ({ sensorData }) => {
      if (sensorData.voltage !== null && sensorData.voltage < 11.8) {
        return { inverter: 'OFF', block1: 'OFF', block2: 'OFF' }
      }

      return null
    },
  },
  {
    id: 'critical-battery-overheat',
    evaluate: ({ sensorData }) => {
      if (sensorData.batteryTemperature !== null && sensorData.batteryTemperature >= 55) {
        return { inverter: 'OFF', block1: 'OFF', block2: 'OFF' }
      }

      return null
    },
  },
  {
    id: 'warm-battery-load-shedding',
    evaluate: ({ sensorData, proposedRelayState }) => {
      if (sensorData.batteryTemperature !== null && sensorData.batteryTemperature >= 45) {
        return {
          inverter: proposedRelayState.inverter,
          block1: proposedRelayState.block1,
          block2: 'OFF',
        }
      }

      return null
    },
  },
  {
    id: 'low-current-load-shedding',
    evaluate: ({ sensorData, proposedRelayState }) => {
      if (
        sensorData.current !== null
        && sensorData.current < 0.8
        && sensorData.voltage !== null
        && sensorData.voltage < 12.2
      ) {
        return {
          inverter: proposedRelayState.inverter,
          block1: proposedRelayState.block1,
          block2: 'OFF',
        }
      }

      return null
    },
  },
]

export function evaluateSystemState(
  sensorData: SystemSensorDataInput,
  currentRelayState: CurrentRelayStateInput,
  rules: DecisionRule[] = DEFAULT_DECISION_RULES,
): RelayCommandState {
  const normalizedSensorData = normalizeSensorData(sensorData)
  const normalizedCurrentRelayState = normalizeRelayState(currentRelayState)

  let proposedRelayState = normalizedCurrentRelayState

  for (const rule of rules) {
    const patch = rule.evaluate({
      sensorData: normalizedSensorData,
      currentRelayState: normalizedCurrentRelayState,
      proposedRelayState,
    })

    if (!patch) {
      continue
    }

    proposedRelayState = enforceRelayDependency(mergeRelayCommands(proposedRelayState, patch))
  }

  return enforceRelayDependency(proposedRelayState)
}

export function relayCommandsToBooleanState(commands: RelayCommandState): RelayBooleanState {
  return {
    inverter: commands.inverter === 'ON',
    block1: commands.block1 === 'ON',
    block2: commands.block2 === 'ON',
  }
}
