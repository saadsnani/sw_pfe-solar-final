import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Battery, Sun, Lightbulb } from "lucide-react"

interface AiPredictionsProps {
  batteryLevel: number
  currentProduction: number
}

export default function AiPredictions({ batteryLevel, currentProduction }: AiPredictionsProps) {
  const predictions = [
    {
      title: "SOC Prediction (24h)",
      value: `${Math.min(100, batteryLevel + 15)}%`,
      trend: "+15%",
      description: "Expected battery level tomorrow morning",
      icon: Battery,
    },
    {
      title: "Production Forecast",
      value: `${(currentProduction * 1.2).toFixed(1)} kWh`,
      trend: "+20%",
      description: "Sunny weather expected tomorrow",
      icon: Sun,
    },
  ]

  const recommendations = [
    {
      priority: "high",
      message: "Optimal time to run heavy appliances: 10:00 - 14:00",
    },
    {
      priority: "medium",
      message: "Consider reducing evening consumption to preserve battery",
    },
    {
      priority: "low",
      message: "System efficiency is above average - no action needed",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-primary/20 text-primary border-primary/30"
      case "medium":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      default:
        return "bg-accent/20 text-accent border-accent/30"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Predictions Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Predictions
          </CardTitle>
          <CardDescription>Machine learning forecasts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((pred) => (
            <div key={pred.title} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <pred.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{pred.title}</span>
                </div>
                <Badge variant="outline" className="text-accent border-accent/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {pred.trend}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{pred.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{pred.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      rec.priority === "high" ? "bg-primary" : rec.priority === "medium" ? "bg-chart-3" : "bg-accent"
                    }`}
                  />
                </div>
                <p className="text-sm">{rec.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
