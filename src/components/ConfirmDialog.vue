<template>
  <div class="confirm-overlay" v-if="show" @click.self="onCancel">
    <div class="confirm-dialog">
      <div class="confirm-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="confirm-content">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-actions">
        <button @click="onCancel" class="cancel-btn">{{ cancelText }}</button>
        <button @click="onConfirm" class="confirm-btn">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmation',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<Emits>()

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.confirm-dialog {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 220, 0.9));
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  padding: 25px;
  max-width: 400px;
  width: 90%;
  border: 2px solid rgba(139, 69, 19, 0.3);
  animation: dialogAppear 0.3s ease-out;
}

@keyframes dialogAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.confirm-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #8B4513;
  text-align: center;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.confirm-content p {
  margin: 0;
  font-size: 1rem;
  color: #5D4037;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.cancel-btn {
  background: linear-gradient(145deg, #95A5A6, #7F8C8D);
  color: white;
}

.cancel-btn:hover {
  background: linear-gradient(145deg, #7F8C8D, #6C7A7B);
  transform: translateY(-1px);
}

.confirm-btn {
  background: linear-gradient(145deg, #FF6B6B, #EE5A52);
  color: white;
}

.confirm-btn:hover {
  background: linear-gradient(145deg, #EE5A52, #E74C3C);
  transform: translateY(-1px);
}

/* Responsive Design pour ConfirmDialog */
/* Smartphones */
@media (max-width: 768px) {
  .confirm-dialog {
    max-width: 350px;
    width: 95%;
    padding: 20px;
    margin: 10px;
  }
  
  .confirm-header h3 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
  
  .confirm-content p {
    font-size: 0.9rem;
    margin-bottom: 15px;
    white-space: pre-line;
  }
  
  .confirm-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .cancel-btn, .confirm-btn {
    padding: 12px 15px;
    font-size: 0.9rem;
    min-width: auto;
    width: 100%;
  }
}

/* Petits smartphones */
@media (max-width: 480px) {
  .confirm-dialog {
    max-width: none;
    width: 98%;
    padding: 15px;
    margin: 5px;
  }
  
  .confirm-header h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  
  .confirm-content p {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
  
  .confirm-actions {
    gap: 8px;
  }
  
  .cancel-btn, .confirm-btn {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}
</style>
