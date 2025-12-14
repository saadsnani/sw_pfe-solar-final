"use client"

import { useState, useEffect } from "react"
import { Shirt, Clock, Zap, CheckCircle2, AlertTriangle } from "lucide-react"

interface LaundryPlannerProps {
  batteryLevel: number
  currentProduction: number
}

interface GoldenHour {
  time: string
  batteryPrediction: number
  recommendation: string
  isOptimal: boolean
}

export default function LaundryPlanner({ batteryLevel, currentProduction }: LaundryPlannerProps) {
  const [goldenHours, setGoldenHours] = useState<GoldenHour[]>([])

  useEffect(() => {
    // Simulate AI prediction for best times to run heavy appliances
    const hours: GoldenHour[] = []
    const now = new Date()
    const currentHour = now.getHours()

    for (let i = 0; i < 6; i++) {
      const hour = (currentHour + i + 1) % 24
      const isSunny = hour >= 10 && hour <= 16
      const predictedBattery = Math.min(100, batteryLevel + (isSunny ? 15 * (i + 1) : -5 * (i + 1)))

      hours.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        batteryPrediction: Math.max(20, predictedBattery),
        recommendation:
          predictedBattery >= 80
            ? "Excellent"
            : predictedBattery >= 60
              ? "Good"
              : predictedBattery >= 40
                ? "Fair"
                : "Avoid",
        isOptimal: predictedBattery >= 80 && isSunny,
      })
    }

    setGoldenHours(hours)
  }, [batteryLevel])

  const optimalHour = goldenHours.find((h) => h.isOptimal) || goldenHours[0]

  return (
    <div className="glass-card rounded-2xl p-6 neon-glow-amber relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-amber to-transparent" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-neon-amber/20 border border-neon-amber/30">
          <Shirt className="h-5 w-5 text-neon-amber" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            SOLAR LAUNDRY PLANNER
          </h3>
          <p className="text-xs text-muted-foreground">AI-powered appliance scheduling</p>
        </div>
      </div>

      {/* Golden Hour Recommendation */}
      <div className="mb-4 p-4 rounded-xl bg-neon-amber/10 border border-neon-amber/30">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-neon-green" />
          <span className="text-xs uppercase tracking-wider text-neon-amber">Golden Hour</span>
        </div>
        <p className="text-sm text-foreground mb-1">Best time to run washing machine:</p>
        <p className="text-2xl font-bold font-mono text-neon-amber" style={{ fontFamily: "var(--font-display)" }}>
          Today at {optimalHour?.time || "13:00"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Battery will be at {optimalHour?.batteryPrediction || 100}%
        </p>
      </div>

      {/* Schedule Preview */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Upcoming windows</p>
        {goldenHours.slice(0, 4).map((hour, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg ${hour.isOptimal ? "bg-neon-green/10 border border-neon-green/30" : "bg-secondary/30"}`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-mono">{hour.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-neon-magenta" />
                <span className="text-xs font-mono">{hour.batteryPrediction}%</span>
              </div>
              {hour.isOptimal ? (
                <CheckCircle2 className="h-4 w-4 text-neon-green" />
              ) : hour.batteryPrediction < 40 ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
