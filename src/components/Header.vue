<template>
  <header class="header">
    <RouterLink to="/" class="link">
      <div class="logo">
        <MineIcon />
        <h1 class="title">Сапёр</h1>
      </div>
    </RouterLink>

    <RouterLink to="/champions">
      <button class="button">
        <ChampionsIcon />
      </button>
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import MineIcon from '@/assets/icons/mine.svg'
import ChampionsIcon from '@/assets/icons/champions.svg'
</script>

<style scoped>
.header {
  width: 100%;
  font-family: var(--main-font);

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-inline: 2em;

  background-color: var(--bg-color);
  color: var(--main-color);
  border-radius: var(--radius);
}

.logo {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: var(--main-color);
}

.title {
  text-decoration: none;
}

.link {
  text-decoration: none;
}

/* .logo:hover {
  
} */

.button {
  width: 50px;
  height: 50px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
}
</style>
