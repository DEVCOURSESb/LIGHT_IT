<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasBasi"
            label="Coberturas básicas"
            readonly
            multiple
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="coberturasAdici"
            class="selectForm"
            label="Coberturas adicionales"
            readonly
            multiple
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="detalleCapa"
            class="selectForm"
            label="¿Detalles por capa?"
            readonly
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-divider />
      <br>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleC"
            class="selectForm"
            label="Detalle de capa"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCobertura"
            class="selectForm"
            label="¿Detalle por cobertura?"
            readonly
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-divider />
      <br>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="cobertura"
            class="selectForm"
            label="Cobertura"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="tipoTarifa"
            class="selectForm"
            label="Tipo de tarifa"
            readonly
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="primaTarFi"
            label="Prima de tarifa fija"
            readonly
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="porSobrePrimaE"
            label="sobre prima emitida"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            readonly
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="tarifaFijaM"
            label="Tarifa fija al millar"
            readonly
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="factorTarifaP"
            label="Factor tarifa propia"
            readonly
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="tarifaPropia"
            label="Tarifa propia"
            readonly
            variant="solo-filled"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <v-divider />
  <br>
  <div>
    <v-row >
      <v-col>
        <v-data-table :headers="headers2" hide-default-footer />
      </v-col>
    </v-row>
    <!--Dentro de la tabla anterior en el apartado de tarifa propia debería
    poder hacer clic y poder visualizar un modal con una tabla donde contenga la información
    de dicho apartado pero de manera desglosada-->
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar"  >
      Guardar
      <br> generales
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  const coberturasBasi = ref('')
  const coberturasAdici = ref('')
  const detalleCapa = ref('')
  const detalleC = ref('')
  const detalleCobertura = ref('')
  const cobertura = ref('')
  const tipoTarifa = ref('')
  const primaTarFi = ref('')
  const porSobrePrimaE = ref('')
  const tarifaFijaM = ref('')
  const factorTarifaP = ref('')
  const tarifaPropia = ref('')

  watch(detalleCapa, value => {
    if (value === 'NO') {
      factorTarifaP.value = ''
      tarifaPropia.value = ''
    } else if (value === 'SI') {
      primaTarFi.value = ''
      porSobrePrimaE.value = ''
      tarifaFijaM.value = ''
    }
  },
  )

  const headers2 = [
    { title: 'Detalle capa',  key: 'detalleCapa' },
    { title: 'Tipo cobertura',  key: 'tipoCobertura' },
    { title: 'Cobertura',  key: 'cobertura' },
    { title: 'Tipo de tarifa',  key: 'tipoTarifa' },
    { title: 'Prima de tarifa fija',  key: 'primaTarifa' },
    { title: '& sobre prima emitida',  key: 'porSobrePrima' },
    { title: 'Tarifa fija al millar',  key: 'tarifaFijaM' },
    { title: 'Factor tarifa propia',  key: 'factorTap' },
    { title: 'Tarifa propia',  key: 'tarifaP' },
    { title: 'Modificar',  key: 'modificar' },
    { title: 'Borrar',  key: 'borrar' },
  ]
</script>
