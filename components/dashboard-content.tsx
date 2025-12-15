"use client"

import { SystemSynoptic } from "@/components/system-synoptic"
import { MetricCards } from "@/components/metric-cards"
import { EnergyChart } from "@/components/energy-chart"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { WeatherForecast } from "@/components/weather-forecast"

export function DashboardContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div className="px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Vue d'Ensemble du Système</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Surveillance en temps réel de votre système photovoltaïque</p>
      </div>

      {/* System Synoptic */}
      <SystemSynoptic />

      {/* Metric Cards */}
      <MetricCards />

      {/* Charts & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <EnergyChart />
        </div>
        <div className="w-full">
          <AIInsightsPanel />
        </div>
      </div>

      <WeatherForecast />
    </div>
  )
}
