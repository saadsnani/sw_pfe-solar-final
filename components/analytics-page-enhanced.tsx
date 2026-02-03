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
  historicalData?: Array<{ time: string; production: number | null; consumption: number | null }>
}

export function AnalyticsPageEnhanced({ sensors, historicalData }: AnalyticsPageEnhancedProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const { addAlert } = useAlert()

  // Extract sensor data (null if not connected)
  const totalProduction = sensors?.production.value ?? null
  const totalConsumption = sensors?.consumption.value ?? null
  const isProductionConnected = sensors?.production.connected ?? false
  const isConsumptionConnected = sensors?.consumption.connected ?? false

  const hasHistory = (historicalData?.length ?? 0) > 0
  const lastHistory = hasHistory ? historicalData![historicalData!.length - 1] : null
  const displayProduction = totalProduction ?? lastHistory?.production ?? null
  const displayConsumption = totalConsumption ?? lastHistory?.consumption ?? null

  const handleExportPDF = async () => {
    try {
      if (!exportRef.current) {
        // Create a temporary export div if needed
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = `
          <div style="background: #f0f9ff; padding: 24px; border-radius: 8px;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Rapport Énergétique</h2>
            <p style="color: #666; margin-bottom: 24px;">Système Intelligent de Gestion d'Énergie</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div style="border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; background: white;">
                <p style="font-size: 12px; color: #666;">Production (instantanée)</p>
                <p style="font-size: 24px; font-weight: bold; color: #0284c7; margin-top: 8px;">${displayProduction !== null ? displayProduction.toFixed(1) : "--"} W</p>
              </div>
              <div style="border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; background: white;">
                <p style="font-size: 12px; color: #666;">Consommation (instantanée)</p>
                <p style="font-size: 24px; font-weight: bold; color: #6366f1; margin-top: 8px;">${displayConsumption !== null ? displayConsumption.toFixed(1) : "--"} W</p>
              </div>
              <div style="border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; background: white;">
                <p style="font-size: 12px; color: #666;">État Capteurs</p>
                <p style="font-size: 24px; font-weight: bold; color: #333; margin-top: 8px;">Connecté</p>
              </div>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="text-align: left; padding: 12px; border: 1px solid #e5e7eb;">Heure</th>
                  <th style="text-align: left; padding: 12px; border: 1px solid #e5e7eb;">Production (W)</th>
                  <th style="text-align: left; padding: 12px; border: 1px solid #e5e7eb;">Consommation (W)</th>
                </tr>
              </thead>
              <tbody>
                ${historicalData?.slice(-10).map((row, idx) => `
                  <tr style="border: 1px solid #e5e7eb;">
                    <td style="padding: 12px; border: 1px solid #e5e7eb;">${row.time}</td>
                    <td style="padding: 12px; border: 1px solid #e5e7eb;">${row.production !== null ? row.production.toFixed(1) : "--"}</td>
                    <td style="padding: 12px; border: 1px solid #e5e7eb;">${row.consumption !== null ? row.consumption.toFixed(1) : "--"}</td>
                  </tr>
                `).join("") || ""}
              </tbody>
            </table>
          </div>
        `
        document.body.appendChild(tempDiv)
        await exportToPDF(tempDiv, {
          filename: "analytics-report.pdf",
          title: "Rapport d'Analyse Énergétique",
          subject: "Analytics Report",
        })
        document.body.removeChild(tempDiv)
      } else {
        await exportToPDF(exportRef.current, {
          filename: "analytics-report.pdf",
          title: "Rapport d'Analyse Énergétique",
          subject: "Analytics Report",
        })
      }
      addAlert({
        type: "success",
        title: "Rapport Généré",
        message: "Le rapport PDF a été téléchargé avec succès",
      })
    } catch (error) {
      console.error("Export error:", error)
      addAlert({
        type: "error",
        title: "Erreur d'Export",
        message: error instanceof Error ? error.message : "Impossible de générer le rapport PDF",
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

  const hasData = isProductionConnected || isConsumptionConnected || hasHistory

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
        <div ref={reportRef} className="space-y-6 bg-card text-foreground p-6 rounded-lg border border-border">
          {/* Invoice Header */}
          <div className="border-b border-border pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Rapport Énergétique</h2>
                <p className="text-sm text-muted-foreground">Système Intelligent de Gestion d'Énergie</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Référence</div>
                <div className="text-base font-semibold">REP-{new Date().toISOString().slice(0, 10)}</div>
                <div className="text-sm text-muted-foreground mt-1">Date</div>
                <div className="text-sm font-medium">{new Date().toLocaleDateString("fr-FR")}</div>
              </div>
            </div>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground">Production (instantanée)</p>
              <p className="text-2xl font-bold text-primary">{displayProduction !== null ? displayProduction.toFixed(1) : "--"} W</p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground">Consommation (instantanée)</p>
              <p className="text-2xl font-bold text-energy-yellow">{displayConsumption !== null ? displayConsumption.toFixed(1) : "--"} W</p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground">État Capteurs</p>
              <p className="text-2xl font-bold text-slate-900">
                {isProductionConnected || isConsumptionConnected || hasHistory ? "Connecté" : "Déconnecté"}
              </p>
            </div>
          </div>
          {/* Current Metrics */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Métriques Actuelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayProduction !== null && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Production Actuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{displayProduction.toFixed(1)} W</div>
                    <p className="text-xs text-muted-foreground mt-1">Puissance instantanée</p>
                  </CardContent>
                </Card>
              )}

              {displayConsumption !== null && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Consommation Actuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-energy-yellow">{displayConsumption.toFixed(1)} W</div>
                    <p className="text-xs text-muted-foreground mt-1">Puissance consommée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Tendances Énergétiques</h2>
            <EnergyChart sensors={sensors} historicalData={historicalData} />
          </div>

          {/* Table */}
          {hasHistory && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Journal de Mesures</h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Heure</th>
                      <th className="text-left py-3 px-4 font-semibold">Production (W)</th>
                      <th className="text-left py-3 px-4 font-semibold">Consommation (W)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData!
                      .slice(-10)
                      .map((row, idx) => (
                        <tr key={`${row.time}-${idx}`} className="border-t border-border">
                          <td className="py-2 px-4">{row.time}</td>
                          <td className="py-2 px-4">{row.production !== null ? row.production.toFixed(1) : "--"}</td>
                          <td className="py-2 px-4">{row.consumption !== null ? row.consumption.toFixed(1) : "--"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                      {totalProduction !== null && (
                        <div className="text-sm text-muted-foreground">Valeur: {totalProduction.toFixed(2)} W</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Dernière mise à jour: {sensors?.production.lastUpdate ? new Date(sensors.production.lastUpdate).toLocaleTimeString() : "N/A"}
                      </div>
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
                      {totalConsumption !== null && (
                        <div className="text-sm text-muted-foreground">Valeur: {totalConsumption.toFixed(2)} W</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Dernière mise à jour: {sensors?.consumption.lastUpdate ? new Date(sensors.consumption.lastUpdate).toLocaleTimeString() : "N/A"}
                      </div>
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

      {/* Offscreen export layout (light invoice) */}
      {hasData && (
        <div className="absolute -left-[9999px] top-0 w-[1024px]">
          <div ref={exportRef} className="space-y-6 bg-sky-50 text-slate-900 p-6 rounded-lg border border-sky-200">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Rapport Énergétique</h2>
                  <p className="text-sm text-slate-500">Système Intelligent de Gestion d'Énergie</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Référence</div>
                  <div className="text-base font-semibold">REP-{new Date().toISOString().slice(0, 10)}</div>
                  <div className="text-sm text-slate-500 mt-1">Date</div>
                  <div className="text-sm font-medium">{new Date().toLocaleDateString("fr-FR")}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-sky-200 bg-white p-4">
                <p className="text-xs text-slate-500">Production (instantanée)</p>
                <p className="text-2xl font-bold text-sky-600">{displayProduction !== null ? displayProduction.toFixed(1) : "--"} W</p>
              </div>
              <div className="rounded-lg border border-sky-200 bg-white p-4">
                <p className="text-xs text-slate-500">Consommation (instantanée)</p>
                <p className="text-2xl font-bold text-indigo-600">{displayConsumption !== null ? displayConsumption.toFixed(1) : "--"} W</p>
              </div>
              <div className="rounded-lg border border-sky-200 bg-white p-4">
                <p className="text-xs text-slate-500">État Capteurs</p>
                <p className="text-2xl font-bold text-slate-900">
                  {isProductionConnected || isConsumptionConnected || hasHistory ? "Connecté" : "Déconnecté"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-900">Métriques Actuelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayProduction !== null && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">Production Actuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-sky-600">{displayProduction.toFixed(1)} W</div>
                      <p className="text-xs text-slate-500 mt-1">Puissance instantanée</p>
                    </CardContent>
                  </Card>
                )}

                {displayConsumption !== null && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">Consommation Actuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-indigo-600">{displayConsumption.toFixed(1)} W</div>
                      <p className="text-xs text-slate-500 mt-1">Puissance consommée</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {hasHistory && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Journal de Mesures</h2>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Heure</th>
                        <th className="text-left py-3 px-4 font-semibold">Production (W)</th>
                        <th className="text-left py-3 px-4 font-semibold">Consommation (W)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalData!
                        .slice(-10)
                        .map((row, idx) => (
                          <tr key={`${row.time}-export-${idx}`} className="border-t border-slate-200">
                            <td className="py-2 px-4">{row.time}</td>
                            <td className="py-2 px-4">{row.production !== null ? row.production.toFixed(1) : "--"}</td>
                            <td className="py-2 px-4">{row.consumption !== null ? row.consumption.toFixed(1) : "--"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
