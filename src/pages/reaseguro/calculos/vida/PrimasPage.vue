<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-card-title class="d-flex align-center"> Cálculo de Primas </v-card-title>

    <v-card class="mt-4" elevation="0" outlined>
      <v-card-title>
        <v-form ref="formRef">
          <v-row align="center" justify="center" class="mb-4">
            <v-col cols="12" md="3">
              <v-select
                v-model="subramo"
                :items="querySubramos.data.value || []"
                item-title="descOperacionRamos"
                item-value="cveCobertura"
                label="Subramo"
                :disabled="querySubramos.isLoading.value || block"
                return-object
                variant="solo-filled"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-date-input
                v-model="fechaCalculo"
                label="Fecha de evaluación"
                variant="solo-filled"
                clearable
                required
                :disabled="block"
              />
            </v-col>

            <v-col cols="8" md="2" class="title-center">
              <v-btn size="small" class="btn-guardar" @click="calcularPrimas" :disabled="block">
                Calcular
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-divider class="mb-4" />

        <div class="mb-2">
          <h6>Historico cálculos de primas</h6>
        </div>

        <v-data-table
          :headers="headers"
          :items="queryHistory.data.value || []"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.fechaRegistro="{ item }">
            {{ formatDate(item.fechaRegistro) }}
          </template>

          <template #item.fechaCalculo="{ item }">
            {{ formatDate(item.fechaCalculo) }}
          </template>
          <template #item.actions="{ item }">
            <v-icon class="edit" size="large" @click="descargarItem(item)">
              mdi-download
            </v-icon>
          </template>
        </v-data-table>
      </v-card-title>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useCalculoVidaPrimas } from "@/composables/reaseguro/calculos/vida/useCalculoVidaPrimas";
import { formatDate } from "@/utils/formatDate";

const breadcrumbs = ["Reaseguro", "Cálculos", "Vida", "Primas"];

const {
  querySubramos,
  subramo,
  fechaCalculo,
  headers,
  calcularPrimas,
  descargarItem,
  queryHistory,
  block,
} = useCalculoVidaPrimas();
</script>
