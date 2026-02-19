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
              @update:modelValue="llenarCampos"
            />
          </v-col>

          <v-col cols="12" md="3">
            <!--Formato dd/mm/aaaa-->
            <v-date-input
              v-model="fechaInicio"
              label="Fecha inicio"
              variant="solo-filled"
              readonly
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-date-input
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
        <template>
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
        <template>
        </template>
      </v-data-table>

    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CalcularSiniestros, type IdContrato } from './Data/CalculoPrimasSiniestrosPtu.actions'
import { ValidacionesCalculos } from './Data/Validaciones.actions'
import { format, parseISO } from 'date-fns';


const idContratoObj = ref<IdContrato | null>(null);

type NewType = Date;

const fechaInicio = ref<NewType | null>(null)
const fechaFin = ref<Date | null>(null)

const {
  idContratoOptions, fetchIdContratos,
} = CalcularSiniestros()

onMounted(async () => {
  await Promise.all([
    fetchIdContratos()
  ])
})

const normalizarFecha = (fecha: string | undefined | null): string => {
    if (!fecha) return ''
    return format(parseISO(fecha), 'dd/MM/yyyy');
    //return new Date(fecha).toISOString().split('T')[0] ?? ''
  }

const llenarCampos = (contrato: IdContrato | null) => {
  /*if (contrato) {
    fechaInicio.value = normalizarFecha(contrato.fechaInicioContrato as unknown as string);
    fechaFin.value = normalizarFecha(contrato.fechaFinContrato as unknown as string);
  } else {
    fechaInicio.value = null;
    fechaFin.value = null;
  }*/
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
