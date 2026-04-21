<template>
  <v-card-text>
    <v-row class="d-flex justify-end">
      <v-col cols="4">
        <v-text-field
          v-model="search"
          class="search"
          density="compact"
          hide-details
          label="Buscar catálogo"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-card-text>
      <v-data-table
        class="mt-4"
        :headers="headers"
        :items="catalogos"
        :search="search"
        striped="odd"
      >
        <template #top>
          <v-toolbar class="encabezado" flat>
            <v-toolbar-title class="text-secondary">Bitácora de cátalogos</v-toolbar-title>
          </v-toolbar>
          <br>
        </template>

        <template>
          <v-icon class="mr-2" size="small">
            mdi-pencil
          </v-icon>
          <v-icon size="small">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card-text>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useCatalogos } from '@/composables/administracion/useCatalogos'

  const { search, catalogos, headers } = useCatalogos()

  </script>
