"use client"

import { useEffect, useMemo, useState } from "react"
import { Cloud, CloudRain, Sun, CloudSun } from "lucide-react"

const CITIES = [
  { name: "Fes", latitude: 34.0331, longitude: -5.0003 },
  { name: "Taza", latitude: 34.21, longitude: -4.01 },
  { name: "Rabat", latitude: 34.0209, longitude: -6.8416 },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { name: "New York", latitude: 40.7128, longitude: -74.006 },
  { name: "Madrid", latitude: 40.4168, longitude: -3.7038 },
  { name: "London", latitude: 51.5074, longitude: -0.1278 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
]

type DailyForecast = {
  date: string
  tMin: number
  tMax: number
  rainProb: number
}

type CityForecast = {
  city: string
  today: DailyForecast
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
  const [syncing, setSyncing] = useState(false)

  const fetchUrl = (lat: number, lon: number) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const results = await Promise.all(
          CITIES.map(async (city) => {
            const res = await fetch(fetchUrl(city.latitude, city.longitude))
            const contentType = res.headers.get("content-type") || ""
            const text = await res.text()

            if (!res.ok) throw new Error(`Erreur API meteo: ${res.status}`)

            if (contentType.includes("text/html") || text.trim().startsWith("<")) {
              throw new Error("HTML_RESPONSE")
            }

            const json = JSON.parse(text)
            const days: DailyForecast[] = json.daily.time.map((date: string, idx: number) => ({
              date,
              tMin: json.daily.temperature_2m_min[idx],
              tMax: json.daily.temperature_2m_max[idx],
              rainProb: json.daily.precipitation_probability_max[idx],
            }))
            return { city: city.name, today: days[0] }
          })
        )

        if (!cancelled) {
          setData(results)
          setError(null)
          setSyncing(false)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Erreur inconnue"
          if (message.includes("HTML_RESPONSE") || message.includes("Unexpected token <")) {
            setSyncing(true)
            setError(null)
          } else {
            setError(message)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return <p className="text-muted-foreground text-base font-medium">Chargement des prévisions...</p>
    }

    if (syncing) {
      return (
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 rounded-full border-2 border-emerald-400/40 border-t-emerald-400 animate-spin" />
          <span className="text-base font-medium">Syncing Data...</span>
        </div>
      )
    }

    if (error) return <p className="text-destructive text-base font-medium">{error}</p>
    if (!data.length) return <p className="text-muted-foreground text-base font-medium">Aucune donnée météo.</p>

    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {data.map((city) => (
          <div
            key={city.city}
            className="min-w-[140px] rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col gap-2"
          >
            <div className="text-sm uppercase tracking-widest text-muted-foreground">{city.city}</div>
            <div className="flex items-center gap-2">
              {getWeatherIcon(city.today.rainProb, city.today.tMax)}
              <span className="text-2xl font-bold text-foreground">{Math.round(city.today.tMax)}°</span>
            </div>
            <div className="text-xs text-muted-foreground">Pluie {Math.round(city.today.rainProb ?? 0)}%</div>
          </div>
        ))}
      </div>
    )
  }, [loading, syncing, error, data])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-foreground flex items-center gap-2">
            <CloudSun className="w-5 h-5" />
            Global Weather
          </h2>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">7 jours · Villes principales</p>
        </div>
      </div>
      {content}
    </section>
  )
}
