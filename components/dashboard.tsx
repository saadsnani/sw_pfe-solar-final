"use client"

import { useState, lazy, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"

// Lazy load heavy pages for better performance
const AnalyticsPageEnhanced = lazy(() => import("@/components/analytics-page-enhanced").then(m => ({ default: m.AnalyticsPageEnhanced })))
const AIPredictionsPage = lazy(() => import("@/components/ai-predictions-page").then(m => ({ default: m.AIPredictionsPage })))
const SettingsPage = lazy(() => import("@/components/settings-page").then(m => ({ default: m.SettingsPage })))
const SystemHealthPage = lazy(() => import("@/components/system-health-page").then(m => ({ default: m.SystemHealthPage })))
const ProfilePage = lazy(() => import("@/components/profile-page").then(m => ({ default: m.ProfilePage })))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

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
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AnalyticsPageEnhanced />
          </Suspense>
        )
      case "ai-predictions":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AIPredictionsPage />
          </Suspense>
        )
      case "settings":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SettingsPage />
          </Suspense>
        )
      case "system-health":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SystemHealthPage />
          </Suspense>
        )
      case "profile":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        )
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
