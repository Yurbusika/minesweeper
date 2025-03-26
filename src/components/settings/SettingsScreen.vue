<template>
  <div class="settings">
    <h2>Выберите сложность:</h2>

    <div class="settings__container">
      <button class="btn" @click="emit('selectedDifficulty', 8, 8, 10)">Простой</button>
      <button class="btn" @click="emit('selectedDifficulty', 16, 16, 40)">Средний</button>
      <button class="btn" @click="emit('selectedDifficulty', 32, 16, 100)">Сложный</button>
      <button class="btn">Задать сложность</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['selectedDifficulty'])
</script>

<style>
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

.btn {
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

.btn:hover {
  border: 2px solid var(--main-color);
}
</style>
