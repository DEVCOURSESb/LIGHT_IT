<template>
  <v-form ref="form">
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="4">
          <v-select
            v-model="polizaInput"
            label="Póliza"
            :items="polizaOptions"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="renovacionInput"
            label="Renovación"
            :items="renovacionOptions"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            class="ma-2"
            color="indigo"
            icon="mdi mdi-plus"
            max-height="30px"
            max-width="30px"
            @click="agregarPoliza"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <v-data-table :headers="headers1" :items="polizas" hide-default-footer>
    <template #item.modificar="{ item, index }">
      <v-btn color="warning" icon="mdi-pencil" @click="editarPoliza(item, index)" />
    </template>
    <template #item.borrar="{ index }">
      <v-btn color="error" icon="mdi-delete" @click="eliminarPoliza(index)" />
    </template>
  </v-data-table>

  <v-col class="text-center">
    <v-btn class="btn-guardar" @click="guardarDatosGenerales">
      Guardar pólizas
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NuevoContratoVida } from './NuevoContratoDG.actions'
import { useContratoStore } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"

const { polizaOptions, renovacionOptions, fetchEmisionContable } = NuevoContratoVida()
const form = ref<any>(null)
const contratoStore = useContratoStore()
const dialog = useDialog()

onMounted(() => {
  fetchEmisionContable()
})

const polizaInput = ref('')
const renovacionInput = ref<number | null>(null)

interface Poliza {
  poliza: string
  renovacion: number
}
const polizas = ref<Poliza[]>([])
const polizaEditando = ref<number | null>(null)

const headers1 = [
  { title: 'Póliza', key: 'poliza' },
  { title: 'Renovación', key: 'renovacion' },
  { title: 'Modificar', key: 'modificar' },
  { title: 'Borrar', key: 'borrar' },
]

const agregarPoliza = () => {
  if (!polizaInput.value || renovacionInput.value === null) return

  const nuevaPoliza: Poliza = {
    poliza: polizaInput.value,
    renovacion: renovacionInput.value,
  }

  if (polizaEditando.value !== null) {
    polizas.value[polizaEditando.value] = nuevaPoliza
    polizaEditando.value = null
  } else {
    polizas.value.push(nuevaPoliza)
  }

  polizaInput.value = ''
  renovacionInput.value = null
}

const editarPoliza = (item: Poliza, index: number) => {
  polizaInput.value = item.poliza
  renovacionInput.value = item.renovacion
  polizaEditando.value = index
}

const eliminarPoliza = (index: number) => {
  polizas.value.splice(index, 1)
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

  contratoStore.setPolizas({
    idContrato,
    polizas: polizas.value
  })


  dialog.show({ title: 'Información', message: 'Guardado correctamente', type: DialogType.SUCCESS })
}
</script>
