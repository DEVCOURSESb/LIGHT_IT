<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Nuevo contrato']" />
    <v-card-title class="d-flex align-center">
      Nuevo Contrato
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">
        Generales
      </v-tab>
      <v-tab value="tab-2">
        Detalles
      </v-tab>
      <v-tab value="tab-3">
        Reaseguradores
      </v-tab>
      <v-tab value="tab-3">
        Coberturas
      </v-tab>
      <v-tab value="tab-3">
        Comisiones
      </v-tab>
      <v-tab value="tab-3">
        Intermediarios
      </v-tab>
      <v-tab value="tab-3">
        Corretaje
      </v-tab>
      <v-tab value="tab-3">
        Confirmacion
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <FormGeneralesPage />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text>
            <FormDetallesPage />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-card flat>
          <v-card-text>
            <FormReaseguradoresPage />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-card flat>
          <v-card-text>
            <CalculosPage />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-card flat>
          <v-card-text>
            <CalculosPage />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import FormDetallesPage from './NuevoContrato/FormDetallesPage.vue'
  import FormGeneralesPage from './NuevoContrato/FormGeneralesPage.vue'
  import FormReaseguradoresPage from './NuevoContrato/FormReaseguradoresPage.vue'

  const activeTab = ref('tab-1')
</script>
