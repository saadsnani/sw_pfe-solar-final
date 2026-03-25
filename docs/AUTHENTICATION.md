# Système d'Authentification - Smart EMS

## 🔐 Fonctionnalités

Le système d'authentification inclut:

### 1. **Inscription (Sign Up)**
- N'importe qui peut créer un compte avec:
  - Adresse email valide
  - Mot de passe (minimum 4 caractères)
- Validation en temps réel du mot de passe
- Message d'erreur si l'email existe déjà

### 2. **Connexion (Sign In)**
- Connexion avec email et mot de passe
- Affichage d'alertes pour les erreurs
- Session persistante (localStorage)

### 3. **Page Logs Connexions**
- **Accessible via le menu latéral** (icône Users)
- Affiche tous les utilisateurs enregistrés
- Historique complet des connexions (100 dernières)
- Statistiques:
  - Total d'utilisateurs
  - Total de connexions
  - Connexions réussies vs échouées
  - Pourcentages
- Export des logs au format JSON
- Dates et heures formatées en français

## 📊 Comment Accéder aux Logs

1. **Connectez-vous** au système
2. Dans le **menu latéral** (sidebar), cliquez sur **"Logs Connexions"** (icône avec plusieurs personnes)
3. Vous verrez:
   - 4 cartes de statistiques en haut
   - Tableau des utilisateurs enregistrés
   - Tableau de l'historique des connexions avec:
     - Email
     - Date et heure
     - Statut (Réussie ✓ / Échouée ✗)

## 🎯 Utilisation

### Créer un Compte
1. Sur la page de login, cliquez sur **"Créer un Compte"**
2. Entrez votre email
3. Entrez un mot de passe (minimum 4 caractères)
4. Cliquez sur **"Créer un Compte"**
5. Une fois créé, vous pouvez vous connecter

### Se Connecter
1. Entrez votre email
2. Entrez votre mot de passe
3. Cliquez sur **"Se Connecter"**

### Voir Qui s'est Connecté
1. Après connexion, allez dans **"Logs Connexions"**
2. Vous verrez tous les utilisateurs et tentatives de connexion
3. Pour exporter les logs, cliquez sur **"Exporter"**

## 💾 Stockage des Données

Les données sont stockées dans le **localStorage** du navigateur:
- `smart-ems-users` : Liste des utilisateurs
- `smart-ems-login-logs` : Historique des connexions (max 100)
- `smart-ems-current-user` : Utilisateur actuellement connecté

## 🔒 Sécurité

⚠️ **Note importante**: Ce système est pour le développement local. En production:
- Les mots de passe doivent être hashés (bcrypt, argon2)
- Utiliser une vraie base de données
- Ajouter des tokens JWT
- Implémenter rate limiting
- Ajouter authentification 2FA

## 📱 Interface

### Page de Login/Inscription
- Design moderne avec arrière-plan solaire
- Animation de particules
- Basculer entre Login et Sign Up
- Validation en temps réel
- Messages d'alerte clairs

### Page Logs Connexions
- 4 cartes de statistiques
- 2 tableaux (Utilisateurs et Logs)
- Boutons Actualiser et Exporter
- Design responsive
- Badges colorés pour les statuts

## 🚀 Prochaines Étapes (Production)

Pour déployer en production, vous devriez:

1. **Backend API** (Node.js/Express ou Next.js API Routes)
   ```javascript
   // api/auth/register
   // api/auth/login
   // api/auth/logout
   // api/admin/logs
   ```

2. **Base de Données** (PostgreSQL, MongoDB, MySQL)
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE,
     password_hash VARCHAR(255),
     created_at TIMESTAMP
   );
   
   CREATE TABLE login_logs (
     id SERIAL PRIMARY KEY,
     user_id INT,
     status VARCHAR(20),
     ip_address VARCHAR(45),
     user_agent TEXT,
     timestamp TIMESTAMP
   );
   ```

3. **Sécurité**
   - Hash passwords avec bcrypt
   - JWT tokens pour sessions
   - HTTPS obligatoire
   - Rate limiting sur login
   - Protection CSRF

4. **Monitoring**
   - Logs serveur
   - Alertes pour tentatives suspectes
   - Sauvegarde régulière de la DB

## 📞 Support

Pour toute question sur le système d'authentification, consultez:
- `lib/auth.ts` : Logique d'authentification
- `components/login-page.tsx` : Interface login/signup
- `components/user-logs-page.tsx` : Page des logs
