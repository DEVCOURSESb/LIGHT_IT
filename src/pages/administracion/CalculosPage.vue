<template>
  <v-card-text>
    <v-row class="d-flex justify-end">
      <v-col cols="4">
        <v-text-field
          v-model="search"
          class="search"
          density="compact"
          hide-details
          label="Buscar cálculo"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
    </v-row>
    <v-data-table
      class="mt-4"
      :headers="headers"
      :items="reaseguradores"
      :search="search"
      striped="odd"
    >
      <template #top>
        <v-toolbar class="encabezado" flat>
          <v-toolbar-title>Bitácora de cálculos</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
      </template>

      <template #item.actions="{ item }">
        <v-icon class="edit" @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useReaseguradores } from '@/composables/catalogos/useReaseguradores'

  const { search, reaseguradores, headers } = useReaseguradores()
  const dialog = ref(false)

  function editItem (item) {
    console.log('Editar:', item)
  }

  function deleteItem (item) {
    console.log('Eliminar:', item)
  }
</script>
