<template>
  <div class="gamefield" @click.once.capture="startGame">
    <div v-for="(row, rowIndex) in gamefield" :key="rowIndex" class="gamefield__row">
      <GameCell
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :isMine="cell.isMine"
        :isRevealed="cell.isRevealed"
        :isFlagged="cell.isFlagged"
        :isQuestion="cell.isQuestion"
        :neighborMines="cell.neighborMines"
        @reveal="revealCell(rowIndex, colIndex)"
        @toggle-flag="toggleFlag(rowIndex, colIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { cell } from '@/types/game'
import GameCell from './GameCell.vue'

const rows = ref(16)
const cols = ref(16)
const mineAmount = ref(40)
const gamefield = reactive<cell[][]>([])

const createGamefield = () => {
  for (let i = 0; i < rows.value; i++) {
    const row: cell[] = []
    for (let j = 0; j < cols.value; j++) {
      const cell = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        isQuestion: false,
        neighborMines: 0,
      }
      row.push(cell)
    }
    gamefield.push(row)
  }
}

const placeMines = () => {
  let placedMinesCount = 0

  while (placedMinesCount < mineAmount.value) {
    const row = Math.floor(Math.random() * rows.value)
    const col = Math.floor(Math.random() * cols.value)

    if (!gamefield[row][col].isMine) {
      gamefield[row][col].isMine = true
      placedMinesCount++
    }
  }
}

const calculateNeighborMines = () => {
  for (let row = 0; row < rows.value; row++) {
    for (let col = 0; col < cols.value; col++) {
      const currentCell = gamefield[row][col]

      if (currentCell.isMine) {
        continue
      }

      currentCell.neighborMines = countNeighborMines(row, col)
    }
  }
}

const countNeighborMines = (row: number, col: number) => {
  let neighborMinesCounter = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const currentRow = row + i
      const currentCol = col + j

      if (isInsideGamefield(currentRow, currentCol)) {
        if (gamefield[currentRow][currentCol].isMine) {
          neighborMinesCounter += 1
        }
      }
    }
  }
  return neighborMinesCounter
}

const isInsideGamefield = (row: number, col: number) => {
  return row >= 0 && row < rows.value && col >= 0 && col < cols.value
}

const revealCell = (row: number, col: number) => {
  const currentCell = gamefield[row][col]

  if (!currentCell.isRevealed && !currentCell.isFlagged) {
    currentCell.isRevealed = true

    if (currentCell.isMine) {
      console.log('game over')
      revealAllMines()
    } else if (currentCell.neighborMines === 0) {
      revealEmptyNeighbor(row, col)
    }
  }
}

const revealEmptyNeighbor = (row: number, col: number) => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const currentRow = row + i
      const currentCol = col + j

      if (isInsideGamefield(currentRow, currentCol)) {
        revealCell(currentRow, currentCol)
      }
    }
  }
}

const revealAllMines = () => {
  for (let row = 0; row < rows.value; row++) {
    for (let col = 0; col < cols.value; col++) {
      const currentCell = gamefield[row][col]

      if (currentCell.isMine) {
        currentCell.isRevealed = true
      }
    }
  }
}

const toggleFlag = (row: number, col: number) => {
  const currentCell = gamefield[row][col]

  if (!currentCell.isRevealed) {
    currentCell.isFlagged = true
  } else if (!currentCell.isRevealed && currentCell.isFlagged) {
    currentCell.isFlagged = false
    currentCell.isQuestion = true
  }
}

const startGame = (cell) => {
  console.log(cell)

  placeMines()
  calculateNeighborMines()
}

onMounted(() => {
  createGamefield()
})
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
