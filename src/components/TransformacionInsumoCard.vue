<!-- components/TransformacionInsumoCard.vue -->
<template>
  <v-card class="mt-4" elevation="0" outlined>
    <v-toolbar class="encabezado" flat>
      <v-toolbar-title class="text-secondary">{{ titulo }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text class="pt-6">
      <v-form ref="formRef" v-model="validTransformacion">
        <v-row>
          <!-- Select de año -->
          <v-col cols="12" md="4">
            <v-select
              v-model="anioTransformacion"
              :items="aniosTransformacion"
              label="Año"
              :rules="anioTransformacionRules"
              prepend-icon="mdi-calendar"
              density="compact"
              :disabled="loadingTransformacion"
            ></v-select>
          </v-col>

          <!-- Select de mes -->
          <v-col cols="12" md="4">
            <v-select
              v-model="mesTransformacion"
              :items="mesesTransformacion"
              item-title="nombre"
              item-value="valor"
              label="Mes"
              :rules="mesTransformacionRules"
              prepend-icon="mdi-calendar-month"
              density="compact"
              :disabled="loadingTransformacion"
            ></v-select>
          </v-col>

          <!-- Botón de transformar -->
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-btn
              block
              class="btn-transformar"
              :disabled="!puedeTransformar"
              :loading="loadingTransformacion"
              @click="transformarInsumo"
            >
              <v-icon start>mdi-sync</v-icon>
              {{ textBoton }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- Información adicional -->
        <v-row v-if="mostrarInfo" class="mt-2">
          <v-col cols="12">
            <v-alert
              type="info"
              density="compact"
              variant="tonal"
              icon="mdi-information"
            >
              {{ textoInfo }}
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { useTransformacionInsumos } from "@/composables/archivos/useTransformacionInsumos";
import { onMounted, ref as vueRef } from "vue";

interface Props {
  titulo: string;
  textBoton: string;
  composable: ReturnType<typeof useTransformacionInsumos>;
  mostrarInfo?: boolean;
  textoInfo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mostrarInfo: true,
  textoInfo: "Seleccione el año y mes del insumo que desea transformar a formato contable.",
});

const {
  formTransformacion,
  validTransformacion,
  anioTransformacion,
  mesTransformacion,
  loadingTransformacion,
  anioTransformacionRules,
  mesTransformacionRules,
  aniosTransformacion,
  mesesTransformacion,
  transformarInsumo,
  puedeTransformar,
} = props.composable;

const formRef = vueRef();

onMounted(() => {
  formTransformacion.value = formRef.value;
});
</script>

<style scoped>
.encabezado {
  background-color: #f5f5f5;
}

.btn-transformar {
  background-color: #4caf50;
  color: white;
}

.btn-transformar:hover {
  background-color: #45a049;
}

.btn-transformar:disabled {
  background-color: #e0e0e0 !important;
  color: #9e9e9e !important;
}
</style>
