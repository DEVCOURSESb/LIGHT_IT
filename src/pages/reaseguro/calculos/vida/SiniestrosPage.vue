<template>
  <v-breadcrumbs
    class="mb-4"
    :items="['Reaseguro', 'Cálculos', 'Vida', 'Siniestros']"
  />
  <v-card-title class="d-flex align-center">
    Cálculo de Siniestros
  </v-card-title>

  <v-card class="mt-4" elevation="0" outlined>
    <v-card-title>
      <v-form ref="formRef">
        <v-row align="center" justify="center" class="mb-4">
          <v-col cols="12" md="3">
            <v-select
              v-model="subramoObj"
              :items="subramoOptions"
              label="Subramo"
              chips
              return-object
              variant="solo-filled"
              clearable
              required
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-date-input
              v-model="fechaEvaluacion"
              label="Fecha de evaluación"
              variant="solo-filled"
              clearable
              required
            />
          </v-col>

          <v-col cols="12" md="2" class="title-center">
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
          <h6>Historico de Siniestros</h6>
        </div>
        <v-data-table
          :headers="headers"
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
import { CalcularSiniestros } from './Data/CalculoPrimasSiniestrosPtu.actions'

const formRef = ref()

const subramoObj = ref<any[]>([])
const fechaEvaluacion = ref<Date | null>(null)

const {
  subramoOptions, fetchSubramos,
} = CalcularSiniestros()

onMounted(async () => {
  await Promise.all([
    fetchSubramos()
  ])
})

const headers = ref([
  { title: 'Subramo', key: 'subramo' },
  { title: 'Fecha de evaluación', key: 'fecha_evaluacion' },
  { title: 'Primas', key: 'primas' },
  { title: 'Acciones', key: 'acciones', sortable: false },
])
</script>
