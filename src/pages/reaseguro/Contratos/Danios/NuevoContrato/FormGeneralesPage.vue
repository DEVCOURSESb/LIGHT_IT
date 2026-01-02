<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-text-field
            v-model="idContrato"
            label="Identificador del contrato"
            :rules="[v => !!v || 'Identificador del contrato requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-date-input
            v-model="inicioContrato"
            label="Fecha inicio contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            :rules="[v => !!v || 'Fecha inicio contrato requerida']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-date-input
            v-model="finContrato"
            label="Fecha fin contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            :rules="[v => !!v || 'Fecha fin contrato requerida']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoSeguro"
            label="Tipo de reaseguro"
            :rules="[v => !!v || 'Tipo de reaseguro requerido']"
            required
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
            :rules="[v => !!v || 'Tipo de contrato requerido']"
            required
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
            :rules="[v => !!v || 'Forma contractual requerida']"
            required
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
            :rules="[v => !!v || 'Criterio de cobertura requerido']"
            required
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
            :rules="[v => !!v || 'Negocios cubiertos requeridos']"
            required
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
            :rules="[v => !!v || 'Moneda requerida']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoOperacion"
            class="selectForm"
            label="Tipo operación / ramo"
            :rules="[v => !!v || 'Tipo operación / ramo requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="operacionRamo"
            class="selectForm"
            label="Operación / ramo"
            :rules="[v => !!v || 'Operación / ramo requerido']"
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
  </v-form>
  <div>
    <v-row >
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
