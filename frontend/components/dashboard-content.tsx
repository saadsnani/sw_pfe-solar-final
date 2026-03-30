
"use client"
const IS_DEMO = true

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { SystemSynoptic } from "@/components/system-synoptic"
import { MetricCards } from "@/components/metric-cards"
import { EnergyChart } from "@/components/energy-chart"
import { SystemStatusBoard } from "@/components/system-status-board"
import { HealthReportCard } from "@/components/health-report-card"
import { GridIntegrationStatus } from "@/components/grid-integration-status"
import { EmergencyBanner } from "@/components/emergency-banner"
import { TemperatureDisplayCard } from "@/components/temperature-display-card"
import { createDefaultSystemState, createConnectedSensor } from "@/lib/sensor-connection"
import type { SystemSensorsState } from "@/lib/sensor-connection"
import {
  calculateRealtimePower,
  deriveBatterySocFromVoltage,
  normalizeEsp32RealtimeData,
  type Esp32RealtimeData,
} from "@/lib/esp32-realtime"

const FIREBASE_RTDB_URL =
  process.env.NEXT_PUBLIC_FIREBASE_RTDB_URL ||
  "https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app"

function DeferredSectionSkeleton() {
  return <div className="h-40 rounded-lg bg-muted animate-pulse" />
}

const AIInsightsPanel = dynamic(() => import("@/components/ai-insights-panel"), { loading: () => <DeferredSectionSkeleton /> })
const PowerForecastChart = dynamic(() => import("@/components/PowerForecastChart"), { loading: () => <DeferredSectionSkeleton /> })
const AnalyticsPageEnhanced = dynamic(() => import("@/components/analytics-page-enhanced"), { loading: () => <DeferredSectionSkeleton /> })
// const WeatherForecast = dynamic(() => import("@/components/weather-forecast"), { loading: () => <DeferredSectionSkeleton /> })

// Helper function to add natural fluctuation to existing value
const fluctuate = (current: number, min: number, max: number, maxChange: number): number => {
  const change = 0 // Valeur fixe pour éviter l'aléatoire
  const newValue = current + change
  return Math.max(min, Math.min(max, newValue))
}

type DemoTemperatureReading = {
  batteryTemperature?: number
  temperature?: number
  wifiSsid?: string
  sensorError?: boolean
  timestamp: string
}

type SimulatedSystemData = {
  solarVoltage: number
  solarCurrent: number
  batteryLevel: number
  gridStatus: "Active" | "Inactive"
  temperature: number
  production: number
  consumption: number
}

export function DashboardContent() {
  // ✅ State for simulated sensor data (only used if IS_DEMO = true)
  const [simulatedData, setSimulatedData] = useState<SimulatedSystemData>({
    solarVoltage: 21.2,
    solarCurrent: 6.4,
    batteryLevel: 86,
    gridStatus: "Active",
    temperature: 33,
    production: 136,
    consumption: 104,
  })

  const [energyHistory, setEnergyHistory] = useState<Array<{ time: string; production: number; consumption: number }>>([])
  const [temperatureReadings, setTemperatureReadings] = useState<DemoTemperatureReading[]>([])
  const [realtimeData, setRealtimeData] = useState<Esp32RealtimeData | null>(null)
  const [showDeferredSections, setShowDeferredSections] = useState(false)

  // ✅ Convert simulated data to sensor state format (only used if IS_DEMO = true)
  const [sensors, setSensors] = useState<SystemSensorsState>(() => {
    // Start with all sensors disconnected - no data until ESP32 connects
    return createDefaultSystemState()
  })

  const realtimePower = useMemo(() => {
    return realtimeData ? calculateRealtimePower(realtimeData) : { Ppv: null, Pbatt: null }
  }, [realtimeData])

  const realtimeGridStatus =
    realtimeData && (realtimeData.block1 || realtimeData.block2) ? "Active" : "Inactive"

  // 🔥 REAL MODE: Read live ESP32 schema directly from Firebase /sensors
  useEffect(() => {
    if (IS_DEMO) return // Skip if in demo mode

    const fetchRealtimeFirebaseData = async () => {
      try {
        const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, "")
        const response = await fetch(`${baseUrl}/sensors.json`, { cache: "no-store" })

        if (response.ok) {
          const firebasePayload = await response.json()
          const normalized = normalizeEsp32RealtimeData(firebasePayload)

          if (!normalized) return

          setRealtimeData(normalized)

          const { Ppv, Pbatt } = calculateRealtimePower(normalized)
          const batterySoc = deriveBatterySocFromVoltage(normalized.Vbatt)

          setSensors(prev => ({
            ...prev,
            solarVoltage: normalized.Vpv !== null ? createConnectedSensor(normalized.Vpv) : prev.solarVoltage,
            solarCurrent: normalized.Ipv !== null ? createConnectedSensor(normalized.Ipv) : prev.solarCurrent,
            battery: batterySoc !== null ? createConnectedSensor(batterySoc) : prev.battery,
            production: Ppv !== null ? createConnectedSensor(Ppv) : prev.production,
            consumption: Pbatt !== null ? createConnectedSensor(Math.abs(Pbatt)) : prev.consumption,
          }))
        }
      } catch (error) {
        console.error('❌ Error fetching Firebase realtime sensors:', error)
      }
    }

    fetchRealtimeFirebaseData()

    // lightweight polling fallback (acts as realtime updates)
    const timer = setInterval(fetchRealtimeFirebaseData, 2000)
    return () => clearInterval(timer)
  }, [])

  // 🔥 REAL MODE: Build power history from Firebase updates
  useEffect(() => {
    if (IS_DEMO || !realtimeData) return

    const now = new Date(realtimeData.timestamp || Date.now())
    const timeLabel = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

    setEnergyHistory((prev) =>
      [
        ...prev,
        {
          time: timeLabel,
          production: realtimePower.Ppv ?? 0,
          consumption: realtimePower.Pbatt !== null ? Math.abs(realtimePower.Pbatt) : 0,
        },
      ].slice(-20),
    )
  }, [realtimeData, realtimePower])

  // ✅ DEMO MODE: Simulation logic - Updates every 3 seconds (only runs if IS_DEMO = true)
  useEffect(() => {
    if (!IS_DEMO) return // Skip if using real hardware

    const timer = setInterval(() => {
      setSimulatedData((prev) => {
        // Natural fluctuations
        const newVoltage = fluctuate(prev.solarVoltage, 20, 23, 0.35)
        const newCurrent = fluctuate(prev.solarCurrent, 5, 9, 0.3)
        const newBatteryLevel = fluctuate(prev.batteryLevel, 78, 98, 1.2)
        const newTemperature = fluctuate(prev.temperature, 28, 36, 0.7)
        const newConsumption = fluctuate(prev.consumption, 90, 220, 12)

        // Demo healthy preview keeps grid active.
        const newGridStatus = "Active"

        // Calculate production from voltage * current
        const newProduction = newVoltage * newCurrent

        return {
          solarVoltage: newVoltage,
          solarCurrent: newCurrent,
          batteryLevel: newBatteryLevel,
          gridStatus: newGridStatus,
          temperature: newTemperature,
          production: newProduction,
          consumption: newConsumption,
        }
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(timer)
  }, [])

  // 🔥 DEMO MODE: Update sensors state whenever simulated data changes
  useEffect(() => {
    if (!IS_DEMO) return // Skip if not in demo mode - wait for real ESP32 data

    setSensors({
      battery: createConnectedSensor(simulatedData.batteryLevel),
      production: createConnectedSensor(simulatedData.production),
      consumption: createConnectedSensor(simulatedData.consumption),
      temperature: createConnectedSensor(simulatedData.temperature),
  humidity: createConnectedSensor(52), // Valeur fixe
  solarVoltage: createConnectedSensor(simulatedData.solarVoltage),
  solarCurrent: createConnectedSensor(simulatedData.solarCurrent),
  gridVoltage: createConnectedSensor(220), // Valeur fixe
  gridFrequency: createConnectedSensor(50), // Valeur fixe
    })
  }, [simulatedData])

  // 🔥 DEMO MODE: Build chart/table histories
  useEffect(() => {
    if (!IS_DEMO) return // Skip if not in demo mode

    const now = new Date()
    const timeLabel = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

    setEnergyHistory((prev) =>
      [...prev, { time: timeLabel, production: simulatedData.production, consumption: simulatedData.consumption }].slice(-20),
    )

    setTemperatureReadings((prev) =>
      [
        ...prev,
        {
          batteryTemperature: simulatedData.temperature,
          temperature: simulatedData.temperature - 2,
          wifiSsid: "ESP32-TEMP",
          timestamp: now.toISOString(),
        },
      ].slice(-20),
    )
  }, [simulatedData])

  const latestTemperature = temperatureReadings[temperatureReadings.length - 1] ?? null
  const temperatureDemoData = latestTemperature
    ? { current: latestTemperature, readings: temperatureReadings, isConnected: true }
    : undefined

  useEffect(() => {
    if (typeof globalThis === "undefined") {
      return
    }

    if (typeof globalThis.requestIdleCallback === "function") {
      const idleId = globalThis.requestIdleCallback(() => setShowDeferredSections(true), { timeout: 1200 })
      return () => {
        if (typeof globalThis.cancelIdleCallback === "function") {
          globalThis.cancelIdleCallback(idleId)
        }
      }
    }

    const timeoutId = globalThis.setTimeout(() => setShowDeferredSections(true), 600)
    return () => globalThis.clearTimeout(timeoutId)
  }, [])

  return (
    <div className="space-y-6 w-full px-2 sm:px-4 md:px-8">
      <div className="relative z-20">
        <EmergencyBanner />
      </div>

      {/* System Synoptic - First */}
      <div className="relative z-10 mt-16">
        <SystemSynoptic sensors={sensors} />
      </div>

      {/* Metric Cards */}
      <MetricCards sensors={sensors} />

      {/* Temperature Monitoring - Full Width with Chart */}
      <div className="grid grid-cols-1 gap-4">
        <TemperatureDisplayCard demoData={temperatureDemoData} />
      </div>

      {/* Grid Integration */}
      <GridIntegrationStatus sensors={sensors} gridStatus={IS_DEMO ? simulatedData.gridStatus : realtimeGridStatus} />

      {/* System Status */}
      <SystemStatusBoard sensors={sensors} />

      {/* Predictive Maintenance Health Report */}
      <div className="grid grid-cols-1 gap-4">
        <HealthReportCard previewAllHealthy={IS_DEMO} />
      </div>

      {/* Charts & AI */}
      <div className="grid grid-cols-1 gap-4">
        <EnergyChart sensors={sensors} historicalData={energyHistory} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {showDeferredSections ? <AIInsightsPanel sensors={sensors} /> : <DeferredSectionSkeleton />}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {showDeferredSections ? <PowerForecastChart /> : <DeferredSectionSkeleton />}
      </div>

      {/* Analytics */}
      {showDeferredSections ? (
        <AnalyticsPageEnhanced sensors={sensors} historicalData={energyHistory} />
      ) : (
        <DeferredSectionSkeleton />
      )}

  {/* WeatherForecast désactivé car composant manquant */}
  {/* {showDeferredSections ? <WeatherForecast /> : <DeferredSectionSkeleton />} */}
    </div>
  )
}
