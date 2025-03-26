<template>
  <div class="top-bar">
    <GameReturnButton @click="emit('returnSettingsScreen')" />
    <GameStopwatch :game-state="gameState" />
    <GameCounter :amount-of-mine="amountOfMine" :amount-of-flag="amountOfFlag" />
    <GameRestartButton @click="emit('restartGame')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

import GameCounter from './GameCounter.vue'
import GameStopwatch from './GameStopwatch.vue'
import GameRestartButton from './GameRestartButton.vue'
import GameReturnButton from './GameReturnButton.vue'

import { EGameState } from '@/types/game'

interface Props {
  amountOfMine: number
  amountOfFlag: number
  gameState: EGameState
}

const { amountOfMine, amountOfFlag, gameState } = defineProps<Props>()

const emit = defineEmits(['returnSettingsScreen', 'restartGame'])
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1em;

  width: 80%;

  background-color: var(--main-color);
  border-radius: var(--radius);

  font-size: 1.25em;
}
</style>
