"use client"

import type React from "react"
import { useState } from "react"
// [Imports dyawlk... Mat9isshomch]
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sun, Lock, Mail, Eye, EyeOff } from "lucide-react"

// Hadd l-interface rah s7i7a
interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // HADI HIYA L-FUNCTION L-MSLL7A LI GHADI T-SEJJL L-MÉMOIRE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email === "admin@example.com" && password === "1234") {
      
      // 👇👇👇 HADA HOWA L-CODE LI GHA Y-7LL L-MOUCHKIL 👇👇👇
      if (rememberMe) {
        // ILA L-Checkbox M-clikia: Khbbiha f l-Mémoire
        localStorage.setItem("userLoggedIn", "true");
      } else {
        // Ila l-Checkbox Mamclikiax: Ms7 l-Mémoire
        localStorage.removeItem("userLoggedIn");
      }
      // 👆👆👆 SALA L-MÉMOIRE HNA 👆👆👆
      
      onLogin() // Khdem l-Dashboard
    } else {
      setError("Invalid credentials. Please try again.")
    }
    setIsLoading(false)
  }

  // [return dyawlkom... Khllihom]
  return (
    <div
      className="relative min-h-screen w-full"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/solar-bg.jpg')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black/65" />

      {/* Content container */}
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        {/* ... L-code dyal l-Design... */}

        <Card className="w-full max-w-lg bg-background/90 backdrop-blur-md border-border shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <Sun className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="text-4xl md:text-5xl leading-tight">
              <span className="font-bold text-amber-500">SW</span>
              <span className="font-normal text-white"> Intelligent Photovoltaic Supervision</span>
            </CardTitle>
            <CardDescription className="text-base">Système de supervision intelligent pour installations photovoltaïques</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Demo: admin@example.com / 1234
              </p>
            </form>
            
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-gray-400">
                Projet de Fin d'Études - Génie Électrique
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}