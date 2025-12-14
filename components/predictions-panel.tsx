import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Battery, Sun, Clock } from "lucide-react"

interface PredictionsPanelProps {
  currentSoc: number
  currentProduction: number
}

export default function PredictionsPanel({ currentSoc, currentProduction }: PredictionsPanelProps) {
  // Simulated AI predictions based on current values
  const predictions = [
    {
      icon: Battery,
      label: "SOC dans 3h",
      value: `${Math.min(100, currentSoc + 15)}%`,
      confidence: "92%",
      trend: "up",
    },
    {
      icon: Sun,
      label: "Production prévue (14h)",
      value: `${(currentProduction * 1.3).toFixed(0)}W`,
      confidence: "87%",
      trend: "up",
    },
    {
      icon: Clock,
      label: "Temps recharge complète",
      value: currentSoc >= 95 ? "Chargée" : `~${Math.ceil((100 - currentSoc) / 8)}h`,
      confidence: "85%",
      trend: "neutral",
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Prédictions IA
            </CardTitle>
            <CardDescription>Intelligence artificielle embarquée</CardDescription>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
            Actif
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {predictions.map((pred, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <pred.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{pred.label}</p>
                  <p className="text-xs text-muted-foreground">Confiance: {pred.confidence}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-accent">{pred.value}</span>
                {pred.trend === "up" && <TrendingUp className="h-4 w-4 text-accent" />}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Recommandation IA</p>
              <p className="text-xs text-muted-foreground mt-1">
                Conditions optimales pour la charge. Production solaire prévue élevée cet après-midi. Système en mode
                performance recommandé.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
