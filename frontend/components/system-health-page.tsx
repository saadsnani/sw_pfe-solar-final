"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Cpu, Wifi, Battery, Thermometer, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface StatusItemProps {
  icon: React.ReactNode
  label: string
  value: string
  status: "ok" | "warning" | "error"
  detail?: string
}

function StatusItem({ icon, label, value, status, detail }: StatusItemProps) {
  const statusColors = {
    ok: { bg: "bg-energy-green/20", text: "text-energy-green", icon: <CheckCircle className="w-4 h-4" /> },
    warning: { bg: "bg-energy-yellow/20", text: "text-energy-yellow", icon: <AlertTriangle className="w-4 h-4" /> },
    error: { bg: "bg-energy-red/20", text: "text-energy-red", icon: <XCircle className="w-4 h-4" /> },
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl ${statusColors[status].bg} flex items-center justify-center ${statusColors[status].text}`}
        >
          {icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-foreground">{value}</span>
        <div className={`${statusColors[status].text}`}>{statusColors[status].icon}</div>
      </div>
    </div>
  )
}

export function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Santé du Système</h1>
        <p className="text-muted-foreground">Surveillance de tous les composants et capteurs</p>
      </div>

      {/* Overall Status */}
      <Card className="bg-energy-green/10 border-energy-green/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-energy-green/20 flex items-center justify-center">
              <Activity className="w-8 h-8 text-energy-green" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">État du Système : En Bonne Santé</h2>
              <p className="text-muted-foreground">Tous les composants fonctionnent dans les paramètres normaux</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Status */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Composants Matériels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusItem
              icon={<Cpu className="w-5 h-5" />}
              label="Contrôleur ESP32"
              value="En Ligne"
              status="ok"
              detail="Disponibilité : 48h 32m"
            />
            <StatusItem
              icon={<Wifi className="w-5 h-5" />}
              label="Connexion WiFi"
              value="-45 dBm"
              status="ok"
              detail="Signal : Excellent"
            />
            <StatusItem
              icon={<Activity className="w-5 h-5" />}
              label="Contrôleur MPPT"
              value="Actif"
              status="ok"
              detail="Efficacité : 98.2%"
            />
            <StatusItem
              icon={<Battery className="w-5 h-5" />}
              label="Onduleur"
              value="230V AC"
              status="ok"
              detail="Charge : 450W"
            />
          </CardContent>
        </Card>

        {/* Sensor Status */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Capteurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusItem
              icon={<Activity className="w-5 h-5" />}
              label="ACS712 - Courant PV"
              value="8.2A"
              status="ok"
              detail="Calibré"
            />
            <StatusItem
              icon={<Activity className="w-5 h-5" />}
              label="ACS712 - Courant Charge"
              value="3.8A"
              status="ok"
              detail="Calibré"
            />
            <StatusItem
              icon={<Activity className="w-5 h-5" />}
              label="INA219 - Batterie"
              value="12.8V / 2.1A"
              status="ok"
              detail="Mode précision"
            />
            <StatusItem
              icon={<Thermometer className="w-5 h-5" />}
              label="Capteur Température"
              value="28°C"
              status="ok"
              detail="Temp. batterie"
            />
          </CardContent>
        </Card>

        {/* Battery Health */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-primary" />
              Santé de la Batterie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-energy-green">85%</p>
                <p className="text-sm text-muted-foreground">État de Charge</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-sm text-muted-foreground">État de Santé</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">243</p>
                <p className="text-sm text-muted-foreground">Nombre de Cycles</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">28°C</p>
                <p className="text-sm text-muted-foreground">Température</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-energy-green/10 border border-energy-green/30">
              <p className="text-sm text-energy-green font-medium">État de la batterie : Excellent</p>
              <p className="text-xs text-muted-foreground mt-1">Durée de vie restante estimée : 4-5 ans</p>
            </div>
          </CardContent>
        </Card>

        {/* Communication */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-energy-green">1s</p>
                <p className="text-sm text-muted-foreground">Intervalle de Mise à Jour</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">23ms</p>
                <p className="text-sm text-muted-foreground">Latence</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Erreurs (24h)</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">12.4k</p>
                <p className="text-sm text-muted-foreground">Messages (24h)</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Adresse IP ESP32</span>
                <span className="font-mono text-sm text-foreground">192.168.1.100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connexion Serveur</span>
                <span className="text-sm text-energy-green font-medium">Connecté</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
