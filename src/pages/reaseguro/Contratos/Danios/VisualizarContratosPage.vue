<template>
  <div container>
    <v-img
      :aspect-ratio="1"
      class="image bg-surface elevation-10"
      cover
      height="750"
      src="/src/assets/logo/light-it.svg"
      width="auto"
    />
  </div>
  <FooterComponent />
</template>

<script lang="ts" setup>
  import FooterComponent from '@/components/general/FooterComponent.vue'
</script>
