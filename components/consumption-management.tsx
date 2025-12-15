"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card } from "@/components/ui/card"
import { Zap, TrendingDown } from "lucide-react"

// Sample data - will be replaced with real API data
const consumptionData = [
  { time: "00:00", consumption: 120 },
  { time: "04:00", consumption: 95 },
  { time: "08:00", consumption: 250 },
  { time: "12:00", consumption: 380 },
  { time: "16:00", consumption: 320 },
  { time: "20:00", consumption: 450 },
  { time: "23:59", consumption: 150 },
]

const deviceConsumption = [
  { name: "Chauffage", value: 35, color: "#ff6b6b" },
  { name: "Éclairage", value: 20, color: "#4ecdc4" },
  { name: "Électroménagers", value: 30, color: "#95e1d3" },
  { name: "Climatisation", value: 15, color: "#ffd93d" },
]

const monthlyData = [
  { month: "Jan", consumption: 2400 },
  { month: "Fév", consumption: 2210 },
  { month: "Mar", consumption: 2290 },
  { month: "Avr", consumption: 2000 },
  { month: "Mai", consumption: 2181 },
  { month: "Jun", consumption: 2500 },
  { month: "Jul", consumption: 2100 },
]

export function ConsumptionManagement() {
  const totalDayConsumption = consumptionData.reduce((sum, item) => sum + item.consumption, 0)
  const avgConsumption = Math.round(totalDayConsumption / consumptionData.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Gestion de la Consommation
        </h1>
        <p className="text-muted-foreground">Suivi détaillé de votre consommation énergétique</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consommation aujourd'hui</p>
              <p className="text-2xl font-bold text-foreground">{Math.round(totalDayConsumption)} Wh</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consommation moyenne</p>
              <p className="text-2xl font-bold text-foreground">{avgConsumption} W</p>
            </div>
            <TrendingDown className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pic de consommation</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.max(...consumptionData.map((d) => d.consumption))} W
              </p>
            </div>
            <Zap className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Hourly Consumption Chart */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Consommation par heure</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={consumptionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              labelStyle={{ color: "#fff" }}
            />
            <Line type="monotone" dataKey="consumption" stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24" }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Consumption Pie */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Consommation par appareil</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceConsumption}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceConsumption.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Consumption Bar */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Consommation mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="consumption" fill="#4ecdc4" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Device List */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Appareils actifs</h3>
        <div className="space-y-3">
          {deviceConsumption.map((device) => (
            <div key={device.name} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: device.color }}></div>
                <span className="text-foreground font-medium">{device.name}</span>
              </div>
              <span className="text-muted-foreground text-sm">{device.value}% de la consommation</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
