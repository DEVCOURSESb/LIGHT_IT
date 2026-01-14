<template>
  <router-view />
  <DialogGlobal />
  <SnackBarComponent />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
  import DialogGlobal from './components/DialogGlobal.vue'
  import SnackBarComponent from './components/general/SnackBarComponent.vue'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>
