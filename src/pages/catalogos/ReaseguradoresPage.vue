<template>
  <CrudTablePage :config="reaseguradoresConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>

<script lang="ts" setup>
import { reaseguradoresConfig } from "@/components/config/catalogos/reaseguradores/reaseguradores.config";
</script>
