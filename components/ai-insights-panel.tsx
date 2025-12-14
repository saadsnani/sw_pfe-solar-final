"use client"

import { Brain, AlertTriangle, CheckCircle, Lightbulb, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InsightProps {
  type: "warning" | "success" | "info" | "prediction"
  message: string
}

function Insight({ type, message }: InsightProps) {
  const icons = {
    warning: <AlertTriangle className="w-4 h-4 text-energy-yellow" />,
    success: <CheckCircle className="w-4 h-4 text-energy-green" />,
    info: <Lightbulb className="w-4 h-4 text-chart-4" />,
    prediction: <TrendingUp className="w-4 h-4 text-primary" />,
  }

  const backgrounds = {
    warning: "bg-energy-yellow/10 border-energy-yellow/20",
    success: "bg-energy-green/10 border-energy-green/20",
    info: "bg-chart-4/10 border-chart-4/20",
    prediction: "bg-primary/10 border-primary/20",
  }

  return (
    <div className={`p-3 rounded-xl border ${backgrounds[type]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[type]}</div>
        <p className="text-sm text-foreground/90">{message}</p>
      </div>
    </div>
  )
}

export function AIInsightsPanel() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Analyses IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Insight
          type="prediction"
          message="Prédiction : Faible production prévue demain en raison de la couverture nuageuse. Mode Éco recommandé."
        />
        <Insight type="success" message="La batterie sera complètement chargée dans environ 45 minutes." />
        <Insight
          type="warning"
          message="Attention : Efficacité des panneaux réduite de 5%. Envisagez de nettoyer les panneaux."
        />
        <Insight
          type="info"
          message="Astuce : Déplacez les appareils à forte consommation vers 11h00-14h00 pour un usage solaire optimal."
        />
        <div className="pt-3 mt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Modèle IA entraîné sur Dataset Kaggle / Historique Local
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
