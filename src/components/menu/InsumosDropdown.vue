<template>
  <menu-submenus-component
    :list-items="listItems"
    prefix-path="insumos"
    menu-title="Insumos"
  />
</template>

<script setup lang="ts">
const listItems = [{ name: "cifras_control", title: "Cifras control" }];
</script>
