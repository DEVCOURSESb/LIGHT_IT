<template>
  <v-breadcrumbs
    class="mb-4"
    :items="breadcrumbs"
  />
  <v-card-title class="d-flex align-center">
    Cálculo de Siniestros Vida
  </v-card-title>

  <v-card class="mt-4" elevation="0" outlined>
    <v-card-title>
      <v-form ref="formRef">
        <v-row align="center" justify="center" class="mb-4">
          <v-col cols="12" md="3">
            <!--En este falta meter una condición que vaya a BD y busque la
            fecha del primer registro de cálculo echo y en base a ello bloquear
            fechas anteriores a esa fecha -->
            <v-date-input
              v-model="fechaCalculo"
              label="Fecha de evaluación"
              variant="solo-filled"
              clearable
              required
              hint="Por defecto: último día del mes."
              persist-hint
            />
          </v-col>
          <v-col cols="12" md="2" class="title-center">
            <v-btn class="btn-guardar" @click="calcularSiniestros" :disabled="block">
                Calcular
              </v-btn>
          </v-col>
        </v-row>
      </v-form>
        <v-divider class="mb-4" />

        <div class="mb-2">
          <h6>Historico de Siniestros</h6>
          <v-label>Si se ingresa una fecha menor a 31/12/2025 no guardara datos a la tabla a pesar de que marque que si se realizo el cálculo</v-label>
        </div>
        <v-data-table
          :headers="headers"
          :items="queryHistory.data.value || []"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.fechaRegistro="{ item }">
            {{ normalizarFecha(item.fechaRegistro) }}
          </template>

          <template #item.fechaCalculo="{ item }">
            {{ formatDate(item.fechaEvaluacion) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn icon color="blue" variant="text" size="medium" @click="descargarItem(item)">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn icon color="red" variant="text" size="medium" @click="deleteCalculo(item.fechaEvaluacion)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { useCalculoVidaSiniestros } from "@/composables/reaseguro/calculos/vida/useCalculoVidaSiniestros";
import { formatDate } from "@/utils/formatDate";
import { format, parseISO } from "date-fns";


const normalizarFecha = (fecha: string | Date | undefined | null): string => {
  if (!fecha) return '';
  const objetoFecha = fecha instanceof Date ? fecha : parseISO(fecha);
  return format(objetoFecha, 'yyyy-MM-dd');
}

const breadcrumbs = ["Reaseguro", "Cálculos", "Vida", "Siniestros"];

const {
  fechaCalculo,
  headers,
  calcularSiniestros,
  descargarItem,
  deleteCalculo,
  queryHistory,
  block,
} = useCalculoVidaSiniestros();
</script>
