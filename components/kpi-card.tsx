import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend: number
  description: string
  color: "primary" | "accent" | "muted"
}

export default function KpiCard({ title, value, subtitle, icon: Icon, trend, description, color }: KpiCardProps) {
  const colorConfig = {
    primary: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    accent: {
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    muted: {
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
  }

  const config = colorConfig[color]

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-2.5 rounded-lg ${config.iconBg}`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border">
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-accent" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className={`text-sm font-medium ${trend >= 0 ? "text-accent" : "text-destructive"}`}>
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-muted-foreground">vs yesterday</span>
        </div>
      </CardContent>
    </Card>
  )
}
