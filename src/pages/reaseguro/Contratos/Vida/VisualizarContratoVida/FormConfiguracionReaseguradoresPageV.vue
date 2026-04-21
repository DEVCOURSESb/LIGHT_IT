<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">
        Reaseguradores
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">

      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text><ResumenReaseguradoresPageV /></v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useContratoStore } from '@/stores/reaseguro/contratos/vidaStore'
import ResumenReaseguradoresPageV from './ResumenReaseguradoresPageV.vue'

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
