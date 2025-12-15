"use client"

import { useEffect, useMemo, useState } from "react"
import { Cloud, CloudRain, Sun, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"

const CITIES = [
  { name: "Fes", latitude: 34.0331, longitude: -5.0003 },
  { name: "Casablanca", latitude: 33.5731, longitude: -7.5898 },
  { name: "Rabat", latitude: 34.0209, longitude: -6.8416 },
  { name: "Marrakech", latitude: 31.6295, longitude: -7.9811 },
  { name: "Tanger", latitude: 35.7595, longitude: -5.83395 },
]

type DailyForecast = {
  date: string
  tMin: number
  tMax: number
  rainProb: number
}

type CityForecast = {
  city: string
  days: DailyForecast[]
}

function getClothingAdvice(tMax: number): { emoji: string; text: string } {
  if (tMax < 10) return { emoji: "🧥", text: "Manteau lourd" }
  if (tMax < 15) return { emoji: "🧤", text: "Veste + Pull" }
  if (tMax < 20) return { emoji: "👕", text: "Pull léger" }
  if (tMax < 25) return { emoji: "👔", text: "Chemise/T-shirt" }
  return { emoji: "👙", text: "Vêtements légers" }
}

function getWeatherIcon(rainProb: number, tMax: number) {
  if (rainProb > 50) return <CloudRain className="w-5 h-5 text-blue-500" />
  if (rainProb > 20) return <Cloud className="w-5 h-5 text-gray-500" />
  return <Sun className="w-5 h-5 text-yellow-500" />
}

export function WeatherForecast() {
  const [data, setData] = useState<CityForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState("Fes")

  const fetchUrl = (lat: number, lon: number) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const results = await Promise.all(
          CITIES.map(async (city) => {
            const res = await fetch(fetchUrl(city.latitude, city.longitude))
            if (!res.ok) throw new Error(`Erreur API meteo: ${res.status}`)
            const json = await res.json()
            const days: DailyForecast[] = json.daily.time.map((date: string, idx: number) => ({
              date,
              tMin: json.daily.temperature_2m_min[idx],
              tMax: json.daily.temperature_2m_max[idx],
              rainProb: json.daily.precipitation_probability_max[idx],
            }))
            return { city: city.name, days }
          })
        )

        if (!cancelled) {
          setData(results)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const selectedCityData = useMemo(() => {
    return data.find((c) => c.city === selectedCity)
  }, [data, selectedCity])

  const content = useMemo(() => {
    if (loading) return <p className="text-muted-foreground text-sm">Chargement des previsions...</p>
    if (error) return <p className="text-destructive text-sm">{error}</p>
    if (!selectedCityData) return <p className="text-muted-foreground text-sm">Aucune donnee meteo.</p>

    return (
      <div className="space-y-4">
        {/* City Selector */}
        <div className="flex gap-2 flex-wrap">
          {CITIES.map((city) => (
            <Button
              key={city.name}
              variant={selectedCity === city.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity(city.name)}
              className="rounded-full"
            >
              {city.name}
            </Button>
          ))}
        </div>

        {/* Selected City Forecast */}
        <div className="grid gap-3">
          {selectedCityData.days.map((day) => {
            const advice = getClothingAdvice(day.tMax)
            return (
              <div
                key={day.date}
                className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getWeatherIcon(day.rainProb, day.tMax)}
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {formatDay(day.date)} - {formatDate(day.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(day.tMax)}°C / {Math.round(day.tMin)}°C · Pluie: {Math.round(day.rainProb ?? 0)}%
                      </div>
                    </div>
                  </div>

                  {/* Clothing Advice */}
                  <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                    <span className="text-2xl">{advice.emoji}</span>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium text-foreground">{advice.text}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }, [loading, error, selectedCityData, selectedCity])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Shirt className="w-5 h-5" />
            Prévisions météo & Conseils vestimentaires
          </h2>
          <p className="text-sm text-muted-foreground">7 jours - Choisir votre ville</p>
        </div>
      </div>
      {content}
    </section>
  )
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(date))
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(date))
}
