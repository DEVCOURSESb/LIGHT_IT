<template>
  <div class="image-text-container">
    <v-img
      :aspect-ratio="1"
      class="image bg-surface elevation-10"
      cover
      height="750"
      src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png"
      width="auto"
    />
    <div class="text-overlay">
      <h2 class="text-h4 font-weight-bold">Sistema catálogos de reaseguro</h2>
      <v-carousel
        aspect-ratio="16/9"
        height="400"
        hide-delimiters
        progress="blue"
        show-arrows="hover"
        transition-duration="500"
      >
        <br>
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          cover
          :src="item.src"
        />
      </v-carousel>
    </div>
  </div>
  <FooterComponent />
</template>

<script setup>
  import FooterComponent from '@/layouts/FooterComponent.vue'
  const items = [
    {
      src: 'src/assets/logo/Torre-Latinoamericana.png',
    },
    {
      src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
    },
    {
      src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
    },
    {
      src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
    },
  ]
</script>
