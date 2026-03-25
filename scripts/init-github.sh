#!/bin/bash

# Script pour initialiser le repo GitHub

echo "🚀 Initialisation du repository GitHub..."
echo ""

# Vérifier si git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé!"
    exit 1
fi

# Initialiser git si nécessaire
if [ ! -d .git ]; then
    echo "📦 Initialisation du repo git..."
    git init
    echo "✅ Git repo initialized"
fi

# Ajouter tous les fichiers
echo "📝 Staging all files..."
git add .

# Commit initial
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Solar Dashboard with Battery Temperature Monitoring"

# Instructions pour l'utilisateur
echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Repository initialisé!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Prochaines étapes:"
echo ""
echo "1️⃣  Créez un repo sur GitHub:"
echo "   https://github.com/new"
echo ""
echo "2️⃣  Ajoutez l'origine distant:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/solar-dashboard.git"
echo ""
echo "3️⃣  Renommez la branche principale:"
echo "   git branch -M main"
echo ""
echo "4️⃣  Poussez votre code:"
echo "   git push -u origin main"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo "Fichiers importants à vérifier:"
echo "✅ README.md"
echo "✅ .gitignore"
echo "✅ package.json"
echo ""
echo "Documentation disponible:"
echo "📖 QUICK_START_BATTERY.md"
echo "📖 BATTERY_TEMPERATURE_README.md"
echo ""
