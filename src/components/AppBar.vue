<template>
  <v-app-bar elevation="2">
    <v-toolbar-title class="ml-4"> Latino seguros </v-toolbar-title>

    <v-btn :to="{ name: 'home' }" variant="text">
      <v-icon start>mdi-home</v-icon>
      Inicio
    </v-btn>

    <v-spacer />

    <CatalogosDropdown />

    <v-spacer />
  </v-app-bar>
</template>

<script lang="ts" setup>
import CatalogosDropdown from "./menu/CatalogosDropdown.vue";
</script>
