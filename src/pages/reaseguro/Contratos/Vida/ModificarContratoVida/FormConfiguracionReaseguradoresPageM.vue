<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">
        General
      </v-tab>
      <v-tab value="tab-2">
        Coberturas
      </v-tab>
      <v-tab value="tab-3">
        Comisión Escalonada
      </v-tab>
      <v-tab value="tab-4">
        PTU
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <FormConfigReasegGeneralPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text>
            <FormConfigReasegCoberturaPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-card flat>
          <v-card-text>
            <FormConfigReasegComisionEsPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-4">
        <v-card flat>
          <v-card-text>
            <FormConfigReasegPTUPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import FormConfigReasegCoberturaPageM from './FormConfigReasegCoberturaPageM.vue'
  import FormConfigReasegComisionEsPageM from './FormConfigReasegComisionEsPageM.vue'
  import FormConfigReasegGeneralPageM from './FormConfigReasegGeneralPageM.vue'
  import FormConfigReasegPTUPageM from './FormConfigReasegPTUPageM.vue'

  const activeTab = ref('tab-1')
</script>
