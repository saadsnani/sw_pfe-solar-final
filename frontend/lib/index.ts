/**
 * Frontend Library - Main Entry Point
 * Import everything you need from a single location
 */

// API & Data Management
export {
  fetchAllSensorData,
  fetchBatteryTemperature,
  sendBatteryTemperature,
  sendSensorError,
  subscribeToBatteryTemperature,
  isValidSensorReading,
  parseTemperatureString,
  exportDataAsJson,
  exportDataAsCsv,
  type SensorReading,
  type ApiResponse,
  type BatteryTemperatureData,
  type DataSubscriptionCallback,
} from './api/data-manager';

// UI & Visual Management
export {
  formatChartData,
  getTemperatureColor,
  getTemperatureStatus,
  getTrendArrow,
  getSkeletonChartData,
  formatTemperature,
  formatTimestamp,
  formatRelativeTime,
  isMobileDevice,
  getResponsiveChartHeight,
  getNotificationIcon,
  getNotificationClasses,
  PULSE_ANIMATION,
  FADE_IN_ANIMATION,
  usePulseEffect,
  type LoadingState,
  type NotificationType,
  type Notification,
} from './ui/ui-manager';
