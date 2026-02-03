"use client"

import { useEffect, lazy, Suspense, useState } from "react"
import { SystemSynoptic } from "@/components/system-synoptic"
import { MetricCards } from "@/components/metric-cards"
import { EnergyChart } from "@/components/energy-chart"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { PowerForecastChart } from "@/components/PowerForecastChart"
import { SystemStatusBoard } from "@/components/system-status-board"
import { GridIntegrationStatus } from "@/components/grid-integration-status"
import { AnalyticsPageEnhanced } from "@/components/analytics-page-enhanced"
import { TemperatureDisplayCard } from "@/components/temperature-display-card"
import { createDefaultSystemState, createConnectedSensor } from "@/lib/sensor-connection"
import type { SystemSensorsState } from "@/lib/sensor-connection"

// Lazy load heavy components
const WeatherForecast = lazy(() => import("@/components/weather-forecast").then(m => ({ default: m.WeatherForecast })))

// Helper function to add natural fluctuation to existing value
const fluctuate = (current: number, min: number, max: number, maxChange: number): number => {
  const change = (Math.random() - 0.5) * 2 * maxChange
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

export function DashboardContent() {
  // 🔥 DEMO MODE: State for simulated sensor data
  const [simulatedData, setSimulatedData] = useState({
    solarVoltage: 20.0,      // 18V - 22V
    solarCurrent: 5.0,       // 2A - 8A
    batteryLevel: 75,        // 40% - 95%
    gridStatus: "Active",    // "Active" or "Inactive"
    temperature: 40.0,       // 35°C - 45°C
    production: 250,         // Calculated from V * I
    consumption: 180,        // Random consumption
  })

  const [energyHistory, setEnergyHistory] = useState<Array<{ time: string; production: number; consumption: number }>>([])
  const [temperatureReadings, setTemperatureReadings] = useState<DemoTemperatureReading[]>([])

  // 🔥 DEMO MODE: Convert simulated data to sensor state format
  const [sensors, setSensors] = useState<SystemSensorsState>(() => {
    const initial = createDefaultSystemState()
    return {
      ...initial,
      battery: createConnectedSensor(simulatedData.batteryLevel),
      production: createConnectedSensor(simulatedData.production),
      consumption: createConnectedSensor(simulatedData.consumption),
      temperature: createConnectedSensor(simulatedData.temperature),
      solarVoltage: createConnectedSensor(simulatedData.solarVoltage),
      solarCurrent: createConnectedSensor(simulatedData.solarCurrent),
      gridStatus: createConnectedSensor(simulatedData.gridStatus),
    }
  })

  // 🔥 DEMO MODE: Simulation logic - Updates every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedData((prev) => {
        // Natural fluctuations
        const newVoltage = fluctuate(prev.solarVoltage, 18, 22, 0.5)
        const newCurrent = fluctuate(prev.solarCurrent, 2, 8, 0.3)
        const newBatteryLevel = fluctuate(prev.batteryLevel, 40, 95, 2)
        const newTemperature = fluctuate(prev.temperature, 35, 45, 1)
        const newConsumption = fluctuate(prev.consumption, 100, 400, 20)
        
        // Toggle grid status occasionally (10% chance)
        const newGridStatus = Math.random() < 0.1 
          ? (prev.gridStatus === "Active" ? "Inactive" : "Active")
          : prev.gridStatus

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
    setSensors({
      battery: createConnectedSensor(simulatedData.batteryLevel),
      production: createConnectedSensor(simulatedData.production),
      consumption: createConnectedSensor(simulatedData.consumption),
      temperature: createConnectedSensor(simulatedData.temperature),
      solarVoltage: createConnectedSensor(simulatedData.solarVoltage),
      solarCurrent: createConnectedSensor(simulatedData.solarCurrent),
      gridVoltage: createConnectedSensor(220 + (Math.random() - 0.5) * 10), // 215-225V
      gridFrequency: createConnectedSensor(50 + (Math.random() - 0.5) * 0.2), // 49.9-50.1 Hz
    })
  }, [simulatedData])

  // 🔥 DEMO MODE: Build chart/table histories
  useEffect(() => {
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

  return (
    <div className="space-y-4 w-full overflow-hidden">
      {/* System Synoptic - First */}
      <SystemSynoptic sensors={sensors} />

      {/* Metric Cards */}
      <MetricCards sensors={sensors} />

      {/* Temperature Monitoring - Full Width with Chart */}
      <div className="grid grid-cols-1 gap-4">
        <TemperatureDisplayCard demoData={temperatureDemoData} />
      </div>

      {/* Grid Integration */}
      <GridIntegrationStatus sensors={sensors} gridStatus={simulatedData.gridStatus} />

      {/* System Status */}
      <SystemStatusBoard sensors={sensors} />

      {/* Charts & AI */}
      <div className="grid grid-cols-1 gap-4">
        <EnergyChart sensors={sensors} historicalData={energyHistory} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AIInsightsPanel sensors={sensors} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <PowerForecastChart />
      </div>

      {/* Analytics */}
      <AnalyticsPageEnhanced sensors={sensors} historicalData={energyHistory} />

      <Suspense fallback={<div className="h-48 bg-muted rounded-lg animate-pulse" />}>
        <WeatherForecast />
      </Suspense>
    </div>
  )
}
