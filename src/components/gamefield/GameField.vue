<template>
  <div class="gamefield">
    <div v-for="(row, rowIndex) in gamefield" :key="rowIndex" class="gamefield__row">
      <GameCell
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :isMine="cell.isMine"
        :cellState="cell.cellState"
        :neighborMines="cell.neighborMines"
        @click="emit('handleCellClick', { cell: { rowIndex, colIndex } })"
        @contextmenu.prevent="emit('handleCellContextmenu', { cell: { rowIndex, colIndex } })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import GameCell from './GameCell.vue'
import type { cell } from '@/types/game'

interface Props {
  gamefield: cell[][]
}

const { gamefield } = defineProps<Props>()

const emit = defineEmits(['handleCellClick', 'handleCellContextmenu'])
</script>

<style scoped>
.gamefield {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gamefield__row {
  display: flex;
}
</style>
