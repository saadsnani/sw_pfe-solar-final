"use client"

import type React from "react"

import { Sun, Battery, Zap, Home, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComponentNodeProps {
  icon: React.ReactNode
  label: string
  values: string[]
  status: "good" | "warning" | "critical"
}

function ComponentNode({ icon, label, values, status }: ComponentNodeProps) {
  const statusColors = {
    good: "border-energy-green bg-energy-green/10",
    warning: "border-energy-yellow bg-energy-yellow/10",
    critical: "border-energy-red bg-energy-red/10",
  }

  const iconColors = {
    good: "text-energy-green",
    warning: "text-energy-yellow",
    critical: "text-energy-red",
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
        {values.map((value, index) => (
          <p key={index} className="text-xs text-center font-mono text-muted-foreground">
            {value}
          </p>
        ))}
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

export function SystemSynoptic() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          System Synoptic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 py-4">
          {/* Solar Panel */}
          <ComponentNode
            icon={<Sun className="w-6 h-6" />}
            label="Solar Panel"
            values={["35V / 8A", "280W"]}
            status="good"
          />

          <EnergyFlowLine />

          {/* MPPT Controller */}
          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="MPPT Controller"
            values={["Efficiency: 98%", "Mode: MPPT"]}
            status="good"
          />

          <EnergyFlowLine />

          {/* Battery */}
          <ComponentNode
            icon={<Battery className="w-6 h-6" />}
            label="Battery 12V"
            values={["12.8V / 85%", "Temp: 28°C"]}
            status="good"
          />

          <EnergyFlowLine />

          {/* Inverter */}
          <ComponentNode
            icon={<Zap className="w-6 h-6" />}
            label="Inverter 230V"
            values={["230V AC", "450W Load"]}
            status="good"
          />

          <EnergyFlowLine />

          {/* Home Load */}
          <ComponentNode
            icon={<Home className="w-6 h-6" />}
            label="Home Load"
            values={["Active: 5 Devices", "Priority: Normal"]}
            status="good"
          />
        </div>

        {/* Status Bar */}
        <div className="mt-6 p-4 rounded-xl bg-energy-green/10 border border-energy-green/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-energy-green animate-pulse" />
              <span className="text-sm text-energy-green font-medium">System Operating Normally</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Last Update: Just Now</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
