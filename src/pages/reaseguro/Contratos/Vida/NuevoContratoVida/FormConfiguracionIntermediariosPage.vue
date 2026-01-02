<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="intermediario"
            :items="opcionesSiNo"
            item-title="title"
            item-value="value"
            label="¿Intermediario?"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="asignacionIntermediario"
            :items="asignacionIntermediarioOptions"
            :disabled="intermediario === 1"
            item-title="title"
            item-value="value"
            label="Asignación de intermediario"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="reaseguradora"
            :items="reaseguradoraOptions"
            :disabled="intermediario === 1 || asignacionIntermediario === 1"
            item-title="title"
            item-value="value"
            label="Reaseguradora"
            variant="solo-filled"
          />
        </v-col>

        <v-divider class="my-4" />

        <v-tooltip text="Agregar nuevo intermediario">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-plus"
              color="indigo"
              class="ma-2"
              @click="agregarIntermediario"
            />
          </template>
        </v-tooltip>

        <v-col cols="12" md="7">
          <v-select
            v-model="interme"
            :items="intermeOptions"
            :disabled="intermediario === 1"
            item-title="title"
            item-value="value"
            label="Intermediario / Broker"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="corretajeP"
            :items="opcionesSiNo"
            :disabled="intermediario === 1"
            label="¿Corretaje?"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="tipoCorretaje"
            :items="tipoCorretajeOptions"
            :disabled="corretajeP === 1"
            item-title="title"
            item-value="value"
            label="Tipo de corretaje"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="corretaje"
            :disabled="corretajeP === 1 || tipoCorretaje !== 0"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
            label="% Corretaje"
            type="number"
            suffix="%"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="montoCorretaje"
            :disabled="corretajeP === 1 || tipoCorretaje !== 0"
            :rules="[ValidacionesContrato.numeroC21()]"
            label="Monto corretaje"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-data-table
        :headers="headers"
        :items="intermediariosTabla"
        hide-default-footer
      >
        <template #item.modificar="{ item, index }">
          <v-btn icon="mdi-pencil" color="blue" @click="editarIntermediario(item, index)" />
        </template>

        <template #item.eliminar="{ index }">
          <v-btn icon="mdi-delete" color="red" @click="eliminarIntermediario(index)" />
        </template>
      </v-data-table>

      <v-divider class="my-4" />

      <v-col class="text-center">
        <v-btn @click="guardarDatosGenerales">
          Guardar intermediarios
        </v-btn>
        <v-spacer/>
        <br>
        <v-btn class="btn-guardar" @click="abrirModalResumen">
          Guardar contrato
        </v-btn>
         <ModalEnviarDatos ref="modalRef" />
      </v-col>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { NuevoContratoVidaConInt } from './NuevoContratoConfigInt.actions'
import { useContratoStore } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
import ModalEnviarDatos from './ModalEnviarDatos.vue'
import { ValidacionesContrato } from './ValidacionesContrato'

const modalRef = ref<any>(null)
const form = ref<any>(null)

const intermediario = ref<number>(1)
const asignacionIntermediario = ref<number>(1)
const reaseguradora = ref<number | null>(null)
const interme = ref<number | null>(null)
const corretajeP = ref<number>(1)
const tipoCorretaje = ref<number | null>(null)
const corretaje = ref<number | null>(null)
const montoCorretaje = ref<number | null>(null)

const intermediariosTabla = ref<any[]>([])
const indexEdicion = ref<number | null>(null)

const opcionesSiNo = [
  { title: 'SI', value: 0 },
  { title: 'NO', value: 1 }
]

const abrirModalResumen = () => {
  if (modalRef.value && typeof modalRef.value.abrirResumen === 'function') {
    modalRef.value.abrirResumen()
  }
}
const contratoStore = useContratoStore()
const dialog = useDialog()

const {
  asignacionIntermediarioOptions, fetchAsignacionInt,
  reaseguradoraOptions, fetchReasegurador,
  intermeOptions, fetchIntermediario,
  tipoCorretajeOptions, fetchTipoCorretaje
} = NuevoContratoVidaConInt()

const getTitle = (options: any[], value: any) => {
  if (!options || options.length === 0 || value === null || value === undefined) return ''
  const found = options.find(o => String(o.value) === String(value))
  return found ? found.title : ''
}

const catalogosCargados = computed(() => {
  return asignacionIntermediarioOptions.value.length > 0 &&
         reaseguradoraOptions.value.length > 0 &&
         intermeOptions.value.length > 0
})

const hidratarTablaDesdeStore = () => {
  const cfg = contratoStore.configInt
  if (!cfg?.intermediariosTabla || cfg.intermediariosTabla.length === 0) {
    return
  }

  intermediariosTabla.value = cfg.intermediariosTabla.map((item: any) => {
    const valAsignacion = item.asignacionInterm ?? item.asignacionIntermediario;

    return {
      ...item,
      asignacionInterm: valAsignacion,
      display: {
        asignacion: getTitle(asignacionIntermediarioOptions.value, valAsignacion),
        reaseguradora: getTitle(reaseguradoraOptions.value, item.reaseguradora),
        broker: getTitle(intermeOptions.value, item.broker),
        corretaje: item.corretaje === 0 ? 'SI' : 'NO',
        tipo: getTitle(tipoCorretajeOptions.value, item.tipoCorretaje),
      }
    }
  })
}

watch(
  [() => contratoStore.configInt?.intermediariosTabla, catalogosCargados],
  ([tablaStore, listos]) => {
    if (listos && tablaStore) {
      hidratarTablaDesdeStore()
    }
  },
  { immediate: true, deep: true }
)

watch(intermediario, v => { if (v === 1) limpiarFormulario() })
watch(corretajeP, v => {
  if (v === 1) {
    tipoCorretaje.value = null; corretaje.value = null; montoCorretaje.value = null
  }
})
watch(asignacionIntermediario, v => { if (v === 1) reaseguradora.value = null })

const limpiarFormulario = () => {
  reaseguradora.value = null
  interme.value = null
  corretajeP.value = 1
  tipoCorretaje.value = null
  corretaje.value = null
  montoCorretaje.value = null
}

const agregarIntermediario = async () => {
  if (corretaje.value && montoCorretaje.value) {
    dialog.show({ title: 'ERROR', message: 'Capture % o monto, no ambos', type: DialogType.ERROR })
    return
  }

  if (intermediario.value === 1) {
    dialog.show({ title: 'ADVERTENCIA', message: 'El campo "Intermediario" debe ser SI', type: DialogType.INFO })
    return
  }

  const registro = {
    intermediario: intermediario.value,
    asignacionInterm: asignacionIntermediario.value,
    reaseguradora: reaseguradora.value,
    broker: interme.value,
    corretaje: corretajeP.value,
    tipoCorretaje: tipoCorretaje.value,
    corretajeFijo: corretaje.value,
    montoCorreFijo: montoCorretaje.value,
    display: {
      asignacion: getTitle(asignacionIntermediarioOptions.value, asignacionIntermediario.value),
      reaseguradora: getTitle(reaseguradoraOptions.value, reaseguradora.value),
      broker: getTitle(intermeOptions.value, interme.value),
      corretaje: corretajeP.value === 0 ? 'SI' : 'NO',
      tipo: getTitle(tipoCorretajeOptions.value, tipoCorretaje.value),
    }
  }

  if (indexEdicion.value !== null) {
    intermediariosTabla.value[indexEdicion.value] = registro
    indexEdicion.value = null
  } else {
    intermediariosTabla.value.push(registro)
  }
  limpiarFormulario()
}

const editarIntermediario = (item: any, index: number) => {
  indexEdicion.value = index
  intermediario.value = item.intermediario
  asignacionIntermediario.value = item.asignacionInterm
  reaseguradora.value = item.reaseguradora
  interme.value = item.broker
  corretajeP.value = item.corretaje
  tipoCorretaje.value = item.tipoCorretaje
  corretaje.value = item.corretajeFijo
  montoCorretaje.value = item.montoCorreFijo
}
const eliminarIntermediario = (index: number) => {
  intermediariosTabla.value.splice(index, 1)
}

const guardarDatosGenerales = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    dialog.show({ title: 'Atención', message: 'Complete los campos obligatorios', type: DialogType.ERROR })
    return
  }
  const idContrato = contratoStore.general?.idContrato

  if (!valid || !idContrato) {
    dialog.show({
      title: 'Atención',
      message: 'ID de contrato no encontrado o campos incompletos',
      type: DialogType.ERROR
    })
    return
  }

  contratoStore.setConfigInt({
    idContrato,
    intermediario: intermediario.value,
    asignacionIntermediario: asignacionIntermediario.value,
    reaseguradora: reaseguradora.value,
    interme: interme.value,
    corretajeP: corretajeP.value,
    tipoCorretaje: tipoCorretaje.value,
    corretaje: corretaje.value ?? 0,
    montoCorretaje: montoCorretaje.value,
    intermediariosTabla: intermediariosTabla.value
  })

  dialog.show({ title: 'Información', message: 'Guardado correctamente', type: DialogType.SUCCESS })
}

onMounted(() => {
  fetchAsignacionInt()
  fetchReasegurador()
  fetchIntermediario()
  fetchTipoCorretaje()
})

const headers = [
  { title: 'Asignación', key: 'display.asignacion' },
  { title: 'Reaseguradora', key: 'display.reaseguradora' },
  { title: 'Broker', key: 'display.broker' },
  { title: '¿Corretaje?', key: 'display.corretaje' },
  { title: 'Tipo de corretaje', key: 'display.tipo' },
  { title: '%', key: 'corretajeFijo' },
  { title: 'Monto', key: 'montoCorreFijo' },
  { title: 'Modificar', key: 'modificar' },
  { title: 'Eliminar', key: 'eliminar' }
]
</script>
