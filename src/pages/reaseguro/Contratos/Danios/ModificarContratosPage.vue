<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Daños', 'Proporcional', 'Modificar contrato']" />
    <v-card-title class="d-flex align-center">
      Modificar Contrato
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-data-table>
      <v-data-table :headers="headers" hide-default-footer  />
    </v-data-table>
    <v-btn @click="modificarConId">Modificar</v-btn>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router';
import { ref } from 'vue'

  const headers = [
    { title: 'Fecha de creación del contrato',  key: 'idContrato' },
    { title: 'Identificador del contrato',  key: 'idContrato' },
    { title: 'Fecha inicio contrato',  key: 'fechaInicioC' },
    { title: 'Fecha fin contrato',  key: 'fechaFinC' },
    { title: '¿Contrato prorrogado?',  key: 'contratoPror' },
    { title: 'Fecha fin prorroga',  key: 'fechaFinPro' },
    { title: '¿Contrato cancelado?',  key: 'contratoCancelado' },
    { title: 'Fecha de cancelación',  key: 'fechaCancelacion' },
    { title: 'Negocios cubiertos',  key: 'montoCorreFijo' },
    { title: 'Activo',  key: 'activo' },
    { title: 'Editar',  key: 'editar' },
  ]

  function modificarConId() {
    router.push('/reaseguro/contratosReaseguro/modificarContratoId')
  }
</script>
