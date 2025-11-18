<template>
  <!-- todo: la request viene con esActivo: boolean -->
  <CrudTablePage :config="TiposCapturaConfig" />
</template>
<script lang="ts" setup>
import { TiposCapturaConfig } from "@/components/config/tipos-captura/tipos-captura.config";
</script>
