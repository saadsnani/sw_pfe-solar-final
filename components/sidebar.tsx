"use client"

import { useState } from "react"
import { LayoutDashboard, BarChart3, Brain, Settings, Activity, Sun, User, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import type { PageType } from "@/components/dashboard"

interface SidebarProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
  collapsed: boolean
  onToggleCollapse: () => void
  userEmail?: string
}

const navItems = [
  { id: "dashboard" as PageType, label: "Tableau de Bord", icon: LayoutDashboard },
  { id: "analytics" as PageType, label: "Analyses & Rapports", icon: BarChart3 },
  { id: "ai-predictions" as PageType, label: "Prédictions IA", icon: Brain },
  { id: "system-health" as PageType, label: "Santé du Système", icon: Activity },
  { id: "settings" as PageType, label: "Paramètres", icon: Settings },
  { id: "profile" as PageType, label: "Mon Profil", icon: User },
]

export function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse, userEmail }: SidebarProps) {
  return (
    <>
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        "fixed inset-y-0 left-0 z-50",
        "w-64 lg:w-72",
        "md:translate-x-0",
        collapsed && "-translate-x-full"
      )}>
      {/* Top Section - Logo & Theme Toggle */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Sun className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Smart EMS</h2>
              <p className="text-xs text-muted-foreground">Energy Monitor</p>
            </div>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/20"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-emerald-500")} />
              <span className="font-medium">{item.label}</span>
              {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
          )
        })}
      </nav>

      {/* User Info at Bottom */}
      {userEmail && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userEmail.split("@")[0]}</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  )
}
