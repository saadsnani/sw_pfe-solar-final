"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"
import { AnalyticsPage } from "@/components/analytics-page"
import { AIPredictionsPage } from "@/components/ai-predictions-page"
import { SettingsPage } from "@/components/settings-page"
import { SystemHealthPage } from "@/components/system-health-page"
import { ConsumptionManagement } from "@/components/consumption-management"
import { AutonomyEstimation } from "@/components/autonomy-estimation"

interface DashboardProps {
  onLogout: () => void
}

export type PageType = "dashboard" | "analytics" | "ai-predictions" | "settings" | "system-health" | "consumption" | "autonomy"

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />
      case "analytics":
        return <AnalyticsPage />
      case "ai-predictions":
        return <AIPredictionsPage />
      case "settings":
        return <SettingsPage />
      case "system-health":
        return <SystemHealthPage />
      case "consumption":
        return <ConsumptionManagement />
      case "autonomy":
        return <AutonomyEstimation />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onLogout={onLogout} />
        <main className="flex-1 p-6 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
