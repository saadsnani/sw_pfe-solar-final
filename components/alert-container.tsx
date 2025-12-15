"use client"

import { AlertCircle, CheckCircle, InfoIcon, XCircle, X } from "lucide-react"
import { useAlert } from "@/lib/alert-provider"
import { cn } from "@/lib/utils"

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert()

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/15 border-green-500/30 text-green-900 dark:text-green-100"
      case "error":
        return "bg-red-500/15 border-red-500/30 text-red-900 dark:text-red-100"
      case "warning":
        return "bg-yellow-500/15 border-yellow-500/30 text-yellow-900 dark:text-yellow-100"
      case "info":
        return "bg-blue-500/15 border-blue-500/30 text-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-500/15 border-gray-500/30"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      case "info":
        return <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      default:
        return null
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "border rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-200",
            getAlertStyles(alert.type)
          )}
        >
          <div className="flex-shrink-0 pt-0.5">{getIcon(alert.type)}</div>
          <div className="flex-1">
            {alert.title && <h3 className="font-semibold text-sm mb-1">{alert.title}</h3>}
            <p className="text-sm opacity-90">{alert.message}</p>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
