<template>
  <div v-if="estaHabilitado">
    <v-form ref="formRef">
      <v-container>
        <!-- SECCIÓN DE CAPTURA CON SLIDERS -->
        <v-row class="align-center">
          <!-- Límite Inferior (0.00 - 1000.00) -->
          <v-col cols="12" md="4">
            <div class="text-caption grey--text mb-1">Límite inferior (%)</div>
            <v-slider
              v-model="limiteInf"
              min="0"
              max="1000"
              step="0.01"
              thumb-label
              color="indigo"
              hide-details
            >
              <template v-slot:append>
                <v-text-field
                  v-model.number="limiteInf"
                  type="number"
                  style="width: 110px"
                  variant="solo-filled"
                  density="compact"
                  hide-details
                  suffix="%"
                />
              </template>
            </v-slider>
          </v-col>

          <!-- Límite Superior (0.00 - 1000.00) -->
          <v-col cols="12" md="4">
            <div class="text-caption grey--text mb-1">Límite superior (%)</div>
            <v-slider
              v-model="limiteSup"
              min="0"
              max="1000"
              step="0.01"
              thumb-label
              color="indigo"
              hide-details
            >
              <template v-slot:append>
                <v-text-field
                  v-model.number="limiteSup"
                  type="number"
                  style="width: 110px"
                  variant="solo-filled"
                  density="compact"
                  hide-details
                  suffix="%"
                />
              </template>
            </v-slider>
          </v-col>

          <!-- Comisión Definitiva (0.00 - 100.00) -->
          <v-col cols="12" md="4">
            <div class="text-caption grey--text mb-1">Comisión definitiva (%)</div>
            <v-slider
              v-model="comisionDef"
              min="0"
              max="100"
              step="0.01"
              thumb-label
              color="orange"
              hide-details
            >
              <template v-slot:append>
                <v-text-field
                  v-model.number="comisionDef"
                  type="number"
                  style="width: 110px"
                  variant="solo-filled"
                  density="compact"
                  hide-details
                  suffix="%"
                />
              </template>
            </v-slider>
          </v-col>
        </v-row>

        <!-- BOTÓN AGREGAR -->
        <v-row class="justify-center mt-2">
          <v-btn
            color="indigo"
            icon
            size="small"
            elevation="2"
            @click="agregarComision"
          >
            <v-icon>{{ editIndex !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editIndex !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
            </v-tooltip>
          </v-btn>
        </v-row>

        <!-- TABLA DE RESULTADOS -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="comisiones"
              density="compact"
              class="elevation-1"
              hide-default-footer
            >
              <template #item.limiteInf="{ item }"> {{ Number(item.limiteInf).toFixed(2) }}% </template>
              <template #item.limiteSup="{ item }"> {{ Number(item.limiteSup).toFixed(2) }}% </template>
              <template #item.comisionDefinitiva="{ item }"> {{ Number(item.comisionDefinitiva).toFixed(2) }}% </template>

              <template #item.acciones="{ item, index }">
                <v-btn icon color="blue" variant="text" size="small" @click="editarComision(item, index)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" variant="text" size="small" @click="eliminarComision(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-row class="text-center mt-10">
          <v-col>
            <v-btn
              class="btn-guardar"
              elevation="4"
              color="primary"
              @click="guardarDatos"
            >
              Guardar comisiones escalonadas
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>

  <!-- Mensaje alternativo si no está habilitado -->
  <v-container v-else>
    <v-alert type="info" variant="tonal" border="start">
      La sección de <strong>Comisión Escalonada</strong> no aplica para el Tipo de Comisión seleccionado actualmente.
    </v-alert>
  </v-container>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue'
import { useContratoStore } from '@/stores/contratoStore'
import { useDialog, DialogType } from '@/stores/dialogStore'

interface ComisionReaseguro {
  limiteInf: number
  limiteSup: number
  comisionDefinitiva: number
}

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref<any>(null)

// --- REFS DE MODELO ---
const limiteInf = ref<number>(0)
const limiteSup = ref<number>(0)
const comisionDef = ref<number>(0)
const comisiones = ref<ComisionReaseguro[]>([])
const editIndex = ref<number | null>(null)

// --- LÓGICA DE VISIBILIDAD ---
const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

const estaHabilitado = computed(() => {
  const tipo = contratoStore.configReaseg?.tipoComision
  const id = getID(tipo)
  return id == 2 // 2 = VARIABLE / ESCALONADA
})

// --- CONFIGURACIÓN TABLA ---
const headers = [
  { title: 'Límite inf (%)', key: 'limiteInf' },
  { title: 'Límite sup (%)', key: 'limiteSup' },
  { title: '% Comisión', key: 'comisionDefinitiva' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

// --- HIDRATACIÓN ---
const hidratarDesdeStore = () => {
  const cfg = contratoStore.configReasegCom
  if (!cfg || !Array.isArray(cfg.comisiones)) {
    comisiones.value = []
    return
  }
  comisiones.value = [...cfg.comisiones]
}

watch(
  () => contratoStore.configReasegCom,
  () => hidratarDesdeStore(),
  { immediate: true, deep: true }
)

// --- ACCIONES ---
const agregarComision = async () => {
  // Validación de lógica de negocio
  if (Number(limiteSup.value) <= Number(limiteInf.value)) {
    dialog.show({
      title: 'Validación',
      message: 'El límite superior debe ser mayor al límite inferior.',
      type: DialogType.ERROR
    })
    return
  }

  const nueva: ComisionReaseguro = {
    limiteInf: Number(limiteInf.value.toFixed(2)),
    limiteSup: Number(limiteSup.value.toFixed(2)),
    comisionDefinitiva: Number(comisionDef.value.toFixed(2)),
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
  limiteInf.value = 0
  limiteSup.value = 0
  comisionDef.value = 0
  editIndex.value = null
  if (formRef.value) formRef.value.resetValidation()
}

const guardarDatos = () => {
  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'No hay un contrato activo para guardar.', type: DialogType.ERROR })
    return
  }

  if (comisiones.value.length === 0) {
    dialog.show({ title: 'Atención', message: 'Debe agregar al menos un registro a la tabla.', type: DialogType.ERROR })
    return
  }

  contratoStore.setConfigReasCom({
    idContrato,
    comisiones: JSON.parse(JSON.stringify(comisiones.value)),
  })

  dialog.show({ title: 'Éxito', message: 'Las comisiones escalonadas se han guardado temporalmente.', type: DialogType.SUCCESS })
}
</script>

<style scoped>
.elevation-1 {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
.btn-guardar {
  background-color: #1a237e !important;
  color: white !important;
}
</style>
