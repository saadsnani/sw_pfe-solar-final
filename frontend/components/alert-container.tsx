"use client"

import { AlertCircle, CheckCircle, InfoIcon, XCircle, X } from "lucide-react"
import { useAlert } from "@/lib/alert-provider"
import { cn } from "@/lib/utils"

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert()

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-700 text-white shadow-xl"
      case "error":
        return "bg-red-600 border-red-700 text-white shadow-xl"
      case "warning":
        return "bg-yellow-600 border-yellow-700 text-white shadow-xl"
      case "info":
        return "bg-blue-600 border-blue-700 text-white shadow-xl"
      default:
        return "bg-gray-600 border-gray-700 text-white shadow-xl"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />
      case "error":
        return <XCircle className="h-5 w-5 text-white" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-white" />
      case "info":
        return <InfoIcon className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full sm:w-96">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "border-2 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl backdrop-blur-sm",
            getAlertStyles(alert.type)
          )}
        >
          <div className="flex-shrink-0 pt-0.5">{getIcon(alert.type)}</div>
          <div className="flex-1 min-w-0">
            {alert.title && <h3 className="font-bold text-base mb-1 text-white">{alert.title}</h3>}
            <p className="text-sm text-white/95 break-words">{alert.message}</p>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors rounded-full p-1 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
