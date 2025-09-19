<template>
  <div class="left-menu" ref="menuRef">
    <div class="user-section">
      <div class="user-info">
        <h2>👤 {{ currentUser?.username }}</h2>
        <button @click="requestLogout" class="logout-btn">Logout</button>
      </div>
    </div>
    
    <div class="menu-sections">
      <div class="menu-section" :class="{ active: activeSection === 'stats' }">
        <h3 @click="setActiveSection('stats')" class="section-header">
          <span>Statistics</span>
          <span class="arrow" :class="{ expanded: activeSection === 'stats' }">▼</span>
        </h3>
        <div class="section-content" v-show="activeSection === 'stats'">
          <GameStatistiques />
        </div>
      </div>
      
      <div class="menu-section" :class="{ active: activeSection === 'leaderboard' }">
        <h3 @click="setActiveSection('leaderboard')" class="section-header">
          <span>Leaderboard</span>
          <span class="arrow" :class="{ expanded: activeSection === 'leaderboard' }">▼</span>
        </h3>
        <div class="section-content" v-show="activeSection === 'leaderboard'">
          <Leaderboard />
        </div>
      </div>
      
      <div class="menu-section" :class="{ active: activeSection === 'admin' }" v-if="isAdmin">
        <h3 @click="setActiveSection('admin')" class="section-header">
          <span>Administration</span>
          <span class="arrow" :class="{ expanded: activeSection === 'admin' }">▼</span>
        </h3>
        <div class="section-content" v-show="activeSection === 'admin'">
          <AdminPanel />
        </div>
      </div>
      
      <!-- Section Succès -->
      <div class="menu-section" :class="{ active: activeSection === 'achievements' }">
        <h3 @click="setActiveSection('achievements')" class="section-header">
          <span>Achievements</span>
          <span class="arrow" :class="{ expanded: activeSection === 'achievements' }">▼</span>
        </h3>
        <div class="section-content" v-show="activeSection === 'achievements'">
          <AchievementsPanel />
        </div>
      </div>
      
      <!-- Section Options -->
      <div class="menu-section" :class="{ active: activeSection === 'options' }">
        <h3 @click="setActiveSection('options')" class="section-header">
          <span>Settings</span>
          <span class="arrow" :class="{ expanded: activeSection === 'options' }">▼</span>
        </h3>
        <div class="section-content" v-show="activeSection === 'options'">
          <OptionsPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import GameStatistiques from './GameStatistiques.vue'
import Leaderboard from './Leaderboard.vue'
import AdminPanel from './AdminPanel.vue'
import AchievementsPanel from './AchievementsPanel.vue'
import OptionsPanel from './OptionsPanel.vue'

interface Emits {
  (e: 'logout-request'): void
}

const emit = defineEmits<Emits>()

const { getters } = useAuthStore()
const activeSection = ref('stats')
const menuRef = ref<HTMLElement>()

const currentUser = getters.currentUser
const isAdmin = getters.isAdmin

const setActiveSection = (section: string) => {
  // Permettre de fermer une section même si c'est la seule ouverte
  if (activeSection.value === section) {
    activeSection.value = ''
  } else {
    activeSection.value = section
  }
}

const requestLogout = () => {
  emit('logout-request')
}
</script>

<style scoped>
.left-menu {
  background: rgba(139, 69, 19, 0.92);
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
}

.left-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px),
    radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    radial-gradient(circle at 75% 85%, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 60px 60px, 80px 80px, 70px 70px, 90px 90px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.left-menu > * {
  position: relative;
  z-index: 1;
}

.user-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.user-info h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: white;
}

.logout-btn {
  background: linear-gradient(145deg, #FF6B6B, #EE5A52);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 8px;
}

.logout-btn:hover {
  background: linear-gradient(145deg, #EE5A52, #E74C3C);
  transform: translateY(-1px);
}

.left-menu h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
}

.menu-sections {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-section h3 {
  margin: 0;
  padding: 12px 15px;
  font-size: 1.1rem;
  color: #FFE4B5;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.arrow {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.3s ease;
  transform: rotate(-90deg);
}

.arrow.expanded {
  transform: rotate(0deg);
}

.menu-section h3:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-section.active {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-section.active h3 {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-section.disabled {
  opacity: 0.6;
}

.menu-section.disabled h3 {
  cursor: not-allowed;
}

.section-content {
  padding: 0 15px 15px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-content {
  background: none;
}

.coming-soon {
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  padding: 10px 0;
}

/* Scrollbar personnalisee */
.left-menu::-webkit-scrollbar {
  width: 8px;
}

.left-menu::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.left-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.left-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive Design pour LeftMenu */
/* Tablettes */
@media (max-width: 1024px) {
  .left-menu {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .menu-header h2 {
    font-size: 1.3rem;
  }
  
  .menu-section h3 {
    font-size: 1rem;
    padding: 10px 12px;
  }
  
  .section-content {
    padding: 0 10px 10px;
  }
}

/* Smartphones */
@media (max-width: 768px) {
  .left-menu {
    border-radius: 12px;
    padding: 10px;
    max-height: 300px;
  }
  
  .menu-header {
    margin-bottom: 10px;
  }
  
  .menu-header h2 {
    font-size: 1.1rem;
  }
  
  .logout-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .menu-section {
    margin-bottom: 6px;
  }
  
  .menu-section h3 {
    font-size: 0.9rem;
    padding: 8px 10px;
  }
  
  .section-content {
    padding: 0 8px 8px;
  }
  
  .arrow {
    font-size: 0.7rem;
  }
}

/* Petits smartphones */
@media (max-width: 480px) {
  .left-menu {
    padding: 8px;
    max-height: 250px;
  }
  
  .menu-header h2 {
    font-size: 1rem;
  }
  
  .logout-btn {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
  
  .menu-section h3 {
    font-size: 0.85rem;
    padding: 6px 8px;
  }
  
  .section-content {
    padding: 0 6px 6px;
  }
}
</style>
