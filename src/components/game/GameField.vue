<template>
  <div class="gamefield">
    <div v-for="(row, rowIndex) in gamefield" :key="rowIndex" class="gamefield__row">
      <GameCell
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :isMine="cell.isMine"
        :cellState="cell.cellState"
        :neighborMines="cell.neighborMines"
        @click="emit('cellClick', { cell: { rowIndex, colIndex } })"
        @contextmenu.prevent="emit('cellContextmenu', { cell: { rowIndex, colIndex } })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import GameCell from './GameCell.vue'
import type { Cell } from '@/types/game'

type Props = {
  gamefield: Cell[][]
}

const { gamefield } = defineProps<Props>()

const emit = defineEmits(['cellClick', 'cellContextmenu'])
</script>

<style scoped>
.gamefield {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block: 10px 50px;
}

.gamefield__row {
  display: flex;
}
</style>
