<template>
  <div class="options-panel">
    <div class="options-header">
      <h3>⚙️ Settings</h3>
    </div>

    <div class="options-sections">
      
      <!-- Section Audio -->
      <div class="option-section">
        <h4 class="section-title">🔊 Audio</h4>
        <div class="option-item">
          <label class="option-label">
            <input 
              type="checkbox" 
              v-model="options.soundEnabled"
              @change="updateOption('soundEnabled', options.soundEnabled)"
            >
            <span class="checkmark"></span>
            Sounds enabled
          </label>
          <span class="option-description">Enable click and achievement sounds</span>
        </div>
        
        <div class="option-item" v-if="options.soundEnabled">
          <label class="option-label">Sound volume</label>
          <div class="slider-container">
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="options.soundVolume"
              @input="updateOption('soundVolume', options.soundVolume)"
              class="volume-slider"
            >
            <span class="volume-value">{{ options.soundVolume }}%</span>
          </div>
        </div>
      </div>

      <!-- Section Affichage -->
      <div class="option-section">
        <h4 class="section-title">👁️ Display</h4>
        

        <div class="option-item">
          <label class="option-label">
            <input 
              type="checkbox" 
              v-model="options.particlesEnabled"
              @change="updateOption('particlesEnabled', options.particlesEnabled)"
            >
            <span class="checkmark"></span>
            Particles enabled
          </label>
          <span class="option-description">Show particles when clicking</span>
        </div>
      </div>

      <!-- Section Notifications -->
      <div class="option-section">
        <h4 class="section-title">🔔 Notifications</h4>
        
        <div class="option-item">
          <label class="option-label">
            <input 
              type="checkbox" 
              v-model="options.achievementNotifications"
              @change="updateOption('achievementNotifications', options.achievementNotifications)"
            >
            <span class="checkmark"></span>
            Achievement notifications
          </label>
          <span class="option-description">Show notifications when you unlock an achievement</span>
        </div>

        <div class="option-item" v-if="options.achievementNotifications">
          <label class="option-label">Display duration</label>
          <div class="slider-container">
            <input 
              type="range" 
              min="2" 
              max="10" 
              v-model="options.notificationDuration"
              @input="updateOption('notificationDuration', options.notificationDuration)"
              class="duration-slider"
            >
            <span class="duration-value">{{ options.notificationDuration }}s</span>
          </div>
        </div>
      </div>

      <!-- Section Gameplay -->
      <div class="option-section">
        <h4 class="section-title">🎮 Gameplay</h4>

        <div class="option-item">
          <label class="option-label">
            <input 
              type="checkbox" 
              v-model="options.showDetailedStats"
              @change="updateOption('showDetailedStats', options.showDetailedStats)"
            >
            <span class="checkmark"></span>
            Detailed statistics
          </label>
          <span class="option-description">Show more information in statistics</span>
        </div>

        <div class="option-item">
          <label class="option-label">
            <input 
              type="checkbox" 
              v-model="options.confirmPrestige"
              @change="updateOption('confirmPrestige', options.confirmPrestige)"
            >
            <span class="checkmark"></span>
            Confirm prestige
          </label>
          <span class="option-description">Ask for confirmation before performing prestige</span>
        </div>
      </div>

      <!-- Section Actions -->
      <div class="option-section">
        <h4 class="section-title">💾 Actions</h4>
        
        <div class="option-item">
          <button @click="exportSave" class="action-button export-btn">
            📤 Export save
          </button>
          <span class="option-description">Download your game data</span>
        </div>

        <div class="option-item">
          <button @click="importSave" class="action-button import-btn">
            📥 Import save
          </button>
          <input 
            ref="fileInput" 
            type="file" 
            accept=".json" 
            @change="handleFileImport" 
            style="display: none"
          >
          <span class="option-description">Load game data from a file</span>
        </div>

        <div class="option-item">
          <button @click="resetToDefaults" class="action-button reset-btn">
            🔄 Reset to defaults
          </button>
          <span class="option-description">Reset all options to their default values</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useOptionsStore } from '../stores/optionsStore'

const fileInput = ref<HTMLInputElement>()

const { getters: authGetters } = useAuthStore()
const { getters: optionsGetters, actions: optionsActions } = useOptionsStore()

// Utiliser les options du store
const options = optionsGetters.options

// Mettre à jour une option
const updateOption = (key: string, value: any) => {
  optionsActions.updateOption(key as any, value)
}

// Exporter la sauvegarde
const exportSave = () => {
  try {
    const currentUser = authGetters.currentUser.value
    if (!currentUser) {
      alert('No user logged in to export')
      return
    }

    const saveData = {
      user: currentUser,
      options: options.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const dataStr = JSON.stringify(saveData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `cookie-clicker-save-${currentUser.username}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Export error:', error)
    alert('Error exporting save file')
  }
}

// Importer une sauvegarde
const importSave = () => {
  fileInput.value?.click()
}

// Gérer l'import de fichier
const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const saveData = JSON.parse(e.target?.result as string)
      
      if (saveData.user && saveData.user.username) {
        const confirmed = confirm(`Do you want to import the save from "${saveData.user.username}"? This will replace your current data.`)
        
        if (confirmed) {
          // Importer les options si disponibles
          if (saveData.options) {
            // Assigner les nouvelles options
            Object.assign(options.value, saveData.options)
            optionsActions.saveOptions()
          }
          
          alert('Save imported successfully! Reconnect to see the changes.')
        }
      } else {
        alert('Invalid save file')
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Error importing file')
    }
  }
  
  reader.readAsText(file)
}

// Restaurer les options par défaut
const resetToDefaults = () => {
  const confirmed = confirm('Do you really want to reset all options to default?')
  if (confirmed) {
    optionsActions.resetToDefaults()
  }
}
</script>

<style scoped>
.options-panel {
  padding: 15px;
  background: linear-gradient(145deg, #2c1810, #3d2317);
  border-radius: 10px;
  color: #f4e6d3;
  max-height: 70vh;
  overflow-y: auto;
}

.options-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #8B4513;
}

.options-header h3 {
  margin: 0;
  font-size: 1.4em;
  color: #DAA520;
}

.option-section {
  margin-bottom: 25px;
  background: rgba(61, 35, 23, 0.5);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #8B4513;
}

.section-title {
  color: #DAA520;
  font-size: 1.1em;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #8B4513;
}

.option-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  position: relative;
}

.option-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: #3d2317;
  border: 2px solid #8B4513;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.3s ease;
}

.option-label input[type="checkbox"]:checked + .checkmark {
  background: #DAA520;
  border-color: #DAA520;
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid #2c1810;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.option-label input[type="checkbox"]:checked + .checkmark::after {
  display: block;
}

.option-description {
  font-size: 0.85em;
  color: #ccc;
  margin-left: 30px;
  opacity: 0.8;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 30px;
}

.volume-slider,
.duration-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #3d2317;
  outline: none;
  border: 1px solid #8B4513;
}

.volume-slider::-webkit-slider-thumb,
.duration-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #DAA520;
  cursor: pointer;
  border: 2px solid #8B4513;
}

.volume-value,
.duration-value {
  min-width: 40px;
  font-size: 0.9em;
  color: #DAA520;
  font-weight: bold;
}

.action-button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-left: 30px;
  width: fit-content;
}

.export-btn {
  background: #4CAF50;
  color: white;
}

.export-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.import-btn {
  background: #2196F3;
  color: white;
}

.import-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.reset-btn {
  background: #f44336;
  color: white;
}

.reset-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

/* Scrollbar personnalisée */
.options-panel::-webkit-scrollbar {
  width: 8px;
}

.options-panel::-webkit-scrollbar-track {
  background: #2c1810;
  border-radius: 4px;
}

.options-panel::-webkit-scrollbar-thumb {
  background: #8B4513;
  border-radius: 4px;
}

.options-panel::-webkit-scrollbar-thumb:hover {
  background: #A0522D;
}

/* Responsive */
@media (max-width: 600px) {
  .option-section {
    padding: 12px;
  }
  
  .action-button {
    margin-left: 0;
    width: 100%;
  }
  
  .option-description {
    margin-left: 0;
    margin-top: 5px;
  }
  
  .slider-container {
    margin-left: 0;
  }
}
</style>
