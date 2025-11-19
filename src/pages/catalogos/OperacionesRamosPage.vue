<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" icon="mdi-account-multiple" />
        Operaciones Ramos
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="search"
              density="comfortable"
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
            <v-toolbar flat>
              <v-toolbar-title>Lista de operaciones ramos</v-toolbar-title>
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
