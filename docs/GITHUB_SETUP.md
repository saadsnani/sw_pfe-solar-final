# 🚀 Guide GitHub - Solar Dashboard

## Étapes pour Mettre sur GitHub

### 1️⃣ Créer un Repository sur GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. **Repository name:** `solar-dashboard` (ou ce que tu veux)
3. **Description:** "Système de monitoring température batterie en temps réel"
4. **Public** ou **Private** (ton choix)
5. **Do NOT** initialize with README (on en a déjà un)
6. Click **Create repository**

### 2️⃣ Configuration Locale

```bash
# Aller dans le dossier du projet
cd c:\Users\SAAD\Desktop\solar-dashboard-pfe

# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: Solar Dashboard with Battery Temperature Monitoring"

# Ajouter l'origin distant
git remote add origin https://github.com/YOUR-USERNAME/solar-dashboard.git

# Renommer la branche (main par défaut)
git branch -M main

# Push vers GitHub
git push -u origin main
```

**Remplace `YOUR-USERNAME` par ton username GitHub!**

### 3️⃣ Vérifier sur GitHub

- Allez sur `https://github.com/YOUR-USERNAME/solar-dashboard`
- Tous vos fichiers devraient être visibles ✅

## 📁 Fichiers Importants pour GitHub

- ✅ `README.md` - Page d'accueil du repo
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ `package.json` - Dépendances npm
- ✅ `docs/` - Documentation
- ✅ `.github/workflows/` - CI/CD (optionnel)

## 🏷️ Tags & Releases

Après le premier push, créez une release:

```bash
git tag -a v1.0.0 -m "Initial Release"
git push origin v1.0.0
```

Puis allez sur GitHub → Releases → Create Release

## 📝 Branches Recommandées

### Main Branch
```bash
git checkout main
# Pour les versions stables
```

### Development Branch
```bash
git checkout -b develop
git push -u origin develop
# Pour le développement actif
```

### Feature Branches
```bash
git checkout -b feature/battery-alerts
# Pour les nouvelles fonctionnalités
```

## 🔐 Secrets GitHub (si besoin)

Pour les credentials WiFi, allez sur:
**Settings → Secrets → New repository secret**

```
WIFI_SSID=Smiya_Dyal_Wifi
WIFI_PASSWORD=Code_Dyal_Wifi
SERVER_IP=192.168.x.x
```

## 📊 Ajouter des Badges au README

```markdown
[![GitHub](https://img.shields.io/badge/GitHub-solar--dashboard-blue)](https://github.com/YOUR-USERNAME/solar-dashboard)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](README.md)
```

## 🔄 Workflow Git Recommandé

```bash
# 1. Créer une feature branch
git checkout -b feature/my-feature

# 2. Faire des modifications
# ... edit files ...

# 3. Commit les changements
git add .
git commit -m "Description du changement"

# 4. Push vers GitHub
git push origin feature/my-feature

# 5. Créer une Pull Request sur GitHub
# → Compare & Pull Request button

# 6. Merger dans main
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main
```

## 📚 Resources

- [GitHub Docs](https://docs.github.com)
- [Git Commands](https://git-scm.com/docs)
- [GitHub SSH Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

## 🛠️ Commandes Utiles

```bash
# Voir l'état actuel
git status

# Voir l'historique
git log --oneline

# Voir les branches
git branch -a

# Changer de branche
git checkout branch-name

# Créer et changer de branche
git checkout -b new-branch

# Supprimer une branche locale
git branch -d branch-name

# Supprimer une branche distante
git push origin --delete branch-name

# Récupérer les changements distants
git fetch origin

# Tirer et merger
git pull origin main

# Voir les différences
git diff

# Annuler le dernier commit (local seulement)
git reset --soft HEAD~1
```

## 🚨 Attention

**NE PAS PUSHER:**
- ❌ `.env` (credentials)
- ❌ `node_modules/`
- ❌ `data/battery-temperature.json`
- ❌ Fichiers locaux `.vscode/`, `.idea/`

Ces fichiers sont dans `.gitignore` ✅

## ✅ Checklist

- [ ] Créer le repo sur GitHub
- [ ] Configurer git localement
- [ ] Ajouter l'origin distant
- [ ] Faire le premier push
- [ ] Vérifier sur GitHub
- [ ] Créer une release
- [ ] Partager le lien

## 📞 Besoin d'Aide?

- Consultez [README.md](README.md)
- Ouvrez une [Issue](https://github.com/YOUR-USERNAME/solar-dashboard/issues)
- Créez une [Discussion](https://github.com/YOUR-USERNAME/solar-dashboard/discussions)

---

**Status:** ✅ Prêt à push  
**Repo URL:** `https://github.com/YOUR-USERNAME/solar-dashboard`
