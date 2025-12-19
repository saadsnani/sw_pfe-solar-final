# 🌞 Solar Dashboard - Real-Time Temperature Monitoring System

[![GitHub](https://img.shields.io/badge/GitHub-saadsnani%2Fsw__pfe--solar--final-blue)](https://github.com/saadsnani/sw_pfe-solar-final)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Système complet de monitoring de température en temps réel pour panneaux solaires avec intégration ESP32 + Arduino Mega.

## ✨ Fonctionnalités Principales

- 🌡️ **Monitoring Double**: Température batterie + ambiante
- 📊 **Graphiques en Temps Réel**: Historique de 20 lectures avec Recharts
- 🎨 **Status Visuels**: Code couleur (Froid/Normal/Chaud/Critique)
- 📡 **Communication Hardware**: Arduino Mega ↔ ESP32 via Serial
- 🔄 **Auto-Refresh**: Mise à jour toutes les 3 secondes
- 📱 **Responsive Design**: Fonctionne sur mobile, tablette, desktop
- ⚡ **API REST**: Endpoints pour envoi/récupération de données
- 🚨 **Alertes**: Notifications pour températures critiques
- 📈 **Trend Indicators**: Flèches de tendance (↑ ↓ →)
- 💾 **Stockage JSON**: Historique complet des lectures

## 🏗️ Architecture du Système

## 🏗️ Architecture du Système

```
┌─────────────────────────────────────────────────────┐
│         Sensors (Physical Layer)                     │
│  DS18B20 (Digital) + LM35/TMP36 (Analog)            │
└──────────────────┬──────────────────────────────────┘
                   │
    ┌──────────────▼──────────────┐
    │   Arduino Mega 2560         │
    │   - Read DS18B20 (Pin 2)    │
    │   - Read Analog (Pin A0)    │
    │   - Format: "TEMP:X|BATT:Y" │
    └──────────────┬──────────────┘
                   │ Serial2 @ 9600 baud
    ┌──────────────▼──────────────┐
    │   ESP32 Dev Board           │
    │   - Parse Serial Data       │
    │   - Connect to WiFi         │
    │   - HTTP POST to API        │
    │   - Web Server (Optional)   │
    └──────────────┬──────────────┘
                   │ HTTP/WiFi
    ┌──────────────▼──────────────┐
    │   Next.js API Server        │
    │   /api/sensor-data          │
    │   - Validate Data           │
    │   - Store to JSON           │
    │   - Serve to Dashboard      │
    └──────────────┬──────────────┘
                   │ REST API
    ┌──────────────▼──────────────┐
    │   React Dashboard           │
    │   - Real-time Display       │
    │   - Charts & Graphs         │
    │   - Status Indicators       │
    │   - Mobile Responsive       │
    └─────────────────────────────┘
```

## 📁 Structure du Projet

```
solar-dashboard-pfe/
├── 📱 app/
│   ├── api/
│   │   └── sensor-data/         # API REST endpoints
│   ├── battery-test/            # Page de test
│   └── page.tsx                 # Dashboard principal
│
├── 🎨 components/
│   ├── temperature-display-card.tsx    # Carte température (NEW!)
│   ├── battery-temperature-card.tsx    # Widget compact
│   ├── battery-temperature-chart.tsx   # Graphique historique
│   ├── dashboard-content.tsx           # Layout principal
│   └── ui/                             # Composants réutilisables
│
├── 🔌 hooks/
│   ├── use-battery-temperature.ts      # Hook données température
│   └── use-sensor-connection.ts        # Gestion connexion
│
├── ⚙️ lib/
│   ├── battery-temperature-config.ts   # Configuration
│   ├── battery-temperature-utils.ts    # Utilitaires
│   └── sensor-connection.ts            # Logique connexion
│
├── 🤖 Arduino/
│   ├── ESP32_Battery_Temperature_Example.ino   # Code ESP32
│   └── Arduino_Mega_Temperature_Sensor.ino     # Code Mega
│
├── 📊 data/
│   ├── sensor-readings.json            # Données capteurs
│   └── battery-temperature.json        # Historique batterie
│
└── 📚 Documentation/
    ├── DEPLOYMENT.md                   # Guide de déploiement
    ├── QUICK_START.md                  # Démarrage rapide
    └── setup.bat / setup.sh            # Scripts d'installation
```

## 🚀 Démarrage Rapide

### Option 1: Installation Automatique (Recommandé)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Installation Manuelle

```bash
# 1. Cloner le repo
git clone https://github.com/saadsnani/sw_pfe-solar-final.git
cd sw_pfe-solar-final

# 2. Installer les dépendances
npm install

# 3. Créer les fichiers de données
mkdir -p data
echo "[]" > data/sensor-readings.json
echo "[]" > data/battery-temperature.json

# 4. Lancer le serveur de développement
npm run dev
```

Accédez à: **http://localhost:3000**

### Configuration Hardware

#### 1. Modifier les credentials WiFi
Ouvrir `ESP32_Battery_Temperature_Example.ino` et modifier:
```cpp
const char* ssid = "Votre_WiFi";           // Ligne 23
const char* password = "Votre_Password";   // Ligne 24
const char* serverUrl = "http://192.168.x.x:3000/api/sensor-data";  // Ligne 27
```

#### 2. Câblage
```
ESP32 Pin 16 (RX2) ──→ Arduino Mega TX1 (Pin 18)
ESP32 Pin 17 (TX2) ──→ Arduino Mega RX1 (Pin 19)
ESP32 GND          ──→ Arduino Mega GND

DS18B20:
  - VCC  → 5V
  - DATA → Pin 2
  - GND  → GND

LM35/TMP36:
  - VCC    → 5V
  - OUTPUT → A0
  - GND    → GND
```

#### 3. Upload du Code
```bash
# Arduino Mega
# Ouvrir Arduino_Mega_Temperature_Sensor.ino
# Tools > Board > Arduino Mega 2560
# Tools > Port > (votre port)
# Upload

# ESP32
# Ouvrir ESP32_Battery_Temperature_Example.ino
# Tools > Board > ESP32 Dev Module
# Tools > Port > (votre port)
# Upload
```

## 📊 API Endpoints

### Envoyer des données de capteurs
```bash
POST /api/sensor-data
Content-Type: application/json

{
  "batteryTemperature": 35.5,
  "temperature": 25.2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor data received",
  "data": {
    "batteryTemperature": 35.5,
    "temperature": 25.2,
    "timestamp": "2025-12-19T10:30:00.000Z"
  }
}
```

### Récupérer toutes les données
```bash
GET /api/sensor-data?type=all&limit=20
```

**Response:**
```json
{
  "current": {
    "batteryTemperature": 35.5,
    "temperature": 25.2,
    "timestamp": "2025-12-19T10:30:00.000Z"
  },
  "readings": [...],
  "count": 20
}
```

### Récupérer uniquement température batterie
```bash
GET /api/sensor-data?type=battery
```

## 🎨 Code Couleur des Statuts

| Statut | Température | Couleur | Action |
|--------|------------|---------|---------|
| ❄️ Froid | < 20°C | 🔵 Bleu | Normal |
| ☀️ Normal | 20-40°C | 🟢 Vert | OK |
| 🌡️ Chaud | 40-60°C | 🟡 Jaune | Surveiller |
| 🚨 Critique | > 60°C | 🔴 Rouge | **Alerte!** |

## 🌐 Déploiement en Production

### Vercel (Recommandé - Gratuit)

1. **Push vers GitHub** (déjà fait ✅)
2. **Créer compte Vercel**: [vercel.com](https://vercel.com)
3. **Import projet**: `saadsnani/sw_pfe-solar-final`
4. **Deploy**: Automatique sur chaque push!
5. **URL**: `https://votre-projet.vercel.app`

📖 Guide complet: [DEPLOYMENT.md](DEPLOYMENT.md)

### Configuration ESP32 pour Production
```cpp
// Remplacer localhost par URL Vercel
const char* serverUrl = "https://votre-projet.vercel.app/api/sensor-data";
```

## 📱 Accès Mobile

Le dashboard est **100% responsive** et fonctionne sur:
- 📱 Smartphones (iOS/Android)
- 💻 Tablettes (iPad/Android)
- 🖥️ Desktop (Windows/Mac/Linux)

Accès: `https://votre-projet.vercel.app` (après déploiement)

## 📁 Stockage Données

- **Fichier:** `data/sensor-readings.json` + `data/battery-temperature.json`
- **Format:** JSON Array
- **Limite:** 1000 dernières lectures (auto-nettoyage)
- **Auto-créé:** ✅ Oui
- **Git Ignore:** ✅ Oui (données sensibles)

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🚀 Guide de déploiement complet |
| [QUICK_START_BATTERY.md](QUICK_START_BATTERY.md) | ⚡ Démarrage rapide 2 min |
| [BATTERY_TEMPERATURE_README.md](BATTERY_TEMPERATURE_README.md) | 📖 Guide utilisateur |
| [BATTERY_TEMPERATURE_GUIDE.md](BATTERY_TEMPERATURE_GUIDE.md) | 🔧 Détails techniques |
| [BATTERY_TEMPERATURE_CHECKLIST.md](BATTERY_TEMPERATURE_CHECKLIST.md) | ✅ Checklist déploiement |

## 🛠️ Stack Technologique

### Frontend & Backend
- ⚛️ **Next.js 16** - React framework avec API routes
- 📘 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Styling moderne
- 📊 **Recharts** - Graphiques interactifs
- 🧩 **Radix UI** - Composants accessibles
- 🎯 **React Hooks** - State management

### Hardware
- 🔌 **ESP32** - WiFi & Communication
- 🤖 **Arduino Mega 2560** - Lecture capteurs
- 🌡️ **DS18B20** - Capteur température digital
- 📡 **LM35/TMP36** - Capteur température analogique

### Communication
- 📶 **Serial Protocol** - Arduino ↔ ESP32 @ 9600 baud
- 🌐 **HTTP/REST API** - ESP32 ↔ Next.js Server
- 💾 **JSON Storage** - Persistance des données

## 🎯 Fonctionnalités Avancées

- ✅ **Auto-Refresh** - Mise à jour toutes les 3 secondes
- ✅ **Validation** - Température entre -50°C et 100°C
- ✅ **Error Handling** - Gestion déconnexions
- ✅ **Trend Analysis** - Flèches de tendance (↑ ↓ →)
- ✅ **Critical Alerts** - Animation pulse pour alertes
- ✅ **Connection Status** - Indicateur temps réel
- ✅ **Historical Data** - Graphique 20 dernières lectures
- ✅ **Responsive Design** - Mobile-first
- ✅ **Dark Mode** - Interface moderne

## 🔧 Configuration Avancée

### Variables d'Environnement
Créer `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Personnalisation Seuils
Éditer `lib/battery-temperature-config.ts`:
```typescript
export const TEMPERATURE_THRESHOLDS = {
  COLD: 20,
  NORMAL: 40,
  HOT: 60,
  CRITICAL: 80
}
```

## 🐛 Dépannage

### ESP32 ne se connecte pas au WiFi
```cpp
// Vérifier credentials ligne 23-24
const char* ssid = "Votre_WiFi";
const char* password = "Votre_Password";
```

### Pas de données dans le dashboard
1. Vérifier connexion Serial (ESP32 ↔ Mega)
2. Ouvrir Serial Monitor (115200 baud)
3. Vérifier URL serveur dans ESP32 code
4. Tester API: `curl http://localhost:3000/api/sensor-data?type=all`

### Erreur lecture capteur
- Vérifier câblage DS18B20 (Pin 2)
- Installer bibliothèques: `OneWire`, `DallasTemperature`
- Vérifier alimentation 5V

## 📈 Roadmap

- [ ] Support base de données (PostgreSQL/MongoDB)
- [ ] Notifications email/SMS
- [ ] Export CSV/Excel
- [ ] Authentification utilisateur
- [ ] Mode multi-utilisateur
- [ ] API GraphQL
- [ ] Application mobile native

## 🤝 Contribution

Les contributions sont les bienvenues! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Saad Snani**  
- GitHub: [@saadsnani](https://github.com/saadsnani)
- Projet: [sw_pfe-solar-final](https://github.com/saadsnani/sw_pfe-solar-final)

## 🙏 Remerciements

- Next.js Team pour le framework
- Vercel pour l'hébergement gratuit
- Recharts pour les graphiques
- Communauté Arduino & ESP32

---

**⭐ N'oubliez pas de star le projet si vous le trouvez utile!**

**🚀 Ready to deploy? Read [DEPLOYMENT.md](DEPLOYMENT.md)**
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

