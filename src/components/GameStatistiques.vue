<template>
  <div class="game-stats">
    <div class="detailed-stats">
      <div class="stat-item">
        <span class="stat-label">Cookies produced:</span>
        <span class="stat-value">{{ formatNumber(getters.statistiques.value.cookiesTotaux) }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">Highest amount:</span>
        <span class="stat-value">{{ formatNumber(getters.statistiques.value.plusGrandNombreCookies) }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">👆 Cookies per click:</span>
        <span class="stat-value">{{ formatNumber(getters.statistiques.value.cookiesParClic) }}</span>
      </div>

      <!-- Statistiques de Prestige -->
      <div class="stat-item prestige-stat">
        <span class="stat-label">⭐ Prestige:</span>
        <span class="stat-value">Level {{ getters.statistiques.value.niveauPrestige }}</span>
      </div>
      
      <div class="stat-item prestige-stat" v-if="getters.statistiques.value.niveauPrestige > 0">
        <span class="stat-label">✨ Multiplier:</span>
        <span class="stat-value">x{{ getters.statistiques.value.multiplicateurPrestige }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">Upgrades:</span>
        <span class="stat-value">{{ getters.statistiques.value.totalAmeliorations }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">Number of clicks:</span>
        <span class="stat-value">{{ getters.statistiques.value.nombreClics.toLocaleString() }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">Playtime:</span>
        <span class="stat-value">{{ formatTime(getters.statistiques.value.tempsDeJeu) }}</span>
      </div>

      <!-- Statistiques détaillées (seulement si l'option est activée) -->
      <template v-if="optionsGetters.showDetailedStats.value">
        <div class="detailed-section">
          <h4 class="section-title">📊 Detailed statistics</h4>
          
          <div class="stat-item detailed">
            <span class="stat-label">💰 Efficiency per click:</span>
            <span class="stat-value">{{ (getters.statistiques.value.cookiesTotaux / Math.max(getters.statistiques.value.nombreClics, 1)).toFixed(2) }}</span>
          </div>
          
          <div class="stat-item detailed">
            <span class="stat-label">⚡ Cookies/min:</span>
            <span class="stat-value">{{ formatNumber(getters.statistiques.value.cookiesParSeconde * 60) }}</span>
          </div>
          
          <div class="stat-item detailed">
            <span class="stat-label">🏁 Cookies/hour:</span>
            <span class="stat-value">{{ formatNumber(getters.statistiques.value.cookiesParSeconde * 3600) }}</span>
          </div>
          
          <div class="stat-item detailed">
            <span class="stat-label">⏱️ Click rate:</span>
            <span class="stat-value">{{ (getters.statistiques.value.nombreClics / Math.max(getters.statistiques.value.tempsDeJeu, 1)).toFixed(2) }} clicks/sec</span>
          </div>
          
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCookieStore } from '../stores/cookieStore'
import { useOptionsStore } from '../stores/optionsStore'
import { formatNumber, formatTime } from '../utils/format'

const { getters } = useCookieStore()
const { getters: optionsGetters } = useOptionsStore()
</script>

<style scoped>
.game-stats {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
  color: white;
  text-align: center;
}

.detailed-stats {
  padding-top: 12px;
}

.stat-item.prestige-stat .stat-label {
  color: #ffd700;
  font-weight: bold;
}

.stat-item.prestige-stat .stat-value {
  color: #ffd700;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0;
  padding: 3px 0;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 0.9rem;
}

.stat-value {
  color: #FFE4B5;
  font-weight: bold;
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 0.9rem;
}

/* Styles pour les statistiques détaillées */
.detailed-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  color: #DAA520;
  font-size: 0.95rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.stat-item.detailed .stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.stat-item.detailed .stat-value {
  color: #DAA520;
  font-size: 0.85rem;
}

/* Animation pour les nombres qui changent */
.cookies-count {
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Responsive */
@media (max-width: 1024px) {
  .game-stats {
    padding: 12px;
  }
  
  .detailed-section {
    margin-top: 12px;
    padding-top: 12px;
  }
  
  .section-title {
    font-size: 0.9rem;
  }
  
  .stat-item {
    margin: 5px 0;
  }
  
  .stat-label, .stat-value {
    font-size: 0.85rem;
  }
  
  .stat-item.detailed .stat-label,
  .stat-item.detailed .stat-value {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .cookies-count {
    font-size: 1.5rem;
  }
  
  .game-stats {
    padding: 10px;
  }
  
  .detailed-section {
    margin-top: 10px;
    padding-top: 10px;
  }
  
  .section-title {
    font-size: 0.85rem;
  }
  
  .stat-item {
    margin: 4px 0;
    padding: 2px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .stat-value {
    font-size: 0.8rem;
    align-self: flex-end;
  }
  
  .stat-item.detailed .stat-label {
    font-size: 0.75rem;
  }
  
  .stat-item.detailed .stat-value {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .game-stats {
    padding: 8px;
  }
  
  .section-title {
    font-size: 0.8rem;
  }
  
  .stat-item {
    margin: 3px 0;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .stat-value {
    font-size: 0.75rem;
  }
  
  .stat-item.detailed .stat-label,
  .stat-item.detailed .stat-value {
    font-size: 0.7rem;
  }
}
</style>
