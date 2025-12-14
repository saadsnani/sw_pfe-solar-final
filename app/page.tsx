"use client"

import { useEffect, useState } from "react"
import LoginPage from "@/components/login-page"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Initialize auth state from localStorage on first render
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("userLoggedIn") : null
      if (stored === "true") {
        setIsAuthenticated(true)
      }
    } catch {
      // ignore storage access errors
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userLoggedIn")
      }
    } catch {
      // ignore storage access errors
    }
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard onLogout={handleLogout} />
}
