<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Daños', 'Proporcional', 'Modificar contrato', 'ID_CONTRATO']" />
    <v-card-title class="d-flex align-center">
      Modificar Contrato [ID CONTRATO]
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
      <v-tab value="tab-4">
        Coberturas
      </v-tab>
      <v-tab value="tab-5">
        Comisiones
      </v-tab>
      <v-tab value="tab-6">
        Intermediarios
      </v-tab>
      <v-tab value="tab-7">
        Corretaje
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <FormGeneralesPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text>
            <FormDetallesPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-card flat>
          <v-card-text>
            <FormReaseguradoresPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-4">
        <v-card flat>
          <v-card-text>
            <FormCoberturasPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-5">
        <v-card flat>
          <v-card-text>
            <FormComisionesPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-6">
        <v-card flat>
          <v-card-text>
            <FormIntermediariosPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-7">
        <v-card flat>
          <v-card-text>
            <FormCorretajePageM />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import FormCoberturasPageM from './FormCoberturasPageM.vue'
  import FormComisionesPageM from './FormComisionesPageM.vue'
  import FormCorretajePageM from './FormCorretajePageM.vue'
  import FormDetallesPageM from './FormDetallesPageM.vue'
  import FormGeneralesPageM from './FormGeneralesPageM.vue'
  import FormIntermediariosPageM from './FormIntermediariosPageM.vue'
  import FormReaseguradoresPageM from './FormReaseguradoresPageM.vue'

  const activeTab = ref('tab-1')
</script>
