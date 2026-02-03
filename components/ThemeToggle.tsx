"use client"

import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check initial theme from localStorage and HTML element
    const htmlElement = document.documentElement
    const savedTheme = localStorage.getItem("theme")
    
    if (savedTheme === "light") {
      htmlElement.classList.remove("dark")
      setIsDark(false)
    } else {
      htmlElement.classList.add("dark")
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement
    
    if (isDark) {
      // Switch to Light Mode
      htmlElement.classList.remove("dark")
      htmlElement.style.colorScheme = "light"
      setIsDark(false)
      localStorage.setItem("theme", "light")
      // Force re-render
      window.dispatchEvent(new Event('storage'))
    } else {
      // Switch to Dark Mode
      htmlElement.classList.add("dark")
      htmlElement.style.colorScheme = "dark"
      setIsDark(true)
      localStorage.setItem("theme", "dark")
      // Force re-render
      window.dispatchEvent(new Event('storage'))
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-3 w-12 h-12" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200 flex items-center justify-center"
      aria-label="Toggle theme"
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDark ? (
        // Sun Icon ☀️ (Show in Dark Mode - Click to go Light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-yellow-400"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon Icon 🌙 (Show in Light Mode - Click to go Dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-slate-700 dark:text-slate-300"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
