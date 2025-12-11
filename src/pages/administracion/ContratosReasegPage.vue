<template>
  <v-card-text>
    <v-row class="d-flex justify-end">
      <v-col cols="4">
        <v-text-field
          v-model="search"
          class="search"
          density="compact"
          hide-details
          label="Buscar contrato de reaseguro"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-data-table
      class="mt-4"
      :headers="headers"
      :items="contrato"
      :search="search"
      striped="odd"
    >
      <template #top>
        <v-toolbar class="encabezado" flat>
          <v-toolbar-title>Bitácora de contratos de reaseguro</v-toolbar-title>
          <v-spacer />
          <v-btn class="btn-agregar" @click="dialog = true">
            + Nuevo
          </v-btn>
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

<script setup>
  import { ref } from 'vue'
  import { useContratosReaseguro } from '@/composables/administracion/useContratosReaseguro'

  const { search, contrato, headers } = useContratosReaseguro()
  const dialog = ref(false)

  function editItem (item) {
    console.log('Editar:', item)
  }

</script>
