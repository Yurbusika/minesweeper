import { ECellClickState, EGameState, type Gamefield } from '@/types/game'

type Props = {
  gamefield: Gamefield
  onGameLose: () => void
  onGameWin: () => void
  onGameStart: () => void
}

const useGamefield = (props: Props) => {
  const revealCell = (row: number, col: number) => {
    const currentCell = props.gamefield[row][col]

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
}

export default useGamefield
