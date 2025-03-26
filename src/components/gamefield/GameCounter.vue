<template>
  <div class="counter">
    <MineIcon class="icon" />
    <span>{{ counter }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import MineIcon from '@/assets/icons/mine.svg'

interface Props {
  amountOfMine: number
  amountOfFlag: number
}

const { amountOfMine, amountOfFlag } = defineProps<Props>()

const counter = computed(() => {
  return amountOfMine - amountOfFlag
})
</script>

<style scoped>
.counter {
  font-family: var(--main-font);

  display: flex;
  align-items: center;
  gap: 5px;
}

.icon {
  fill: var(--bg-light-color);
}
</style>
