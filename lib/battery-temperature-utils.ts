/**
 * Utilitaires pour la température de batterie
 */

export interface BatteryTemperatureReading {
  batteryTemperature: number
  timestamp: string
}

/**
 * Envoyer une lecture de température de batterie à l'API
 */
export async function sendBatteryTemperature(
  temperature: number
): Promise<{ success: boolean; message: string; data?: BatteryTemperatureReading }> {
  try {
    const response = await fetch("/api/sensor-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batteryTemperature: temperature }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: "Température envoyée avec succès",
      data: data.data,
    }
  } catch (error) {
    console.error("Error sending battery temperature:", error)
    return {
      success: false,
      message: `Erreur lors de l'envoi: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * Récupérer les lectures de température de batterie
 */
export async function getBatteryTemperatureReadings(): Promise<{
  current: BatteryTemperatureReading | null
  readings: BatteryTemperatureReading[]
  count: number
}> {
  try {
    const response = await fetch("/api/sensor-data?type=battery")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching battery temperature:", error)
    return {
      current: null,
      readings: [],
      count: 0,
    }
  }
}

/**
 * Obtenir le statut basé sur la température
 */
export function getBatteryTemperatureStatus(
  temperature: number | null
): "disconnected" | "cold" | "normal" | "warm" | "critical" {
  if (temperature === null) return "disconnected"
  if (temperature < 20) return "cold"
  if (temperature < 40) return "normal"
  if (temperature < 60) return "warm"
  return "critical"
}

/**
 * Obtenir le label du statut
 */
export function getBatteryTemperatureLabel(
  status: "disconnected" | "cold" | "normal" | "warm" | "critical"
): string {
  const labels = {
    disconnected: "Déconnecté",
    cold: "Froid",
    normal: "Normal",
    warm: "Chaud",
    critical: "Critique",
  }
  return labels[status]
}

/**
 * Obtenir la couleur du statut
 */
export function getBatteryTemperatureColor(
  status: "disconnected" | "cold" | "normal" | "warm" | "critical"
): string {
  const colors = {
    disconnected: "text-muted-foreground",
    cold: "text-blue-500",
    normal: "text-green-500",
    warm: "text-yellow-500",
    critical: "text-red-500",
  }
  return colors[status]
}

/**
 * Formater la température pour l'affichage
 */
export function formatBatteryTemperature(temperature: number | null): string {
  if (temperature === null) return "--"
  return temperature.toFixed(1)
}

/**
 * Formater l'horodatage pour l'affichage
 */
export function formatBatteryTimestamp(timestamp: string, format: "short" | "long" = "short"): string {
  try {
    const date = new Date(timestamp)

    if (format === "short") {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    }
  } catch {
    return timestamp
  }
}

/**
 * Calculer les statistiques d'un ensemble de lectures
 */
export function calculateBatteryTemperatureStats(readings: BatteryTemperatureReading[]) {
  if (readings.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      current: 0,
    }
  }

  const temps = readings
    .map((r) => r.batteryTemperature)
    .filter((t) => t > 0)

  if (temps.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      current: 0,
    }
  }

  return {
    min: Math.round(Math.min(...temps) * 10) / 10,
    max: Math.round(Math.max(...temps) * 10) / 10,
    average: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
    current: readings[readings.length - 1]?.batteryTemperature || 0,
  }
}
