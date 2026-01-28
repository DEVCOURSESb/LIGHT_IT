<template>
  <v-form ref="formRef">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="otorgaPtuObj"
            :items="siNoOptions"
            label="¿Otorga PTU?"
            item-title="title"
            chips
            return-object
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-select
            v-if="getID(otorgaPtuObj) === 1"
            v-model="metodoCalPTUObj"
            :items="metodoCalPTUOptions"
            item-title="title"
            chips
            return-object
            label="Método cálculo PTU"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row v-if="getID(otorgaPtuObj) === 1">
        <v-col cols="12" md="4">
          <div class="text-caption grey--text mb-1">PTU (%)</div>
          <v-slider
            v-model="ptu"
            min="0"
            max="100"
            step="0.01"
            thumb-label
            color="indigo"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="ptu"
                type="number"
                style="width: 110px"
                variant="solo-filled"
                density="compact"
                hide-details
                suffix="%"
                :rules="[ValidacionesContrato.limiteSiniestralidad()]"
              />
            </template>
          </v-slider>
        </v-col>

        <v-col cols="12" md="4" v-if="[2, 7].includes(getID(metodoCalPTUObj))">
          <div class="text-caption grey--text mb-1">Factor k (%)</div>
          <v-slider
            v-model="kPor"
            min="0"
            max="100"
            step="0.01"
            thumb-label
            color="indigo"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="kPor"
                type="number"
                style="width: 110px"
                variant="solo-filled"
                density="compact"
                hide-details
                suffix="%"
                :rules="[ValidacionesContrato.limiteSiniestralidad()]"
              />
            </template>
          </v-slider>
        </v-col>

        <v-col cols="12" md="4" v-if="[0,3,5,6].includes(getID(metodoCalPTUObj))">
           <v-text-field
            v-model.number="aniosArrastre"
            type="number"
            label="Años de arrastre"
            variant="solo-filled"
            prepend-inner-icon="mdi-calendar-clock"
            required
          />
        </v-col>

        <v-col cols="12" md="4" v-if="[5, 6].includes(getID(metodoCalPTUObj))">
          <div class="text-caption grey--text mb-1">Gastos (%)</div>
          <v-slider
            v-model="gastos"
            min="0"
            max="100"
            step="0.01"
            thumb-label
            color="orange"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="gastos"
                type="number"
                style="width: 110px"
                variant="solo-filled"
                density="compact"
                hide-details
                suffix="%"
                :rules="[ValidacionesContrato.limiteSiniestralidad()]"
              />
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row class="mt-8">
        <v-col class="text-center">
          <v-btn
            class="btn-guardar"
            elevation="4"
            @click="guardarDatosPTU"
          >
            Guardar PTU
          </v-btn>
        </v-col>
        <v-col class="text-center">
          <v-btn
            color="primary"
            elevation="4"
            @click="guardarReasegurador"
          >
            Guardar Reasegurador
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { useContratoStore, type ContratoReasePTU, type ReaseguradorCompleto } from '@/stores/contratoStore'
import { DialogType, useDialog } from '@/stores/dialogStore'
import { ValidacionesContrato } from './ValidacionesContrato'

const emit = defineEmits<{
  onIncParticipaation: [];
}>();

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref<any>(null)

const siNoOptions = [
  { title: 'SI', value: 1 },
  { title: 'NO', value: 0 }
]

const { metodoCalPTUOptions, fetchMetodoCalPTU } = NuevoContratoVidaConR()

const otorgaPtuObj = ref<any>(null)
const metodoCalPTUObj = ref<any>(null)

const ptu = ref<number>(0)
const kPor = ref<number>(0)
const aniosArrastre = ref<number>(0)
const gastos = ref<number>(0)

const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

onMounted(async () => {
  await fetchMetodoCalPTU()
  if (!contratoStore.configReasegPTU) {
    otorgaPtuObj.value = siNoOptions[1]
  }
})

const hidratarDesdeStore = () => {
  const cfg = contratoStore.configReasegPTU
  if (!cfg) return

  otorgaPtuObj.value = siNoOptions.find(o => o.value === getID(cfg.otorgaPtu))

  if (metodoCalPTUOptions.value.length > 0) {
    metodoCalPTUObj.value = metodoCalPTUOptions.value.find(o => o.value === getID(cfg.metodoCalPTU))
  }

  ptu.value = Number(cfg.ptu) || 0
  kPor.value = Number(cfg.kPor) || 0
  aniosArrastre.value = Number(cfg.aniosArrastre) || 0
  gastos.value = Number(cfg.gastos) || 0
}

watch(
  [() => contratoStore.configReasegPTU, metodoCalPTUOptions],
  () => hidratarDesdeStore(),
  { immediate: true }
)

watch(() => getID(otorgaPtuObj.value), (val) => {
  if (val === 0) {
    metodoCalPTUObj.value = null
    ptu.value = 0
    kPor.value = 0
    gastos.value = 0
  }
})

const guardarDatosPTU = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'No existe contrato activo', type: DialogType.ERROR })
    return
  }

  contratoStore.setConfigReasPTU({
    idContrato,
    otorgaPtu: otorgaPtuObj.value,
    metodoCalPTU: metodoCalPTUObj.value,
    ptu: ptu.value.toFixed(2),
    kPor: kPor.value.toFixed(2),
    aniosArrastre: aniosArrastre.value,
    gastos: gastos.value.toFixed(2)
  })

  dialog.show({
    title: 'Éxito',
    message: 'Configuración de PTU guardada correctamente',
    type: DialogType.SUCCESS
  })
}
const guardarReasegurador = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const gen = contratoStore.configReaseg
  const cob = contratoStore.configReasegCob
  const com = contratoStore.configReasegCom

  if (!gen || !gen.cveReasegurador) {
    dialog.show({ title: 'Error', message: 'Faltan datos de Configuración General', type: DialogType.ERROR })
    return
  }

  const datosPTU: ContratoReasePTU = {
    idContrato: gen.idContrato,
    otorgaPtu: getID(otorgaPtuObj.value),
    metodoCalPTU: getID(metodoCalPTUObj.value),
    ptu: ptu.value ? ptu.value.toFixed(2) : null,
    kPor: kPor.value ? kPor.value.toFixed(2) : null,
    aniosArrastre: aniosArrastre.value || 0,
    gastos: gastos.value ? gastos.value.toFixed(2) : null
  }

  const reaseguradorFinal: ReaseguradorCompleto ={
    general: { ...gen },
    coberturas: cob ? { ...cob } : null,
    comisiones: com ? { ...com } : null,
    ptu: datosPTU,
    participacion: Number(gen.participacion)
  }

  contratoStore.agregarReaseguradorALista(reaseguradorFinal)

  resetearTodoElFlujo()

  dialog.show({
    title: 'Proceso Completo',
    message: `La reaseguradora ${gen.nombreReasegurador} ha sido configurada y guardada exitosamente.`,
    type: DialogType.SUCCESS
  })


  const isFullParticipation = contratoStore.totalParticipacion === 100;

  if (!isFullParticipation) {
    dialog.show({
      title: 'Atención',
      message: `La participación total de reaseguradores es ${contratoStore.totalParticipacion}%. Por favor, agregue otro reasegurador para completar el 100%.`,
      type: DialogType.INFO
    })

    emit('onIncParticipaation')
  }
}

const resetearTodoElFlujo = () => {
  limpiarFormularioLocal()

  contratoStore.configReaseg = null
  contratoStore.configReasegCob = null
  contratoStore.configReasegCom = null
  contratoStore.configReasegPTU = null
  //Aun no lo he probado para ver si al agregar otro reasegurador me regresa a la pantalla general para agregar otro
  // emit('cambiar-tab', 'general')
}

const limpiarFormularioLocal = () => {
  otorgaPtuObj.value = siNoOptions[1]
  metodoCalPTUObj.value = null
  ptu.value = 0
  kPor.value = 0
  aniosArrastre.value = 0
  gastos.value = 0
  if (formRef.value) formRef.value.resetValidation()
}
</script>
