import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CITIES = [
  { name: "Fes", latitude: 34.0331, longitude: -5.0003 },
  { name: "Taza", latitude: 34.21, longitude: -4.01 },
  { name: "Rabat", latitude: 34.0209, longitude: -6.8416 },
]

export async function GET(request: NextRequest) {
  try {
    const results = await Promise.all(
      CITIES.map(async (city) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`
        
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`Weather API error: ${res.status}`)
        }

        const json = await res.json()
        
        const days = json.daily.time.map((date: string, idx: number) => ({
          date,
          tMin: json.daily.temperature_2m_min[idx],
          tMax: json.daily.temperature_2m_max[idx],
          rainProb: json.daily.precipitation_probability_max[idx],
        }))
        
        return { city: city.name, today: days[0] }
      })
    )

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
