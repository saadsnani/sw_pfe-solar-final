/**
 * UI Manager - Handles all visual updates and DOM manipulation
 * Responsibilities:
 * - Update chart data
 * - Apply visual effects
 * - Handle loading states
 * - Manage animations
 */

import type { SensorReading } from '../api/data-manager';

// ============================================
// CHART UTILITIES (Recharts)
// ============================================

/**
 * Format sensor readings for Recharts
 */
export function formatChartData(readings: SensorReading[]) {
  return readings.map((reading, index) => ({
    index: index + 1,
    time: new Date(reading.timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    battery: reading.batteryTemperature ?? null,
    ambient: reading.temperature ?? null,
    timestamp: reading.timestamp,
  }));
}

/**
 * Get chart color based on temperature
 */
export function getTemperatureColor(temp: number | null): string {
  if (temp === null) return '#64748b'; // gray-500
  if (temp < 20) return '#3b82f6'; // blue-500
  if (temp < 40) return '#10b981'; // green-500
  if (temp < 60) return '#f59e0b'; // orange-500
  return '#ef4444'; // red-500
}

/**
 * Get temperature status text
 */
export function getTemperatureStatus(temp: number | null): {
  label: string;
  color: string;
  icon: string;
} {
  if (temp === null) {
    return { label: 'Non connecté', color: 'text-gray-500', icon: '⚠️' };
  }
  if (temp < 20) {
    return { label: 'Froid', color: 'text-blue-500', icon: '❄️' };
  }
  if (temp < 40) {
    return { label: 'Normal', color: 'text-green-500', icon: '✅' };
  }
  if (temp < 60) {
    return { label: 'Chaud', color: 'text-orange-500', icon: '🔥' };
  }
  return { label: 'Critique', color: 'text-red-500', icon: '🚨' };
}

/**
 * Get trend arrow based on last two readings
 */
export function getTrendArrow(readings: SensorReading[]): string {
  if (readings.length < 2) return '→';
  
  const current = readings[readings.length - 1].batteryTemperature;
  const previous = readings[readings.length - 2].batteryTemperature;
  
  if (current === null || current === undefined || previous === null || previous === undefined) return '→';
  
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return '→';
  return diff > 0 ? '↑' : '↓';
}

// ============================================
// LOADING STATES
// ============================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Create loading skeleton data for charts
 */
export function getSkeletonChartData(count: number = 20) {
  return Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    time: '--:--',
    battery: null,
    ambient: null,
    timestamp: new Date().toISOString(),
  }));
}

// ============================================
// ANIMATIONS & VISUAL EFFECTS
// ============================================

/**
 * Pulse animation CSS class
 */
export const PULSE_ANIMATION = 'animate-pulse';

/**
 * Fade-in animation CSS class
 */
export const FADE_IN_ANIMATION = 'animate-in fade-in slide-in-from-top-4 duration-300';

/**
 * Apply pulsing effect to element (for React)
 */
export function usePulseEffect(isActive: boolean): string {
  return isActive ? PULSE_ANIMATION : '';
}

// ============================================
// NOTIFICATION HELPERS
// ============================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

/**
 * Get notification icon
 */
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '🔔';
  }
}

/**
 * Get notification color classes
 */
export function getNotificationClasses(type: NotificationType): string {
  const baseClasses = 'border-2 rounded-xl p-4 shadow-2xl backdrop-blur-sm';
  
  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-600 border-green-700 text-white`;
    case 'error':
      return `${baseClasses} bg-red-600 border-red-700 text-white`;
    case 'warning':
      return `${baseClasses} bg-yellow-600 border-yellow-700 text-white`;
    case 'info':
      return `${baseClasses} bg-blue-600 border-blue-700 text-white`;
    default:
      return `${baseClasses} bg-gray-600 border-gray-700 text-white`;
  }
}

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Format temperature value
 */
export function formatTemperature(temp: number | null, decimals: number = 1): string {
  if (temp === null) return 'N/A';
  return `${temp.toFixed(decimals)}°C`;
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffSecs < 60) return `il y a ${diffSecs}s`;
  if (diffMins < 60) return `il y a ${diffMins}m`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  return formatTimestamp(timestamp);
}

// ============================================
// RESPONSIVE HELPERS
// ============================================

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Get responsive chart height
 */
export function getResponsiveChartHeight(): number {
  return isMobileDevice() ? 250 : 350;
}
