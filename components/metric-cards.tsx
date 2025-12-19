"use client"

import type React from "react"
import { Battery, Sun, Zap, Thermometer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getSensorDisplayMessage, hasRealData } from "@/lib/sensor-connection"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | null
  unit: string
  status: "good" | "warning" | "critical" | "no-data"
  subValue?: string
  progress?: number | null
  isConnected?: boolean
}

function MetricCard({ icon, label, value, unit, status, subValue, progress, isConnected }: MetricCardProps) {
  const statusColors = {
    good: "text-energy-green",
    warning: "text-energy-yellow",
    critical: "text-energy-red",
    "no-data": "text-muted-foreground",
  }

  const progressColors = {
    good: "bg-energy-green",
    warning: "bg-energy-yellow",
    critical: "bg-energy-red",
    "no-data": "bg-muted",
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-secondary flex items-center justify-center ${statusColors[status]}`}>
            {icon}
          </div>
          {progress !== undefined && progress !== null && (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-secondary"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${progress * 0.88} 88`}
                  strokeLinecap="round"
                  className={statusColors[status]}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-[11px] sm:text-xs font-bold ${statusColors[status]}`}>{progress}%</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            {isConnected && value !== null ? (
              <>
                <span className={`text-2xl sm:text-3xl font-bold ${statusColors[status]}`}>{value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Non connecté</span>
            )}
          </div>
          {subValue && <p className="text-[11px] sm:text-xs text-muted-foreground mt-2">{subValue}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricCards({ sensors }: { sensors?: SystemSensorsState }) {
  // Default: all disconnected (no hardware detected)
  const soc = sensors?.battery.value ?? null
  const production = sensors?.production.value ?? null
  const consumption = sensors?.consumption.value ?? null
  const temp = sensors?.temperature.value ?? null

  const isBatteryConnected = sensors?.battery.connected ?? false
  const isProductionConnected = sensors?.production.connected ?? false
  const isConsumptionConnected = sensors?.consumption.connected ?? false
  const isTempConnected = sensors?.temperature.connected ?? false

  const getSOCStatus = (soc: number | null): "good" | "warning" | "critical" | "no-data" => {
    if (soc === null) return "no-data"
    if (soc >= 70) return "good"
    if (soc >= 40) return "warning"
    return "critical"
  }

  const getConsumptionStatus = (consumption: number | null): "good" | "warning" | "critical" | "no-data" => {
    if (consumption === null) return "no-data"
    if (consumption <= 400) return "good"
    if (consumption <= 600) return "warning"
    return "critical"
  }

  const getTempStatus = (temp: number | null): "good" | "warning" | "critical" | "no-data" => {
    if (temp === null) return "no-data"
    if (temp < 40) return "good"
    return "warning"
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-6">
      <MetricCard
        icon={<Battery className="w-6 h-6" />}
        label="État de Charge (SOC)"
        value={soc !== null ? Math.round(soc).toString() : null}
        unit="%"
        status={getSOCStatus(soc)}
        progress={soc !== null ? Math.round(soc) : null}
        isConnected={isBatteryConnected}
        subValue={soc !== null ? `Est. ${Math.round((soc / 100) * 12)}h restant` : undefined}
      />
      <MetricCard
        icon={<Sun className="w-6 h-6" />}
        label="Production Solaire"
        value={production !== null ? Math.round(production).toString() : null}
        unit="W"
        status={isProductionConnected ? "good" : "no-data"}
        isConnected={isProductionConnected}
        subValue={production !== null ? `Pic : ${Math.round(production * 1.25)}W` : undefined}
      />
      <MetricCard
        icon={<Zap className="w-6 h-6" />}
        label="Consommation"
        value={consumption !== null ? Math.round(consumption).toString() : null}
        unit="W"
        status={getConsumptionStatus(consumption)}
        isConnected={isConsumptionConnected}
        subValue={consumption !== null ? (consumption > 500 ? "Au-dessus de la moyenne" : "Consommation normale") : undefined}
      />
      <MetricCard
        icon={<Thermometer className="w-6 h-6" />}
        label="Temp. Batterie"
        value={temp !== null ? Math.round(temp).toString() : null}
        unit="°C"
        status={getTempStatus(temp)}
        isConnected={isTempConnected}
        subValue={temp !== null ? (temp < 40 ? "Plage optimale" : "Surveiller la température") : undefined}
      />
    </div>
  )
}
