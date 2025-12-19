"use client"

import { AlertCircle, CheckCircle, Clock, TrendingUp, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface SystemStatus {
  id: string
  title: string
  status: "healthy" | "warning" | "critical" | "disconnected"
  message: string
  icon: React.ReactNode
  timestamp?: string
}

interface SystemStatusBoardProps {
  sensors?: SystemSensorsState
}

export function SystemStatusBoard({ sensors }: SystemStatusBoardProps) {
  const systemStatuses: SystemStatus[] = []

  // Add battery status
  if (sensors?.battery.connected && sensors.battery.value !== null) {
    systemStatuses.push({
      id: "battery",
      title: "État de la Batterie",
      status: sensors.battery.value >= 70 ? "healthy" : sensors.battery.value >= 30 ? "warning" : "critical",
      message: `${sensors.battery.value.toFixed(0)}% de charge`,
      icon: <CheckCircle className="h-5 w-5" />,
      timestamp: sensors.battery.lastUpdate ? new Date(sensors.battery.lastUpdate).toLocaleTimeString() : undefined,
    })
  } else {
    systemStatuses.push({
      id: "battery",
      title: "Batterie",
      status: "disconnected",
      message: "Capteur non détecté",
      icon: <X className="h-5 w-5" />,
    })
  }

  // Add production status
  if (sensors?.production.connected && sensors.production.value !== null) {
    systemStatuses.push({
      id: "production",
      title: "Production Solaire",
      status: "healthy",
      message: `${sensors.production.value.toFixed(0)}W actuellement`,
      icon: <TrendingUp className="h-5 w-5" />,
      timestamp: sensors.production.lastUpdate ? new Date(sensors.production.lastUpdate).toLocaleTimeString() : undefined,
    })
  } else {
    systemStatuses.push({
      id: "production",
      title: "Production Solaire",
      status: "disconnected",
      message: "Capteur non détecté",
      icon: <X className="h-5 w-5" />,
    })
  }

  // Add temperature status
  if (sensors?.temperature.connected && sensors.temperature.value !== null) {
    systemStatuses.push({
      id: "temperature",
      title: "Température",
      status: sensors.temperature.value < 40 ? "healthy" : "warning",
      message: `${sensors.temperature.value.toFixed(1)}°C`,
      icon: <CheckCircle className="h-5 w-5" />,
      timestamp: sensors.temperature.lastUpdate ? new Date(sensors.temperature.lastUpdate).toLocaleTimeString() : undefined,
    })
  } else {
    systemStatuses.push({
      id: "temperature",
      title: "Température",
      status: "disconnected",
      message: "Capteur non détecté",
      icon: <X className="h-5 w-5" />,
    })
  }

  // Add grid connection status
  if (sensors?.gridVoltage.connected && sensors.gridVoltage.value !== null) {
    systemStatuses.push({
      id: "grid",
      title: "Connexion Réseau",
      status: "healthy",
      message: `${sensors.gridVoltage.value.toFixed(1)}V AC - Connecté`,
      icon: <CheckCircle className="h-5 w-5" />,
      timestamp: sensors.gridVoltage.lastUpdate ? new Date(sensors.gridVoltage.lastUpdate).toLocaleTimeString() : undefined,
    })
  } else {
    systemStatuses.push({
      id: "grid",
      title: "Connexion Réseau",
      status: "disconnected",
      message: "Capteur non détecté",
      icon: <X className="h-5 w-5" />,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/15 border-green-500/30 text-green-900 dark:text-green-100"
      case "warning":
        return "bg-yellow-500/15 border-yellow-500/30 text-yellow-900 dark:text-yellow-100"
      case "critical":
        return "bg-red-500/15 border-red-500/30 text-red-900 dark:text-red-100"
      case "disconnected":
        return "bg-gray-500/15 border-gray-500/30 text-gray-900 dark:text-gray-100"
      default:
        return "bg-gray-500/15 border-gray-500/30"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500 text-white"
      case "warning":
        return "bg-yellow-500 text-black"
      case "critical":
        return "bg-red-500 text-white"
      case "disconnected":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "healthy":
        return "Sain"
      case "warning":
        return "Attention"
      case "critical":
        return "Critique"
      case "disconnected":
        return "Déconnecté"
      default:
        return "Inconnu"
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">État du Système</h2>
        <p className="text-sm text-muted-foreground">Surveillance en temps réel de tous les composants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemStatuses.map((status) => (
          <Card key={status.id} className={`border ${getStatusColor(status.status)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{status.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{status.title}</h3>
                      <Badge className={getStatusBadgeColor(status.status)}>
                        {getStatusLabel(status.status)}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{status.message}</p>
                    {status.timestamp && <p className="text-xs opacity-60 mt-2">{status.timestamp}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Summary */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          {systemStatuses.filter(s => s.status === "disconnected").length === 0
            ? "✓ Tous les capteurs sont connectés"
            : `⚠️ ${systemStatuses.filter(s => s.status === "disconnected").length} capteur(s) déconnecté(s)`}
        </p>
      </div>
    </div>
  )
}
