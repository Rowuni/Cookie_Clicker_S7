<template>
  <div class="login-overlay">
    <div class="login-container">
      <h1>🍪 Cookie Clicker 🍪</h1>
      <p class="welcome-text">Welcome! Enter your username to start.</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <input 
          v-model="username" 
          type="text" 
          placeholder="Username"
          class="username-input"
          required
          maxlength="20"
        />
        
        <button type="submit" class="login-button" :disabled="!username.trim()">
          Start Playing
        </button>
      </form>
      
      <div class="debug-section">
        <button @click="createDebugAdmin" class="debug-button">
          Create Admin Account (Debug)
        </button>
      </div>
      
      <div class="info-text">
        <p>If the name already exists, you will log into that account.</p>
        <p>Otherwise, a new account will be created automatically.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const { actions } = useAuthStore()
const username = ref('')

const handleLogin = async () => {
  if (!username.value.trim()) return
  
  try {
    const result = await actions.loginOrRegister(username.value.trim())
    if (result.success) {
      console.log(result.isNew ? 'New account created' : 'Login successful', result.user)
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

const createDebugAdmin = async () => {
  const adminName = `admin_${Date.now()}`
  actions.createAdmin(adminName)
  console.log('Admin created:', adminName)
}
</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 234, 167, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(250, 177, 160, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(255, 193, 7, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #FFEAA7 0%, #FAB1A0 50%, #E17055 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-container {
  background: 
    linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 220, 0.9));
  padding: 40px;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  text-align: center;
  min-width: 400px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(139, 69, 19, 0.3);
}

.login-container h1 {
  font-size: 3rem;
  color: #8B4513;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Arial Black', Arial, sans-serif;
}

.welcome-text {
  font-size: 1.2rem;
  color: #D2691E;
  margin-bottom: 30px;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.username-input {
  padding: 15px 20px;
  font-size: 1.1rem;
  border: 2px solid #D2691E;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #8B4513;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.username-input:focus {
  outline: none;
  border-color: #8B4513;
  box-shadow: 0 0 10px rgba(139, 69, 19, 0.3);
  transform: scale(1.02);
}

.username-input::placeholder {
  color: rgba(139, 69, 19, 0.6);
}

.login-button {
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(145deg, #FF6B35, #D2691E);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(145deg, #E55D31, #B8541A);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 107, 53, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.debug-section {
  border-top: 1px solid rgba(139, 69, 19, 0.3);
  padding-top: 20px;
  margin-bottom: 20px;
}

.debug-button {
  padding: 8px 16px;
  font-size: 0.9rem;
  background: linear-gradient(145deg, #8B4513, #654321);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.debug-button:hover {
  background: linear-gradient(145deg, #654321, #4A2C17);
  transform: translateY(-1px);
}

.info-text {
  font-size: 0.9rem;
  color: rgba(139, 69, 19, 0.8);
  line-height: 1.4;
}

.info-text p {
  margin: 5px 0;
}

/* Animation d'apparition */
.login-container {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
