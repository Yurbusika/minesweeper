<template>
  <div class="stopwatch">
    <StopwatchIcon class="stopwatch__icon" />
    {{ formattedTime }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import StopwatchIcon from '@/assets/icons/stopwatch.svg'
import useTimeInMsFormatted from '@/composables/useTimeFormatted'

type Props = {
  timeInMs: number
}

const props = defineProps<Props>()

const formattedTime = useTimeInMsFormatted(props)
</script>

<style scoped>
.stopwatch {
  font-family: var(--main-font);
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100px;
}

.stopwatch__icon {
  max-width: 100%;
}

@media (width < 350px) {
  .stopwatch {
    justify-content: center;
  }
  .stopwatch__icon {
    display: none;
  }
}
</style>
