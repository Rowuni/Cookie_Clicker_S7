<template>
  <div id="app">
    <!-- Formulaire de connexion -->
    <LoginForm v-if="showLogin" />
    
    <!-- Interface d'administration -->
    <AdminInterface v-else-if="isAdmin" />
    
    <!-- Interface de jeu pour les joueurs -->
    <main v-else class="main-content">
      <div class="game-layout">
        <!-- Menu de gauche -->
        <div class="left-panel">
          <LeftMenu @logout-request="showLogoutConfirm = true" />
        </div>

        <!-- Panneau central : Cookie -->
        <div class="center-panel">
          <SimpleCookie />
        </div>

        <!-- Panneau de droite : Boutique -->
        <div class="right-panel">
          <AmeliorationsShop @open-prestige="showPrestigeDialog = true" />
        </div>
      </div>
    </main>
    
    <!-- Logout confirmation dialog (centered on screen) -->
    <ConfirmDialog
      :show="showLogoutConfirm"
      title="Logout"
      message="Are you sure you want to log out?"
      confirm-text="Log out"
      cancel-text="Cancel"
      @confirm="confirmLogout"
      @cancel="showLogoutConfirm = false"
    />
    
    <!-- Dialog de Prestige (centré sur l'écran) -->
    <PrestigeDialog 
      :show="showPrestigeDialog"
      @close="showPrestigeDialog = false"
      @prestige="onPrestige"
    />
    
    <!-- Notification de succès -->
    <AchievementNotification
      :achievement="currentNotificationAchievement"
      :show="showAchievementNotification"
      @dismiss="dismissAchievementNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import SimpleCookie from './components/SimpleCookie.vue'
import LeftMenu from './components/LeftMenu.vue'
import AmeliorationsShop from './components/AmeliorationsShop.vue'
import LoginForm from './components/LoginForm.vue'
import AdminInterface from './components/AdminInterface.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import PrestigeDialog from './components/PrestigeDialog.vue'
import AchievementNotification from './components/AchievementNotification.vue'
import { useCookieStore } from './stores/cookieStore'
import { useAuthStore } from './stores/authStore'
import { useAchievementsStore } from './stores/achievementsStore'
import { useOptionsStore } from './stores/optionsStore'

const { actions } = useCookieStore()
const { getters: authGetters, actions: authActions } = useAuthStore()
const { getters: achievementsGetters, mutations: achievementsMutations } = useAchievementsStore()
const { actions: optionsActions } = useOptionsStore()

const showLogin = authGetters.showLogin
const isAdmin = authGetters.isAdmin
const showLogoutConfirm = ref(false)
const showPrestigeDialog = ref(false)

// Notification des succès
const showAchievementNotification = ref(false)
const currentNotificationAchievement = ref<any>(null)
const notificationQueue = ref<any[]>([])

const confirmLogout = () => {
  authActions.logout()
  showLogoutConfirm.value = false
}

const onPrestige = () => {
  console.log('Prestige performed!')
  showPrestigeDialog.value = false
}

// Fonctions pour les notifications de succès
const dismissAchievementNotification = () => {
  showAchievementNotification.value = false
  currentNotificationAchievement.value = null
  
  // Afficher le prochain succès dans la queue s'il y en a
  if (notificationQueue.value.length > 0) {
    const nextAchievement = notificationQueue.value.shift()
    setTimeout(() => {
      showNewAchievement(nextAchievement)
    }, 500)
  }
}

const showNewAchievement = (achievement: any) => {
  if (showAchievementNotification.value) {
    // Si une notification est déjà affichée, mettre en queue
    notificationQueue.value.push(achievement)
  } else {
    currentNotificationAchievement.value = achievement
    showAchievementNotification.value = true
  }
}

// Watcher pour détecter les nouveaux succès
watch(() => achievementsGetters.newAchievements.value, (newAchievements) => {
  if (newAchievements.length > 0) {
    // Traiter tous les nouveaux succès
    newAchievements.forEach((achievement: any) => {
      showNewAchievement(achievement)
    })
    
    // Effacer les nouveaux succès après les avoir traités
    achievementsMutations.clearNewAchievements()
  }
}, { deep: true })

// Watcher pour détecter les changements d'utilisateur
watch(authGetters.currentUser, (newUser, oldUser) => {
  if (newUser && newUser !== oldUser) {
    // Nouvel utilisateur connecté
    console.log('Changement d\'utilisateur détecté:', newUser.username)
    
    // Charger les données seulement si c'est un joueur (pas un admin)
    if (newUser.role === 'joueur') {
      actions.loadFromAuth()
    }
  } else if (!newUser && oldUser) {
    // Utilisateur déconnecté, réinitialiser seulement si c'était un joueur
    console.log('Utilisateur déconnecté')
    if (oldUser.role === 'joueur') {
      actions.resetGameState()
    }
  }
}, { immediate: false })

// Initialiser l'authentification au démarrage
onMounted(() => {
  authActions.initialize()
  
  // Initialiser les options (chargement et application)
  optionsActions.loadOptions()
  
  // Si un utilisateur joueur est connecté, charger ses données
  if (authGetters.isLoggedIn.value && authGetters.currentUser.value?.role === 'joueur') {
    actions.loadFromAuth()
  }
  
  // Démarrer la production auto seulement pour les joueurs
  if (!authGetters.isAdmin.value) {
    actions.demarrerProductionAuto()
  }
})

// Arreter la production automatique au demontage
onUnmounted(() => {
  if (!authGetters.isAdmin.value) {
    actions.arreterProductionAuto()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 234, 167, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(250, 177, 160, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(255, 193, 7, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #FFEAA7 0%, #FAB1A0 50%, #E17055 100%);
  position: relative;
}

/* Effet de cookies en arriere-plan */
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 90% 20%, rgba(139, 69, 19, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 30% 80%, rgba(139, 69, 19, 0.1) 1.5px, transparent 1.5px),
    radial-gradient(circle at 70% 60%, rgba(139, 69, 19, 0.1) 1px, transparent 1px);
  background-size: 200px 200px, 300px 300px, 150px 150px, 250px 250px;
  animation: float-cookies 20s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes float-cookies {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-5px) rotate(-1deg); }
}

.main-content {
  min-height: 100vh;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-layout {
  display: grid;
  grid-template-columns: 350px 1fr 450px;
  gap: 0px;
  max-width: 100%;
  width: 100%;
  min-height: 80vh;
  align-items: start;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  overflow-y: auto;
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

/* Responsive Design */
/* Tablettes et écrans moyens */
@media (max-width: 1400px) {
  .game-layout {
    grid-template-columns: 300px 1fr 400px;
  }
}

@media (max-width: 1200px) {
  .game-layout {
    grid-template-columns: 250px 1fr 350px;
    gap: 10px;
  }
  
  .left-panel, .right-panel {
    height: 100vh;
  }
}

/* Tablettes en mode portrait */
@media (max-width: 1024px) {
  .game-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 15px;
    max-width: 100%;
  }
  
  .left-panel {
    order: 2;
    height: auto;
    max-height: 400px;
  }
  
  .center-panel {
    order: 1;
    min-height: 50vh;
  }
  
  .right-panel {
    order: 3;
    height: auto;
    max-height: 500px;
  }
}

/* Smartphones et petites tablettes */
@media (max-width: 768px) {
  .main-content {
    padding: 5px;
  }
  
  .game-layout {
    gap: 10px;
  }
  
  .center-panel {
    min-height: 40vh;
  }
  
  .left-panel, .right-panel {
    max-height: 300px;
  }
}

/* Petits smartphones */
@media (max-width: 480px) {
  .main-content {
    padding: 5px;
  }
  
  .game-layout {
    gap: 8px;
  }
  
  .center-panel {
    min-height: 35vh;
  }
  
  .left-panel, .right-panel {
    max-height: 250px;
  }
}
</style>
