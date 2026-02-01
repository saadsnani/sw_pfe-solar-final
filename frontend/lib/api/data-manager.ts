/**
 * Data Manager - Handles all API communication with ESP32/Backend
 * Responsibilities:
 * - Fetch sensor readings
 * - Send configuration updates
 * - Parse and validate responses
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SensorReading {
  batteryTemperature?: number | null;
  temperature?: number | null;
  timestamp: string;
  wifiSsid?: string;
  sensorError?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BatteryTemperatureData {
  current: SensorReading | null;
  readings: SensorReading[];
  count: number;
  source: 'memory' | 'file';
}

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const SENSOR_DATA_ENDPOINT = '/api/sensor-data';

const DEFAULT_FETCH_OPTIONS: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================
// FETCH UTILITIES
// ============================================

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`[DataManager] Error fetching ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// SENSOR DATA API
// ============================================

/**
 * Fetch all sensor readings
 * @param limit - Maximum number of readings to return
 */
export async function fetchAllSensorData(
  limit: number = 20
): Promise<ApiResponse<BatteryTemperatureData>> {
  return fetchApi<BatteryTemperatureData>(
    `${SENSOR_DATA_ENDPOINT}?type=all&limit=${limit}`
  );
}

/**
 * Fetch battery temperature data only
 * @param limit - Maximum number of readings to return
 */
export async function fetchBatteryTemperature(
  limit: number = 20
): Promise<ApiResponse<BatteryTemperatureData>> {
  return fetchApi<BatteryTemperatureData>(
    `${SENSOR_DATA_ENDPOINT}?type=battery&limit=${limit}`
  );
}

/**
 * Send temperature reading to backend
 * @param temperature - Temperature value in Celsius
 */
export async function sendBatteryTemperature(
  temperature: number
): Promise<ApiResponse<SensorReading>> {
  if (temperature < -50 || temperature > 100) {
    return {
      success: false,
      error: 'Temperature out of valid range (-50°C to 100°C)',
    };
  }

  return fetchApi<SensorReading>(SENSOR_DATA_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      batteryTemperature: temperature,
    }),
  });
}

/**
 * Send sensor error notification
 */
export async function sendSensorError(): Promise<ApiResponse<SensorReading>> {
  return fetchApi<SensorReading>(SENSOR_DATA_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      batteryTemperature: null,
      sensorError: true,
    }),
  });
}

// ============================================
// POLLING & REAL-TIME UPDATES
// ============================================

export type DataSubscriptionCallback = (data: BatteryTemperatureData) => void;

/**
 * Subscribe to sensor data updates (polling-based)
 * @param callback - Function to call with new data
 * @param intervalMs - Polling interval in milliseconds
 * @returns Unsubscribe function
 */
export function subscribeToBatteryTemperature(
  callback: DataSubscriptionCallback,
  intervalMs: number = 3000
): () => void {
  const intervalId = setInterval(async () => {
    const response = await fetchBatteryTemperature();
    if (response.success && response.data) {
      callback(response.data);
    }
  }, intervalMs);

  // Initial fetch
  fetchBatteryTemperature().then((response) => {
    if (response.success && response.data) {
      callback(response.data);
    }
  });

  // Return unsubscribe function
  return () => clearInterval(intervalId);
}

// ============================================
// DATA VALIDATION & PARSING
// ============================================

/**
 * Validate sensor reading structure
 */
export function isValidSensorReading(data: unknown): data is SensorReading {
  if (typeof data !== 'object' || data === null) return false;
  
  const reading = data as Partial<SensorReading>;
  
  return (
    typeof reading.timestamp === 'string' &&
    (reading.batteryTemperature === null ||
      reading.batteryTemperature === undefined ||
      typeof reading.batteryTemperature === 'number')
  );
}

/**
 * Parse temperature value from string (for Serial/MQTT data)
 * Format: "TEMP:25.5|BATT:35.2"
 */
export function parseTemperatureString(data: string): {
  ambient: number | null;
  battery: number | null;
} {
  const result = { ambient: null as number | null, battery: null as number | null };
  
  try {
    const tempMatch = data.match(/TEMP:([\d.]+)/);
    const battMatch = data.match(/BATT:([\d.]+)/);
    
    if (tempMatch) result.ambient = parseFloat(tempMatch[1]);
    if (battMatch) result.battery = parseFloat(battMatch[1]);
  } catch (error) {
    console.error('[DataManager] Error parsing temperature string:', error);
  }
  
  return result;
}

// ============================================
// EXPORT UTILITIES
// ============================================

/**
 * Export sensor data as JSON file
 */
export function exportDataAsJson(data: SensorReading[], filename?: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `sensor-data-${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Export sensor data as CSV file
 */
export function exportDataAsCsv(data: SensorReading[], filename?: string): void {
  const headers = ['Timestamp', 'Battery Temperature (°C)', 'Ambient Temperature (°C)', 'WiFi SSID'];
  const rows = data.map((reading) => [
    reading.timestamp,
    reading.batteryTemperature?.toFixed(2) ?? 'N/A',
    reading.temperature?.toFixed(2) ?? 'N/A',
    reading.wifiSsid ?? 'N/A',
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `sensor-data-${Date.now()}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}
