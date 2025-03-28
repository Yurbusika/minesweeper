import { useLeaderboardStore } from '@/stores/leaderboard'
import { ECellClickState, EGameState, type Cell, type GameConfig } from '@/types/game'
import { computed, reactive, ref, watch } from 'vue'
import useStopwatch from './useStopwatch'

type Props = { config: GameConfig; onGameFinished: (state: EGameState) => void }

const useGame = (props: Props) => {
  const gamefield = reactive<Cell[][]>([])

  const gameState = ref<EGameState>(EGameState.NotStarted)
  const gameId = ref(crypto.randomUUID())

  const isGameWin = ref(false)

  const { rows, cols, mines } = props.config

  const flags = ref(0)
  const remainsMines = computed(() => mines - flags.value)

  const leaderboardStore = useLeaderboardStore()

  const stopwatch = useStopwatch()

  const refreshGameId = () => {
    gameId.value = crypto.randomUUID()
  }

  const initGame = () => {
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

        props.onGameFinished(gameState.value)
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

        const isFlaggedMine =
          currentCell.isMine && currentCell.cellState === ECellClickState.Flagged

        if (isFlaggedMine) {
          countFlaggedMines++
        }

        const notRevealedMine =
          !currentCell.isMine && currentCell.cellState === ECellClickState.Revealed

        if (notRevealedMine) {
          countRevealedCells++
        }
      }
    }

    if (countFlaggedMines === mines || countRevealedCells === boardSize - mines) {
      isGameWin.value = true
      return
    }

    isGameWin.value = false
    return
  }

  const restartGame = () => {
    flags.value = 0

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const currentCell = gamefield[r][c]

        currentCell.cellState = ECellClickState.NotRevealed
        gameState.value = EGameState.Restarted
      }
    }
  }

  watch(gameState, () => {
    if (gameState.value === EGameState.Started) {
      stopwatch.start()
      return
    }

    if (gameState.value === EGameState.Finished) {
      stopwatch.stop()
      return
    }

    if (gameState.value === EGameState.Restarted) {
      stopwatch.stop()
      stopwatch.timeInMs.value = 0
    }
  })

  watch(isGameWin, () => {
    if (isGameWin.value) {
      gameState.value = EGameState.Finished
      isGameWin.value = true
      props.onGameFinished(gameState.value)

      leaderboardStore.addResult({
        id: gameId.value,
        timeInMs: stopwatch.timeInMs.value,
        mines: mines,
        rows,
        cols,
      })
    }
  })

  return {
    timeInMs: stopwatch.timeInMs,
    remainsMines,
    initGame,
    isGameWin,
    gameState,
    gamefield,
    restartGame,
    handleCellClick,
    handleCellContextmenu,
  }
}

export default useGame
