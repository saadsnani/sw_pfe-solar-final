"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TreePine, Wind, Zap, TrendingUp, Award } from "lucide-react"

interface EcoScoreProps {
  energyProduced: number
  batteryLevel: number
}

export default function EcoScore({ energyProduced, batteryLevel }: EcoScoreProps) {
  const [score, setScore] = useState(0)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [co2Saved, setCo2Saved] = useState(0)
  const [treesEquivalent, setTreesEquivalent] = useState(0)

  useEffect(() => {
    // Calculate eco score based on energy and battery performance
    const energyScore = Math.min(energyProduced * 10, 40)
    const batteryScore = batteryLevel * 0.5
    const efficiencyBonus = energyProduced > 3 ? 10 : 0
    const calculatedScore = Math.min(Math.round(energyScore + batteryScore + efficiencyBonus), 100)

    setScore(calculatedScore)
    setCo2Saved(Math.round(energyProduced * 0.5 * 10) / 10) // kg CO2 per kWh
    setTreesEquivalent(Math.round(energyProduced * 0.02 * 10) / 10) // Trees equivalent
  }, [energyProduced, batteryLevel])

  useEffect(() => {
    // Animate score counter
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const getScoreColor = () => {
    if (score >= 90) return "text-accent"
    if (score >= 70) return "text-primary"
    if (score >= 50) return "text-yellow-500"
    return "text-destructive"
  }

  const getScoreGradient = () => {
    if (score >= 90) return "from-accent/30 to-accent/5"
    if (score >= 70) return "from-primary/30 to-primary/5"
    if (score >= 50) return "from-yellow-500/30 to-yellow-500/5"
    return "from-destructive/30 to-destructive/5"
  }

  const getScoreRing = () => {
    if (score >= 90) return "stroke-accent"
    if (score >= 70) return "stroke-primary"
    if (score >= 50) return "stroke-yellow-500"
    return "stroke-destructive"
  }

  const getFeedback = () => {
    if (score >= 90) return { text: "Excellent - Panneaux Propres", icon: Award, color: "text-accent" }
    if (score >= 70) return { text: "Très Bien - Système Optimal", icon: TrendingUp, color: "text-primary" }
    if (score >= 50) return { text: "Bon - Surveillance Active", icon: Leaf, color: "text-yellow-500" }
    return { text: "Maintenance Requise", icon: Wind, color: "text-destructive" }
  }

  const feedback = getFeedback()
  const FeedbackIcon = feedback.icon

  // Calculate stroke dasharray for circular progress
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Leaf className="h-5 w-5 text-accent" />
          Eco-Score Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative">
            <svg width="120" height="120" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={`${getScoreRing()} transition-all duration-1000`}
                style={{
                  strokeDasharray,
                  strokeDashoffset,
                }}
              />
            </svg>
            {/* Score display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor()}`}>{animatedScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            {/* Glow effect */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-radial ${getScoreGradient()} blur-xl opacity-50`}
            />
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border/30">
              <div className="p-2 rounded-full bg-accent/20">
                <Wind className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CO2 Évité</p>
                <p className="text-sm font-semibold">{co2Saved} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border/30">
              <div className="p-2 rounded-full bg-accent/20">
                <TreePine className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Arbres Équivalent</p>
                <p className="text-sm font-semibold">{treesEquivalent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        <div className={`mt-4 p-3 rounded-lg bg-gradient-to-r ${getScoreGradient()} border border-border/30`}>
          <div className="flex items-center gap-2">
            <FeedbackIcon className={`h-5 w-5 ${feedback.color}`} />
            <span className={`text-sm font-medium ${feedback.color}`}>{feedback.text}</span>
          </div>
        </div>

        {/* Energy Stats Bar */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">Production: {energyProduced} kWh</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-accent" />
            <span className="text-muted-foreground">+{Math.round(score * 0.12)}% vs hier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
