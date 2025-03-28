<template>
  <div class="modal" :class="{ open: opened }">
    <div class="modal_overlay"></div>
    <div class="modal__container">
      <button @click="emit('close')" class="modal__button_close"></button>

      <div v-if="isGameWin">
        <h2 class="modal__heading">Поздравляю!</h2>
        <p class="modal__time">Время игры: {{ formattedTime }} секунд</p>
      </div>

      <div v-else>
        <h2 class="modal__heading">Вы проиграли!</h2>
      </div>

      <div class="modal_button_container">
        <button class="modal_button" @click="backToSettings">Начать новую игру</button>
        <button class="modal_button" @click="restartGame">Перезапустить игру</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import useTimeInMsFormatted from '@/composables/useTimeFormatted'

type Props = {
  opened: boolean
  isGameWin: boolean
  timeInMs: number
}

const props = defineProps<Props>()

const emit = defineEmits(['close', 'restartGame', 'backToSettings'])

const restartGame = () => {
  emit('restartGame')
  emit('close')
}

const backToSettings = () => {
  emit('backToSettings')
  document.body.classList.remove('overlay')
}

const formattedTime = useTimeInMsFormatted(props)
</script>

<style scoped>
.modal {
  display: none;
}

.modal.open {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-self: center;
}

.modal_overlay {
  width: 100%;
  height: 100vh;
  background-color: var(--overlay);
  position: absolute;
}

.modal__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin-inline: auto;
  width: 400px;
  height: 150px;

  background-color: var(--main-color);
  border: none;
  border-radius: var(--radius);

  position: relative;
  top: 150px;
  z-index: 100;
}

.modal__button_close {
  width: 25px;
  height: 25px;
  background-color: transparent;
  border: 1px solid var(--bg-color);
  border-radius: var(--radius);
  cursor: pointer;
  font-family: var(--main-font);
  padding: 0;

  position: absolute;
  top: 9px;
  right: 13px;
}

.modal__button_close::before {
  content: '╳';
}

.modal__heading {
  font-family: var(--main-font);
  text-align: center;
}

.modal__time {
  font-family: var(--main-font);
  text-align: center;
}

.modal_button_container {
  display: flex;
  gap: 10px;
}

.modal_button {
  font-family: var(--main-font);
  padding: 1em;
  border: 1px solid var(--main-color);
  border-radius: var(--radius);
  background-color: var(--bg-color);
  cursor: pointer;
  color: var(--main-color);
  display: flex;
  justify-content: center;
  align-self: center;
}

.modal_button:hover {
  border: 1px solid var(--bg-color);
}
</style>
