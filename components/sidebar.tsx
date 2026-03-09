"use client"

import { LayoutDashboard, BarChart3, Brain, Settings, Activity, User, Menu, Power } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { PageType } from "@/components/dashboard"
import { useLanguage } from "@/lib/language-provider"

interface SidebarProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
  collapsed: boolean
  onToggleCollapse: () => void
  userEmail?: string
}

const navItems = [
  { id: "dashboard" as PageType, labelKey: "sidebar.dashboard", icon: LayoutDashboard },
  { id: "analytics" as PageType, labelKey: "sidebar.analytics", icon: BarChart3 },
  { id: "relay-control" as PageType, labelKey: "sidebar.relayControl", icon: Power },
  { id: "ai-predictions" as PageType, labelKey: "sidebar.aiPredictions", icon: Brain },
  { id: "system-health" as PageType, labelKey: "sidebar.systemHealth", icon: Activity },
  { id: "settings" as PageType, labelKey: "sidebar.settings", icon: Settings },
  { id: "profile" as PageType, labelKey: "sidebar.profile", icon: User },
]

export function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse, userEmail }: SidebarProps) {
  const { t } = useLanguage()

  return (
    <>
      {/* Backdrop Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 z-30 backdrop-blur-sm"
          onClick={() => onToggleCollapse()}
        />
      )}

      {/* Sidebar Drawer - 75% width overlay */}
      <aside className={cn(
        "border-r border-emerald-200/70 dark:border-emerald-400/20 bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(236,253,248,0.9)_48%,rgba(233,246,255,0.88))] dark:bg-[linear-gradient(165deg,rgba(2,6,23,0.92),rgba(6,78,59,0.46)_48%,rgba(14,116,144,0.42))] shadow-[0_24px_40px_rgba(15,23,42,0.15)] backdrop-blur-xl flex flex-col transition-transform duration-500 ease-in-out",
        "fixed inset-y-0 left-0 z-40",
        "w-[80vw] sm:w-64 lg:w-72",
        "top-[78px] sm:top-[90px] md:top-[96px]",
        collapsed ? "-translate-x-full" : "translate-x-0"
      )}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-sidebar-border">
        <div className="grid grid-cols-[auto_auto_auto] items-center justify-between gap-2 mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 dark:bg-emerald-400/15 flex items-center justify-center border border-emerald-500/35 dark:border-emerald-300/35">
            <ThemeToggle />
          </div>

          <LanguageSwitcher compact className="h-8 sm:h-10 min-w-[72px] sm:min-w-[84px]" />

          {/* Close Menu Button */}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15 rounded-lg transition-colors"
            aria-label={t("sidebar.closeMenu")}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-emerald-500/22 to-sky-500/20 text-emerald-800 dark:text-emerald-100 shadow-[0_8px_18px_rgba(16,185,129,0.2)] border border-emerald-500/55 dark:border-emerald-300/35"
                  : "text-muted-foreground hover:bg-emerald-500/10 dark:hover:bg-white/10 hover:text-foreground",
              )}
            >
              <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", isActive && "text-emerald-500")} />
              <span className="font-medium text-sm sm:text-base">{t(item.labelKey)}</span>
              {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
          )
        })}
      </nav>

      {/* User Info at Bottom */}
      {userEmail && (
        <div className="p-3 sm:p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg bg-white/65 dark:bg-white/10 border border-emerald-200/60 dark:border-emerald-400/20">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate">{userEmail.split("@")[0]}</p>
              <p className="text-xs text-muted-foreground">{t("sidebar.administrator")}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  )
}
