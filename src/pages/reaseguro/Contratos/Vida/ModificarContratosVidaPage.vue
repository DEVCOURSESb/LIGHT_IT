<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Daños', 'Proporcional', 'Modificar contrato']" />
    <v-card-title class="d-flex align-center">
      Modificar Contrato Vida
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-data-table>
      <v-data-table :headers="headers" hide-default-footer>
        <template #item.actions="">
          <v-icon
            class="edit"
            size="large"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            class="delete"
            size="large"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-data-table>
    <v-btn @click="modificarConVidaId">Modificar</v-btn>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'

  const headers = [
    { title: 'Subramo',  key: 'subramo' },
    { title: 'Forma contractual',  key: 'formaContractual' },
    { title: 'Identificador del contrato',  key: 'idContrato' },
    { title: 'Fecha inicio contrato',  key: 'fechaInicioC' },
    { title: 'Fecha fin contrato',  key: 'fechaFinC' },
    { title: 'Contrato prorrogado',  key: 'contratoPror' },
    { title: 'Fecha prorroga',  key: 'fechaPro' },
    { title: 'Activo',  key: 'activo' },
    { title: 'Editar',  key: 'editar' },
  ]

  function modificarConVidaId() {
    router.push('/reaseguro/contratosReaseguro/modificarContratoVidaId')
  }
</script>
