<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">General</v-tab>

      <v-tab value="tab-2" v-if="esFacultativo">Pólizas Facultativas</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <FormGeneralDatosPage @actualizarFormaContractual="actualizarFormaContractual" />
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-2" v-if="esFacultativo">
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

<script lang="ts" setup>
import { ref } from 'vue'
import FormGeneralDatosPage from './FormGeneralDatosPage.vue'
import FormPolizasFacultativasPage from './FormPolizasFacultativasPage.vue'

const activeTab = ref('tab-1')

const esFacultativo = ref(false)

const actualizarFormaContractual = (valor: number) => {
  esFacultativo.value = valor === 1
}

</script>
