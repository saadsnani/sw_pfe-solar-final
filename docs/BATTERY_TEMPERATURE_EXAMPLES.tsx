// ===============================================
// Exemples d'Utilisation - Température Batterie
// ===============================================

// ===== EXEMPLE 1: Utiliser le Hook =====
'use client'

import { useBatteryTemperature } from '@/hooks/use-battery-temperature'

export function MonComposant() {
  const data = useBatteryTemperature()

  return (
    <div>
      <p>Température: {data.batteryTemperature}°C</p>
      <p>Statut: {data.status}</p>
      <p>Connecté: {data.isConnected ? 'Oui' : 'Non'}</p>
      {data.lastUpdate && (
        <p>Mis à jour: {data.lastUpdate.toLocaleTimeString()}</p>
      )}
    </div>
  )
}

// ===== EXEMPLE 2: Envoyer une Température =====
'use client'

import { useSendBatteryTemperature } from '@/hooks/use-battery-temperature'
import { Button } from '@/components/ui/button'

export function EnvoiTemperature() {
  const { send } = useSendBatteryTemperature()

  const handleSend = async () => {
    try {
      const result = await send(35.5)
      console.log('Envoyé:', result)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return <Button onClick={handleSend}>Envoyer 35.5°C</Button>
}

// ===== EXEMPLE 3: Utiliser les Utilitaires =====
'use client'

import { 
  sendBatteryTemperature,
  getBatteryTemperatureReadings,
  getBatteryTemperatureStatus,
  getBatteryTemperatureLabel,
  formatBatteryTemperature
} from '@/lib/battery-temperature-utils'

export async function MonUtilitaire() {
  // Envoyer
  const result1 = await sendBatteryTemperature(35.5)
  console.log(result1) // { success: true, message: "...", data: {...} }

  // Récupérer
  const result2 = await getBatteryTemperatureReadings()
  console.log(result2) // { current: {...}, readings: [...], count: N }

  // Obtenir statut
  const status = getBatteryTemperatureStatus(35.5) // "normal"
  const label = getBatteryTemperatureLabel(status) // "Normal"
  const formatted = formatBatteryTemperature(35.5) // "35.5"

  return <div>{formatted}°C - {label}</div>
}

// ===== EXEMPLE 4: Créer une Alerte =====
'use client'

import { useEffect, useState } from 'react'
import { useBatteryTemperature } from '@/hooks/use-battery-temperature'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export function AlerteTemperature() {
  const data = useBatteryTemperature()
  const [alerteActive, setAlerteActive] = useState(false)

  useEffect(() => {
    if (data.batteryTemperature && data.batteryTemperature > 60) {
      setAlerteActive(true)
    } else {
      setAlerteActive(false)
    }
  }, [data.batteryTemperature])

  if (!alerteActive) return null

  return (
    <Alert variant="destructive">
      <AlertTitle>⚠️ Alerte Température</AlertTitle>
      <AlertDescription>
        La batterie est surchauffée: {data.batteryTemperature}°C
      </AlertDescription>
    </Alert>
  )
}

// ===== EXEMPLE 5: Envoyer à Intervalle Régulier =====
'use client'

import { useEffect } from 'react'
import { sendBatteryTemperature } from '@/lib/battery-temperature-utils'

export function EnvoiRegulier() {
  useEffect(() => {
    // Envoyer une température toutes les 5 secondes
    const interval = setInterval(async () => {
      const temp = 20 + Math.random() * 40 // Simulation
      await sendBatteryTemperature(temp)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return <div>Envoi en cours...</div>
}

// ===== EXEMPLE 6: Dashboard Personnalisé =====
'use client'

import { useBatteryTemperature } from '@/hooks/use-battery-temperature'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardBatterie() {
  const data = useBatteryTemperature()

  const getGradient = (temp: number | null) => {
    if (!temp) return 'bg-gray-200'
    if (temp < 20) return 'bg-blue-200'
    if (temp < 40) return 'bg-green-200'
    if (temp < 60) return 'bg-yellow-200'
    return 'bg-red-200'
  }

  const getProgress = (temp: number | null) => {
    if (!temp) return 0
    return Math.min((temp / 80) * 100, 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batterie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`h-32 rounded-lg ${getGradient(data.batteryTemperature)} flex items-center justify-center`}>
          <div className="text-4xl font-bold">
            {data.batteryTemperature}°C
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-red-500 h-4 rounded-full transition-all"
            style={{ width: `${getProgress(data.batteryTemperature)}%` }}
          ></div>
        </div>

        {/* Info */}
        <div className="text-sm">
          <p>Statut: <strong>{data.status}</strong></p>
          <p>Connecté: {data.isConnected ? '✓' : '✗'}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ===== EXEMPLE 7: Avec fetch Direct =====
'use client'

import { useEffect, useState } from 'react'

interface BatteryData {
  batteryTemperature: number
  timestamp: string
}

export function UtilisateurAvance() {
  const [data, setData] = useState<BatteryData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensor-data?type=battery')
        const result = await response.json()
        setData(result.current)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  return <div>{data?.batteryTemperature}°C</div>
}

// ===== EXEMPLE 8: Valider les Données =====
export function ValiderTemperature(temp: number): boolean {
  if (isNaN(temp)) return false
  if (temp < -40 || temp > 125) return false // Range DS18B20
  return true
}

export async function EnvoyerSecurise(temp: number) {
  if (!ValiderTemperature(temp)) {
    console.error('Température invalide:', temp)
    return
  }

  try {
    const response = await fetch('/api/sensor-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batteryTemperature: temp }),
    })

    if (!response.ok) throw new Error('Erreur API')
    return await response.json()
  } catch (error) {
    console.error('Erreur:', error)
  }
}

// ===== EXEMPLE 9: Avec TypeScript Fort =====
import type { BatteryTemperatureData } from '@/hooks/use-battery-temperature'

export function ComposantTypeSafe(): React.ReactNode {
  const data: BatteryTemperatureData = {
    batteryTemperature: 35.5,
    isConnected: true,
    lastUpdate: new Date(),
    status: 'normal',
  }

  const display = (): string => {
    switch (data.status) {
      case 'cold':
        return `❄️ Froid: ${data.batteryTemperature}°C`
      case 'normal':
        return `✓ Normal: ${data.batteryTemperature}°C`
      case 'warm':
        return `⚠️ Chaud: ${data.batteryTemperature}°C`
      case 'critical':
        return `🔥 Critique: ${data.batteryTemperature}°C`
      default:
        return 'Déconnecté'
    }
  }

  return <div>{display()}</div>
}

// ===== EXEMPLE 10: Combiner avec d'autres Données =====
'use client'

import { useBatteryTemperature } from '@/hooks/use-battery-temperature'
import { useSystemSensors } from '@/hooks/use-sensor-connection'

export function SystemeComplet() {
  const battery = useBatteryTemperature()
  const system = useSystemSensors()

  return (
    <div className="grid gap-4">
      <div>
        <h3>Batterie</h3>
        <p>Temp: {battery.batteryTemperature}°C</p>
      </div>

      <div>
        <h3>Système</h3>
        <p>Production: {system.state.production}W</p>
        <p>Consommation: {system.state.consumption}W</p>
      </div>

      {battery.status === 'critical' && system.state.production > 0 && (
        <div className="alert">
          ⚠️ Batterie trop chaude mais production élevée
        </div>
      )}
    </div>
  )
}
