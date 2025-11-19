<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text">
        <v-icon start>mdi mdi-account</v-icon>
        Administración
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="item in listItems" :key="item.name" :prepend-icon="item.icon" :to="`/administracion/${item.name}`">
        <v-list-item-title>
          {{ item.title }}
          <v-menu v-if="item.children.length > 0" activator="parent">
            <v-list>
              <v-list-item v-for="child in item.children" :key="child.name" :to="`/bitacora/${child.name}`">
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  interface ListItem {
    name: string
    title: string
    icon: string
    children: ListItem[]
  }

  const listItems: ListItem[] = [
    { name: 'usuario', title: 'Usuario', icon: 'mdi mdi-account-outline', children: [] },
    { name: 'perfiles', title: 'Perfiles', icon: 'mdi mdi-account-box', children: [] },
    { name: 'bitacora', title: 'Bitácora', icon: 'mdi mdi-file-clock', children: [
      { name: 'catalogo_operaciones', title: 'Catálogo Operaciones', icon: 'mdi mdi-text-box-multiple-outline', children: [] },
      { name: 'historico_bitacora', title: 'Histórico bitácora', icon: 'mdi mdi-file-clock', children: [] },
    ] },
  ]
</script>
