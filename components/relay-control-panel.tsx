"use client"

import { useEffect, useMemo, useState } from "react"
import { Brain, Hand, Power, ToggleLeft, RadioTower, Lightbulb, PlugZap, Circle, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SystemSensorsState } from "@/lib/sensor-connection"

type ControlMode = "manual" | "ai"

interface RelayState {
  inverter: boolean
  block1: boolean
  block2: boolean
}

interface RelayControlPanelProps {
  sensors?: SystemSensorsState
}

interface ModernRelaySwitchProps {
  checked: boolean
  disabled?: boolean
  onChange: (next: boolean) => void
}

function ModernRelaySwitch({ checked, disabled = false, onChange }: ModernRelaySwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative h-9 w-20 rounded-full border transition-all duration-300 ${
          checked
            ? "bg-emerald-500/20 border-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.25)]"
            : "bg-red-500/20 border-red-400/60 shadow-[0_0_14px_rgba(239,68,68,0.2)]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-semibold tracking-wide">
          <span className={checked ? "text-emerald-600" : "text-muted-foreground"}>ON</span>
          <span className={!checked ? "text-red-600" : "text-muted-foreground"}>OFF</span>
        </span>

        <span
          className={`absolute top-0.5 flex h-7 w-7 items-center justify-center rounded-full border bg-background/95 backdrop-blur-sm shadow-md transition-all duration-300 ${
            checked
              ? "translate-x-[46px] border-emerald-300 text-emerald-600"
              : "translate-x-0.5 border-red-300 text-red-600"
          }`}
        >
          {checked ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        </span>
      </button>
    </div>
  )
}

const INITIAL_RELAYS: RelayState = {
  inverter: false,
  block1: false,
  block2: false,
}

function computeAiRelayState(sensors?: SystemSensorsState): RelayState {
  const production = sensors?.production.value ?? 0
  const consumption = sensors?.consumption.value ?? 0
  const batteryLevel = sensors?.battery.value ?? 0
  const batteryTemp = sensors?.temperature.value ?? 25

  const inverter = batteryLevel >= 30 || production >= 150
  const block1 = inverter && batteryLevel >= 25 && batteryTemp < 55
  const block2 = inverter && batteryLevel >= 50 && production >= consumption

  return { inverter, block1, block2 }
}

export function RelayControlPanel({ sensors }: RelayControlPanelProps) {
  const [mode, setMode] = useState<ControlMode>("manual")
  const [relays, setRelays] = useState<RelayState>(INITIAL_RELAYS)
  const [relayMemory, setRelayMemory] = useState<{ block1: boolean; block2: boolean }>({
    block1: false,
    block2: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const aiSuggestedRelays = useMemo(() => computeAiRelayState(sensors), [sensors])

  const saveControl = async (nextMode: ControlMode, nextRelays: RelayState, source: string) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/relay-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode, relays: nextRelays, source }),
      })

      if (!response.ok) {
        throw new Error(`Save failed (${response.status})`)
      }

      setStatusMessage("✅ Commande enregistrée")
      setLastUpdate(new Date().toISOString())
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown error"
      setStatusMessage(`❌ Erreur enregistrement: ${details}`)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const loadState = async () => {
      try {
        const response = await fetch("/api/relay-control", { cache: "no-store" })
        if (!response.ok) return

        const payload = await response.json()
        const data = payload?.data
        if (!data?.relays) return

        setMode(data.mode === "ai" ? "ai" : "manual")
        setRelays({
          inverter: Boolean(data.relays.inverter),
          block1: Boolean(data.relays.block1),
          block2: Boolean(data.relays.block2),
        })
        setRelayMemory({
          block1: Boolean(data.relays.block1),
          block2: Boolean(data.relays.block2),
        })
        setLastUpdate(typeof data.updatedAt === "string" ? data.updatedAt : null)
      } catch {
      }
    }

    loadState()
  }, [])

  useEffect(() => {
    if (mode !== "ai") return

    const changed =
      relays.inverter !== aiSuggestedRelays.inverter ||
      relays.block1 !== aiSuggestedRelays.block1 ||
      relays.block2 !== aiSuggestedRelays.block2

    if (!changed) return

    setRelays(aiSuggestedRelays)
    saveControl("ai", aiSuggestedRelays, "ai_engine")
  }, [mode, aiSuggestedRelays, relays])

  const onModeChange = async (nextMode: ControlMode) => {
    setMode(nextMode)
    const nextRelays = nextMode === "ai" ? aiSuggestedRelays : relays
    if (nextMode === "ai") {
      setRelays(nextRelays)
    }
    await saveControl(nextMode, nextRelays, "dashboard_mode_switch")
  }

  const onToggleRelay = async (key: keyof RelayState, checked: boolean) => {
    if (mode !== "manual") return

    const nextRelays = { ...relays, [key]: checked }

    if (key === "inverter") {
      if (!checked) {
        setRelayMemory({
          block1: relays.block1,
          block2: relays.block2,
        })
        nextRelays.block1 = false
        nextRelays.block2 = false
      } else {
        nextRelays.block1 = relayMemory.block1
        nextRelays.block2 = relayMemory.block2
      }
    }

    if ((key === "block1" || key === "block2") && checked && !nextRelays.inverter) {
      nextRelays.inverter = true
    }

    if (nextRelays.inverter) {
      setRelayMemory({
        block1: nextRelays.block1,
        block2: nextRelays.block2,
      })
    }

    setRelays(nextRelays)
    await saveControl("manual", nextRelays, "dashboard_manual")
  }

  const relayItems: Array<{
    key: keyof RelayState
    label: string
    description: string
    icon: typeof RadioTower
  }> = [
    { key: "inverter", label: "Onduleur", description: "Relais principal ON/OFF", icon: RadioTower },
    { key: "block1", label: "Block 1", description: "Prises Block 1", icon: PlugZap },
    { key: "block2", label: "Block 2", description: "Prises Block 2", icon: Lightbulb },
  ]

  const activeRelayCount = [relays.inverter, relays.block1, relays.block2].filter(Boolean).length

  return (
    <Card className="relative overflow-hidden bg-card/60 backdrop-blur-md border-border/50 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Power className="w-5 h-5 text-primary" />
            Contrôle Relais Intelligent
          </CardTitle>
          <Badge className={mode === "ai" ? "bg-purple-600" : "bg-emerald-600"}>
            {mode === "ai" ? "Mode AI" : "Mode Manuel"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/70 bg-background/40 p-3 shadow-inner">
            <p className="text-xs text-muted-foreground">Relais Actifs</p>
            <p className="text-xl font-semibold text-foreground">{activeRelayCount}/3</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/40 p-3 shadow-inner">
            <p className="text-xs text-muted-foreground">Mode de Pilotage</p>
            <p className="text-xl font-semibold text-foreground">{mode === "ai" ? "AI" : "Manuel"}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/40 p-3 shadow-inner">
            <p className="text-xs text-muted-foreground">Dernière Maj</p>
            <p className="text-sm font-semibold text-foreground">
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString("fr-FR") : "--:--:--"}
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-border/70 p-1 bg-gradient-to-b from-muted/70 to-muted/30 gap-1 shadow-inner backdrop-blur-sm">
          <Button
            variant={mode === "manual" ? "default" : "ghost"}
            onClick={() => onModeChange("manual")}
            disabled={isSaving}
            className="rounded-lg shadow-sm"
          >
            <Hand className="w-4 h-4 mr-2" />
            Manuel
          </Button>
          <Button
            variant={mode === "ai" ? "default" : "ghost"}
            onClick={() => onModeChange("ai")}
            disabled={isSaving}
            className="rounded-lg shadow-sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ perspective: "1200px" }}>
          {relayItems.map((item) => {
            const ItemIcon = item.icon
            const isOn = relays[item.key]
            const isDisabled = mode !== "manual" || isSaving || (item.key !== "inverter" && !relays.inverter)

            return (
              <div
                key={item.key}
                className={`rounded-xl border p-3 space-y-3 transition-all ${
                  isOn
                    ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/15 to-emerald-500/5"
                    : "border-red-500/40 bg-gradient-to-b from-red-500/15 to-red-500/5"
                } hover:-translate-y-0.5 hover:scale-[1.01] relative`}
                style={{
                  transform: "rotateX(1deg)",
                  boxShadow: isOn
                    ? "0 10px 24px -14px rgba(16,185,129,0.75), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 10px 24px -14px rgba(239,68,68,0.75), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-2 ${isOn ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
                      <ItemIcon className={`w-4 h-4 ${isOn ? "text-emerald-600" : "text-red-600"}`} />
                    </div>
                    <div>
                      <p className="font-medium leading-none">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>

                  <ModernRelaySwitch
                    checked={isOn}
                    disabled={isDisabled}
                    onChange={(next) => onToggleRelay(item.key, next)}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Circle className={`w-3.5 h-3.5 fill-current animate-pulse ${isOn ? "text-emerald-500" : "text-red-500"}`} />
                    <span className={isOn ? "text-emerald-700" : "text-red-700"}>{isOn ? "ON" : "OFF"}</span>
                  </div>
                  <span className="text-muted-foreground">{mode === "ai" ? "Pilotage AI" : "Pilotage Manuel"}</span>
                </div>
              </div>
            )
          })}
        </div>

        {mode === "ai" && (
          <div className="rounded-lg border border-border p-3 text-sm">
            <p className="font-medium mb-1 flex items-center gap-2">
              <ToggleLeft className="w-4 h-4" />
              Décision AI active
            </p>
            <p className="text-muted-foreground">
              AI ajuste les relais selon production, consommation, batterie et température.
            </p>
          </div>
        )}

        {statusMessage && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Power className="w-4 h-4" />
            {statusMessage}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
