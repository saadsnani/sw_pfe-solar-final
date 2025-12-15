"use client"

import { useEffect, useState } from "react"
import { LogOut, User, Moon, Sun, Clock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-provider"
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
}

export function Header({ onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-xl px-8 py-6 flex items-center justify-between shadow-lg">
      {/* Left - Institution */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-md">
          <Image
            src="/images.jpg"
            alt="EST Logo"
            width={64}
            height={64}
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              École Supérieure de Technologie
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-lg font-mono font-bold text-primary">{currentTime}</span>
            </div>
          </div>
          <p className="text-base font-semibold text-primary">Système Intelligent de Gestion d'Énergie</p>
        </div>
      </div>

      {/* Right - Team & User */}
      <div className="flex items-center gap-8">
        {/* Team Info */}
        <div className="hidden lg:block text-right border-r border-border pr-8">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-foreground">Encadré par :</span> Mr. Abdelaziz FRI
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Réalisé par :</span> Walid EL HALOUAT & Saad SNANI
          </p>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 rounded-lg hover:bg-primary/10 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-4 h-12 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline text-base font-semibold text-foreground">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
