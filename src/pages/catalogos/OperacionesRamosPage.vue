<template>
  <div>
    <v-breadcrumbs :items="['Catálogos', 'Operaciones Ramos']" />
    <v-card-title class="d-flex align-center">
      Operaciones Ramos
    </v-card-title>

    <v-card-text>
      <v-row class="d-flex justify-end">
        <v-col cols="4">
          <v-text-field
            v-model="search"
            class="search"
            density="compact"
            hide-details
            label="Buscar operación ramo"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
        </v-col>
      </v-row>
      <v-data-table
        class="mt-4"
        :headers="headers"
        :items="OperacionesRamos"
        :search="search"
        striped="odd"
      >
        <template #top>
          <v-toolbar class="encabezado" flat>
            <v-toolbar-title>Lista de operaciones ramos</v-toolbar-title>
            <v-spacer />
            <v-btn class="btn-agregar" prepend-icon="mdi-plus">
              Agregar
            </v-btn>
          </v-toolbar>
          <br>
        </template>

        <template #item.actions="{ item }">
          <v-icon class="edit" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon class="delete" size="small" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>

<script setup>
  import { useOperacionesRamos } from '@/composables/catalogos/useOperacionesRamos'
  import { useSearch } from '@/composables/catalogos/useSearch'

  const { headers, OperacionesRamos } = useOperacionesRamos()
  const { search } = useSearch()

  function editItem (item) {
    console.log('Editar:', item)
  }

  function deleteItem (item) {
    console.log('Eliminar:', item)
  }
</script>
