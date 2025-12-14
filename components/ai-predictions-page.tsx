"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sun, CloudRain, Cloud, TrendingUp, Clock } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const forecastData = [
  { hour: "Now", predicted: 280, actual: 280 },
  { hour: "+1h", predicted: 320, actual: null },
  { hour: "+2h", predicted: 350, actual: null },
  { hour: "+3h", predicted: 280, actual: null },
  { hour: "+4h", predicted: 200, actual: null },
  { hour: "+5h", predicted: 120, actual: null },
  { hour: "+6h", predicted: 50, actual: null },
]

const weatherForecast = [
  { time: "14:00", icon: Sun, temp: 32, condition: "Sunny" },
  { time: "16:00", icon: Cloud, temp: 30, condition: "Partly Cloudy" },
  { time: "18:00", icon: CloudRain, temp: 27, condition: "Light Rain" },
]

export function AIPredictionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prédictions IA</h1>
        <p className="text-muted-foreground">Prévisions et recommandations basées sur l'apprentissage automatique</p>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-energy-green/20 text-energy-green">
                Haute Confiance
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Prévision de Production</h3>
            <p className="text-3xl font-bold text-energy-green mb-1">1.8 kWh</p>
            <p className="text-sm text-muted-foreground">Attendue dans les 6 prochaines heures</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-energy-yellow/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-energy-yellow" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-energy-yellow/20 text-energy-yellow">
                Avertissement
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Réserve d'Énergie</h3>
            <p className="text-3xl font-bold text-energy-yellow mb-1">4.5h</p>
            <p className="text-sm text-muted-foreground">Jusqu'à épuisement de la batterie au taux actuel</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-chart-4/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-4" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-chart-4/20 text-chart-4">Recommandation</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Mode Optimal</h3>
            <p className="text-3xl font-bold text-chart-4 mb-1">Mode Éco</p>
            <p className="text-sm text-muted-foreground">Faible production attendue demain</p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Prévision de Production 6 Heures
            </CardTitle>
            <span className="text-xs text-muted-foreground">Modèle IA - Dataset Kaggle</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                <XAxis dataKey="hour" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickFormatter={(v) => `${v}W`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.14 0.005 260)",
                    border: "1px solid oklch(0.25 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="oklch(0.75 0.2 145)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#predictedGradient)"
                  name="Prédit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weather Forecast */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-energy-yellow" />
              Analyse d'Impact Météo
            </CardTitle>
            <span className="text-xs text-muted-foreground">Source : API OpenWeatherMap</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {weatherForecast.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="p-4 rounded-xl bg-secondary/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-energy-yellow/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-energy-yellow" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                    <p className="font-semibold text-foreground">{item.condition}</p>
                    <p className="text-lg font-bold text-foreground">{item.temp}°C</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
