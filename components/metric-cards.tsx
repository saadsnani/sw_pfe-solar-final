"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Battery, Sun, Zap, Thermometer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  status: "good" | "warning" | "critical"
  subValue?: string
  progress?: number
}

function MetricCard({ icon, label, value, unit, status, subValue, progress }: MetricCardProps) {
  const statusColors = {
    good: "text-energy-green",
    warning: "text-energy-yellow",
    critical: "text-energy-red",
  }

  const progressColors = {
    good: "bg-energy-green",
    warning: "bg-energy-yellow",
    critical: "bg-energy-red",
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${statusColors[status]}`}>
            {icon}
          </div>
          {progress !== undefined && (
            <div className="relative w-16 h-16">
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
                <span className={`text-xs font-bold ${statusColors[status]}`}>{progress}%</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${statusColors[status]}`}>{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          {subValue && <p className="text-xs text-muted-foreground mt-2">{subValue}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricCards() {
  const [metrics, setMetrics] = useState({
    soc: 85,
    production: 280,
    consumption: 450,
    temp: 28,
  })

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        soc: Math.max(20, Math.min(100, prev.soc + (Math.random() - 0.5) * 5)),
        production: Math.max(0, prev.production + (Math.random() - 0.5) * 50),
        consumption: Math.max(100, prev.consumption + (Math.random() - 0.5) * 80),
        temp: Math.max(15, Math.min(45, prev.temp + (Math.random() - 0.5) * 2)),
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const getSOCStatus = (soc: number): "good" | "warning" | "critical" => {
    if (soc >= 70) return "good"
    if (soc >= 40) return "warning"
    return "critical"
  }

  const getConsumptionStatus = (consumption: number): "good" | "warning" | "critical" => {
    if (consumption <= 400) return "good"
    if (consumption <= 600) return "warning"
    return "critical"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={<Battery className="w-6 h-6" />}
        label="État de Charge (SOC)"
        value={Math.round(metrics.soc).toString()}
        unit="%"
        status={getSOCStatus(metrics.soc)}
        progress={Math.round(metrics.soc)}
        subValue={`Est. ${Math.round((metrics.soc / 100) * 12)}h restant`}
      />
      <MetricCard
        icon={<Sun className="w-6 h-6" />}
        label="Production Solaire"
        value={Math.round(metrics.production).toString()}
        unit="W"
        status="good"
        subValue={`Pic : ${Math.round(metrics.production * 1.25)}W aujourd'hui`}
      />
      <MetricCard
        icon={<Zap className="w-6 h-6" />}
        label="Consommation"
        value={Math.round(metrics.consumption).toString()}
        unit="W"
        status={getConsumptionStatus(metrics.consumption)}
        subValue={metrics.consumption > 500 ? "Au-dessus de la moyenne" : "Consommation normale"}
      />
      <MetricCard
        icon={<Thermometer className="w-6 h-6" />}
        label="Temp. Batterie"
        value={Math.round(metrics.temp).toString()}
        unit="°C"
        status={metrics.temp < 40 ? "good" : "warning"}
        subValue={metrics.temp < 40 ? "Plage optimale" : "Surveiller la température"}
      />
    </div>
  )
}
