"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BatteryReading {
  batteryTemperature?: number
  timestamp: string
}

interface ChartData {
  time: string
  temperature: number
}

export function BatteryTemperatureChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [stats, setStats] = useState({
    current: 0,
    min: 0,
    max: 0,
    average: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBatteryData()

    // Refresh every 5 seconds
    const interval = setInterval(fetchBatteryData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchBatteryData = async () => {
    try {
      const response = await fetch("/api/sensor-data?type=battery")
      const data = await response.json()

      if (data.readings && Array.isArray(data.readings)) {
        // Format data for chart (last 20 readings)
        const formattedData = data.readings.slice(-20).map((reading: BatteryReading) => {
          const date = new Date(reading.timestamp)
          const time = date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })
          return {
            time,
            temperature: reading.batteryTemperature || 0,
          }
        })

        setChartData(formattedData)

        // Calculate stats
        if (data.readings.length > 0) {
          const temps = data.readings
            .map((r: BatteryReading) => r.batteryTemperature || 0)
            .filter((t: number) => t > 0)

          if (temps.length > 0) {
            const min = Math.min(...temps)
            const max = Math.max(...temps)
            const average = temps.reduce((a: number, b: number) => a + b, 0) / temps.length
            const current = data.current?.batteryTemperature || 0

            setStats({
              current,
              min: Math.round(min * 10) / 10,
              max: Math.round(max * 10) / 10,
              average: Math.round(average * 10) / 10,
            })
          }
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching battery data:", error)
      setIsLoading(false)
    }
  }

  const getTrendIcon = () => {
    if (chartData.length < 2) return null

    const lastIndex = chartData.length - 1
    const lastValue = chartData[lastIndex].temperature
    const previousValue = chartData[lastIndex - 1].temperature

    if (lastValue > previousValue) {
      return <TrendingUp className="w-4 h-4 text-red-500" />
    } else if (lastValue < previousValue) {
      return <TrendingDown className="w-4 h-4 text-green-500" />
    }
    return null
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5" />
            Historique Température Batterie
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] sm:h-[500px] flex items-center justify-center">
          <div className="text-muted-foreground text-lg">Chargement...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="w-5 h-5" />
          Historique Température Batterie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary/50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Actuelle</div>
            <div className="text-xl font-bold text-primary">
              {stats.current.toFixed(1)}°C
            </div>
            {getTrendIcon()}
          </div>

          <div className="bg-secondary/50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Minimum</div>
            <div className="text-xl font-bold text-blue-500">
              {stats.min.toFixed(1)}°C
            </div>
          </div>

          <div className="bg-secondary/50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Moyenne</div>
            <div className="text-xl font-bold text-green-500">
              {stats.average.toFixed(1)}°C
            </div>
          </div>

          <div className="bg-secondary/50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Maximum</div>
            <div className="text-xl font-bold text-red-500">
              {stats.max.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="w-full h-[400px] sm:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" strokeWidth={1.5} />
                <XAxis
                  dataKey="time"
                  stroke="rgb(156, 163, 175)"
                  style={{ fontSize: "14px" }}
                  height={50}
                />
                <YAxis
                  stroke="rgb(156, 163, 175)"
                  domain={["dataMin - 5", "dataMax + 5"]}
                  style={{ fontSize: "14px" }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(31, 41, 55)",
                    border: "1px solid rgb(75, 85, 99)",
                    borderRadius: "8px",
                    color: "rgb(229, 231, 235)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] sm:h-[500px] flex items-center justify-center bg-secondary/50 rounded-lg">
            <div className="text-muted-foreground text-lg">Aucune donnée disponible</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
