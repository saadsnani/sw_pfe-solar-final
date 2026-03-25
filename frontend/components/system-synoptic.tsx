"use client"

import type React from "react"

import { Sun, Battery, Zap, Home, ArrowRight, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRelayState } from "@/hooks/use-relay-state"
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
    <div className={`relative p-4 sm:p-5 md:p-6 rounded-2xl border-2 ${statusColors[status]} backdrop-blur-sm float-animation w-full sm:w-auto shadow-lg`}>
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-card flex items-center justify-center mb-2 sm:mb-3 mx-auto ${iconColors[status]}`}
      >
        {icon}
      </div>
      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground text-center mb-2 sm:mb-3">{label}</h3>
      <div className="space-y-1 sm:space-y-2">
        {values.length === 0 ? (
          <p className="text-xs sm:text-sm text-center text-muted-foreground italic">Non connecté</p>
        ) : (
          values.map((value, index) => (
            <p key={index} className="text-xs sm:text-sm text-center font-mono text-muted-foreground font-medium">
              {value}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

function EnergyFlowLineHorizontal() {
  return (
    <div className="flex items-center justify-center w-24 relative">
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

function EnergyFlowLineVertical() {
  return (
    <div className="flex items-center justify-center h-8 sm:h-10 relative w-full">
      <div className="w-0.5 h-full bg-border" />
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-energy-green energy-flow-vertical"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </div>
      <ArrowRight className="absolute bottom-0 w-4 h-4 text-energy-green rotate-90" />
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

  const isSolarConnected = sensors?.solarVoltage.connected && sensors?.solarCurrent.connected
  const isBatteryConnected = sensors?.battery.connected

  const { relayOn: inverterRelayOn, loading: inverterRelayLoading } = useRelayState({
    provider: "rtdb",
    path: "control/relays/inverter",
    initialValue: false,
  })

  const { relayOn: block1RelayOn, loading: block1RelayLoading } = useRelayState({
    provider: "rtdb",
    path: "control/relays/block1",
    initialValue: false,
  })

  const { relayOn: block2RelayOn, loading: block2RelayLoading } = useRelayState({
    provider: "rtdb",
    path: "control/relays/block2",
    initialValue: false,
  })

  const relayLoading = inverterRelayLoading || block1RelayLoading || block2RelayLoading
  const inverterActive = inverterRelayOn
  const block1Active = block1RelayOn
  const block2Active = block2RelayOn
  const isChargeRelayOn = block1Active || block2Active

  const solarValues =
    isSolarConnected && solarVoltage !== null && solarCurrent !== null
      ? [`${solarVoltage.toFixed(1)}V / ${solarCurrent.toFixed(1)}A`, solarProduction !== null ? `${solarProduction.toFixed(0)}W` : ""]
          .filter(Boolean)
      : []

  const batteryValues =
    isBatteryConnected && batteryVoltage !== null
      ? [`${batteryVoltage.toFixed(1)}% charge`, batteryTemp !== null ? `Temp: ${batteryTemp.toFixed(1)}°C` : ""].filter(Boolean)
      : []

  const inverterValues = relayLoading
    ? ["Synchronisation..."]
    : inverterActive
      ? [gridVoltage !== null ? `${gridVoltage.toFixed(1)}V AC` : "Onduleur ON", "Actif"]
      : ["OFF"]

  const chargeValues = relayLoading
    ? ["Synchronisation..."]
    : [
        `Block 1: ${block1Active ? "ON" : "OFF"}`,
        `Block 2: ${block2Active ? "ON" : "OFF"}`,
      ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Synoptique du Système
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile: vertical flow */}
        <div className="flex lg:hidden flex-col items-center gap-4 py-4">
          <ComponentNode
            icon={<Sun className="w-6 h-6" />}
            label="Panneau Solaire"
            values={solarValues}
            status={isSolarConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLineVertical />

          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Contrôleur MPPT"
            values={isSolarConnected ? ["Efficacité: 98%", "Mode: MPPT"] : []}
            status={isSolarConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLineVertical />

          <ComponentNode
            icon={<Battery className="w-6 h-6" />}
            label="Batterie 12V"
            values={batteryValues}
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

          <EnergyFlowLineVertical />

          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Onduleur"
            values={inverterValues}
            status={relayLoading ? "warning" : inverterActive ? "good" : "disconnected"}
          />

          <EnergyFlowLineVertical />

          <ComponentNode
            icon={<Home className="w-6 h-6" />}
            label="Charge"
            values={chargeValues}
            status={relayLoading ? "warning" : isChargeRelayOn ? "good" : "disconnected"}
          />
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:flex flex-row flex-nowrap items-center justify-start gap-4 py-4 overflow-x-auto">
          <ComponentNode
            icon={<Sun className="w-6 h-6" />}
            label="Panneau Solaire"
            values={solarValues}
            status={isSolarConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLineHorizontal />

          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Contrôleur MPPT"
            values={isSolarConnected ? ["Efficacité: 98%", "Mode: MPPT"] : []}
            status={isSolarConnected ? "good" : "disconnected"}
          />

          <EnergyFlowLineHorizontal />

          <ComponentNode
            icon={<Battery className="w-6 h-6" />}
            label="Batterie 12V"
            values={batteryValues}
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

          <EnergyFlowLineHorizontal />

          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Onduleur"
            values={inverterValues}
            status={relayLoading ? "warning" : inverterActive ? "good" : "disconnected"}
          />

          <EnergyFlowLineHorizontal />

          <ComponentNode
            icon={<Home className="w-6 h-6" />}
            label="Charge"
            values={chargeValues}
            status={relayLoading ? "warning" : isChargeRelayOn ? "good" : "disconnected"}
          />
        </div>
      </CardContent>
    </Card>
  )
}
