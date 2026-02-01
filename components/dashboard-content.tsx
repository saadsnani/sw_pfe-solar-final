"use client"

import { useEffect, lazy, Suspense } from "react"
import { SystemSynoptic } from "@/components/system-synoptic"
import { MetricCards } from "@/components/metric-cards"
import { EnergyChart } from "@/components/energy-chart"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { SystemStatusBoard } from "@/components/system-status-board"
import { GridIntegrationStatus } from "@/components/grid-integration-status"
import { AnalyticsPageEnhanced } from "@/components/analytics-page-enhanced"
import { BatteryTemperatureCard } from "@/components/battery-temperature-card"
import { TemperatureDisplayCard } from "@/components/temperature-display-card"
import { useAlert } from "@/lib/alert-provider"
import { useSystemSensors } from "@/hooks/use-sensor-connection"
import { createDefaultSystemState } from "@/lib/sensor-connection"

// Lazy load heavy components
const WeatherForecast = lazy(() => import("@/components/weather-forecast").then(m => ({ default: m.WeatherForecast })))

export function DashboardContent() {
  const { addAlert } = useAlert()
  const { state: sensors } = useSystemSensors()

  // NOTE: In simulation mode, all sensors start as disconnected.
  // When real hardware is connected, the sensors will be updated with real values.
  // To test with simulated data, uncomment the code below:
  /*
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate sensor updates every 5 seconds
      systemSensors.updateBattery(Math.random() * 100)
      systemSensors.updateProduction(Math.random() * 500)
      systemSensors.updateConsumption(100 + Math.random() * 400)
      systemSensors.updateTemperature(20 + Math.random() * 20)
    }, 5000)
    return () => clearInterval(timer)
  }, [systemSensors])
  */

  return (
    <div className="space-y-4 w-full overflow-hidden">
      {/* System Synoptic - First */}
      <SystemSynoptic sensors={sensors} />

      {/* Metric Cards */}
      <MetricCards sensors={sensors} />

      {/* Temperature Monitoring - Full Width with Chart */}
      <div className="grid grid-cols-1 gap-4">
        <TemperatureDisplayCard />
      </div>

      {/* Grid Integration */}
      <GridIntegrationStatus sensors={sensors} />

      {/* System Status */}
      <SystemStatusBoard sensors={sensors} />

      {/* Charts & AI */}
      <div className="grid grid-cols-1 gap-4">
        <EnergyChart sensors={sensors} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AIInsightsPanel sensors={sensors} />
      </div>

      {/* Analytics */}
      <AnalyticsPageEnhanced sensors={sensors} />

      <Suspense fallback={<div className="h-48 bg-muted rounded-lg animate-pulse" />}>
        <WeatherForecast />
      </Suspense>
    </div>
  )
}
