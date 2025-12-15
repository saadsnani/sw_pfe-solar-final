"use client"

import { LogOut, User } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
  return (
    <header className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
      {/* Left - Institution */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-md flex-shrink-0">
          <Image
            src="/images.jpg"
            alt="EST Logo"
            width={64}
            height={64}
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            École Sup. de Tech.
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-semibold text-primary line-clamp-1">Gestion d'Énergie Intelligent</p>
        </div>
      </div>

      {/* Right - Team & User */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto justify-between sm:justify-end">
        {/* Team Info */}
        <div className="hidden lg:block text-right border-r border-border pr-4 md:pr-8 text-xs md:text-sm">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-foreground">Encadré par :</span> Mr. Abdelaziz FRI
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Réalisé par :</span> Walid EL HALOUAT & Saad SNANI
          </p>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 h-10 sm:h-12 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline text-sm sm:text-base font-semibold text-foreground">Admin</span>
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
