<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="6"
        >
          <v-select
            v-model="companiaReaseg"
            :items="options"
            label="Compañía reaseguradora"
            required
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
      </v-row>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="indicadorDistrC"
            class="selectForm"
            :items="options"
            label="Indicador Distr. Cesión"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="cesionCoberBasi"
            class="selectForm"
            :items="options"
            label="¿Cesión sobre la cobertura BÁSICA?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="comisionReaseg"
            class="selectForm"
            :items="options"
            label="¿Comisión de reaseguro?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="detalleCobertura"
            :items="['SI', 'NO']"
            label="¿Detalle por cobertura?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoComision"
            class="selectForm"
            :items="options"
            label="Tipo de comisión"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-divider />

        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="tipoCobertura"
            class="selectForm"
            :disabled="detalleCobertura === 'NO'"
            :items="['OTROS', 'GENERAL']"
            label="Tipo de cobertura"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="comisionPrimerAnio"
            label="Comisión primer año (Fija/Provisional)"
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
            v-model="comisionRenovacion"
            label="Comisión renovación (Fija/Provisional)"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-btn
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
        <v-data-table :headers="headers1" hide-default-footer :items="items" />
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" @click="dialog = true">
      Guardar
      <br> generales
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const companiaReaseg = ref('')
  const participacion = ref('')
  const indicadorDistrC = ref('')
  const cesionCoberBasi = ref('')
  const comisionReaseg = ref('')
  const detalleCobertura = ref('')
  const tipoComision = ref('')
  const tipoCobertura = ref('')
  const comisionPrimerAnio = ref('')
  const comisionRenovacion = ref('')

  watch (detalleCobertura, value => {
    if (value === 'NO') {
      tipoCobertura.value = 'GENERAL'
    } else if (value === 'SI') {
      tipoCobertura.value = ''
    }
  })

  const headers1 = [
    { title: 'Tipo cobertura', value: 'detalleCapa', align: 'center' },
    { title: '% Comisión primer año (Fija/Provisional)', value: 'retencionC', align: 'center' },
    { title: '% Comisión renovación (Fija/Provisional)', value: 'techoC', align: 'center' },
    { title: 'Modificar', value: 'techoC', align: 'center' },
    { title: 'Borrar', value: 'techoC', align: 'center' },
  ]
</script>
