<template>
  <v-breadcrumbs :items="breadcrumbs" />

  <v-card-title class="d-flex align-center">
    Visualizar contratos accidentes y enfermedades
  </v-card-title>

  <v-spacer class="mb-4" />
</template>

<script lang="ts" setup>
const breadcrumbs = ['Reaseguro', 'Contratos de reaseguro', 'Accidentes y Enfermedades', 'Visualizar contrato'];
</script>