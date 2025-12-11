<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Daños', 'Proporcional', 'Nuevo contrato']" />
    <v-card-title class="d-flex align-center">
      Modificar Contrato Vida
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-data-table>
      <v-data-table :headers="headers" hide-default-footer :items="items">
        <template #item.actions="{ item }">
          <v-icon
            class="edit"
            size="large"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            class="delete"
            size="large"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-data-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const headers = [
    { title: 'Subramo', value: 'subramo', align: 'center' },
    { title: 'Forma contractual', value: 'formaContractual', align: 'center' },
    { title: 'Identificador del contrato', value: 'idContrato', align: 'center' },
    { title: 'Fecha inicio contrato', value: 'fechaInicioC', align: 'center' },
    { title: 'Fecha fin contrato', value: 'fechaFinC', align: 'center' },
    { title: 'Contrato prorrogado', value: 'contratoPror', align: 'center' },
    { title: 'Fecha prorroga', value: 'fechaPro', align: 'center' },
    { title: 'Activo', value: 'activo', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
