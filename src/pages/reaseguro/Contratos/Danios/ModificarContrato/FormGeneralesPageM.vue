<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-text-field
            v-model="idContrato"
            label="Identificador del contrato"
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
        <v-col cols="12" md="3">
          <v-select
            v-model="contratoProrrogado"
            :items="['SI', 'NO']"
            label="¿Contrato prorrogado?"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-date-input
            v-model="fechaProrroga"
            v-if="contratoProrrogado === 'SI'"
            label="Fecha prorroga"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="contratoCancelado"
            :items="['SI', 'NO']"
            label="¿Contrato cancelado?"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-date-input
            v-model="fechaCancelacion"
            v-if="contratoCancelado === 'SI'"
            label="Fecha cancelacion"
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
            v-model="tipoSeguro"
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
            v-model="negociosCubiertos"
            label="Negocios cubiertos"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="contratoCancelado"
            :items="['SI', 'NO']"
            label="¿Contrato cancelado?"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center align-center">
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
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoOperacion"
            class="selectForm"
            label="Tipo operación / ramo"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="operacionRamo"
            class="selectForm"
            label="Operación / ramo"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn>Agregar moneda</v-btn>
          <v-btn>Agregar operacion / ramo</v-btn>
        </v-col>
      </v-row>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar"  >
          Guardar contrato
        </v-btn>
      </v-col>
    </v-container>
  </form>
  <div>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="5">
        <v-data-table :headers="headers1" hide-default-footer  />
      </v-col>
      <v-spacer />
      <v-col cols="12" md="5">
        <v-data-table :headers="headers2" hide-default-footer  />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const idContrato = ref('')
  const inicioContrato = ref('')
  const finContrato = ref('')
  const contratoProrrogado = ref('')
  const fechaProrroga = ref('')
  const contratoCancelado = ref('')
  const fechaCancelacion = ref('')
  const tipoSeguro = ref('')
  const tipoContrato = ref('')
  const formaContractual = ref('')
  const criterioCobertura = ref('')
  const negociosCubiertos = ref('')
  const moneda = ref('')
  const tipoOperacion = ref('')
  const operacionRamo = ref('')

  const headers1 = [
    { title: 'Moneda',  key: 'moneda' },
    { title: 'Activo',  key: 'activo' },
  ]
  const headers2 = [
    { title: 'Tipo operación / ramo',  key: 'tipoOperacionR' },
    { title: 'Operacion /ramo',  key: 'operacionRamo' },
    { title: 'Activo',  key: 'activo' },
  ]
</script>
