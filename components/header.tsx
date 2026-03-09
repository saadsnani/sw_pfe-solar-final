"use client"

import { LogOut, User, Menu, Bell, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"
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
  const { t } = useLanguage()
  const schoolLine1 = "École Supérieure"
  const schoolLine2 = "de Technologie"
  const notifications: Array<{ id: number; messageKey: string; type: "warning" | "error" | "info" }> = [
    { id: 1, messageKey: "header.notification.batteryLow", type: "warning" },
  ]

  return (
    <>
      {/* Fixed Header - Reduced height for mobile */}
      <header className="fixed top-0 left-0 right-0 z-40 h-[78px] sm:h-[90px] md:h-[96px] border-b border-emerald-200/70 dark:border-emerald-400/20 bg-[linear-gradient(125deg,rgba(255,255,255,0.94),rgba(240,253,248,0.9)_48%,rgba(235,247,255,0.9))] dark:bg-[linear-gradient(125deg,rgba(2,6,23,0.88),rgba(6,78,59,0.32)_52%,rgba(14,116,144,0.3))] shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl px-2.5 sm:px-4 md:px-6">
        <div className="flex items-center h-full w-full justify-between gap-1.5 sm:gap-3">
          {/* Left - Menu/Back Button & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Menu/Back Button */}
            <button
              onClick={showBackButton ? onBackClick : onMenuClick}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15 transition-colors flex-shrink-0"
              aria-label={showBackButton ? t("header.aria.goBack") : t("header.aria.openMenu")}
            >
              {showBackButton ? (
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Logo & School Info - Expanded */}
            <div className="w-11 sm:w-16 md:w-20 h-11 sm:h-16 md:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(236,253,248,0.86),rgba(233,247,255,0.84))] dark:bg-white/5 border border-emerald-300/55 dark:border-emerald-400/25 flex items-center justify-center shadow-md">
              <Image
                src="/images.jpg"
                alt="EST Logo"
                width={80}
                height={80}
                className="object-cover"
                priority
              />
            </div>
            <div className="text-left min-w-0 flex-1 leading-tight">
              <p className="text-[13px] sm:text-[15px] md:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-[-0.012em] whitespace-nowrap overflow-hidden text-ellipsis" title={schoolLine1}>
                {schoolLine1}
              </p>
              <p className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300 whitespace-nowrap overflow-hidden text-ellipsis" title={schoolLine2}>
                {schoolLine2}
              </p>
            </div>
          </div>

          {/* Center - Project Info */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-3">
            <div className="inline-flex items-center rounded-full border border-emerald-300/55 bg-white/70 dark:bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.11em] text-emerald-700 dark:text-emerald-200 shadow-[0_8px_18px_rgba(16,185,129,0.14)]">
              Smart EMS Control Center
            </div>
            <div className="hidden 2xl:flex flex-col items-start text-xs leading-relaxed gap-0.5">
              <span className="text-muted-foreground">
                {t("header.supervisedBy")}: <span className="text-foreground font-semibold">Mr. Abdelaziz FRI</span>
              </span>
              <span className="text-muted-foreground">
                {t("header.realizedBy")}: <span className="text-foreground font-semibold">Saad SNANI & Walid EL HALOUAT</span>
              </span>
            </div>
          </div>

          {/* Right - Notifications, User */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15 transition-colors relative">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>
                  {t("header.notifications")} ({notifications.length})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} className="p-3 flex flex-col">
                      <span className="font-medium">{t(notif.messageKey)}</span>
                      <span
                        className={`text-xs ${notif.type === "warning" ? "text-yellow-600" : notif.type === "error" ? "text-red-600" : "text-blue-600"}`}
                      >
                        {t(`header.notificationType.${notif.type}`)}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>{t("header.noNotifications")}</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-10 rounded-full border border-emerald-200/70 dark:border-emerald-400/25 bg-[linear-gradient(120deg,rgba(255,255,255,0.86),rgba(236,253,248,0.82),rgba(233,247,255,0.8))] dark:bg-white/5 hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                  <span className="hidden xl:inline text-xs sm:text-sm font-semibold text-foreground truncate max-w-[120px]">
                    Saad Snani
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Saad Snani</span>
                    <span className="text-xs font-normal text-muted-foreground mt-1 truncate">saad.snani@usmba.ac.ma</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("header.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
