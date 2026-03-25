"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BatteryTemperatureCard } from "@/components/battery-temperature-card"
import { BatteryTemperatureChart } from "@/components/battery-temperature-chart"

export function BatteryTemperatureTestPage() {
  const [testTemp, setTestTemp] = useState<string>("35.5")
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const sendTestData = async () => {
    if (!testTemp || isNaN(parseFloat(testTemp))) {
      setMessage("❌ Veuillez entrer une température valide")
      return
    }

    setIsLoading(true)
    setMessage("⏳ Envoi en cours...")

    try {
      const response = await fetch("/api/sensor-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batteryTemperature: parseFloat(testTemp),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage("✅ Données envoyées avec succès!")
        console.log("Response:", data)
      } else {
        setMessage("❌ Erreur lors de l'envoi")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("❌ Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMultipleReadings = async () => {
    setIsLoading(true)
    setMessage("⏳ Envoi de 10 lectures...")

    try {
      for (let i = 0; i < 10; i++) {
        const temp = 20 + Math.random() * 40
        await fetch("/api/sensor-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batteryTemperature: temp,
          }),
        })
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      setMessage("✅ 10 lectures envoyées avec succès!")
    } catch (error) {
      console.error("Error:", error)
      setMessage("❌ Erreur lors de l'envoi multiple")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Test Panel */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <CardTitle>🧪 Panneau de Test - Température Batterie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Température (°C)</label>
                <Input
                  type="number"
                  value={testTemp}
                  onChange={(e) => setTestTemp(e.target.value)}
                  placeholder="35.5"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={sendTestData}
                  disabled={isLoading}
                  className="flex-1"
                  variant="default"
                >
                  Envoyer
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={sendMultipleReadings}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  10 Lectures
                </Button>
              </div>
            </div>

            {message && (
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                {message}
              </div>
            )}

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600">
              📝 <strong>Info:</strong> Utilisez ce panneau pour tester l'API avant de connecter
              l'Arduino ESP32
            </div>
          </CardContent>
        </Card>

        {/* Live Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BatteryTemperatureCard />
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>📡 État de l'API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <strong>Endpoint:</strong>
                <code className="block bg-black/20 p-2 rounded mt-1 text-xs">
                  POST /api/sensor-data
                </code>
              </div>
              <div>
                <strong>Payload:</strong>
                <code className="block bg-black/20 p-2 rounded mt-1 text-xs">
                  {`{ "batteryTemperature": 35.5 }`}
                </code>
              </div>
              <div>
                <strong>Récupérer:</strong>
                <code className="block bg-black/20 p-2 rounded mt-1 text-xs">
                  GET /api/sensor-data?type=battery
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <BatteryTemperatureChart />
        </div>

        {/* Documentation */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
          <CardHeader>
            <CardTitle>📚 Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>1. Configuration Arduino/ESP32:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Modifiez les credentials WiFi</li>
                <li>Mettez à jour l'URL du serveur (IP + port)</li>
                <li>Téléchargez le code: ESP32_Battery_Temperature_Example.ino</li>
              </ul>
            </div>
            <div>
              <strong>2. Format de communication:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Serial2: RX=16, TX=17 (9600 baud)</li>
                <li>Format Mega: "TEMP:25.5|BATT:35.2\n"</li>
              </ul>
            </div>
            <div>
              <strong>3. Stockage:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Fichier: data/battery-temperature.json</li>
                <li>Limite: 500 dernières lectures</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
