import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle2, Bell } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning",
    message: "Production PV inférieure à la normale (ombrage possible)",
    time: "Il y a 12 min",
  },
  {
    id: 2,
    type: "info",
    message: "Mode économie recommandé pour demain (météo nuageuse)",
    time: "Il y a 45 min",
  },
  {
    id: 3,
    type: "success",
    message: "Batterie chargée à 100% - Charge de maintien active",
    time: "Il y a 2h",
  },
]

export default function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-primary" />
      case "info":
        return <Info className="h-4 w-4 text-chart-3" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-accent" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary text-xs">
            Attention
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="border-chart-3/50 text-chart-3 text-xs">
            Info
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="border-accent/50 text-accent text-xs">
            OK
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alertes & Notifications
            </CardTitle>
            <CardDescription>Événements système récents</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {alerts.length} nouvelles
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
              {getAlertBadge(alert.type)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
