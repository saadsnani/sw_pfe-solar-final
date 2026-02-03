"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 h-14 md:h-16 w-full border-b border-black/5 bg-gray-50/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <span className="text-sm font-bold">EMS</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Smart EMS</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Solar Monitoring</div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 shadow-sm transition hover:scale-105 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}
