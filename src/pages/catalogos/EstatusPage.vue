<template>
  <CrudTablePage :config="EstatusConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { EstatusConfig } from "@/components/config/estatus/estatus.config";
</script>
