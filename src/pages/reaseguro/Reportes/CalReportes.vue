<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-card-title class="d-flex align-center">Resumen de Cálculos</v-card-title>

    <v-card elevation="0" outlined class="mt-4">
      <v-card-text>
        <v-form>
          <v-row class="align-center justify-center">
            <v-col cols="12" md="4">
              <v-select v-model="tipoReporteSeleccionado" :items="opcionesReporte" item-title="label" item-value="value"
                label="Tipo de resumen a generar" variant="solo-filled" hide-details />
            </v-col>

            <v-col cols="12" md="2">
              <v-btn block color="primary" height="56" :loading="block" :disabled="!tipoReporteSeleccionado"
                @click="ejecutarGeneracion">
                Generar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-6" elevation="0" outlined>
      <v-tabs v-model="tab" bg-color="transparent" color="primary" grow>
        <v-tab value="PRIMAS">Resumen de Primas</v-tab>
        <v-tab value="SINIESTROS">Resumen de Siniestros</v-tab>
      </v-tabs>

      <v-divider />

      <v-data-table :headers="headers" :items="reportesFiltrados" :loading="queryHistory.isLoading.value || block"
        class="elevation-1">
        <template #item.actions="{ item }">
          <div class="d-flex ga-2" >
            <v-icon color="primary" size="large" @click="descargarItem(item)">
              mdi-download
            </v-icon>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useResumenCalculos } from "@/composables/reaseguro/Reportes/Resumen/useResumenCalculos";

const breadcrumbs = ["Reaseguro", "Reportes", "Cálculo"];

const {
  tab,
  tipoReporteSeleccionado,
  opcionesReporte,
  queryHistory,
  headers,
  block,
  reportesFiltrados,
  descargarItem,
  ejecutarGeneracion
} = useResumenCalculos();
</script>
