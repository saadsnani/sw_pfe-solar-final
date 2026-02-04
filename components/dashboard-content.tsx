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
import { LocalNotifications } from "@capacitor/local-notifications"

// Lazy load heavy components
const WeatherForecast = lazy(() => import("@/components/weather-forecast").then(m => ({ default: m.WeatherForecast })))

// ✅ DEMO MODE TOGGLE: Set to false to use real ESP32 sensors
const IS_DEMO = false

// 🔔 Notification helper
const sendNotification = async (title: string, body: string, id: number = Math.random()) => {
  try {
    if (typeof window !== "undefined" && "Notification" in window) {
      // Web notification
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/icon.png" })
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          new Notification(title, { body, icon: "/icon.png" })
        }
      }
    }
    
    // Mobile notification via Capacitor
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(id),
            title: title,
            body: body,
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      })
    } catch (e) {
      console.log("Mobile notifications not available (web-only mode)")
    }
  } catch (error) {
    console.error("Notification error:", error)
  }
}

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
  // ✅ State for simulated sensor data (only used if IS_DEMO = true)
  const [simulatedData, setSimulatedData] = useState({
    solarVoltage: 0,         // No data yet
    solarCurrent: 0,         // No data yet
    batteryLevel: 0,         // No data yet
    gridStatus: "Inactive",  // Not connected
    temperature: 0,          // No data yet
    production: 0,           // No data yet
    consumption: 0,          // No data yet
  })

  const [energyHistory, setEnergyHistory] = useState<Array<{ time: string; production: number; consumption: number }>>([])
  const [temperatureReadings, setTemperatureReadings] = useState<DemoTemperatureReading[]>([])

  // ✅ Convert simulated data to sensor state format (only used if IS_DEMO = true)
  const [sensors, setSensors] = useState<SystemSensorsState>(() => {
    // Start with all sensors disconnected - no data until ESP32 connects
    return createDefaultSystemState()
  })

  // 🔥 REAL MODE: Fetch data from ESP32 via API (only runs when IS_DEMO = false)
  useEffect(() => {
    if (IS_DEMO) return // Skip if in demo mode

    const fetchSensorData = async () => {
      try {
        const response = await fetch('/api/sensor-data?type=all&limit=1')
        if (response.ok) {
          const data = await response.json()
          
          if (data.readings && data.readings.length > 0) {
            const latest = data.readings[0]
            const temp = latest.batteryTemperature || latest.temperature || 0
            
            console.log('📥 Data from ESP32:', latest)
            
            // Update sensors with real data
            setSensors(prev => ({
              ...prev,
              temperature: temp > 0 ? createConnectedSensor(temp) : prev.temperature,
              battery: temp > 0 ? createConnectedSensor(75) : prev.battery, // Fake battery level for now
            }))

            // Add to temperature readings
            if (temp > 0) {
              setTemperatureReadings(prev => {
                const newReadings = [...prev, {
                  batteryTemperature: temp,
                  temperature: temp,
                  wifiSsid: latest.wifiSsid || 'ESP32',
                  timestamp: latest.timestamp,
                }].slice(-20)
                
                // 🔔 Send notification for new data
                sendNotification(
                  "🌡️ Temperature Update",
                  `Battery: ${temp.toFixed(1)}°C from ${latest.wifiSsid || 'ESP32'}`,
                  Math.floor(Date.now() / 1000)
                )
                
                return newReadings
              })
            }
          }
        }
      } catch (error) {
        console.error('❌ Error fetching sensor data:', error)
      }
    }

    // Fetch immediately
    fetchSensorData()

    // Then fetch every 5 seconds
    const timer = setInterval(fetchSensorData, 5000)
    return () => clearInterval(timer)
  }, [])

  // ✅ DEMO MODE: Simulation logic - Updates every 3 seconds (only runs if IS_DEMO = true)
  useEffect(() => {
    if (!IS_DEMO) return // Skip if using real hardware

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
    if (!IS_DEMO) return // Skip if not in demo mode - wait for real ESP32 data

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

  return (
    <div className="space-y-4 w-full">
      {/* System Synoptic - First */}
      <div className="relative z-10">
        <SystemSynoptic sensors={sensors} />
      </div>

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
