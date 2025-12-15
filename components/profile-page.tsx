"use client"

import { useState } from "react"
import { Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAlert } from "@/lib/alert-provider"

export function ProfilePage() {
  const { addAlert } = useAlert()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "Administrateur",
    email: "admin@est.ma",
    phone: "+212 6 XX XXX XX",
    organization: "École Supérieure de Technologie",
    role: "Administrateur Système",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    systemAlerts: true,
    monthlyReports: true,
    language: "fr",
    theme: "dark",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    addAlert({
      type: "success",
      title: "Profil Sauvegardé",
      message: "Vos informations de profil ont été mises à jour",
    })
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addAlert({
        type: "error",
        title: "Erreur",
        message: "Les mots de passe ne correspondent pas",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      addAlert({
        type: "error",
        title: "Mot de passe faible",
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      return
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    addAlert({
      type: "success",
      title: "Mot de passe changé",
      message: "Votre mot de passe a été mis à jour avec succès",
    })
  }

  const handleSavePreferences = () => {
    addAlert({
      type: "success",
      title: "Préférences Sauvegardées",
      message: "Vos paramètres de préférence ont été mis à jour",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profil Utilisateur</h1>
        <p className="text-muted-foreground">Gérez vos paramètres personnels et vos préférences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom Complet</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation</Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Changement de Mot de Passe</CardTitle>
              <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="bg-background"
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="bg-background"
                />
              </div>

              <Button onClick={handleChangePassword} className="gap-2">
                <Save className="h-4 w-4" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
              <CardDescription>Gérez comment vous recevez les notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <div>
                    <div className="font-semibold text-sm">Notifications par Email</div>
                    <div className="text-xs text-muted-foreground">Recevez les mises à jour par email</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.systemAlerts}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        systemAlerts: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <div>
                    <div className="font-semibold text-sm">Alertes Système</div>
                    <div className="text-xs text-muted-foreground">Alertes pour les anomalies du système</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.monthlyReports}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        monthlyReports: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <div>
                    <div className="font-semibold text-sm">Rapports Mensuels</div>
                    <div className="text-xs text-muted-foreground">Recevez un rapport d'analyse chaque mois</div>
                  </div>
                </label>
              </div>

              <Button onClick={handleSavePreferences} className="gap-2 w-full">
                <Save className="h-4 w-4" />
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
