<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Daños', 'Proporcional', 'Nuevo contrato']" />
    <v-card-title class="d-flex align-center">
      Modificar Contrato
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-data-table>
      <v-data-table :headers="headers" hide-default-footer :items="items" />
    </v-data-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const headers = [
    { title: 'Fecha de creación del contrato', value: 'idContrato', align: 'center' },
    { title: 'Identificador del contrato', value: 'idContrato', align: 'center' },
    { title: 'Fecha inicio contrato', value: 'fechaInicioC', align: 'center' },
    { title: 'Fecha fin contrato', value: 'fechaFinC', align: 'center' },
    { title: '¿Contrato prorrogado?', value: 'contratoPror', align: 'center' },
    { title: 'Fecha fin prorroga', value: 'fechaFinPro', align: 'center' },
    { title: '¿Contrato cancelado?', value: 'contratoCancelado', align: 'center' },
    { title: 'Fecha de cancelación', value: 'fechaCancelacion', align: 'center' },
    { title: 'Negocios cubiertos', value: 'montoCorreFijo', align: 'center' },
    { title: 'Activo', value: 'activo', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
