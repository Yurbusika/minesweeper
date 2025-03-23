<template>
  <div
    class="cell"
    :class="{ cell_revealed: isRevealed, cell_mine: isMine }"
    @click="revealCell"
    @contextmenu.prevent="toggleFlag"
  >
    <span v-if="isFlagged">
      <FlagIcon />
    </span>
    <span v-else-if="isQuestion">
      <QuestionIcon />
    </span>
    <span v-else-if="isRevealed && isMine">
      <MineIcon />
    </span>
    <span v-else-if="isRevealed && neighborMines && neighborMines > 0"> {{ neighborMines }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import FlagIcon from '@/assets/icons/flag.svg'
import MineIcon from '@/assets/icons/mine.svg'
import QuestionIcon from '@/assets/icons/question.svg'

const props = defineProps({
  isMine: Boolean,
  isRevealed: Boolean,
  isFlagged: Boolean,
  isQuestion: Boolean,
  neighborMines: Number,
})

const emit = defineEmits(['reveal', 'toggleFlag'])

const revealCell = () => {
  if (!props.isRevealed && !props.isFlagged) {
    emit('reveal')
  }
}

const toggleFlag = () => {
  if (!props.isRevealed) {
    emit('toggleFlag')
  }
}
</script>

<style scoped>
.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #302f2f;
}

.cell_revealed {
  background-color: #eee;
}

.cell_revealed.cell_mine {
  background-color: #ff4444;
}
</style>
