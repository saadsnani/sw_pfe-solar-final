"use client"

import { LogOut, User, Menu, Activity, Clock, Bell, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onLogout: () => void
  userEmail?: string
  onMenuClick?: () => void
  isMenuOpen?: boolean
  showBackButton?: boolean
  onBackClick?: () => void
}

export function Header({ onLogout, userEmail, onMenuClick, isMenuOpen, showBackButton = false, onBackClick }: HeaderProps) {
  const [time, setTime] = useState<string>("00:00:00")
  const [notifications, setNotifications] = useState<Array<{id: number; message: string; type: 'warning' | 'error' | 'info'}>>([
    { id: 1, message: "Battery Low", type: "warning" },
  ])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      setTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Fixed Header - Reduced height for mobile */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 sm:h-20 md:h-24 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/70 backdrop-blur-xl px-3 sm:px-4 md:px-6">
        <div className="flex items-center h-full w-full justify-between gap-2 sm:gap-3">
          {/* Left - Menu/Back Button & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            {/* Menu/Back Button */}
            <button
              onClick={showBackButton ? onBackClick : onMenuClick}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              aria-label={showBackButton ? "Go back" : "Open menu"}
            >
              {showBackButton ? (
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Logo & School Info */}
            <div className="w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 flex-shrink-0 overflow-hidden rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shadow-md">
              <Image
                src="/images.jpg"
                alt="EST Logo"
                width={64}
                height={64}
                className="object-cover"
                priority
              />
            </div>
            <div className="text-left leading-tight hidden sm:block min-w-0">
              <div className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
                École Supérieure de Technologie
              </div>
              <div className="text-xs sm:text-sm md:text-base text-emerald-600/80 dark:text-emerald-400/80 truncate">
                Système Intelligent de Gestion d&apos;Energie
              </div>
            </div>
          </div>

          {/* Center - Time & Project Info */}
          <div className="flex-1 hidden md:flex items-center justify-center gap-3 lg:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 bg-emerald-500/10 border border-emerald-500/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm sm:text-base md:text-lg font-mono text-emerald-600 dark:text-emerald-400 font-bold">{time}</span>
            </div>
            <div className="hidden lg:flex flex-col items-start text-xs md:text-sm leading-relaxed gap-1">
              <span className="text-muted-foreground">Encadré par : <span className="text-foreground font-semibold">Mr. Abdelaziz FRI</span></span>
              <span className="text-muted-foreground">Réalisé par : <span className="text-foreground font-semibold">Saad SNANI & Walid EL HALOUAT</span></span>
            </div>
          </div>

          {/* Right - Notifications, Theme, User */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative">
                  <Bell className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications ({notifications.length})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} className="p-3 flex flex-col">
                      <span className="font-medium">{notif.message}</span>
                      <span className={`text-xs ${notif.type === 'warning' ? 'text-yellow-600' : notif.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                        {notif.type.toUpperCase()}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-10 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-foreground truncate max-w-[120px]">
                    {userEmail ? userEmail.split("@")[0] : "Admin"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm">Mon Compte</span>
                    {userEmail && <span className="text-xs font-normal text-muted-foreground mt-1 truncate">{userEmail}</span>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
