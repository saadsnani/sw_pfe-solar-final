"use client"

import { useEffect, useState } from "react"
import { Activity, TrendingUp, Zap, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GridStatus {
  voltage: number
  frequency: number
  powerExchange: number
  gridConnected: boolean
  efficiency: number
}

export function GridIntegrationStatus() {
  const [gridStatus, setGridStatus] = useState<GridStatus>({
    voltage: 230,
    frequency: 50.0,
    powerExchange: 45, // positive = exporting to grid, negative = importing
    gridConnected: true,
    efficiency: 94,
  })

  useEffect(() => {
    // Simulate real-time grid status updates every 3 seconds
    const interval = setInterval(() => {
      setGridStatus((prev) => ({
        voltage: Math.max(200, Math.min(260, prev.voltage + (Math.random() - 0.5) * 5)),
        frequency: Math.max(49.8, Math.min(50.2, prev.frequency + (Math.random() - 0.5) * 0.1)),
        powerExchange: prev.powerExchange + (Math.random() - 0.5) * 30,
        gridConnected: true,
        efficiency: Math.max(85, Math.min(99, prev.efficiency + (Math.random() - 0.5) * 2)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const isVoltageNormal = gridStatus.voltage >= 220 && gridStatus.voltage <= 240
  const isFrequencyNormal = gridStatus.frequency >= 49.9 && gridStatus.frequency <= 50.1
  const isEfficiencyGood = gridStatus.efficiency >= 90

  const getGridStatusColor = () => {
    if (!gridStatus.gridConnected) return "text-red-600 dark:text-red-400"
    if (!isVoltageNormal || !isFrequencyNormal) return "text-yellow-600 dark:text-yellow-400"
    return "text-green-600 dark:text-green-400"
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Intégration Réseau Électrique</h3>
        <p className="text-sm text-muted-foreground">État de connexion et synchronisation avec le réseau</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connection Status Card */}
        <Card className="border-2 border-green-500/30 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`${getGridStatusColor()} mt-1`}>
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">État de Connexion</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {gridStatus.gridConnected ? "Connecté" : "Déconnecté"}
                  </p>
                  <Badge className={gridStatus.gridConnected ? "bg-green-500" : "bg-red-500"}>
                    {gridStatus.gridConnected ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Synchronisation réseau active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voltage Status Card */}
        <Card className={`border-2 ${isVoltageNormal ? "border-blue-500/30 bg-blue-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={isVoltageNormal ? "text-blue-600 dark:text-blue-400" : "text-yellow-600 dark:text-yellow-400"}>
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Tension Réseau</p>
                <p className="text-xl font-bold">{gridStatus.voltage.toFixed(1)} V</p>
                <div className="mt-2 bg-background rounded h-2">
                  <div
                    className={`h-full rounded transition-all ${isVoltageNormal ? "bg-blue-500" : "bg-yellow-500"}`}
                    style={{
                      width: `${((gridStatus.voltage - 200) / 60) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isVoltageNormal ? "Plage optimale (220-240V)" : "Hors limites standard"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frequency Status Card */}
        <Card className={`border-2 ${isFrequencyNormal ? "border-purple-500/30 bg-purple-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={isFrequencyNormal ? "text-purple-600 dark:text-purple-400" : "text-yellow-600 dark:text-yellow-400"}>
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Fréquence Réseau</p>
                <p className="text-xl font-bold">{gridStatus.frequency.toFixed(2)} Hz</p>
                <div className="mt-2 bg-background rounded h-2">
                  <div
                    className={`h-full rounded transition-all ${isFrequencyNormal ? "bg-purple-500" : "bg-yellow-500"}`}
                    style={{
                      width: `${((gridStatus.frequency - 49.8) / 0.4) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isFrequencyNormal ? "Synchronisé (50 Hz ±0.1)" : "Écart détecté"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Power Exchange Card */}
        <Card className="border-2 border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-orange-600 dark:text-orange-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Échange d'Énergie</p>
                <p className="text-xl font-bold">
                  {gridStatus.powerExchange > 0 ? "+" : ""}
                  {gridStatus.powerExchange.toFixed(1)} kW
                </p>
                <Badge className={gridStatus.powerExchange > 0 ? "bg-green-600 mt-2" : "bg-blue-600 mt-2"}>
                  {gridStatus.powerExchange > 0 ? "Export vers le réseau" : "Import du réseau"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {gridStatus.powerExchange > 0
                    ? "Votre système exporte de l'énergie"
                    : "Vous consommez de l'énergie du réseau"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Card */}
        <Card className={`border-2 md:col-span-2 ${isEfficiencyGood ? "border-emerald-500/30 bg-emerald-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Efficacité Globale du Système</p>
                <div className="flex items-end gap-2">
                  <p className={`text-3xl font-bold ${isEfficiencyGood ? "text-emerald-600 dark:text-emerald-400" : "text-yellow-600"}`}>
                    {gridStatus.efficiency.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {isEfficiencyGood ? "Excellent" : "Bon"}
                  </p>
                </div>
              </div>
              <div className="w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/20" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(gridStatus.efficiency / 100) * 88} 88`}
                    strokeLinecap="round"
                    className={isEfficiencyGood ? "text-emerald-500" : "text-yellow-500"}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                ℹ️ L'efficacité mesure le ratio production/consommation. Une efficacité élevée indique une bonne synchronisation avec le réseau.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Résumé d'Intégration</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Connexion au réseau: <span className="font-semibold text-foreground">{gridStatus.gridConnected ? "Active" : "Inactive"}</span></li>
                <li>✓ Tension: <span className="font-semibold text-foreground">{isVoltageNormal ? "Optimale" : "À surveiller"}</span></li>
                <li>✓ Fréquence: <span className="font-semibold text-foreground">{isFrequencyNormal ? "Synchronisée" : "Écart détecté"}</span></li>
                <li>✓ Échange d'énergie: <span className="font-semibold text-foreground">{gridStatus.powerExchange > 0 ? "Export" : "Import"} en cours</span></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
