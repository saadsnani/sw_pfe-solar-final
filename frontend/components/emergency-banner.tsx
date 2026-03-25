"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SafetyStatusPayload {
  emergencyActive: boolean
  reason: string | null
  triggeredAt: string | null
}

interface SafetyStatusResponse {
  success: boolean
  data?: SafetyStatusPayload
}

const DEFAULT_STATE: SafetyStatusPayload = {
  emergencyActive: false,
  reason: null,
  triggeredAt: null,
}

export function EmergencyBanner() {
  const [status, setStatus] = useState<SafetyStatusPayload>(DEFAULT_STATE)

  const fetchSafetyStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/safety-status", { cache: "no-store" })
      if (!response.ok) {
        setStatus(DEFAULT_STATE)
        return
      }

      const payload = (await response.json()) as SafetyStatusResponse
      if (!payload.success || !payload.data) {
        setStatus(DEFAULT_STATE)
        return
      }

      setStatus({
        emergencyActive: Boolean(payload.data.emergencyActive),
        reason: payload.data.reason || null,
        triggeredAt: payload.data.triggeredAt || null,
      })
    } catch {
      setStatus(DEFAULT_STATE)
    }
  }, [])

  useEffect(() => {
    void fetchSafetyStatus()

    const timer = setInterval(() => {
      void fetchSafetyStatus()
    }, 5000)

    return () => clearInterval(timer)
  }, [fetchSafetyStatus])

  if (!status.emergencyActive) {
    return null
  }

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 sm:px-5 sm:py-4 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-semibold">Safety Override Active</p>
        </div>
        <Badge className="bg-red-600 text-white">EMERGENCY SHUTDOWN</Badge>
      </div>

      <p className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">
        {status.reason || "Critical threshold reached. Relays forced OFF by safety override."}
      </p>

      {status.triggeredAt ? (
        <p className="mt-1 text-xs text-red-700/70 dark:text-red-300/70 flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          Triggered at {new Date(status.triggeredAt).toLocaleTimeString("fr-FR")}
        </p>
      ) : null}
    </div>
  )
}
