<template>
  <v-breadcrumbs :items="breadcrumbs" />

  <v-card-title class="d-flex align-center">
    Nuevo contrato accidentes y enfermedades
  </v-card-title>

  <v-spacer class="mb-4" />

  <TabSection />

  <WindowSection />

  <v-spacer class="mb-4" />
</template>

<script lang="ts" setup>
import TabSection from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/TabSection.vue";
import WindowSection from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/WindowSection.vue";
const breadcrumbs = [
  "Reaseguro",
  "Contratos",
  "Accidentes y Enfermedades",
  "Nuevo",
];
</script>
