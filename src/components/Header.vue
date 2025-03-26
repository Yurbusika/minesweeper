<template>
  <header class="header">
    <div class="logo">
      <MineIcon />
      <h1>Сапёр</h1>
    </div>
    <!-- <button>Выбрать тему</button> -->
  </header>
</template>

<script setup lang="ts">
import MineIcon from '@/assets/icons/mine.svg'
</script>

<style scoped>
.header {
  width: 100%;
  font-family: var(--main-font);

  display: flex;
  align-items: center;
  justify-content: center;

  padding-inline: 1em;

  background-color: var(--bg-color);
  color: var(--main-color);
  border-radius: var(--radius);
}

.logo {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
