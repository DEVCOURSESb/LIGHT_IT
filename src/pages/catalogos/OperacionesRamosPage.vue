<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-account-multiple" class="mr-2" />
        Operaciones Ramos
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar operación ramo"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="OperacionesRamos"
          :search="search"
          class="mt-4"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de operaciones ramos</v-toolbar-title>
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus">
                Agregar
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="mr-2" @click="editItem(item)">
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
import { useOperacionesRamos } from '@/composables/catalogos/useOperacionesRamos';
import { useSearch } from '@/composables/catalogos/useSearch';


const { headers, OperacionesRamos } = useOperacionesRamos();
const { search } = useSearch();

const editItem = (item) => {
    console.log("Editar:", item);
  };

  const deleteItem = (item) => {
    console.log("Eliminar:", item);
  };
</script>