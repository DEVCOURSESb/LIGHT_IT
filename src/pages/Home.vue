<template>
  <div class="image-text-container">
    <div class="image-side">
      <v-img
        class="image bg-surface"
        src="/src/assets/logo/light-it.svg"
        cover
      />
    </div>

    <div class="text-side">
      <div class="text-overlay">
        <h2 class="text-h5 font-weight-bold text-black mb-6">
          Sistema catálogos de reaseguro
        </h2>

        <v-carousel
          class="carousel-responsive"
          height="300"
          hide-delimiters
          progress="#003c71"
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(item, i) in items"
            :key="i"
            :src="item.src"
            cover
          />
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const items = [
  {
    src: "src/assets/logo/logo_0.jpeg",
  },
  {
    src: "src/assets/logo/logo_1.jpeg",
  },
  {
    src: "src/assets/logo/logo_3.jpeg",
  },
];
</script>
