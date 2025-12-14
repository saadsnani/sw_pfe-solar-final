"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface EnergyChartProps {
  data: Array<{
    hour: string
    production: number
    consumption: number
  }>
}

export default function EnergyChart({ data }: EnergyChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(45, 90%, 55%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(45, 90%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(145, 70%, 50%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(145, 70%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="hour"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            tickFormatter={(value) => `${value}W`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [`${value.toFixed(0)}W`]}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => (
              <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
                {value === "production" ? "Production PV" : "Consommation"}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="production"
            stroke="hsl(45, 90%, 55%)"
            strokeWidth={2}
            fill="url(#productionGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "hsl(45, 90%, 55%)" }}
          />
          <Area
            type="monotone"
            dataKey="consumption"
            stroke="hsl(145, 70%, 50%)"
            strokeWidth={2}
            fill="url(#consumptionGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "hsl(145, 70%, 50%)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
