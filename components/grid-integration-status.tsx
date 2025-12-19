"use client"

import { Activity, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface GridIntegrationStatusProps {
  sensors?: SystemSensorsState
}

export function GridIntegrationStatus({ sensors }: GridIntegrationStatusProps) {
  // All disconnected by default if no sensors provided
  const voltage = sensors?.gridVoltage.value ?? null
  const frequency = sensors?.gridFrequency.value ?? null
  const powerExchange = sensors?.production.value ?? null  // Placeholder

  const isVoltageConnected = sensors?.gridVoltage.connected ?? false
  const isFrequencyConnected = sensors?.gridFrequency.connected ?? false
  const isProductionConnected = sensors?.production.connected ?? false

  const isVoltageNormal = voltage !== null && voltage >= 220 && voltage <= 240
  const isFrequencyNormal = frequency !== null && frequency >= 49.9 && frequency <= 50.1
  const isGridConnected = isVoltageConnected && isFrequencyConnected && (voltage !== null && frequency !== null)

  const getGridStatusColor = () => {
    if (!isGridConnected) return "text-red-600 dark:text-red-400"
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
        <Card className={`border-2 ${isGridConnected ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`${getGridStatusColor()} mt-1`}>
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">État de Connexion</p>
                {isGridConnected ? (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">Connecté</p>
                      <Badge className="bg-green-500">En ligne</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Synchronisation réseau active</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">Non Connecté</p>
                      <Badge className="bg-red-500">Hors ligne</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Capteurs non détectés</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voltage Status Card */}
        <Card
          className={`border-2 ${
            isVoltageConnected && isVoltageNormal
              ? "border-blue-500/30 bg-blue-500/5"
              : isVoltageConnected
                ? "border-yellow-500/30 bg-yellow-500/5"
                : "border-gray-500/30 bg-gray-500/5"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={
                  isVoltageConnected
                    ? isVoltageNormal
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-yellow-600 dark:text-yellow-400"
                    : "text-muted-foreground"
                }
              >
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Tension Réseau</p>
                {isVoltageConnected && voltage !== null ? (
                  <>
                    <p className="text-xl font-bold">{voltage.toFixed(1)} V</p>
                    <div className="mt-2 bg-background rounded h-2">
                      <div
                        className={`h-full rounded transition-all ${isVoltageNormal ? "bg-blue-500" : "bg-yellow-500"}`}
                        style={{
                          width: `${((voltage - 200) / 60) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isVoltageNormal ? "Plage optimale (220-240V)" : "Hors limites standard"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Non connecté</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frequency Status Card */}
        <Card
          className={`border-2 ${
            isFrequencyConnected && isFrequencyNormal
              ? "border-purple-500/30 bg-purple-500/5"
              : isFrequencyConnected
                ? "border-yellow-500/30 bg-yellow-500/5"
                : "border-gray-500/30 bg-gray-500/5"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={
                  isFrequencyConnected
                    ? isFrequencyNormal
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-yellow-600 dark:text-yellow-400"
                    : "text-muted-foreground"
                }
              >
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Fréquence Réseau</p>
                {isFrequencyConnected && frequency !== null ? (
                  <>
                    <p className="text-xl font-bold">{frequency.toFixed(2)} Hz</p>
                    <div className="mt-2 bg-background rounded h-2">
                      <div
                        className={`h-full rounded transition-all ${isFrequencyNormal ? "bg-purple-500" : "bg-yellow-500"}`}
                        style={{
                          width: `${((frequency - 49.8) / 0.4) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isFrequencyNormal ? "Synchronisé (50 Hz ±0.1)" : "Écart détecté"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Non connecté</p>
                )}
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
                {isProductionConnected && powerExchange !== null ? (
                  <>
                    <p className="text-xl font-bold">
                      {powerExchange > 0 ? "+" : ""}
                      {powerExchange.toFixed(1)} kW
                    </p>
                    <Badge className={powerExchange > 0 ? "bg-green-600 mt-2" : "bg-blue-600 mt-2"}>
                      {powerExchange > 0 ? "Export vers le réseau" : "Import du réseau"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {powerExchange > 0
                        ? "Production excédentaire : export vers le réseau"
                        : "Consommation supérieure : import du réseau"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Non connecté</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
