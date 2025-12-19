"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Thermometer } from "lucide-react"

interface BatteryReading {
  batteryTemperature?: number
  timestamp: string
}

export function BatteryTemperatureCard() {
  const [batteryTemp, setBatteryTemp] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    // Fetch battery temperature on mount
    fetchBatteryData()

    // Poll every 3 seconds for new data
    const interval = setInterval(fetchBatteryData, 3000)

    return () => clearInterval(interval)
  }, [])

  const fetchBatteryData = async () => {
    try {
      const response = await fetch("/api/sensor-data?type=battery")
      const data = await response.json()

      if (data.current && data.current.batteryTemperature !== undefined) {
        setBatteryTemp(data.current.batteryTemperature)
        setIsConnected(true)
        
        // Format timestamp
        const date = new Date(data.current.timestamp)
        setLastUpdate(date.toLocaleTimeString("fr-FR"))
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error("Error fetching battery temperature:", error)
      setIsConnected(false)
    }
  }

  const getStatusColor = (temp: number | null) => {
    if (!temp) return "text-muted-foreground"
    if (temp < 20) return "text-blue-500"
    if (temp < 40) return "text-green-500"
    if (temp < 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusLabel = (temp: number | null) => {
    if (!temp) return "Déconnecté"
    if (temp < 20) return "Froid"
    if (temp < 40) return "Normal"
    if (temp < 60) return "Chaud"
    return "Critique"
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Battery className="w-5 h-5" />
          Température Batterie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <div className={`text-4xl font-bold ${getStatusColor(batteryTemp)}`}>
            {batteryTemp !== null ? batteryTemp.toFixed(1) : "--"}
          </div>
          <div className="text-2xl text-muted-foreground">°C</div>
        </div>

        <div className="flex items-center gap-2">
          <Thermometer className={`w-4 h-4 ${getStatusColor(batteryTemp)}`} />
          <span className={`text-sm font-medium ${getStatusColor(batteryTemp)}`}>
            {getStatusLabel(batteryTemp)}
          </span>
          {isConnected && (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          )}
        </div>

        {lastUpdate && (
          <div className="text-xs text-muted-foreground">
            Mise à jour: {lastUpdate}
          </div>
        )}

        {!isConnected && (
          <div className="text-xs text-red-500 font-medium">
            ⚠️ Capteur déconnecté
          </div>
        )}
      </CardContent>
    </Card>
  )
}
