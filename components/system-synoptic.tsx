"use client"

import type React from "react"

import { Sun, Battery, Zap, Home, ArrowRight, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface ComponentNodeProps {
  icon: React.ReactNode
  label: string
  values: string[]
  status: "good" | "warning" | "critical" | "disconnected"
}

function ComponentNode({ icon, label, values, status }: ComponentNodeProps) {
  const statusColors = {
    good: "border-energy-green bg-energy-green/10",
    warning: "border-energy-yellow bg-energy-yellow/10",
    critical: "border-energy-red bg-energy-red/10",
    disconnected: "border-gray-400/50 bg-gray-400/5",
  }

  const iconColors = {
    good: "text-energy-green",
    warning: "text-energy-yellow",
    critical: "text-energy-red",
    disconnected: "text-gray-400",
  }

  return (
    <div className={`relative p-4 rounded-2xl border-2 ${statusColors[status]} backdrop-blur-sm float-animation`}>
      <div
        className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-3 mx-auto ${iconColors[status]}`}
      >
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground text-center mb-2">{label}</h3>
      <div className="space-y-1">
        {values.length === 0 ? (
          <p className="text-xs text-center text-muted-foreground italic">Non connecté</p>
        ) : (
          values.map((value, index) => (
            <p key={index} className="text-xs text-center font-mono text-muted-foreground">
              {value}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

function EnergyFlowLine() {
  return (
    <div className="hidden lg:flex items-center justify-center w-24 relative">
      <div className="w-full h-0.5 bg-border" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-energy-green energy-flow"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </div>
      <ArrowRight className="absolute right-0 w-4 h-4 text-energy-green" />
    </div>
  )
}

interface SystemSynopticProps {
  sensors?: SystemSensorsState
}

export function SystemSynoptic({ sensors }: SystemSynopticProps) {
  // Extract sensor values
  const solarVoltage = sensors?.solarVoltage.value
  const solarCurrent = sensors?.solarCurrent.value
  const solarProduction = sensors?.production.value
  const batteryVoltage = sensors?.battery.value
  const batteryTemp = sensors?.temperature.value
  const gridVoltage = sensors?.gridVoltage.value
  const consumption = sensors?.consumption.value

  const isSolarConnected = sensors?.solarVoltage.connected && sensors?.solarCurrent.connected
  const isBatteryConnected = sensors?.battery.connected
  const isGridConnected = sensors?.gridVoltage.connected
  const isConsumptionConnected = sensors?.consumption.connected

  const allConnected = isSolarConnected && isBatteryConnected && isGridConnected && isConsumptionConnected

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Synoptique du Système
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 py-4">
          {/* Solar Panel */}
          <ComponentNode
            icon={<Sun className="w-6 h-6" />}
            label="Panneau Solaire"
            values={
              isSolarConnected && solarVoltage !== null && solarCurrent !== null
                ? [`${solarVoltage.toFixed(1)}V / ${solarCurrent.toFixed(1)}A`, solarProduction ? `${solarProduction.toFixed(0)}W` : '']
                : []
            }
            status={isSolarConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLine />

          {/* MPPT Controller */}
          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Contrôleur MPPT"
            values={isSolarConnected ? ["Efficacité: 98%", "Mode: MPPT"] : []}
            status={isSolarConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLine />

          {/* Battery */}
          <ComponentNode
            icon={<Battery className="w-6 h-6" />}
            label="Batterie 12V"
            values={
              isBatteryConnected && batteryVoltage !== null
                ? [`${batteryVoltage.toFixed(1)}% charge`, batteryTemp ? `Temp: ${batteryTemp.toFixed(1)}°C` : '']
                : []
            }
            status={
              isBatteryConnected
                ? batteryVoltage !== null && batteryVoltage >= 70
                  ? "good"
                  : batteryVoltage !== null && batteryVoltage >= 20
                    ? "warning"
                    : "critical"
                : "disconnected"
            }
          />

          <EnergyFlowLine />

          {/* Grid/Inverter */}
          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Onduleur / Réseau"
            values={isGridConnected && gridVoltage !== null ? [`${gridVoltage.toFixed(1)}V AC`, "Mode: Connecté"] : []}
            status={isGridConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLine />

          {/* Home Load */}
          <ComponentNode
            icon={<Home className="w-6 h-6" />}
            label="Charge Maison"
            values={isConsumptionConnected && consumption !== null ? [`${consumption.toFixed(0)}W`, "Actif"] : []}
            status={isConsumptionConnected ? "good" : "disconnected"}
          />
        </div>

        {/* Status Bar */}
        <div
          className={`mt-6 p-4 rounded-xl border ${
            allConnected
              ? "bg-energy-green/10 border-energy-green/30"
              : "bg-yellow-500/10 border-yellow-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {allConnected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-energy-green animate-pulse" />
                  <span className="text-sm text-energy-green font-medium">Tous les capteurs connectés</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Certains capteurs non détectés</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {sensors?.battery.lastUpdate ? new Date(sensors.battery.lastUpdate).toLocaleTimeString() : "Pas de données"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
