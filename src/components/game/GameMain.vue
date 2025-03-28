<template>
  <GameTopBar
    :remains-mines="remainsMines"
    :game-state="gameState"
    :time-in-ms="timeInMs"
    @back-to-settings="emit('backToSettings')"
    @restart-game="restartGame"
  />

  <GameField
    :gamefield="gamefield"
    @cell-click="handleCellClick"
    @cell-contextmenu="handleCellContextmenu"
  />

  <GameResultModal
    :opened="isModalOpened"
    :isGameWin="isGameWin"
    :timeInMs="timeInMs"
    @close="closeModal"
    @restart-game="handleGameRestartRequest"
    @back-to-settings="emit('backToSettings')"
  />
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import type { GameConfig } from '@/types/game'

import GameTopBar from './GameTopBar.vue'
import GameField from './GameField.vue'
import GameResultModal from './GameResultModal.vue'

import useGame from '@/composables/useGame.ts'

type Props = {
  config: GameConfig
}

const props = defineProps<Props>()
const emit = defineEmits(['backToSettings'])
const isModalOpened = ref(false)

const {
  initGame,
  handleCellClick,
  handleCellContextmenu,
  remainsMines,
  restartGame,
  isGameWin,
  gameState,
  gamefield,
  timeInMs,
} = useGame({
  config: props.config,
  onGameFinished: () => {
    isModalOpened.value = true
  },
})

const closeModal = (close: boolean) => {
  isModalOpened.value = close
}

const handleGameRestartRequest = () => {
  restartGame()
  isModalOpened.value = false
}

onMounted(() => {
  initGame()
})
</script>

<style scoped></style>
