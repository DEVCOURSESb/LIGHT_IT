<template>
  <CrudTablePage :config="SexoConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { SexoConfig } from "@/components/config/sexo/sexo.config";
</script>
