import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

type ResultItem = {
  id: string
  timeInMs: number
  mines: number
  rows: number
  cols: number
}

const LEADERBOARD_STORAGE_KEY = 'leaderboard'

const saveLeaderboardInStorage = (state: ResultItem[]) => {
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(state))
}

const getLeaderboardFromStorage = () => {
  const leaderboardRaw = localStorage.getItem(LEADERBOARD_STORAGE_KEY)
  return leaderboardRaw ? JSON.parse(leaderboardRaw) : []
}

export const useLeaderboardStore = defineStore(LEADERBOARD_STORAGE_KEY, () => {
  const leaderboard = reactive<ResultItem[]>(getLeaderboardFromStorage())

  const addResult = (newResult: ResultItem) => {
    leaderboard.push(newResult)
    saveLeaderboardInStorage(leaderboard)
  }

  const getSortedLeaderboard = computed(() => {
    return leaderboard
      .sort((a, b) => {
        if (a.timeInMs > b.timeInMs) return 1
        if (a.timeInMs < b.timeInMs) return -1
        return 0
      })
      .slice(0, 10)
  })

  return { leaderboard, addResult, getSortedLeaderboard }
})
