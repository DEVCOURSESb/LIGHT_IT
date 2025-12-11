<template>
  <CrudTablePage :config="estatusReciboConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { estatusReciboConfig } from '@/components/config/estatus_recibo/estatusRecibo.config';



</script>
