"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calendar, Zap } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const weeklyData = [
  { day: "Lun", production: 2.4, consumption: 3.2 },
  { day: "Mar", production: 3.1, consumption: 2.8 },
  { day: "Mer", production: 2.8, consumption: 3.5 },
  { day: "Jeu", production: 3.5, consumption: 3.0 },
  { day: "Ven", production: 2.9, consumption: 2.6 },
  { day: "Sam", production: 3.8, consumption: 4.2 },
  { day: "Dim", production: 4.2, consumption: 3.8 },
]

const monthlyData = [
  { week: "S1", efficiency: 85 },
  { week: "S2", efficiency: 88 },
  { week: "S3", efficiency: 82 },
  { week: "S4", efficiency: 91 },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyses & Rapports</h1>
        <p className="text-muted-foreground">Données historiques et métriques de performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-energy-green/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-energy-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Production Totale</p>
                <p className="text-2xl font-bold text-foreground">22.7 kWh</p>
                <p className="text-xs text-energy-green">+12% par rapport à la semaine dernière</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-energy-yellow/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-energy-yellow" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consommation Totale</p>
                <p className="text-2xl font-bold text-foreground">23.1 kWh</p>
                <p className="text-xs text-energy-yellow">+5% par rapport à la semaine dernière</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Efficacité Moy.</p>
                <p className="text-2xl font-bold text-foreground">86.5%</p>
                <p className="text-xs text-muted-foreground">Moyenne du système</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-chart-4/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibilité</p>
                <p className="text-2xl font-bold text-foreground">99.2%</p>
                <p className="text-xs text-muted-foreground">30 derniers jours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Flux d'Énergie Hebdomadaire (kWh)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                  <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0.005 260)",
                      border: "1px solid oklch(0.25 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Bar dataKey="production" fill="oklch(0.75 0.2 145)" radius={[4, 4, 0, 0]} name="Production" />
                  <Bar dataKey="consumption" fill="oklch(0.7 0.15 60)" radius={[4, 4, 0, 0]} name="Consommation" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Tendance d'Efficacité Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                  <XAxis dataKey="week" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0.005 260)",
                      border: "1px solid oklch(0.25 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    formatter={(value) => [`${value}%`, "Efficacité"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke="oklch(0.75 0.2 145)"
                    strokeWidth={2}
                    fill="url(#efficiencyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
