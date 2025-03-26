<template>
  <div class="stopwatch">
    <StopwatchIcon />
    <span> {{ formattedMinutes }}</span>
    <span>:</span>
    <span> {{ formattedSeconds }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, watch } from 'vue'
import StopwatchIcon from '@/assets/icons/stopwatch.svg'

import { EGameState } from '@/types/game'

interface Props {
  gameState: EGameState
}

const { gameState } = defineProps<Props>()

let timerId = 0
let counter = 0
const seconds = ref(0)
const minutes = ref(0)

const startStopwatch = () => {
  counter++

  if (counter === 100) {
    seconds.value++
    counter = 0
  }

  if (seconds.value === 60) {
    minutes.value++
    seconds.value = 0
  }

  timerId = setTimeout(startStopwatch, 10)
}

const stopStopwatch = () => {
  clearTimeout(timerId)
}

const formattedSeconds = computed(() => {
  if (seconds.value < 10) {
    return `0${seconds.value}`
  }
  return seconds.value
})

const formattedMinutes = computed(() => {
  if (minutes.value < 10) {
    return `0${minutes.value}`
  }
  return minutes.value
})

watch(
  () => gameState,
  () => {
    if (gameState === EGameState.Started) {
      startStopwatch()
    } else if (gameState === EGameState.Finished) {
      stopStopwatch()
    } else if (gameState === EGameState.NotStarted) {
      stopStopwatch()
      counter = 0
      seconds.value = 0
      minutes.value = 0
    }
  },
)
</script>

<style scoped>
.stopwatch {
  font-family: var(--main-font);

  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
