<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="contratoProrrogado"
            label="¿Contrato prorrogado?"
            variant="solo-filled"
            readonly
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-date-input
            v-model="fechaFinProrro"
            label="Fecha fin prórroga"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="solo-filled"
            readonly
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="contratoCancelado"
            label="¿Contrato cancelado?"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-date-input
            v-model="fechaCancelacion"
            label="Fecha cancelación"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="subramo"
            label="Subramo"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="idContrato"
            label="Identificador de contrato"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="negociosCubiertos"
            label="Negocios cubiertos"
            readonly
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="moneda"
            class="selectForm"
            label="Moneda"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-date-input
            v-model="inicioContrato"
            label="Fecha inicio contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            readonly
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-date-input
            v-model="finContrato"
            label="Fecha fin contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="formaContractual"
            class="selectForm"
            label="Forma contractual"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoReaseguro"
            label="Tipo de reaseguro"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoContrato"
            label="Tipo de contrato"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="criterioCobertura"
            class="selectForm"
            label="Criterio de cobertura"
            readonly
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="limiteMax"
            label="Limite máximo del contrato"
            readonly
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="limiteMaxResCR"
            label="Limite máximo de responsabilidad de contrato por riesgo"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="retencionP"
            label="Retención propia"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="cesion"
            label="Cesión"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            readonly
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-spacer />
      <br>
    </v-container>
  </v-form>
  <div>
    <v-row >
      <v-col>
        <v-data-table :headers="headers1" hide-default-footer  />
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar">
      Actualizar datos
      <br> generales
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  const contratoProrrogado = ref('')
  const fechaFinProrro = ref('')
  const contratoCancelado = ref('')
  const fechaCancelacion = ref('')
  const subramo = ref('')
  const idContrato = ref('')
  const inicioContrato = ref('')
  const finContrato = ref('')
  const tipoReaseguro = ref('')
  const tipoContrato = ref('')
  const formaContractual = ref('')
  const criterioCobertura = ref('')
  const negociosCubiertos = ref('')
  const moneda = ref('')
  const cesion = ref('')
  const limiteMax = ref('')
  const limiteMaxResCR = ref('')
  const retencionP = ref('')

  const headers1 = [
    { title: 'Detalle de Capa',  key: 'detalleCapa' },
    { title: 'Retención Propia capa N',  key: 'retencionC' },
    { title: 'Techo Capa N',  key: 'techoC' },
    { title: 'Modificar',  key: 'techoC' },
    { title: 'Borrar',  key: 'techoC' },
  ]
</script>
