<template>
  <v-form ref="formRef" @submit.prevent>
    <v-container fluid>
      <v-row class="d-flex">
        <v-col cols="12" md="3">
          <v-select
            v-model="intermediarioObj"
            :items="opcionesSiNo"
            label="¿Intermediario?"
            variant="solo-filled"
            chips
            return-object
            :rules="[v => v !== null || 'Requerido']"
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center">
          <v-checkbox
            v-model="invertir"
            label="¿Invertir?"
            color="indigo"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="asignacionIntermObj"
            :items="asignacionIntermediarioOptions"
            :disabled="getID(intermediarioObj) != 1"
            label="Asignación de intermediario"
            variant="solo-filled"
            chips
            return-object
            :rules="[v => (getID(intermediarioObj) == 0 ? !!v : true) || 'Requerido']"
          />
        </v-col>

        <v-col cols="12" md="4" :order="invertir ? 2 : 1">
          <v-select
            v-model="reaseguradoraObj"
            :items="reaseguradorasDisponibles"
            :disabled="getID(intermediarioObj) != 1 || getID(asignacionIntermObj) != 0"
            label="Reaseguradora"
            variant="solo-filled"
            chips
            return-object
            persistent-hint
            :error-messages="errorReaseguradora"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row class="align-center d-flex">
        <v-col cols="12" md="7" :order="invertir ? 1 : 2">
          <v-autocomplete
            v-model="brokerObj"
            :items="intermeOptions"
            :disabled="getID(intermediarioObj) != 1"
            label="Intermediario / Bróker"
            variant="solo-filled"
            chips
            return-object
            :error-messages="errorBroker"
          />
        </v-col>

        <v-col cols="12" md="4" :order="3">
          <v-select
            v-model="corretajePObj"
            :items="opcionesSiNo"
            :disabled="!brokerObj || getID(intermediarioObj) != 1"
            label="¿Corretaje?"
            variant="solo-filled"
            chips
            return-object
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex justify-center" :order="4">
          <v-btn icon color="indigo" size="small" :disabled="getID(intermediarioObj) != 1" @click="agregarIntermediario">
            <v-icon>{{ indexEdicion !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ indexEdicion !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="getID(corretajePObj) == 1" >
        <v-col cols="12" md="4">
          <v-select v-model="tipoCorretajeObj" :items="tipoCorretajeOptions" :disabled="getID(intermediarioObj) != 1" label="Tipo de corretaje" variant="solo-filled" chips return-object/>
        </v-col>
        <v-col cols="12" md="4" v-if="getID(tipoCorretajeObj) == 0">
          <div class="text-caption grey--text">Corretaje (%)</div>
          <v-slider v-model="corretajePorc" min="0" max="100" step="0.01" thumb-label color="indigo" hide-details>
            <template v-slot:append>
              <v-text-field
                v-model.number="corretajePorc"
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

        <v-col cols="12" md="4" v-if="getID(tipoCorretajeObj) == 0">
          <v-text-field v-model.number="montoCorretaje" label="Monto corretaje" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]" />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-data-table :headers="headers" :items="intermediariosTabla" density="compact" class="elevation-1">
        <template #item.acciones="{ item, index }">
          <v-btn icon color="blue" variant="text" size="small" @click="editarIntermediario(item, index)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon color="red" variant="text" size="small" @click="eliminarIntermediario(index)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>

      <v-row class="text-center mt-10">
        <v-col>
          <v-btn class="btn-guardar" @click="guardarIntermediarios">Guardar intermediarios</v-btn>
          <v-btn color="success" class="mx-2" @click="abrirModalResumen">Guardar contrato</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <ModalEnviarDatos ref="modalRef" />
  </v-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { NuevoContratoVidaConInt } from './NuevoContratoConfigInt.actions'
import { useContratoStore } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
//import ModalEnviarDatos from './ModalEnviarDatos.vue'
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const modalRef = ref<any>(null)
const formRef = ref<any>(null)
const invertir = ref(false)

const abrirModalResumen = () => {
  modalRef.value?.abrirResumen?.()
}

const {
  asignacionIntermediarioOptions, fetchAsignacionInt,
  reaseguradoraOptions, fetchReasegurador,
  intermeOptions, fetchIntermediario,
  tipoCorretajeOptions, fetchTipoCorretaje
} = NuevoContratoVidaConInt()

const intermediarioObj = ref<any>(0)
const asignacionIntermObj = ref<any>(null)
const reaseguradoraObj = ref<any>(null)
const brokerObj = ref<any>(null)
const corretajePObj = ref<any>(null)
const tipoCorretajeObj = ref<any>(null)
const corretajePorc = ref<number>(0)
const montoCorretaje = ref<number | null>(null)
const intermediariosTabla = ref<any[]>([])
const indexEdicion = ref<number | null>(null)
const isHydrating = ref(false)

const errorBroker = ref('')
const errorReaseguradora = ref('')

const opcionesSiNo = [
  { title: 'SI', value: 1 },
  { title: 'NO', value: 0 }
]

const getID = (item: any) => {
  if (item === null || item === undefined) return null;
  return (typeof item === 'object' && 'value' in item) ? item.value : item;
}

const findInOptions = (options: any[], value: any) => {
  const id = getID(value);
  if (id === null) return null;
  return options.find(o => getID(o) == id) || null;
}

const isCorretajeFijo = computed(() => {
  return getID(corretajePObj.value) === 0 && getID(tipoCorretajeObj.value) === 0
})

watch(corretajePorc, (newVal) => {
  if (isHydrating.value) return

  if (newVal > 0 && (montoCorretaje.value ?? 0) > 0) {
    dialog.show({
      title: 'Atención',
      message: 'Solo se debe llenar uno de los campos (Porcentaje o Monto), no ambos.',
      type: DialogType.ERROR
    })
    nextTick(() => { corretajePorc.value = 0 })
  }
})

watch(montoCorretaje, (newVal) => {
  if (isHydrating.value) return

  if ((newVal ?? 0) > 0 && corretajePorc.value > 0) {
    dialog.show({
      title: 'Atención',
      message: 'Solo se debe llenar uno de los campos (Porcentaje o Monto), no ambos.',
      type: DialogType.ERROR
    })
    nextTick(() => { montoCorretaje.value = 0 })
  }
})

watch(intermediarioObj, value => {
  if (isHydrating.value) return
  limpiarCamposCaptura()
})

const reaseguradorasDelContrato = computed(() => {
  return contratoStore.listaReaseguradoresFinal?.map(r => ({
    title: r.general.nombreReasegurador,
    value: r.general.cveReasegurador
  })) || []
})

const reaseguradorasDisponibles = computed(() => {
  if (getID(asignacionIntermObj.value) == 1) return reaseguradorasDelContrato.value;
  const idsAsignados = intermediariosTabla.value
    .filter((_, idx) => idx !== indexEdicion.value)
    .map(i => getID(i.reaseguradora))
  return reaseguradorasDelContrato.value.filter(r => !idsAsignados.includes(r.value))
})

const agregarIntermediario = () => {
  errorBroker.value = !brokerObj.value ? 'Seleccione un al menos un intermediario' : ''
  errorReaseguradora.value = (getID(asignacionIntermObj.value) == 0 && !reaseguradoraObj.value) ? 'Seleccione reaseguradora' : ''

  if (errorBroker.value || errorReaseguradora.value) return

  procesarGuardado()
}

const procesarGuardado = () => {
  const esIndividual = getID(asignacionIntermObj.value) === 0;

  const registro = {
    asignacionInterm: asignacionIntermObj.value,
    reaseguradora: esIndividual ? reaseguradoraObj.value : reaseguradorasDelContrato.value,
    broker: brokerObj.value,
    corretaje: corretajePObj.value,
    tipoCorretaje: tipoCorretajeObj.value,
    corretajeFijo: Number(corretajePorc.value),
    montoCorreFijo: Number(montoCorretaje.value),
    display: {
      asignacion: asignacionIntermObj.value?.title || '-',
      reaseguradora: esIndividual
        ? (reaseguradoraObj.value?.title || '-')
        : 'TODAS LAS DEL CONTRATO',
      broker: brokerObj.value?.title || '-',
      tipo: tipoCorretajeObj.value?.title || '-',
    }
  }

  if (indexEdicion.value !== null) {
    intermediariosTabla.value[indexEdicion.value] = registro
    indexEdicion.value = null
  } else {
    intermediariosTabla.value.push(registro)
  }
  limpiarCamposCaptura()
}

const limpiarCamposCaptura = () => {
  isHydrating.value = true
  asignacionIntermObj.value = null
  brokerObj.value = null
  reaseguradoraObj.value = null
  tipoCorretajeObj.value = null
  corretajePorc.value = 0
  montoCorretaje.value = 0
  errorBroker.value = ''
  errorReaseguradora.value = ''

  setTimeout(() => { isHydrating.value = false }, 100)
}

const editarIntermediario = (item: any, index: number) => {
  isHydrating.value = true

  indexEdicion.value = index
  asignacionIntermObj.value = findInOptions(asignacionIntermediarioOptions.value, item.asignacionInterm)
  reaseguradoraObj.value = item.reaseguradora
  brokerObj.value = findInOptions(intermeOptions.value, item.broker)
  corretajePObj.value = findInOptions(opcionesSiNo, item.corretaje)
  tipoCorretajeObj.value = findInOptions(tipoCorretajeOptions.value, item.tipoCorretaje)
  corretajePorc.value = item.corretajeFijo || 0
  montoCorretaje.value = item.montoCorreFijo || 0

  setTimeout(() => { isHydrating.value = false }, 100)
}

const eliminarIntermediario = (index: number) => intermediariosTabla.value.splice(index, 1)

const guardarIntermediarios = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'Falta ID de Contrato', type: DialogType.ERROR })
    return
  }

  if (getID(intermediarioObj.value) == 0 && intermediariosTabla.value.length === 0) {
    dialog.show({ title: 'Atención', message: 'Debe agregar al menos un intermediario a la tabla.', type: DialogType.ERROR })
    return
  }

  try {
    const payload = {
      idContrato,
      intermediario: intermediarioObj.value,
      asignacionIntermediario: asignacionIntermObj.value,
      corretajeP: corretajePObj.value,
      intermediariosTabla: JSON.parse(JSON.stringify(intermediariosTabla.value))
    }
    await contratoStore.setConfigInt(payload as any)
    dialog.show({ title: 'Éxito', message: 'Datos guardados correctamente.', type: DialogType.SUCCESS })
  } catch (e) {
    dialog.show({ title: 'Error', message: 'No se pudo guardar.', type: DialogType.ERROR })
  }
}

const hidratar = () => {
  const cfg = contratoStore.configInt
  if (!cfg || intermeOptions.value.length === 0) return

  isHydrating.value = true

  intermediarioObj.value = findInOptions(opcionesSiNo, cfg.intermediario)
  corretajePObj.value = findInOptions(opcionesSiNo, cfg.corretajeP)
  asignacionIntermObj.value = findInOptions(asignacionIntermediarioOptions.value, cfg.asignacionIntermediario)

  if (cfg.intermediariosTabla) {
    intermediariosTabla.value = cfg.intermediariosTabla.map((item: any) => {
      const esPorReaseg = getID(item.asignacionInterm) == 0;
      return {
        ...item,
        display: {
          asignacion: findInOptions(asignacionIntermediarioOptions.value, item.asignacionInterm)?.title || '-',
          reaseguradora: esPorReaseg
             ? (findInOptions(reaseguradorasDelContrato.value, item.reaseguradora)?.title || '-')
             : 'TODAS LAS DEL CONTRATO',
          broker: findInOptions(intermeOptions.value, item.broker)?.title || '-',
          tipo: findInOptions(tipoCorretajeOptions.value, item.tipoCorretaje)?.title || '-'
        }
      }
    })
  }

  setTimeout(() => { isHydrating.value = false }, 100)
}

watch([() => contratoStore.configInt, intermeOptions, reaseguradorasDelContrato], hidratar, { immediate: true })

onMounted(async () => {
  await Promise.all([fetchAsignacionInt(), fetchReasegurador(), fetchIntermediario(), fetchTipoCorretaje()])
})

const headers = [
  { title: 'Asignación', key: 'display.asignacion' },
  { title: 'Reaseguradora', key: 'display.reaseguradora' },
  { title: 'Intermediario / Bróker', key: 'display.broker' },
  { title: 'Tipo Corretaje', key: 'display.tipo' },
  { title: '% Corretaje', key: 'corretajeFijo' },
  { title: 'Monto Corretaje', key: 'montoCorreFijo' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
