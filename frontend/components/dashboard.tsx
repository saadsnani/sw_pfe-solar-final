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
const RelayControlPage = lazy(() => import("@/components/relay-control-page").then((m) => ({ default: m.RelayControlPage })))
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
  | "relay-control"
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
      case "relay-control":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RelayControlPage />
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
    <div className="min-h-screen app-shell-bg">
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
      
      <div className="relative flex min-h-screen flex-col">
        <Header 
          onLogout={onLogout} 
          userEmail={userEmail}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMenuOpen={!sidebarCollapsed}
          showBackButton={false}
        />
        <main className="relative z-10 flex-1 w-full overflow-auto overflow-x-hidden px-2 pb-4 pt-[98px] sm:px-3 sm:pb-6 sm:pt-[112px] md:px-6 md:pb-8 md:pt-[118px]">
          <div className="mx-auto w-full max-w-[1500px] rounded-[28px] border border-emerald-200/60 bg-white/45 p-1.5 shadow-[0_22px_48px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-emerald-400/20 dark:bg-slate-950/35 md:p-2.5">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
