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
    <header className="sticky top-0 z-50 h-20 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex items-center h-full w-full justify-between gap-3">
        {/* Left - Logo & School Info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-md">
            <Image
              src="/images.jpg"
              alt="EST Logo"
              width={64}
              height={64}
              className="object-cover"
              priority
            />
          </div>
          <div className="text-left leading-tight">
            <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              École Supérieure de Technologie
            </div>
            <div className="text-xs sm:text-sm text-emerald-600/80 dark:text-emerald-400/80">
              Système Intelligent de Gestion d&apos;Energie
            </div>
          </div>
        </div>

        {/* Center - Time & Project Info */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-base font-mono text-emerald-600 dark:text-emerald-400 font-bold">{time}</span>
          </div>
          <div className="hidden lg:flex flex-col items-start text-xs leading-relaxed">
            <span className="text-muted-foreground">Encadré par : <span className="text-foreground font-semibold">Mr. Abdelaziz FRI</span></span>
            <span className="text-muted-foreground">Réalisé par : <span className="text-foreground font-semibold">Saad SNANI & Walid EL HALOUAT</span></span>
          </div>
        </div>

        {/* Right - User Only */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="hidden md:inline text-sm font-semibold text-foreground">
                  {userEmail ? userEmail.split("@")[0] : "Admin"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Mon Compte</span>
                  {userEmail && <span className="text-xs font-normal text-muted-foreground mt-1">{userEmail}</span>}
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
