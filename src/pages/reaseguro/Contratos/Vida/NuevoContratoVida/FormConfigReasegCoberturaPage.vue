<template>
  <v-form ref="form">
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="agrupacionCoberturas"
            :items="siNoOptions"
            label="¿Agrupación de coberturas?"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center align-center" v-if="agrupacionCoberturas === 1">
        <v-col cols="12" md="5">
          <v-data-table
            v-model="coberturasSeleccionadas"
            :headers="[{ title: 'Coberturas', key: 'title' }]"
            :items="coberturasDisponibles"
            show-select
            item-value="value"
            return-object
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="coberturaMadre"
            :items="coberturasDisponibles"
            item-title="title"
            item-value="value"
            return-object
            label="Agrupar en:"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn
            color="indigo"
            icon="mdi-plus"
            title="Agregar agrupación de coberturas"
            @click="agregarAgrupacion"
          />
        </v-col>
        <v-col cols="12" md="8">
          <v-data-table
            v-model="agrupaciones"
            :headers="headers1"
            :items="agrupaciones"
            hide-default-footer
          >
            <template v-slot:item.cobertura="{ item }">
              {{ item?.coberturas?.map(c => c.title).join(', ') || '' }}
            </template>
            <template v-slot:item.agruparEn="{ item }">
              <span>
                {{ item.madre ? item.madre.title : 'Sin asignar' }}
              </span>
            </template>
            <template v-slot:item.modificar="{ item }">
              <v-btn icon @click="editarAgrupacion(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.borrar="{ item }">
              <v-btn icon @click="eliminarAgrupacion(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasBasi"
            :items="coberturasBasiOptions"
            label="Coberturas básicas"
            item-title="title"
            item-value="value"
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
            :items="coberturasAdiciOptions"
            item-title="title"
            item-value="value"
            return-object
            multiple
            label="Coberturas adicionales"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="detalleCapa"
            :items="siNoOptions"
            label="¿Detalles por capa?"
            :rules="[ValidacionesContrato.detalleCapa(() => idTContrato)]"
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
            v-if="detalleCapa === 1"
            v-model="detalleC"
            :items="detalleCOptions"
            item-title="title"
            item-value="value"
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
            :items="siNoOptions"
            label="¿Detalle por cobertura?"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
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
            :items="tipoTarifaOptions"
            label="Tipo de tarifa"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="tipoTarifa === 0"
            v-model="primaTarFi"
            label="Prima de tarifa fija"
            :rules="[ValidacionesContrato.primaTarifaFija(() => tipoTarifa)]"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="tipoTarifa === 1"
            v-model="porSobrePrimaE"
            label="% sobre prima emitida"
            :rules="[ValidacionesContrato.porSobrePrima(() => tipoTarifa)]"
            suffix="%"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="tipoTarifa === 3"
            v-model="tarifaFijaM"
            label="Tarifa fija al millar"
            :rules="[ValidacionesContrato.tarifaFijaMillar(() => tipoTarifa)]"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="tipoTarifa === 2"
            v-model="factorTarifaP"
            label="Factor tarifa propia"
            :rules="[ValidacionesContrato.factorTarifaPropia(() => tipoTarifa)]"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="tipoTarifa === 2"
            v-model="tarifaPropia"
            label="Tarifa propia (CSV)"
            :rules="[ValidacionesContrato.tarifaPropia(() => tipoTarifa)]"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-btn
          class="ma-2"
          color="indigo"
          icon="mdi-plus"
          max-height="30px"
          max-width="30px"
          @click="agregarTarifa"
        />
      </v-row>
    </v-container>
  </v-form>
  <v-divider />
  <br>
  <div>
    <v-row >
      <v-col>
        <v-data-table
          :headers="headers2"
          :items="itemsTablaTarifas"
          hide-default-footer
        >
          <template #item.tipoTarifa="{ item }">
            {{ tipoTarifaOptions.find(o => o.value === item.tipoTarifa)?.title || item.tipoTarifa }}
          </template>

          <template #item.modificar="{ item, index }">
            <v-btn icon color="blue" variant="text" @click="editarTarifa(item, index)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template #item.borrar="{ index }">
            <v-btn icon color="red" variant="text" @click="eliminarTarifa(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" @click="guardarDatosGenerales">
      Guardar
      <br> coberturas
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { useContratoStore, type CapaExPC } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const idTContrato = computed(() => contratoStore.general?.idTContrato ?? null)
const dialog = useDialog()

const form = ref()
const siNoOptions = [
  { title: 'SI', value: 1 },
  { title: 'NO', value: 0 }
]

const esExcedentePorCapas = computed(() => {
  return contratoStore.general?.idTContrato === 3
})

const detalleCOptions = computed(() => {
  return contratoStore.expc?.capas.map(c => ({
    title: c.detalleCapa,
    value: c.detalleCapa
  })) || []
})


const { coberturasOptions, fetchCoberturas } = NuevoContratoVidaConR()
const { coberturasBasiOptions, fetchCoberturasBasicas } = NuevoContratoVidaConR()
const { coberturasAdiciOptions, fetchCoberturasAdicionales } = NuevoContratoVidaConR()
const { tipoTarifaOptions, fetchTipoTarifa } = NuevoContratoVidaConR()

onMounted(() => {
  fetchCoberturas()
  fetchCoberturasBasicas()
  fetchCoberturasAdicionales()
  fetchTipoTarifa()
})

interface Cobertura {
  title: string
  value: number
}

interface Agrupacion {
  coberturas: Cobertura[]
  madre: Cobertura | null
}

const coberturasSeleccionadas = ref<Cobertura[]>([])
const coberturaMadre = ref<Cobertura | null>(null)
const agrupaciones = ref<Agrupacion[]>([])

const coberturasDisponibles = computed(() => {
  const usadas = agrupaciones.value.flatMap(a => a.coberturas.map(c => c.value))
  return coberturasOptions.value.filter(c => !usadas.includes(c.value))
})


const agregarAgrupacion = () => {
  if (coberturasSeleccionadas.value.length === 0 || !coberturaMadre.value) {
    dialog.show({
      type: DialogType.ERROR,
      message: 'Seleccione coberturas y una cobertura madre para agrupar',
      title: 'Error'
    })
    return
  }

  agrupaciones.value.push({
    coberturas: [...coberturasSeleccionadas.value],
    madre: { ...coberturaMadre.value }
  })

  coberturasSeleccionadas.value = []
  coberturaMadre.value = null
}

const eliminarAgrupacion = (item: Agrupacion) => {
  agrupaciones.value = agrupaciones.value.filter(a => a !== item)
}

const editarAgrupacion = (item: Agrupacion) => {
  coberturasSeleccionadas.value = [...item.coberturas]
  coberturaMadre.value = item.madre
  eliminarAgrupacion(item)
}
const agrupacionCoberturas = ref<number>(0)
const coberturasBasi = ref<number[]>([])
const coberturasAdici = ref<number[]>([])
const detalleCapa = ref<number>(0)
const detalleC = ref<number | null>(null)
const detalleCobertura = ref<number>(0)
const cobertura = ref<string>('FALLECIMIENTO')
const tipoTarifa = ref<number | null>(null)
const primaTarFi = ref<number | null>(null)
const porSobrePrimaE = ref<number | null>(null)
const tarifaFijaM = ref<number | null>(null)
const factorTarifaP = ref<number | null>(null)
const tarifaPropia = ref<number | null>(null)

const itemsTablaTarifas = ref<any[]>([])


const hidratarDesdeStore = () => {
  const data = contratoStore.configReasegCob
  if (!data) return
  agrupacionCoberturas.value = data.agrupacionCoberturas
  agrupaciones.value = data.agrupaciones
  coberturasBasi.value = data.coberturasBasi
  coberturasAdici.value = data.coberturasAdici
  detalleCapa.value = data.detalleCapa
  itemsTablaTarifas.value = data.tarifas.map(t => ({
    detalleCapa: t.detalleCapa,
    tipoCobertura: t.tipoCobertura,
    cobertura: t.cobertura,
    tipoTarifa: Number(t.tipoTarifa),
    primaTarifa: t.primaTarifa,
    porSobrePrima: t.porSobrePrima,
    tarifaFijaM: t.tarifaFijaM,
    factorTap: t.factorTap,
    tarifaP: t.tarifaP
  }))
}

watch(
  [
    () => contratoStore.configReasegCob,
    () => coberturasOptions.value,
    () => coberturasBasiOptions.value,
    () => coberturasAdiciOptions.value,
    () => tipoTarifaOptions.value,
  ],
  hidratarDesdeStore,
  { immediate: true }
)

watch(esExcedentePorCapas, (habilitado) => {
  if (!habilitado) {
    detalleCapa.value = 1
  }
})

watch(detalleCapa, value => {
  if (value === 0) { // NO
    factorTarifaP.value = null
    tarifaPropia.value = null
  } else if (value === 1) { // SI
    primaTarFi.value = null
    porSobrePrimaE.value = null
    tarifaFijaM.value = null
  }
})

const agregarDetalleTarifa = () => {
  itemsTablaTarifas.value.push({
    detalleCapa: detalleCapa.value === 1 ? 'SI' : 'NO',
    tipoCobertura: 'ADICIONAL',
    cobertura: cobertura.value,
    tipoTarifa: tipoTarifa.value,
    primaTarifa: primaTarFi.value,
    porSobrePrima: porSobrePrimaE.value,
    tarifaFijaM: tarifaFijaM.value,
    factorTap: factorTarifaP.value,
    tarifaP: tarifaPropia.value
  })
}

const mostrarModalTarifa = ref(false)
const detalleTarifaSeleccionada = ref<any>(null)

const verDetalleTarifa = (item: any) => {
  detalleTarifaSeleccionada.value = item
  mostrarModalTarifa.value = true
}

const editandoIndex = ref<number>(-1)

const limpiarCamposDetalle = () => {
  cobertura.value = 'FALLECIMIENTO'
  tipoTarifa.value = null
  primaTarFi.value = null
  porSobrePrimaE.value = null
  tarifaFijaM.value = null
  factorTarifaP.value = 100
  tarifaPropia.value = null
  editandoIndex.value = -1
}

const agregarTarifa = () => {
  if (tipoTarifa.value === null) {
    dialog.show({ title: 'Error', message: 'Debe seleccionar un tipo de tarifa', type: DialogType.ERROR })
    return
  }

  const tipoCoberturaStore = computed(() =>
    contratoStore.configReaseg?.tipoCobertura ?? 0
  )

  const tipoCoberturaTexto = computed(() => {
    switch (tipoCoberturaStore.value) {
      case 0: return 'BÁSICA'
      case 1: return 'ADICIONAL'
      default: return 'N/A'
    }
  })


  const nuevaFila = {
    detalleCapa: detalleCapa.value === 1 ? (detalleC.value || 'SI') : 'NO',
    tipoCobertura: tipoCoberturaTexto.value,
    cobertura: cobertura.value,
    tipoTarifa: tipoTarifa.value,

    primaTarifa: tipoTarifa.value === 0 ? primaTarFi.value : null,
    porSobrePrima: tipoTarifa.value === 1 ? porSobrePrimaE.value : null,
    tarifaFijaM: tipoTarifa.value === 3 ? tarifaFijaM.value : null,
    factorTap: tipoTarifa.value === 2 ? factorTarifaP.value : null,
    tarifaP: tipoTarifa.value === 2 ? tarifaPropia.value : null
  }


  if (editandoIndex.value > -1) {
    itemsTablaTarifas.value[editandoIndex.value] = nuevaFila
  } else {
    itemsTablaTarifas.value.push(nuevaFila)
  }

  limpiarCamposDetalle()
}

const editarTarifa = (item: any, index: number) => {
  editandoIndex.value = index

  detalleCapa.value = item.detalleCapa === 'NO' ? 0 : 1
  if (item.detalleCapa !== 'SI' && item.detalleCapa !== 'NO') {
    detalleC.value = item.detalleCapa
  }

  cobertura.value = item.cobertura
  tipoTarifa.value = item.tipoTarifa
  primaTarFi.value = item.primaTarifa
  porSobrePrimaE.value = item.porSobrePrima
  tarifaFijaM.value = item.tarifaFijaM
  factorTarifaP.value = item.factorTap
  tarifaPropia.value = item.tarifaP

  window.scrollTo({ top: 400, behavior: 'smooth' })
}

const eliminarTarifa = (index: number) => {
  itemsTablaTarifas.value.splice(index, 1)
}


const guardarDatosGenerales = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'No existe contrato activo', type: DialogType.ERROR })
    return
  }

  let primaTarFiG = 0
  let porSobrePrimaEG = 0
  let tarifaFijaMG = 0
  let factorTarifaPG = 0
  let tarifaPropiaG = 0

  switch (tipoTarifa.value) {
    case 0:
      primaTarFiG = primaTarFi.value ?? 0
      break

    case 1:
      porSobrePrimaEG = porSobrePrimaE.value ?? 0
      break

    case 2:
      factorTarifaPG = factorTarifaP.value ?? 0
      tarifaPropiaG = tarifaPropia.value ?? 0
      break

    case 3:
      tarifaFijaMG = tarifaFijaM.value ?? 0
      break
  }

  contratoStore.setConfigReasCob({
    idContrato,
    agrupacionCoberturas: agrupacionCoberturas.value,
    agrupaciones: agrupaciones.value,
    coberturasBasi: coberturasBasi.value,
    coberturasAdici: coberturasAdici.value,
    detalleCapa: detalleCapa.value,
    detalleC: contratoStore.expc?.capas || [],
    detalleCobertura: detalleCobertura.value,
    tarifas: itemsTablaTarifas.value
  })


  dialog.show({ title: 'Información', message: 'Configuración guardada', type: DialogType.SUCCESS })
}

const headers1 = [
  { title: 'Cobertura', key: 'cobertura' },
  { title: 'Agrupar en:', key: 'agruparEn' },
  { title: 'Modificar', key: 'modificar' },
  { title: 'Borrar', key: 'borrar' }
]

const headers2 = [
  { title: 'Detalle capa', key: 'detalleCapa' },
  { title: 'Tipo cobertura', key: 'tipoCobertura' },
  { title: 'Cobertura', key: 'cobertura' },
  { title: 'Tipo de tarifa', key: 'tipoTarifa' },
  { title: 'Prima de tarifa fija', key: 'primaTarifa' },
  { title: '& sobre prima emitida', key: 'porSobrePrima' },
  { title: 'Tarifa fija al millar', key: 'tarifaFijaM' },
  { title: 'Factor tarifa propia', key: 'factorTap' },
  { title: 'Tarifa propia', key: 'tarifaP' },
  { title: 'Modificar', key: 'modificar' },
  { title: 'Borrar', key: 'borrar' }
]
</script>
