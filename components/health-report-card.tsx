"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertTriangle, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  detectAnomalies,
  type HealthReport,
  type HealthStatus,
  type HistoricalSensorDataPoint,
} from "@/lib/maintenance-prediction"

interface SensorDataApiResponse {
  readings?: HistoricalSensorDataPoint[]
}

function fallbackHealthReport(message: string): HealthReport {
  return {
    status: "WARNING",
    message,
  }
}

function statusStyles(status: HealthStatus): {
  badgeClass: string
  titleClass: string
  icon: typeof ShieldCheck
} {
  switch (status) {
    case "NORMAL":
      return {
        badgeClass: "bg-green-600 text-white",
        titleClass: "text-green-700 dark:text-green-300",
        icon: ShieldCheck,
      }
    case "CRITICAL":
      return {
        badgeClass: "bg-red-600 text-white",
        titleClass: "text-red-700 dark:text-red-300",
        icon: ShieldAlert,
      }
    case "WARNING":
    default:
      return {
        badgeClass: "bg-yellow-500 text-black",
        titleClass: "text-yellow-700 dark:text-yellow-300",
        icon: AlertTriangle,
      }
  }
}

export function HealthReportCard() {
  const [healthReport, setHealthReport] = useState<HealthReport>(() =>
    fallbackHealthReport("Analyzing the last 24h of sensor data..."),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [sampleCount, setSampleCount] = useState(0)

  const loadHealthReport = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/sensor-data?type=all&limit=500", { cache: "no-store" })

      if (!response.ok) {
        throw new Error(`Health report fetch failed (${response.status})`)
      }

      const data = (await response.json()) as SensorDataApiResponse
      const readings = Array.isArray(data.readings) ? data.readings : []
      const report = detectAnomalies(readings)

      setHealthReport(report)
      setSampleCount(readings.length)
      setLastUpdated(new Date().toISOString())
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown error"

      setHealthReport(
        fallbackHealthReport(`Health report unavailable right now: ${details}.`),
      )
      setLastUpdated(new Date().toISOString())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadHealthReport()

    const timer = setInterval(() => {
      void loadHealthReport()
    }, 60_000)

    return () => clearInterval(timer)
  }, [loadHealthReport])

  const styles = useMemo(() => statusStyles(healthReport.status), [healthReport.status])
  const StatusIcon = styles.icon

  return (
    <Card className="bg-card/60 border-border/60 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            Health Report
          </CardTitle>
          <Badge className={`text-sm font-semibold px-3 py-1 ${styles.badgeClass}`}>
            {healthReport.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className={`text-sm sm:text-base font-medium ${styles.titleClass}`}>{healthReport.message}</p>

        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Updating report..." : "Monitoring active"}
          </span>
          <span>Samples analyzed: {sampleCount}</span>
          <span>
            Last update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString("fr-FR") : "--:--:--"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
