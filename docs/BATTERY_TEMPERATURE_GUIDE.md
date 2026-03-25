# Guide: Afficher la Température de Batterie sur le Dashboard

## 📋 Vue d'ensemble

Ce guide explique comment afficher la température de la batterie en temps réel sur votre dashboard solaire en utilisant un ESP32.

## 🔧 Configuration

### 1. **Modifications à l'API** ✅
L'API `/api/sensor-data` a été modifiée pour accepter les données de température de batterie:

```bash
POST /api/sensor-data
Content-Type: application/json

{
  "batteryTemperature": 35.5
}
```

Récupérer les données:
```bash
GET /api/sensor-data?type=battery
```

### 2. **Nouveau Composant** ✅
Un composant React a été créé: `components/battery-temperature-card.tsx`

**Affichage:**
- Température actuelle avec status
- Indicateur de connexion
- Horodatage de la dernière mise à jour

**Status:**
- 🔵 Froid: < 20°C
- 🟢 Normal: 20-40°C
- 🟡 Chaud: 40-60°C
- 🔴 Critique: > 60°C

### 3. **Intégration au Dashboard** ✅
Le composant a été intégré dans `dashboard-content.tsx`

## 📱 Configuration Arduino/ESP32

### Étapes:

1. **Modifiez les credentials WiFi:**
```cpp
const char* ssid = "Votre_WiFi";
const char* password = "Votre_Mot_De_Passe";
```

2. **Mettez à jour l'URL du serveur:**
```cpp
// Remplacez 192.168.x.x par l'IP de votre serveur Next.js
const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";
```

3. **Format des données depuis Mega:**
```
Format: "TEMP:25.5|BATT:35.2"
```

### Communications:

- **Mega → ESP32:** Serial2 (Pins 16/17)
  - Vitesse: 9600 baud
  - Format: `TEMP:XX.X|BATT:YY.Y\n`

- **ESP32 → Dashboard:** HTTP POST
  - Endpoint: `/api/sensor-data`
  - Contenu: JSON avec `batteryTemperature`

## 🚀 Utilisation

### Test Manual (Frontend):

```typescript
// Envoyer une température de test
fetch('/api/sensor-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ batteryTemperature: 35.5 })
})
```

### Récupérer les données:

```typescript
const response = await fetch('/api/sensor-data?type=battery')
const data = await response.json()

console.log(data.current)        // Dernière lecture
console.log(data.readings)       // Historique
console.log(data.count)          // Nombre de lectures
```

## 📊 Stockage des Données

- **Fichier:** `data/battery-temperature.json`
- **Limite:** Dernières 500 lectures conservées
- **Format:** 
```json
[
  {
    "batteryTemperature": 35.5,
    "timestamp": "2025-12-19T10:30:45.123Z"
  }
]
```

## ⚠️ Troubleshooting

### La température n'apparaît pas?

1. **Vérifiez la connexion WiFi:**
   - Serial.println(WiFi.localIP());
   
2. **Testez l'endpoint API:**
   ```bash
   curl -X POST http://localhost:3000/api/sensor-data \
     -H "Content-Type: application/json" \
     -d '{"batteryTemperature": 35.5}'
   ```

3. **Vérifiez les logs:**
   - Console Arduino Serial Monitor
   - Console Next.js (npm run dev)

### Le statut montre "Déconnecté"?

- Vérifiez que l'ESP32 envoie les données
- Vérifiez l'URL du serveur
- Assurez que le serveur est accessible depuis l'ESP32

## 🔄 Données en Temps Réel

- Le composant rafraîchit chaque **3 secondes**
- Affichage de l'heure UTC/locale
- Indicateur de connexion animé (point vert)

## 📝 Exemple Arduino Complet

Voir le fichier: `ESP32_Battery_Temperature_Example.ino`

## ✨ Fonctionnalités Futures (Optionnel)

- [ ] Graphique d'historique
- [ ] Alertes si température dépasse seuil
- [ ] Moyenne température sur 24h
- [ ] Export données CSV
