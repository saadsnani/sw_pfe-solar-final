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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        "fixed inset-y-0 left-0 z-50",
        "w-20 md:w-20",
        "md:translate-x-0",
        "md:relative md:flex-shrink-0",
        collapsed && "-translate-x-full md:translate-x-0"
      )}>
      {/* Top Section - Hamburger & Theme Toggle */}
      <div className="p-4 border-b border-sidebar-border flex flex-col items-center gap-4">
        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          onClick={toggleMenu}
          className="w-12 h-12 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center transition-colors duration-200 border border-emerald-500/30 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-emerald-500" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      {/* Desktop Navigation - Icon Only */}
      <nav className="hidden md:flex flex-col flex-1 p-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
              title={item.label}
            >
              <Icon className={cn("w-6 h-6", isActive && "text-emerald-500")} />
              {isActive && <div className="absolute right-0 w-1 h-8 rounded-l-full bg-emerald-500" />}
            </button>
          )
        })}
      </nav>

      {/* Mobile Navigation - Slide Out Panel */}
      {isMenuOpen && (
        <div className="fixed left-20 top-20 bottom-0 w-64 bg-sidebar border-r border-sidebar-border shadow-2xl z-50 transition-transform duration-300 md:hidden">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-emerald-500")} />
                  <span className="font-medium truncate">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </button>
              )
            })}
          </nav>
        </div>
      )}

      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </aside>
    </>
  )
}
