<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" icon="mdi-domain" />
        Reaseguradores
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="search"
              density="comfortable"
              hide-details
              label="Buscar reasegurador"
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
            <v-toolbar flat>
              <v-toolbar-title>Lista de Reaseguradores</v-toolbar-title>
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus">
                Agregar
              </v-btn>
            </v-toolbar>
          </template>

          <template #item.actions="{ item }">
            <v-icon class="mr-2" size="small" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
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
