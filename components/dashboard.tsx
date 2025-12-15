"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"
import { AnalyticsPage } from "@/components/analytics-page"
import { AnalyticsPageEnhanced } from "@/components/analytics-page-enhanced"
import { AIPredictionsPage } from "@/components/ai-predictions-page"
import { SettingsPage } from "@/components/settings-page"
import { SystemHealthPage } from "@/components/system-health-page"
import { ProfilePage } from "@/components/profile-page"

interface DashboardProps {
  onLogout: () => void
}

export type PageType = "dashboard" | "analytics" | "ai-predictions" | "settings" | "system-health" | "profile"

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />
      case "analytics":
        return <AnalyticsPageEnhanced />
      case "ai-predictions":
        return <AIPredictionsPage />
      case "settings":
        return <SettingsPage />
      case "system-health":
        return <SystemHealthPage />
      case "profile":
        return <ProfilePage />
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
