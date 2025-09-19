<template>
  <div v-if="show" class="prestige-overlay" @click.self="$emit('close')">
    <div class="prestige-dialog">
      <div class="prestige-header">
        <h2>⭐ Prestige System ⭐</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="prestige-content">
        <div class="prestige-info">
          <h3>Current Prestige Level: {{ stats.niveauPrestige }}</h3>
          <p class="current-multiplier">
            Production multiplier: x{{ stats.multiplicateurPrestige }}
          </p>
        </div>

        <div class="prestige-explanation">
          <h4>How does Prestige work?</h4>
          <ul>
            <li><strong>Multiplier:</strong> Each level doubles your cookie production</li>
            <li><strong>Cost:</strong> Based on your currently owned cookies</li>
            <li><strong>Reset:</strong> All cookies and upgrades are lost</li>
            <li><strong>Progression:</strong> Start over with a permanent production bonus</li>
          </ul>
        </div>

        <div class="prestige-upgrade-box" :class="{ 'can-prestige': canPrestige, 'cannot-prestige': !canPrestige }">
          <h4>{{ canPrestige ? '✨ Prestige available!' : '🔒 Prestige not available' }}</h4>
          
          <div class="prestige-stats">
            <p><strong>Current cookies:</strong> {{ formatNumber(stats.cookies) }}</p>
            <p><strong>Next prestige cost:</strong> {{ formatNumber(stats.coutProchainPrestige) }}</p>
            <p><strong>New multiplier:</strong> x{{ calculateNextMultiplier() }}</p>
          </div>

          <div class="prestige-actions">
            <button 
              v-if="canPrestige" 
              @click="confirmPrestige" 
              class="prestige-btn"
            >
              ⭐ Perform Prestige ⭐
            </button>
            <p v-else class="prestige-requirement">
              You still need {{ formatNumber(stats.coutProchainPrestige - stats.cookies) }} cookies
            </p>
          </div>
        </div>

        <div class="prestige-warning" v-if="canPrestige">
          ⚠️ <strong>Warning:</strong> This action will reset your progress!
        </div>
      </div>
    </div>

    <!-- Confirmation dialog for prestige -->
    <ConfirmDialog
      :show="showConfirmDialog"
      title="⭐ Prestige Confirmation ⭐"
      :message="confirmMessage"
      confirm-text="Perform Prestige"
      cancel-text="Cancel"
      @confirm="performPrestige"
      @cancel="showConfirmDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCookieStore } from '../stores/cookieStore'
import { useOptionsStore } from '../stores/optionsStore'
import { formatNumber } from '../utils/format'
import ConfirmDialog from './ConfirmDialog.vue'

// Props et emits
interface Props {
  show: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
  prestige: []
}>()

// Stores
const { getters, actions } = useCookieStore()
const { getters: optionsGetters, actions: optionsActions } = useOptionsStore()

// Reactive state
const showConfirmDialog = ref(false)

// Computed
const stats = computed(() => getters.statistiques.value)
const canPrestige = computed(() => getters.peutEffectuerPrestige.value)

const confirmMessage = computed(() => {
  return `Are you sure you want to perform prestige?\n\nThis will:\n• Reset your ${formatNumber(stats.value.cookies)} cookies\n• Remove all your upgrades\n• Give you a x${calculateNextMultiplier()} multiplier\n\nThis action is irreversible!`
})

// Méthodes
const confirmPrestige = () => {
  // Vérifier si l'option de confirmation est activée
  if (optionsGetters.confirmPrestige.value) {
    showConfirmDialog.value = true
  } else {
    performPrestige()
  }
}

const performPrestige = () => {
  showConfirmDialog.value = false
  
  // Jouer un son si activé
  if (optionsGetters.soundEnabled.value) {
    optionsActions.playSound('achievement')
  }

  const result = actions.effectuerPrestige()
  if (result) {
    // Fermer le dialog et émettre l'événement
    emit('prestige')
    emit('close')
  }
}

// Calculer le prochain multiplicateur selon les nouvelles règles
const calculateNextMultiplier = () => {
  const niveauActuel = stats.value.niveauPrestige
  const prochainNiveau = niveauActuel + 1
  
  if (prochainNiveau === 1) {
    return 2 // x2
  } else if (prochainNiveau === 2) {
    return 4 // x4  
  } else if (prochainNiveau >= 3) {
    return Math.pow(2, prochainNiveau + 1) // x8, x16, x32, etc.
  }
  return 1
}
</script>

<style scoped>
.prestige-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.prestige-dialog {
  background: linear-gradient(135deg, #2c1810, #1a0f08);
  border: 3px solid #ffd700;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.5),
    inset 0 0 20px rgba(255, 215, 0, 0.1);
}

.prestige-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #ffd700;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05));
}

.prestige-header h2 {
  margin: 0;
  color: #ffd700;
  font-size: 1.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.close-btn {
  background: none;
  border: none;
  color: #ffd700;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.1);
}

.prestige-content {
  padding: 20px;
  color: #fff;
}

.prestige-info {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.prestige-info h3 {
  margin: 0 0 10px 0;
  color: #ffd700;
  font-size: 1.4rem;
}

.current-multiplier {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffeb3b;
}

.prestige-explanation {
  margin-bottom: 20px;
}

.prestige-explanation h4 {
  color: #ffd700;
  margin-bottom: 10px;
}

.prestige-explanation ul {
  list-style: none;
  padding: 0;
}

.prestige-explanation li {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.prestige-explanation li::before {
  content: "▶";
  position: absolute;
  left: 0;
  color: #ffd700;
}

.prestige-upgrade-box {
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.can-prestige {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.05));
  border-color: #4caf50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.cannot-prestige {
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.2), rgba(158, 158, 158, 0.05));
  border-color: #9e9e9e;
}

.prestige-upgrade-box h4 {
  margin: 0 0 15px 0;
  text-align: center;
  font-size: 1.3rem;
}

.can-prestige h4 {
  color: #4caf50;
}

.cannot-prestige h4 {
  color: #9e9e9e;
}

.prestige-stats {
  margin-bottom: 20px;
}

.prestige-stats p {
  margin: 8px 0;
  font-size: 1.1rem;
}

.prestige-actions {
  text-align: center;
}

.prestige-btn {
  background: linear-gradient(135deg, #ffd700, #ffb300);
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  color: #1a0f08;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.prestige-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
  background: linear-gradient(135deg, #ffeb3b, #ffc107);
}

.prestige-requirement {
  color: #ff9800;
  font-weight: bold;
  margin: 0;
  font-size: 1.1rem;
}

.prestige-warning {
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid #ff9800;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  color: #ff9800;
  font-size: 1.1rem;
}

.prestige-footer {
  padding: 15px 20px;
  border-top: 2px solid #ffd700;
  text-align: center;
}

.cancel-btn {
  background: rgba(158, 158, 158, 0.2);
  border: 2px solid #9e9e9e;
  color: #fff;
  padding: 10px 25px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(158, 158, 158, 0.3);
  transform: scale(1.05);
}

/* Responsive Design pour PrestigeDialog */
/* Tablettes */
@media (max-width: 1024px) {
  .prestige-dialog {
    max-width: 500px;
    width: 95%;
  }
  
  .prestige-header h2 {
    font-size: 1.5rem;
  }
  
  .close-btn {
    font-size: 1.8rem;
    width: 35px;
    height: 35px;
  }
  
  .prestige-content {
    padding: 15px;
  }
  
  .prestige-btn {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
}

/* Smartphones */
@media (max-width: 768px) {
  .prestige-dialog {
    max-width: none;
    width: 95%;
    margin: 10px;
    max-height: 95vh;
  }
  
  .prestige-header {
    padding: 15px;
    flex-direction: column;
    gap: 10px;
  }
  
  .prestige-header h2 {
    font-size: 1.3rem;
    text-align: center;
  }
  
  .close-btn {
    font-size: 1.5rem;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  
  .prestige-content {
    padding: 10px;
  }
  
  .prestige-info h3 {
    font-size: 1.1rem;
  }
  
  .current-multiplier {
    font-size: 0.9rem;
  }
  
  .prestige-explanation h4 {
    font-size: 1rem;
  }
  
  .prestige-explanation ul {
    font-size: 0.9rem;
  }
  
  .prestige-upgrade-box h4 {
    font-size: 1rem;
  }
  
  .prestige-stats p {
    font-size: 0.9rem;
  }
  
  .prestige-btn {
    padding: 10px 20px;
    font-size: 1rem;
  }
  
  .prestige-requirement {
    font-size: 0.9rem;
  }
  
  .prestige-warning {
    padding: 10px;
    font-size: 0.9rem;
  }
}

/* Petits smartphones */
@media (max-width: 480px) {
  .prestige-dialog {
    width: 98%;
    margin: 5px;
  }
  
  .prestige-header {
    padding: 10px;
  }
  
  .prestige-header h2 {
    font-size: 1.1rem;
  }
  
  .close-btn {
    font-size: 1.3rem;
    width: 25px;
    height: 25px;
    top: 8px;
    right: 8px;
  }
  
  .prestige-content {
    padding: 8px;
  }
  
  .prestige-info h3 {
    font-size: 1rem;
  }
  
  .current-multiplier {
    font-size: 0.8rem;
  }
  
  .prestige-explanation h4 {
    font-size: 0.9rem;
  }
  
  .prestige-explanation ul {
    font-size: 0.8rem;
  }
  
  .prestige-upgrade-box {
    padding: 8px;
  }
  
  .prestige-upgrade-box h4 {
    font-size: 0.9rem;
  }
  
  .prestige-stats p {
    font-size: 0.8rem;
  }
  
  .prestige-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .prestige-requirement {
    font-size: 0.8rem;
  }
  
  .prestige-warning {
    padding: 8px;
    font-size: 0.8rem;
  }
  
  .cancel-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>
