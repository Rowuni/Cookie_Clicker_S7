import { reactive, computed } from 'vue'

// Import du store des succès
import { useAchievementsStore } from './achievementsStore'
import { useAuthStore } from './authStore'

// Interface pour les améliorations
interface Amelioration {
  id: string
  nom: string
  description: string
  cout: number
  coutBase: number
  production: number
  quantite: number
  multiplicateur: number
  type?: 'production' | 'clic' // Nouveau: type d'amélioration
  clicBonus?: number // Nouveau: bonus de cookies par clic
}

// State principal du jeu
const gameState = reactive({
  cookies: 0,
  productionAuto: 0,
  cookiesTotaux: 0, // Total de cookies produits (ne diminue jamais)
  nombreClics: 0,
  tempsDeJeu: 0, // en secondes
  tempsDebut: Date.now(),
  plusGrandNombreCookies: 0, // Le plus grand nombre de cookies possédé
  derniereMiseAJourTemps: Date.now(), // Pour calculer correctement le temps
  // Système de prestige
  niveauPrestige: 0,
  cookiesTotauxPourPrestige: 0, // Cookies totaux accumulés pour déterminer le prestige disponible
  // Système de cookies par clic
  cookiesParClic: 1 // Nombre de cookies obtenus par clic
})

// Liste des améliorations disponibles
const ameliorations = reactive<Amelioration[]>([
  // Améliorations de clic
  {
    id: 'curseur-renforce',
    nom: 'Reinforced Cursor',
    description: 'Doubles the power of your clicks',
    cout: 25,
    coutBase: 25,
    production: 0,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'clic',
    clicBonus: 1
  },
  {
    id: 'gants-magiques',
    nom: 'Magic Gloves',
    description: 'Enchanted gloves that amplify your clicks',
    cout: 250,
    coutBase: 250,
    production: 0,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'clic',
    clicBonus: 5
  },
  {
    id: 'baguette-creation',
    nom: 'Creation Wand',
    description: 'Mystical artifact that materializes cookies with a simple click',
    cout: 2500,
    coutBase: 2500,
    production: 0,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'clic',
    clicBonus: 25
  },
  
  // Améliorations de production automatique
  {
    id: 'robot-patissier',
    nom: 'Pastry Robot',
    description: 'A small robot that kneads dough automatically',
    cout: 15,
    coutBase: 15,
    production: 0.1,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'laboratoire-sucre',
    nom: 'Sugar Laboratory',
    description: 'Scientists who optimize recipes',
    cout: 100,
    coutBase: 100,
    production: 1,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'nano-fournaise',
    nom: 'Nano-Furnace',
    description: 'Ultra-fast quantum baking technology',
    cout: 1100,
    coutBase: 1100,
    production: 8,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'portail-dimensionnel',
    nom: 'Dimensional Portal',
    description: 'Imports cookies from parallel dimensions',
    cout: 12000,
    coutBase: 12000,
    production: 47,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'ia-culinaire',
    nom: 'Culinary AI',
    description: 'Artificial intelligence specialized in pastry',
    cout: 130000,
    coutBase: 130000,
    production: 260,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'machine-temporelle',
    nom: 'Time Machine',
    description: 'Time travel to steal cookies from the future',
    cout: 1400000,
    coutBase: 1400000,
    production: 1400,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'cookies-stellaires',
    nom: 'Stellar Cookies',
    description: 'Harvesting cookies from distant stars',
    cout: 20000000,
    coutBase: 20000000,
    production: 7800,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'generateur-quantique',
    nom: 'Quantum Generator',
    description: 'Manipulates reality to create quantum cookies',
    cout: 330000000,
    coutBase: 330000000,
    production: 44000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  // Nouvelles améliorations de niveau supérieur
  {
    id: 'matrice-fractale',
    nom: 'Fractal Matrix',
    description: 'Infinite mathematical structure generating recursive cookies',
    cout: 5100000000,
    coutBase: 5100000000,
    production: 260000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'usine-universelle',
    nom: 'Universal Factory',
    description: 'Industrial complex exploiting an entire galaxy',
    cout: 75000000000,
    coutBase: 75000000000,
    production: 1600000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'reacteur-antimatiere',
    nom: 'Antimatter Reactor',
    description: 'Converts antimatter into pure cookies',
    cout: 1000000000000,
    coutBase: 1000000000000,
    production: 10000000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'prismes-realite',
    nom: 'Reality Prisms',
    description: 'Crystals warping the fabric of space-time',
    cout: 14000000000000,
    coutBase: 14000000000000,
    production: 65000000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'manipulateurs-probabilite',
    nom: 'Probability Manipulators',
    description: 'Machines altering the laws of cosmic chance',
    cout: 170000000000000,
    coutBase: 170000000000000,
    production: 430000000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'singularite-sucrée',
    nom: 'Sweet Singularity',
    description: 'Black hole specialized in cookie creation',
    cout: 2100000000000000,
    coutBase: 2100000000000000,
    production: 2900000000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  },
  {
    id: 'console-cosmique',
    nom: 'Cosmic Console',
    description: 'Terminal allowing you to program the entire universe',
    cout: 26000000000000000,
    coutBase: 26000000000000000,
    production: 21000000000,
    quantite: 0,
    multiplicateur: 1.15,
    type: 'production'
  }
])

// Variables pour la boucle de jeu
let intervalId: number | null = null
let secondsCounter: number = 0

// MUTATIONS - Fonctions qui modifient le state
const mutations = {
  // Ajouter des cookies
  ajouterCookies(nombre: number) {
    gameState.cookies += nombre
    gameState.cookiesTotaux += nombre
    gameState.cookiesTotauxPourPrestige += nombre
    
    // Mettre à jour le plus grand nombre de cookies
    if (gameState.cookies > gameState.plusGrandNombreCookies) {
      gameState.plusGrandNombreCookies = Math.floor(gameState.cookies)
    }
    
    // Vérifier les succès de cookies
    try {
      const achievementsStore = useAchievementsStore()
      const gameDataWithRanking = actions.getGameDataWithRanking()
      achievementsStore.actions.checkAchievements(gameDataWithRanking)
    } catch (error) {
      console.warn('Erreur lors de la vérification des succès:', error)
    }
    
    // Synchroniser avec le store d'authentification
    actions.syncWithAuth()
  },

  // Incrementer le nombre de clics
  incrementerClics() {
    gameState.nombreClics++
    
    // Vérifier les succès de clics (pas à chaque clic pour les performances)
    if (gameState.nombreClics % 10 === 0) {
      try {
        const achievementsStore = useAchievementsStore()
        achievementsStore.actions.checkAchievements(gameState)
      } catch (error) {
        console.warn('Erreur lors de la vérification des succès:', error)
      }
    }
  },

  // Mettre a jour le temps de jeu
  mettreAJourTempsDeJeu() {
    const maintenant = Date.now()
    const tempsEcoule = (maintenant - gameState.derniereMiseAJourTemps) / 1000
    gameState.tempsDeJeu += tempsEcoule
    gameState.derniereMiseAJourTemps = maintenant
    
    // Vérifier les succès de temps toutes les minutes
    if (Math.floor(gameState.tempsDeJeu) % 60 === 0) {
      try {
        const achievementsStore = useAchievementsStore()
        achievementsStore.actions.checkAchievements(gameState)
      } catch (error) {
        console.warn('Erreur lors de la vérification des succès:', error)
      }
    }
  },

  // Acheter une amélioration
  acheterAmelioration(ameliorationId: string) {
    const amelioration = ameliorations.find(a => a.id === ameliorationId)
    if (!amelioration) return false

    // Vérifier si on a assez de cookies
    if (gameState.cookies >= amelioration.cout) {
      // Déduire le coût
      gameState.cookies -= amelioration.cout
      
      // Augmenter la quantité
      amelioration.quantite++
      
      // Recalculer le coût pour le prochain achat
      amelioration.cout = Math.ceil(amelioration.coutBase * Math.pow(amelioration.multiplicateur, amelioration.quantite))
      
      // Mettre à jour la production automatique
      actions.calculerProductionAuto()
      
      return true
    }
    return false
  },

  // Mettre à jour la production automatique
  mettreAJourProductionAuto(nouvelleProduction: number) {
    gameState.productionAuto = nouvelleProduction
  },

  // Mettre à jour les cookies par clic
  mettreAJourCookiesParClic() {
    // Calculer le multiplicateur de prestige
    let multiplicateurPrestige = 1
    if (gameState.niveauPrestige === 1) {
      multiplicateurPrestige = 2 // x2
    } else if (gameState.niveauPrestige === 2) {
      multiplicateurPrestige = 4 // x4  
    } else if (gameState.niveauPrestige >= 3) {
      multiplicateurPrestige = Math.pow(2, gameState.niveauPrestige + 1) // x8, x16, x32, etc.
    }

    // Calculer les bonus des améliorations de clic
    const bonusClicAmeliorations = ameliorations.reduce((total, amelioration) => {
      if (amelioration.quantite > 0 && amelioration.type === 'clic') {
        return total + (amelioration.clicBonus || 0) * amelioration.quantite
      }
      return total
    }, 0)

    // Calculer les cookies par clic = base + bonus améliorations, le tout multiplié par prestige
    gameState.cookiesParClic = Math.round(((1 + bonusClicAmeliorations) * multiplicateurPrestige) * 1000) / 1000
  }
}

// ACTIONS - Fonctions qui orchestrent les mutations
const actions = {
  // Fonction helper pour obtenir les données de jeu complètes avec classement
  getGameDataWithRanking() {
    return { ...gameState, estPremier: false } // Simple pour l'instant
  },

  // Cliquer sur le cookie
  cliquerCookie() {
    mutations.ajouterCookies(gameState.cookiesParClic)
    mutations.incrementerClics()
  },

  // Synchroniser avec le store d'authentification
  syncWithAuth() {
    try {
      const { getters: authGetters, mutations: authMutations } = useAuthStore()
      
      if (authGetters.currentUser.value) {
        authMutations.updateUserStats({
          cookies: Math.floor(gameState.cookies),
          cookiesTotaux: Math.floor(gameState.cookiesTotaux),
          nombreClics: gameState.nombreClics,
          tempsDeJeu: gameState.tempsDeJeu,
          plusGrandNombreCookies: gameState.plusGrandNombreCookies,
          niveauPrestige: gameState.niveauPrestige,
          cookiesTotauxPourPrestige: Math.floor(gameState.cookiesTotauxPourPrestige),
          ameliorations: Object.fromEntries(
            ameliorations.map(a => [a.id, a.quantite])
          )
        })
      }
    } catch (error) {
      console.error('Synchronization error:', error)
    }
  },

  // Charger les données depuis l'authentification
  loadFromAuth() {
    try {
      const { getters: authGetters } = useAuthStore()
      const user = authGetters.currentUser.value
      
      if (user) {
        // Réinitialiser complètement le state
        gameState.cookies = user.cookies || 0
        gameState.cookiesTotaux = user.cookiesTotaux || 0
        gameState.nombreClics = user.nombreClics || 0
        gameState.tempsDeJeu = user.tempsDeJeu || 0
        gameState.plusGrandNombreCookies = user.plusGrandNombreCookies || 0
        gameState.niveauPrestige = user.niveauPrestige || 0
        gameState.cookiesTotauxPourPrestige = user.cookiesTotauxPourPrestige || 0
        gameState.tempsDebut = Date.now()
        gameState.derniereMiseAJourTemps = Date.now() // Réinitialiser le timer
        
        // Réinitialiser toutes les améliorations à 0 d'abord
        ameliorations.forEach(amelioration => {
          amelioration.quantite = 0
          amelioration.cout = amelioration.coutBase
        })
        
        // Charger les améliorations de l'utilisateur
        if (user.ameliorations) {
          ameliorations.forEach(amelioration => {
            if (user.ameliorations[amelioration.id]) {
              amelioration.quantite = user.ameliorations[amelioration.id]
              // Recalculer le coût basé sur la quantité
              amelioration.cout = Math.ceil(
                amelioration.coutBase * Math.pow(amelioration.multiplicateur, amelioration.quantite)
              )
            }
          })
        }
        
        // Recalculer la production
        actions.calculerProductionAuto()
        
        // Recalculer les cookies par clic
        mutations.mettreAJourCookiesParClic()
        
        // Charger les succès utilisateur
        try {
          const achievementsStore = useAchievementsStore()
          achievementsStore.actions.loadUserAchievements(user)
        } catch (error) {
          console.warn('Erreur lors du chargement des succès:', error)
        }
        
        console.log('Données chargées pour:', user.username)
      }
    } catch (error) {
      console.error('Erreur de chargement:', error)
    }
  },

  // Réinitialiser le state (pour nouveau joueur)
  resetGameState() {
    gameState.cookies = 0
    gameState.cookiesTotaux = 0
    gameState.nombreClics = 0
    gameState.tempsDeJeu = 0
    gameState.plusGrandNombreCookies = 0
    gameState.productionAuto = 0
    gameState.tempsDebut = Date.now()
    gameState.derniereMiseAJourTemps = Date.now()
    
    // Réinitialiser toutes les améliorations
    ameliorations.forEach(amelioration => {
      amelioration.quantite = 0
      amelioration.cout = amelioration.coutBase
    })
    
    // Initialiser les cookies par clic
    mutations.mettreAJourCookiesParClic()
  },

  // Acheter une amélioration
  acheterAmelioration(ameliorationId: string) {
    const result = mutations.acheterAmelioration(ameliorationId)
    if (result) {
      // Mettre à jour les cookies par clic après achat
      mutations.mettreAJourCookiesParClic()
      
      // Vérifier les succès
      try {
        const achievementsStore = useAchievementsStore()
        achievementsStore.actions.recordFirstPurchase(ameliorationId, gameState)
      } catch (error) {
        console.warn('Erreur lors de la vérification des succès:', error)
      }
      
      actions.syncWithAuth()
    }
    return result
  },

  // Calculer la production automatique totale avec bonus de prestige
  calculerProductionAuto() {
    const productionTotale = ameliorations.reduce((total, amelioration) => {
      return total + (amelioration.production * amelioration.quantite)
    }, 0)
    
    // Appliquer le multiplicateur de prestige : x2^(niveau+1) pour niveau > 0
    let multiplicateurPrestige = 1
    if (gameState.niveauPrestige === 1) {
      multiplicateurPrestige = 2 // x2
    } else if (gameState.niveauPrestige === 2) {
      multiplicateurPrestige = 4 // x4  
    } else if (gameState.niveauPrestige >= 3) {
      multiplicateurPrestige = Math.pow(2, gameState.niveauPrestige + 1) // x8, x16, x32, etc.
    }
    
    const productionAvecPrestige = productionTotale * multiplicateurPrestige
    
    mutations.mettreAJourProductionAuto(productionAvecPrestige)
  },

  // Effectuer un prestige
  effectuerPrestige() {
    const coutPrestige = actions.calculerCoutPrestige()
    
    if (gameState.cookies >= coutPrestige) {
      // Augmenter le niveau de prestige
      gameState.niveauPrestige++
      
      // Réinitialiser COMPLÈTEMENT le jeu
      gameState.cookies = 0
      gameState.cookiesTotaux = 0
      gameState.nombreClics = 0
      gameState.tempsDeJeu = 0
      gameState.tempsDebut = Date.now()
      gameState.derniereMiseAJourTemps = Date.now()
      gameState.plusGrandNombreCookies = 0
      
      // Réinitialiser le compteur pour prestige
      gameState.cookiesTotauxPourPrestige = 0
      
      // Réinitialiser toutes les améliorations
      ameliorations.forEach(amelioration => {
        amelioration.quantite = 0
        amelioration.cout = amelioration.coutBase
      })
      
      // Recalculer la production (qui sera 0 + bonus prestige pour les futurs achats)
      actions.calculerProductionAuto()
      
      // Recalculer les cookies par clic avec nouveau bonus prestige
      mutations.mettreAJourCookiesParClic()
      
      // Synchroniser
      actions.syncWithAuth()
      
      return true
    }
    return false
  },

  // Calculer le coût du prochain prestige
  calculerCoutPrestige() {
    const niveauSuivant = gameState.niveauPrestige + 1
    if (niveauSuivant === 1) {
      return 1000000 // 1M pour le premier prestige
    } else if (niveauSuivant === 2) {
      return 1000000000 // 1B pour le deuxième prestige (x4)
    } else {
      // Pour le niveau 3+ : 1T, 1Q, etc. (progression par 1000x)
      return Math.pow(1000, niveauSuivant + 1) // 1T, 1Q, 1Qi, etc.
    }
  },

  // Démarrer la production automatique
  demarrerProductionAuto() {
    if (intervalId !== null) return // Déjà démarré

    intervalId = setInterval(() => {
      if (gameState.productionAuto > 0) {
        // Production par seconde divisée par 10 (100ms d'intervalle)
        mutations.ajouterCookies(gameState.productionAuto / 10)
      }
      
      // Mettre à jour le temps seulement chaque seconde (tous les 1000ms)
      secondsCounter++
      if (secondsCounter >= 10) { // 10 * 100ms = 1000ms = 1s
        mutations.mettreAJourTempsDeJeu()
        secondsCounter = 0
        
        // Synchroniser avec l'auth toutes les 5 secondes
        if (Math.floor(gameState.tempsDeJeu) % 5 === 0) {
          actions.syncWithAuth()
        }
      }
    }, 100) // 10 fois par seconde pour une animation fluide
  },

  // Arrêter la production automatique
  arreterProductionAuto() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
      secondsCounter = 0
    }
  }
}

// GETTERS - Propriétés calculées pour afficher les statistiques
const getters = {
  // Nombre total de cookies
  totalCookies: computed(() => Math.floor(gameState.cookies)),

  // Production par seconde
  cookiesParSeconde: computed(() => gameState.productionAuto),

  // Cookies par clic
  cookiesParClic: computed(() => gameState.cookiesParClic),

  // Peut-on acheter une amélioration ?
  peutAcheter: computed(() => (ameliorationId: string) => {
    const amelioration = ameliorations.find(a => a.id === ameliorationId)
    return amelioration ? gameState.cookies >= amelioration.cout : false
  }),

  // Statistiques globales avec données de prestige
  statistiques: computed(() => {
    // Calculer le multiplicateur de prestige correct
    let multiplicateurPrestige = 1
    if (gameState.niveauPrestige === 1) {
      multiplicateurPrestige = 2 // x2
    } else if (gameState.niveauPrestige === 2) {
      multiplicateurPrestige = 4 // x4  
    } else if (gameState.niveauPrestige >= 3) {
      multiplicateurPrestige = Math.pow(2, gameState.niveauPrestige + 1) // x8, x16, x32, etc.
    }
    
    return {
      cookies: Math.floor(gameState.cookies),
      cookiesTotaux: Math.floor(gameState.cookiesTotaux),
      plusGrandNombreCookies: gameState.plusGrandNombreCookies,
      nombreClics: gameState.nombreClics,
      tempsDeJeu: gameState.tempsDeJeu,
      productionAuto: gameState.productionAuto,
      cookiesParSeconde: gameState.productionAuto,
      cookiesParClic: gameState.cookiesParClic,
      totalAmeliorations: ameliorations.reduce((total, a) => total + a.quantite, 0),
      niveauPrestige: gameState.niveauPrestige,
      cookiesTotauxPourPrestige: Math.floor(gameState.cookiesTotauxPourPrestige),
      coutProchainPrestige: actions.calculerCoutPrestige(),
      multiplicateurPrestige: multiplicateurPrestige
    }
  }),

  // Peut effectuer un prestige
  peutEffectuerPrestige: computed(() => {
    const cout = actions.calculerCoutPrestige()
    return gameState.cookies >= cout
  })
}

// Export du store
export const useCookieStore = () => {
  return {
    // State
    gameState,
    ameliorations,
    
    // Mutations
    mutations,
    
    // Actions
    actions,
    
    // Getters
    getters
  }
}
