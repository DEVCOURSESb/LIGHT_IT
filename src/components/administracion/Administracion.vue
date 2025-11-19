<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text">
        Administración
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="i in 1" :key="i" link>
        <v-list-item-title>Usuario</v-list-item-title>
      </v-list-item>
      <v-list-item v-for="i in 1" :key="i" link>
        <v-list-item-title>Perfiles</v-list-item-title>
      </v-list-item>
      <v-list-item v-for="i in 1" :key="i" link>
        <v-list-item-title>Bitácora</v-list-item-title>
        <template #append>
          <v-icon icon="mdi-menu-right" size="x-small" />
        </template>

        <v-menu activator="parent" :open-on-focus="false" open-on-hover submenu>
          <v-list>
            <v-list-item v-for="j in 1" :key="j" link>
              <v-list-item-title>Catálogo Operaciones</v-list-item-title>
            </v-list-item>
            <v-list-item v-for="j in 1" :key="j" link>
              <v-list-item-title>Histórico bitácora</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>

</script>
