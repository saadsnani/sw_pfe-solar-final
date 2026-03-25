// Configuration pour la température de batterie
export const BATTERY_TEMPERATURE_CONFIG = {
  // Intervalle de rafraîchissement en millisecondes
  REFRESH_INTERVAL: 3000,

  // Seuils de statut (en °C)
  THRESHOLDS: {
    COLD: 20,
    NORMAL: 40,
    WARM: 60,
    CRITICAL: 60,
  },

  // Statuts et leurs couleurs
  STATUS_COLORS: {
    cold: "text-blue-500",
    normal: "text-green-500",
    warm: "text-yellow-500",
    critical: "text-red-500",
    disconnected: "text-muted-foreground",
  },

  // API
  API: {
    ENDPOINT: "/api/sensor-data",
    QUERY_PARAM_BATTERY: "type=battery",
  },

  // Stockage
  STORAGE: {
    FOLDER: "data",
    FILE_NAME: "battery-temperature.json",
    MAX_READINGS: 500,
  },

  // Historique du graphique
  CHART: {
    MAX_POINTS: 20,
    REFRESH_INTERVAL: 5000,
  },

  // Labels
  LABELS: {
    COLD: "Froid",
    NORMAL: "Normal",
    WARM: "Chaud",
    CRITICAL: "Critique",
    DISCONNECTED: "Déconnecté",
  },

  // Unités
  UNITS: {
    TEMPERATURE: "°C",
  },
}

// Types
export interface BatteryTemperatureReading {
  batteryTemperature: number
  timestamp: string
}

export interface BatteryTemperatureStatus {
  current: BatteryTemperatureReading | null
  readings: BatteryTemperatureReading[]
  count: number
}

export interface BatteryTemperatureData {
  batteryTemperature: number | null
  isConnected: boolean
  lastUpdate: Date | null
  status: "disconnected" | "cold" | "normal" | "warm" | "critical"
}
