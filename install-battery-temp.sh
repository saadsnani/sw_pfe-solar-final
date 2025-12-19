#!/bin/bash

# ============================================
# Installation Script - Température Batterie
# ============================================
# Exécutez: bash install-battery-temp.sh

echo "📦 Installation Température Batterie..."
echo ""

# Vérifier les dépendances
echo "✓ Vérification dépendances..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm non installé"
    exit 1
fi

echo "✓ Node.js et npm détectés"
echo ""

# Installer dépendances
echo "📥 Installation des dépendances..."
npm install

echo ""
echo "✓ Dépendances installées"
echo ""

# Créer répertoire data
echo "📁 Création du dossier de données..."
mkdir -p data
echo "✓ Dossier 'data' créé"
echo ""

# Vérifier Recharts
echo "✓ Vérification Recharts..."
npm list recharts | grep -q recharts && echo "✓ Recharts disponible" || echo "⚠ Recharts manquant"
echo ""

# Créer fichier environment
if [ ! -f .env.local ]; then
    echo "📝 Création .env.local..."
    cp .env.battery.example .env.local
    echo "✓ .env.local créé (à modifier si besoin)"
fi
echo ""

echo "════════════════════════════════════════"
echo "✅ Installation Terminée!"
echo "════════════════════════════════════════"
echo ""
echo "Prochaines étapes:"
echo "1. npm run dev          # Démarrer le serveur"
echo "2. http://localhost:3000/battery-test"
echo ""
echo "Consultez QUICK_START_BATTERY.md pour plus d'infos"
echo "════════════════════════════════════════"
