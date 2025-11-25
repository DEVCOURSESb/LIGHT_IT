<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text">
        Administración
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="item in listItems" :key="item.name" :prepend-icon="item.icon" :to="`/administracion/${item.name}`">
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  interface ListItem {
    name: string
    title: string
  }

  const listItems: ListItem[] = [
    { name: 'bitacora', title: 'Bitácora' },
  ]
</script>
