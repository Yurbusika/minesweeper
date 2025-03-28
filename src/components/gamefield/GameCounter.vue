<template>
  <div class="counter">
    <MineIcon class="counter_icon" />
    <span>{{ remainsMines }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import MineIcon from '@/assets/icons/mine.svg'

type Props = {
  remainsMines: number
}

const { remainsMines } = defineProps<Props>()
</script>

<style scoped>
.counter {
  font-family: var(--main-font);
  display: flex;
  align-items: center;
  gap: 5px;

  width: 100px;
}

.counter_icon {
  fill: var(--bg-light-color);
  max-width: 100%;
}
</style>
