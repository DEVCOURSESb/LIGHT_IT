<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">General</v-tab>

      <v-tab value="tab-2">Coberturas</v-tab>

      <v-tab v-if="mostrarComisionEscalonada" value="tab-3">
        Comisión Escalonada
      </v-tab>

      <v-tab value="tab-4">
        PTU
      </v-tab>

      <v-tab value="tab-5">
        Reaseguradores
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text><FormConfigReasegGeneralPageM @on-save-complete="() => activeTab = 'tab-2'" /></v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text><FormConfigReasegCoberturaPageM @on-save-complete="() => activeTab = mostrarComisionEscalonada ? 'tab-3' : 'tab-4'" /></v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item v-if="mostrarComisionEscalonada" value="tab-3">
        <v-card flat>
          <v-card-text><FormConfigReasegComisionEsPageM @on-save-complete="() => activeTab = 'tab-4'" /></v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-4">
        <v-card flat>
          <!-- emit -->
          <v-card-text><FormConfigReasegPTUPageM @on-not-fully-participation="() => activeTab = 'tab-1'" @on-full-participation="() => activeTab = 'tab-5'" /></v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-5">
        <v-card flat>
          <v-card-text><ResumenReaseguradoresPageM /></v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useContratoStore } from '@/stores/contratoStore'
import FormConfigReasegCoberturaPageM from './FormConfigReasegCoberturaPageM.vue'
import FormConfigReasegComisionEsPageM from './FormConfigReasegComisionEsPageM.vue'
import FormConfigReasegGeneralPageM from './FormConfigReasegGeneralPageM.vue'
import FormConfigReasegPTUPageM from './FormConfigReasegPTUPageM.vue'
import ResumenReaseguradoresPageM from './ResumenReaseguradoresPageM.vue'

const contratoStore = useContratoStore()
const activeTab = ref('tab-1')


const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

const mostrarComisionEscalonada = computed(() => {
  const tipo = contratoStore.configReaseg?.tipoComision
  return getID(tipo) == 2
})


watch(mostrarComisionEscalonada, (isVisible) => {
  if (!isVisible && activeTab.value === 'tab-3') {
    activeTab.value = 'tab-1'
  }
})
</script>
