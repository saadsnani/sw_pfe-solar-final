/**
 * Sensor Connection State Management
 * 
 * Defines types and utilities for managing sensor connection states.
 * Ensures NO fake data - only returns real values or null if not connected.
 */

/**
 * Connection status of a sensor
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'initializing'

/**
 * Base sensor connection state
 * 
 * @example
 * const batteryState: SensorConnection<number> = {
 *   connected: true,
 *   value: 85,
 *   status: 'connected',
 *   statusMessage: 'Connected',
 *   lastUpdate: new Date().toISOString(),
 *   error: null
 * }
 * 
 * const batterieDeconnected: SensorConnection<number> = {
 *   connected: false,
 *   value: null,
 *   status: 'disconnected',
 *   statusMessage: 'Non connectée',
 *   lastUpdate: new Date().toISOString(),
 *   error: 'No device found'
 * }
 */
export interface SensorConnection<T> {
  /** Whether the sensor/component is physically connected */
  connected: boolean
  
  /** The real sensor value, or null if not connected */
  value: T | null
  
  /** Connection status */
  status: ConnectionStatus
  
  /** Human-readable status message (can be in French or English) */
  statusMessage: string
  
  /** ISO timestamp of the last successful read */
  lastUpdate: string | null
  
  /** Error message if connection failed */
  error: string | null
}

/**
 * Specialized sensor connection for battery
 */
export interface BatteryConnection extends SensorConnection<number> {
  /** State of charge percentage (0-100) */
  value: number | null
}

/**
 * Specialized sensor connection for voltage
 */
export interface VoltageConnection extends SensorConnection<number> {
  /** Voltage in volts */
  value: number | null
}

/**
 * Specialized sensor connection for current
 */
export interface CurrentConnection extends SensorConnection<number> {
  /** Current in amperes */
  value: number | null
}

/**
 * Specialized sensor connection for temperature
 */
export interface TemperatureConnection extends SensorConnection<number> {
  /** Temperature in Celsius */
  value: number | null
}

/**
 * Complete system state with all sensors
 */
export interface SystemSensorsState {
  battery: BatteryConnection
  solarVoltage: VoltageConnection
  solarCurrent: CurrentConnection
  gridVoltage: VoltageConnection
  gridFrequency: SensorConnection<number>
  temperature: TemperatureConnection
  humidity: SensorConnection<number>
  production: SensorConnection<number>
  consumption: SensorConnection<number>
}

/**
 * Creates a disconnected sensor state
 * Use when sensor is not detected or not connected
 */
export function createDisconnectedSensor<T>(
  sensorName: string,
  error: string = 'Not detected'
): SensorConnection<T> {
  return {
    connected: false,
    value: null,
    status: 'disconnected',
    statusMessage: 'Non connecté',
    lastUpdate: null,
    error,
  }
}

/**
 * Creates a connected sensor state with a real value
 * Only use when you have actual hardware data
 */
export function createConnectedSensor<T>(
  value: T,
  status: ConnectionStatus = 'connected'
): SensorConnection<T> {
  return {
    connected: true,
    value,
    status,
    statusMessage: 'Connecté',
    lastUpdate: new Date().toISOString(),
    error: null,
  }
}

/**
 * Creates an error sensor state
 * Use when sensor read fails but hardware is connected
 */
export function createErrorSensor<T>(
  sensorName: string,
  error: string
): SensorConnection<T> {
  return {
    connected: false,
    value: null,
    status: 'error',
    statusMessage: 'Erreur de lecture',
    lastUpdate: null,
    error,
  }
}

/**
 * Default empty system state (all sensors disconnected)
 * Start with this when no hardware is detected
 */
export function createDefaultSystemState(): SystemSensorsState {
  return {
    battery: createDisconnectedSensor('Battery', 'Batterie non détectée'),
    solarVoltage: createDisconnectedSensor('Solar Voltage', 'Capteur tension solaire non détecté'),
    solarCurrent: createDisconnectedSensor('Solar Current', 'Capteur courant solaire non détecté'),
    gridVoltage: createDisconnectedSensor('Grid Voltage', 'Capteur tension réseau non détecté'),
    gridFrequency: createDisconnectedSensor('Grid Frequency', 'Capteur fréquence réseau non détecté'),
    temperature: createDisconnectedSensor('Temperature', 'Capteur température non détecté'),
    humidity: createDisconnectedSensor('Humidity', 'Capteur humidité non détecté'),
    production: createDisconnectedSensor('Production', 'Compteur production non détecté'),
    consumption: createDisconnectedSensor('Consumption', 'Compteur consommation non détecté'),
  }
}

/**
 * Check if sensor has valid real data
 */
export function hasRealData<T>(sensor: SensorConnection<T>): boolean {
  return sensor.connected && sensor.value !== null && sensor.value !== undefined
}

/**
 * Safely get sensor value or return null
 */
export function getSensorValue<T>(sensor: SensorConnection<T>): T | null {
  return hasRealData(sensor) ? sensor.value : null
}

/**
 * Get appropriate display message for sensor
 */
export function getSensorDisplayMessage(sensor: SensorConnection<any>): string {
  if (sensor.connected && sensor.value !== null && sensor.value !== undefined) {
    return ''  // Component should display the value
  }
  
  if (sensor.status === 'disconnected') {
    return 'Non connecté'
  }
  
  if (sensor.status === 'error') {
    return 'Erreur de lecture'
  }
  
  if (sensor.status === 'initializing') {
    return 'Initialisation...'
  }
  
  return 'Aucune donnée'
}
