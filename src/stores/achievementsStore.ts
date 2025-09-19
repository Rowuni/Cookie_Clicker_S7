import { reactive, computed } from 'vue'

// Interface pour un succès
interface Achievement {
  id: string
  nom: string
  description: string
  icone: string
  categorie: 'amelioration' | 'cookies' | 'clics' | 'classement' | 'prestige' | 'temps'
  condition: (gameData: any) => boolean
  secret?: boolean // Pour les succès secrets
}

// State des succès
const achievementsState = reactive({
  unlockedAchievements: [] as string[], // IDs des succès débloqués
  newAchievements: [] as string[], // Succès récemment débloqués pour notification
  firstPurchases: new Set<string>() // Améliorations achetées pour la première fois (persist avec prestige)
})

// Liste de tous les succès disponibles
const achievements = reactive<Achievement[]>([
  // Succès d'améliorations - Premier achat
  {
    id: 'first-robot-patissier',
    nom: 'First Assistant',
    description: 'Buy your first Pastry Robot',
    icone: '🤖',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('robot-patissier')
  },
  {
    id: 'first-curseur-renforce',
    nom: 'Enhanced Click',
    description: 'Buy your first Reinforced Cursor',
    icone: '👆',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('curseur-renforce')
  },
  {
    id: 'first-laboratoire-sucre',
    nom: 'Sugar Scientist',
    description: 'Buy your first Sugar Laboratory',
    icone: '🔬',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('laboratoire-sucre')
  },
  {
    id: 'first-gants-magiques',
    nom: 'Click Magic',
    description: 'Buy your first Magic Gloves',
    icone: '🧤',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('gants-magiques')
  },
  {
    id: 'first-nano-fournaise',
    nom: 'Quantum Technology',
    description: 'Buy your first Nano-Furnace',
    icone: '⚛️',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('nano-fournaise')
  },
  {
    id: 'first-baguette-creation',
    nom: 'Artifact Master',
    description: 'Buy your first Creation Wand',
    icone: '🪄',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('baguette-creation')
  },
  {
    id: 'first-portail-dimensionnel',
    nom: 'Dimensional Traveler',
    description: 'Buy your first Dimensional Portal',
    icone: '🌀',
    categorie: 'amelioration',
    condition: (data) => data.firstPurchases.has('portail-dimensionnel')
  },

  // Succès de cookies totaux
  {
    id: 'cookies-100k',
    nom: 'One Hundred Thousand!',
    description: 'Produce 100,000 cookies in total',
    icone: '💯',
    categorie: 'cookies',
    condition: (data) => data.cookiesTotaux >= 100000
  },
  {
    id: 'cookies-1m',
    nom: 'Millionaire',
    description: 'Produce 1 million cookies in total',
    icone: '💰',
    categorie: 'cookies',
    condition: (data) => data.cookiesTotaux >= 1000000
  },
  {
    id: 'cookies-100m',
    nom: 'Cookie Tycoon',
    description: 'Produce 100 million cookies in total',
    icone: '🏦',
    categorie: 'cookies',
    condition: (data) => data.cookiesTotaux >= 100000000
  },
  {
    id: 'cookies-1b',
    nom: 'Billionaire',
    description: 'Produire 1 milliard de cookies au total',
    icone: '💎',
    categorie: 'cookies',
    condition: (data) => data.cookiesTotaux >= 1000000000
  },
  {
    id: 'cookies-1t',
    nom: 'Cookie Emperor',
    description: 'Produire 1 trillion de cookies au total',
    icone: '👑',
    categorie: 'cookies',
    condition: (data) => data.cookiesTotaux >= 1000000000000
  },

  // Succès de clics
  {
    id: 'clics-100',
    nom: 'Beginner Clicker',
    description: 'Effectuer 100 clics',
    icone: '👆',
    categorie: 'clics',
    condition: (data) => data.nombreClics >= 100
  },
  {
    id: 'clics-1000',
    nom: 'Experienced Clicker',
    description: 'Effectuer 1 000 clics',
    icone: '⚡',
    categorie: 'clics',
    condition: (data) => data.nombreClics >= 1000
  },
  {
    id: 'clics-10000',
    nom: 'Expert Clicker',
    description: 'Effectuer 10 000 clics',
    icone: '💨',
    categorie: 'clics',
    condition: (data) => data.nombreClics >= 10000
  },
  {
    id: 'clics-100000',
    nom: 'Legendary Clicker',
    description: 'Perform 100,000 clicks',
    icone: '🔥',
    categorie: 'clics',
    condition: (data) => data.nombreClics >= 100000
  },
  {
    id: 'clics-1000000',
    nom: 'Click God',
    description: 'Perform 1 million clicks',
    icone: '⭐',
    categorie: 'clics',
    condition: (data) => data.nombreClics >= 1000000
  },

  // Succès de prestige
  {
    id: 'premier-prestige',
    nom: 'Renaissance',
    description: 'Perform your first prestige',
    icone: '⭐',
    categorie: 'prestige',
    condition: (data) => data.niveauPrestige >= 1
  },

  // Succès de temps de jeu
  {
    id: 'temps-5min',
    nom: 'First Steps',
    description: 'Play for 5 minutes',
    icone: '⏱️',
    categorie: 'temps',
    condition: (data) => data.tempsDeJeu >= 5 * 60 // 5 minutes
  },
  {
    id: 'temps-15min',
    nom: 'Addicted',
    description: 'Play for 15 minutes',
    icone: '⏰',
    categorie: 'temps',
    condition: (data) => data.tempsDeJeu >= 15 * 60 // 15 minutes
  },
  {
    id: 'temps-1h',
    nom: 'Dedicated',
    description: 'Play for 1 hour',
    icone: '🕐',
    categorie: 'temps',
    condition: (data) => data.tempsDeJeu >= 60 * 60 // 1 heure
  },
  {
    id: 'temps-5h',
    nom: 'Passionné',
    description: 'Jouer pendant 5 heures',
    icone: '🕐',
    categorie: 'temps',
    condition: (data) => data.tempsDeJeu >= 5 * 60 * 60 // 5 heures
  },
  {
    id: 'temps-10h',
    nom: 'Vétéran',
    description: 'Jouer pendant 10 heures',
    icone: '⏳',
    categorie: 'temps',
    condition: (data) => data.tempsDeJeu >= 10 * 60 * 60 // 10 heures
  },
  {
    id: 'temps-100h',
    nom: 'Légende',
    description: 'Jouer pendant 100 heures',
    icone: '👑',
    categorie: 'temps',
    condition: (data) => data.tempsDeJeu >= 100 * 60 * 60 // 100 heures
  }
])

// Mutations
const mutations = {
  // Débloquer un succès
  unlockAchievement(achievementId: string) {
    if (!achievementsState.unlockedAchievements.includes(achievementId)) {
      achievementsState.unlockedAchievements.push(achievementId)
      achievementsState.newAchievements.push(achievementId)
      console.log(`🏆 Succès débloqué: ${achievementId}`)
      return true
    }
    return false
  },

  // Marquer un premier achat (persist même après prestige)
  markFirstPurchase(ameliorationId: string) {
    achievementsState.firstPurchases.add(ameliorationId)
  },

  // Effacer les notifications de nouveaux succès
  clearNewAchievements() {
    achievementsState.newAchievements = []
  },

  // Charger les données des succès depuis le stockage
  loadAchievementsData(data: any) {
    if (data.unlockedAchievements) {
      achievementsState.unlockedAchievements = [...data.unlockedAchievements]
    }
    if (data.firstPurchases) {
      achievementsState.firstPurchases = new Set(data.firstPurchases)
    }
  },

  // Réinitialiser les succès pour un nouveau joueur
  resetAchievements() {
    achievementsState.unlockedAchievements = []
    achievementsState.newAchievements = []
    achievementsState.firstPurchases = new Set()
  }
}

// Actions
const actions = {
  // Vérifier tous les succès et débloquer ceux qui sont remplis
  checkAchievements(gameData: any) {
    let newUnlocks = 0

    achievements.forEach(achievement => {
      if (!achievementsState.unlockedAchievements.includes(achievement.id)) {
        const dataForCheck = {
          ...gameData,
          firstPurchases: achievementsState.firstPurchases
        }
        
        if (achievement.condition(dataForCheck)) {
          mutations.unlockAchievement(achievement.id)
          newUnlocks++
        }
      }
    })

    // Synchroniser avec le store d'authentification si des succès ont été débloqués
    if (newUnlocks > 0) {
      actions.syncWithAuth()
    }

    return newUnlocks
  },

  // Enregistrer un premier achat et vérifier les succès
  recordFirstPurchase(ameliorationId: string, gameData: any) {
    if (!achievementsState.firstPurchases.has(ameliorationId)) {
      mutations.markFirstPurchase(ameliorationId)
      actions.checkAchievements(gameData)
      actions.syncWithAuth()
    }
  },

  // Synchroniser avec le store d'authentification
  async syncWithAuth() {
    try {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getters.currentUser.value
      
      if (user) {
        // Sauvegarder les données des succès dans le profil utilisateur
        const achievementsData = {
          unlockedAchievements: achievementsState.unlockedAchievements,
          firstPurchases: Array.from(achievementsState.firstPurchases)
        }
        
        authStore.actions.updateUserAchievements(user.id, achievementsData)
      }
    } catch (error) {
      console.warn('Achievement synchronization error:', error)
    }
  },

  // Charger les données d'un utilisateur
  loadUserAchievements(user: any) {
    if (user.achievementsData) {
      mutations.loadAchievementsData(user.achievementsData)
    } else {
      mutations.resetAchievements()
    }
  }
}

// Getters
const getters = {
  // Tous les succès
  allAchievements: computed(() => achievements),

  // Succès débloqués
  unlockedAchievements: computed(() => 
    achievements.filter(a => achievementsState.unlockedAchievements.includes(a.id))
  ),

  // Succès verrouillés
  lockedAchievements: computed(() => 
    achievements.filter(a => !achievementsState.unlockedAchievements.includes(a.id))
  ),

  // Nouveaux succès pour notification
  newAchievements: computed(() => 
    achievements.filter(a => achievementsState.newAchievements.includes(a.id))
  ),

  // Statistiques des succès
  achievementStats: computed(() => ({
    total: achievements.length,
    unlocked: achievementsState.unlockedAchievements.length,
    progress: Math.round((achievementsState.unlockedAchievements.length / achievements.length) * 100)
  })),

  // Succès par catégorie
  achievementsByCategory: computed(() => {
    const categories = {} as Record<string, Achievement[]>
    achievements.forEach(achievement => {
      if (!categories[achievement.categorie]) {
        categories[achievement.categorie] = []
      }
      categories[achievement.categorie].push({
        ...achievement,
        unlocked: achievementsState.unlockedAchievements.includes(achievement.id)
      } as Achievement & { unlocked: boolean })
    })
    return categories
  })
}

export const useAchievementsStore = () => {
  return {
    // State
    achievementsState,
    achievements,
    
    // Mutations
    mutations,
    
    // Actions
    actions,
    
    // Getters
    getters
  }
}
