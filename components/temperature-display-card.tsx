"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface TemperatureReading {
  batteryTemperature?: number
  temperature?: number
  wifiSsid?: string
  sensorError?: boolean
  timestamp: string
}

interface TemperatureDisplayCardProps {
  demoData?: {
    current: TemperatureReading
    readings: TemperatureReading[]
    isConnected?: boolean
    errorMsg?: string
  }
}

export function TemperatureDisplayCard({ demoData }: TemperatureDisplayCardProps) {
  const [batteryTemp, setBatteryTemp] = useState<number | null>(null)
  const [ambientTemp, setAmbientTemp] = useState<number | null>(null)
  const [wifiSsid, setWifiSsid] = useState<string>("")
  const [history, setHistory] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")
  const [errorMsg, setErrorMsg] = useState<string>("")

  useEffect(() => {
    if (!demoData) return

    const current = demoData.current
    const newBatteryTemp = current.batteryTemperature
    const newAmbientTemp = current.temperature
    const hasSensorError = current.sensorError

    if (batteryTemp !== null && newBatteryTemp !== undefined) {
      const diff = newBatteryTemp - batteryTemp
      if (diff > 0.5) setTrend("up")
      else if (diff < -0.5) setTrend("down")
      else setTrend("stable")
    }

    if (hasSensorError) {
      setBatteryTemp(null)
      setErrorMsg(demoData.errorMsg ?? "Capteur déconnecté")
    } else {
      setBatteryTemp(newBatteryTemp ?? null)
      setErrorMsg("")
    }

    setAmbientTemp(newAmbientTemp ?? null)
    setWifiSsid(current.wifiSsid ?? "")

    const readingAge = Date.now() - new Date(current.timestamp).getTime()
    const hasRecentData = readingAge < 30000
    setIsConnected(demoData.isConnected ?? (hasRecentData || Boolean(current.wifiSsid)))

    const date = new Date(current.timestamp)
    setLastUpdate(date.toLocaleTimeString("fr-FR"))

    const chartData = demoData.readings
      .slice(-20)
      .map((reading: TemperatureReading) => ({
        time: new Date(reading.timestamp).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        battery: reading.batteryTemperature ?? null,
        ambient: reading.temperature ?? null,
      }))
      .reverse()

    setHistory(chartData)
  }, [demoData, batteryTemp])

  useEffect(() => {
    if (demoData) return

    fetchTemperatureData()
    const interval = setInterval(fetchTemperatureData, 3000)
    return () => clearInterval(interval)
  }, [demoData])

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("/api/sensor-data?type=all&limit=20", { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      console.log("[TemperatureDisplayCard] API data", data)

      if (data.current) {
        const newBatteryTemp = data.current.batteryTemperature
        const newAmbientTemp = data.current.temperature
        const hasSensorError = data.current.sensorError

        // Calculate trend
        if (batteryTemp !== null && newBatteryTemp !== undefined) {
          const diff = newBatteryTemp - batteryTemp
          if (diff > 0.5) setTrend("up")
          else if (diff < -0.5) setTrend("down")
          else setTrend("stable")
        }

        // If sensor error, set temp to null but keep WiFi connected
        if (hasSensorError) {
          setBatteryTemp(null)
          setErrorMsg("Capteur déconnecté")
        } else {
          setBatteryTemp(newBatteryTemp ?? null)
          setErrorMsg("")
        }
        
        setAmbientTemp(newAmbientTemp ?? null)
        setWifiSsid(data.current.wifiSsid ?? "")
        // اعتبر الاتصال صحيح إلا كانت قراءة جديدة (خلال آخر 30 ثانية)
        const readingAge = Date.now() - new Date(data.current.timestamp).getTime()
        const hasRecentData = readingAge < 30000 // آخر 30 ثانية
        setIsConnected(hasRecentData || Boolean(data.current?.wifiSsid))

        const date = new Date(data.current.timestamp)
        setLastUpdate(date.toLocaleTimeString("fr-FR"))
      }

      // Update history for chart
      if (data.readings && Array.isArray(data.readings)) {
        const chartData = data.readings
          .slice(-20) // Last 20 readings
          .map((reading: TemperatureReading) => ({
            time: new Date(reading.timestamp).toLocaleTimeString("fr-FR", { 
              hour: "2-digit", 
              minute: "2-digit" 
            }),
            battery: reading.batteryTemperature ?? null,
            ambient: reading.temperature ?? null,
          }))
          .reverse()
        
        setHistory(chartData)
      }
    } catch (error: any) {
      console.error("Error fetching temperature data:", error)
      setIsConnected(false)
      setErrorMsg(error?.message ?? "Erreur de connexion")
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
    return "Critique ⚠️"
  }

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-blue-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Thermometer className="w-6 h-6 text-primary" />
            Monitoring Température en Temps Réel
          </CardTitle>
          {isConnected && (
            <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Connecté
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Displays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Battery Temperature */}
          <div className="bg-card/60 rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Température Batterie
              </span>
              </div>
              {isConnected && wifiSsid && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 border border-green-600/40">
                  Connecté • {wifiSsid}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <div className={`text-5xl font-bold ${getStatusColor(batteryTemp)}`}>
                {batteryTemp !== null ? batteryTemp.toFixed(1) : "--"}
              </div>
              <div className="text-3xl text-muted-foreground">°C</div>
              {batteryTemp !== null && getTrendIcon()}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {errorMsg ? (
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                  {errorMsg}
                </div>
              ) : (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  batteryTemp && batteryTemp < 40 
                    ? "bg-green-500/20 text-green-500" 
                    : batteryTemp && batteryTemp < 60
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-red-500/20 text-red-500"
                }`}>
                  {getStatusLabel(batteryTemp)}
                </div>
              )}
            </div>
          </div>

          {/* Ambient Temperature */}
          <div className="bg-card/60 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Température Ambiante
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className={`text-5xl font-bold ${getStatusColor(ambientTemp)}`}>
                {ambientTemp !== null ? ambientTemp.toFixed(1) : "--"}
              </div>
              <div className="text-3xl text-muted-foreground">°C</div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-muted-foreground">
                {ambientTemp !== null 
                  ? `${ambientTemp > 30 ? "🌡️ Chaud" : ambientTemp > 20 ? "☀️ Agréable" : "❄️ Frais"}`
                  : "En attente de données..."}
              </div>
            </div>
          </div>
        </div>

        {/* Temperature History Chart */}
        {history.length > 0 && (
          <div className="bg-card/40 rounded-lg p-4 border border-border/50">
            <h3 className="text-sm font-medium mb-4 text-muted-foreground">
              Historique (20 dernières lectures)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="time" 
                  stroke="#888" 
                  fontSize={11}
                  tick={{ fill: '#888' }}
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={11}
                  tick={{ fill: '#888' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="battery" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Batterie (°C)"
                  dot={false}
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="ambient" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Ambiante (°C)"
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span>📡 Dernière mise à jour: {lastUpdate}</span>
            )}
            {errorMsg && (
              <span className="text-red-500 font-medium">API Error: {errorMsg}</span>
            )}
          </div>
          {!isConnected && (
            <div className="text-red-500 font-medium flex items-center gap-1">
              ⚠️ Capteurs déconnectés
            </div>
          )}
          {isConnected && batteryTemp && batteryTemp > 60 && (
            <div className="text-red-500 font-medium flex items-center gap-1 animate-pulse">
              🚨 Température critique!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
