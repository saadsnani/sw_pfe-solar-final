"use client"

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Clock, Battery, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample data
const autonomyData = [
  { hour: 0, batteryLevel: 95, consumption: 120 },
  { hour: 6, batteryLevel: 88, consumption: 95 },
  { hour: 12, batteryLevel: 92, consumption: 250 },
  { hour: 18, batteryLevel: 85, consumption: 380 },
  { hour: 24, batteryLevel: 72, consumption: 320 },
  { hour: 30, batteryLevel: 58, consumption: 450 },
  { hour: 36, batteryLevel: 42, consumption: 400 },
  { hour: 42, batteryLevel: 28, consumption: 380 },
  { hour: 48, batteryLevel: 15, consumption: 350 },
]

export function AutonomyEstimation() {
  const currentBattery = 95
  const dailyConsumption = 2850 // Wh
  const batteryCapacity = 10000 // Wh
  const estimatedDays = (currentBattery / 100) * batteryCapacity / dailyConsumption
  const estimatedHours = estimatedDays * 24

  const statusColor = estimatedDays >= 2 ? "text-green-500" : estimatedDays >= 1 ? "text-yellow-500" : "text-red-500"
  const statusBg = estimatedDays >= 2 ? "bg-green-500/10" : estimatedDays >= 1 ? "bg-yellow-500/10" : "bg-red-500/10"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Battery className="w-6 h-6 text-green-500" />
          Estimation de l'Autonomie
        </h1>
        <p className="text-muted-foreground">Durée d'autonomie estimée du système sans apport solaire</p>
      </div>

      {/* Alert */}
      {estimatedDays < 1 && (
        <Alert className={`${statusBg} border-red-500/30`}>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500">
            L'autonomie est inférieure à 24 heures. Recharge solaire recommandée.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-4 bg-card border border-border ${statusBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Autonomie estimée</p>
              <p className={`text-3xl font-bold ${statusColor}`}>
                {estimatedDays.toFixed(1)} jours
              </p>
              <p className="text-xs text-muted-foreground mt-1">({Math.round(estimatedHours)} heures)</p>
            </div>
            <Clock className={`w-8 h-8 ${statusColor} opacity-20`} />
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Capacité batterie</p>
              <p className="text-2xl font-bold text-foreground">{batteryCapacity / 1000} kWh</p>
            </div>
            <Battery className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consommation quotidienne</p>
              <p className="text-2xl font-bold text-foreground">{dailyConsumption} Wh</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Autonomy Projection Chart */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Projection du niveau de batterie (sans apport solaire)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={autonomyData}>
            <defs>
              <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="hour" stroke="#666" label={{ value: "Heures", position: "insideBottom", offset: -5 }} />
            <YAxis stroke="#666" label={{ value: "Niveau batterie (%)", angle: -90, position: "insideLeft" }} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => {
                if (typeof value === "number") return [`${value.toFixed(0)}%`, "Batterie"]
                return value
              }}
            />
            <Area type="monotone" dataKey="batteryLevel" stroke="#10b981" fill="url(#colorBattery)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Battery Health */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">État de la batterie</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Charge actuelle</span>
                <span className="text-sm font-semibold text-foreground">{currentBattery}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${currentBattery}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Santé batterie</p>
                <p className="text-lg font-bold text-green-500">98%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cycles</p>
                <p className="text-lg font-bold text-foreground">145</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recommandations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs mt-0.5">✓</div>
              <div>
                <p className="text-sm font-medium text-foreground">Autonomie suffisante</p>
                <p className="text-xs text-muted-foreground">Votre système peut fonctionner sans soleil pendant {estimatedDays.toFixed(1)} jours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs mt-0.5">i</div>
              <div>
                <p className="text-sm font-medium text-foreground">Optimisation possible</p>
                <p className="text-xs text-muted-foreground">Réduire la consommation en heures creuses pour augmenter l'autonomie</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs mt-0.5">!</div>
              <div>
                <p className="text-sm font-medium text-foreground">Mise à jour batterie</p>
                <p className="text-xs text-muted-foreground">Prévoir une maintenance annuelle de la batterie</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
