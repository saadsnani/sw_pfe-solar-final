"use client"

import { useState, lazy, Suspense } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"

// Lazy load heavy pages for better performance
const AnalyticsPageEnhanced = lazy(() => import("@/components/analytics-page-enhanced").then((m) => ({ default: m.AnalyticsPageEnhanced })))
const AIPredictionsPage = lazy(() => import("@/components/ai-predictions-page").then((m) => ({ default: m.AIPredictionsPage })))
const SettingsPage = lazy(() => import("@/components/settings-page").then((m) => ({ default: m.SettingsPage })))
const SystemHealthPage = lazy(() => import("@/components/system-health-page").then((m) => ({ default: m.SystemHealthPage })))
const ProfilePage = lazy(() => import("@/components/profile-page").then((m) => ({ default: m.ProfilePage })))
// Logs Connexions page removed per request

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

interface DashboardProps {
  onLogout: () => void
  userEmail?: string
}

export type PageType =
  | "dashboard"
  | "analytics"
  | "ai-predictions"
  | "settings"
  | "system-health"
  | "profile"

export function Dashboard({ onLogout, userEmail }: DashboardProps) {
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
    <div className="min-h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page)
          setSidebarCollapsed(true) // Auto-close on mobile after selection
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userEmail={userEmail}
      />
      
      <div className="flex flex-col min-h-screen">
        <Header 
          onLogout={onLogout} 
          userEmail={userEmail}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMenuOpen={!sidebarCollapsed}
          showBackButton={false}
        />
        <main className="flex-1 p-3 sm:p-4 md:p-8 overflow-auto overflow-x-hidden w-full">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
