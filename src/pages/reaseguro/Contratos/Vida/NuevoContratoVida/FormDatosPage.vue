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
            <FormGeneralDatosPage />
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="tab-2">
        <v-card flat>
          <v-card-text>
            <FormPolizasFacultativasPage />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  import FormGeneralDatosPage from './FormGeneralDatosPage.vue'
  import FormPolizasFacultativasPage from './FormPolizasFacultativasPage.vue'

  const activeTab = ref('tab-1')
</script>
