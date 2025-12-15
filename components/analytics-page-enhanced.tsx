"use client"

import { useRef } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnergyChart } from "@/components/energy-chart"
import { useAlert } from "@/lib/alert-provider"
import { exportToPDF, downloadJSON } from "@/lib/export-utils"

export function AnalyticsPageEnhanced() {
  const reportRef = useRef<HTMLDivElement>(null)
  const { addAlert } = useAlert()

  const mockAnalyticsData = {
    month: "November 2024",
    totalProduction: 1250,
    totalConsumption: 980,
    efficiency: 78.4,
    costSavings: 450,
    peakProduction: 8.5,
    averageProduction: 5.2,
    monthOverMonth: 12.5,
    comparison: {
      previousMonth: {
        production: 1112,
        consumption: 1050,
      },
      currentMonth: {
        production: 1250,
        consumption: 980,
      },
    },
  }

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
      downloadJSON(mockAnalyticsData, "analytics-data.json")
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyses Détaillées</h1>
        <p className="text-muted-foreground">Rapports et tendances d'énergie</p>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleExportPDF}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter en PDF
        </Button>
        <Button
          onClick={handleExportJSON}
          variant="outline"
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Exporter JSON
        </Button>
      </div>

      {/* Analytics Content */}
      <div ref={reportRef} className="space-y-6 bg-white dark:bg-slate-950 p-6 rounded-lg">
        {/* Key Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Métriques Clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Production Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.totalProduction} kWh</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% vs mois précédent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Consommation Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.totalConsumption} kWh</div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">-6.7% vs mois précédent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Efficacité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.efficiency}%</div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Excellente performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Économies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.costSavings}€</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Coût évité ce mois</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Tendances Énergétiques</h2>
          <EnergyChart />
        </div>

        {/* Comparison */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Comparaison Mois sur Mois</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mois Précédent</CardTitle>
                <CardDescription>Octobre 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Production</span>
                  <span className="font-semibold">{mockAnalyticsData.comparison.previousMonth.production} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consommation</span>
                  <span className="font-semibold">{mockAnalyticsData.comparison.previousMonth.consumption} kWh</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mois Actuel</CardTitle>
                <CardDescription>Novembre 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Production</span>
                  <span className="font-semibold">{mockAnalyticsData.comparison.currentMonth.production} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consommation</span>
                  <span className="font-semibold">{mockAnalyticsData.comparison.currentMonth.consumption} kWh</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Résumé Mensuel</h2>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between border-b pb-3">
                <span className="text-muted-foreground">Pic de production</span>
                <span className="font-semibold">{mockAnalyticsData.peakProduction} kW</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-muted-foreground">Production moyenne</span>
                <span className="font-semibold">{mockAnalyticsData.averageProduction} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Variation mois sur mois</span>
                <span className="font-semibold text-green-600 dark:text-green-400">+{mockAnalyticsData.monthOverMonth}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
