<template>
  <v-data-table :headers="headers" :items="intermediariosTabla" density="compact" class="elevation-1" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { BaseAPI } from '@/API/BaseAPI'

onMounted(() => {
  cargarIntermediarios();
});

const intermediariosTabla = ref<any[]>([])

const apiIntermediarios = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/IntermediariosRest', isBase: true, isPrivate: true });

const headers = [
  { title: 'Asignación', key: 'display.asignacion' },
  { title: 'Reaseguradora', key: 'display.reaseguradora' },
  { title: 'Intermediario / Bróker', key: 'display.broker' },
  { title: 'Tipo Corretaje', key: 'display.tipo' },
  { title: '% Corretaje', key: 'display.corretajeFijo' },
  { title: 'Monto Corretaje', key: 'display.montoCorreFijo' }
]
const cargarIntermediarios = async () => {
  try {
    // falta filtrar por el contrato especifico, se necesita el id del contrato para eso, el cual esta en visualizarContratoVidaPage.vue
    const response = await apiIntermediarios.post('getAllRecords', {});
    if (response.data && Array.isArray(response.data)) {
      intermediariosTabla.value = response.data.map((item: any) => ({
        ...item,
        display: {
          asignacion: item.cveCriterioAsig,
          reaseguradora: item.cveReasegurador,
          broker: item.cveIntermediario,
          tipo: item.cveAsignacion,
          corretajeFijo: item.porcentajeCorretaje + '%',
          montoCorreFijo: item.montoCorretaje ? `$${item.montoCorretaje.toLocaleString()}` : '$0'
        }
      }));
    }
  } catch (error) {
    console.error("Error al cargar intermediarios:", error);
  }
};

</script>
