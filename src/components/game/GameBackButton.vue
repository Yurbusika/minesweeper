<template>
  <button class="back-button">
    <BackIcon class="back-button_icon" />
  </button>
</template>

<script setup lang="ts">
import BackIcon from '@/assets/icons/return.svg'
</script>

<style scoped>
.back-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.back-button_icon {
  max-width: 100%;
}
</style>
