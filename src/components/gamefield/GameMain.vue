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

  <!-- :timeInMs; :opened; @close -->
  <GameResultModal
    :opened="isModalOpened"
    :isGameWin="isGameWin"
    :timeInMs="timeInMs"
    @close="closeModal"
    @restart-game="restartGame"
    @back-to-settings="emit('backToSettings')"
  />
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, reactive, ref, watch } from 'vue'
import type { Cell, GameConfig } from '@/types/game'
import { ECellClickState, EGameState } from '@/types/game'
// import { GAME_CONFIG_PRESET } from '@/constants/game'

import GameTopBar from './GameTopBar.vue'
import GameField from './GameField.vue'
import GameResultModal from './GameResultModal.vue'

import { useLeaderboardStore } from '@/stores/leaderboard'
// import Game from '@/core/game'

type Props = {
  config: GameConfig
}

const props = defineProps<Props>()
const { rows, cols, mines } = props.config

const emit = defineEmits(['backToSettings'])

const gamefield = reactive<Cell[][]>([])

const gameState = ref<EGameState>(EGameState.NotStarted)
const isGameWin = ref(false)

const flags = ref(0)
const remainsMines = computed(() => mines - flags.value)

const isModalOpened = ref(false)
const timeInMs = ref(0)

// const game = reactive(new Game({ config: GAME_CONFIG_PRESET.easy }))

const gameId = ref(crypto.randomUUID())

const refreshGameId = () => {
  gameId.value = crypto.randomUUID()
}

const leaderboardStore = useLeaderboardStore()

const createGamefield = () => {
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = []

    for (let j = 0; j < cols; j++) {
      const cell: Cell = {
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

  while (countPlacedMines < mines) {
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

  gameState.value = EGameState.Started

  if (currentCell.cellState === ECellClickState.NotRevealed) {
    currentCell.cellState = ECellClickState.Revealed

    if (currentCell.isMine) {
      revealAllMines()
      gameState.value = EGameState.Finished

      isModalOpened.value = true
    } else if (currentCell.neighborMines === 0) {
      revealEmptyNeighbor(row, col)
    }
  }

  checkWin()
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

const changeMark = (row: number, col: number) => {
  const currentCell = gamefield[row][col]

  if (currentCell.cellState === ECellClickState.NotRevealed) {
    currentCell.cellState = ECellClickState.Flagged
    flags.value++

    checkWin()
  } else if (currentCell.cellState === ECellClickState.Flagged) {
    currentCell.cellState = ECellClickState.Marked
  } else if (currentCell.cellState === ECellClickState.Marked) {
    currentCell.cellState = ECellClickState.NotRevealed
    flags.value--
  }
}

const startGame = (params: { initialCell: { rowIndex: number; colIndex: number } }) => {
  const { rowIndex, colIndex } = params.initialCell
  refreshGameId()
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

  changeMark(rowIndex, colIndex)
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

  if (countFlaggedMines === mines) {
    return (isGameWin.value = true)
  }

  if (countRevealedCells === boardSize - mines) {
    return (isGameWin.value = true)
  }

  return (isGameWin.value = false)
}

const restartGame = () => {
  if (isModalOpened.value) {
    isModalOpened.value = false
  }

  flags.value = 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentCell = gamefield[r][c]

      currentCell.cellState = ECellClickState.NotRevealed
      gameState.value = EGameState.Restarted
    }
  }
}

const closeModal = (close: boolean) => {
  isModalOpened.value = close
}

const timerId = ref(0)

const startStopwatch = () => {
  timerId.value = setInterval(() => {
    timeInMs.value += 1000
  }, 1000)
}

const stopStopwatch = () => {
  clearInterval(timerId.value)
}

watch(gameState, () => {
  if (gameState.value === EGameState.Started) {
    startStopwatch()
  } else if (gameState.value === EGameState.Finished) {
    stopStopwatch()
  } else if (gameState.value === EGameState.Restarted) {
    stopStopwatch()
    timeInMs.value = 0
  }
})

watch(isGameWin, () => {
  if (isGameWin.value) {
    gameState.value = EGameState.Finished
    isGameWin.value = true
    isModalOpened.value = true

    leaderboardStore.addResult({
      id: gameId.value,
      timeInMs: timeInMs.value,
      mines: mines,
      rows,
      cols,
    })
  }
})

watch(isModalOpened, () => {
  if (isModalOpened.value) {
    document.body.classList.add('overlay')
  } else {
    document.body.classList.remove('overlay')
  }
})

onMounted(() => {
  createGamefield()
})
</script>

<style scoped></style>
