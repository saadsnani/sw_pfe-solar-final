"use client"

import { Check, ChevronDown, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { languageOptions, useLanguage, type SiteLanguage } from "@/lib/language-provider"

interface LanguageSwitcherProps {
  className?: string
  compact?: boolean
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700 shadow-sm transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10",
            compact ? "h-8 px-2" : "h-9 px-2.5",
            className,
          )}
          aria-label={t("language.label")}
        >
          <Languages className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          <span className={cn("font-bold uppercase tracking-[0.08em]", compact ? "text-[10px]" : "text-[11px]")}>
            {language}
          </span>
          <ChevronDown className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("language.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => setLanguage(option.code as SiteLanguage)}
            className="flex items-center justify-between"
          >
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex min-w-7 items-center justify-center rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                {option.short}
              </span>
              <span>{t(option.labelKey)}</span>
            </div>
            {language === option.code && <Check className="h-4 w-4 text-emerald-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
