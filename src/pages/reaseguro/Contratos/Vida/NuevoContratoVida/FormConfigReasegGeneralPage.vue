<template>
  <v-form ref="formRef">
    <v-container>
      <v-row class="align-center">
        <v-col cols="12" md="6">
          <v-select
            ref="companiaReasegRef"
            v-model="companiaReasegObj"
            :items="compaReasegOptions"
            label="Compañía reaseguradora"
            item-title="title"
            return-object
            chips
            variant="solo-filled"
            :rules="[v => ValidacionesContrato.companiaReaseg(reaseguradores)(getID(v))]"
          />
        </v-col>
        <v-col cols="12" md="5">
          <div class="text-caption grey--text">Participación (%)</div>
          <v-slider v-model="participacion" min="0" max="100" step="0.01" thumb-label color="indigo" hide-details>
            <template v-slot:append>
              <v-text-field
                ref="participacionRef"
                v-model.number="participacion"
                type="number"
                style="width: 110px"
                variant="solo-filled"
                density="compact"
                hide-details
                suffix="%"
                :rules="[ValidacionesContrato.participacion()]"
              />
            </template>
          </v-slider>
        </v-col>
        <v-col cols="12" md="1" class="d-flex justify-center">
          <v-btn color="indigo" icon="mdi-plus" size="small" elevation="2" @click="agregarReaseguradora" />
        </v-col>
      </v-row>

      <v-row v-if="reaseguradores.length > 0">
        <v-col cols="12">
          <v-data-table :headers="headersReaseg" :items="reaseguradores" density="compact" class="elevation-1 mt-4">
            <template #item.participacion="{ item }">
              {{ Number(item.participacion).toFixed(2) }}%
            </template>
            <template #item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" size="small" @click="editarReaseg(item, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" variant="text" size="small" @click="eliminarReaseg(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <br>

      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="indicadorDistrCObj"
            :items="indicadorDistrCOptions"
            label="Indicador Distr. Cesión"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
            :rules="[v => !!v || 'Requerido']"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="cesionCoberBasiObj"
            :items="siNoOptions"
            label="¿Cesión sobre la cobertura BÁSICA?"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="comisionReasegObj"
            :items="siNoOptions"
            label="¿Comisión de reaseguro?"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCoberturaObj"
            :items="siNoOptions"
            label="¿Detalle por cobertura?"
            :disabled="getID(comisionReasegObj) !== 1"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="tipoComisionObj"
            :items="tipoComisionOptions"
            label="Tipo de comisión"
            :disabled="getID(comisionReasegObj) !== 1"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="tipoCoberturaObj"
            :items="tipoCoberturaOptions"
            label="Tipo de cobertura"
            :disabled="getID(detalleCoberturaObj) !== 1"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row v-if="getID(comisionReasegObj) === 1" class="mt-4">
        <v-col cols="12" md="6">
          <div class="text-subtitle-2 d-flex align-center mb-2">
            % Comisión primer año (Fija/Provisional)
            <v-tooltip activator="parent" location="top" max-width="350">
              Si la comisión es igual para el primer año y sus renovaciones, se deberá colocar el mismo dato en ambos campos.
            </v-tooltip>
          </div>
          <v-slider v-model="comisionPrimerAnio" min="0" max="100" step="0.01" thumb-label color="orange">
            <template v-slot:append>
              <v-text-field
                v-model.number="comisionPrimerAnio"
                type="number" style="width: 110px" density="compact" hide-details suffix="%" variant="solo-filled"
              />
            </template>
          </v-slider>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2 d-flex align-center mb-2">
            % Comisión renovación (Fija/Provisional)
            <v-tooltip activator="parent" location="top" max-width="350">
              Si la comisión es igual para el primer año y sus renovaciones, se deberá colocar el mismo dato en ambos campos.
            </v-tooltip>
          </div>
          <v-slider v-model="comisionRenovacion" min="0" max="100" step="0.01" thumb-label color="orange">
            <template v-slot:append>
              <v-text-field
                v-model.number="comisionRenovacion"
                type="number" style="width: 110px" density="compact" hide-details suffix="%" variant="solo-filled"
              />
            </template>
          </v-slider>
        </v-col>
      </v-row>

      <v-col class="text-center mt-10">
        <v-btn class="btn-guardar" elevation="4" @click="guardarConfigReaseguro">
          GUARDAR CONFIGURACIÓN GENERAL
        </v-btn>
      </v-col>
    </v-container>
  </v-form>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { useContratoStore, type ContratoGeneralConfReaseg } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref()

const siNoOptions = [{ title: 'SI', value: 1 }, { title: 'NO', value: 0 }]

const {
  compaReasegOptions, fetchReaseguradores,
  indicadorDistrCOptions, fetchIndicadorDistriC,
  tipoComisionOptions, fetchTipoComision,
  tipoCoberturaOptions, fetchTipoCobertura
} = NuevoContratoVidaConR()

const companiaReasegObj = ref<any>(null)
const participacion = ref<number>(100.00)
const indicadorDistrCObj = ref<any>(null)
const cesionCoberBasiObj = ref<any>(null)
const comisionReasegObj = ref<any>(null)
const detalleCoberturaObj = ref<any>(null)
const tipoComisionObj = ref<any>(null)
const tipoCoberturaObj = ref<any>(null)
const comisionPrimerAnio = ref<number>(0)
const comisionRenovacion = ref<number>(0)
const reaseguradores = ref<any[]>([])
const editIndex = ref<number | null>(null)

const companiaReasegRef = ref()
const participacionRef = ref()

const getID = (item: any) => {
  if (item === null || item === undefined) return null;
  return (typeof item === 'object' && 'value' in item) ? item.value : item;
}

const editarReaseg = (item: any, index: number) => {
  companiaReasegObj.value = compaReasegOptions.value.find(o => o.value === item.cveReasegurador)
  participacion.value = item.participacion
  editIndex.value = index
}

const eliminarReaseg = (index: number) => {
  reaseguradores.value.splice(index, 1)
}

onMounted(async () => {
  await Promise.all([
    fetchReaseguradores(),
    fetchIndicadorDistriC(),
    fetchTipoComision(),
    fetchTipoCobertura()
  ])

  if (!contratoStore.configReaseg) {
    indicadorDistrCObj.value = indicadorDistrCOptions.value.find(o => Number(o.value) === 0) || indicadorDistrCOptions.value[0]
    cesionCoberBasiObj.value = siNoOptions.find(o => o.value === 1)
    comisionReasegObj.value = siNoOptions.find(o => o.value === 0)
    detalleCoberturaObj.value = siNoOptions.find(o => o.value === 0)
    tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
  } else {
    hidratar()
  }
})

watch(() => getID(comisionReasegObj.value), (val) => {
  if (val === 1) { // SI
    if (!detalleCoberturaObj.value) detalleCoberturaObj.value = siNoOptions.find(o => o.value === 0)
    if (!tipoComisionObj.value) tipoComisionObj.value = tipoComisionOptions.value.find(o => Number(o.value) === 0)
  } else { // NO
    detalleCoberturaObj.value = null
    tipoComisionObj.value = null
    tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
    comisionPrimerAnio.value = 0
    comisionRenovacion.value = 0
  }
})

watch(() => getID(detalleCoberturaObj.value), (val) => {
  if (val === 1) {
    tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 0)
  } else if (getID(comisionReasegObj.value) === 1) {
    tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
  }
})

watch(comisionPrimerAnio, (newVal) => {
  if (comisionRenovacion.value === 0 || comisionRenovacion.value === null) {
    comisionRenovacion.value = newVal
  }
})

const agregarReaseguradora = async () => {
  const cErrors = await companiaReasegRef.value.validate()
  const pErrors = await participacionRef.value.validate()
  if (cErrors.length > 0 || pErrors.length > 0 || !companiaReasegObj.value) return

  const nuevaCve = companiaReasegObj.value.value
  const esDuplicado = reaseguradores.value.some((r, index) => r.cveReasegurador === nuevaCve && index !== editIndex.value)

  if (esDuplicado) {
    dialog.show({ title: 'Aviso', message: 'La compañía ya ha sido agregada.', type: DialogType.INFO })
    return
  }

  const sumaActual = reaseguradores.value.reduce((acc: number, r: any) => acc + Number(r.participacion), 0)
  const sumaNueva = (editIndex.value !== null)
    ? (sumaActual - Number(reaseguradores.value[editIndex.value].participacion) + participacion.value)
    : (sumaActual + participacion.value)

  const procesarGuardado = () => {
    const data = {
      cveReasegurador: companiaReasegObj.value.value,
      nombreReasegurador: companiaReasegObj.value.title,
      participacion: Number(participacion.value.toFixed(2))
    }
    if (editIndex.value !== null) { reaseguradores.value[editIndex.value] = data; editIndex.value = null }
    else { reaseguradores.value.push(data) }
    companiaReasegObj.value = null; participacion.value = 100.00
    nextTick(() => { companiaReasegRef.value.resetValidation(); participacionRef.value.resetValidation() })
  }

  if (sumaNueva > 100) {
    dialog.show({ title: 'Confirmación', message: 'El contrato supera el 100%. ¿Desea continuar?', type: DialogType.CONFIRM, onConfirm: procesarGuardado })
  } else { procesarGuardado() }
}

const guardarConfigReaseguro = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'Falta ID de contrato.', type: DialogType.ERROR })
    return
  }

  const payload: ContratoGeneralConfReaseg = {
    idContrato,
    reaseguradores: JSON.parse(JSON.stringify(reaseguradores.value)),
    indicadorDistrC: indicadorDistrCObj.value,
    cesionCoberBasi: cesionCoberBasiObj.value,
    comisionReaseg: comisionReasegObj.value,
    detalleCobertura: detalleCoberturaObj.value,
    tipoComision: tipoComisionObj.value,
    tipoCobertura: tipoCoberturaObj.value,
    comisionPrimerAnio: Number(comisionPrimerAnio.value.toFixed(2)),
    comisionRenovacion: Number(comisionRenovacion.value.toFixed(2))
  }

  contratoStore.setConfigReasG(payload)
  dialog.show({ title: 'Éxito', message: 'Configuración guardada.', type: DialogType.SUCCESS })
}

const hidratar = () => {
  const cfg = contratoStore.configReaseg
  if (!cfg) return
  reaseguradores.value = cfg.reaseguradores || []
  indicadorDistrCObj.value = indicadorDistrCOptions.value.find(o => o.value === getID(cfg.indicadorDistrC))
  cesionCoberBasiObj.value = siNoOptions.find(o => o.value === getID(cfg.cesionCoberBasi))
  comisionReasegObj.value = siNoOptions.find(o => o.value === getID(cfg.comisionReaseg))
  detalleCoberturaObj.value = siNoOptions.find(o => o.value === getID(cfg.detalleCobertura))
  tipoComisionObj.value = tipoComisionOptions.value.find(o => o.value === getID(cfg.tipoComision))
  tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => o.value === getID(cfg.tipoCobertura))
  comisionPrimerAnio.value = cfg.comisionPrimerAnio || 0
  comisionRenovacion.value = cfg.comisionRenovacion || 0
}

const headersReaseg = [
  { title: 'Reaseguradora', key: 'nombreReasegurador' },
  { title: '% Participación', key: 'participacion' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
