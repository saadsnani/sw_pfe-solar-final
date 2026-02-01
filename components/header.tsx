"use client"

import { LogOut, User, Moon, Sun, Menu, Activity } from "lucide-react"
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
  userEmail?: string
  onMenuClick?: () => void
}

export function Header({ onLogout, userEmail, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-white/10 bg-black/50 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex items-center h-full w-full gap-3">
        {/* Left - Mobile Menu */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Center - Brand */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="flex items-center gap-3 min-w-0">
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
            <div className="text-center leading-tight">
              <div className="text-[18px] sm:text-[22px] font-bold text-emerald-400">
                École Supérieure
              </div>
              <div className="text-[18px] sm:text-[22px] font-bold text-emerald-400">
                de Technologie
              </div>
            </div>
          </div>
        </div>

        {/* Right - Status + Theme + User */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-white/10 bg-white/5"
            aria-label="Status"
          >
            <Activity className="h-5 w-5 text-emerald-400" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full border border-white/10 bg-white/5"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 h-10 rounded-full border border-white/10 bg-white/5">
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
