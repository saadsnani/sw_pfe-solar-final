"use client"

import type React from "react"

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={<Battery className="w-6 h-6" />}
        label="État de Charge (SOC)"
        value="85"
        unit="%"
        status="good"
        progress={85}
        subValue="Est. 8h restant"
      />
      <MetricCard
        icon={<Sun className="w-6 h-6" />}
        label="Production Solaire"
        value="280"
        unit="W"
        status="good"
        subValue="Pic : 350W aujourd'hui"
      />
      <MetricCard
        icon={<Zap className="w-6 h-6" />}
        label="Consommation"
        value="450"
        unit="W"
        status="warning"
        subValue="Au-dessus de la moyenne"
      />
      <MetricCard
        icon={<Thermometer className="w-6 h-6" />}
        label="Temp. Batterie"
        value="28"
        unit="°C"
        status="good"
        subValue="Plage optimale"
      />
    </div>
  )
}
