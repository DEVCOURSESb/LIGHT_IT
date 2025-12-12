<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="subramo"
            label="Subramo"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="idContrato"
            label="Identificador de contrato"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="negociosCubiertos"
            label="Negocios cubiertos"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="moneda"
            class="selectForm"
            label="Moneda"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-date-input
            v-model="inicioContrato"
            label="Fecha inicio contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-date-input
            v-model="finContrato"
            label="Fecha fin contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="formaContractual"
            class="selectForm"
            label="Forma contractual"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoReaseguro"
            label="Tipo de reaseguro"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoContrato"
            :items="['OTROS', 'EXCEDENTE POR CAPAS']"
            label="Tipo de contrato"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="criterioCobertura"
            class="selectForm"
            label="Criterio de cobertura"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="limiteMax"
            label="Limite máximo del contrato"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="limiteMaxResCR"
            label="Limite máximo de responsabilidad de contrato por riesgo"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="retencionP"
            :disabled="tipoContrato === 'EXCEDENTE POR CAPAS'"
            label="Retención propia"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="cesion"
            :disabled="tipoContrato === 'EXCEDENTE POR CAPAS'"
            label="Cesión"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="piso"
            :disabled="tipoContrato === 'EXCEDENTE POR CAPAS'"
            label="Piso"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="techo"
            :disabled="tipoContrato === 'EXCEDENTE POR CAPAS'"
            label="Techo"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-divider v-if="tipoContrato === 'EXCEDENTE POR CAPAS'" />
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-if="tipoContrato === 'EXCEDENTE POR CAPAS'"
            v-model="retencionCapa"
            label="Retención propia capa N"
            outlined
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-if="tipoContrato === 'EXCEDENTE POR CAPAS'"
            v-model="techoCapa"
            label="Techo capa N"
            outlined
          />
        </v-col>
        <v-btn
          v-if="tipoContrato === 'EXCEDENTE POR CAPAS'"
          class="ma-2"
          color="indigo"
          icon="mdi mdi-plus"
          max-height="30px"
          max-width="30px"
        />
      </v-row>
      <v-spacer />
      <br>
    </v-container>
  </form>
  <div>
    <v-row class="d-flex justify-center align-center">
      <v-col>
        <v-data-table v-if="tipoContrato === 'EXCEDENTE POR CAPAS'" :headers="headers1" hide-default-footer  />
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar">
      Guardar datos
      <br> generales
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
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
  const piso = ref('')
  const techo = ref('')
  const techoCapa = ref('')
  const retencionCapa = ref('')

  const headers1 = [
    { title: 'Detalle de Capa',  key: 'detalleCapa' },
    { title: 'Retención Propia capa N',  key: 'retencionC' },
    { title: 'Techo Capa N',  key: 'techoC' },
    { title: 'Modificar',  key: 'techoC' },
    { title: 'Borrar',  key: 'techoC' },
  ]
</script>
