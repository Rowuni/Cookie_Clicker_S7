# 🍪 Cookie Clicker

Un jeu Cookie Clicker complet développé avec Vue.js 3 et TypeScript.

## 🎮 Fonctionnalités

### 🍪 **Système de Jeu**
- **Clic sur cookie** : Gagnez des cookies en cliquant
- **Production automatique** : Générez des cookies passivement
- **Système d'améliorations** : 13 types d'améliorations différentes
- **Système de prestige** : Redémarrez avec des bonus permanents

### 👤 **Système Utilisateur**
- **Authentification** : Connexion et inscription
- **Sauvegarde cloud** : Les données sont sauvegardées automatiquement
- **Classement** : Comparez vos scores avec d'autres joueurs
- **Interface admin** : Gestion des utilisateurs

### 🏆 **Système d'Achievements**
- **24 succès** répartis en différentes catégories.

### ⚙️ **Options & Personnalisation**
- **Options audio** : Sons et musique
- **Options d'affichage** : Thèmes et animations
- **Options de notifications** : Personnalisez les alertes
- **Options de gameplay** : Confirmations et paramètres
- **Import/Export** : Sauvegardez et restaurez vos paramètres

### 📱 **Interface Responsive**
- **Multi-plateforme** : Fonctionne sur desktop, tablette et mobile
- **Design adaptatif** : Interface optimisée pour tous les écrans
- **Animations fluides** : Effets visuels optimisés
- **Interface moderne** : Design soigné et intuitif

## 🏗️ Technologies utilisées

- **Vue.js 3** : Framework JavaScript avec Composition API
- **TypeScript** : Typage statique
- **Vite** : Outil de build moderne
- **CSS3** : Animations et design responsive
- **Pinia-like stores** : Gestion d'état réactive

## 🚀 Installation et lancement

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Lancement en mode développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible à l'adresse : http://localhost:5173/

3. **Build pour la production**
   ```bash
   npm run build
   ```

## 🎯 Comment jouer

1. **Créez un compte** ou connectez-vous
2. **Cliquez sur le cookie** 🍪 pour gagner vos premiers cookies
3. **Achetez des améliorations** pour augmenter votre production ou votre nombre de cookies par clic
4. **Débloquez des succès** pour montrer votre progression
5. **Utilisez le prestige** pour des bonus permanents
6. **Grimpez dans le classement** et emparez vous de la première place

## 📁 Architecture du projet

```
src/
├── components/              # Composants Vue.js
│   ├── SimpleCookie.vue        # Cookie principal
│   ├── AmeliorationsShop.vue   # Boutique d'améliorations
│   ├── LeftMenu.vue           # Menu avec stats/succès/options
│   ├── GameStatistiques.vue   # Statistiques détaillées
│   ├── AchievementsPanel.vue  # Panneau des succès
│   ├── PrestigeDialog.vue     # Interface de prestige
│   ├── LoginForm.vue          # Authentification
│   ├── AdminInterface.vue     # Interface d'administration
│   ├── Leaderboard.vue        # Classement
│   └── OptionsPanel.vue       # Panneau d'options
├── stores/                  # Gestion d'état
│   ├── cookieStore.ts         # État principal du jeu
│   ├── achievementsStore.ts   # Gestion des succès
│   ├── authStore.ts           # Authentification
│   └── optionsStore.ts        # Paramètres utilisateur
├── composables/             # Logique réutilisable
├── utils/                   # Fonctions utilitaires
├── App.vue                  # Composant principal
├── main.ts                  # Point d'entrée
└── style.css               # Styles globaux
```

## 🎨 Design

Le jeu utilise un thème chaleureux inspiré des cookies :
- **Palette de couleurs** : Tons marrons, dorés et oranges
- **Animations fluides** : Transitions et effets visuels
- **Interface intuitive** : Navigation simple et claire
- **Responsive design** : Adapté à tous les appareils

## 🔧 Fonctionnalités techniques

- **Sauvegarde automatique** : Données synchronisées en temps réel
- **Performance optimisée** : Animations conditionnelles et gestion d'état efficace
- **Gestion d'erreurs** : Validation et messages d'erreur appropriés
- **Accessibilité** : Support clavier et screen readers
- **PWA Ready** : Architecture préparée pour une application web progressive
