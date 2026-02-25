<template>
  <v-data-table :headers="headers1" class="elevation-1 mt-4" hide-default-footer />
</template>

<script lang="ts" setup>
import { NuevoContratoVida } from '@/pages/reaseguro/Contratos/Vida/NuevoContratoVida/NuevoContratoDG.actions'
import { BaseAPI } from '@/API/BaseAPI'
import { onMounted, ref } from 'vue';

const apiPolizasFacultativas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/PolizasFacultativasRest', isBase: true, isPrivate: true });

const { fetchEmisionContable } = NuevoContratoVida()

const headers1 = [
  { title: 'Póliza', key: 'poliza' },
  { title: 'Renovación', key: 'renovacion' },
]

const polizasFacultativasTabla = ref<any[]>([])

const cargarPolizasFacultativas = async () => {
  try {
    const response = await apiPolizasFacultativas.post('getAllRecords', {});
    if (response.data && Array.isArray(response.data)) {
      polizasFacultativasTabla.value = response.data.map((item: any) => ({
        ...item,
        display: {
          poliza: item.cvePoliza,
          renovacion: item.renovacion ? 'Sí' : 'No'
        }
      }));
    }
  } catch (error) {
    console.error("Error al cargar pólizas facultativas:", error);
  }
};
onMounted(async () => {
  await Promise.all([
    cargarPolizasFacultativas()
  ])
})
</script>
