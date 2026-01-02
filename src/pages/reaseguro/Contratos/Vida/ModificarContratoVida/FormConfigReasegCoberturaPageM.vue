<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasBasi"
            label="Coberturas básicas"
            :rules="[v => !!v || 'Coberturas básicas requeridas']"
            required
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
            :rules="[v => !!v || 'Coberturas adicionales requeridas']"
            required
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
            :items="['SI', 'NO']"
            label="¿Detalles por capa?"
            :rules="[v => !!v || 'Detalles por capa requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-divider />
      <br>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-if="detalleCapa === 'SI'"
            v-model="detalleC"
            class="selectForm"
            label="Detalle de capa"
            :rules="[v => !!v || 'Detalle por capa requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCobertura"
            class="selectForm"
            :items="['SI', 'NO']"
            label="¿Detalle por cobertura?"
            :rules="[v => !!v || 'Detalle por cobertura requerido']"
            required
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
      <v-divider />
      <br>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="cobertura"
            class="selectForm"
            label="Cobertura"
            :rules="[v => !!v || 'Cobertura requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="tipoTarifa"
            class="selectForm"
            label="Tipo de tarifa"
            :rules="[v => !!v || 'Tipo de tarifa requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="detalleCapa === 'SI'"
            v-model="primaTarFi"
            label="Prima de tarifa fija"
            :rules="[v => !!v || 'Prima de tarifa fija requerido']"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="detalleCapa === 'SI'"
            v-model="porSobrePrimaE"
            label="sobre prima emitida"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% sobre prima emitida requerido']"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="detalleCapa === 'SI'"
            v-model="tarifaFijaM"
            label="Tarifa fija al millar"
            :rules="[v => !!v || 'Tarifa fija al millar requerido']"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="detalleCapa === 'NO'"
            v-model="factorTarifaP"
            label="Factor tarifa propia"
            :rules="[v => !!v || 'Factor tarifa propia requerido']"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="detalleCapa === 'NO'"
            v-model="tarifaPropia"
            label="Tarifa propia"
            :rules="[v => !!v || 'Tarifa propia requerido']"
            required
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
  const agrupacionCoberturas = ref('')
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

  const headers = [
    {
      title: 'Coberturas',
      key: 'name',
    },
  ]
  const desserts = [
    { name: 'FALLECIMIENTO' },
    { name: 'GASTOS FUNERARIOS' },
    { name: 'DI-MA' },
    { name: 'DI-MAPO' },
    { name: 'IPSA' },
    { name: 'MUERTE ACCIDENTAL' },
  ]

  const headers1 = [
    { title: 'Cobertura',  key: 'cobertura' },
    { title: 'Agrupar en:',  key: 'agruparEn' },
    { title: 'Modificar',  key: 'modificar' },
    { title: 'Borrar',  key: 'borrar' },
  ]

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
