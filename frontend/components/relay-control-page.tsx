"use client"

import { Power } from "lucide-react"
import { RelayControlPanel } from "@/components/relay-control-panel"

export function RelayControlPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Power className="w-6 h-6 text-primary" />
          Contrôle Relais
        </h1>
        <p className="text-muted-foreground">Pilotage Manuel ou IA pour Onduleur, Block 1 et Block 2</p>
      </div>

      <RelayControlPanel />
    </div>
  )
}
