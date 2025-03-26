<template>
  <GameTopBar
    :amountOfMine="amountOfMine"
    :amountOfFlag="amountOfFlag"
    :gameState="gameState"
    @return-settings-screen="emit('returnSettingsScreen')"
    @restart-game="restartGame"
  />
  <GameField
    :gamefield="gamefield"
    @handle-cell-click="handleCellClick"
    @handle-cell-contextmenu="handleCellContextmenu"
  />
  <GameResultModal v-if="gameState === EGameState.Finished" />
</template>

<script setup lang="ts">
import { defineProps, onMounted, reactive, ref } from 'vue'
import type { cell } from '@/types/game'
import { ECellClickState, EGameState } from '@/types/game'

import GameTopBar from './GameTopBar.vue'
import GameField from './GameField.vue'
import GameResultModal from './GameResultModal.vue'

interface Props {
  rows: number
  cols: number
  amountOfMine: number
}

const { rows, cols, amountOfMine } = defineProps<Props>()

const emit = defineEmits(['returnSettingsScreen'])

const gamefield = reactive<cell[][]>([])

const gameState = ref<EGameState>(EGameState.NotStarted)
const isGameWin = ref(false)

const amountOfFlag = ref(0)

const createGamefield = () => {
  for (let i = 0; i < rows; i++) {
    const row: cell[] = []

    for (let j = 0; j < cols; j++) {
      const cell = {
        isMine: false,
        cellState: ECellClickState.NotRevealed,
        neighborMines: 0,
      }
      row.push(cell)
    }

    gamefield.push(row)
  }
}

const placeMines = (params: { initialCell: { rowIndex: number; colIndex: number } }) => {
  const { rowIndex, colIndex } = params.initialCell

  let countPlacedMines = 0

  while (countPlacedMines < amountOfMine) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    if (gamefield[row][col] === gamefield[rowIndex][colIndex]) {
      continue
    }

    if (!gamefield[row][col].isMine) {
      gamefield[row][col].isMine = true
      countPlacedMines++
    }
  }
}

const calculateNeighborMines = () => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
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

      if (isInsideGamefield(currentRow, currentCol) && gamefield[currentRow][currentCol].isMine) {
        neighborMinesCounter += 1
      }
    }
  }

  return neighborMinesCounter
}

const isInsideGamefield = (row: number, col: number) => {
  return row >= 0 && row < rows && col >= 0 && col < cols
}

const revealCell = (row: number, col: number) => {
  const currentCell = gamefield[row][col]

  if (currentCell.cellState === ECellClickState.NotRevealed) {
    currentCell.cellState = ECellClickState.Revealed

    if (currentCell.isMine) {
      console.log('game over')
      revealAllMines()
      gameState.value = EGameState.Finished

      if (!isGameWin.value) {
        console.log('lose')
      }
    } else if (currentCell.neighborMines === 0) {
      revealEmptyNeighbor(row, col)
    }
  }

  checkWin()

  if (isGameWin.value) {
    console.log('win')
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
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentCell = gamefield[row][col]

      if (currentCell.isMine) {
        currentCell.cellState = ECellClickState.Revealed
      }
    }
  }
}

const toggleFlag = (row: number, col: number) => {
  const currentCell = gamefield[row][col]

  if (currentCell.cellState === ECellClickState.NotRevealed) {
    currentCell.cellState = ECellClickState.Flagged
    amountOfFlag.value++

    checkWin()

    if (isGameWin.value) {
      console.log('flag-win')
    }
  } else if (currentCell.cellState === ECellClickState.Flagged) {
    currentCell.cellState = ECellClickState.Marked
  } else if (currentCell.cellState === ECellClickState.Marked) {
    currentCell.cellState = ECellClickState.NotRevealed
    amountOfFlag.value--
  }
}

const startGame = (params: { initialCell: { rowIndex: number; colIndex: number } }) => {
  const { rowIndex, colIndex } = params.initialCell
  placeMines({ initialCell: { rowIndex, colIndex } })
  calculateNeighborMines()
}

const handleCellClick = (params: { cell: { rowIndex: number; colIndex: number } }) => {
  const { rowIndex, colIndex } = params.cell

  if (gameState.value === EGameState.NotStarted) {
    startGame({ initialCell: { rowIndex, colIndex } })
    revealCell(rowIndex, colIndex)
    gameState.value = EGameState.Started
    return
  }

  if (gameState.value === EGameState.Finished) {
    return
  }

  revealCell(rowIndex, colIndex)
}

const handleCellContextmenu = (params: { cell: { rowIndex: number; colIndex: number } }) => {
  const { rowIndex, colIndex } = params.cell

  toggleFlag(rowIndex, colIndex)
}

const checkWin = () => {
  let countFlaggedMines = 0
  let countRevealedCells = 0

  const boardSize = rows * cols

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentCell = gamefield[row][col]

      if (currentCell.isMine && currentCell.cellState === ECellClickState.Flagged) {
        countFlaggedMines++
      }

      if (!currentCell.isMine && currentCell.cellState === ECellClickState.Revealed) {
        countRevealedCells++
      }
    }
  }

  if (countFlaggedMines === amountOfMine) {
    return (isGameWin.value = true)
  }

  if (countRevealedCells === boardSize - amountOfMine) {
    return (isGameWin.value = true)
  }

  return (isGameWin.value = false)
}

const restartGame = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentCell = gamefield[r][c]

      currentCell.cellState = ECellClickState.NotRevealed
      gameState.value = EGameState.Restarted
    }
  }
}

onMounted(() => {
  createGamefield()
})
</script>

<style scoped></style>
