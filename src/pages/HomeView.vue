<template>
  <!--  @selected-difficulty -> @level-selected="handleLevelSelected" -->
  <SettingsScreen v-if="!isGameStart" @level-selected="handleLevelSelected" />

  <GameMain v-else-if="isGameStart" :config="config" @back-to-settings="backToSettings" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import SettingsScreen from '@/components/settings/SettingsScreen.vue'
import GameMain from '@/components/gamefield/GameMain.vue'
import type { GameConfig } from '@/types/game'

const isGameStart = ref(false)

const config = ref<GameConfig>({
  rows: 0,
  cols: 0,
  mines: 0,
})

const handleLevelSelected = (selectedLevel: GameConfig) => {
  config.value = selectedLevel
  isGameStart.value = true
}

const backToSettings = () => {
  isGameStart.value = false
}
</script>
