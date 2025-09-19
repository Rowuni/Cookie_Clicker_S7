<template>
  <div class="ameliorations-shop" ref="shopRef" :style="{ background: gradientStyle }">
    <div class="shop-header">
      <h3>🛒 Upgrades</h3>
      
      <!-- Bouton Prestige -->
      <div class="prestige-section">
        <button 
          @click="emit('openPrestige')"
          class="prestige-btn"
          :class="{ 'prestige-available': getters.peutEffectuerPrestige.value }"
        >
          <span class="prestige-icon">⭐</span>
          <div class="prestige-info">
            <div class="prestige-level">Prestige {{ getters.statistiques.value.niveauPrestige }}</div>
            <div class="prestige-multiplier">x{{ getters.statistiques.value.multiplicateurPrestige }}</div>
          </div>
        </button>
      </div>
    </div>
    
    <div class="amelioration-list">
      <div 
        v-for="amelioration in ameliorationsSorted" 
        :key="amelioration.id"
        class="amelioration-item"
        :class="{ 
          'can-buy': getters.peutAcheter.value(amelioration.id),
          'owned': amelioration.quantite > 0 
        }"
        @click="acheterAmelioration(amelioration.id)"
      >
        <div class="amelioration-info">
          <div class="amelioration-name">
            {{ amelioration.nom }}
            <span v-if="amelioration.quantite > 0" class="quantity">{{ amelioration.quantite }}</span>
          </div>
          <div class="amelioration-description">{{ amelioration.description }}</div>
          <div class="amelioration-production">
            <template v-if="amelioration.type === 'clic'">
              +{{ amelioration.clicBonus || 0 }} cookies par clic
              <span v-if="amelioration.quantite > 0">
                (Total: +{{ ((amelioration.clicBonus || 0) * amelioration.quantite) }}/clic)
              </span>
            </template>
            <template v-else>
              +{{ amelioration.production }} cookies/sec
              <span v-if="amelioration.quantite > 0">
                (Total: +{{ (amelioration.production * amelioration.quantite).toFixed(1) }}/sec)
              </span>
            </template>
          </div>
        </div>
        
        <div class="amelioration-cost">
          <div class="cost">{{ formatNumber(amelioration.cout) }} 🍪</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCookieStore } from '../stores/cookieStore'
import { useOptionsStore } from '../stores/optionsStore'
import { useScrollGradient } from '../composables/useScrollGradient'
import { formatNumber } from '../utils/format'

const { ameliorations, actions, getters } = useCookieStore()
const { getters: optionsGetters, actions: optionsActions } = useOptionsStore()
const { scrollProgress, updateScrollProgress, getGradientStyle } = useScrollGradient()

const shopRef = ref<HTMLElement>()
const gradientStyle = computed(() => getGradientStyle(scrollProgress.value))

// Sort upgrades by increasing base price
const ameliorationsSorted = computed(() => {
  return [...ameliorations].sort((a, b) => a.coutBase - b.coutBase)
})

// Émettre l'événement pour ouvrir le prestige dans App.vue
const emit = defineEmits<{
  openPrestige: []
}>()

const acheterAmelioration = (ameliorationId: string) => {
  const success = actions.acheterAmelioration(ameliorationId)
  if (success) {
    // Jouer un son si activé
    if (optionsGetters.soundEnabled.value) {
      optionsActions.playSound('purchase')
    }
    console.log(`Upgrade ${ameliorationId} purchased!`)
  }
}

onMounted(() => {
  if (shopRef.value) {
    const handleScroll = () => {
      if (shopRef.value) {
        updateScrollProgress(shopRef.value)
      }
    }
    
    shopRef.value.addEventListener('scroll', handleScroll)
    
    return () => {
      if (shopRef.value) {
        shopRef.value.removeEventListener('scroll', handleScroll)
      }
    }
  }
})
</script>

<style scoped>
.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.prestige-section {
  display: flex;
  align-items: center;
}

.prestige-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.3), rgba(158, 158, 158, 0.1));
  border: 2px solid #9e9e9e;
  color: #ccc;
  padding: 10px 15px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.prestige-btn.prestige-available {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.1));
  border-color: #ffd700;
  color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  animation: prestige-glow 2s infinite alternate;
}

.prestige-btn:hover {
  transform: scale(1.05);
}

.prestige-available:hover {
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
}

.prestige-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 5px currentColor);
}

.prestige-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.prestige-level {
  font-weight: bold;
  font-size: 0.9rem;
}

.prestige-multiplier {
  font-size: 0.8rem;
  opacity: 0.8;
}

@keyframes prestige-glow {
  0% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  100% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  }
}

.ameliorations-shop {
  /* Le background sera géré dynamiquement par le style inline */
  border-radius: 0;
  padding: 20px;
  color: white;
  box-shadow: 
    inset 0 0 20px rgba(255, 255, 255, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  height: 100vh;
  overflow-y: auto;
  position: relative;
  transition: background 0.3s ease;
}

.ameliorations-shop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 85% 15%, rgba(255, 215, 0, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 15% 25%, rgba(255, 215, 0, 0.08) 1.5px, transparent 1.5px),
    radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.06) 1px, transparent 1px),
    radial-gradient(circle at 25% 85%, rgba(255, 215, 0, 0.1) 2px, transparent 2px);
  background-size: 70px 70px, 90px 90px, 60px 60px, 80px 80px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.ameliorations-shop > * {
  position: relative;
  z-index: 1;
}

.ameliorations-shop h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
  color: white;
}

.amelioration-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amelioration-item {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.amelioration-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.amelioration-item.can-buy {
  opacity: 1;
  border-color: #32CD32;
  background: rgba(50, 205, 50, 0.2);
}

.amelioration-item.owned {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.2);
}

.amelioration-item:not(.can-buy) {
  cursor: not-allowed;
}

.amelioration-item:not(.can-buy):hover {
  transform: none;
}

.amelioration-info {
  flex: 1;
  text-align: left;
}

.amelioration-name {
  font-weight: bold;
  color: #FFE4B5;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.quantity {
  background: #FFD700;
  color: #8B4513;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-left: 8px;
  font-weight: bold;
}

.amelioration-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 3px;
}

.amelioration-production {
  color: #90EE90;
  font-size: 0.85rem;
  font-weight: 600;
}

.amelioration-cost {
  text-align: right;
}

.cost {
  font-weight: bold;
  color: #FFE4B5;
  font-size: 1.1rem;
  font-family: 'Arial Black', Arial, sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Animation pour les achats */
.amelioration-item.can-buy:active {
  transform: scale(0.95);
}

/* Scrollbar personnalisee */
.ameliorations-shop::-webkit-scrollbar {
  width: 8px;
}

.ameliorations-shop::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.ameliorations-shop::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.ameliorations-shop::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive Design pour AmeliorationsShop */
/* Tablettes */
@media (max-width: 1024px) {
  .ameliorations-shop {
    padding: 15px;
    max-height: 500px;
  }
  
  .shop-header h2 {
    font-size: 1.3rem;
  }
  
  .prestige-btn {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
  
  .prestige-icon {
    font-size: 1.3rem;
  }
  
  .amelioration-item {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .amelioration-name {
    font-size: 1rem;
  }
  
  .cost {
    font-size: 1rem;
  }
}

/* Smartphones */
@media (max-width: 768px) {
  .ameliorations-shop {
    padding: 10px;
    max-height: 300px;
  }
  
  .shop-header {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .shop-header h2 {
    font-size: 1.1rem;
    margin: 0;
  }
  
  .prestige-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
  
  .prestige-icon {
    font-size: 1.1rem;
  }
  
  .prestige-info {
    align-items: center;
  }
  
  .prestige-level {
    font-size: 0.8rem;
  }
  
  .prestige-multiplier {
    font-size: 0.7rem;
  }
  
  .amelioration-item {
    padding: 10px;
    margin-bottom: 6px;
    flex-direction: column;
    gap: 8px;
  }
  
  .amelioration-info {
    text-align: center;
  }
  
  .amelioration-name {
    font-size: 0.9rem;
    margin-bottom: 3px;
  }
  
  .quantity {
    padding: 1px 6px;
    font-size: 0.8rem;
    margin-left: 5px;
  }
  
  .amelioration-description {
    font-size: 0.8rem;
    margin-bottom: 2px;
  }
  
  .amelioration-production {
    font-size: 0.75rem;
  }
  
  .amelioration-cost {
    text-align: center;
  }
  
  .cost {
    font-size: 0.9rem;
  }
}

/* Petits smartphones */
@media (max-width: 480px) {
  .ameliorations-shop {
    padding: 8px;
    max-height: 250px;
  }
  
  .shop-header h2 {
    font-size: 1rem;
  }
  
  .prestige-btn {
    padding: 5px 8px;
    font-size: 0.75rem;
  }
  
  .prestige-icon {
    font-size: 1rem;
  }
  
  .prestige-level {
    font-size: 0.75rem;
  }
  
  .prestige-multiplier {
    font-size: 0.65rem;
  }
  
  .amelioration-item {
    padding: 8px;
    margin-bottom: 5px;
  }
  
  .amelioration-name {
    font-size: 0.85rem;
  }
  
  .quantity {
    padding: 1px 5px;
    font-size: 0.7rem;
    margin-left: 3px;
  }
  
  .amelioration-description {
    font-size: 0.75rem;
  }
  
  .amelioration-production {
    font-size: 0.7rem;
  }
  
  .cost {
    font-size: 0.8rem;
  }
}
</style>
