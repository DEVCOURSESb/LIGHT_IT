<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col
          cols="12"
          md="6"
        >
          <v-select
            v-model="companiaReaseg"
            label="Compañía reaseguradora"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="participacion"
            label="Participación"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            readonly
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row >
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="indicadorDistrC"
            class="selectForm"
            label="Indicador Distr. Cesión"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="cesionCoberBasi"
            class="selectForm"
            label="¿Cesión sobre la cobertura BÁSICA?"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="comisionReaseg"
            class="selectForm"
            label="¿Comisión de reaseguro?"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="detalleCobertura"
            label="¿Detalle por cobertura?"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoComision"
            class="selectForm"
            label="Tipo de comisión"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-divider />

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoCobertura"
            class="selectForm"
            label="Tipo de cobertura"
            readonly
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="comisionPrimerAnio"
            label="Comisión primer año (Fija/Provisional)"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            readonly
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
            v-model="comisionRenovacion"
            label="Comisión renovación (Fija/Provisional)"
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
        <v-data-table v-if="detalleCobertura === 'SI'" :headers="headers1" hide-default-footer  />
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" >
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
  const comisionReaseg = ref('')
  const detalleCobertura = ref('')
  const tipoComision = ref('')
  const tipoCobertura = ref('')
  const comisionPrimerAnio = ref('')
  const comisionRenovacion = ref('')
  const cesionCoberBasi = ref('')

  watch (detalleCobertura, value => {
    if (value === 'NO') {
      tipoCobertura.value = ''
    } else if (value === 'SI') {
      tipoCobertura.value = ''
    }
  })

  const headers1 = [
    { title: 'Tipo cobertura',  key: 'detalleCapa' },
    { title: '% Comisión primer año (Fija/Provisional)',  key: 'retencionC' },
    { title: '% Comisión renovación (Fija/Provisional)',  key: 'techoC' },
    { title: 'Modificar',  key: 'techoC' },
    { title: 'Borrar',  key: 'techoC' },
  ]
</script>
