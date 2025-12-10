<template>
  <CrudTablePage :config="tiposContratoConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { tiposContratoConfig } from "@/components/config/tipos-contrato/tipos-contrato.config";
</script>
