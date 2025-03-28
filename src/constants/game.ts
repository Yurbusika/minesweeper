import type { GameConfig } from '@/types/game'

export const GAME_CONFIG_PRESET: Record<'easy' | 'medium' | 'hard', GameConfig> = {
  easy: {
    rows: 8,
    cols: 8,
    mines: 10,
  },
  medium: {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  hard: {
    rows: 32,
    cols: 16,
    mines: 100,
  },
}
