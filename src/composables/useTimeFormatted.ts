import { computed } from 'vue'

const useTimeInMsFormatted = (props: { timeInMs: number }) => {
  const formattedTime = computed(() => {
    const minutes = Math.floor(props.timeInMs / 60000)
      .toString()
      .padStart(2, '0')
    const seconds = ((props.timeInMs / 1000) % 60).toString().padStart(2, '0')

    return `${minutes} : ${seconds}`
  })

  return formattedTime
}

export default useTimeInMsFormatted
