import { ref } from 'vue'
const useStopwatch = () => {
  const timeInMs = ref(0)
  const timerId = ref(0)

  const start = () => {
    timerId.value = setInterval(() => {
      timeInMs.value += 1000
    }, 1000)
  }

  const stop = () => {
    clearInterval(timerId.value)
  }
  return {
    timeInMs,
    start,
    stop,
  }
}

export default useStopwatch
