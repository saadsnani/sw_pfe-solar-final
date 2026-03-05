"use client"

import { Power } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRelayState } from "@/hooks/use-relay-state"

export function RelayToggleExample() {
  const { relayOn, loading, error, toggleRelay } = useRelayState({
    provider: "rtdb",
    path: "control/relays/inverter",
  })

  return (
    <Card className="max-w-md border-border/60 bg-card/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Power className="h-4 w-4" />
          Relay Control (Realtime)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-border/70 p-3">
          <span className="text-sm text-muted-foreground">Inverter relay</span>
          <Badge className={relayOn ? "bg-emerald-600" : "bg-zinc-600"}>{relayOn ? "ON" : "OFF"}</Badge>
        </div>

        <Button onClick={toggleRelay} disabled={loading} className="w-full">
          {loading ? "Syncing..." : relayOn ? "Turn OFF" : "Turn ON"}
        </Button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <p className="text-xs text-muted-foreground">
          This component listens in real time to <code>control/relays/inverter</code> (no polling).
        </p>
      </CardContent>
    </Card>
  )
}
