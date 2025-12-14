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

function generateForecast(cityId: string) {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  const today = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const conditionIndex = Math.floor(Math.random() * weatherConditions.length)
    const condition = weatherConditions[conditionIndex]
    const tempBase = condition.temp[0] + Math.random() * (condition.temp[1] - condition.temp[0])

    return {
      day: days[date.getDay()],
      date: date.getDate(),
      condition: condition,
      tempHigh: Math.round(tempBase + 3),
      tempLow: Math.round(tempBase - 5),
      humidity: Math.floor(Math.random() * 30 + 40),
      wind: Math.floor(Math.random() * 20 + 5),
    }
  })
}

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState("fes")
  const [forecast, setForecast] = useState(generateForecast("fes"))
  const [currentWeather, setCurrentWeather] = useState({
    temp: 31,
    humidity: 45,
    wind: 12,
    condition: weatherConditions[0],
  })

  useEffect(() => {
    setForecast(generateForecast(selectedCity))
    const conditionIndex = Math.floor(Math.random() * 3)
    setCurrentWeather({
      temp: Math.floor(Math.random() * 10 + 26),
      humidity: Math.floor(Math.random() * 30 + 40),
      wind: Math.floor(Math.random() * 15 + 8),
      condition: weatherConditions[conditionIndex],
    })
  }, [selectedCity])

  const CurrentIcon = currentWeather.condition.icon

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Météo - Prévision 7 Jours
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
