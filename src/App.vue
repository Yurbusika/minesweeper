<template>
  <div>
    <GameField v-if="isGameStart" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameField from './components/gamefield/GameField.vue'

const isGameStart = ref(false)
</script>
