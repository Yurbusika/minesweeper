export type Cell = {
  isMine: boolean
  cellState: ECellClickState
  neighborMines: number
}

export enum EGameState {
  NotStarted,
  Started,
  Restarted,
  Finished,
}

export enum ECellClickState {
  NotRevealed,
  Revealed,
  Flagged,
  Marked,
}

export type GameConfig = {
  rows: number
  cols: number
  mines: number
}
