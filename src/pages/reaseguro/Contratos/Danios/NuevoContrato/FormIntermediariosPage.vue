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

        <v-col cols="12" md="4">
          <v-select
            v-model="interme"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            label="Intermediario"
            :rules="[v => !!v || 'Intermediario requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="corretaje"
            class="selectForm"
            :disabled="intermediario === 'NO'"
            :items="['SI', 'NO']"
            label="Corretaje"
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
            :disabled="intermediario === 'NO' || corretaje === 'NO'"
            :items="['FIJO', 'VARIABLE']"
            label="Tipo de corretaje"
            :rules="[v => !!v || 'Tipo de corretaje requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="corretajeFijo"
            :disabled="intermediario === 'NO' || corretaje === 'NO' || asignacionIntermediario === 'POR REASEGURADOR' || tipoCorretaje === 'VARIABLE'"
            label="Corretaje fijo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% Corretaje fijo requerido']"
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
            v-model="montoCorretajeFijo"
            :disabled="intermediario === 'NO' || corretaje === 'NO' || asignacionIntermediario === 'POR REASEGURADOR' || tipoCorretaje === 'VARIABLE'"
            label="Monto corretaje fijo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            :rules="[v => !!v || 'Monto corretaje fijo requerido']"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="formulaLimiteCorre"
            class="selectForm"
            :disabled="intermediario === 'NO' || tipoCorretaje === 'FIJO'"
            label="Fórmula limite corretaje"
            :rules="[v => !!v || 'Formula limite corretaje requerida']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="corretajeProvi"
            :disabled="intermediario === 'NO' || tipoCorretaje === 'FIJO'"
            label="Corretaje provisional"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || 'Corretaje provisional requerido']"
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
            v-model="montoCorretajeProvi"
            :disabled="intermediario === 'NO' || tipoCorretaje === 'FIJO'"
            label="Monto corretaje provisional"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            :rules="[v => !!v || 'Monto corretaje requerido']"
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
        <v-btn class="btn-guardar"  >
          Guardar intermediario
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="#73D7D9"  >
          Crear contrato
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
    { title: '¿Intermediario?',  key: 'intermediario' },
    { title: 'Asignación de intermediario',  key: 'asignacionInterm' },
    { title: 'Reaseguradora',  key: 'reaseguradora' },
    { title: 'Intermediario',  key: 'intermediario' },
    { title: '¿Corretaje?',  key: 'corretaje' },
    { title: 'Tipo corretaje',  key: 'tipoCorretaje' },
    { title: '% Corretaje fijo',  key: 'corretajeFijo' },
    { title: 'Monto corretaje fijo',  key: 'montoCorreFijo' },
    { title: 'Fórmula limite corretaje',  key: 'formuLimiteC' },
    { title: '% Corretaje provisional',  key: 'corretajeProvisional' },
    { title: 'Monto corretaje provisional',  key: 'montoCorreProvi' },
    { title: 'Activo',  key: 'activo' },
    { title: 'Editar',  key: 'editar' },
  ]
</script>
