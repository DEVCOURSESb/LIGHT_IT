<template>
  <div>
    <v-breadcrumbs :items="['Administración', 'Bitácora']" />
    <v-card-title class="d-flex align-center">
      Bitácora
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">
        Catálogos
      </v-tab>
      <v-tab value="tab-2">
        Contratos de reaseguro
      </v-tab>
      <v-tab value="tab-3">
        Cálculos
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <CatalogosPage />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text>
            <ContratosReasegPage />
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

<script lang="ts" setup>
  import { ref } from 'vue'
  import CatalogosPage from '@/pages/administracion/CatalogosPage.vue'
  import CalculosPage from './CalculosPage.vue'
  import ContratosReasegPage from './ContratosReasegPage.vue'

  const activeTab = ref('tab-1')

</script>
