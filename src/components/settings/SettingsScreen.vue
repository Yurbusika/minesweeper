<template>
  <div class="settings">
    <h2>Выберите сложность:</h2>

    <div class="settings__container">
      <button class="button" @click="startEasyLevel">Простой</button>
      <button class="button" @click="startMediumLevel">Средний</button>
      <button class="button" @click="startHardLevel">Сложный</button>
      <button class="button" @click="toggleModal">Задать сложность</button>
    </div>

    <div v-if="isCustomSettings" class="settings__modal">
      <button @click="toggleModal" class="modal__button_close"></button>

      <label for="rows">
        Ширина:
        <input class="settings__input" type="number" id="rows" v-model="rows" max="32" min="5" />
      </label>

      <label for="cols">
        Высота:
        <input class="settings__input" type="number" id="cols" v-model="cols" max="32" min="5" />
      </label>

      <label for="amountOfMine">
        Количество мин:
        <input
          class="settings__input"
          type="number"
          id="amountOfMine"
          v-model="mines"
          max="100"
          min="1"
        />
      </label>

      <button class="button" @click="startCustomLevel">Начать игру</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { GAME_CONFIG_PRESET } from '@/constants/game.ts'
import type { GameConfig } from '@/types/game'

const emit = defineEmits(['levelSelected'])

const isCustomSettings = ref(false)

const rows = ref<number>(10)
const cols = ref<number>(10)
const mines = ref<number>(10)

const toggleModal = () => {
  isCustomSettings.value = !isCustomSettings.value
}

const startEasyLevel = () => {
  emit('levelSelected', GAME_CONFIG_PRESET.easy)
}

const startMediumLevel = () => {
  emit('levelSelected', GAME_CONFIG_PRESET.medium)
}

const startHardLevel = () => {
  emit('levelSelected', GAME_CONFIG_PRESET.hard)
}

const startCustomLevel = () => {
  const customLevel: GameConfig = {
    rows: rows.value,
    cols: cols.value,
    mines: mines.value,
  }
  emit('levelSelected', customLevel)
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2em;
  background-color: var(--bg-light-color);

  width: 100%;
  height: 500px;
  border-radius: var(--radius);

  font-family: var(--main-font);
}

.settings__container {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.button {
  cursor: pointer;
  padding: 1em;
  border-radius: var(--radius);
  background-color: var(--bg-color);
  color: var(--main-color);
  font-family: var(--main-font);
  font-size: 1em;
  border: 2px solid var(--bg-color);
  transition: 0.5s;
}

.button:hover {
  border: 2px solid var(--main-color);
}

.settings__modal {
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 1.5em;

  background-color: var(--main-color);
  border-radius: var(--radius);

  position: absolute;
}

.settings__input {
  border: none;
  border-radius: var(--radius);
  width: 60px;
  height: 30px;
  text-align: center;
}

.modal__button_close {
  width: 25px;
  height: 25px;
  background-color: transparent;
  border: 1px solid var(--bg-color);
  border-radius: var(--radius);
  cursor: pointer;

  padding: 0;

  position: absolute;
  top: 9px;
  right: 13px;
}

.modal__button_close::before {
  content: '╳';
}
</style>
