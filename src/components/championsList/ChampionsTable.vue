<template>
  <table class="champions">
    <thead class="champions__head">
      <tr>
        <th class="champions__header">№</th>
        <th class="champions__header">Размер поля</th>
        <th class="champions__header">Количество мин</th>
        <th class="champions__header">Время</th>
      </tr>
    </thead>
    <tbody>
      <ChampionsItem
        v-for="(result, resultIndex) in sortedLeaderboard"
        :key="result.id"
        :position="resultIndex"
        :rows="result.rows"
        :cols="result.cols"
        :amount-of-mine="result.mines"
        :time-in-ms="result.timeInMs"
      />
    </tbody>
  </table>
</template>
<script setup lang="ts">
import ChampionsItem from './ChampionsItem.vue'
import { useLeaderboardStore } from '@/stores/leaderboard'

const leaderboardStore = useLeaderboardStore()
const sortedLeaderboard = leaderboardStore.getSortedLeaderboard
</script>

<style scoped>
.champions {
  font-family: var(--main-font);
  font-size: 1.25em;
  text-align: center;
  border-radius: var(--radius);
}

.champions__head {
  background-color: var(--bg-color);
  color: var(--main-color);
}

.champions__header {
  border: 1px solid var(--bg-color);
  padding: 1em;
  border-radius: var(--radius);
}

@media (width < 430px) {
  .champions {
    font-size: 0.9em;
  }
}
</style>
