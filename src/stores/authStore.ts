import { reactive, computed } from 'vue'

// Types pour l'authentification
export interface User {
  id: string
  username: string
  role: 'joueur' | 'admin'
  cookies: number
  cookiesTotaux: number
  nombreClics: number
  tempsDeJeu: number
  plusGrandNombreCookies: number
  dateCreation: number
  derniereConnexion: number
  ameliorations: { [key: string]: number }
  // Système de prestige
  niveauPrestige: number
  cookiesTotauxPourPrestige: number
  // Système de succès
  achievementsData?: {
    unlockedAchievements: string[]
    firstPurchases: string[]
  }
}

export interface UserStats {
  cookiesParMinute: number
  position: number
}

// State principal pour l'authentification
const authState = reactive({
  currentUser: null as User | null,
  isLoggedIn: false,
  users: [] as User[],
  showLogin: true
})

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'cookie-clicker-users',
  CURRENT_USER: 'cookie-clicker-current-user'
}

// MUTATIONS
const mutations = {
  // Connexion d'un utilisateur
  loginUser(user: User) {
    authState.currentUser = user
    authState.isLoggedIn = true
    authState.showLogin = false
    user.derniereConnexion = Date.now()
    mutations.saveToLocalStorage()
  },

  // Deconnexion
  logoutUser() {
    authState.currentUser = null
    authState.isLoggedIn = false
    authState.showLogin = true
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },

  // Creer un nouvel utilisateur
  createUser(username: string, role: 'joueur' | 'admin' = 'joueur'): User {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      role,
      cookies: 0,
      cookiesTotaux: 0,
      nombreClics: 0,
      tempsDeJeu: 0,
      plusGrandNombreCookies: 0,
      dateCreation: Date.now(),
      derniereConnexion: Date.now(),
      ameliorations: {},
      // Système de prestige
      niveauPrestige: 0,
      cookiesTotauxPourPrestige: 0
    }

    authState.users.push(newUser)
    mutations.saveToLocalStorage()
    return newUser
  },

  // Mettre a jour les statistiques du joueur actuel
  updateUserStats(stats: Partial<User>) {
    if (authState.currentUser) {
      Object.assign(authState.currentUser, stats)
      mutations.saveToLocalStorage()
    }
  },

  // Admin: modifier les stats d'un utilisateur
  adminUpdateUser(userId: string, updates: Partial<User>) {
    if (authState.currentUser?.role === 'admin') {
      const user = authState.users.find(u => u.id === userId)
      if (user) {
        Object.assign(user, updates)
        mutations.saveToLocalStorage()
      }
    }
  },

  // Admin: reinitialiser un utilisateur
  adminResetUser(userId: string) {
    if (authState.currentUser?.role === 'admin') {
      const user = authState.users.find(u => u.id === userId)
      if (user) {
        user.cookies = 0
        user.cookiesTotaux = 0
        user.nombreClics = 0
        user.tempsDeJeu = 0
        user.plusGrandNombreCookies = 0
        user.ameliorations = {}
        user.niveauPrestige = 0
        user.cookiesTotauxPourPrestige = 0
        mutations.saveToLocalStorage()
      }
    }
  },

  // Supprimer un utilisateur (admin seulement)
  adminDeleteUser(userId: string) {
    if (authState.currentUser?.role === 'admin' && userId !== authState.currentUser.id) {
      authState.users = authState.users.filter(u => u.id !== userId)
      mutations.saveToLocalStorage()
    }
  },

  // Réinitialiser complètement le jeu (admin seulement)
  adminResetAllUsers() {
    if (authState.currentUser?.role === 'admin') {
      // Garder seulement l'admin connecté
      const currentAdmin = authState.currentUser
      authState.users = [currentAdmin]
      mutations.saveToLocalStorage()
    }
  },

  // Sauvegarder dans localStorage
  saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(authState.users))
    if (authState.currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(authState.currentUser))
    }
  },

  // Charger depuis localStorage
  loadFromLocalStorage() {
    try {
      const usersData = localStorage.getItem(STORAGE_KEYS.USERS)
      if (usersData) {
        authState.users = JSON.parse(usersData)
      }

      const currentUserData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (currentUserData) {
        const user = JSON.parse(currentUserData)
        // Verifier que l'utilisateur existe toujours
        const existingUser = authState.users.find(u => u.id === user.id)
        if (existingUser) {
          authState.currentUser = existingUser
          authState.isLoggedIn = true
          authState.showLogin = false
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }
}

// ACTIONS
const actions = {
  // Se connecter ou creer un compte
  async loginOrRegister(username: string) {
    const existingUser = authState.users.find(u => u.username === username)
    
    if (existingUser) {
      mutations.loginUser(existingUser)
      return { success: true, user: existingUser, isNew: false }
    } else {
      const newUser = mutations.createUser(username)
      mutations.loginUser(newUser)
      // Trigger un événement pour signaler un nouvel utilisateur
      console.log('Nouvel utilisateur créé:', newUser.username)
      return { success: true, user: newUser, isNew: true }
    }
  },

  // Se deconnecter
  logout() {
    mutations.logoutUser()
  },

  // Creer un admin (debug)
  createAdmin(username: string) {
    const admin = mutations.createUser(username, 'admin')
    mutations.loginUser(admin)
    return admin
  },

  // Initialiser au demarrage
  initialize() {
    mutations.loadFromLocalStorage()
  },

  // Mettre à jour les données des succès d'un utilisateur
  updateUserAchievements(userId: string, achievementsData: any) {
    const userIndex = authState.users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      authState.users[userIndex].achievementsData = achievementsData
      // Mettre à jour l'utilisateur actuel aussi s'il s'agit du même
      if (authState.currentUser && authState.currentUser.id === userId) {
        authState.currentUser.achievementsData = achievementsData
      }
      mutations.saveToLocalStorage()
      
      // Vérifier le succès de classement après mise à jour
      this.checkLeaderboardAchievement()
    }
  },

  // Vérifier et débloquer le succès de classement si l'utilisateur est premier
  async checkLeaderboardAchievement() {
    if (authState.currentUser && authState.currentUser.role === 'joueur') {
      const leaderboard = getters.leaderboard.value
      const isFirst = leaderboard.length > 0 && leaderboard[0].isCurrentUser
      
      if (isFirst) {
        try {
          const { useAchievementsStore } = await import('./achievementsStore')
          const achievementsStore = useAchievementsStore()
          const gameDataWithRanking = { estPremier: true }
          achievementsStore.actions.checkAchievements(gameDataWithRanking)
        } catch (error) {
          console.warn('Error checking leaderboard achievement:', error)
        }
      }
    }
  }
}

// GETTERS
const getters = {
  // Utilisateur actuel
  currentUser: computed(() => authState.currentUser),
  
  // Est connecte
  isLoggedIn: computed(() => authState.isLoggedIn),
  
  // Afficher le login
  showLogin: computed(() => authState.showLogin),
  
  // Est admin
  isAdmin: computed(() => authState.currentUser?.role === 'admin'),

  // Classement des joueurs (exclut les admins)
  leaderboard: computed(() => {
    return [...authState.users]
      .filter(user => user.role !== 'admin') // Exclure les administrateurs
      .sort((a, b) => b.cookiesTotaux - a.cookiesTotaux)
      .map((user, index) => ({
        position: index + 1,
        username: user.username,
        cookiesTotaux: user.cookiesTotaux,
        cookiesParMinute: user.tempsDeJeu > 0 ? (user.cookiesTotaux / (user.tempsDeJeu / 60)) : 0,
        isCurrentUser: user.id === authState.currentUser?.id
      }))
  }),

  // Statistiques du joueur actuel (null pour les admins)
  currentUserStats: computed(() => {
    if (!authState.currentUser || authState.currentUser.role === 'admin') return null
    
    const leaderboardData: any = getters.leaderboard.value
    const position: number = leaderboardData.findIndex((p: any) => p.isCurrentUser) + 1
    const cookiesParMinute: number = authState.currentUser.tempsDeJeu > 0 
      ? (authState.currentUser.cookiesTotaux / (authState.currentUser.tempsDeJeu / 60)) 
      : 0

    return {
      position,
      cookiesParMinute
    }
  }),

  // Liste des utilisateurs (admin)
  allUsers: computed(() => authState.users)
}

// Export du store
export const useAuthStore = () => {
  return {
    // State
    authState,
    
    // Mutations
    mutations,
    
    // Actions
    actions,
    
    // Getters
    getters
  }
}
