<template>
  <v-app>
    <LoginC />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import LoginC from '@/pages/auth/LoginC.vue'
</script>
