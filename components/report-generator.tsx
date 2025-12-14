"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2, CheckCircle2 } from "lucide-react"

interface ReportGeneratorProps {
  data: {
    energyToday: string
    batteryLevel: number
    panelEfficiency: number
    temperature: number
  }
}

export default function ReportGenerator({ data }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setIsComplete(false)

    // Simulate PDF generation process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create report content
    const reportContent = `
RAPPORT TECHNIQUE - SYSTÈME PHOTOVOLTAÏQUE
=============================================
Date: ${new Date().toLocaleDateString("fr-FR")}
Heure: ${new Date().toLocaleTimeString("fr-FR")}

ÉCOLE SUPÉRIEURE DE TECHNOLOGIE FÈS
Projet de Fin d'Études 2024-2025

Encadré par: Mr. Abdelaziz FRI
Réalisé par: Walid EL HALOUAT & Saad SNANI

---------------------------------------------
RÉSUMÉ DES PERFORMANCES
---------------------------------------------

Production Énergétique Journalière: ${data.energyToday} kWh
État de Charge Batterie (SOC): ${data.batteryLevel}%
Efficacité des Panneaux: ${data.panelEfficiency}%
Température Système: ${data.temperature}°C

---------------------------------------------
ANALYSE
---------------------------------------------

Le système fonctionne dans les paramètres optimaux.
MPPT tracking actif et stable.
Aucune anomalie détectée.

---------------------------------------------
RECOMMANDATIONS
---------------------------------------------

1. Maintenir le nettoyage régulier des panneaux
2. Surveiller la température en période de forte chaleur
3. Vérifier les connexions mensuellement

=============================================
Rapport généré automatiquement par Solar PV Dashboard v1.0
    `.trim()

    // Create and download the file
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rapport-pv-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
    setIsComplete(true)

    // Reset complete state after 3 seconds
    setTimeout(() => setIsComplete(false), 3000)
  }

  return (
    <Button
      onClick={handleGenerateReport}
      disabled={isGenerating}
      variant="outline"
      className="gap-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all bg-transparent"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Export en cours...</span>
        </>
      ) : isComplete ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span className="hidden sm:inline">Téléchargé!</span>
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">Générer Rapport</span>
        </>
      )}
    </Button>
  )
}
