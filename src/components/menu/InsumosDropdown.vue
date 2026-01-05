<template>
  <menu-submenus-component
    :list-items="listItems"
    prefix-path="insumos"
    menu-title="Insumos"
  />
</template>

<script setup lang="ts">
const listItems = [{ name: "cifras_control", title: "Cifras control" }, { name: "carga_emision", title: "Carga Emisión" }, { name: "carga_siniestros", title: "Carga Siniestros" }];
</script>
