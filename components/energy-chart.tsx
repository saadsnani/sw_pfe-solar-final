"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { BarChart3, AlertCircle } from "lucide-react"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface EnergyChartProps {
  sensors?: SystemSensorsState
  historicalData?: Array<{ time: string; production: number | null; consumption: number | null }>
}

function EnergyChartComponent({ sensors, historicalData }: EnergyChartProps) {
  // Use historical data if provided, otherwise show empty state or current data
  const hasData = historicalData && historicalData.length > 0
  const hasCurrentSensors = (sensors?.production.connected && sensors?.production.value !== null) ||
                            (sensors?.consumption.connected && sensors?.consumption.value !== null)

  // Create single data point from current sensors
  const currentData = hasCurrentSensors
    ? [
        {
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          production: sensors?.production.value ?? null,
          consumption: sensors?.consumption.value ?? null,
        },
      ]
    : []

  const displayData = hasData ? historicalData : currentData

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[22px] font-bold">
          <BarChart3 className="w-5 h-5 text-primary" />
          Prévision de Production
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayData.length === 0 ? (
          <div className="h-[400px] sm:h-[500px] flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Connectez les capteurs pour voir les données</p>
            </div>
          </div>
        ) : (
          <div className="h-[400px] sm:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="oklch(0.75 0.2 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" strokeWidth={1.5} />
                <XAxis dataKey="time" stroke="oklch(0.65 0 0)" fontSize={14} tickLine={false} height={50} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={14} tickLine={false} tickFormatter={(value) => `${value}W`} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.14 0.005 260)",
                    border: "1px solid oklch(0.25 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                  labelStyle={{ color: "oklch(0.65 0 0)" }}
                  formatter={(value) => value !== null ? `${value.toFixed(2)}W` : 'Non connecté'}
                />
                {sensors?.production.connected && (
                  <Area
                    type="monotone"
                    dataKey="production"
                    stroke="oklch(0.75 0.2 145)"
                    strokeWidth={3}
                    fill="url(#productionGradient)"
                    name="Production"
                    isAnimationActive={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex items-center justify-center gap-6 mt-4">
          {sensors?.production.connected && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-energy-green" />
              <span className="text-sm text-muted-foreground">Production</span>
            </div>
          )}
          {displayData.length === 0 && (
            <span className="text-xs text-muted-foreground">Aucune donnée disponible</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const EnergyChart = memo(EnergyChartComponent)
