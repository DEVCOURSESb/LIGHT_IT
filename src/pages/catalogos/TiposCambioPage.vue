<template>
  <CrudTablePage :config="tipoCambioConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { tipoCambioConfig } from '@/components/config/tipo_cambio/tipo_cambio.config';


</script>
