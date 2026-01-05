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
          <v-toolbar-title>Cifras Control Emisión</v-toolbar-title>
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

          <template #item.aniomesCarga="{ item }">
            <span class="font-weight-medium">{{ formatearPeriodo(item.aniomesCarga) }}</span>
          </template>

          <template #item.rows="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              {{ formatearNumero(item.rows) }}
            </v-chip>
          </template>

          <template #item.primaEmitida="{ item }">
            <span class="text-success font-weight-bold">
              {{ formatearMoneda(item.primaEmitida) }}
            </span>
          </template>

          <template #item.sumaAsegurada="{ item }">
            <span class="text-info font-weight-bold">
              {{ formatearMoneda(item.sumaAsegurada) }}
            </span>
          </template>
        </v-data-table>
      </v-card>

      <!-- Tabla de Cifras Control Siniestros -->
      <v-card class="mt-4" elevation="0" outlined>
        <v-toolbar class="encabezado" flat>
          <v-toolbar-title>Cifras Control Siniestros</v-toolbar-title>
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

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCifrasControl } from "@/composables/cifras/useCifrasControl";

// Composable
const {
  cifrasEmision,
  cifrasSiniestros,
  loadingEmision,
  loadingSiniestros,
  snackbar,
  snackbarText,
  snackbarColor,
  cargarCifrasEmision,
  cargarCifrasSiniestros,
  cargarTodasLasCifras,
} = useCifrasControl();

// Breadcrumbs
const breadcrumbs = ["Insumos", "Cifras Control"];

// Headers de la tabla de emisión
const headersEmision = [
  { title: "Periodo", key: "aniomesCarga", align: "start" as const },
  { title: "Registros", key: "rows", align: "center" as const },
  { title: "Prima Emitida", key: "primaEmitida", align: "end" as const },
  { title: "Suma Asegurada", key: "sumaAsegurada", align: "end" as const },
];

// Headers de la tabla de siniestros
const headersSiniestros = [
  { title: "Periodo", key: "aniomesCarga", align: "start" as const },
  { title: "Registros", key: "rows", align: "center" as const },
  {
    title: "Indemnización Pagada",
    key: "indemnizacionPagada",
    align: "end" as const,
  },
  { title: "Monto Siniestro", key: "montoSiniestro", align: "end" as const },
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

    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const nombreMes = meses[mes - 1] || mes;
    return `${nombreMes} ${anio}`;
  }

  // Si tiene formato 2025-03
  const parteGuion = periodo.split("-");
  if (parteGuion.length === 2) {
    const anio = parteGuion[0];
    const mes = parseInt(parteGuion[1] || "0");

    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

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

// Cargar datos al montar el componente
onMounted(() => {
  console.log("=== CifrasControlPage montado ===");
  cargarTodasLasCifras();
});
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
