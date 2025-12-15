"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Shield, Zap, Save } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configurez vos préférences Smart EMS</p>
      </div>

      {/* Feedback Section */}
      <FeedbackForm />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threshold Settings */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Seuils de Protection
            </CardTitle>
            <CardDescription>Configurez les limites de sécurité pour la protection automatique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="minVoltage">Tension Minimale Batterie (V)</Label>
              <Input id="minVoltage" type="number" defaultValue="11.5" step="0.1" className="bg-input/50" />
              <p className="text-xs text-muted-foreground">Le système coupera la charge en dessous de cette tension</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTemp">Température Maximale Batterie (°C)</Label>
              <Input id="maxTemp" type="number" defaultValue="45" className="bg-input/50" />
              <p className="text-xs text-muted-foreground">Arrêt d'urgence déclenché au-dessus de cette température</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowSoc">Seuil SOC Bas (%)</Label>
              <Input id="lowSoc" type="number" defaultValue="20" className="bg-input/50" />
              <p className="text-xs text-muted-foreground">Mode éco activé en dessous de ce niveau</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Gérez les préférences d'alerte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Alertes Batterie Faible</p>
                <p className="text-sm text-muted-foreground">Notifier lorsque le SOC tombe en dessous du seuil</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Avertissements Température</p>
                <p className="text-sm text-muted-foreground">Alerter sur les températures anormales</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Prédictions de Production</p>
                <p className="text-sm text-muted-foreground">Notifications quotidiennes des prévisions IA</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Rappels de Maintenance</p>
                <p className="text-sm text-muted-foreground">Nettoyage des panneaux et vérifications système</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Energy Mode */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Modes d'Énergie
            </CardTitle>
            <CardDescription>Configurez la gestion automatique de l'énergie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Mode Éco Automatique</p>
                <p className="text-sm text-muted-foreground">Réduire automatiquement la consommation si nécessaire</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Planification de Charge IA</p>
                <p className="text-sm text-muted-foreground">Utiliser les prédictions pour optimiser l'usage</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Coupure par Priorité</p>
                <p className="text-sm text-muted-foreground">Couper les charges non essentielles en premier</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Configuration Système
            </CardTitle>
            <CardDescription>Paramètres ESP32 et capteurs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sampleRate">Taux d'Échantillonnage (secondes)</Label>
              <Input id="sampleRate" type="number" defaultValue="1" className="bg-input/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifiSSID">SSID WiFi ESP32</Label>
              <Input id="wifiSSID" defaultValue="SmartEMS_AP" className="bg-input/50" />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer la Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
