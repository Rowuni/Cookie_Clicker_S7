<template>
  <div class="admin-interface">
    <div class="admin-header">
      <h1>🔧 Admin Interface</h1>
      <div class="admin-info">
        <span>Connected as: <strong>{{ currentUser?.username }}</strong></span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>

    <div class="admin-content">
      <!-- Section User Management -->
      <div class="admin-section">
        <h2>👥 User Management</h2>
        <div class="users-grid">
          <div 
            v-for="user in allUsers.filter(u => u.role !== 'admin')" 
            :key="user.id"
            class="user-card"
          >
            <div class="user-header">
              <h3>{{ user.username }}</h3>
              <span class="user-role">{{ user.role }}</span>
            </div>
            
            <div class="user-stats">
              <div class="stat">
                <label>Cookies:</label>
                <input 
                  type="number" 
                  v-model.number="user.cookies" 
                  @change="updateUser(user.id, { cookies: user.cookies })"
                />
              </div>
              
              <div class="stat">
                <label>Total Cookies:</label>
                <input 
                  type="number" 
                  v-model.number="user.cookiesTotaux" 
                  @change="updateUser(user.id, { cookiesTotaux: user.cookiesTotaux })"
                />
              </div>
              
              <div class="stat">
                <label>Number of clicks:</label>
                <input 
                  type="number" 
                  v-model.number="user.nombreClics" 
                  @change="updateUser(user.id, { nombreClics: user.nombreClics })"
                />
              </div>
              
              <div class="stat">
                <label>Play Time (sec):</label>
                <input 
                  type="number" 
                  v-model.number="user.tempsDeJeu" 
                  @change="updateUser(user.id, { tempsDeJeu: user.tempsDeJeu })"
                />
              </div>
              
              <div class="stat">
                <label>Highest Number:</label>
                <input 
                  type="number" 
                  v-model.number="user.plusGrandNombreCookies" 
                  @change="updateUser(user.id, { plusGrandNombreCookies: user.plusGrandNombreCookies })"
                />
              </div>
            </div>
            
            <div class="user-actions">
              <button @click="resetUser(user.id)" class="reset-btn">
                🔄 Reset
              </button>
              <button @click="deleteUser(user.id)" class="delete-btn">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Global Statistics -->
      <div class="admin-section">
        <h2>📊 Global Statistics</h2>
        <div class="global-stats">
          <div class="stat-card">
            <h3>{{ totalPlayers }}</h3>
            <span>Total Players</span>
          </div>
          <div class="stat-card">
            <h3>{{ formatNumber(totalCookies) }}</h3>
            <span>Cookies Generated</span>
          </div>
          <div class="stat-card">
            <h3>{{ formatNumber(totalClicks) }}</h3>
            <span>Total Clicks</span>
          </div>
          <div class="stat-card">
            <h3>{{ formatTime(averagePlayTime) }}</h3>
            <span>Average Time</span>
          </div>
        </div>
      </div>

      <!-- Section Classement -->
      <div class="admin-section">
        <h2>🏆 Ranking of players</h2>
        <div class="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Total Cookies</th>
                <th>Cookies/min</th>
                <th>Play Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in leaderboard" :key="player.username">
                <td>
                  <span class="position-badge">#{{ player.position }}</span>
                  <span v-if="player.position === 1">👑</span>
                </td>
                <td class="player-name">{{ player.username }}</td>
                <td>{{ formatNumber(player.cookiesTotaux) }}</td>
                <td>{{ player.cookiesParMinute.toFixed(1) }}</td>
                <td>{{ formatTime(getPlayerPlayTime(player.username)) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Section de Réinitialisation Globale -->
    <div class="admin-section danger-section">
      <h2>⚠️ Danger Zone</h2>
      <div class="danger-content">
        <div class="danger-warning">
          <p>⚠️ <strong>WARNING:</strong> This action will permanently delete all player accounts and their progress.</p>
          <p>This action is <strong>irreversible</strong>!</p>
        </div>
        
        <button @click="resetAllUsers" class="reset-all-btn">
          🗑️ Reset All Game Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { formatNumber, formatTime } from '../utils/format'

const { getters, actions, mutations } = useAuthStore()

const currentUser = getters.currentUser
const allUsers = getters.allUsers
const leaderboard = getters.leaderboard

// Statistiques calculées
const totalPlayers = computed(() => allUsers.value.filter(u => u.role !== 'admin').length)
const totalCookies = computed(() => allUsers.value.reduce((sum, user) => sum + user.cookiesTotaux, 0))
const totalClicks = computed(() => allUsers.value.reduce((sum, user) => sum + user.nombreClics, 0))
const averagePlayTime = computed(() => {
  const players = allUsers.value.filter(u => u.role !== 'admin')
  if (players.length === 0) return 0
  return players.reduce((sum, user) => sum + user.tempsDeJeu, 0) / players.length
})

// Actions
const updateUser = (userId: string, updates: any) => {
  mutations.adminUpdateUser(userId, updates)
}

const resetUser = (userId: string) => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser cet utilisateur ?')) {
    mutations.adminResetUser(userId)
  }
}

const deleteUser = (userId: string) => {
  const user = allUsers.value.find(u => u.id === userId)
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user?.username}" ? Cette action est irréversible.`)) {
    mutations.adminDeleteUser(userId)
  }
}

const logout = () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    actions.logout()
  }
}

const resetAllUsers = () => {
  if (confirm('⚠️ WARNING! This action will permanently delete all player accounts and their progress.\n\nAre you absolutely sure you want to continue?')) {
    if (confirm('This action is IRREVERSIBLE! Do you really confirm the complete reset?')) {
      mutations.adminResetAllUsers()
      alert('✅ Complete reset performed! All player accounts have been deleted.')
    }
  }
}

const getPlayerPlayTime = (username: string) => {
  const user = allUsers.value.find(u => u.username === username)
  return user ? user.tempsDeJeu : 0
}
</script>

<style scoped>
.admin-interface {
  min-height: 100vh;
  background: 
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.admin-header {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.admin-header h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 1.1rem;
}

.logout-btn {
  background: linear-gradient(145deg, #FF6B6B, #EE5A52);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: linear-gradient(145deg, #EE5A52, #E74C3C);
  transform: translateY(-2px);
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.admin-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.admin-section h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.user-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-header h3 {
  font-size: 1.3rem;
  margin: 0;
}

.user-role {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.user-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.stat input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.stat input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
}

.user-actions {
  display: flex;
  gap: 10px;
}

.reset-btn, .delete-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reset-btn {
  background: linear-gradient(145deg, #FFA726, #FF9800);
  color: white;
}

.reset-btn:hover {
  background: linear-gradient(145deg, #FF9800, #F57C00);
}

.delete-btn {
  background: linear-gradient(145deg, #FF5252, #F44336);
  color: white;
}

.delete-btn:hover {
  background: linear-gradient(145deg, #F44336, #D32F2F);
}

.global-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 10px 0;
  color: #FFD700;
}

.stat-card span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.leaderboard-table {
  overflow-x: auto;
}

.leaderboard-table table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.leaderboard-table th {
  background: rgba(0, 0, 0, 0.3);
  font-weight: bold;
  color: #FFD700;
}

.position-badge {
  font-weight: bold;
  color: #FFD700;
}

.player-name {
  font-weight: bold;
}

.danger-section {
  border: 2px solid #FF4444 !important;
  background: rgba(255, 68, 68, 0.1) !important;
}

.danger-section h2 {
  color: #FF6B6B;
  border-bottom-color: rgba(255, 107, 107, 0.5);
}

.danger-content {
  text-align: center;
}

.danger-warning {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.danger-warning p {
  margin: 8px 0;
  color: #FFB3B3;
}

.danger-warning strong {
  color: #FF6B6B;
}

.reset-all-btn {
  background: linear-gradient(145deg, #FF4444, #CC0000);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(255, 0, 0, 0.3);
}

.reset-all-btn:hover {
  background: linear-gradient(145deg, #CC0000, #990000);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .admin-header h1 {
    font-size: 2rem;
  }
  
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .user-stats {
    grid-template-columns: 1fr;
  }
  
  .global-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
