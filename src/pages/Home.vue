<template>
  <div class="image-text-container">
    <v-img
      class="image bg-surface elevation-10"
      cover
      height="600"
      src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png"
    />

    <div class="text-overlay">
      <h2 class="text-h5 font-weight-bold" color="black">Sistema catálogos de reaseguro</h2>

      <v-carousel
        class="carousel-responsive"
        height="300"
        hide-delimiters
        progress="#003c71"
        show-arrows="hover"
      >
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          cover
          :src="item.src"
        />
      </v-carousel>
    </div>
  </div>


</template>

<script lang="ts" setup>

  const items = [
    {
      src: 'src/assets/logo/la-latino-logo.png',
    },
    {
      src: 'src/assets/logo/la-latino-seguros-opiniones.jpg',
    },
    {
      src: 'src/assets/logo/latino-seguros-historia-torre-latinoamericana.jpg',
    },
    {
      src: 'src/assets/logo/torreLatino.png',
    },
  ]
</script>
