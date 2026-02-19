<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Vida', 'Modificar contrato', nombreContrato ]" />
    <br>
    <v-btn color="blue" rounded="xl" to="/reaseguro/contratos/vida/modificarContratoVida" variant="text">
      <v-icon start>mdi-arrow-left</v-icon>
      Volver
    </v-btn>
    <br>
    <v-card-title class="d-flex align-center">
      Modificar Contrato Vida {{ nombreContrato || 'Cargando...' }}
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
            <FormDatosPageM :datos="nombreContrato" />
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
            <FormConfiguracionReaseguradoresPageM :datos="nombreContrato"/>
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
            <FormConfiguracionIntermediariosPageM :datos="nombreContrato" />
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>
    </div>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import FormDatosPageM from './FormDatosPageM.vue'
  import FormConfiguracionIntermediariosPageM from './FormConfiguracionIntermediariosPageM.vue'
  import FormConfiguracionReaseguradoresPageM from './FormConfiguracionReaseguradoresPageM.vue'
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
