<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-account-multiple" class="mr-2" />
        Intermediarios
      </v-card-title>
      
      <v-card-text>
        <SearchComponent searchIniinitialValueSearch="search" @on-write="setSearch" />

        <v-data-table
          :headers="headers"
          :items="intermediarios"
          :search="search"
          class="mt-4"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Intermediarios</v-toolbar-title>
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
import SearchComponent from '@/components/catalogos/SearchComponent.vue';
import { useIntermediarios } from '@/composables/catalogos/useIntermediarios';
import { useSearch } from '@/composables/catalogos/useSearch';


const { headers, intermediarios } = useIntermediarios();
const { search, setSearch } = useSearch();

const editItem = (item) => {
    console.log("Editar:", item);
  };

  const deleteItem = (item) => {
    console.log("Eliminar:", item);
  };
</script>