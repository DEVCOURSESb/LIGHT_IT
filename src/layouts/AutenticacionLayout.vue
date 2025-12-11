<template>
  <v-app>
    <AutenticacionC />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import AutenticacionC from '@/pages/AutenticacionC.vue'
</script>
