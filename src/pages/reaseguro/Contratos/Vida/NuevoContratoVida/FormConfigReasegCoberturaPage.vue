<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="agrupacionCoberturas"
            :items="['SI', 'NO']"
            label="¿Agrupación de coberturas?"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row v-if="agrupacionCoberturas === 'SI'" class="d-flex justify-center align-center">
        <v-col cols="12" md="5">
          <v-label class="text-center">Seleccione los campos que requiera agrupar. Si no encuentra la cobertura <br> favor de agregarla.</v-label>
          <v-data-table
            :headers="headers"
            :item-value="item => `${item.name}`"
            :items="desserts"
            items-per-page="5"
            show-select
          />
        </v-col>
        <v-btn
          class="ma-2"
          color="indigo"
          icon="mdi mdi-plus"
          max-height="30px"
          max-width="30px"
        />
        <v-col cols="12" md="8">
          <v-data-table :headers="headers1" hide-default-footer :items="items" />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="coberturasBasi"
            :items="options"
            label="Coberturas básicas"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="coberturasAdici"
            class="selectForm"
            :items="options"
            label="Coberturas adicionales"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="detalleCapa"
            class="selectForm"
            :items="['SI', 'NO']"
            label="¿Detalles por capa?"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-divider />
      <br>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-if="detalleCapa === 'SI'"
            v-model="detalleC"
            class="selectForm"
            :items="options"
            label="Detalle de capa"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="detalleCobertura"
            class="selectForm"
            :items="['SI', 'NO']"
            label="¿Detalle por cobertura?"
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
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="cobertura"
            class="selectForm"
            :items="options"
            label="Cobertura"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="tipoTarifa"
            class="selectForm"
            :items="options"
            label="Tipo de tarifa"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="detalleCapa === 'SI'"
            v-model="primaTarFi"
            label="Prima de tarifa fija"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="detalleCapa === 'SI'"
            v-model="porSobrePrimaE"
            label="sobre prima emitida"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="detalleCapa === 'SI'"
            v-model="tarifaFijaM"
            label="Tarifa fija al millar"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="detalleCapa === 'NO'"
            v-model="factorTarifaP"
            label="Factor tarifa propia"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="detalleCapa === 'NO'"
            v-model="tarifaPropia"
            label="Tarifa propia"
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
  </form>
  <v-divider />
  <br>
  <div>
    <v-row class="d-flex justify-center align-center">
      <v-col>
        <v-data-table :headers="headers2" hide-default-footer />
      </v-col>
    </v-row>
    <!--Dentro de la tabla anterior en el apartado de tarifa propia debería
    poder hacer clic y poder visualizar un modal con una tabla donde contenga la información
    de dicho apartado pero de manera desglosada-->
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" @click="dialog = true">
      Guardar
      <br> generales
    </v-btn>
  </v-col>
</template>

<script setup>
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
      align: 'center',
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
    { title: 'Cobertura', value: 'cobertura', align: 'center' },
    { title: 'Agrupar en:', value: 'agruparEn', align: 'center' },
    { title: 'Modificar', value: 'modificar', align: 'center' },
    { title: 'Borrar', value: 'borrar', align: 'center' },
  ]

  const headers2 = [
    { title: 'Detalle capa', value: 'detalleCapa', align: 'center' },
    { title: 'Tipo cobertura', value: 'tipoCobertura', align: 'center' },
    { title: 'Cobertura', value: 'cobertura', align: 'center' },
    { title: 'Tipo de tarifa', value: 'tipoTarifa', align: 'center' },
    { title: 'Prima de tarifa fija', value: 'primaTarifa', align: 'center' },
    { title: '& sobre prima emitida', value: 'porSobrePrima', align: 'center' },
    { title: 'Tarifa fija al millar', value: 'tarifaFijaM', align: 'center' },
    { title: 'Factor tarifa propia', value: 'factorTap', align: 'center' },
    { title: 'Tarifa propia', value: 'tarifaP', align: 'center' },
    { title: 'Modificar', value: 'modificar', align: 'center' },
    { title: 'Borrar', value: 'borrar', align: 'center' },
  ]
</script>
