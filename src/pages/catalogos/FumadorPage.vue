<template>
  <CrudTablePage :config="FumadorConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { FumadorConfig } from "@/components/config/fumador/fumador.config";
</script>
