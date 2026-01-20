<template>
  <v-form ref="formRef">
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="4">
          <v-select
            v-model="agrupacionCoberturas"
            :items="siNoOptions"
            label="¿Agrupación de coberturas?"
            chips
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center align-center" v-if="agrupacionCoberturas === 1">
        <v-col cols="12" md="5">
          <p class="text-subtitle-2 mb-2">Coberturas para agrupar:</p>
          <v-data-table
            v-model="coberturasParaAgrupar"
            :headers="[{ title: 'Coberturas Disponibles', key: 'title' }]"
            :items="coberturasDisponiblesParaAgrupar"
            show-select
            item-value="value"
            return-object
            density="compact"
            max-height="300px"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="coberturaMadreObj"
            :items="coberturasDisponiblesParaAgrupar"
            item-title="title"
            chips
            return-object
            label="Agrupar en (Cobertura Madre):"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn color="indigo" icon @click="agregarAgrupacion">
            <v-icon>{{ editandoAgrupacionIndex !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editandoAgrupacionIndex !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
            </v-tooltip>
          </v-btn>
        </v-col>

        <v-col cols="12" md="10" v-if="agrupaciones.length > 0">
          <v-data-table :headers="headersAgrupacion" :items="agrupaciones" hide-default-footer>
            <template v-slot:item.coberturas="{ item }">
              {{ item.coberturas.map((c: any) => c.title).join(', ') }}
            </template>
            <template v-slot:item.madre="{ item }">
              <v-chip color="primary" label>{{ item.madre?.title }}</v-chip>
            </template>
            <template v-slot:item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" @click="editarAgrupacion(item, index)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon color="red" variant="text" @click="eliminarAgrupacion(index)"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasBasiObj"
            :items="coberturasBasiOptions"
            label="Coberturas básicas"
            item-title="title"
            return-object
            multiple
            chips
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasAdiciObj"
            :items="coberturasAdiciOptions"
            label="Coberturas adicionales"
            item-title="title"
            return-object
            multiple
            chips
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCapa"
            :items="siNoOptions"
            label="¿Detalle por capa?"
            chips
            :disabled="!esExcedentePorCapas"
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12" md="4" v-if="detalleCapa === 1">
          <v-select
            v-model="capaSeleccionada"
            :items="detalleCOptions"
            chips
            label="Detalle de capa"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCobertura"
            :items="siNoOptions"
            chips
            label="¿Detalle por cobertura?"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4" v-if="detalleCobertura === 1 || detalleCapa === 1">
          <v-select
            v-model="coberturaTarifaObj"
            label="Cobertura"
            :items="coberturasPermitidasParaTarifa"
            item-title="title"
            chips
            return-object
            hide-selected
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="tipoTarifaObj"
            :items="tipoTarifaOptions"
            label="Tipo de tarifa"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 0">
          <v-text-field v-model.number="primaTarFi" label="Monto Fijo" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]" />
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 1">
          <v-text-field v-model.number="porSobrePrimaE" label="% Prima" suffix="%" type="number" variant="solo-filled" :rules="[ValidacionesContrato.participacion()]"/>
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 3">
          <v-text-field v-model.number="tarifaFijaM" label="Tasa al millar" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]"/>
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 2">
          <v-text-field v-model.number="factorTarifaP" label="Factor %" type="number" variant="solo-filled" :rules="[ValidacionesContrato.participacion()]"/>
        </v-col>

        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 2">
          <v-select
            v-model="tarifaPropiaObj"
            :items="tarifasPropiasOptions"
            item-title="title"
            return-object
            label="Tarifa propia"
            chips
            multiple
            variant="solo-filled"
            :rules="[v => !!v || 'Debe seleccionar una tarifa propia']"
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn color="indigo" icon @click="agregarTarifa">
            <v-icon>{{ editandoIndex !== -1 ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editandoIndex !== -1 ? 'Actualizar registro' : 'Agregar detalle tarifa' }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="itemsTablaTarifas.length > 0">
        <v-col cols="12">
          <v-data-table
            :headers="headers2"
            :items="itemsTablaTarifas"
            class="elevation-1"
          >
            <template #item.tipoTarifa="{ item }">
              {{ item.tipoTarifa?.title }}
            </template>

            <template #item.primaTarifa="{ item }">
              <span v-if="item.tipoTarifa?.value === 0">$ {{ item.primaTarifa }}</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.porSobrePrima="{ item }">
              <span v-if="item.tipoTarifa?.value === 1">{{ item.porSobrePrima }}%</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.tarifaFijaM="{ item }">
              <span v-if="item.tipoTarifa?.value === 3">{{ item.tarifaFijaM }}</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.factorTap="{ item }">
              <span v-if="item.tipoTarifa?.value === 2">{{ item.factorTap }}%</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.tarifaP="{ item }">
              <div v-if="item.tipoTarifa?.value === 2 && item.nombreArchivo">
                <v-icon size="small" color="green" class="mr-1">mdi-file-csv</v-icon>
                <small>{{ item.nombreArchivo }}</small>
              </div>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" size="small" @click="editarTarifa(item, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" variant="text" size="small" @click="eliminarTarifa(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col class="text-center">
          <v-btn class="btn-guardar" @click="guardarTodoEnStore">
            GUARDAR COBERTURAS
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContratoStore, type ContratoGeneralReasegCobertura } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref()
const isHydrating = ref(true)

const {
  coberturasOptions, fetchCoberturas,
  coberturasBasiOptions, fetchCoberturasBasicas,
  coberturasAdiciOptions, fetchCoberturasAdicionales,
  tipoTarifaOptions, fetchTipoTarifa,
  tarifasPropiasOptions, fetchTarifaPropia
} = NuevoContratoVidaConR()

const siNoOptions = [{ title: 'SI', value: 1 }, { title: 'NO', value: 0 }]

const agrupacionCoberturas = ref(0)
const coberturasParaAgrupar = ref<any[]>([])
const coberturaMadreObj = ref<any>(null)
const agrupaciones = ref<any[]>([])

const coberturasBasiObj = ref<any[]>([])
const coberturasAdiciObj = ref<any[]>([])
const detalleCapa = ref(0)
const capaSeleccionada = ref<string | null>(null)

const detalleCobertura = ref(0)
const coberturaTarifaObj = ref<any>(null)
const tipoTarifaObj = ref<any>(null)
const primaTarFi = ref<number | null>(null)
const porSobrePrimaE = ref<number>(100)
const tarifaFijaM = ref<number | null>(null)
const factorTarifaP = ref<number>(100)
const tarifaPropiaObj = ref<any>(null)
const itemsTablaTarifas = ref<any[]>([])
const editandoIndex = ref(-1)
const editandoAgrupacionIndex = ref<number | null>(null)

const getID = (item: any) => {
  if (item === null || item === undefined) return null;
  return (typeof item === 'object' && 'value' in item) ? item.value : item;
}

watch(() => tipoTarifaObj.value, tipo => {
  if (isHydrating.value) return

  primaTarFi.value = 0
  porSobrePrimaE.value = 0
  tarifaFijaM.value = 0
  factorTarifaP.value = 0
  tarifaPropiaObj.value = null

  if (!tipo) return

  if (tipo.value === 1) porSobrePrimaE.value = 100
  if (tipo.value === 2) factorTarifaP.value = 100
})

watch(
  [() => getID(tipoTarifaObj.value), () => coberturaTarifaObj.value],
  ([tipo, cobertura]) => {
    if (tipo !== 2) {
      tarifaPropiaObj.value = ''
      return
    }
    if (!tarifaPropiaObj.value && cobertura?.title) {
      tarifaPropiaObj.value = cobertura.title
    }
  }
)

const esExcedentePorCapas = computed(() => {
  const id = getID(contratoStore.general?.idTContrato);
  return Number(id) === 3;
})

watch(esExcedentePorCapas, (valido) => {
  if (!valido) {
    detalleCapa.value = 0;
  }
})

const detalleCOptions = computed(() => contratoStore.expc?.capas.map(c => ({ title: c.detalleCapa, value: c.detalleCapa })) || [])

const coberturasDisponiblesParaAgrupar = computed(() => {
  const idsAgrupados = agrupaciones.value.flatMap(a => a.coberturas.map((c: any) => c.value))
  return coberturasOptions.value.filter(c => !idsAgrupados.includes(c.value))
})

const coberturasPermitidasParaTarifa = computed(() => {
  const idsPermitidos = [...coberturasBasiObj.value.map(c => c.value), ...coberturasAdiciObj.value.map(c => c.value)]
  return coberturasOptions.value.filter(c => idsPermitidos.includes(c.value))
})


const hidratarDesdeStore = () => {
  const data = contratoStore.configReasegCob
  if (!data || Object.keys(data).length === 0) return
  agrupacionCoberturas.value = data.agrupacionCoberturas ?? 0
  agrupaciones.value = data.agrupaciones || []
  coberturasBasiObj.value = data.coberturasBasi || []
  coberturasAdiciObj.value = data.coberturasAdici || []
  detalleCapa.value = data.detalleCapa ?? 0
  detalleCobertura.value = data.detalleCobertura ?? 0
  itemsTablaTarifas.value = data.tarifas ? [...data.tarifas] : []
}

watch([() => coberturasOptions.value, () => tipoTarifaOptions.value], ([c, t]) => {
  if (c.length > 0 && t.length > 0) hidratarDesdeStore()
}, { immediate: true })

onMounted(async () => {
  await Promise.all([fetchCoberturas(), fetchCoberturasBasicas(), fetchCoberturasAdicionales(), fetchTipoTarifa(), fetchTarifaPropia()])
})

const agregarAgrupacion = () => {
  if (coberturasParaAgrupar.value.length === 0 || !coberturaMadreObj.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Faltan datos de agrupación', title: 'Error' }); return
  }
  agrupaciones.value.push({ coberturas: [...coberturasParaAgrupar.value], madre: { ...coberturaMadreObj.value } })
  coberturasParaAgrupar.value = []; coberturaMadreObj.value = null
}

const eliminarAgrupacion = (index: number) => agrupaciones.value.splice(index, 1)

const editarAgrupacion = (item: any, index: number) => {
  coberturasParaAgrupar.value = [...item.coberturas]; coberturaMadreObj.value = item.madre; eliminarAgrupacion(index)
}

const agregarTarifa = () => {
  if (tipoTarifaObj.value === null || coberturaTarifaObj.value === null) {
    dialog.show({ type: DialogType.ERROR, message: 'Seleccione cobertura y tipo de tarifa', title: 'Error' });
    return
  }

  if (detalleCapa.value === 1 && !capaSeleccionada.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Debe seleccionar una capa específica del listado', title: 'Error' });
    return
  }

  const nuevaCob = coberturaTarifaObj.value.value;
  const nuevaTarifaTipo = tipoTarifaObj.value.value;

  const tarifaExistenteIndex = itemsTablaTarifas.value.findIndex(t => t.cveCob === nuevaCob);
  if (tarifaExistenteIndex !== -1 && tarifaExistenteIndex !== editandoIndex.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Ya existe una tarifa para la cobertura seleccionada', title: 'Error' });
    return
  }

  const tarifaTipoExistenteIndex = itemsTablaTarifas.value.findIndex(t => t.cveCob === nuevaCob && t.tipoTarifa.value === nuevaTarifaTipo);
  if (tarifaTipoExistenteIndex !== -1 && tarifaTipoExistenteIndex !== editandoIndex.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Ya existe una tarifa con el mismo tipo para la cobertura seleccionada', title: 'Error' });
    return
  }

  const tipoGlobalExistente = itemsTablaTarifas.value.find((t, index) =>
    t.tipoTarifa.value === nuevaTarifaTipo && index !== editandoIndex.value
  );

  if (tipoGlobalExistente) {
    dialog.show({
      type: DialogType.ERROR,
      message: `El tipo de tarifa "${tipoTarifaObj.value.title}" ya ha sido asignado a la cobertura "${tipoGlobalExistente.cobertura}". No se puede duplicar en otra cobertura.`,
      title: 'Error'
    });
    return
  }

  const esBasica = coberturasBasiObj.value.some(c => c.value === coberturaTarifaObj.value.value);
  const tipoCoberturaTexto = esBasica ? 'BÁSICA' : 'BADI';

  const nuevaFila = {
    detalleCapa: detalleCapa.value === 1 ? capaSeleccionada.value : 'NO',
    tipoCobertura: tipoCoberturaTexto,
    cobertura: coberturaTarifaObj.value.title,
    cveCob: coberturaTarifaObj.value.value,
    tipoTarifa: { ...tipoTarifaObj.value },
    primaTarifa: primaTarFi.value || 0,
    porSobrePrima: porSobrePrimaE.value || 0,
    tarifaFijaM: tarifaFijaM.value || 0,
    factorTap: factorTarifaP.value || 0,
    tarifaPropia: tarifaPropiaObj.value?.title ?? (typeof tarifaPropiaObj.value === 'string' ? tarifaPropiaObj.value : '')
  }

  if (editandoIndex.value > -1) {
    itemsTablaTarifas.value[editandoIndex.value] = nuevaFila
    editandoIndex.value = -1
  } else {
    itemsTablaTarifas.value.push(nuevaFila)
  }

  limpiarTarifa()
}
const limpiarTarifa = () => {
  coberturaTarifaObj.value = null;
  tipoTarifaObj.value = null;
  primaTarFi.value = 0;
  porSobrePrimaE.value = 0;
  tarifaFijaM.value = 0;
  factorTarifaP.value = 0;
  tarifaPropiaObj.value = null
}

const editarTarifa = (item: any, index: number) => {
  editandoIndex.value = index
  coberturaTarifaObj.value = coberturasOptions.value.find(c => c.value === item.cveCob)
  tipoTarifaObj.value = item.tipoTarifa
  primaTarFi.value = item.primaTarifa; porSobrePrimaE.value = item.porSobrePrima
  tarifaFijaM.value = item.tarifaFijaM; factorTarifaP.value = item.factorTap
}

const eliminarTarifa = (index: number) => itemsTablaTarifas.value.splice(index, 1)

const guardarTodoEnStore = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) { dialog.show({ type: DialogType.ERROR, message: 'No hay contrato activo', title: 'Error' }); return }

  const payload: any = {
    idContrato,
    agrupacionCoberturas: agrupacionCoberturas.value,
    agrupaciones: agrupaciones.value,
    coberturasBasi: coberturasBasiObj.value,
    coberturasAdici: coberturasAdiciObj.value,
    detalleCapa: detalleCapa.value,
    detalleC: contratoStore.expc?.capas || [],
    detalleCobertura: detalleCobertura.value,
    tarifas: itemsTablaTarifas.value
  }

  contratoStore.setConfigReasCob(payload)
  dialog.show({ type: DialogType.SUCCESS, message: 'Configuración de coberturas guardada', title: 'Éxito' })
}

const headersAgrupacion = [
  { title: 'Coberturas', key: 'coberturas' }, { title: 'Agrupar en:', key: 'madre' }, { title: 'Acciones', key: 'acciones', sortable: false }
]
const headers2 = [
  { title: 'Detalle capa', key: 'detalleCapa' },
  { title: 'Tipo cobertura', key: 'tipoCobertura' },
  { title: 'Cobertura', key: 'cobertura' },
  { title: 'Tipo de tarifa', key: 'tipoTarifa' },
  { title: 'Prima Fija', key: 'primaTarifa' },
  { title: '% Prima Em.', key: 'porSobrePrima' },
  { title: 'Tarifa al Millar', key: 'tarifaFijaM' },
  { title: 'Factor Propio', key: 'factorTap' },
  { title: 'Tarifa Propia', key: 'tarifaPropia' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
