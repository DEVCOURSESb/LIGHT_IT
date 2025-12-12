<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="reaseguradora"
            label="Reaseguradora"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="participacion"
            label="Participación"
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
          <v-select
            v-model="otorgaPtu"
            :items="['SI', 'NO']"
            label="¿Otorga PTU?"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="ptu"
            :disabled="otorgaPtu === 'NO'"
            label="PTU"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="formulaCalculoPtu"
            :disabled="otorgaPtu === 'NO'"
            label="Fórmula cálculo PTU"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="k"
            :disabled="otorgaPtu === 'NO'"
            label="k"
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
            v-model="aniosArrastre"
            :disabled="otorgaPtu === 'NO'"
            label="Años de arrastre"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-calendar-clock-outline"
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
            v-model="comiReaseguro"
            :items="['SI', 'NO']"
            label="¿Comisión de reaseguro?"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoComision"
            :disabled="comiReaseguro === 'NO'"
            :items="['FIJA', 'VARIABLE']"
            label="Tipo de comision"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="comisionFija"
            :disabled="comiReaseguro === 'NO' || tipoComision === 'VARIABLE'"
            label="Comisión fija"
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
            v-model="comisionProvisional"
            :disabled="comiReaseguro === 'NO' || tipoComision ==='FIJA'"
            label="Comisión provisional"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

      </v-row>
      <v-col class="text-center">
        <v-btn>Agregar <br> reasegurador</v-btn>
      </v-col>
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar"  >
          Guardar <br> reaseguradores
        </v-btn>
      </v-col>
    </v-container>
  </form>
  <div>
    <v-data-table :headers="headers" hide-default-footer  />
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const reaseguradora = ref('')
  const participacion = ref('')
  const otorgaPtu = ref('')
  const ptu = ref('')
  const formulaCalculoPtu = ref('')
  const k = ref('')
  const aniosArrastre = ref('')
  const comiReaseguro = ref('')
  const tipoComision = ref('')
  const comisionFija = ref('')
  const comisionProvisional = ref('')

  watch(comiReaseguro, value => {
    if (value === 'NO') {
      tipoComision.value = ''
      comisionFija.value = ''
      comisionProvisional.value = ''
    }
  })
  watch(otorgaPtu, value => {
    if (value === 'NO') {
      ptu.value = ''
      formulaCalculoPtu.value = ''
      k.value = ''
      aniosArrastre.value = ''
    }
  })
  watch(tipoComision, value => {
    if (value === 'VARIABLE') {
      comisionFija.value = ''
    } else if (value === 'FIJA') {
      comisionProvisional.value = ''
    }
  })

  const headers = [
    { title: 'Reaseguradora',  key: 'reaseguradora' },
    { title: 'Participación',  key: 'participacion' },
    { title: '¿Otorga PTU?',  key: 'otorgaPtu' },
    { title: '%PTU',  key: 'ptu' },
    { title: 'Fórmula cálculo PTU',  key: 'formulaPTU' },
    { title: 'Años de arrastre',  key: 'montoR' },
    { title: '¿Comisión de reaseguro?',  key: 'comisionReaseguro' },
    { title: 'Tipo de comisión',  key: 'tipoComision' },
    { title: 'Comisión fija',  key: 'comisionFija' },
    { title: 'Comisión provisional detalles',  key: 'comisionProvisional' },
    { title: 'Activo',  key: 'activo' },
    { title: 'Editar',  key: 'editar' },
  ]
</script>
