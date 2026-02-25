<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Vida', 'Visualizar contrato', nombreContrato ]" />
    <br>
    <v-btn color="blue" rounded="xl" to="/reaseguro/contratos/vida/visualizarContratoVida" variant="text">
      <v-icon start>mdi-arrow-left</v-icon>
      Volver
    </v-btn>
    <br>
    <v-card-title class="d-flex align-center">
      Visualizar Contrato Vida {{ nombreContrato || 'Cargando...' }}
    </v-card-title>
    <v-spacer class="mb-4" />
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
            <FormDatosPageV :datos="nombreContrato" />
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
            <FormConfiguracionReaseguradoresPageV :datos="nombreContrato"/>
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
            <FormConfiguracionIntermediariosPageV :datos="nombreContrato" />
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>
    </div>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import FormDatosPageV from './FormDatosPageV.vue'
  import FormConfiguracionIntermediariosPageV from './FormConfiguracionIntermediariosPageV.vue'
  import FormConfiguracionReaseguradoresPageV from './FormConfiguracionReaseguradoresPageV.vue'
  import { BaseAPI } from '@/API/BaseAPI'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const cargando = ref(false)
  const nombreContrato = ref<string>('')

  const cargarDetalles = async () => {
    cargando.value = true;
    nombreContrato.value
  };


  onMounted(() => {
    const nombreQuery = route.query.nombre as string;
    if (nombreQuery) {
      nombreContrato.value = nombreQuery;
      cargarDetalles();
    }
  });

</script>
