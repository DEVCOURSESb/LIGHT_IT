<template>
  <v-form ref="formRef">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="subramoObj"
            :items="subramoOptions"
            label="Subramo"
            :rules="[v => (v && v.length > 0) || 'Subramo requerido']"
            required
            variant="solo-filled"
            multiple
            chips
            return-object
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="idContrato"
            label="Identificador de contrato"
            @input="idContrato = idContrato.toUpperCase()"
            :rules="ValidacionesContrato.idContrato()"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="negociosCubiertos"
            label="Negocios cubiertos"
            :rules="ValidacionesContrato.negociosCubiertos()"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="monedaObj"
            :items="monedaOptions"
            label="Moneda"
            :rules="[ValidacionesContrato.moneda()]"
            required
            variant="solo-filled"
            chips
            return-object
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-date-input
            v-model="inicioContrato"
            label="Fecha inicio contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            :rules="[ValidacionesContrato.fechaInicio()]"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-date-input
            v-model="finContrato"
            label="Fecha fin contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            :rules="[ValidacionesContrato.fechaFin(() => inicioContrato)]"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="formaContractualObj"
            :items="formaContractualOptions"
            label="Forma contractual"
            required
            chips
            variant="solo-filled"
            return-object
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="tipoReaseguroObj"
            label="Tipo de reaseguro"
            :items="tipoReaseguroOptions"
            required
            chips
            variant="solo-filled"
            return-object
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="tipoContratoObj"
            :items="tipoContratoOptions"
            label="Tipo de contrato"
            variant="solo-filled"
            chips
            :rules="[v => !!v || 'Requerido']"
            return-object
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="criterioCoberturaObj"
            :items="criterioCoberturaOptions"
            label="Criterio de cobertura"
            :rules="[v => !!v || 'Requerido']"
            required
            chips
            variant="solo-filled"
            return-object
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="limiteMax" label="Limite máximo del contrato" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="limiteMaxResCR" label="Limite máximo de responsabilidad" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="retencionP"
            :disabled="tipoContratoObj?.value === 3"
            label="Retención propia"
            variant="solo-filled"
          />
        </v-col>

        <template v-if="tipoContratoObj?.value !== 3">
          <v-col cols="12" md="4">
            <v-text-field v-model="cesion" label="Cesión" suffix="%" variant="solo-filled" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="piso" label="Piso" type="number" variant="solo-filled" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="techo" label="Techo" type="number" variant="solo-filled" />
          </v-col>
        </template>

        <v-divider v-if="tipoContratoObj?.value === 3" />
        <v-col cols="12" md="4" v-if="tipoContratoObj?.value === 3">
          <v-text-field v-model="retencionCapa" label="Retención propia capa N" type="number" variant="solo-filled" />
        </v-col>
        <v-col cols="12" md="4" v-if="tipoContratoObj?.value === 3">
          <v-text-field v-model="techoCapa" label="Techo capa N" type="number" variant="solo-filled" />
        </v-col>
        <v-col cols="12" md="1" v-if="tipoContratoObj?.value === 3" class="d-flex align-center">
          <v-btn color="indigo" icon="mdi-plus" @click="agregarCapa" />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="tipoContratoObj?.value === 3">
      <v-data-table :headers="headers1" :items="capas" hide-default-footer>
        <template v-slot:item.acciones="{ item, index }">
          <v-btn icon color="blue" variant="text" @click="editarCapa(item, index)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon color="red" variant="text" @click="eliminarCapa(index)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-container>

    <v-col class="text-center">
      <v-btn class="btn-guardar" @click="guardarDatosGenerales">
        Guardar datos generales
      </v-btn>
    </v-col>
  </v-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { NuevoContratoVida } from './NuevoContratoDG.actions'
import { useContratoStore, type ContratoGeneralDatos } from '@/stores/contratoStore'
import { DialogType, useDialog } from '@/stores/dialogStore'
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref()

const {
  subramoOptions, fetchSubramos,
  monedaOptions, fetchMoneda,
  formaContractualOptions, fetchFormaContractual,
  tipoReaseguroOptions, fetchTipoReaseguro,
  tipoContratoOptions, fetchTipoContrato,
  criterioCoberturaOptions, fetchCriterioCobertura,
} = NuevoContratoVida()

onMounted(async () => {
  await Promise.all([
    fetchSubramos(), fetchMoneda(), fetchFormaContractual(),
    fetchTipoReaseguro(), fetchTipoContrato(), fetchCriterioCobertura()
  ])
})

const subramoObj = ref<any[]>([])
const monedaObj = ref<any>([])
const formaContractualObj = ref<any>(null)
const tipoReaseguroObj = ref<any>(null)
const tipoContratoObj = ref<any>(null)
const criterioCoberturaObj = ref<any>(null)

const idContrato = ref('')
const negociosCubiertos = ref('TODA LA CARTERA')
const inicioContrato = ref<any>(null)
const finContrato = ref<any>(null)
const limiteMax = ref('0')
const limiteMaxResCR = ref('0')
const retencionP = ref('0')
const cesion = ref('')
const piso = ref('0')
const techo = ref('0')

const emit = defineEmits<{
  (e: 'actualizarFormaContractual', valor: number): void
}>()

watch(formaContractualObj, (newVal) => {
  const id = newVal && typeof newVal === 'object' ? newVal.value : newVal;

  emit('actualizarFormaContractual', Number(id));
}, { immediate: true });

const capas = ref<any[]>([])
const retencionCapa = ref('')
const techoCapa = ref('')
const capaEditando = ref<number | null>(null)

const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

const hidratarDesdeStore = () => {
  const g = contratoStore.general
  if (!g) return

  idContrato.value = g.idContrato || ''
  negociosCubiertos.value = g.negociosCubiertos || ''
  inicioContrato.value = g.fechaInicio
  monedaObj.value = g.cveMoneda
  finContrato.value = g.fechaFin
  limiteMax.value = g.limiteMax || '0'
  limiteMaxResCR.value = g.limiteMaxResCR || '0'
  retencionP.value = g.montoRetencion || '0'
  cesion.value = g.porcentajeCesion || ''
  piso.value = g.piso || '0'
  techo.value = g.techo || '0'

  if (subramoOptions.value.length > 0) {
    const ids = Array.isArray(g.subramo) ? g.subramo.map(getID) : []
    subramoObj.value = subramoOptions.value.filter(o => ids.includes(o.value))
  }
  if (monedaOptions.value.length > 0 && g.cveMoneda) {
    const targetId = getID(g.cveMoneda)
    monedaObj.value = monedaOptions.value.find(o => o.value === targetId)
  }
  //Este es para cuando moneda sea de opcion multiple
  /*if (monedaOptions.value.length > 0) {
    const ids = Array.isArray(g.cveMoneda) ? g.cveMoneda.map(getID) : []
    monedaObj.value = monedaOptions.value.filter(o => ids.includes(o.value))
  }*/

  if (formaContractualOptions.value.length > 0) {
    formaContractualObj.value = formaContractualOptions.value.find(o => o.value === getID(g.cveFormaContractual))
  }

  if (tipoReaseguroOptions.value.length > 0) {
    tipoReaseguroObj.value = tipoReaseguroOptions.value.find(o => o.value === getID(g.cveTReaseguro))
  }
  
  if (tipoContratoOptions.value.length > 0) {
    const targetId = getID(g.idTContrato);
    tipoContratoObj.value = tipoContratoOptions.value.find(o => Number(o.value) === Number(targetId));
  }

  if (criterioCoberturaOptions.value.length > 0) {
    criterioCoberturaObj.value = criterioCoberturaOptions.value.find(o => o.value === getID(g.criterioCobertura))
  }

  if (g.idTContrato === 3 && contratoStore.expc) {
    capas.value = [...contratoStore.expc.capas]
  }
}

watch(
  [
    () => contratoStore.general,
    subramoOptions,
    monedaOptions,
    formaContractualOptions,
    tipoReaseguroOptions,
    tipoContratoOptions,
    criterioCoberturaOptions
  ],
  () => hidratarDesdeStore(),
  { immediate: true, deep: true }
)

const agregarCapa = () => {
  if (!retencionCapa.value || !techoCapa.value) return
  const detalle = capaEditando.value !== null ? `EXCEDENTE CAPA ${capaEditando.value + 1}` : `EXCEDENTE CAPA ${capas.value.length + 1}`
  const nuevaCapa = { detalleCapa: detalle, retencionC: retencionCapa.value, techoC: techoCapa.value }

  if (capaEditando.value !== null) {
    capas.value[capaEditando.value] = nuevaCapa
    capaEditando.value = null
  } else {
    capas.value.push(nuevaCapa)
  }
  retencionCapa.value = ''; techoCapa.value = ''
}

const editarCapa = (item: any, index: number) => {
  retencionCapa.value = item.retencionC; techoCapa.value = item.techoC; capaEditando.value = index
}

const eliminarCapa = (index: number) => {
  capas.value.splice(index, 1)
  capas.value.forEach((c, i) => c.detalleCapa = `EXCEDENTE CAPA ${i + 1}`)
}

const guardarDatosGenerales = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) {
    dialog.show({ title: 'Atención', message: 'Complete los campos obligatorios', type: DialogType.ERROR })
    return
  }

  const payload: ContratoGeneralDatos = {
    idContrato: idContrato.value,
    subramo: subramoObj.value,
    negociosCubiertos: negociosCubiertos.value,
    fechaInicio: inicioContrato.value,
    fechaFin: finContrato.value,
    cveMoneda: monedaObj.value,
    cveFormaContractual: formaContractualObj.value,
    cveTReaseguro: tipoReaseguroObj.value,
    idTContrato: tipoContratoObj.value,
    criterioCobertura: criterioCoberturaObj.value,
    limiteMax: limiteMax.value,
    limiteMaxResCR: limiteMaxResCR.value,
    montoRetencion: retencionP.value,
    piso: piso.value,
    techo: techo.value,
    porcentajeCesion: cesion.value,
  }

  contratoStore.setGeneral(payload)

  if (tipoContratoObj.value?.value === 3) {
    contratoStore.setDatosExPC({
      idContrato: idContrato.value,
      capas: capas.value,
    })
  }

  dialog.show({ title: 'Éxito', message: 'Datos de contrato general guardados', type: DialogType.SUCCESS })
}

const headers1 = [
  { title: 'Detalle de Capa', key: 'detalleCapa' },
  { title: 'Retención propia', key: 'retencionC' },
  { title: 'Techo', key: 'techoC' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
