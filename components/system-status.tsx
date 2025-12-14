import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertTriangle, Cpu } from "lucide-react"

interface SystemStatusProps {
  batteryVoltage: number
  panelVoltage: number
  inverterStatus: boolean
  temperature: number
}

export default function SystemStatus({ batteryVoltage, panelVoltage, inverterStatus, temperature }: SystemStatusProps) {
  const getVoltageStatus = (voltage: number, type: "battery" | "panel") => {
    if (type === "battery") {
      if (voltage < 11.5) return { status: "critical", text: "Critique", color: "destructive" }
      if (voltage < 12.2) return { status: "warning", text: "Faible", color: "primary" }
      return { status: "good", text: "Normal", color: "accent" }
    } else {
      if (voltage < 20) return { status: "low", text: "Faible", color: "primary" }
      if (voltage > 40) return { status: "high", text: "Élevée", color: "primary" }
      return { status: "good", text: "Optimal", color: "accent" }
    }
  }

  const getTempStatus = (temp: number) => {
    if (temp > 45) return { status: "hot", text: "Surchauffe", color: "destructive" }
    if (temp > 35) return { status: "warm", text: "Chaud", color: "primary" }
    return { status: "normal", text: "Normal", color: "accent" }
  }

  const batteryStatus = getVoltageStatus(batteryVoltage, "battery")
  const panelStatus = getVoltageStatus(panelVoltage, "panel")
  const tempStatus = getTempStatus(temperature)

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "critical" || status === "hot") return <XCircle className="h-4 w-4 text-destructive" />
    if (status === "warning" || status === "warm" || status === "low" || status === "high")
      return <AlertTriangle className="h-4 w-4 text-primary" />
    return <CheckCircle2 className="h-4 w-4 text-accent" />
  }

  const statusItems = [
    {
      label: "Tension Batterie",
      value: `${batteryVoltage.toFixed(1)}V`,
      status: batteryStatus,
    },
    {
      label: "Tension Panneau",
      value: `${panelVoltage.toFixed(1)}V`,
      status: panelStatus,
    },
    {
      label: "Onduleur",
      value: inverterStatus ? "Actif" : "Arrêté",
      status: {
        status: inverterStatus ? "good" : "warning",
        text: inverterStatus ? "OK" : "Off",
        color: inverterStatus ? "accent" : "primary",
      },
    },
    {
      label: "Température",
      value: `${temperature}°C`,
      status: tempStatus,
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cpu className="h-5 w-5 text-muted-foreground" />
          État du Système
        </CardTitle>
        <CardDescription>Diagnostic en temps réel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {statusItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/30"
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={item.status.status} />
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium">{item.value}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status.color === "accent"
                      ? "bg-accent/20 text-accent"
                      : item.status.color === "destructive"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary"
                  }`}
                >
                  {item.status.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* MPPT Status Indicator */}
        <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">MPPT Tracking Actif</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Point de puissance maximale optimisé</p>
        </div>
      </CardContent>
    </Card>
  )
}
