<template>
  <tr>
    <td class="champions__data">{{ position + 1 }}</td>
    <td class="champions__data">{{ rows }} x {{ cols }}</td>
    <td class="champions__data">{{ amountOfMine }}</td>
    <td class="champions__data">{{ timeInMinAndSec }}</td>
  </tr>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface Props {
  position: number
  rows: number
  cols: number
  amountOfMine: number
  timeInMs: number
}

const { timeInMs } = defineProps<Props>()

const timeInMinAndSec = computed(() => {
  const sec = timeInMs / 1000
  const minutes = Math.floor(sec / 60)
  const seconds = sec % 60
  return `${minutes} : ${seconds}`
})
</script>

<style scoped>
.champions__data {
  border: 1px solid var(--bg-color);
  border-radius: var(--radius);
}
</style>
