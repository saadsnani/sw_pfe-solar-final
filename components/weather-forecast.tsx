"use client"

import { useMemo, useState } from "react"
import { Brain, ChevronDown, Cloud, CloudRain, CloudSun, MapPin, Moon, Sun, Wind } from "lucide-react"

type DailyForecast = {
  day: string
  date: string
  condition: WeatherCondition
  high: number
  low: number
  precipitation: number
}

type WeatherCondition = "Sunny" | "Partly Cloudy" | "Cloudy" | "Rain Showers" | "Windy"

type ClimateProfileKey =
  | "inland"
  | "mountainEdge"
  | "coastal"
  | "coastalWind"
  | "arid"
  | "coastalSun"
  | "desertCoastal"

type CitySeed = {
  currentTemp: number
  condition: WeatherCondition
  solarFactor: number
  baseHigh: number
  baseLow: number
  profile: ClimateProfileKey
}

type CityWeatherData = {
  currentTemp: number
  condition: WeatherCondition
  solarFactor: number
  forecast: DailyForecast[]
}

const BATTERY_CAPACITY_KWH = 10
const LOAD_KWH = 2

const DAILY_HIGH_OFFSET = [0, -1, -2, -4, -6, -7, -5]
const DAILY_LOW_OFFSET = [0, 0, -1, -2, -3, -4, -4]

// Local simulated API seed for Moroccan cities.
const CITY_SEED: Record<string, CitySeed> = {
  Fes: { currentTemp: 23, condition: "Partly Cloudy", solarFactor: 0.82, baseHigh: 24, baseLow: 13, profile: "inland" },
  Taza: { currentTemp: 21, condition: "Sunny", solarFactor: 0.78, baseHigh: 22, baseLow: 12, profile: "mountainEdge" },
  Rabat: { currentTemp: 20, condition: "Rain Showers", solarFactor: 0.68, baseHigh: 21, baseLow: 13, profile: "coastal" },
  Casa: { currentTemp: 20, condition: "Cloudy", solarFactor: 0.64, baseHigh: 21, baseLow: 14, profile: "coastal" },
  Tanger: { currentTemp: 18, condition: "Windy", solarFactor: 0.59, baseHigh: 19, baseLow: 12, profile: "coastalWind" },
  Marrakech: { currentTemp: 28, condition: "Sunny", solarFactor: 0.92, baseHigh: 29, baseLow: 16, profile: "arid" },
  Agadir: { currentTemp: 24, condition: "Sunny", solarFactor: 0.88, baseHigh: 25, baseLow: 17, profile: "coastalSun" },
  Oujda: { currentTemp: 26, condition: "Sunny", solarFactor: 0.84, baseHigh: 27, baseLow: 15, profile: "inland" },
  Meknes: { currentTemp: 22, condition: "Partly Cloudy", solarFactor: 0.79, baseHigh: 23, baseLow: 12, profile: "inland" },
  Laayoune: { currentTemp: 27, condition: "Sunny", solarFactor: 0.96, baseHigh: 28, baseLow: 19, profile: "desertCoastal" },
}

const CLIMATE_PROFILES: Record<ClimateProfileKey, { conditions: WeatherCondition[]; precipitation: number[] }> = {
  inland: {
    conditions: ["Partly Cloudy", "Sunny", "Partly Cloudy", "Cloudy", "Rain Showers", "Sunny", "Cloudy"],
    precipitation: [5, 8, 15, 35, 70, 65, 25],
  },
  mountainEdge: {
    conditions: ["Sunny", "Partly Cloudy", "Sunny", "Cloudy", "Rain Showers", "Rain Showers", "Cloudy"],
    precipitation: [8, 12, 14, 32, 58, 47, 20],
  },
  coastal: {
    conditions: ["Cloudy", "Partly Cloudy", "Rain Showers", "Cloudy", "Rain Showers", "Cloudy", "Partly Cloudy"],
    precipitation: [22, 18, 36, 28, 46, 31, 24],
  },
  coastalWind: {
    conditions: ["Windy", "Cloudy", "Partly Cloudy", "Rain Showers", "Windy", "Cloudy", "Rain Showers"],
    precipitation: [18, 16, 21, 39, 22, 29, 34],
  },
  arid: {
    conditions: ["Sunny", "Sunny", "Partly Cloudy", "Sunny", "Windy", "Sunny", "Partly Cloudy"],
    precipitation: [1, 2, 4, 1, 3, 1, 5],
  },
  coastalSun: {
    conditions: ["Sunny", "Partly Cloudy", "Sunny", "Sunny", "Cloudy", "Partly Cloudy", "Sunny"],
    precipitation: [3, 7, 5, 2, 12, 10, 6],
  },
  desertCoastal: {
    conditions: ["Sunny", "Sunny", "Windy", "Sunny", "Partly Cloudy", "Sunny", "Sunny"],
    precipitation: [0, 1, 2, 0, 3, 0, 1],
  },
}

function formatWeekSlots(): Array<{ day: string; date: string }> {
  const dayFormatter = new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit" })
  const today = new Date()
  const slots: Array<{ day: string; date: string }> = []

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(today)
    current.setDate(today.getDate() + i)

    const day = dayFormatter.format(current).replace(".", "").toUpperCase()
    const date = dateFormatter.format(current)

    slots.push({ day, date })
  }

  return slots
}

function buildForecast(seed: CitySeed): DailyForecast[] {
  const profile = CLIMATE_PROFILES[seed.profile]
  const week = formatWeekSlots()

  return week.map((slot, index) => ({
    day: slot.day,
    date: slot.date,
    condition: profile.conditions[index],
    high: Math.round(seed.baseHigh + DAILY_HIGH_OFFSET[index]),
    low: Math.round(seed.baseLow + DAILY_LOW_OFFSET[index]),
    precipitation: profile.precipitation[index],
  }))
}

const WEATHER_API: Record<string, CityWeatherData> = Object.fromEntries(
  Object.entries(CITY_SEED).map(([city, seed]) => [
    city,
    {
      currentTemp: seed.currentTemp,
      condition: seed.condition,
      solarFactor: seed.solarFactor,
      forecast: buildForecast(seed),
    },
  ])
)

const CITY_NAMES = Object.keys(WEATHER_API)

function calculateAutonomyHours(solarFactor: number, batteryCapacity = BATTERY_CAPACITY_KWH, load = LOAD_KWH): number {
  if (load <= 0) {
    return 0
  }
  return (batteryCapacity / load) * solarFactor
}

function getSolarAvailabilityFactor(hour: number): number {
  if (hour >= 9 && hour <= 16) return 1
  if (hour >= 7 && hour <= 8) return 0.62
  if (hour >= 17 && hour <= 18) return 0.55
  if (hour >= 19 && hour <= 20) return 0.38
  return 0.18
}

function getPeriodLabel(hour: number): string {
  if (hour >= 6 && hour < 12) return "Matin"
  if (hour >= 12 && hour < 18) return "Apres-midi"
  if (hour >= 18 && hour < 22) return "Soir"
  return "Nuit"
}

function getWeatherIcon(condition: WeatherCondition) {
  if (condition === "Sunny") return <Sun className="h-7 w-7 text-amber-400" />
  if (condition === "Partly Cloudy") return <CloudSun className="h-7 w-7 text-yellow-500" />
  if (condition === "Cloudy") return <Cloud className="h-7 w-7 text-slate-500" />
  if (condition === "Rain Showers") return <CloudRain className="h-7 w-7 text-sky-500" />
  return <Wind className="h-7 w-7 text-blue-500" />
}

function getCurrentConditionIcon(condition: WeatherCondition) {
  if (condition === "Sunny") return <Sun className="h-4 w-4 text-amber-500" />
  if (condition === "Partly Cloudy") return <CloudSun className="h-4 w-4 text-yellow-500" />
  if (condition === "Cloudy") return <Cloud className="h-4 w-4 text-slate-500" />
  if (condition === "Rain Showers") return <CloudRain className="h-4 w-4 text-sky-500" />
  return <Wind className="h-4 w-4 text-blue-500" />
}

export function WeatherForecast() {
  const [selectedCity, setSelectedCity] = useState("Fes")
  const [status, setStatus] = useState("API locale simulee • 10 villes marocaines")

  const cityData = WEATHER_API[selectedCity]
  const currentHour = useMemo(() => new Date().getHours(), [selectedCity])
  const periodLabel = useMemo(() => getPeriodLabel(currentHour), [currentHour])
  const solarAvailability = useMemo(() => getSolarAvailabilityFactor(currentHour), [currentHour])
  const effectiveSolarFactor = useMemo(
    () => cityData.solarFactor * solarAvailability,
    [cityData.solarFactor, solarAvailability],
  )

  const autonomyHours = useMemo(() => {
    return calculateAutonomyHours(effectiveSolarFactor)
  }, [effectiveSolarFactor])

  const baseAutonomyHours = useMemo(() => {
    return BATTERY_CAPACITY_KWH / LOAD_KWH
  }, [])

  const autonomyBand = useMemo(() => {
    if (autonomyHours >= 4) return "Excellente"
    if (autonomyHours >= 2.7) return "Bonne"
    if (autonomyHours >= 1.6) return "Moyenne"
    return "Faible"
  }, [autonomyHours])

  const autonomyExplanation = useMemo(() => {
    if (periodLabel === "Nuit") {
      return "Mode nuit: faible apport solaire. L'autonomie estimee est principalement liee a la batterie disponible."
    }

    if (periodLabel === "Soir") {
      return "Mode soir: l'apport solaire diminue progressivement. L'autonomie reste moyenne a bonne selon la ville."
    }

    return "Mode jour: apport solaire favorable. L'autonomie est optimisee avec la production PV."
  }, [periodLabel])

  function handleCitySelect(city: string) {
    setSelectedCity(city)
    setStatus("Ville mise a jour automatiquement • Autonomie recalculee en temps reel")
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] border border-slate-200/70 bg-white/55 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-[15px] sm:p-5">
        <div className="mb-4 rounded-[16px] border border-emerald-300/70 bg-emerald-50/80 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">Autonomie Estimee (IA)</p>
              <p className="mt-1 text-2xl font-black text-emerald-800">
                {autonomyHours.toFixed(1)}
                {" heures"}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-700">
                Niveau: {autonomyBand}
                {" • Ville: "}
                {selectedCity}
                {" • "}
                {periodLabel}
              </p>
            </div>

            <div className="max-w-[380px] rounded-xl border border-emerald-300/70 bg-white/70 p-3 text-sm text-emerald-900">
              <p className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Explication Autonomie
              </p>
              <p className="text-xs mt-1 text-emerald-800">{autonomyExplanation}</p>
              <p className="text-xs mt-2 text-emerald-700">
                Solar Factor ville: {cityData.solarFactor.toFixed(2)} • Disponibilite horaire: {solarAvailability.toFixed(2)}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Formule: (Battery 10kWh / Load 2kWh) x SolarFactor x Disponibilite
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
            {periodLabel === "Nuit" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>Autonomie base batterie pleine: {baseAutonomyHours.toFixed(1)}h</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-foreground flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              {"7 JOURS • "}
              {selectedCity}
            </h2>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Weather + autonomie energetique</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              {getCurrentConditionIcon(cityData.condition)}
              {cityData.currentTemp}
              {"°C • "}
              {cityData.condition}
            </p>
          </div>

          <div className="relative w-full max-w-[380px]">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <select
              className="w-full appearance-none rounded-[14px] border border-slate-300/70 bg-white/70 py-2 pl-9 pr-9 text-sm text-foreground outline-none transition-colors focus:border-emerald-500/60"
              value={selectedCity}
              onChange={(event) => handleCitySelect(event.target.value)}
              aria-label="Selectionner la ville"
            >
              {CITY_NAMES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {cityData.forecast.map((day, index) => (
            <article
              key={`${selectedCity}-${day.day}-${index}`}
              className={`min-w-[140px] rounded-[18px] border p-3 text-center ${
                index === 0
                  ? "border-slate-300/80 bg-slate-200/70 shadow-[0_8px_16px_rgba(128,149,171,0.22)]"
                  : "border-slate-200/70 bg-white/70"
              }`}
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-700">{day.day}</p>
              <p className="text-xs font-semibold text-slate-500">({day.date})</p>

              <div className="my-2 flex justify-center">{getWeatherIcon(day.condition)}</div>

              <p className="text-xl font-black text-slate-900">
                {day.high}
                {"° / "}
                {day.low}
                °
              </p>
              <p className="text-sm font-semibold text-slate-600">{day.precipitation}% Pluie</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{day.condition}</p>
            </article>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">{status}</p>
      </div>
    </section>
  )
}
