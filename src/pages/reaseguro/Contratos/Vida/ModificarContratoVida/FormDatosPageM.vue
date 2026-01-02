<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">
        General
      </v-tab>
      <v-tab value="tab-2">
        Pólizas Facultativas
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <FormGeneralDatosPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text>
            <FormPolizasFacultativasPageM />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import FormGeneralDatosPageM from './FormGeneralDatosPageM.vue'
  import FormPolizasFacultativasPageM from './FormPolizasFacultativasPageM.vue'

  const activeTab = ref('tab-1')
</script>
