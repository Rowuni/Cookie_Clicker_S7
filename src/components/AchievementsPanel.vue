<template>
  <div class="achievements-panel">
    <div class="achievements-header">
      <h3>🏆 Achievements</h3>
      <div class="progress-summary">
        {{ getters.achievementStats.value.unlocked }} / {{ getters.achievementStats.value.total }} 
        ({{ getters.achievementStats.value.progress }}%)
      </div>
    </div>

    <div class="achievements-categories">
      <div 
        v-for="(categoryAchievements, category) in getters.achievementsByCategory.value" 
        :key="category"
        class="achievement-category"
      >
        <h4 class="category-title">{{ getCategoryName(category) }}</h4>
        <div class="achievements-grid">
          <div 
            v-for="achievement in categoryAchievements" 
            :key="achievement.id"
            class="achievement-item"
            :class="{ 
              'unlocked': (achievement as any).unlocked,
              'locked': !(achievement as any).unlocked
            }"
          >
            <div class="achievement-icon">{{ achievement.icone }}</div>
            <div class="achievement-info">
              <div class="achievement-name">{{ achievement.nom }}</div>
              <div class="achievement-description">{{ achievement.description }}</div>
            </div>
            <div class="achievement-status">
              <span v-if="(achievement as any).unlocked" class="status-unlocked">✓</span>
              <span v-else class="status-locked">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification pour nouveaux succès -->
    <div 
      v-if="getters.newAchievements.value.length > 0"
      class="new-achievements-notification"
    >
      <div class="notification-header">
        🎉 New achievements unlocked!
      </div>
      <div class="new-achievements-list">
        <div 
          v-for="achievement in getters.newAchievements.value" 
          :key="achievement.id"
          class="new-achievement"
        >
          {{ achievement.icone }} {{ achievement.nom }}
        </div>
      </div>
      <button @click="clearNotifications" class="clear-btn">OK</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAchievementsStore } from '../stores/achievementsStore'

const { getters, mutations } = useAchievementsStore()

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    'amelioration': '🛍️ Upgrades',
    'cookies': '🍪 Production',
    'clics': '👆 Clicks',
    'classement': '🏆 Ranking',
    'prestige': '⭐ Prestige',
    'temps': '⏰ Playtime'
  }
  return names[category] || category
}

const clearNotifications = () => {
  mutations.clearNewAchievements()
}
</script>

<style scoped>
.achievements-panel {
  padding: 15px;
  background: linear-gradient(145deg, #2c1810, #3d2317);
  border-radius: 10px;
  color: #f4e6d3;
  max-height: 70vh;
  overflow-y: auto;
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #8B4513;
}

.achievements-header h3 {
  margin: 0;
  font-size: 1.4em;
  color: #DAA520;
}

.progress-summary {
  background: #4a2d1a;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  border: 1px solid #8B4513;
}

.achievement-category {
  margin-bottom: 25px;
}

.category-title {
  color: #DAA520;
  font-size: 1.1em;
  margin-bottom: 10px;
  padding-left: 5px;
  border-left: 3px solid #8B4513;
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #3d2317;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  background: linear-gradient(145deg, #2d4a2d, #3d5a3d);
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.achievement-item.locked {
  background: #2c1810;
  border-color: #666;
  opacity: 0.7;
}

.achievement-icon {
  font-size: 2em;
  margin-right: 15px;
  min-width: 50px;
  text-align: center;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 4px;
  color: #f4e6d3;
}

.achievement-item.unlocked .achievement-name {
  color: #90EE90;
}

.achievement-description {
  font-size: 0.9em;
  color: #ccc;
  opacity: 0.9;
}

.achievement-status {
  margin-left: 10px;
  font-size: 1.2em;
}

.status-unlocked {
  color: #4CAF50;
}

.status-locked {
  color: #666;
}

/* Notification pour nouveaux succès */
.new-achievements-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(145deg, #4a2d1a, #5a3d2a);
  border: 3px solid #DAA520;
  border-radius: 15px;
  padding: 20px;
  min-width: 300px;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.notification-header {
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  color: #DAA520;
  margin-bottom: 15px;
}

.new-achievements-list {
  margin-bottom: 15px;
}

.new-achievement {
  padding: 8px;
  background: #3d2317;
  margin-bottom: 5px;
  border-radius: 5px;
  text-align: center;
  border: 1px solid #8B4513;
}

.clear-btn {
  width: 100%;
  padding: 10px;
  background: #DAA520;
  color: #2c1810;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-btn:hover {
  background: #B8860B;
}

/* Scrollbar personnalisée */
.achievements-panel::-webkit-scrollbar {
  width: 8px;
}

.achievements-panel::-webkit-scrollbar-track {
  background: #2c1810;
  border-radius: 4px;
}

.achievements-panel::-webkit-scrollbar-thumb {
  background: #8B4513;
  border-radius: 4px;
}

.achievements-panel::-webkit-scrollbar-thumb:hover {
  background: #A0522D;
}
</style>
