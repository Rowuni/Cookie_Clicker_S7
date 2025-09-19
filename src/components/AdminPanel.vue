<template>
  <div class="admin-panel">
    <h3>⚙️ Administration</h3>
    
    <div class="admin-actions">
      <button @click="showUserManagement = !showUserManagement" class="toggle-button">
        {{ showUserManagement ? 'Hide' : 'Manage' }} Users
      </button>
      
      <button @click="logout" class="logout-button">
        Log Out
      </button>
    </div>
    
    <div v-if="showUserManagement" class="user-management">
      <h4>User Management</h4>
      
      <div class="users-list">
        <div 
          v-for="user in allUsers" 
          :key="user.id"
          class="user-card"
          :class="{ 'current-admin': user.id === currentUser?.id }"
        >
          <div class="user-header">
            <span class="username">{{ user.username }}</span>
            <span class="role-badge" :class="user.role">{{ user.role }}</span>
          </div>
          
          <div class="user-stats">
            <div class="stat-row">
              <span>Cookies:</span>
              <input 
                v-model.number="user.cookies" 
                type="number" 
                @change="updateUser(user.id)"
                :disabled="user.id === currentUser?.id"
                class="stat-input"
              />
            </div>
            
            <div class="stat-row">
              <span>Total produced:</span>
              <input 
                v-model.number="user.cookiesTotaux" 
                type="number" 
                @change="updateUser(user.id)"
                :disabled="user.id === currentUser?.id"
                class="stat-input"
              />
            </div>
            
            <div class="stat-info">
              <span>Clicks: {{ user.nombreClics }}</span>
              <span>Time: {{ formatTemps(user.tempsDeJeu) }}</span>
            </div>
          </div>
          
          <div class="user-actions" v-if="user.id !== currentUser?.id">
            <button @click="resetUser(user.id)" class="reset-button">
              Reset
            </button>
            <button @click="deleteUser(user.id)" class="delete-button">
              Delete
            </button>
          </div>
          
          <div v-else class="current-admin-notice">
            (You - cannot be modified)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const { getters, mutations, actions } = useAuthStore()
const showUserManagement = ref(false)

const allUsers = getters.allUsers
const currentUser = getters.currentUser

const updateUser = (userId: string) => {
  const user = allUsers.value.find(u => u.id === userId)
  if (user) {
    mutations.adminUpdateUser(userId, {
      cookies: user.cookies,
      cookiesTotaux: user.cookiesTotaux
    })
  }
}

const resetUser = (userId: string) => {
  if (confirm('Are you sure you want to reset this user?')) {
    mutations.adminResetUser(userId)
  }
}

const deleteUser = (userId: string) => {
  const user = allUsers.value.find(u => u.id === userId)
  if (user && confirm(`Are you sure you want to delete user "${user.username}"?`)) {
    mutations.adminDeleteUser(userId)
  }
}

const logout = () => {
  if (confirm('Are you sure you want to log out?')) {
    actions.logout()
  }
}

// Fonction pour formater le temps
const formatTemps = (secondes: number): string => {
  const heures = Math.floor(secondes / 3600)
  const minutes = Math.floor((secondes % 3600) / 60)
  const secs = secondes % 60
  
  if (heures > 0) {
    return `${heures}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}
</script>

<style scoped>
.admin-panel {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
  color: white;
}

.admin-panel h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-align: center;
  color: #FF6B6B;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 107, 107, 0.3);
  padding-bottom: 8px;
}

.admin-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.toggle-button, .logout-button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.toggle-button {
  background: linear-gradient(145deg, #4ECDC4, #44A08D);
  color: white;
}

.toggle-button:hover {
  background: linear-gradient(145deg, #44A08D, #3D8B85);
  transform: translateY(-2px);
}

.logout-button {
  background: linear-gradient(145deg, #FF6B6B, #EE5A52);
  color: white;
}

.logout-button:hover {
  background: linear-gradient(145deg, #EE5A52, #E74C3C);
  transform: translateY(-2px);
}

.user-management {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 15px;
}

.user-management h4 {
  color: #FFE4B5;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.users-list {
  max-height: 400px;
  overflow-y: auto;
}

.user-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.user-card.current-admin {
  border-color: rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.1);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
  font-size: 1.1rem;
  color: #FFE4B5;
}

.role-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #FF6B6B;
  color: white;
}

.role-badge.joueur {
  background: #4ECDC4;
  color: white;
}

.user-stats {
  margin-bottom: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.stat-row span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.stat-input {
  width: 120px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 0.9rem;
}

.stat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
}

.user-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.reset-button, .delete-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button {
  background: #FFA726;
  color: white;
}

.reset-button:hover {
  background: #FF9800;
}

.delete-button {
  background: #EF5350;
  color: white;
}

.delete-button:hover {
  background: #F44336;
}

.current-admin-notice {
  text-align: center;
  font-style: italic;
  color: rgba(255, 215, 0, 0.8);
  font-size: 0.9rem;
}

/* Scrollbar personnalisee */
.users-list::-webkit-scrollbar {
  width: 6px;
}

.users-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.users-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
