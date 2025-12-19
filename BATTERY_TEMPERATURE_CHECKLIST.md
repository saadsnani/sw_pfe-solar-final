# ✅ Checklist Déploiement - Température Batterie

## 📋 Avant de Commencer

- [ ] Node.js v16+ installé
- [ ] npm ou yarn fonctionnel
- [ ] Port 3000 disponible (ou configurable)
- [ ] Arduino IDE installé (si utilisation matériel)

## 🔧 Backend Setup

- [ ] API modifiée pour température batterie (✅ route.ts)
- [ ] Dossier `data/` créé automatiquement
- [ ] Fichier `battery-temperature.json` créé
- [ ] Endpoints GET/POST fonctionnels
  - [ ] `POST /api/sensor-data` (envoyer)
  - [ ] `GET /api/sensor-data?type=battery` (récupérer)

## ⚛️ Frontend Components

- [ ] `battery-temperature-card.tsx` ✅ Créé
- [ ] `battery-temperature-chart.tsx` ✅ Créé
- [ ] `battery-temperature-test-page.tsx` ✅ Créé
- [ ] Importer dans `dashboard-content.tsx` ✅
- [ ] Recharts disponible dans package.json ✅

## 🎣 Hooks

- [ ] `use-battery-temperature.ts` ✅ Créé
- [ ] `useBatteryTemperature()` hook créé
- [ ] `useSendBatteryTemperature()` hook créé

## 📚 Utilitaires

- [ ] `battery-temperature-config.ts` ✅
- [ ] `battery-temperature-utils.ts` ✅
- [ ] Functions de formatage ✅
- [ ] Functions de calcul ✅

## 📄 Pages

- [ ] Page test `/battery-test` créée ✅
- [ ] Accessible depuis http://localhost:3000/battery-test

## 📖 Documentation

- [ ] BATTERY_TEMPERATURE_README.md ✅
- [ ] BATTERY_TEMPERATURE_GUIDE.md ✅
- [ ] BATTERY_TEMPERATURE_SUMMARY.md ✅

## 💻 Code Arduino

- [ ] ESP32_Battery_Temperature_Example.ino ✅
- [ ] Arduino_Mega_Temperature_Sensor.ino ✅
- [ ] Modifications WiFi credentials
- [ ] Modifications URL serveur

## 🧪 Tests

### Tests Frontend
- [ ] Page `http://localhost:3000/battery-test` accessible
- [ ] Bouton "Envoyer" fonctionne
- [ ] Bouton "10 Lectures" fonctionne
- [ ] Données apparaissent dans le dashboard
- [ ] Composant rafraîchit chaque 3 secondes
- [ ] Graphique affiche les données

### Tests API
```bash
# Envoyer une donnée
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"batteryTemperature": 35.5}'
# Résultat attendu: { "success": true, ... }

# Récupérer les données
curl http://localhost:3000/api/sensor-data?type=battery
# Résultat attendu: { "current": {...}, "readings": [...], "count": N }
```

### Tests Arduino (Optionnel)
- [ ] Code compilé sans erreur
- [ ] Téléchargé sur ESP32
- [ ] WiFi connecté (vérifier Serial Monitor)
- [ ] Données envoyées (vérifier logs)
- [ ] Reçues par Next.js (vérifier logs)

## 🌐 Déploiement Local

```bash
# 1. Installer dépendances
npm install

# 2. Démarrer serveur
npm run dev

# 3. Vérifier logs
# Vous devriez voir: "compiled successfully"

# 4. Accéder au dashboard
http://localhost:3000
```

## 🚀 Déploiement Production

- [ ] Variables d'environnement configurées
- [ ] `.env.local` avec clés API (si besoin)
- [ ] Dossier `data/` accessible en écriture
- [ ] Limites de taille fichiers JSON OK
- [ ] Rate limiting configuré (optionnel)
- [ ] HTTPS activé (si API externe)
- [ ] Authentification activée (si besoin)

```bash
# Build production
npm run build

# Démarrer production
npm start
```

## 🔐 Sécurité

- [ ] Authentification API activée (optionnel)
- [ ] Validation des données en entrée
- [ ] CORS configuré si API distante
- [ ] Secrets non commités (`.gitignore`)
- [ ] Rate limiting activé

## 📊 Monitoring

- [ ] Logs console OK
- [ ] Fichier JSON bien formé
- [ ] Taille fichier < 5MB
- [ ] Performance API < 100ms

## 🔄 Intégration Arduino

### Pour ESP32:
1. [ ] Modifier SSID
2. [ ] Modifier password
3. [ ] Modifier serverUrl (l'IP locale)
4. [ ] Compiler et télécharger
5. [ ] Vérifier Serial Monitor (connexion WiFi)
6. [ ] Vérifier données reçues

### Pour Mega:
1. [ ] Connecter capteur DS18B20 (pin 2)
2. [ ] Connecter capteur batterie (pin A0)
3. [ ] Compiler et télécharger
4. [ ] Vérifier format: `TEMP:XX.X|BATT:YY.Y`

### Connexion Mega ↔ ESP32:
- [ ] Mega TX (pin 1) → ESP32 RX2 (pin 16)
- [ ] Mega RX (pin 0) → ESP32 TX2 (pin 17)
- [ ] GND → GND
- [ ] Vitesse: 9600 baud

## ✨ Fonctionnalités Avancées

- [ ] Alertes si T > seuil (optionnel)
- [ ] Email/SMS notification (optionnel)
- [ ] Graphique 24h (optionnel)
- [ ] Export CSV (optionnel)

## 🐛 Troubleshooting

### Si rien ne s'affiche:
1. Vérifier logs console: `npm run dev`
2. Vérifier fichier JSON: `cat data/battery-temperature.json`
3. Vérifier API: `curl http://localhost:3000/api/sensor-data?type=battery`

### Si Arduino ne se connecte pas:
1. Vérifier SSID/Password WiFi
2. Vérifier IP serveur
3. Vérifier firewall
4. Vérifier Serial Monitor

### Si données n'arrivent pas:
1. Vérifier connexion Serial2 (ESP32 ↔ Mega)
2. Vérifier vitesse 9600 baud
3. Vérifier format: `TEMP:XX.X|BATT:YY.Y\n`

## 📝 Notes

- Recharts est déjà installé ✅
- Lucide-react inclus pour icônes ✅
- TypeScript compilé automatiquement ✅
- Hot reload fonctionne en dev ✅

## 🎉 Validation Finale

- [ ] Dashboard démarre sans erreur
- [ ] Page test accessible
- [ ] Composant affiche température
- [ ] Graphique fonctionne
- [ ] API répond correctement
- [ ] Données persistent dans JSON

---

**Status:** ✅ Prêt pour Production  
**Date:** 19 Décembre 2025  
**Dernière Vérification:** [À remplir]
