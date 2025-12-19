"use client"

import { useRef } from "react"
import { Download, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnergyChart } from "@/components/energy-chart"
import { useAlert } from "@/lib/alert-provider"
import { exportToPDF, downloadJSON } from "@/lib/export-utils"
import type { SystemSensorsState } from "@/lib/sensor-connection"

interface AnalyticsPageEnhancedProps {
  sensors?: SystemSensorsState
}

export function AnalyticsPageEnhanced({ sensors }: AnalyticsPageEnhancedProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const { addAlert } = useAlert()

  // Extract sensor data (null if not connected)
  const totalProduction = sensors?.production.value ?? null
  const totalConsumption = sensors?.consumption.value ?? null
  const isProductionConnected = sensors?.production.connected ?? false
  const isConsumptionConnected = sensors?.consumption.connected ?? false

  const handleExportPDF = async () => {
    try {
      if (!reportRef.current) return
      await exportToPDF(reportRef.current, {
        filename: "analytics-report.pdf",
        title: "Rapport d'Analyse Énergétique",
        subject: "Analytics Report",
      })
      addAlert({
        type: "success",
        title: "Rapport Généré",
        message: "Le rapport PDF a été téléchargé avec succès",
      })
    } catch (error) {
      addAlert({
        type: "error",
        title: "Erreur d'Export",
        message: "Impossible de générer le rapport PDF",
      })
    }
  }

  const handleExportJSON = () => {
    try {
      const dataToExport = {
        timestamp: new Date().toISOString(),
        production: totalProduction,
        consumption: totalConsumption,
        isProductionConnected,
        isConsumptionConnected,
      }
      downloadJSON(dataToExport, "analytics-data.json")
      addAlert({
        type: "success",
        title: "Données Exportées",
        message: "Les données JSON ont été téléchargées avec succès",
      })
    } catch (error) {
      addAlert({
        type: "error",
        title: "Erreur d'Export",
        message: "Impossible d'exporter les données JSON",
      })
    }
  }

  const hasData = isProductionConnected || isConsumptionConnected

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyses Détaillées</h1>
        <p className="text-muted-foreground">Rapports et tendances d'énergie</p>
      </div>

      {/* No Data Alert */}
      {!hasData && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Aucun capteur connecté</p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  Les données analytiques seront disponibles une fois que les capteurs de production et de consommation seront connectés.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleExportPDF}
          className="gap-2"
          disabled={!hasData}
        >
          <Download className="h-4 w-4" />
          Exporter en PDF
        </Button>
        <Button
          onClick={handleExportJSON}
          variant="outline"
          className="gap-2"
          disabled={!hasData}
        >
          <FileText className="h-4 w-4" />
          Exporter JSON
        </Button>
      </div>

      {/* Analytics Content */}
      {hasData ? (
        <div ref={reportRef} className="space-y-6 bg-white dark:bg-slate-950 p-6 rounded-lg">
          {/* Current Metrics */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Métriques Actuelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isProductionConnected && totalProduction !== null && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Production Actuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalProduction.toFixed(1)} W</div>
                    <p className="text-xs text-muted-foreground mt-1">Puissance instantanée</p>
                  </CardContent>
                </Card>
              )}

              {isConsumptionConnected && totalConsumption !== null && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Consommation Actuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalConsumption.toFixed(1)} W</div>
                    <p className="text-xs text-muted-foreground mt-1">Puissance consommée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Tendances Énergétiques</h2>
            <EnergyChart />
          </div>

          {/* Sensor Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">État des Capteurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Capteur Production</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isProductionConnected ? (
                    <>
                      <div className="text-sm text-green-600 dark:text-green-400 font-semibold">✓ Connecté</div>
                      {totalProduction !== null && <div className="text-sm text-muted-foreground">Valeur: {totalProduction.toFixed(2)} W</div>}
                      <div className="text-xs text-muted-foreground">Dernière mise à jour: {sensors?.production.lastUpdate ? new Date(sensors.production.lastUpdate).toLocaleTimeString() : 'N/A'}</div>
                    </>
                  ) : (
                    <div className="text-sm text-red-600 dark:text-red-400 font-semibold">✗ Non connecté</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Capteur Consommation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isConsumptionConnected ? (
                    <>
                      <div className="text-sm text-green-600 dark:text-green-400 font-semibold">✓ Connecté</div>
                      {totalConsumption !== null && <div className="text-sm text-muted-foreground">Valeur: {totalConsumption.toFixed(2)} W</div>}
                      <div className="text-xs text-muted-foreground">Dernière mise à jour: {sensors?.consumption.lastUpdate ? new Date(sensors.consumption.lastUpdate).toLocaleTimeString() : 'N/A'}</div>
                    </>
                  ) : (
                    <div className="text-sm text-red-600 dark:text-red-400 font-semibold">✗ Non connecté</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Connectez les capteurs pour voir les analyses</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
