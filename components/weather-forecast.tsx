"use client"

import { useEffect, useMemo, useState } from "react"
import { Cloud, CloudRain, Sun, CloudSun } from "lucide-react"

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

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/weather')
        
        if (!res.ok) {
          throw new Error(`Weather API error: ${res.status}`)
        }

        const json = await res.json()
        
        if (!json.success) {
          throw new Error(json.error || 'Weather API failed')
        }

        if (!cancelled) {
          setData(json.data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Erreur météo"
          setError(message)
          console.error('Weather fetch error:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    
    // Refresh every 30 minutes
    const interval = setInterval(load, 30 * 60 * 1000)
    
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return <p className="text-muted-foreground text-base font-medium">Chargement météo...</p>
    }

    if (error) {
      return <p className="text-destructive text-base font-medium">Météo: {error}</p>
    }
    
    if (!data.length) {
      return <p className="text-muted-foreground text-base font-medium">Aucune donnée météo.</p>
    }

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
  }, [loading, error, data])

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
