<template>
  <v-breadcrumbs :items="['Reaseguro', 'Configuración de tarifas', nombreArchivoVisual || 'Detalle']" />
  <br>
  <v-btn rounded="xl" to="/reaseguro/configuracion_tarifas" variant="text">
    <v-icon start>mdi-arrow-left</v-icon>
    Volver
  </v-btn>
  <br>

  <v-card-title class="d-flex align-center">
    Configuración de Tarifas - {{ nombreArchivoVisual || 'Cargando...' }}
  </v-card-title>

  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers2"
        :items="itemsDetalle"
        :loading="cargando"
        class="elevation-1"
        no-data-text="No se encontraron registros para este archivo"
      >
        <template #item.acciones="{ item }">
          <v-btn icon color="blue" variant="text" size="small">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" variant="text" size="small">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-row justify="center" class="mt-5">
    <v-btn class="btn-guardar" color="primary" @click="guardarEnBD">
      Guardar cambios
    </v-btn>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { DialogType, useDialog } from "@/stores/dialogStore"
import { AuthStore } from '@/stores/authStore'
import { BaseAPI } from '@/API/BaseAPI'

const route = useRoute()
const dialog = useDialog()
const authStore = AuthStore()

const itemsDetalle = ref<any[]>([])
const cargando = ref(false)
const nombreArchivoVisual = ref<string>('')

const apiConfigTarifa = BaseAPI({
  prefix: 'ws_configuracion_tarifas_reaseg/api/v1/ReasegTipoTarifaPropiaRest',
  isBase: true,
  isPrivate: true
});

const headers2 = [
  { title: 'Edad', key: 'edad' },
  { title: 'Género', key: 'genero' },
  { title: 'Fumador', key: 'fumadorTexto' },
  { title: 'Prima de riesgo', key: 'primaRiesgo' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const cargarDetalles = async () => {
  cargando.value = true;
  try {
    const response = await apiConfigTarifa.post('getAllRecords', {});

    if (response.data && Array.isArray(response.data)) {
      const filtro = nombreArchivoVisual.value;

      console.log("Nombre para filtrar:", filtro);
      console.log("Total registros recibidos:", response.data.length);

      const filtrados = response.data.filter((reg: any) => reg.nombreArchivo === filtro);

      itemsDetalle.value = filtrados.map((reg: any) => ({
        ...reg,
        fumadorTexto: reg.fumador === 0 ? 'SÍ' : 'NO'
      }));
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  const nombreQuery = route.query.nombre as string;

  if (nombreQuery) {
    nombreArchivoVisual.value = nombreQuery;
    cargarDetalles();
  } else {
    console.error("No se encontró el parámetro 'nombre' en la URL. Asegúrate de pasar query: { nombre: ... } en el router.push");
  }
});

const guardarEnBD = async () => {

};
</script>
