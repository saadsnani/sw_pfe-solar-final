"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Lightbulb, Fan, Tv, Refrigerator, AlertTriangle, CheckCircle2, Zap } from "lucide-react"

interface WhatIfSimulatorProps {
  batteryLevel: number
  currentProduction: number
}

const appliances = [
  { id: "ac", name: "Air Conditioner", icon: Fan, power: 2000 },
  { id: "tv", name: "TV", icon: Tv, power: 150 },
  { id: "fridge", name: "Refrigerator", icon: Refrigerator, power: 200 },
  { id: "lights", name: "Lights", icon: Lightbulb, power: 100 },
]

export default function WhatIfSimulator({ batteryLevel, currentProduction }: WhatIfSimulatorProps) {
  const [selectedAppliance, setSelectedAppliance] = useState(appliances[0])
  const [duration, setDuration] = useState([2])
  const [simulation, setSimulation] = useState<{ finalBattery: number; blackoutTime: number | null }>({
    finalBattery: batteryLevel,
    blackoutTime: null,
  })

  useEffect(() => {
    // Simulate battery drain
    const powerDraw = selectedAppliance.power
    const hours = duration[0]
    const batteryCapacity = 2400 // Wh (200Ah * 12V)
    const energyNeeded = powerDraw * hours
    const netProduction = currentProduction * hours

    const energyDrain = energyNeeded - netProduction
    const batteryDrainPercent = (energyDrain / batteryCapacity) * 100

    const finalBattery = Math.max(0, batteryLevel - batteryDrainPercent)

    // Check if blackout occurs (below 11.5V cutoff ~ 20% SOC)
    let blackoutTime: number | null = null
    if (finalBattery < 20) {
      const availableEnergy = ((batteryLevel - 20) / 100) * batteryCapacity
      const hoursUntilBlackout = availableEnergy / (powerDraw - currentProduction)
      blackoutTime = Math.max(0, hoursUntilBlackout)
    }

    setSimulation({ finalBattery, blackoutTime })
  }, [selectedAppliance, duration, batteryLevel, currentProduction])

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30">
          <Zap className="h-5 w-5 text-neon-cyan" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            WHAT-IF SIMULATOR
          </h3>
          <p className="text-xs text-muted-foreground">Test energy scenarios</p>
        </div>
      </div>

      {/* Appliance Selection */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {appliances.map((app) => {
          const Icon = app.icon
          return (
            <Button
              key={app.id}
              variant={selectedAppliance.id === app.id ? "default" : "outline"}
              className={`justify-start h-auto py-2 ${selectedAppliance.id === app.id ? "bg-neon-cyan text-background" : "border-border/50"}`}
              onClick={() => setSelectedAppliance(app)}
            >
              <Icon className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="text-xs font-medium">{app.name}</p>
                <p className="text-[10px] opacity-70">{app.power}W</p>
              </div>
            </Button>
          )
        })}
      </div>

      {/* Duration Slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Duration</span>
          <span className="text-sm font-mono text-neon-cyan">{duration[0]} hours</span>
        </div>
        <Slider
          value={duration}
          onValueChange={setDuration}
          min={1}
          max={8}
          step={1}
          className="[&_[role=slider]]:bg-neon-cyan"
        />
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div
          className={`p-3 rounded-lg ${simulation.blackoutTime !== null ? "bg-destructive/20 border border-destructive/30" : "bg-neon-green/10 border border-neon-green/30"}`}
        >
          {simulation.blackoutTime !== null ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Blackout Warning</p>
                <p className="text-xs text-muted-foreground">
                  System will shut down in {simulation.blackoutTime.toFixed(1)}h
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-neon-green" />
              <div>
                <p className="text-sm font-medium text-neon-green">Safe to proceed</p>
                <p className="text-xs text-muted-foreground">No blackout risk detected</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
          <span className="text-xs text-muted-foreground">Final Battery Level</span>
          <span
            className={`text-lg font-bold font-mono ${simulation.finalBattery < 30 ? "text-destructive" : "text-neon-magenta"}`}
          >
            {simulation.finalBattery.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}
