"use client"

import { LogOut, User, Menu, Activity, Clock } from "lucide-react"
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
}

export function Header({ onLogout, userEmail, onMenuClick }: HeaderProps) {
  const [time, setTime] = useState<string>("00:00:00")

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
    <header className="sticky top-0 z-40 h-16 sm:h-20 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-xl px-3 sm:px-4 md:px-6">
      <div className="flex items-center h-full w-full justify-between gap-2 sm:gap-3">
        {/* Left - Logo & School Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          <div className="w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-md">
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
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
              École Supérieure de Technologie
            </div>
            <div className="text-xs sm:text-sm text-emerald-600/80 dark:text-emerald-400/80 truncate">
              Système Intelligent de Gestion d&apos;Energie
            </div>
          </div>
        </div>

        {/* Center - Time & Project Info */}
        <div className="flex-1 hidden md:flex items-center justify-center gap-2 lg:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 bg-emerald-500/10 border border-emerald-500/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex-shrink-0">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs sm:text-base font-mono text-emerald-600 dark:text-emerald-400 font-bold">{time}</span>
          </div>
          <div className="hidden lg:flex flex-col items-start text-xs leading-relaxed">
            <span className="text-muted-foreground">Encadré par : <span className="text-foreground font-semibold">Mr. Abdelaziz FRI</span></span>
            <span className="text-muted-foreground">Réalisé par : <span className="text-foreground font-semibold">Saad SNANI & Walid EL HALOUAT</span></span>
          </div>
        </div>

        {/* Right - User Dropdown */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-10 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10">
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
                  <User className="w-3 sm:w-4 h-3 sm:h-4 text-primary-foreground" />
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
  )
}
