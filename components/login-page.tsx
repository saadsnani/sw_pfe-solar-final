"use client"

import type React from "react"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Eye, EyeOff, Sun, Loader2, Zap, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser, registerUser, setCurrentUser } from "@/lib/auth"
import { useAlert } from "@/lib/alert-provider"

// TODO: replace with your real EmailJS values
const SERVICE_ID = "YOUR_SERVICE_ID"
const TEMPLATE_ID_LOGIN = "YOUR_TEMPLATE_ID"
const PUBLIC_KEY = "YOUR_PUBLIC_KEY"

interface LoginPageProps {
  onLogin: (email: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const { addAlert } = useAlert()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!email || !password) {
      addAlert({ type: "error", title: "Erreur", message: "Veuillez remplir tous les champs" })
      return
    }

    if (password.length < 4) {
      addAlert({ type: "error", title: "Erreur", message: "Le mot de passe doit contenir au moins 4 caractères" })
      return
    }

    setIsLoading(true)
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    if (isSignUpMode) {
      // Register new user
      const result = registerUser(email, password)
      if (result.success) {
        addAlert({ type: "success", title: "Succès", message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter." })
        setIsSignUpMode(false)
        setPassword("")
      } else {
        addAlert({ type: "error", title: "Erreur", message: result.message })
      }
    } else {
      // Login existing user
      const result = loginUser(email, password)
      if (result.success) {
        setCurrentUser(email)

        try {
          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID_LOGIN,
            {
              to_email: "YOUR_ADMIN_EMAIL@example.com",
              user_email: email,
              login_status: "success",
              login_timestamp: new Date().toLocaleString("en-US"),
              login_date: new Date().toLocaleDateString("en-US"),
              login_time: new Date().toLocaleTimeString("en-US"),
            },
            PUBLIC_KEY
          )
        } catch (error) {
          console.error("EmailJS login success log failed", error)
        }

        addAlert({ type: "success", title: "Connexion Réussie", message: `Bienvenue ${email}` })
        onLogin(email)
      } else {
        try {
          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID_LOGIN,
            {
              to_email: "YOUR_ADMIN_EMAIL@example.com",
              user_email: email,
              login_status: "failed",
              login_timestamp: new Date().toLocaleString("en-US"),
              login_date: new Date().toLocaleDateString("en-US"),
              login_time: new Date().toLocaleTimeString("en-US"),
            },
            PUBLIC_KEY
          )
        } catch (error) {
          console.error("EmailJS login failure log failed", error)
        }

        addAlert({ type: "error", title: "Erreur de Connexion", message: result.message })
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/large-solar-panel-farm-installation-at-sunset-with.jpg')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-energy-green rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl border border-white/10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 pulse-glow">
              <Sun className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Smart EMS</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignUpMode ? "Créer un nouveau compte" : "Système Intelligent de Gestion d'Énergie"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">
                Adresse Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={isSignUpMode ? "votre-email@exemple.com" : "admin@smartems.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50 border-border/50 focus:border-primary h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">
                Mot de Passe {isSignUpMode && <span className="text-xs text-muted-foreground">(min. 4 caractères)</span>}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary h-12 pr-12"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isSignUpMode && password.length > 0 && password.length < 4 && (
                <p className="text-xs text-red-500">Le mot de passe doit contenir au moins 4 caractères</p>
              )}
            </div>

            {!isSignUpMode && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              disabled={isLoading || (isSignUpMode && password.length < 4)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUpMode ? "Création..." : "Connexion..."}
                </>
              ) : isSignUpMode ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Créer un Compte
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Se Connecter
                </>
              )}
            </Button>

            {/* Toggle Sign Up / Sign In */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode)
                  setPassword("")
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUpMode ? (
                  <>
                    Vous avez déjà un compte ?{" "}
                    <span className="text-primary font-semibold">Se Connecter</span>
                  </>
                ) : (
                  <>
                    Pas encore de compte ?{" "}
                    <span className="text-primary font-semibold">Créer un Compte</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">École Supérieure de Technologie - EST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
