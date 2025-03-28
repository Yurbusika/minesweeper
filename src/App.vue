<template>
  <div class="container">
    <Header />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  min-height: 500px;
}
</style>
