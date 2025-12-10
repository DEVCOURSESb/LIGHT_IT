<template>
  <CrudTablePage :config="FormaPagoConfig">
    <v-btn color="success">Cargar archivo</v-btn>
  </CrudTablePage>
</template>
<script lang="ts" setup>
import { FormaPagoConfig } from "@/components/config/forma_pago/formaPago.config";
</script>
