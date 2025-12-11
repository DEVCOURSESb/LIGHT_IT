<template>
  <div container>
    <v-img
      :aspect-ratio="1"
      class="image bg-surface elevation-10"
      cover
      height="750"
      src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png"
      width="auto"
    />
  </div>
  <FooterComponent />
</template>

<script setup>
  import FooterComponent from '@/layouts/FooterComponent.vue'
</script>
