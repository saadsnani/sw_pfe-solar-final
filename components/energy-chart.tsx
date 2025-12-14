"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { BarChart3 } from "lucide-react"

const data = [
  { time: "06:00", production: 50, consumption: 200 },
  { time: "08:00", production: 180, consumption: 250 },
  { time: "10:00", production: 320, consumption: 300 },
  { time: "12:00", production: 380, consumption: 280 },
  { time: "14:00", production: 350, consumption: 420 },
  { time: "16:00", production: 280, consumption: 380 },
  { time: "18:00", production: 120, consumption: 450 },
  { time: "20:00", production: 0, consumption: 380 },
]

export function EnergyChart() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Production vs Consumption
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.15 60)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.7 0.15 60)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
              <XAxis dataKey="time" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} />
              <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} tickFormatter={(value) => `${value}W`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0.005 260)",
                  border: "1px solid oklch(0.25 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                labelStyle={{ color: "oklch(0.65 0 0)" }}
              />
              <Area
                type="monotone"
                dataKey="production"
                stroke="oklch(0.75 0.2 145)"
                strokeWidth={2}
                fill="url(#productionGradient)"
                name="Production"
              />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="oklch(0.7 0.15 60)"
                strokeWidth={2}
                fill="url(#consumptionGradient)"
                name="Consumption"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-green" />
            <span className="text-sm text-muted-foreground">Production</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-energy-yellow" />
            <span className="text-sm text-muted-foreground">Consumption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
