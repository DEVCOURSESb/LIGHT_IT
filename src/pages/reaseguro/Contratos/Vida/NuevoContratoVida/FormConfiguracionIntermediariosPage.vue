<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="intermediario"
            :items="['SI', 'NO']"
            label="¿Intermediario?"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="asignacionIntermediario"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="['POR CONTRATO', 'POR REASEGURADOR']"
            label="Asignación de intermediario"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="reaseguradora"
            class="selectForm"
            :disabled="intermediario === 'NO' || asignacionIntermediario === 'POR CONTRATO'"
            :items="options"
            label="Reaseguradora"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-divider />
        <v-btn
          class="ma-2"
          color="indigo"
          icon="mdi mdi-plus"
          max-height="30px"
          max-width="30px"
        />
        <v-col cols="12" md="7">
          <v-select
            v-model="interme"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="options"
            label="Intermediario / Broker"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="corretajeP"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="['SI', 'NO']"
            label="¿Corretaje?"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoCorretaje"
            class="selectForm"
            :disabled="intermediario === 'NO' || corretajeP === 'NO'"
            :items="['FIJO', 'VARIABLE']"
            label="Tipo de corretaje"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="corretaje"
            :disabled="intermediario === 'NO' || corretajeP === 'NO'"
            label="Corretaje"
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
            v-model="montoCorretaje"
            :disabled="intermediario === 'NO' || corretajeP === 'NO'"
            label="Monto corretaje"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar" @click="dialog = true">
          Agregar intermediarios
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="#73D7D9" @click="dialog = true">
          Guardar contrato
        </v-btn>
      </v-col>
    </v-container>
  </form>
  <div>
    <v-data-table :headers="headers" hide-default-footer :items="items" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const intermediario = ref('')
  const asignacionIntermediario = ref('')
  const reaseguradora = ref('')
  const interme = ref('')
  const corretajeP = ref('')
  const tipoCorretaje = ref('')
  const corretaje = ref('')
  const montoCorretaje = ref('')
  const formulaLimiteCorre = ref('')
  const corretajeProvi = ref('')
  const montoCorretajeProvi = ref('')

  watch (intermediario, value => {
    if (value === 'NO') {
      asignacionIntermediario.value = ''
      reaseguradora.value = ''
      interme.value = ''
      corretajeP.value = ''
      tipoCorretaje.value = ''
      corretaje.value = ''
      montoCorretaje.value = ''
      formulaLimiteCorre.value = ''
      corretajeProvi.value = ''
      montoCorretajeProvi.value = ''
    }
  })

  watch (corretajeP, value => {
    if (value === 'NO') {
      tipoCorretaje.value = ''
      corretaje.value = ''
      montoCorretaje.value = ''
      formulaLimiteCorre.value = ''
      corretajeProvi.value = ''
      montoCorretajeProvi.value = ''
    }
  })

  watch (tipoCorretaje, value => {
    if (value === 'FIJO') {
      formulaLimiteCorre.value = ''
      montoCorretaje.value = ''
    } else if (value = 'VARIABLE') {
      corretaje.value = ''
      montoCorretaje.value = ''
    }
  })

  const headers = [
    { title: 'Intermediario', value: 'intermediario', align: 'center' },
    { title: 'Asignación de intermediario', value: 'asignacionInterm', align: 'center' },
    { title: 'Reaseguradora', value: 'reaseguradora', align: 'center' },
    { title: 'Intermediario / Broker', value: 'intermediarioBroker', align: 'center' },
    { title: '¿Corretaje?', value: 'corretaje', align: 'center' },
    { title: 'Tipo corretaje', value: 'tipoCorretaje', align: 'center' },
    { title: '% Corretaje fijo', value: 'corretajeFijo', align: 'center' },
    { title: 'Monto corretaje fijo', value: 'montoCorreFijo', align: 'center' },
    { title: 'Modificar', value: 'activo', align: 'center', icon: 'mdi mdi-pencil' },
    { title: 'Eliminar', value: 'editar', align: 'center', icon: 'mdi mdi-delete-circle-outline' },
  ]
</script>
