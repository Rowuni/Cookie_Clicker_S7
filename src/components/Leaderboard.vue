<template>
  <div class="leaderboard">
    <h3>🏆 Leaderboard</h3>
    
    <!-- Message spécial pour les admins -->
    <div class="admin-notice" v-if="isAdmin">
      <div class="admin-message">
        ℹ️ As an administrator, you do not appear in the leaderboard.
      </div>
    </div>
    
    <!-- Position du joueur actuel (seulement pour les joueurs) -->
    <div class="current-user-position" v-if="currentUserStats && !isAdmin">
      <div class="position-badge">
        Your position: #{{ currentUserStats.position }}
      </div>
      <div class="cookies-per-minute">
        {{ currentUserStats.cookiesParMinute.toFixed(1) }} cookies/min
      </div>
    </div>
    
    <div class="leaderboard-list">
      <div 
        v-for="player in leaderboard" 
        :key="player.username"
        class="player-entry"
        :class="{ 'current-user': player.isCurrentUser }"
      >
        <div class="position">
          <span class="position-number">#{{ player.position }}</span>
          <span v-if="player.position === 1" class="crown">👑</span>
          <span v-else-if="player.position === 2" class="medal">🥈</span>
          <span v-else-if="player.position === 3" class="medal">🥉</span>
        </div>
        
        <div class="player-info">
          <div class="player-name">{{ player.username }}</div>
          <div class="player-stats">
            {{ formatNumber(player.cookiesTotaux) }} cookies
          </div>
          <div class="player-rate">
            {{ player.cookiesParMinute.toFixed(1) }}/min
          </div>
        </div>
        
        <div v-if="player.isCurrentUser" class="current-indicator">
          You
        </div>
      </div>
    </div>
    
    <div class="refresh-info">
      The ranking is updated automatically.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import { formatNumber } from '../utils/format'

const { getters } = useAuthStore()

const leaderboard = getters.leaderboard
const currentUserStats = getters.currentUserStats
const isAdmin = getters.isAdmin
</script>

<style scoped>
.leaderboard {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
  color: white;
}

.leaderboard h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-align: center;
  color: #FFE4B5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 8px;
}

.admin-notice {
  background: linear-gradient(145deg, rgba(54, 162, 235, 0.2), rgba(33, 150, 243, 0.1));
  border: 1px solid rgba(33, 150, 243, 0.3);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}

.admin-message {
  color: #87CEEB;
  font-style: italic;
  text-align: center;
  font-size: 0.95rem;
}

.current-user-position {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  text-align: center;
}

.position-badge {
  font-weight: bold;
  font-size: 1.1rem;
  color: #FFD700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.cookies-per-minute {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 3px;
}

.leaderboard-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.player-entry {
  display: flex;
  align-items: center;
  padding: 8px;
  margin: 5px 0;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.player-entry:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateX(3px);
}

.player-entry.current-user {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.1));
  border-color: rgba(255, 215, 0, 0.4);
}

.position {
  display: flex;
  align-items: center;
  min-width: 60px;
  font-weight: bold;
}

.position-number {
  font-size: 1.1rem;
  color: #FFE4B5;
}

.crown, .medal {
  margin-left: 5px;
  font-size: 1.2rem;
}

.player-info {
  flex: 1;
  padding-left: 10px;
}

.player-name {
  font-weight: bold;
  font-size: 1rem;
  color: #FFE4B5;
  margin-bottom: 2px;
}

.player-stats {
  font-size: 0.9rem;
  color: #90EE90;
  font-weight: 600;
}

.player-rate {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.current-indicator {
  background: #FFD700;
  color: #8B4513;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.refresh-info {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-style: italic;
  margin-top: 10px;
}

/* Scrollbar personnalisee */
.leaderboard-list::-webkit-scrollbar {
  width: 6px;
}

.leaderboard-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.leaderboard-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.leaderboard-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
