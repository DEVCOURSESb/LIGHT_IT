<template>
  <v-container fluid>
    <v-breadcrumbs
      class="mb-4"
      :items="['Reaseguro', 'Cálculos', 'Vida', 'Siniestros']"
    />
    <v-card elevation="2">
      <v-card-title class="title-h6 font-weight-bold">
        Cálculo de Siniestros Vida
      </v-card-title>

      <v-divider />

      <v-card-title>
        <v-form ref="formRef">
          <v-row align="center" justify="center" class="mb-4">
            <v-col cols="12" md="4">
              <v-select
                v-model="subramoObj"
                :items="subramoOptions"
                label="Subramo"
                multiple
                chips
                return-object
                variant="solo-filled"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-date-input
                v-model="inicioContrato"
                label="Fecha de evaluación"
                variant="solo-filled"
                prepend-inner-icon="$calendar"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="2" class="title-center">
              <v-btn
                color="primary"
                size="large"
                class="mt-md-0 mt-2"
              >
                Calcular
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="mb-4" />

          <div class="title-h6 mb-2">
            Listado de Siniestros
          </div>

          <v-data-table
            :headers="headers1"
            class="elevation-1"
            hide-default-footer
          >
            <template #item.acciones="{ item, index }">
            </template>
          </v-data-table>
        </v-form>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()

const subramoObj = ref<any[]>([])
const inicioContrato = ref<Date | null>(null)

const subramoOptions = ref([
  { title: 'Vida Temporal', key: 'vida_temporal' },
  { title: 'Vida Entera', key: 'vida_entera' },
  { title: 'Mixto', key: 'mixto' },
  { title: 'Dotal', key: 'dotal' },
])

const headers1 = ref([
  { title: 'Subramo', key: 'subramo' },
  { title: 'Fecha de evaluación', key: 'fecha_evaluacion' },
  { title: 'Primas', key: 'primas' },
  { title: 'Acciones', key: 'acciones', sortable: false },
])
</script>
