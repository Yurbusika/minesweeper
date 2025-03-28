<template>
  <div class="champions_container">
    <h2 class="champions__heading">Таблица лидеров:</h2>
    <ChampionsTable />
  </div>
</template>

<script setup lang="ts">
import ChampionsTable from '@/components/championsList/ChampionsTable.vue'
</script>

<style scoped>
.champions_container {
  font-family: var(--main-font);
}

.champions__heading {
  text-align: center;
  font-size: 1.5em;
  color: var(--bg-color);
  margin-block: 10px;
}
</style>
