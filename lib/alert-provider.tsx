"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export type AlertType = "success" | "error" | "warning" | "info"

export interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  duration?: number | false
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id">) => void
  removeAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = useCallback((alert: Omit<Alert, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newAlert = { ...alert, id }
    setAlerts((prev) => [...prev, newAlert])

    // Auto-remove after duration unless explicitly disabled with duration: false
    if (alert.duration !== false) {
      const timeout = alert.duration ?? 5000
      setTimeout(() => {
        removeAlert(id)
      }, timeout)
    }
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider")
  }
  return context
}
