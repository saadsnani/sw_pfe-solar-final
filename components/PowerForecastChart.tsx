"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Brain } from "lucide-react"

type ForecastPoint = {
  time: string
  real: number | null
  prediction: number | null
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00")

function gaussian(x: number, mu: number, sigma: number) {
  return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)))
}

function generatePredictionData(): ForecastPoint[] {
  const peakPower = 300
  const startHour = 6
  const endHour = 19
  const peakHour = 12
  const sigma = 2.3

  return hours.map((label, idx) => {
    const hour = idx
    const isDay = hour >= startHour && hour <= endHour
    const base = isDay ? peakPower * gaussian(hour, peakHour, sigma) : 0
    const noise = isDay ? (Math.random() - 0.5) * 20 : 0
    const prediction = Math.max(0, base + noise)

    const realNoise = isDay ? (Math.random() - 0.5) * 30 : 0
    const real = Math.max(0, base + realNoise)

    return {
      time: label,
      real: hour <= new Date().getHours() ? real : null,
      prediction,
    }
  })
}

export function PowerForecastChart() {
  const data = useMemo(() => generatePredictionData(), [])

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[22px] font-bold">
          <Brain className="w-5 h-5 text-primary" />
          AI Forecasting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}W`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
                formatter={(value) => (value !== null ? `${value.toFixed(0)}W` : "--")}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="real"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                name="Real Production"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#facc15"
                strokeWidth={2}
                strokeDasharray="6 6"
                dot={false}
                name="AI Prediction"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}