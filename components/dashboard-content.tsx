"use client"

import { useEffect, lazy, Suspense } from "react"
import { SystemSynoptic } from "@/components/system-synoptic"
import { MetricCards } from "@/components/metric-cards"
import { EnergyChart } from "@/components/energy-chart"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { SystemStatusBoard } from "@/components/system-status-board"
import { useAlert } from "@/lib/alert-provider"

// Lazy load heavy components
const WeatherForecast = lazy(() => import("@/components/weather-forecast").then(m => ({ default: m.WeatherForecast })))

export function DashboardContent() {
  const { addAlert } = useAlert()

  useEffect(() => {
    // Simulate battery low alert
    const batteryTimer = setTimeout(() => {
      addAlert({
        type: "warning",
        title: "Batterie Faible",
        message: "Le niveau de batterie est descendu à 25%. Vérifiez votre consommation.",
        duration: 7000,
      })
    }, 3000)

    return () => clearTimeout(batteryTimer)
  }, [addAlert])

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vue d'Ensemble du Système</h1>
        <p className="text-muted-foreground">Surveillance en temps réel de votre système photovoltaïque</p>
      </div>

      {/* System Status */}
      <SystemStatusBoard />

      {/* System Synoptic */}
      <SystemSynoptic />

      {/* Metric Cards */}
      <MetricCards />

      {/* Charts & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyChart />
        </div>
        <div>
          <AIInsightsPanel />
        </div>
      </div>

      <Suspense fallback={<div className="h-48 bg-muted rounded-lg animate-pulse" />}>
        <WeatherForecast />
      </Suspense>
    </div>
  )
}
