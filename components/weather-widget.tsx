"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudSun, CloudSnow, Thermometer } from "lucide-react"

const cities = [
  { id: "fes", name: "Fès", lat: 34.03, lon: -5.0 },
  { id: "casablanca", name: "Casablanca", lat: 33.57, lon: -7.59 },
  { id: "marrakech", name: "Marrakech", lat: 31.63, lon: -8.0 },
  { id: "rabat", name: "Rabat", lat: 34.02, lon: -6.83 },
  { id: "tanger", name: "Tanger", lat: 35.76, lon: -5.83 },
]

const weatherConditions = [
  { icon: Sun, label: "Ensoleillé", temp: [28, 35] },
  { icon: CloudSun, label: "Partiellement nuageux", temp: [24, 30] },
  { icon: Cloud, label: "Nuageux", temp: [20, 26] },
  { icon: CloudRain, label: "Pluvieux", temp: [16, 22] },
  { icon: CloudSnow, label: "Orageux", temp: [14, 20] },
]

// Get weather icon based on condition code
function getWeatherIcon(code: string) {
  if (code.includes("01")) return Sun
  if (code.includes("02") || code.includes("03")) return CloudSun
  if (code.includes("04")) return Cloud
  if (code.includes("09") || code.includes("10")) return CloudRain
  if (code.includes("11") || code.includes("13")) return CloudSnow
  return Sun
}

async function fetchRealWeather(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo"
  
  try {
    // Current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`
    )
    const current = await currentRes.json()

    // 7-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`
    )
    const forecast = await forecastRes.json()

    return { current, forecast }
  } catch (error) {
    console.error("Weather API Error:", error)
    return null
  }
}

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState("fes")
  const [forecast, setForecast] = useState<any[]>([])
  const [currentWeather, setCurrentWeather] = useState({
    temp: 0,
    humidity: 0,
    wind: 0,
    condition: { icon: Sun, label: "Chargement..." },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const city = cities.find(c => c.id === selectedCity)
    if (!city) return

    setLoading(true)
    fetchRealWeather(city.lat, city.lon).then(data => {
      if (data) {
        // Set current weather
        const Icon = getWeatherIcon(data.current.weather[0].icon)
        setCurrentWeather({
          temp: Math.round(data.current.main.temp),
          humidity: data.current.main.humidity,
          wind: Math.round(data.current.wind.speed * 3.6), // m/s to km/h
          condition: {
            icon: Icon,
            label: data.current.weather[0].description,
          },
        })

        // Process forecast (group by day, take midday values)
        const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
        const dailyData = new Map()
        
        data.forecast.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000)
          const dayKey = date.toDateString()
          
          if (!dailyData.has(dayKey)) {
            dailyData.set(dayKey, {
              day: days[date.getDay()],
              date: date.getDate(),
              temps: [],
              humidity: item.main.humidity,
              wind: Math.round(item.wind.speed * 3.6),
              icon: item.weather[0].icon,
              description: item.weather[0].description,
            })
          }
          dailyData.get(dayKey).temps.push(item.main.temp)
        })

        const forecastArray = Array.from(dailyData.values()).slice(0, 7).map(day => ({
          day: day.day,
          date: day.date,
          condition: {
            icon: getWeatherIcon(day.icon),
            label: day.description,
          },
          tempHigh: Math.round(Math.max(...day.temps)),
          tempLow: Math.round(Math.min(...day.temps)),
          humidity: day.humidity,
          wind: day.wind,
        }))

        setForecast(forecastArray)
      }
      setLoading(false)
    })
  }, [selectedCity])

  const CurrentIcon = currentWeather.condition.icon

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Météo - Prévision 7 Jours {loading && <span className="text-xs text-muted-foreground">(Chargement...)</span>}
          </CardTitle>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <CurrentIcon className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{currentWeather.temp}°C</p>
              <p className="text-sm text-muted-foreground">{currentWeather.condition.label}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium">{currentWeather.humidity}%</p>
                <p className="text-xs text-muted-foreground">Humidité</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-sm font-medium">{currentWeather.wind} km/h</p>
                <p className="text-xs text-muted-foreground">Vent</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {forecast.map((day, index) => {
            const DayIcon = day.condition.icon
            return (
              <div
                key={index}
                className={`flex-shrink-0 w-[85px] p-3 rounded-lg border text-center transition-all ${
                  index === 0
                    ? "bg-primary/20 border-primary/40"
                    : "bg-secondary/30 border-border/30 hover:bg-secondary/50"
                }`}
              >
                <p className="text-xs font-medium mb-1">{index === 0 ? "Auj." : day.day}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{day.date}</p>
                <DayIcon className={`h-6 w-6 mx-auto mb-2 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-semibold">{day.tempHigh}°</p>
                <p className="text-xs text-muted-foreground">{day.tempLow}°</p>
              </div>
            )
          })}
        </div>

        {/* Solar Impact Note */}
        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-accent">
            <Sun className="h-3 w-3 inline mr-1" />
            Impact solaire:{" "}
            {currentWeather.condition.icon === Sun
              ? "Excellent"
              : currentWeather.condition.icon === CloudSun
                ? "Bon"
                : "Modéré"}{" "}
            - Production estimée:{" "}
            {currentWeather.condition.icon === Sun
              ? "95-100%"
              : currentWeather.condition.icon === CloudSun
                ? "70-85%"
                : "40-60%"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
