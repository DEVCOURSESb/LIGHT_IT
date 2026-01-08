<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Vida', 'Nuevo contrato']" />
    <v-card-title class="d-flex align-center">
      Nuevo Contrato Vida
    </v-card-title>
    <v-spacer class="mb-4" />
    <!--<div class="d-flex ga-2 align-center">
        <v-progress-linear
          v-model="value"
          chunk-count="5"
          chunk-gap="9"
          color="blue"
          height="25"
          rounded="sm"
          clickable
        >
          <small class="text-white">{{ value.toFixed() }}%</small>
        </v-progress-linear>
        <v-btn icon="mdi-skip-previous" size="x-small" @click="value = 0"></v-btn>
        <v-btn icon="$complete" size="x-small" @click="value = 100"></v-btn>
    </div>-->
    <br>
    <div>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="">
              <v-row no-gutters>
                <v-col class="d-flex justify-start text-h6" cols="4">
                  Datos
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormDatosPage />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="">
              <v-row no-gutters>
                <v-col class="d-flex justify-start text-h6" cols="4">
                  Configuración de Reaseguradores
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormConfiguracionReaseguradoresPage />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="">
              <v-row no-gutters>
                <v-col class="d-flex justify-start text-h6" cols="4">
                  Configuración de Intermediarios
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormConfiguracionIntermediariosPage />
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>
    </div>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { shallowRef } from 'vue'
  const value = shallowRef(0)

  import FormConfiguracionIntermediariosPage from './NuevoContratoVida/FormConfiguracionIntermediariosPage.vue'
  import FormConfiguracionReaseguradoresPage from './NuevoContratoVida/FormConfiguracionReaseguradoresPage.vue'
  import FormDatosPage from './NuevoContratoVida/FormDatosPage.vue'

  const trip = ref({
    name: '',
  })
</script>
