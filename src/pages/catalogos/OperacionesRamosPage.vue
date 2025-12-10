<template>
  <CrudTablePage :config="operacionesRamosConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>

<script lang="ts" setup>
import { operacionesRamosConfig } from "@/components/config/operaciones-ramos/operaciones-ramos.config";
</script>
