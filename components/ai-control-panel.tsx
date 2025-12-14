"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Battery, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface AIDecision {
  action: "charge" | "discharge" | "hold"
  reason: string
  confidence: number
  timestamp: Date
}

interface EnergyFlow {
  solarProduction: number
  batterySOC: number
  consumption: number
  weatherScore: number
}

export default function AIControlPanel() {
  const [aiMode, setAiMode] = useState<"active" | "standby">("active")
  const [currentDecision, setCurrentDecision] = useState<AIDecision>({
    action: "charge",
    reason: "Production solaire élevée détectée. Optimisation du stockage d'énergie.",
    confidence: 94,
    timestamp: new Date(),
  })
  
  const [energyFlow, setEnergyFlow] = useState<EnergyFlow>({
    solarProduction: 3.2,
    batterySOC: 67,
    consumption: 1.8,
    weatherScore: 85,
  })

  const [recentDecisions, setRecentDecisions] = useState<AIDecision[]>([])

  // Simulate AI decision making every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate changing conditions
      const newProduction = 1.5 + Math.random() * 3
      const newConsumption = 1.2 + Math.random() * 2
      const newSOC = Math.max(20, Math.min(95, energyFlow.batterySOC + (Math.random() - 0.5) * 5))
      const newWeatherScore = 60 + Math.random() * 35

      setEnergyFlow({
        solarProduction: parseFloat(newProduction.toFixed(1)),
        batterySOC: parseFloat(newSOC.toFixed(0)),
        consumption: parseFloat(newConsumption.toFixed(1)),
        weatherScore: parseFloat(newWeatherScore.toFixed(0)),
      })

      // AI Decision Logic
      let action: "charge" | "discharge" | "hold"
      let reason: string
      let confidence: number

      const surplus = newProduction - newConsumption
      const needsCharging = newSOC < 80
      const canDischarge = newSOC > 30

      if (surplus > 0.5 && needsCharging) {
        action = "charge"
        reason = `Surplus de ${surplus.toFixed(1)} kW disponible. Stockage prioritaire pour la nuit.`
        confidence = 85 + Math.random() * 10
      } else if (surplus < -0.3 && canDischarge) {
        action = "discharge"
        reason = `Demande supérieure à la production. Décharge batterie pour compenser le déficit.`
        confidence = 80 + Math.random() * 15
      } else {
        action = "hold"
        reason = "Équilibre optimal atteint. Maintien de l'état actuel du système."
        confidence = 70 + Math.random() * 15
      }

      const newDecision: AIDecision = {
        action,
        reason,
        confidence: parseFloat(confidence.toFixed(0)),
        timestamp: new Date(),
      }

      setCurrentDecision(newDecision)
      setRecentDecisions((prev) => [newDecision, ...prev].slice(0, 5))
    }, 5000)

    return () => clearInterval(interval)
  }, [energyFlow])

  const getActionColor = (action: string) => {
    switch (action) {
      case "charge":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "discharge":
        return "bg-orange-500/20 text-orange-600 border-orange-500/30"
      case "hold":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30"
      default:
        return ""
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "charge":
        return <TrendingUp className="h-4 w-4" />
      case "discharge":
        return <Zap className="h-4 w-4" />
      case "hold":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "charge":
        return "Charge Active"
      case "discharge":
        return "Décharge Active"
      case "hold":
        return "Maintien"
      default:
        return ""
    }
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
            Contrôle IA - Gestion Intelligente
          </CardTitle>
          <Badge variant={aiMode === "active" ? "default" : "secondary"} className="gap-1">
            <div className={`h-2 w-2 rounded-full ${aiMode === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            {aiMode === "active" ? "Actif" : "Standby"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current AI Decision */}
        <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className={`${getActionColor(currentDecision.action)} font-medium`}>
                {getActionIcon(currentDecision.action)}
                {getActionLabel(currentDecision.action)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentDecision.confidence}% confiance
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {currentDecision.timestamp.toLocaleTimeString("fr-FR")}
            </span>
          </div>
          
          <p className="text-sm text-foreground/90 leading-relaxed">
            <AlertCircle className="h-4 w-4 inline mr-1 text-purple-500" />
            {currentDecision.reason}
          </p>

          {/* Confidence Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Niveau de confiance</span>
              <span className="font-medium">{currentDecision.confidence}%</span>
            </div>
            <Progress value={currentDecision.confidence} className="h-2" />
          </div>
        </div>

        {/* Energy Flow Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Production PV</span>
            </div>
            <p className="text-lg font-bold text-foreground">{energyFlow.solarProduction} kW</p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Battery className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">SOC Batterie</span>
            </div>
            <p className="text-lg font-bold text-foreground">{energyFlow.batterySOC}%</p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Consommation</span>
            </div>
            <p className="text-lg font-bold text-foreground">{energyFlow.consumption} kW</p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Score Météo</span>
            </div>
            <p className="text-lg font-bold text-foreground">{energyFlow.weatherScore}%</p>
          </div>
        </div>

        {/* Recent Decisions Log */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Historique des décisions (5 dernières)
          </h4>
          <div className="space-y-2">
            {recentDecisions.slice(0, 5).map((decision, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getActionColor(decision.action)} text-xs`}>
                    {getActionLabel(decision.action)}
                  </Badge>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {decision.reason.split(".")[0]}...
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {decision.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Info Footer */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            🤖 Système IA basé sur algorithmes d'optimisation énergétique
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
