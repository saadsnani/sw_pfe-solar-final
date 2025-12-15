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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            École Supérieure de Technologie
          </h2>
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
