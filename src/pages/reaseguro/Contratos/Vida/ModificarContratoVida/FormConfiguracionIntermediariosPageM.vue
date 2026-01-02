<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="intermediario"
            :items="['SI', 'NO']"
            label="¿Intermediario?"
            :rules="[v => !!v || 'Intermediario requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="asignacionIntermediario"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="['POR CONTRATO', 'POR REASEGURADOR']"
            label="Asignación de intermediario"
            :rules="[v => !!v || 'Asignación de intermediario requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="reaseguradora"
            class="selectForm"
            :disabled="intermediario === 'NO' || asignacionIntermediario === 'POR CONTRATO'"
            label="Reaseguradora"
            :rules="[v => !!v || 'Reaseguradora requerida']"
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
            label="Intermediario / Broker"
            :rules="[v => !!v || 'Intermediario/Broker requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="corretajeP"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="['SI', 'NO']"
            label="¿Corretaje?"
            :rules="[v => !!v || 'Corretaje requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoCorretaje"
            class="selectForm"
            :disabled="intermediario === 'NO' || corretajeP === 'NO'"
            :items="['FIJO', 'VARIABLE']"
            label="Tipo de corretaje"
            :rules="[v => !!v || 'Tipo corretaje requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="corretaje"
            :disabled="intermediario === 'NO' || corretajeP === 'NO'"
            label="Corretaje"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% Corretaje requerido']"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="montoCorretaje"
            :disabled="intermediario === 'NO' || corretajeP === 'NO'"
            label="Monto corretaje"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            :rules="[v => !!v || 'Monto corretaje requerido']"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar"  >
          Agregar intermediarios
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="#73D7D9"  >
          Guardar contrato
        </v-btn>
      </v-col>
    </v-container>
  </v-form>
  <div>
    <v-data-table :headers="headers" hide-default-footer  />
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

  watch (asignacionIntermediario, value => {
    if (value === 'POR CONTRATO'){
      reaseguradora.value = ''
    }
  })

  const headers = [
    { title: 'Intermediario',  key: 'intermediario' },
    { title: 'Asignación de intermediario',  key: 'asignacionInterm' },
    { title: 'Reaseguradora',  key: 'reaseguradora' },
    { title: 'Intermediario / Broker',  key: 'intermediarioBroker' },
    { title: '¿Corretaje?',  key: 'corretaje' },
    { title: 'Tipo corretaje',  key: 'tipoCorretaje' },
    { title: '% Corretaje fijo',  key: 'corretajeFijo' },
    { title: 'Monto corretaje fijo',  key: 'montoCorreFijo' },
    { title: 'Modificar',  key: 'activo' },
    { title: 'Eliminar',  key: 'editar' },
  ]
</script>
