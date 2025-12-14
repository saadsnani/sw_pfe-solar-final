"use client"

import { Button } from "@/components/ui/button"
import { Shield, PartyPopper, Activity, Zap } from "lucide-react"

interface SmartModesProps {
  activeMode: "normal" | "survival" | "party"
  onModeChange: (mode: "normal" | "survival" | "party") => void
  batteryLevel: number
}

export default function SmartModes({ activeMode, onModeChange, batteryLevel }: SmartModesProps) {
  const modes = [
    {
      id: "normal" as const,
      name: "NORMAL",
      icon: Activity,
      description: "Standard operation",
      color: "neon-cyan",
      bgColor: "bg-neon-cyan/20",
      borderColor: "border-neon-cyan/30",
      activeClass: "bg-neon-cyan text-background",
    },
    {
      id: "survival" as const,
      name: "SURVIVAL",
      icon: Shield,
      description: "Emergency power saving",
      color: "neon-amber",
      bgColor: "bg-neon-amber/20",
      borderColor: "border-neon-amber/30",
      activeClass: "bg-neon-amber text-background",
    },
    {
      id: "party" as const,
      name: "PARTY",
      icon: PartyPopper,
      description: "High load preparation",
      color: "neon-magenta",
      bgColor: "bg-neon-magenta/20",
      borderColor: "border-neon-magenta/30",
      activeClass: "bg-neon-magenta text-background",
    },
  ]

  return (
    <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-cyan via-neon-amber to-neon-magenta" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30">
            <Zap className="h-5 w-5 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase" style={{ fontFamily: "var(--font-display)" }}>
              Smart Modes
            </h3>
            <p className="text-xs text-muted-foreground">Gamified energy management</p>
          </div>
        </div>

        <div className="flex gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isActive = activeMode === mode.id
            const isDisabled = mode.id === "party" && batteryLevel < 60

            return (
              <Button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                disabled={isDisabled}
                className={`flex-1 md:flex-none h-auto py-3 px-4 ${
                  isActive
                    ? mode.activeClass
                    : `${mode.bgColor} ${mode.borderColor} border text-foreground hover:opacity-80`
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-bold tracking-wider">{mode.name}</span>
                  <span className="text-[10px] opacity-70 hidden md:block">{mode.description}</span>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Mode status message */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <p className="text-xs text-center text-muted-foreground">
          {activeMode === "survival" && "⚡ Non-essential loads disabled. Maximum battery preservation."}
          {activeMode === "party" && "🎉 Battery charging prioritized. Ready for high-load events!"}
          {activeMode === "normal" && "✓ All systems operating normally."}
        </p>
      </div>
    </div>
  )
}
