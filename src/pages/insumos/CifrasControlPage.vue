<!-- pages/insumos/cifras/CifrasControlPage.vue -->
<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-card-text>
      <!-- Título principal -->
      <v-row class="w-100">
        <v-col cols="12" class="d-flex align-center justify-center">
          <h1>Cifras Control</h1>
        </v-col>
      </v-row>

      <!-- Tabla de Cifras Control Emisión -->
      <v-card class="mt-4" elevation="0" outlined>
        <v-toolbar class="encabezado" flat>
          <v-toolbar-title class="text-secondary">Cifras Control Emisión</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            size="small"
            @click="cargarCifrasEmision"
            :loading="loadingEmision"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>

        <v-data-table
          :headers="headersEmision"
          :items="cifrasEmision"
          :loading="loadingEmision"
          striped="odd"
          class="elevation-0"
        >
          <template #no-data>
            <div class="text-center py-6">
              <v-icon size="64" color="grey">mdi-chart-bar</v-icon>
              <p class="text-grey mt-2">No hay datos de cifras de emisión</p>
            </div>
          </template>

          <template #item.anio="{ item }">
            <span class="font-weight-medium">{{ formatearPeriodo(`${item.anio}\\${item.mes}`) }}</span>
          </template>

          <template #item.ramo="{ item }">
            <span class="font-weight-medium">{{ item.ramo }}</span>
          </template>

          <template #item.registros="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              {{ formatearNumero(item.registros) }}
            </v-chip>
          </template>

          <template #item.primaNetaEmitida="{ item }">
            <span class="text-success font-weight-bold">
              {{ formatearMoneda(item.primaNetaEmitida) }}
            </span>
          </template>

        </v-data-table>
      </v-card>

      <!-- Tabla de Cifras Control Siniestros -->
      <v-card class="mt-4" elevation="0" outlined>
        <v-toolbar class="encabezado" flat>
          <v-toolbar-title class="text-secondary">Cifras Control Siniestros</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            size="small"
            @click="cargarCifrasSiniestros"
            :loading="loadingSiniestros"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>

        <v-data-table
          :headers="headersSiniestros"
          :items="cifrasSiniestros"
          :loading="loadingSiniestros"
          striped="odd"
          class="elevation-0"
        >
          <template #no-data>
            <div class="text-center py-6">
              <v-icon size="64" color="grey">mdi-chart-line</v-icon>
              <p class="text-grey mt-2">No hay datos de cifras de siniestros</p>
            </div>
          </template>

          <template #item.aniomesCarga="{ item }">
            <span class="font-weight-medium">{{ formatearPeriodo(item.aniomesCarga) }}</span>
          </template>

          <template #item.rows="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              {{ formatearNumero(item.rows) }}
            </v-chip>
          </template>

          <template #item.indemnizacionPagada="{ item }">
            <span class="text-success font-weight-bold">
              {{ formatearMoneda(item.indemnizacionPagada) }}
            </span>
          </template>

          <template #item.montoSiniestro="{ item }">
            <span class="text-error font-weight-bold">
              {{ formatearMoneda(item.montoSiniestro) }}
            </span>
          </template>
        </v-data-table>
      </v-card>
    </v-card-text>
  </div>
</template>

<script setup lang="ts">
import { useCifrasControl } from "@/composables/cifras/useCifrasControl";
import { mesesAnio } from "@/utils/catalogos/mesesAnio";

// Composable
const {
  cifrasEmision,
  cifrasSiniestros,
  loadingEmision,
  loadingSiniestros,
  cargarCifrasEmision,
  cargarCifrasSiniestros,
} = useCifrasControl();

// Breadcrumbs
const breadcrumbs = ["Insumos", "Cifras Control"];

// Headers de la tabla de emisión
const headersEmision = [
  { title: "PERIODO", key: "anio", align: "start" as const },
  { title: "REGISTROS", key: "registros", align: "center" as const },
  { title: "RAMO", key: "ramo", align: "start" as const },
  { title: "PRIMA Emitida", key: "primaNetaEmitida", align: "end" as const },
];

// Headers de la tabla de siniestros
const headersSiniestros = [
  { title: "PERIODO", key: "aniomesCarga", align: "start" as const },
  { title: "REGISTROS", key: "rows", align: "center" as const },
  { title: "MONTO SINIESTRO", key: "montoSiniestro", align: "end" as const },
  {
    title: "INDEMNIZACIÓN PAGADA",
    key: "indemnizacionPagada",
    align: "end" as const,
  },
];

// Función para formatear periodo (2025\\03 -> Mar 2025)
const formatearPeriodo = (periodo: string): string => {
  // Si es solo año (2019, 2020, etc.)
  if (periodo.length === 4) {
    return periodo;
  }

  // Si tiene formato 2025\\03
  const partes = periodo.split("\\");
  if (partes.length === 2) {
    const anio = partes[0];
    const mes = parseInt(partes[1] || "0");

    const {mesesShort: meses} = mesesAnio();

    const nombreMes = meses[mes - 1] || mes;
    return `${nombreMes} ${anio}`;
  }

  // Si tiene formato 2025-03
  const parteGuion = periodo.split("-");
  if (parteGuion.length === 2) {
    const anio = parteGuion[0];
    const mes = parseInt(parteGuion[1] || "0");

    const {mesesShort: meses} = mesesAnio();

    const nombreMes = meses[mes - 1] || mes;
    return `${nombreMes} ${anio}`;
  }

  return periodo;
};

// Función para formatear números con separadores de miles
const formatearNumero = (num: number): string => {
  return num.toLocaleString("es-MX");
};

// Función para formatear moneda
const formatearMoneda = (num: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

</script>

<style scoped>
.encabezado {
  background-color: #f5f5f5;
}

.text-success {
  color: #4caf50;
}

.text-info {
  color: #2196f3;
}

.text-error {
  color: #f44336;
}
</style>
