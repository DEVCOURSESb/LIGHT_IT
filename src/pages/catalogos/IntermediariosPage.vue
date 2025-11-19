<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" icon="mdi-account-multiple" />
        Intermediarios
      </v-card-title>

      <v-card-text>
        <SearchComponent search-iniinitial-value-search="search" @on-write="setSearch" />

        <v-data-table
          class="mt-4"
          :headers="headers"
          :items="intermediarios"
          :search="search"
          striped="odd"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Intermediarios</v-toolbar-title>
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus">
                Agregar
              </v-btn>
            </v-toolbar>
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
    </v-card>
  </div>
</template>

<script setup>
  import SearchComponent from '@/components/catalogos/SearchComponent.vue'
  import { useIntermediarios } from '@/composables/catalogos/useIntermediarios'
  import { useSearch } from '@/composables/catalogos/useSearch'

  const { headers, intermediarios } = useIntermediarios()
  const { search, setSearch } = useSearch()

  function editItem (item) {
    console.log('Editar:', item)
  }

  function deleteItem (item) {
    console.log('Eliminar:', item)
  }
</script>
