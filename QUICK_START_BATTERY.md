# 🚀 Démarrage Rapide - Température Batterie

## ⏱️ 2 Minutes pour Commencer

### **Étape 1: Lancer le Serveur**
```bash
npm install   # (Si première fois)
npm run dev
```

### **Étape 2: Accéder à la Page de Test**
```
http://localhost:3000/battery-test
```

### **Étape 3: Tester l'Envoi de Données**
1. Entrez une température (ex: `35.5`)
2. Cliquez **"Envoyer"**
3. Voyez les données apparaître en temps réel! 🎉

---

## 📊 Qu'est-ce que Vous Allez Voir?

- ✅ Température actuelle en gros chiffres
- ✅ Statut de la batterie (Froid/Normal/Chaud/Critique)
- ✅ Indicateur de connexion (point vert = connecté)
- ✅ Graphique d'historique
- ✅ Statistiques (Min/Max/Moyenne)

---

## 🔌 Avec Arduino (Optionnel)

### **Pour tester sans Arduino d'abord:**
- Utilisez la page de test `http://localhost:3000/battery-test`
- Le bouton "10 Lectures" génère 10 mesures automatiquement
- C'est tout! Les données s'affichent

### **Quand vous avez Arduino/ESP32:**

1. **Modifiez `ESP32_Battery_Temperature_Example.ino`:**
   ```cpp
   const char* ssid = "VOTRE_WIFI";
   const char* password = "VOTRE_PASSWORD";
   const char* serverUrl = "http://192.168.1.X:3000/api/sensor-data";
   // Remplacez X.X.X.X par votre IP locale
   ```

2. **Trouvez votre IP locale:**
   ```bash
   ipconfig  # Windows
   # ou
   ifconfig  # Mac/Linux
   # Cherchez une adresse 192.168.x.x
   ```

3. **Téléchargez le code sur ESP32**

4. **Les données arrivent automatiquement!** 🎯

---

## 📁 Fichiers Importants

| Fichier | Purpose |
|---------|---------|
| [components/battery-temperature-card.tsx](../components/battery-temperature-card.tsx) | Affiche la température |
| [components/battery-temperature-chart.tsx](../components/battery-temperature-chart.tsx) | Graphique historique |
| [ESP32_Battery_Temperature_Example.ino](../ESP32_Battery_Temperature_Example.ino) | Code Arduino |
| [BATTERY_TEMPERATURE_README.md](../BATTERY_TEMPERATURE_README.md) | Guide complet |

---

## 🧪 Commandes Utiles

### Test API avec cURL
```bash
# Envoyer une température
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"batteryTemperature": 35.5}'

# Récupérer les données
curl http://localhost:3000/api/sensor-data?type=battery
```

### Voir les fichiers de données
```bash
# Windows
cat data/battery-temperature.json

# Mac/Linux
cat data/battery-temperature.json
```

---

## 🎨 Statuts & Couleurs

```
Température    Statut        Couleur
   < 20°C      Froid         🔵 Bleu
  20-40°C      Normal        🟢 Vert
  40-60°C      Chaud         🟡 Orange
   > 60°C      Critique      🔴 Rouge
```

---

## 🐛 Ça Marche Pas?

### **"Page non trouvée"**
- Vérifiez que le serveur tourne: `npm run dev`
- Vérifiez l'URL: `http://localhost:3000/battery-test` (pas /battery-temp)

### **"Aucune donnée"**
- Cliquez d'abord "Envoyer" ou "10 Lectures"
- Attendez 3 secondes (temps de rafraîchissement)
- Vérifiez la console (F12) pour les erreurs

### **"Erreur API"**
- Vérifiez les logs: `npm run dev`
- Vérifiez le fichier existe: `data/battery-temperature.json`
- Vérifiez les permissions du dossier

---

## 📚 Documentation Complète

- [BATTERY_TEMPERATURE_README.md](../BATTERY_TEMPERATURE_README.md) - Guide complet
- [BATTERY_TEMPERATURE_GUIDE.md](../BATTERY_TEMPERATURE_GUIDE.md) - Détails techniques
- [BATTERY_TEMPERATURE_EXAMPLES.tsx](../BATTERY_TEMPERATURE_EXAMPLES.tsx) - Code d'exemple

---

## ✨ Prochaines Étapes

1. ✅ Testez la page: `http://localhost:3000/battery-test`
2. ✅ Intégrez sur le dashboard (déjà fait!)
3. 📱 Connectez votre Arduino (optionnel)
4. 🔔 Ajouter des alertes (documenté)

---

## 💡 Tips

- Le composant rafraîchit **chaque 3 secondes**
- Les données historiques: **dernier 500 mesures**
- Le fichier JSON est dans `data/battery-temperature.json`
- Recharts est déjà installé ✅

---

**Prêt? Allez sur:** http://localhost:3000/battery-test 🚀
