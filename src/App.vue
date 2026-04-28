<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <HelloWorld /> -->
  <h1>App.vue</h1>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink to="/nosotros">Nosotros</RouterLink>
    <RouterLink to="/servicios">Servicios</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
