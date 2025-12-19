import { useEffect, useState } from "react"

export interface BatteryTemperatureData {
  batteryTemperature: number | null
  isConnected: boolean
  lastUpdate: Date | null
  status: "disconnected" | "cold" | "normal" | "warm" | "critical"
}

export function useBatteryTemperature(refreshInterval = 3000) {
  const [data, setData] = useState<BatteryTemperatureData>({
    batteryTemperature: null,
    isConnected: false,
    lastUpdate: null,
    status: "disconnected",
  })

  const getStatus = (temp: number | null): BatteryTemperatureData["status"] => {
    if (!temp) return "disconnected"
    if (temp < 20) return "cold"
    if (temp < 40) return "normal"
    if (temp < 60) return "warm"
    return "critical"
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sensor-data?type=battery")
        const result = await response.json()

        if (result.current && result.current.batteryTemperature !== undefined) {
          const temp = result.current.batteryTemperature
          setData({
            batteryTemperature: temp,
            isConnected: true,
            lastUpdate: new Date(result.current.timestamp),
            status: getStatus(temp),
          })
        } else {
          setData((prev) => ({
            ...prev,
            isConnected: false,
            status: "disconnected",
          }))
        }
      } catch (error) {
        console.error("Error fetching battery temperature:", error)
        setData((prev) => ({
          ...prev,
          isConnected: false,
          status: "disconnected",
        }))
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return data
}

export function useSendBatteryTemperature() {
  const send = async (temperature: number) => {
    try {
      const response = await fetch("/api/sensor-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batteryTemperature: temperature }),
      })

      if (!response.ok) {
        throw new Error("Failed to send temperature data")
      }

      return await response.json()
    } catch (error) {
      console.error("Error sending battery temperature:", error)
      throw error
    }
  }

  return { send }
}
