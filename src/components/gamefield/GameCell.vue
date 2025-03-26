<template>
  <div class="cell" :class="{ mine: isMine, revealed: cellState === ECellClickState.Revealed }">
    <span v-if="cellState === ECellClickState.Flagged">
      <FlagIcon />
    </span>

    <span v-else-if="cellState === ECellClickState.Marked">
      <QuestionIcon />
    </span>

    <span v-else-if="cellState === ECellClickState.Revealed && isMine">
      <MineIcon />
    </span>

    <span
      :class="colorDigit"
      v-else-if="cellState === ECellClickState.Revealed && neighborMines && neighborMines > 0"
    >
      {{ neighborMines }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import FlagIcon from '@/assets/icons/flag.svg'
import MineIcon from '@/assets/icons/mine.svg'
import QuestionIcon from '@/assets/icons/question.svg'
import { ECellClickState } from '@/types/game'

interface Props {
  isMine: boolean
  cellState: ECellClickState
  neighborMines: number
}

const props = defineProps<Props>()

const colorDigit = computed(() => {
  switch (props.neighborMines) {
    case 1: {
      return 'blue'
    }
    case 2: {
      return 'green'
    }
    case 3: {
      return 'red'
    }
    case 4: {
      return 'darkblue'
    }
    case 5: {
      return 'brown'
    }
    case 6: {
      return 'turquoise'
    }
    case 8: {
      return 'white'
    }
    default: {
      return 'black'
    }
  }
})
</script>

<style scoped>
.cell {
  width: 35px;
  height: 35px;

  border: 1px solid #ccc;
  background-color: var(--bg-color);
  /* background-color: #302f2f; */

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  font-family: var(--game-font);
}

.revealed {
  background-color: #eee;
}

.revealed.mine {
  background-color: var(--accent-color);
}

.blue {
  color: blue;
}

.green {
  color: green;
}

.red {
  color: red;
}

.darkblue {
  color: darkblue;
}

.brown {
  color: brown;
}

.turquoise {
  color: turquoise;
}

.white {
  color: white;
}
</style>
