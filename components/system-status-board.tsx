"use client"

import { AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SystemStatus {
  id: string
  title: string
  status: "healthy" | "warning" | "critical" | "info"
  message: string
  icon: React.ReactNode
  timestamp: string
}

export function SystemStatusBoard() {
  const systemStatuses: SystemStatus[] = [
    {
      id: "battery",
      title: "État de la Batterie",
      status: "healthy",
      message: "Batterie en bon état - 85% de charge",
      icon: <CheckCircle className="h-5 w-5" />,
      timestamp: "À l'instant",
    },
    {
      id: "production",
      title: "Production Solaire",
      status: "info",
      message: "Production stable - 280W actuellement",
      icon: <TrendingUp className="h-5 w-5" />,
      timestamp: "Il y a 2 min",
    },
    {
      id: "temperature",
      title: "Température",
      status: "healthy",
      message: "Température normale - 28°C",
      icon: <CheckCircle className="h-5 w-5" />,
      timestamp: "À l'instant",
    },
    {
      id: "maintenance",
      title: "Maintenance",
      status: "warning",
      message: "Maintenance programmée dans 15 jours",
      icon: <Clock className="h-5 w-5" />,
      timestamp: "Il y a 1 jour",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/15 border-green-500/30 text-green-900 dark:text-green-100"
      case "warning":
        return "bg-yellow-500/15 border-yellow-500/30 text-yellow-900 dark:text-yellow-100"
      case "critical":
        return "bg-red-500/15 border-red-500/30 text-red-900 dark:text-red-100"
      case "info":
        return "bg-blue-500/15 border-blue-500/30 text-blue-900 dark:text-blue-100"
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
      case "info":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
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
                        {status.status === "healthy" ? "Sain" : status.status === "warning" ? "Attention" : status.status === "critical" ? "Critique" : "Info"}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{status.message}</p>
                    <p className="text-xs opacity-60 mt-2">{status.timestamp}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
