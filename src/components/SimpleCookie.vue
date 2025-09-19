<template>
  <div class="cookie-container">
    <!-- Nombre de cookies au-dessus -->
    <div class="cookie-count">
      {{ formatNumber(getters.totalCookies.value) }} cookies
    </div>
    
    <!-- Cookies par seconde juste en dessous du total -->
    <div class="cookies-per-second-main">
      {{ formatNumber(getters.cookiesParSeconde.value) }} cookies/sec
    </div>
    
    <!-- Cookie au centre -->
    <button 
      class="cookie-button" 
      @click="clickCookie"
      :class="{ 'cookie-clicked': isClicked, 'cookie-idle': isIdle }"
    >
      🍪
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCookieStore } from '../stores/cookieStore'
import { useOptionsStore } from '../stores/optionsStore'
import { formatNumber } from '../utils/format'

const { actions, getters } = useCookieStore()
const { getters: optionsGetters, actions: optionsActions } = useOptionsStore()

const isClicked = ref(false)
const isIdle = ref(false)
let idleTimeout: number | null = null

const clickCookie = () => {
  actions.cliquerCookie()
  
  // Jouer le son si activé
  if (optionsGetters.soundEnabled.value) {
    optionsActions.playSound('click')
  }
  
  // Animation seulement si activée
  if (optionsGetters.animationsEnabled.value) {
    isClicked.value = true
    isIdle.value = false
    
    // Cancel previous timeout
    if (idleTimeout) {
      clearTimeout(idleTimeout)
    }
    
    // Animation rapide (durée adaptée selon les options)
    const animationDuration = optionsGetters.reducedMotion.value ? 50 : 150
    setTimeout(() => {
      isClicked.value = false
    }, animationDuration)
    
    // Commencer l'animation idle apres 1 seconde
    idleTimeout = setTimeout(() => {
      isIdle.value = true
    }, 1000)
  }
  
  // Créer des particules si activées
  if (optionsGetters.particlesEnabled.value && optionsGetters.animationsEnabled.value) {
    createClickParticles()
  }
}

// Créer des particules lors du clic
const createClickParticles = () => {
  const container = document.querySelector('.cookie-container')
  if (!container) return
  
  // Créer plusieurs particules
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div')
    particle.className = 'click-particle'
    particle.textContent = '+' + formatNumber(getters.cookiesParClic.value)
    
    // Position aléatoire autour du cookie
    const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5
    const distance = 50 + Math.random() * 30
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    
    particle.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #DAA520;
      font-weight: bold;
      font-size: 14px;
      pointer-events: none;
      z-index: 1000;
      --target-x: ${x}px;
      --target-y: ${y}px;
    `
    
    container.appendChild(particle)
    
    // Animer la particule
    const animationDuration = optionsGetters.reducedMotion.value ? 300 : 800
    particle.style.animation = `particle-float ${animationDuration}ms ease-out forwards`
    
    // Supprimer la particule après l'animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    }, animationDuration)
  }
}

// Demarrer l'animation idle au montage
onMounted(() => {
  if (optionsGetters.animationsEnabled.value) {
    idleTimeout = setTimeout(() => {
      isIdle.value = true
    }, 1000)
  }
})

// Nettoyer le timeout au demontage
onUnmounted(() => {
  if (idleTimeout) {
    clearTimeout(idleTimeout)
  }
})
</script>

<style scoped>
.cookie-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 20px;
  gap: 20px;
  position: relative;
}

.cookie-count {
  font-size: 3rem;
  font-weight: bold;
  color: #8B4513;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Arial Black', Arial, sans-serif;
  margin-bottom: 10px;
}

.cookies-per-second-main {
  font-size: 1.8rem;
  color: #D2691E;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
}

.cookie-button {
  font-size: 200px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 20px;
  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.2));
}

.cookie-button:hover {
  transform: scale(1.1);
}

.cookie-button:active,
.cookie-button.cookie-clicked {
  transform: scale(0.9);
}

.cookie-button.cookie-idle {
  animation: idle-pulse 2s ease-in-out infinite;
}

.cookies-per-second {
  font-size: 1.5rem;
  color: #D2691E;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Responsive Design pour SimpleCookie */
/* Tablettes */
@media (max-width: 1024px) {
  .cookie-container {
    min-height: 50vh;
    padding: 15px;
    gap: 15px;
  }
  
  .cookie-count {
    font-size: 2.5rem;
  }
  
  .cookies-per-second-main {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .cookie-button {
    font-size: 160px;
    padding: 15px;
  }
  
  .cookies-per-second {
    font-size: 1.3rem;
  }
}

/* Smartphones */
@media (max-width: 768px) {
  .cookie-container {
    min-height: 40vh;
    padding: 10px;
    gap: 10px;
  }
  
  .cookie-count {
    font-size: 2rem;
    margin-bottom: 8px;
  }
  
  .cookies-per-second-main {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }
  
  .cookie-button {
    font-size: 120px;
    padding: 10px;
  }
  
  .cookie-button:hover {
    transform: scale(1.05);
  }
  
  .cookies-per-second {
    font-size: 1.1rem;
  }
}

/* Petits smartphones */
@media (max-width: 480px) {
  .cookie-container {
    min-height: 35vh;
    padding: 8px;
    gap: 8px;
  }
  
  .cookie-count {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }
  
  .cookies-per-second-main {
    font-size: 1rem;
    margin-bottom: 10px;
  }
  
  .cookie-button {
    font-size: 80px;
    padding: 8px;
  }
  
  .cookies-per-second {
    font-size: 0.9rem;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-10px) scale(1.05);
  }
  60% {
    transform: translateY(-5px) scale(1.02);
  }
}

@keyframes idle-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes particle-float {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--target-x)), calc(-50% + var(--target-y))) scale(0.5);
    opacity: 0;
  }
}

.cookie-clicked {
  animation: bounce 0.3s ease-in-out;
}

/* Styles pour les particules de clic */
:deep(.click-particle) {
  position: absolute;
  color: #DAA520;
  font-weight: bold;
  font-size: 14px;
  pointer-events: none;
  z-index: 1000;
  user-select: none;
}

/* Support pour les options de mouvement réduit */
:global(.no-animations) .cookie-button {
  transition: none !important;
  animation: none !important;
}

:global(.no-animations) .cookie-button:hover {
  transform: none !important;
}

:global(.no-animations) .cookie-button:active {
  transform: scale(0.95) !important;
}
</style>
