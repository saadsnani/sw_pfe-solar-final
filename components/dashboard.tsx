"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogOut,
  Sun,
  Zap,
  Battery,
  Gauge,
  RefreshCw,
  Thermometer,
  Power,
  Bell,
  Wifi,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  User,
} from "lucide-react"
import KpiCard from "@/components/kpi-card"
import EnergyChart from "@/components/energy-chart"
import BatteryChart from "@/components/battery-chart"
import SystemStatus from "@/components/system-status"
import AlertsPanel from "@/components/alerts-panel"
import AiPredictions from "@/components/ai-predictions"
import WeatherWidget from "@/components/weather-widget"
import EcoScore from "@/components/eco-score"
import ReportGenerator from "@/components/report-generator"

interface DashboardProps {
  onLogout: () => void
}

function generateRandomData() {
  return {
    energyToday: (Math.random() * 5 + 2).toFixed(2),
    batteryLevel: Math.floor(Math.random() * 40 + 60),
    batteryVoltage: (Math.random() * 1.5 + 12).toFixed(1),
    panelEfficiency: Math.floor(Math.random() * 15 + 80),
    panelVoltage: (Math.random() * 5 + 30).toFixed(1),
    panelCurrent: (Math.random() * 3 + 2).toFixed(2),
    temperature: Math.floor(Math.random() * 15 + 25),
    powerOutput: (Math.random() * 200 + 100).toFixed(0),
    inverterStatus: Math.random() > 0.1,
  }
}

function generateChartData() {
  const hours = Array.from({ length: 12 }, (_, i) => `${6 + i}:00`)
  return hours.map((hour) => ({
    hour,
    production: Math.random() * 400 + 50,
    consumption: Math.random() * 200 + 30,
  }))
}

function generateBatteryHistory() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  let soc = 40
  return hours.map((hour) => {
    soc = Math.min(100, Math.max(20, soc + (Math.random() - 0.4) * 10))
    return { hour, soc: Math.round(soc), voltage: (12 + (soc / 100) * 1.2).toFixed(1) }
  })
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [pvSystemOn, setPvSystemOn] = useState(true)
  const [data, setData] = useState(generateRandomData())
  const [chartData, setChartData] = useState(generateChartData())
  const [batteryHistory, setBatteryHistory] = useState(generateBatteryHistory())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const dataTimer = setInterval(() => setData(generateRandomData()), 30000)
    return () => clearInterval(dataTimer)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setData(generateRandomData())
    setChartData(generateChartData())
    setBatteryHistory(generateBatteryHistory())
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex flex-col">
          {/* Top bar with university branding */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/30">
            <div className="flex items-center gap-3">
              {/* University Logo */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1.5 shadow-md">
                <Image
                  src="/image.png"
                  alt="EST Fès Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-primary">École Supérieure de Technologie Fès</h2>
                <p className="text-xs text-muted-foreground">Université Sidi Mohamed Ben Abdellah</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-muted-foreground">Encadré par</p>
                  <p className="font-medium">Mr. Abdelaziz FRI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-muted-foreground">Réalisé par</p>
                  <p className="font-medium">Walid EL HALOUAT & Saad SNANI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main navigation bar */}
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold">Solar PV Dashboard</h1>
                <p className="text-[10px] text-muted-foreground">Intelligent Off-Grid System - PFE 2024/2025</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-medium">{currentTime.toLocaleTimeString("fr-FR")}</span>
                <span className="text-[10px] text-muted-foreground">{currentTime.toLocaleDateString("fr-FR")}</span>
              </div>

              <Badge variant="outline" className="gap-1.5 text-xs">
                <Wifi className="h-3 w-3 text-accent" />
                <span className="hidden sm:inline">ESP32</span>
              </Badge>

              <Badge variant={pvSystemOn ? "default" : "secondary"} className="gap-1.5 text-xs">
                <Power className="h-3 w-3" />
                {pvSystemOn ? "Online" : "Offline"}
              </Badge>

              <ReportGenerator data={data} />

              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-destructive-foreground">
                  3
                </span>
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>

              <Button variant="ghost" size="sm" onClick={onLogout} className="h-8">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-xs">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Energy Today"
            value={`${data.energyToday} kWh`}
            icon={Zap}
            trend={+12.5}
            description="Total production"
            color="primary"
          />
          <KpiCard
            title="Battery SOC"
            value={`${data.batteryLevel}%`}
            subtitle={`${data.batteryVoltage}V`}
            icon={Battery}
            trend={data.batteryLevel > 80 ? +5 : -3}
            description={data.batteryLevel > 50 ? "Healthy" : "Low charge"}
            color="accent"
          />
          <KpiCard
            title="Panel Efficiency"
            value={`${data.panelEfficiency}%`}
            icon={Gauge}
            trend={+2.3}
            description="MPPT tracking"
            color="primary"
          />
          <KpiCard
            title="Temperature"
            value={`${data.temperature}°C`}
            icon={Thermometer}
            trend={-1.2}
            description="System temp"
            color="muted"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeatherWidget />
          <EcoScore energyProduced={Number(data.energyToday)} batteryLevel={data.batteryLevel} />
        </div>

        {/* System Control Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Power className="h-5 w-5 text-primary" />
                  System Control
                </CardTitle>
                <CardDescription>PV system power management</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">PV System</span>
                <Switch checked={pvSystemOn} onCheckedChange={setPvSystemOn} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Panel Voltage</p>
                <p className="text-lg font-semibold">{data.panelVoltage}V</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Panel Current</p>
                <p className="text-lg font-semibold">{data.panelCurrent}A</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Power Output</p>
                <p className="text-lg font-semibold">{data.powerOutput}W</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Inverter</p>
                <div className="flex items-center gap-2">
                  {data.inverterStatus && pvSystemOn ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-accent">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs defaultValue="production" className="space-y-4">
          <TabsList>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="battery">Battery</TabsTrigger>
            <TabsTrigger value="ai">AI Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Production vs Consumption
                </CardTitle>
                <CardDescription>Energy flow over the last 12 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyChart data={chartData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="battery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5 text-accent" />
                  Battery State of Charge
                </CardTitle>
                <CardDescription>24-hour SOC history</CardDescription>
              </CardHeader>
              <CardContent>
                <BatteryChart data={batteryHistory} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <AiPredictions batteryLevel={data.batteryLevel} currentProduction={Number(data.energyToday)} />
          </TabsContent>
        </Tabs>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SystemStatus
            batteryVoltage={Number.parseFloat(data.batteryVoltage)}
            panelVoltage={Number.parseFloat(data.panelVoltage)}
            inverterStatus={data.inverterStatus && pvSystemOn}
            temperature={data.temperature}
          />
          <AlertsPanel />
        </div>

        {/* Footer */}
        <footer className="border-t border-border pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              <span>Solar PV Dashboard - Intelligent Off-Grid System v1.0</span>
            </div>
            <div className="text-center">
              <span>PFE 2024/2025 - EST Fès - Encadré par Mr. Abdelaziz FRI</span>
            </div>
            <div>
              <span>Walid EL HALOUAT & Saad SNANI</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
