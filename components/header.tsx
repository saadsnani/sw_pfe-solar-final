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
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
      {/* Left - Institution */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 overflow-hidden bg-primary/10 flex items-center justify-center">
          <Image
            src="/images.jpg"
            alt="EST Logo"
            width={40}
            height={40}
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">École Supérieure de Technologie</h2>
          <p className="text-xs text-muted-foreground">Système Intelligent de Gestion d'Énergie</p>
        </div>
      </div>

      {/* Right - Team & User */}
      <div className="flex items-center gap-6">
        {/* Team Info */}
        <div className="hidden md:block text-right">
          <p className="text-xs text-muted-foreground">
            Encadré par : <span className="text-foreground font-medium">Mr. Abdelaziz FRI</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Réalisé par : <span className="text-foreground font-medium">Walid EL HALOUAT & Saad SNANI</span>
          </p>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 h-10 rounded-xl hover:bg-secondary">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
