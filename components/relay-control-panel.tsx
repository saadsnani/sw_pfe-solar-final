"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Brain, Hand, Power, ToggleLeft, RadioTower, Lightbulb, PlugZap, Circle, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRelayState } from "@/hooks/use-relay-state"
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

function enforceRelayDependency(relays: RelayState): RelayState {
  if (!relays.inverter) {
    return {
      inverter: false,
      block1: false,
      block2: false,
    }
  }

  return relays
}

function areRelayStatesEqual(a: RelayState, b: RelayState): boolean {
  return a.inverter === b.inverter && a.block1 === b.block1 && a.block2 === b.block2
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
  const [relayMemory, setRelayMemory] = useState<{ block1: boolean; block2: boolean }>({
    block1: false,
    block2: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const {
    relayOn: inverter,
    loading: inverterLoading,
    error: inverterError,
    setRelay: setInverter,
  } = useRelayState({
    provider: "rtdb",
    path: "control/relays/inverter",
    initialValue: INITIAL_RELAYS.inverter,
  })

  const {
    relayOn: block1,
    loading: block1Loading,
    error: block1Error,
    setRelay: setBlock1,
  } = useRelayState({
    provider: "rtdb",
    path: "control/relays/block1",
    initialValue: INITIAL_RELAYS.block1,
  })

  const {
    relayOn: block2,
    loading: block2Loading,
    error: block2Error,
    setRelay: setBlock2,
  } = useRelayState({
    provider: "rtdb",
    path: "control/relays/block2",
    initialValue: INITIAL_RELAYS.block2,
  })

  const relays = useMemo<RelayState>(
    () => ({ inverter, block1, block2 }),
    [inverter, block1, block2],
  )

  const isLoading = inverterLoading || block1Loading || block2Loading
  const realtimeError = inverterError || block1Error || block2Error

  const aiSuggestedRelays = useMemo(() => computeAiRelayState(sensors), [sensors])

  const applyRelayState = useCallback(async (requestedRelays: RelayState, sourceLabel: string) => {
    const nextRelays = enforceRelayDependency(requestedRelays)
    const currentRelays = relays

    if (areRelayStatesEqual(currentRelays, nextRelays)) {
      setStatusMessage(`✅ ${sourceLabel}`)
      return
    }

    setIsSaving(true)
    setStatusMessage("")

    try {
      const turningOffInverter = currentRelays.inverter && !nextRelays.inverter
      const turningOnInverter = !currentRelays.inverter && nextRelays.inverter

      if (turningOffInverter) {
        if (currentRelays.block1) {
          await setBlock1(false)
        }
        if (currentRelays.block2) {
          await setBlock2(false)
        }
        await setInverter(false)
      } else {
        if (turningOnInverter) {
          await setInverter(true)
        }

        if (currentRelays.block1 !== nextRelays.block1) {
          await setBlock1(nextRelays.block1)
        }
        if (currentRelays.block2 !== nextRelays.block2) {
          await setBlock2(nextRelays.block2)
        }

        if (!turningOnInverter && currentRelays.inverter !== nextRelays.inverter) {
          await setInverter(nextRelays.inverter)
        }
      }

      setStatusMessage(`✅ ${sourceLabel}`)
      setLastUpdate(new Date().toISOString())
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown error"
      setStatusMessage(`❌ Erreur commande relais: ${details}`)
    } finally {
      setIsSaving(false)
    }
  }, [relays, setBlock1, setBlock2, setInverter])

  useEffect(() => {
    if (!isLoading) {
      setLastUpdate(new Date().toISOString())
    }
  }, [isLoading, relays.inverter, relays.block1, relays.block2])

  useEffect(() => {
    if (relays.inverter) {
      setRelayMemory({
        block1: relays.block1,
        block2: relays.block2,
      })
    }
  }, [relays.inverter, relays.block1, relays.block2])

  useEffect(() => {
    if (mode !== "ai" || isSaving || isLoading) return

    if (areRelayStatesEqual(relays, aiSuggestedRelays)) return

    void applyRelayState(aiSuggestedRelays, "Mode AI synchronise")
  }, [mode, aiSuggestedRelays, relays, isSaving, isLoading, applyRelayState])

  useEffect(() => {
    if (realtimeError) {
      setStatusMessage(`❌ Erreur realtime: ${realtimeError}`)
    }
  }, [realtimeError])

  const onModeChange = async (nextMode: ControlMode) => {
    setMode(nextMode)

    if (nextMode === "ai") {
      setStatusMessage("🤖 Mode AI active")
      return
    }

    setStatusMessage("🖐️ Mode manuel actif")
  }

  const onToggleRelay = async (key: keyof RelayState, checked: boolean) => {
    if (mode !== "manual" || isLoading || isSaving) return

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

    await applyRelayState(nextRelays, "Commande manuelle enregistree")
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
  const isBusy = isSaving || isLoading

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
            disabled={isBusy}
            className="rounded-lg shadow-sm"
          >
            <Hand className="w-4 h-4 mr-2" />
            Manuel
          </Button>
          <Button
            variant={mode === "ai" ? "default" : "ghost"}
            onClick={() => onModeChange("ai")}
            disabled={isBusy}
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
            const isDisabled = mode !== "manual" || isBusy || (item.key !== "inverter" && !relays.inverter)

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

        {isLoading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Power className="w-4 h-4 animate-pulse" />
            Synchronisation realtime en cours...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
