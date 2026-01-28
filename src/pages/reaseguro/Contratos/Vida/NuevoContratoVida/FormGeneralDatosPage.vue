<template>
  <v-form ref="formRef">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="subramoObj"
            :items="subramoOptions"
            label="Subramo"
            :rules="[ValidacionesContrato.subramo()]"
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
            :rules="[ValidacionesContrato.tipoContrato()]"
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
          <v-text-field
            v-model="displayLimiteMax"
            label="Limite máximo del contrato"
            variant="solo-filled"
            prefix="$"
            :rules="[ValidacionesContrato.numeroC21()]"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="displayLimiteMaxResCR"
            label="Limite máximo de responsabilidad"
            variant="solo-filled"
            prefix="$"
            :rules="[ValidacionesContrato.numeroC21()]"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="displayRetencionP"
            :disabled="Number(getID(tipoContratoObj)) === 3"
            label="Retención propia"
            variant="solo-filled"
            prefix="$"
            :rules="[ValidacionesContrato.numeroC21()]"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="[1, 7, 9].includes(Number(getID(tipoContratoObj)))">
          <v-text-field
            v-model="cesion"
            label="Cesión"
            suffix="%"
            variant="solo-filled"
            :rules="[ValidacionesContrato.cesion(() => Number(getID(tipoContratoObj)))]"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="[4, 5, 6].includes(Number(getID(tipoContratoObj)))">
          <v-text-field
            v-model="displayPiso"
            label="Piso"
            variant="solo-filled"
            prefix="$"
            :rules="[ValidacionesContrato.piso(() => Number(getID(tipoContratoObj)))]"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="[4, 5, 6].includes(Number(getID(tipoContratoObj)))">
          <v-text-field
            v-model="displayTecho"
            label="Techo"
            variant="solo-filled"
            prefix="$"
            :rules="[ValidacionesContrato.techo(() => Number(getID(tipoContratoObj)))]"
          />
        </v-col>

        <v-divider v-if="Number(getID(tipoContratoObj)) === 3" class="my-4" />

        <v-col cols="12" md="4" v-if="Number(getID(tipoContratoObj)) === 3">
          <v-text-field
            v-model="displayRetencionCapa"
            label="Retención propia capa N"
            variant="solo-filled"
            prefix="$"
          />
        </v-col>
        <v-col cols="12" md="4" v-if="Number(getID(tipoContratoObj)) === 3">
          <v-text-field
            v-model="displayTechoCapa"
            label="Techo capa N"
            variant="solo-filled"
            prefix="$"
          />
        </v-col>
        <v-col cols="12" md="1" v-if="Number(getID(tipoContratoObj)) === 3" class="d-flex align-center">
          <v-btn color="indigo" icon @click="agregarCapa">
            <v-icon>{{ capaEditando !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ capaEditando !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="Number(getID(tipoContratoObj)) === 3">
      <v-data-table :headers="headers1" :items="capas" hide-default-footer class="elevation-1">
        <template v-slot:item.retencionC="{ item }">
          $ {{ formatNumber(item.retencionC) }}
        </template>
        <template v-slot:item.techoC="{ item }">
          $ {{ formatNumber(item.techoC) }}
        </template>
        <template v-slot:item.acciones="{ item, index }">
          <v-btn icon color="blue" variant="text" @click="editarCapa(item, index)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon color="red" variant="text" @click="eliminarCapa(index)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-container>

    <v-col class="text-center mt-4">
      <v-btn class="btn-guardar" @click="guardarDatosGenerales">
        Guardar datos generales
      </v-btn>
    </v-col>
  </v-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { NuevoContratoVida } from './NuevoContratoDG.actions'
import { useContratoStore, type ContratoGeneralDatos } from '@/stores/contratoStore'
import { DialogType, useDialog } from '@/stores/dialogStore'
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref<any>(null)

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
const monedaObj = ref<any>(null)
const formaContractualObj = ref<any>(null)
const tipoReaseguroObj = ref<any>(null)
const tipoContratoObj = ref<any>(null)
const criterioCoberturaObj = ref<any>(null)

const idContrato = ref('')
const negociosCubiertos = ref('TODA LA CARTERA')
const inicioContrato = ref<any>(null)
const finContrato = ref<any>(null)

const limiteMax = ref<number>(0)
const limiteMaxResCR = ref<number>(0)
const retencionP = ref<number>(0)
const cesion = ref<string | number>('')
const piso = ref<number>(0)
const techo = ref<number>(0)

const capas = ref<any[]>([])
const retencionCapa = ref<number>(0)
const techoCapa = ref<number>(0)
const capaEditando = ref<number | null>(null)

const emit = defineEmits<{
  (e: 'actualizarFormaContractual', valor: number): void,
  (e: 'onSuccessRegister'): void
}>()

const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

const formatNumber = (val: any): string => {
  if (val === null || val === undefined || val === '') return '';
  let stringValue = String(val).replace(/[^0-9.]/g, '');
  const parts = stringValue.split('.');
  const entero = parts[0];
    if (entero) {
      parts[0] = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  return parts.join('.');
};

const parseNumber = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleanValue = val.replace(/,/g, '');
  return parseFloat(cleanValue) || 0;
};

const displayLimiteMax = computed({
  get: () => formatNumber(limiteMax.value),
  set: (val) => { limiteMax.value = parseNumber(val) }
});

const displayRetencionP = computed({
  get: () => formatNumber(retencionP.value),
  set: (val) => { retencionP.value = parseNumber(val) }
});

const displayLimiteMaxResCR = computed({
  get: () => formatNumber(limiteMaxResCR.value),
  set: (val) => { limiteMaxResCR.value = parseNumber(val) }
});

const displayPiso = computed({
  get: () => formatNumber(piso.value),
  set: (val) => { piso.value = parseNumber(val) }
});

const displayTecho = computed({
  get: () => formatNumber(techo.value),
  set: (val) => { techo.value = parseNumber(val) }
});

const displayRetencionCapa = computed({
  get: () => formatNumber(retencionCapa.value),
  set: (val) => { retencionCapa.value = parseNumber(val) }
});

const displayTechoCapa = computed({
  get: () => formatNumber(techoCapa.value),
  set: (val) => { techoCapa.value = parseNumber(val) }
});

watch(formaContractualObj, (newVal) => {
  const id = getID(newVal);
  emit('actualizarFormaContractual', Number(id));
}, { immediate: true });

const hidratarDesdeStore = () => {
  const g = contratoStore.general
  const e = contratoStore.expc
  if (!g) return

  idContrato.value = g.idContrato || ''
  negociosCubiertos.value = g.negociosCubiertos || ''
  inicioContrato.value = g.fechaInicio
  finContrato.value = g.fechaFin

  limiteMax.value = Number(g.limiteMax) || 0
  limiteMaxResCR.value = Number(g.limiteMaxResCR) || 0
  retencionP.value = Number(g.montoRetencion) || 0
  cesion.value = g.porcentajeCesion || ''
  piso.value = Number(g.piso) || 0
  techo.value = Number(g.techo) || 0
  capas.value = e?.capas || []

  if (subramoOptions.value.length > 0) {
    const ids = Array.isArray(g.subramo) ? g.subramo.map(getID) : []
    subramoObj.value = subramoOptions.value.filter(o => ids.includes(o.value))
  }
  if (monedaOptions.value.length > 0) {
    monedaObj.value = monedaOptions.value.find(o => o.value === getID(g.cveMoneda))
  }
  if (formaContractualOptions.value.length > 0) {
    formaContractualObj.value = formaContractualOptions.value.find(o => o.value === getID(g.cveFormaContractual))
  }
  if (tipoReaseguroOptions.value.length > 0) {
    tipoReaseguroObj.value = tipoReaseguroOptions.value.find(o => o.value === getID(g.cveTReaseguro))
  }
  if (tipoContratoOptions.value.length > 0) {
    tipoContratoObj.value = tipoContratoOptions.value.find(o => Number(o.value) === Number(getID(g.idTContrato)))
  }
  if (criterioCoberturaOptions.value.length > 0) {
    criterioCoberturaObj.value = criterioCoberturaOptions.value.find(o => o.value === getID(g.criterioCobertura))
  }
}

watch(
  [() => contratoStore.general, subramoOptions, monedaOptions, formaContractualOptions, tipoReaseguroOptions, tipoContratoOptions, criterioCoberturaOptions],
  () => hidratarDesdeStore(),
  { immediate: true, deep: true }
)

const agregarCapa = () => {
  if (!retencionCapa.value || !techoCapa.value) return
  const index = capaEditando.value !== null ? capaEditando.value + 1 : capas.value.length + 1
  const detalle = `EXCEDENTE CAPA ${index}`
  const nuevaCapa = { detalleCapa: detalle, retencionC: retencionCapa.value, techoC: techoCapa.value }

  if (capaEditando.value !== null) {
    capas.value[capaEditando.value] = nuevaCapa
    capaEditando.value = null
  } else {
    capas.value.push(nuevaCapa)
  }
  retencionCapa.value = 0; techoCapa.value = 0
}

const editarCapa = (item: any, index: number) => {
  retencionCapa.value = item.retencionC; techoCapa.value = item.techoC; capaEditando.value = index
}

const eliminarCapa = (index: number) => {
  capas.value.splice(index, 1)
  capas.value.forEach((c, i) => c.detalleCapa = `EXCEDENTE CAPA ${i + 1}`)
}

const guardarDatosGenerales = async () => {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) {
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
    limiteMax: String(limiteMax.value),
    limiteMaxResCR: String(limiteMaxResCR.value),
    montoRetencion: String(retencionP.value),
    piso: String(piso.value),
    techo: String(techo.value),
    porcentajeCesion: String(cesion.value),
  }

  contratoStore.setGeneral(payload)

  if (getID(tipoContratoObj.value) === 3) {
    contratoStore.setDatosExPC({ idContrato: idContrato.value, capas: capas.value })
  }

  dialog.show({ title: 'Éxito', message: 'Datos de contrato general guardados', type: DialogType.SUCCESS })

  emit('onSuccessRegister')
}

const headers1 = [
  { title: 'Detalle de Capa', key: 'detalleCapa' },
  { title: 'Retención propia', key: 'retencionC' },
  { title: 'Techo', key: 'techoC' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
