"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"

interface BatteryChartProps {
  data: Array<{
    hour: string
    soc: number
    voltage: string
  }>
}

export default function BatteryChart({ data }: BatteryChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="hour"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            interval={3}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <ReferenceLine
            y={20}
            stroke="hsl(var(--destructive))"
            strokeDasharray="5 5"
            label={{
              value: "Seuil critique",
              fill: "hsl(var(--destructive))",
              fontSize: 10,
              position: "insideTopRight",
            }}
          />
          <ReferenceLine
            y={80}
            stroke="hsl(145, 70%, 50%)"
            strokeDasharray="5 5"
            label={{
              value: "Charge optimale",
              fill: "hsl(145, 70%, 50%)",
              fontSize: 10,
              position: "insideBottomRight",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
            formatter={(value: number, name: string) => [
              name === "soc" ? `${value}%` : `${value}V`,
              name === "soc" ? "État de charge" : "Tension",
            ]}
          />
          <Line
            type="monotone"
            dataKey="soc"
            stroke="hsl(145, 70%, 50%)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "hsl(145, 70%, 50%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
