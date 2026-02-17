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
            <FormDatosPageM :datos="datosContratoProcesados" />
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
            <FormConfiguracionReaseguradoresPageM />
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
            <FormConfiguracionIntermediariosPageM />
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

  const trip = ref({
    name: '',
  })
  
  const route = useRoute()
  const cargando = ref(false)
  const nombreContrato = ref<string>('')
  const itemsDetalle = ref<any[]>([])
  const datosContratoProcesados = ref<any>(null)


  const apiDatosContrato = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest', isBase: true, isPrivate: true });

  const cargarDetalles = async () => {
    cargando.value = true;
    try {
      const response = await apiDatosContrato.post('getAllRecords', {});
      if (response.data && Array.isArray(response.data)) {
        const filtro = nombreContrato.value;
        const filtrados = response.data.filter((reg: any) => reg.nombreArchivo === filtro);

        itemsDetalle.value = filtrados.map((reg: any) => ({
          ...reg,
          idInterno: reg.id || reg.cveTarifa || Math.random(),
          fumadorTexto: reg.fumador === 1 ? 'S' : 'N'
        }));
      }
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    } finally {
      cargando.value = false;
    }
  };

  onMounted(() => {
    const nombreQuery = route.query.nombre as string;
    if (nombreQuery) {
      nombreContrato.value = nombreQuery;
      cargarDetalles();
    }
  });

</script>
