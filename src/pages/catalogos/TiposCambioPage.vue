<template>
  <div v-if="!isLoading">
    <CrudTablePage :config="tipoCambioConfig" />
  </div>
  <div v-else>
    <v-progress-circular indeterminate />
  </div>
</template>

<script lang="ts" setup>
import { useTipoCambioConfig } from '@/components/config/catalogos/tipo_cambio/tipo_cambio.config';

const { tipoCambioConfig, isLoading } = useTipoCambioConfig();
</script>