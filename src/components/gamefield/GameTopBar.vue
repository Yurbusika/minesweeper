<template>
  <div class="top-bar">
    <div class="top-bar__container">
      <GameBackButton @click="emit('backToSettings')" />
      <GameStopwatch :game-state="gameState" :time-in-ms="timeInMs" />
      <GameCounter :remains-mines="remainsMines" />
      <GameRestartButton @click="emit('restartGame')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

import GameCounter from './GameCounter.vue'
import GameStopwatch from './GameStopwatch.vue'
import GameRestartButton from './GameRestartButton.vue'
import GameBackButton from './GameBackButton.vue'

import { EGameState } from '@/types/game'

type Props = {
  remainsMines: number
  timeInMs: number
  gameState: EGameState
}

defineProps<Props>()

const emit = defineEmits(['backToSettings', 'restartGame', 'startStopwatch', 'stopStopwatch'])
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: center;
  width: 80%;
  background-color: var(--main-color);
  border-radius: var(--radius);
  font-size: 1.25em;
}

.top-bar__container {
  width: 500px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
