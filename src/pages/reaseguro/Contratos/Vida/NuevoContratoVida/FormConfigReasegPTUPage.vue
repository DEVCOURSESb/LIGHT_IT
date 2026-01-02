<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col cols="12" md="5">
          <v-select
            v-model="otorgaPtu"
            :items="siNoOptions"
            label="¿Otorga PTU?"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="7">
          <v-select
            v-if="otorgaPtu === 1"
            v-model="metodoCalPTU"
            :items="metodoCalPTUOptions"
            item-title="title"
            item-value="value"
            label="Método cálculo PTU"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="otorgaPtu === 1">
          <v-text-field
            v-model="ptu"
            label="PTU"
            suffix="%"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
            type="number"
            variant="solo-filled"
            required
          />
        </v-col>

        <v-col cols="12" md="4" v-if="otorgaPtu === 1">
          <v-text-field
            v-model="kPor"
            label="k"
            suffix="%"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
            type="number"
            variant="solo-filled"
            required
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="aniosArrastre"
            type="number"
            label="Años de arrastre"
            variant="solo-filled"
            required
          />
        </v-col>

        <v-col cols="12" md="4" v-if="otorgaPtu === 1">
          <v-text-field
            v-if="metodoCalPTU !== null && [5, 6].includes(metodoCalPTU)"
            v-model="gastos"
            label="Gastos"
            suffix="%"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
            type="number"
            variant="solo-filled"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <v-btn class="btn-guardar" @click="guardarDatosGenerales">
            Guardar PTU
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>


<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { useContratoStore } from '@/stores/contratoStore'
import { DialogType, useDialog } from '@/stores/dialogStore'
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()

const form = ref<VForm | null>(null)

const siNoOptions = [
  { title: 'SI', value: 1 },
  { title: 'NO', value: 0 }
]

const { metodoCalPTUOptions, fetchMetodoCalPTU } = NuevoContratoVidaConR()

onMounted(fetchMetodoCalPTU)

const otorgaPtu = ref<number>(0)
const metodoCalPTU = ref<number | null>(null)
const ptu = ref<string | null>(null)
const kPor = ref<string | null>(null)
const aniosArrastre = ref<number | null>(0)
const gastos = ref<string | null>(null)

watch(
  [
    () => contratoStore.configReasegPTU,
    () => metodoCalPTUOptions.value
  ],
  () => {
    const cfg = contratoStore.configReasegPTU
    if (!cfg) return
    if (!metodoCalPTUOptions.value.length) return

    otorgaPtu.value = cfg.otorgaPtu
    metodoCalPTU.value = cfg.metodoCalPTU !== null
      ? Number(cfg.metodoCalPTU)
      : null
    ptu.value = cfg.ptu
    kPor.value = cfg.kPor
    aniosArrastre.value = cfg.aniosArrastre
    gastos.value = cfg.gastos
  },
  { immediate: true }
)

watch(metodoCalPTU, (value) => {
  if ([5, 6].includes(value ?? -1)) {
    gastos.value = ''
  }
})

const guardarDatosGenerales = async () => {
  const { valid } = await form.value!.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'No existe contrato activo', type: DialogType.ERROR })
    return
  }

  contratoStore.setConfigReasPTU({
    idContrato,
    otorgaPtu: otorgaPtu.value,
    metodoCalPTU: metodoCalPTU.value ?? null,
    ptu: ptu.value ?? null,
    kPor: kPor.value ?? null,
    aniosArrastre: aniosArrastre.value ?? null,
    gastos: gastos.value ?? null
  })

  dialog.show({
    title: 'Éxito',
    message: 'PTU guardado correctamente',
    type: DialogType.SUCCESS
  })
}
</script>
