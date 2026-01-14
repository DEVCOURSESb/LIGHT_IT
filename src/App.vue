<template>
  <router-view />
  <DialogGlobal />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
  import DialogGlobal from './components/DialogGlobal.vue'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>
