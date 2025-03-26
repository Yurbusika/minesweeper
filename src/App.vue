<template>
  <div class="container">
    <Header />
    <SettingsScreen v-if="!isGameStart" @selected-difficulty="selectedDifficulty" />
    <GameMain
      v-else-if="isGameStart"
      :rows="rows"
      :cols="cols"
      :amountOfMine="amountOfMine"
      @return-settings-screen="returnSettingsScreen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import SettingsScreen from './components/settings/SettingsScreen.vue'
import GameMain from './components/gamefield/GameMain.vue'
const isGameStart = ref(false)

const rows = ref()
const cols = ref()
const amountOfMine = ref()

const selectedDifficulty = (selectedRows: number, selectedCols: number, selectedMine: number) => {
  rows.value = selectedRows
  cols.value = selectedCols
  amountOfMine.value = selectedMine
  isGameStart.value = true
}

const returnSettingsScreen = () => {
  isGameStart.value = false
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}
</style>
