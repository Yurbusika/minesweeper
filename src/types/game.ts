export type cell = {
  isMine: boolean
  cellState: ECellClickState
  neighborMines: number
}

export enum EGameState {
  NotStarted,
  Started,
  Finished,
}

export enum ECellClickState {
  NotRevealed,
  Revealed,
  Flagged,
  Marked,
}
