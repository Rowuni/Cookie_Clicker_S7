import { ref, reactive, computed } from 'vue'

// Interface pour les options
export interface GameOptions {
  // Audio
  soundEnabled: boolean
  soundVolume: number
  
  // Affichage
  animationsEnabled: boolean
  particlesEnabled: boolean
  reducedMotion: boolean
  
  // Notifications
  achievementNotifications: boolean
  notificationDuration: number
  
  // Gameplay
  autoSave: boolean
  showDetailedStats: boolean
  confirmPrestige: boolean
}

// Options par défaut
export const defaultOptions: GameOptions = {
  // Audio
  soundEnabled: true,
  soundVolume: 50,
  
  // Affichage
  animationsEnabled: true,
  particlesEnabled: true,
  reducedMotion: false,
  
  // Notifications
  achievementNotifications: true,
  notificationDuration: 5,
  
  // Gameplay
  autoSave: true,
  showDetailedStats: false,
  confirmPrestige: true
}

// State réactif
const options = reactive<GameOptions>({ ...defaultOptions })
const isLoaded = ref(false)

// Clé de stockage local
const STORAGE_KEY = 'cookie-clicker-options'

// Actions
const actions = {
  // Charger les options depuis localStorage
  loadOptions() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedOptions = JSON.parse(saved)
        Object.assign(options, { ...defaultOptions, ...parsedOptions })
      }
      isLoaded.value = true
      
      // Appliquer les options immédiatement
      actions.applyOptions()
    } catch (error) {
      console.warn('Error loading options:', error)
      isLoaded.value = true
    }
  },

  // Sauvegarder les options dans localStorage
  saveOptions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
      actions.applyOptions()
      
      // Émettre un événement global pour que les autres composants puissent réagir
      window.dispatchEvent(new CustomEvent('optionsChanged', { detail: options }))
    } catch (error) {
      console.warn('Error saving options:', error)
    }
  },

  // Mettre à jour une option
  updateOption<K extends keyof GameOptions>(key: K, value: GameOptions[K]) {
    (options as any)[key] = value
    actions.saveOptions()
  },

  // Restaurer les options par défaut
  resetToDefaults() {
    Object.assign(options, defaultOptions)
    actions.saveOptions()
  },

  // Appliquer les options au DOM et au style global
  applyOptions() {
    const root = document.documentElement
    
    // Appliquer les options de mouvement réduit
    if (options.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.1s')
      root.style.setProperty('--transition-duration', '0.1s')
    } else {
      root.style.setProperty('--animation-duration', '0.3s')
      root.style.setProperty('--transition-duration', '0.3s')
    }

    // Appliquer les options d'animations
    if (!options.animationsEnabled) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }

    // Option pour les particules (sera utilisée par SimpleCookie.vue)
    root.setAttribute('data-particles-enabled', options.particlesEnabled.toString())
    
    // Option pour le volume sonore (sera utilisée pour les futurs sons)
    root.style.setProperty('--sound-volume', (options.soundVolume / 100).toString())
  },

  // Jouer un son si les sons sont activés
  playSound(soundType: 'click' | 'achievement' | 'purchase' = 'click') {
    if (!options.soundEnabled) return
    
    // Créer un son simple avec l'API Web Audio
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Différentes fréquences pour différents types de sons
      const frequencies = {
        click: 800,
        achievement: 1200,
        purchase: 600
      }
      
      oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime)
      oscillator.type = 'sine'
      
      // Volume basé sur les options
      const volume = (options.soundVolume / 100) * 0.1 // Volume faible pour éviter d'être trop fort
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      // Fallback silencieux si l'audio ne fonctionne pas
      console.warn('Audio not available:', error)
    }
  }
}

// Getters
const getters = {
  options: computed(() => options),
  isLoaded: computed(() => isLoaded.value),
  
  // Getters spécifiques pour faciliter l'utilisation
  soundEnabled: computed(() => options.soundEnabled),
  soundVolume: computed(() => options.soundVolume),
  animationsEnabled: computed(() => options.animationsEnabled),
  particlesEnabled: computed(() => options.particlesEnabled),
  reducedMotion: computed(() => options.reducedMotion),
  achievementNotifications: computed(() => options.achievementNotifications),
  notificationDuration: computed(() => options.notificationDuration),
  autoSave: computed(() => options.autoSave),
  showDetailedStats: computed(() => options.showDetailedStats),
  confirmPrestige: computed(() => options.confirmPrestige)
}

// Initialiser les options au chargement du module
actions.loadOptions()

export function useOptionsStore() {
  return {
    getters,
    actions
  }
}

// Export direct pour usage simple
export { options, actions as optionsActions, getters as optionsGetters }
