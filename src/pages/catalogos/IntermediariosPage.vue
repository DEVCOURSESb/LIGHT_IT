<!-- IntermediariosPage.vue -->
<template>
  <CrudTablePage :config="intermediariosConfig" />
</template>

<script lang="ts" setup>
import CrudTablePage from "@/components/catalogos/CrudTablePage.vue";
import { intermediariosConfig } from "@/components/catalogos/intermediarios.config";
</script>
