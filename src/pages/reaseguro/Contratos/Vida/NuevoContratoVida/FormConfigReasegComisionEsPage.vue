<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="limiteInf"
            label="Límite inferior"
            suffix="%"
            type="number"
            variant="solo-filled"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="limiteSup"
            label="Límite superior"
            suffix="%"
            type="number"
            variant="solo-filled"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="comisionDef"
            label="Comisión definitiva"
            suffix="%"
            type="number"
            variant="solo-filled"
            :rules="[ValidacionesContrato.limiteSiniestralidad()]"
          />
        </v-col>
      </v-row>

      <v-row class="text-center">
        <v-col>
          <v-btn color="white" @click="agregarComision">
            {{ editIndex !== null ? 'Actualizar comisión' : 'Agregar comisión' }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="comisiones"
            hide-default-footer
          >
            <template #item.modificar="{ item, index }">
              <v-btn icon @click="editarComision(item, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>

            <template #item.borrar="{ index }">
              <v-btn icon @click="eliminarComision(index)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="text-center">
        <v-col>
          <v-btn class="btn-guardar" @click="guardarDatos">
            Guardar comisiones
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { ValidacionesContrato } from './ValidacionesContrato'
import { useContratoStore } from '@/stores/contratoStore'
import { useDialog, DialogType } from '@/stores/dialogStore'

interface ComisionReaseguro {
  limiteInf: number
  limiteSup: number
  comisionDefinitiva: number
}

const form = ref<VForm | null>(null)

const limiteInf = ref<number | null>(null)
const limiteSup = ref<number | null>(null)
const comisionDef = ref<number | null>(null)

const comisiones = ref<ComisionReaseguro[]>([])
const editIndex = ref<number | null>(null)

const contratoStore = useContratoStore()
const dialog = useDialog()

const headers = [
  { title: 'Límite inf (%)', key: 'limiteInf' },
  { title: 'Límite sup (%)', key: 'limiteSup' },
  { title: '% Comisión', key: 'comisionDefinitiva' },
  { title: 'Modificar', key: 'modificar' },
  { title: 'Borrar', key: 'borrar' },
]

const hidratarDesdeStore = () => {
  const cfg = contratoStore.configReasegCom
  if (!cfg) return
  if (!Array.isArray(cfg.comisiones)) return

  comisiones.value = cfg.comisiones.map(c => ({
    limiteInf: c.limiteInf,
    limiteSup: c.limiteSup,
    comisionDefinitiva: c.comisionDefinitiva,
  }))
}

watch(
  () => contratoStore.configReasegCom,
  hidratarDesdeStore,
  { immediate: true }
)

const agregarComision = async () => {
  const { valid } = await form.value!.validate()
  if (!valid) return

  const nueva: ComisionReaseguro = {
    limiteInf: limiteInf.value!,
    limiteSup: limiteSup.value!,
    comisionDefinitiva: comisionDef.value!,
  }

  if (editIndex.value !== null) {
    comisiones.value[editIndex.value] = nueva
    editIndex.value = null
  } else {
    comisiones.value.push(nueva)
  }

  limpiarFormulario()
}

const editarComision = (item: ComisionReaseguro, index: number) => {
  limiteInf.value = item.limiteInf
  limiteSup.value = item.limiteSup
  comisionDef.value = item.comisionDefinitiva
  editIndex.value = index
}

const eliminarComision = (index: number) => {
  comisiones.value.splice(index, 1)
}

const limpiarFormulario = () => {
  limiteInf.value = null
  limiteSup.value = null
  comisionDef.value = null
  editIndex.value = null
}

const guardarDatos = () => {
  if (comisiones.value.length === 0) {
    dialog.show({
      title: 'Atención',
      message: 'Debe agregar al menos una comisión antes de guardar',
      type: DialogType.ERROR,
    })
    return
  }

  contratoStore.setConfigReasCom({
    idContrato: contratoStore.general?.idContrato || '',
    comisiones: comisiones.value,
  })

  dialog.show({
    title: 'Éxito',
    message: 'Comisiones guardadas correctamente',
    type: DialogType.SUCCESS,
  })
}
</script>
