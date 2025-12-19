# Solar Dashboard - Battery Temperature Monitoring

Système complet pour afficher la température de la batterie en temps réel sur un dashboard solaire.

## 🎯 Fonctionnalités

- ✅ Affichage température batterie temps réel
- ✅ Graphique historique avec Recharts
- ✅ Statuts colorés (Froid/Normal/Chaud/Critique)
- ✅ Communication Arduino Mega ↔ ESP32
- ✅ API REST + stockage JSON
- ✅ Page de test intégrée
- ✅ TypeScript full-stack
- ✅ Responsive design

## 🔧 Architecture

```
Arduino Mega (Capteur)
    ↓ Serial2 (9600 baud)
ESP32 (WiFi)
    ↓ HTTP POST
Next.js API (/api/sensor-data)
    ↓ JSON
React Dashboard
```

## 📋 Structure du Projet

```
solar-dashboard-pfe/
├── app/
│   ├── api/sensor-data/        # API endpoints
│   └── battery-test/            # Page de test
├── components/
│   ├── battery-temperature-card.tsx
│   ├── battery-temperature-chart.tsx
│   └── battery-temperature-test-page.tsx
├── hooks/
│   └── use-battery-temperature.ts
├── lib/
│   ├── battery-temperature-config.ts
│   └── battery-temperature-utils.ts
├── Arduino/
│   ├── ESP32_Battery_Temperature_Example.ino
│   └── Arduino_Mega_Temperature_Sensor.ino
└── data/
    └── battery-temperature.json
```

## 🚀 Démarrage Rapide

### Frontend

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build
npm start
```

Accédez à: `http://localhost:3000/battery-test`

### Arduino/ESP32

1. **Modifiez les credentials WiFi** dans `ESP32_Battery_Temperature_Example.ino`:
```cpp
const char* ssid = "Votre_WiFi";
const char* password = "Votre_Password";
const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";
```

2. **Connectez les broches:**
   - Mega TX (pin 1) → ESP32 RX2 (GPIO 16)
   - Mega RX (pin 0) → ESP32 TX2 (GPIO 17)
   - GND → GND

3. **Téléchargez le code:**
```bash
cd ESP32-Temperature-Sensor
pio run -t upload
pio device monitor
```

## 📊 API Endpoints

### Envoyer une température
```bash
POST /api/sensor-data
Content-Type: application/json

{
  "batteryTemperature": 35.5
}
```

### Récupérer les données
```bash
GET /api/sensor-data?type=battery
```

## 🎨 Statuts Température

| Statut | Gamme | Couleur |
|--------|-------|--------|
| Froid | < 20°C | 🔵 Bleu |
| Normal | 20-40°C | 🟢 Vert |
| Chaud | 40-60°C | 🟡 Orange |
| Critique | > 60°C | 🔴 Rouge |

## 📁 Stockage Données

- **Fichier:** `data/battery-temperature.json`
- **Format:** JSON Array
- **Limit:** 500 dernières lectures
- **Auto-créé:** ✅ Oui

## 🔌 Connexions Requises

### ESP32
- Pin 16 (RX2) ← Mega TX
- Pin 17 (TX2) ← Mega RX
- GND ← GND

### Arduino Mega
- Pin 2: Capteur DS18B20
- Pin A0: Capteur température batterie (analogique)
- Pin 1 (TX) → ESP32 RX2
- Pin 0 (RX) → ESP32 TX2

## 📚 Documentation

- [QUICK_START_BATTERY.md](QUICK_START_BATTERY.md) - Démarrage 2 min
- [BATTERY_TEMPERATURE_README.md](BATTERY_TEMPERATURE_README.md) - Guide complet
- [BATTERY_TEMPERATURE_GUIDE.md](BATTERY_TEMPERATURE_GUIDE.md) - Détails techniques
- [BATTERY_TEMPERATURE_CHECKLIST.md](BATTERY_TEMPERATURE_CHECKLIST.md) - Checklist déploiement

## 🛠️ Technologies

### Frontend
- Next.js 16+
- React 19
- TypeScript
- Recharts
- Tailwind CSS
- Radix UI

### Backend
- Next.js API Routes
- Node.js fs (JSON Storage)

### Hardware
- Arduino Mega
- ESP32
- DS18B20 Temperature Sensor
- LM35/TMP36 (Battery temp sensor)

## 🧪 Tests

### Test sans Arduino
1. Accédez à `http://localhost:3000/battery-test`
2. Entrez une température (ex: 35.5)
3. Cliquez "Envoyer"
4. Les données s'affichent en temps réel

### Test API
```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"batteryTemperature": 35.5}'
```

## ⚙️ Configuration

### Variables d'environnement

Créez `.env.local`:
```
NEXT_PUBLIC_BATTERY_TEMP_REFRESH_INTERVAL=3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Configuration WiFi ESP32

Modifiez dans `ESP32-Temperature-Sensor/src/main.cpp`:
```cpp
const char* ssid = "Your_WiFi_SSID";
const char* password = "Your_Password";
const char* serverUrl = "http://192.168.1.X:3000/api/sensor-data";
```

## 📱 Pages Disponibles

- `/` - Dashboard principal
- `/battery-test` - Page de test température
- `/api/sensor-data` - API endpoints

## 🔒 Sécurité

- ✅ TypeScript pour type-safety
- ✅ Validation des entrées
- ✅ Gestion d'erreurs
- ✅ CORS configuré

### Recommandations Production
- [ ] Ajouter authentification API
- [ ] Activer HTTPS
- [ ] Rate limiting
- [ ] Chiffrement des credentials

## 📊 Performance

- Rafraîchissement: 3 secondes
- Max lectures stockées: 500
- Temps de réponse API: < 100ms
- Graphique: 20 dernières mesures

## 🐛 Troubleshooting

### Données n'apparaissent pas?
1. Vérifiez WiFi ESP32: `pio device monitor`
2. Vérifiez IP serveur dans code Arduino
3. Vérifiez firewall (port 3000)

### ESP32 ne se connecte pas?
1. Vérifiez SSID et password WiFi
2. Vérifiez IP locale du serveur
3. Vérifiez câbles Serial2

### Arduino ne reconnait pas capteur?
1. Vérifiez connexion DS18B20
2. Vérifiez pin (GPIO 22 pour ESP32, pin 2 pour Mega)
3. Vérifiez voltage (5V pour Mega, 3.3V pour ESP32)

## 📄 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `next.config.mjs` | Configuration Next.js |
| `package.json` | Dépendances npm |
| `app/api/sensor-data/route.ts` | API endpoints |
| `components/battery-temperature-card.tsx` | Composant principal |
| `ESP32-Temperature-Sensor/src/main.cpp` | Code ESP32 |
| `Arduino_Mega_Temperature_Sensor.ino` | Code Mega |

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Roadmap

- [ ] Alertes SMS/Email si T > seuil
- [ ] Graphique 24h/7j
- [ ] Export CSV/PDF
- [ ] Dashboard mobile
- [ ] Prédiction durée vie batterie
- [ ] Calibration capteur

## 🤝 Contribution

Les contributions sont bienvenues! 

```bash
git clone https://github.com/votre-username/solar-dashboard.git
cd solar-dashboard
git checkout -b feature/your-feature
git commit -am 'Add your feature'
git push origin feature/your-feature
```

## 📞 Support

Pour toute question ou problème:
1. Consultez la [Documentation](./docs)
2. Vérifiez les [Issues](https://github.com/votre-username/solar-dashboard/issues)
3. Ouvrez une nouvelle [Issue](https://github.com/votre-username/solar-dashboard/issues/new)

## 📄 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails

## 🙏 Remerciements

- Next.js
- React
- TypeScript
- Recharts
- Radix UI
- Arduino Community

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** December 19, 2025

