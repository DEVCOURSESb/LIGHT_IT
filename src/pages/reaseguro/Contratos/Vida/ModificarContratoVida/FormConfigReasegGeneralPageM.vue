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
            :rules="[v => !!v || 'Compañía reaseguradora requerida']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="participacion"
            label="Participación"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% Participación requerida']"
            required
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
            :rules="[v => !!v || 'Indicador Distr. Cesión requerido']"
            required
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
            :rules="[v => !!v || 'Cesión sobre... BÁSICA requerida']"
            required
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
            :rules="[v => !!v || 'Comisión de reaseguro requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="detalleCobertura"
            :items="['SI', 'NO']"
            label="¿Detalle por cobertura?"
            :rules="[v => !!v || 'Detalle por cobertura requerido']"
            required
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
            :rules="[v => !!v || 'Tipo de comisión requerida']"
            required
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
            :disabled="detalleCobertura === 'NO'"
            label="Tipo de cobertura"
            :rules="[v => !!v || 'Tipo de cobertura requerido']"
            required
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
            :rules="[v => !!v || 'Comision primer año requerido']"
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
            v-model="comisionRenovacion"
            label="Comisión renovación (Fija/Provisional)"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || 'Comision renovación requerido']"
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
