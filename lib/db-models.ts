/**
 * Database Models w Schemas
 * Types dial data li ghansaviw f MongoDB
 */

// Sensor Data Model (ESP32 WiFi Data)
export interface SensorDataModel {
  _id?: string;
  timestamp: Date;
  temperature: number;
  humidity?: number;
  voltage?: number;
  current?: number;
  power?: number;
  deviceId: string;
  wifiSignal?: number;
  source: 'esp32' | 'mega' | 'manual';
}

// Temperature Log Model
export interface TemperatureLogModel {
  _id?: string;
  timestamp: Date;
  batteryTemp: number;
  ambientTemp?: number;
  panelTemp?: number;
  deviceId: string;
  status: 'normal' | 'warning' | 'critical';
}

// System Status Model
export interface SystemStatusModel {
  _id?: string;
  timestamp: Date;
  solarPower: number;
  batteryLevel: number;
  loadPower: number;
  gridStatus: 'connected' | 'disconnected';
  inverterStatus: 'on' | 'off' | 'standby';
}

// Alert Model
export interface AlertModel {
  _id?: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  source: string;
  resolved: boolean;
  resolvedAt?: Date;
}

// User Activity Log
export interface UserLogModel {
  _id?: string;
  timestamp: Date;
  userId?: string;
  action: string;
  page?: string;
  ipAddress?: string;
}

// Helper functions bach nvalidaw data
export function validateSensorData(data: any): data is SensorDataModel {
  return (
    typeof data.temperature === 'number' &&
    typeof data.deviceId === 'string' &&
    ['esp32', 'mega', 'manual'].includes(data.source)
  );
}

export function validateTemperatureLog(data: any): data is TemperatureLogModel {
  return (
    typeof data.batteryTemp === 'number' &&
    typeof data.deviceId === 'string' &&
    ['normal', 'warning', 'critical'].includes(data.status)
  );
}
