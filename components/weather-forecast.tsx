"use client"

import { useEffect, useMemo, useState } from "react"

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

export function WeatherForecast() {
  const [data, setData] = useState<CityForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const content = useMemo(() => {
    if (loading) return <p className="text-muted-foreground text-sm">Chargement des previsions...</p>
    if (error) return <p className="text-destructive text-sm">{error}</p>
    if (!data.length) return <p className="text-muted-foreground text-sm">Aucune donnee meteo.</p>

    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((city) => (
          <div key={city.city} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">{city.city}</h3>
              <span className="text-xs text-muted-foreground">7 jours</span>
            </div>
            <div className="divide-y divide-border">
              {city.days.map((day) => (
                <div key={day.date} className="py-2 flex items-center justify-between text-sm text-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium">{formatDay(day.date)}</span>
                    <span className="text-muted-foreground text-xs">{formatDate(day.date)}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{Math.round(day.tMax)}° / {Math.round(day.tMin)}°C</div>
                    <div className="text-xs text-muted-foreground">Pluie: {Math.round(day.rainProb ?? 0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }, [data, error, loading])

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Previsions meteo (7 jours)</h2>
          <p className="text-sm text-muted-foreground">Fes وباقي المدن الكبرى</p>
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
