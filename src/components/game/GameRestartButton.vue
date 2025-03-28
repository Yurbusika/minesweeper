<template>
  <button class="restart-button">
    <RestartIcon class="restart-button_icon" />
  </button>
</template>

<script setup lang="ts">
import RestartIcon from '@/assets/icons/restart.svg'
</script>

<style scoped>
.restart-button {
  background-color: transparent;
  border: none;
  cursor: pointer;

  display: flex;
  justify-content: center;
}

.restart-button_icon {
  max-width: 100%;
}
</style>
