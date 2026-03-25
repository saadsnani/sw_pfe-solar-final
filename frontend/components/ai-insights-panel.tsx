"use client"

import { Brain, AlertTriangle, CheckCircle, Lightbulb, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface InsightProps {
  type: "warning" | "success" | "info" | "prediction" | "error"
  message: string
}

function Insight({ type, message }: InsightProps) {
  const icons = {
    warning: <AlertTriangle className="w-4 h-4 text-energy-yellow" />,
    success: <CheckCircle className="w-4 h-4 text-energy-green" />,
    info: <Lightbulb className="w-4 h-4 text-chart-4" />,
    prediction: <TrendingUp className="w-4 h-4 text-primary" />,
    error: <AlertCircle className="w-4 h-4 text-energy-red" />,
  }

  const backgrounds = {
    warning: "bg-energy-yellow/10 border-energy-yellow/20",
    success: "bg-energy-green/10 border-energy-green/20",
    info: "bg-chart-4/10 border-chart-4/20",
    prediction: "bg-primary/10 border-primary/20",
    error: "bg-energy-red/10 border-energy-red/20",
  }

  return (
    <div className={`p-3 rounded-xl border ${backgrounds[type]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[type]}</div>
        <p className="text-sm text-foreground/90">{message}</p>
      </div>
    </div>
  )
}

interface AIInsightsPanelProps {
  sensors?: SystemSensorsState
}

export function AIInsightsPanel({ sensors }: AIInsightsPanelProps) {
  const hasData = sensors && (
    sensors.production.connected ||
    sensors.battery.connected ||
    sensors.temperature.connected
  )

  if (!hasData) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Analyses IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Insight
            type="error"
            message="Connectez les capteurs pour activer les analyses IA."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Analyses IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sensors?.production.connected && sensors.production.value !== null && (
          <Insight
            type="info"
            message={`Production actuelle: ${sensors.production.value.toFixed(0)}W. Rendement optimal.`}
          />
        )}
        {sensors?.battery.connected && sensors.battery.value !== null && (
          <>
            {sensors.battery.value >= 70 && (
              <Insight
                type="success"
                message={`Batterie en bon état - ${sensors.battery.value.toFixed(0)}% de charge`}
              />
            )}
            {sensors.battery.value < 70 && sensors.battery.value >= 30 && (
              <Insight
                type="warning"
                message={`Batterie partiellement chargée - ${sensors.battery.value.toFixed(0)}%. Réduisez la consommation si possible.`}
              />
            )}
            {sensors.battery.value < 30 && (
              <Insight
                type="warning"
                message={`Batterie faible - ${sensors.battery.value.toFixed(0)}%. Augmentez la production solaire.`}
              />
            )}
          </>
        )}
        {sensors?.temperature.connected && sensors.temperature.value !== null && (
          <>
            {sensors.temperature.value < 40 && (
              <Insight
                type="success"
                message={`Température normale - ${sensors.temperature.value.toFixed(1)}°C. Aucune surchauffe.`}
              />
            )}
            {sensors.temperature.value >= 40 && (
              <Insight
                type="warning"
                message={`Température élevée - ${sensors.temperature.value.toFixed(1)}°C. Vérifiez la ventilation.`}
              />
            )}
          </>
        )}
        <Insight
          type="info"
          message="Les analyses IA s'améliorent avec plus de données collectées."
        />
        <div className="pt-3 mt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Données en temps réel des capteurs
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
