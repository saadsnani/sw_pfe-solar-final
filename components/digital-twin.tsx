"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Power, Sun, Battery, Home, Zap } from "lucide-react"

interface DigitalTwinProps {
  batteryLevel: number
  powerOutput: number
  pvSystemOn: boolean
  onToggleSystem: () => void
}

export default function DigitalTwin({ batteryLevel, powerOutput, pvSystemOn, onToggleSystem }: DigitalTwinProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 })
  const [energyFlowOffset, setEnergyFlowOffset] = useState(0)

  // Calculate sun position based on current time
  useEffect(() => {
    const updateSunPosition = () => {
      const now = new Date()
      const hours = now.getHours() + now.getMinutes() / 60
      // Sun rises at 6, sets at 20, peaks at 13
      const normalizedTime = Math.max(0, Math.min(1, (hours - 6) / 14))
      const x = normalizedTime
      const y = Math.sin(normalizedTime * Math.PI) * 0.8
      setSunPosition({ x, y })
    }
    updateSunPosition()
    const interval = setInterval(updateSunPosition, 60000)
    return () => clearInterval(interval)
  }, [])

  // Animate energy flow
  useEffect(() => {
    if (!pvSystemOn) return
    const interval = setInterval(() => {
      setEnergyFlowOffset((prev) => (prev + 1) % 20)
    }, 100)
    return () => clearInterval(interval)
  }, [pvSystemOn])

  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Draw sun
    const sunX = 50 + sunPosition.x * (width - 100)
    const sunY = height - 50 - sunPosition.y * (height - 100)

    if (sunPosition.y > 0) {
      // Sun glow
      const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 60)
      gradient.addColorStop(0, "rgba(255, 191, 0, 0.8)")
      gradient.addColorStop(0.5, "rgba(255, 191, 0, 0.3)")
      gradient.addColorStop(1, "rgba(255, 191, 0, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(sunX, sunY, 60, 0, Math.PI * 2)
      ctx.fill()

      // Sun core
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw house silhouette
    const houseX = width / 2
    const houseY = height - 80
    ctx.fillStyle = "rgba(20, 20, 40, 0.9)"
    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)"
    ctx.lineWidth = 2

    // House body
    ctx.beginPath()
    ctx.moveTo(houseX - 60, houseY)
    ctx.lineTo(houseX - 60, houseY - 50)
    ctx.lineTo(houseX, houseY - 90)
    ctx.lineTo(houseX + 60, houseY - 50)
    ctx.lineTo(houseX + 60, houseY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Solar panels on roof
    ctx.fillStyle = pvSystemOn ? "rgba(0, 255, 255, 0.3)" : "rgba(100, 100, 100, 0.3)"
    ctx.strokeStyle = pvSystemOn ? "rgba(0, 255, 255, 0.8)" : "rgba(100, 100, 100, 0.5)"
    ctx.beginPath()
    ctx.moveTo(houseX - 45, houseY - 60)
    ctx.lineTo(houseX - 10, houseY - 82)
    ctx.lineTo(houseX + 10, houseY - 82)
    ctx.lineTo(houseX - 25, houseY - 60)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(houseX + 10, houseY - 82)
    ctx.lineTo(houseX + 45, houseY - 60)
    ctx.lineTo(houseX + 25, houseY - 60)
    ctx.lineTo(houseX - 10, houseY - 82)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw energy flow lines if system is on
    if (pvSystemOn && sunPosition.y > 0) {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.lineDashOffset = -energyFlowOffset

      // Sun to panels
      ctx.beginPath()
      ctx.moveTo(sunX, sunY + 20)
      ctx.quadraticCurveTo(houseX, (sunY + houseY - 70) / 2, houseX, houseY - 70)
      ctx.stroke()

      // Panels to battery (magenta)
      ctx.strokeStyle = "rgba(255, 0, 255, 0.8)"
      ctx.beginPath()
      ctx.moveTo(houseX, houseY - 40)
      ctx.lineTo(houseX - 100, houseY - 20)
      ctx.stroke()

      // Battery to home (amber)
      ctx.strokeStyle = "rgba(255, 191, 0, 0.8)"
      ctx.beginPath()
      ctx.moveTo(houseX - 100, houseY - 20)
      ctx.lineTo(houseX - 40, houseY - 30)
      ctx.stroke()

      ctx.setLineDash([])
    }

    // Draw battery indicator
    const batteryX = houseX - 120
    const batteryY = houseY - 40
    ctx.fillStyle = "rgba(20, 20, 40, 0.9)"
    ctx.strokeStyle = "rgba(255, 0, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.fillRect(batteryX, batteryY, 40, 25)
    ctx.strokeRect(batteryX, batteryY, 40, 25)

    // Battery fill
    const fillWidth = (batteryLevel / 100) * 36
    ctx.fillStyle =
      batteryLevel > 50
        ? "rgba(0, 255, 100, 0.8)"
        : batteryLevel > 20
          ? "rgba(255, 191, 0, 0.8)"
          : "rgba(255, 0, 0, 0.8)"
    ctx.fillRect(batteryX + 2, batteryY + 2, fillWidth, 21)
  }, [sunPosition, batteryLevel, pvSystemOn, energyFlowOffset])

  return (
    <div className="glass-card rounded-2xl p-6 neon-glow-cyan relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-amber" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 3D Visualization Area */}
        <div className="flex-1 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                DIGITAL TWIN
              </h2>
              <p className="text-xs text-muted-foreground">Real-time energy flow visualization</p>
            </div>
            <Button
              onClick={onToggleSystem}
              className={`${pvSystemOn ? "bg-neon-cyan hover:bg-neon-cyan/80 text-background" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
            >
              <Power className="h-4 w-4 mr-2" />
              {pvSystemOn ? "SYSTEM ON" : "SYSTEM OFF"}
            </Button>
          </div>

          <div className="relative bg-gradient-to-b from-background/50 to-background rounded-xl overflow-hidden h-[250px]">
            <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />

            {/* Overlay indicators */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Sun className="h-4 w-4 text-neon-amber" />
                <span className="text-neon-amber">Solar Input</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Battery className="h-4 w-4 text-neon-magenta" />
                <span className="text-neon-magenta">Battery Storage</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Home className="h-4 w-4 text-neon-cyan" />
                <span className="text-neon-cyan">Home Consumption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="w-full lg:w-64 space-y-4">
          <div className="glass-card rounded-xl p-4 border border-neon-cyan/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-neon-cyan" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Power Output</span>
            </div>
            <p className="text-3xl font-bold font-mono text-neon-cyan" style={{ fontFamily: "var(--font-display)" }}>
              {powerOutput}W
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 border border-neon-magenta/20">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4 text-neon-magenta" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Battery Level</span>
            </div>
            <p className="text-3xl font-bold font-mono text-neon-magenta" style={{ fontFamily: "var(--font-display)" }}>
              {batteryLevel}%
            </p>
            <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-magenta to-neon-cyan transition-all duration-500"
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-neon-amber/20">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-neon-amber" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Sun Position</span>
            </div>
            <p className="text-sm font-mono text-neon-amber">
              {sunPosition.y > 0 ? `${Math.round(sunPosition.y * 100)}% elevation` : "Below horizon"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
