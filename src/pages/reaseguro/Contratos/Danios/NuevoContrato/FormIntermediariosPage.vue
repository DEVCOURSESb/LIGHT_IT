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

        <v-col cols="12" md="3">
          <v-select
            v-model="interme"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="options"
            label="Intermediario"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="corretaje"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="['SI', 'NO']"
            label="Corretaje"
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
            :disabled="intermediario === 'NO' || corretaje === 'NO'"
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
            v-model="corretajeFijo"
            :disabled="intermediario === 'NO' || corretaje === 'NO' || asignacionIntermediario === 'POR REASEGURADOR' || tipoCorretaje === 'VARIABLE'"
            label="Corretaje fijo"
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
            v-model="montoCorretajeFijo"
            :disabled="intermediario === 'NO' || corretaje === 'NO' || asignacionIntermediario === 'POR REASEGURADOR' || tipoCorretaje === 'VARIABLE'"
            label="Monto corretaje fijo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="formulaLimiteCorre"
            class="selectForm"
            :disabled="intermediario === 'NO' || tipoCorretaje === 'FIJO'"
            :items="options"
            label="Formula limite corretaje"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="corretajeProvi"
            :disabled="intermediario === 'NO' || tipoCorretaje === 'FIJO'"
            label="Corretaje provisional"
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
            v-model="montoCorretajeProvi"
            :disabled="intermediario === 'NO' || tipoCorretaje === 'FIJO'"
            label="Monto corretaje provisional"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>

      </v-row>
      <v-col class="text-center">
        <v-btn>Agregar intermediario</v-btn>
      </v-col>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar" @click="dialog = true">
          Guardar intermediario
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="#73D7D9" @click="dialog = true">
          Crear contrato
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
  const corretaje = ref('')
  const tipoCorretaje = ref('')
  const corretajeFijo = ref('')
  const montoCorretajeFijo = ref('')
  const formulaLimiteCorre = ref('')
  const corretajeProvi = ref('')
  const montoCorretajeProvi = ref('')

  watch (intermediario, value => {
    if (value === 'NO') {
      asignacionIntermediario.value = ''
      reaseguradora.value = ''
      interme.value = ''
      corretaje.value = ''
      tipoCorretaje.value = ''
      corretajeFijo.value = ''
      montoCorretajeFijo.value = ''
      formulaLimiteCorre.value = ''
      corretajeProvi.value = ''
      montoCorretajeProvi.value = ''
    }
  })

  watch (corretaje, value => {
    if (value === 'NO') {
      tipoCorretaje.value = ''
      corretajeFijo.value = ''
      montoCorretajeFijo.value = ''
      formulaLimiteCorre.value = ''
      corretajeProvi.value = ''
      montoCorretajeProvi.value = ''
    }
  })

  watch (tipoCorretaje, value => {
    if (value === 'FIJO') {
      formulaLimiteCorre.value = ''
      corretajeProvi.value = ''
      montoCorretajeFijo.value = ''
    } else if (value = 'VARIABLE') {
      corretajeFijo.value = ''
      montoCorretajeFijo.value = ''
    }
  })

  const headers = [
    { title: '¿Intermediario?', value: 'intermediario', align: 'center' },
    { title: 'Asignación de intermediario', value: 'asignacionInterm', align: 'center' },
    { title: 'Reaseguradora', value: 'reaseguradora', align: 'center' },
    { title: 'Intermediario', value: 'intermediario', align: 'center' },
    { title: '¿Corretaje?', value: 'corretaje', align: 'center' },
    { title: 'Tipo corretaje', value: 'tipoCorretaje', align: 'center' },
    { title: '% Corretaje fijo', value: 'corretajeFijo', align: 'center' },
    { title: 'Monto corretaje fijo', value: 'montoCorreFijo', align: 'center' },
    { title: 'Fórmula limite corretaje', value: 'formuLimiteC', align: 'center' },
    { title: '% Corretaje provisional', value: 'corretajeProvisional', align: 'center' },
    { title: 'Monto corretaje provisional', value: 'montoCorreProvi', align: 'center' },
    { title: 'Activo', value: 'activo', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
