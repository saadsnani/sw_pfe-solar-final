"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"
import { getCurrentUser, logoutUser } from "@/lib/auth"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setIsLoggedIn(true)
      setUserEmail(currentUser)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (email: string) => {
    setIsLoggedIn(true)
    setUserEmail(email)
  }

  const handleLogout = () => {
    logoutUser()
    setIsLoggedIn(false)
    setUserEmail(null)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <LoginPage onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Dashboard onLogout={handleLogout} userEmail={userEmail || undefined} />
    </div>
  )
}
