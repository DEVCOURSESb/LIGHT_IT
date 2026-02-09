<template>
  <v-breadcrumbs
    class="mb-4"
    :items="['Reaseguro', 'Cálculos', 'Vida', 'Siniestros']"
  />
  <v-card-title class="d-flex align-center">
    Cálculo de PTU y Comisión Escalonada
  </v-card-title>

  <v-card class="mt-4" elevation="0" outlined>
    <v-card-title>
      <v-form ref="formRef">
        <v-row align="center" justify="center" class="mb-4">
          <v-col cols="12" md="3">
            <v-select
              v-model="idContratoObj"
              :items="idContratoOptions"
              label="Identificador del Contrato"
              :rules="[ValidacionesCalculos.idContrato()]"
              chips
              return-object
              variant="solo-filled"
              clearable
              required
              @update:model-value="llenarCampos"
            />
          </v-col>

          <v-col cols="12" md="3">
            <!--Formato dd/mm/aaaa-->
            <v-text-field
              v-model="fechaInicio"
              label="Fecha inicio"
              variant="solo-filled"
              readonly
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="fechaFin"
              label="Fecha fin"
              variant="solo-filled"
              readonly
            />
          </v-col>

          <v-col cols="8" md="2" class="title-center">
            <v-btn
              size="small"
              class="btn-guardar"
            >
              Calcular
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-divider class="mb-4" />

      <div class="mb-2">
        <h6>Datos del contrato seleccionado</h6>
      </div>

      <v-data-table
        :headers="headers"
        class="elevation-1"
        hide-default-footer
      >
        <template #item.acciones="{ item, index }">
        </template>
      </v-data-table>

      <v-divider class="mb-8"/>
      <div class="mb-2">
        <h6>PTUs calculados</h6>
      </div>

      <v-data-table
        :headers="headers1"
        class="elevation-1"
        hide-default-footer
      >
        <template #item.acciones="{ item, index }">
        </template>
      </v-data-table>

    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CalcularSiniestros, type IdContrato } from './Data/CalculoPrimasSiniestrosPtu.actions'
import { ValidacionesCalculos } from './Data/Validaciones.actions'

const formRef = ref()

const idContratoObj = ref<IdContrato | null>(null);

const fechaInicio = ref<Date | null>(null)
const fechaFin = ref<Date | null>(null)

const normalizarFecha = (fecha: string | undefined | null): string => {
  if (!fecha) return ''
  return new Date(fecha).toISOString().split(' ')[0] ?? ''
}


const {
  idContratoOptions, fetchIdContratos,
} = CalcularSiniestros()

onMounted(async () => {
  await Promise.all([
    fetchIdContratos()
  ])
})
// no se estan llenando correctamente los campos de fecha inicio y fin
const llenarCampos = (contrato: IdContrato) => {
  if (contrato) {
    // es que el formato de fecha en bd para ambos casos es asi: 2026-01-05 00:00:00.000,
    // pero solo debe traer la primera parte y no los contadores de miles
    fechaInicio.value = contrato.fechaInicioContrato;
    fechaFin.value = contrato.fechaFinContrato;
  } else {
    fechaInicio.value = null;
    fechaFin.value = null;
  }
};


const headers = ref([
  { title: 'Identificador de contrato', key: 'idContrato' },
  { title: 'Fecha inicio contrato', key: 'fechaIniC' },
  { title: 'Fecha fin contrato', key: 'fechaFinC' },
  { title: 'Fecha fin prorroga', key: 'fechaFinP'},
  { title: 'Fecha de cancelación', key: 'fechaCancel'},
])

const headers1 = ref([
  { title: 'Identificador de contrato', key: 'idContrato' },
  { title: 'Fecha inicio cálculo', key: 'fechaIniCal' },
  { title: 'Fecha fin cálculo', key: 'fechaFinCal' },
  { title: 'Acciones', key: 'acciones', sortable: false },
])
</script>
