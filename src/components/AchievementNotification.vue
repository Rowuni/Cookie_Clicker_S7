<template>
  <div 
    v-if="visible && achievement" 
    class="achievement-notification"
    :class="{ 'slide-in': visible, 'slide-out': !visible }"
  >
    <div class="notification-content">
      <div class="achievement-icon">{{ achievement.icone }}</div>
      <div class="achievement-text">
        <div class="notification-title">🏆 Succès débloqué !</div>
        <div class="achievement-name">{{ achievement.nom }}</div>
        <div class="achievement-description">{{ achievement.description }}</div>
      </div>
      <button @click="dismiss" class="close-btn">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOptionsStore } from '../stores/optionsStore'

interface Achievement {
  id: string
  nom: string
  description: string
  icone: string
  categorie: string
}

interface Props {
  achievement: Achievement | null
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  dismiss: []
}>()

const { getters: optionsGetters } = useOptionsStore()
const visible = ref(false)

// Watcher pour gérer l'animation
watch(() => props.show, (newShow) => {
  if (newShow && props.achievement) {
    // Vérifier si les notifications de succès sont activées
    if (!optionsGetters.achievementNotifications.value) {
      // Si désactivées, émettre immédiatement dismiss sans afficher
      emit('dismiss')
      return
    }
    
    visible.value = true
    
    // Auto-dismiss selon la durée configurée
    const duration = optionsGetters.notificationDuration.value * 1000
    setTimeout(() => {
      dismiss()
    }, duration)
  }
})

const dismiss = () => {
  visible.value = false
  // Attendre la fin de l'animation avant d'émettre l'événement
  setTimeout(() => {
    emit('dismiss')
  }, 300)
}
</script>

<style scoped>
.achievement-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  max-width: 400px;
  width: 90%;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.slide-in {
  animation-name: slideInFromTop;
}

.slide-out {
  animation-name: slideOutToTop;
}

@keyframes slideInFromTop {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes slideOutToTop {
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
}

.notification-content {
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #4a2d1a, #5a3d2a);
  border: 3px solid #DAA520;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  color: #f4e6d3;
  position: relative;
}

.achievement-icon {
  font-size: 3em;
  margin-right: 15px;
  min-width: 60px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.achievement-text {
  flex: 1;
}

.notification-title {
  font-size: 1.1em;
  font-weight: bold;
  color: #DAA520;
  margin-bottom: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.achievement-name {
  font-size: 1.3em;
  font-weight: bold;
  color: #90EE90;
  margin-bottom: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.achievement-description {
  font-size: 0.9em;
  color: #ccc;
  opacity: 0.9;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2em;
  cursor: pointer;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: scale(1.1);
}

/* Animation de pulsation pour l'icône */
.achievement-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .achievement-notification {
    top: 10px;
    width: 95%;
  }
  
  .notification-content {
    padding: 12px;
  }
  
  .achievement-icon {
    font-size: 2.5em;
    margin-right: 12px;
    min-width: 50px;
  }
  
  .achievement-name {
    font-size: 1.1em;
  }
  
  .achievement-description {
    font-size: 0.8em;
  }
}
</style>
