# 🔋 Intégration Température Batterie – Guide Complet

## 📝 Résumé & Objectif
Vous avez maintenant un système complet pour afficher la **température de la batterie en temps réel** sur votre dashboard solaire. Les données proviennent d'un Arduino/ESP32 et sont affichées avec un beau design et des graphiques. Ce guide explique comment intégrer, configurer et tester cette fonctionnalité.

## 📂 Fichiers & Architecture

### 1️⃣ API & Backend
- `frontend/app/api/sensor-data/route.ts` – API modifiée pour température batterie
- `frontend/lib/battery-temperature-config.ts` – Configuration centralisée
- `frontend/lib/battery-temperature-utils.ts` – Utilitaires et helpers

### 2️⃣ Composants React
- `frontend/components/battery-temperature-card.tsx` – Affichage principal
- `frontend/components/battery-temperature-chart.tsx` – Graphique historique
- `frontend/components/battery-temperature-test-page.tsx` – Page de test

### 3️⃣ Hooks
- `frontend/hooks/use-battery-temperature.ts` – Logique temps réel

### 4️⃣ Pages
- `frontend/app/battery-test/page.tsx` – Page de test accessible

### 5️⃣ Code Arduino/ESP32
- `firmware/esp32/ESP32_Battery_Temperature_Example.ino` – Code complet

---

## ⚙️ Guide d’Intégration

### Option 1: Test Immédiat (Sans Arduino)
1. Démarrez le serveur :
   ```bash
   cd frontend
   npm run dev
   ```
2. Accédez à la page de test :
   http://localhost:3000/battery-test
3. Testez l’envoi de données :
   - Entrez une température (ex: 35.5°C)
   - Cliquez "Envoyer"
   - Voyez le composant se mettre à jour

### Option 2: Avec Arduino/ESP32
1. Modifiez le code Arduino :
   - Ouvrez `firmware/esp32/ESP32_Battery_Temperature_Example.ino`
   - Modifiez les credentials WiFi :
     ```cpp
     const char* ssid = "Votre_WiFi";
     const char* password = "Votre_Mot_De_Passe";
     ```
   - Mettez à jour l’URL du serveur :
     ```cpp
     const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";
     ```
   - Format des données envoyées :
     ```json
     { "batteryTemperature": 35.5 }
     ```

---

## ✅ Checklist Déploiement & Tests

### Avant de Commencer
- [ ] Node.js v16+ installé
- [ ] npm ou yarn fonctionnel
- [ ] Port 3000 disponible
- [ ] Arduino IDE installé (si utilisation matériel)

### Backend Setup
- [ ] API modifiée pour température batterie (`route.ts`)
- [ ] Dossier `data/` créé automatiquement
- [ ] Fichier `battery-temperature.json` créé
- [ ] Endpoints GET/POST fonctionnels

### Frontend Components
- [ ] `battery-temperature-card.tsx` créé
- [ ] `battery-temperature-chart.tsx` créé
- [ ] `battery-temperature-test-page.tsx` créé
- [ ] Import dans `dashboard-content.tsx`
- [ ] Recharts disponible dans package.json

### Hooks
- [ ] `use-battery-temperature.ts` créé
- [ ] `useBatteryTemperature()` hook créé
- [ ] `useSendBatteryTemperature()` hook créé

### Utilitaires
- [ ] `battery-temperature-config.ts` créé
- [ ] `battery-temperature-utils.ts` créé

### Pages
- [ ] Page test `/battery-test` créée
- [ ] Accessible depuis http://localhost:3000/battery-test

### Documentation
- [ ] Ce fichier `battery-temperature.md` à jour

### Code Arduino
- [ ] ESP32_Battery_Temperature_Example.ino prêt
- [ ] Modifications WiFi credentials
- [ ] Modifications URL serveur

---

## 💻 Exemples de Code

### Exemple 1: Utiliser le Hook
```tsx
'use client'
import { useBatteryTemperature } from '@/hooks/use-battery-temperature'
export function MonComposant() {
  const data = useBatteryTemperature()
  return (
    <div>
      <p>Température: {data.batteryTemperature}°C</p>
      <p>Statut: {data.status}</p>
      <p>Connecté: {data.isConnected ? 'Oui' : 'Non'}</p>
      {data.lastUpdate && (
        <p>Mis à jour: {data.lastUpdate.toLocaleTimeString()}</p>
      )}
    </div>
  )
}
```

### Exemple 2: Envoyer une Température
```tsx
'use client'
import { useSendBatteryTemperature } from '@/hooks/use-battery-temperature'
import { Button } from '@/components/ui/button'
export function EnvoiTemperature() {
  const { send } = useSendBatteryTemperature()
  const handleSend = async () => {
    try {
      const result = await send(35.5)
      console.log('Envoyé:', result)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
  return <Button onClick={handleSend}>Envoyer 35.5°C</Button>
}
```

### Exemple 3: Utiliser les Utilitaires
```tsx
'use client'
import {
  sendBatteryTemperature,
  getBatteryTemperatureReadings,
  getBatteryTemperatureStatus,
  getBatteryTemperatureLabel,
  formatBatteryTemperature
} from '@/lib/battery-temperature-utils'
export async function MonUtilitaire() {
  // Envoyer
  const result1 = await sendBatteryTemperature(35.5)
  console.log(result1) // { success: true, message: "...", data: {...} }
}
```

---

> Pour toute question ou amélioration, voir le README principal ou contacter l’équipe projet.
