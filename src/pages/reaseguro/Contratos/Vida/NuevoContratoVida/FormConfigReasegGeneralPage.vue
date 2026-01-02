<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-select
            ref="companiaReasegRef"
            v-model="companiaReaseg"
            :items="compaReasegOptions"
            label="Compañía reaseguradora"
            :rules="[ValidacionesContrato.companiaReaseg(reaseguradores)]"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            ref="participacionRef"
            v-model="participacion"
            label="Participación"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[ValidacionesContrato.participacion()]"
            step="0.01"
            min="0"
            max="100"
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-btn
          class="ma-2"
          color="indigo"
          icon="mdi mdi-plus"
          max-height="30px"
          max-width="30px"
          @click="agregarReaseguradora"
        />
      </v-row>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="8">
          <v-data-table
            :headers="headers"
            :items="reaseguradores"
          >
            <template #item.modificar="{ item, index }">
              <v-btn
                color="warning"
                icon="mdi-pencil"
                @click="editarReaseg(item, index)"
              />
            </template>

            <template #item.borrar="{ index }">
              <v-btn
                color="error"
                icon="mdi-delete"
                @click="eliminarReaseg(index)"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row >
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="indicadorDistrC"
            :items="indicadorDistrCOptions"
            :rules="[ValidacionesContrato.indicadorDistrC()]"
            label="Indicador Distr. Cesión"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="cesionCoberBasi"
            class="selectForm"
            :items="siNoOptions"
            label="¿Cesión sobre la cobertura BÁSICA?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="comisionReaseg"
            :items="siNoOptions"
            class="selectForm"
            label="¿Comisión de reaseguro?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="detalleCobertura"
            :items="siNoOptions"
            label="¿Detalle por cobertura?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoComision"
            :items="tipoComisionOptions"
            :disabled="comisionReaseg !== 1"
            label="Tipo de comisión"
            variant="solo-filled"
          />
        </v-col>
        <v-divider />

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoCobertura"
            :rules="[ValidacionesContrato.tipoCobertura()]"
            :items="tipoCoberturaOptions"
            label="Tipo de cobertura"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="comisionPrimerAnio"
            label="Comisión primer año (Fija/Provisional)"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[ValidacionesContrato.comisionPrimerAnio(comisionReaseg)]"
            :disabled="comisionReaseg !== 1"
            required
            :step="0.01"
            :min="0"
            :max="100"
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="comisionRenovacion"
            label="Comisión renovación (Fija/Provisional)"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[ValidacionesContrato.comisionRenovacion(comisionReaseg)]"
            :disabled="comisionReaseg !== 1"
            required
            :step="0.01"
            :min="0"
            :max="100"
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-spacer />
      <br>
    </v-container>
  </v-form>
  <div>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" type="button" @click="guardarDatosGenerales">
      Guardar
      <br> generales
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { useContratoStore, type ReaseguradorParticipacion } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const form = ref()

const siNoOptions = [
  { title: 'SI', value: 1 },
  { title: 'NO', value: 0 }
]

const {
  compaReasegOptions,
  fetchReaseguradores,
  indicadorDistrCOptions,
  fetchIndicadorDistriC,
  tipoComisionOptions,
  fetchTipoComision,
  tipoCoberturaOptions,
  fetchTipoCobertura
} = NuevoContratoVidaConR()

onMounted(() => {
  fetchReaseguradores()
  fetchIndicadorDistriC()
  fetchTipoComision()
  fetchTipoCobertura()
})


const headers = [
  { title: 'Reaseguradora', key: 'nombreReasegurador' },
  { title: '% Participación', key: 'participacion' },
  { title: 'Modificar', key: 'modificar' },
  { title: 'Borrar', key: 'borrar' }
]

const headers1 = [
  { title: 'Tipo cobertura', key: 'detalleCapa' },
  { title: '% Comisión primer año (Fija/Provisional)', key: 'retencionC' },
  { title: '% Comisión renovación (Fija/Provisional)', key: 'techoC' },
  { title: 'Modificar', key: 'techoC' },
  { title: 'Borrar', key: 'techoC' }
]

const companiaReaseg = ref<string | number>('')
const participacion = ref<number | null>(null)
const indicadorDistrC = ref<number | null>(0)
const cesionCoberBasi = ref(0) // valor default SI
const comisionReaseg = ref(1)  // valor default NO
const detalleCobertura = ref(1) // valor default NO
const tipoComision = ref<number | null>(null)
const tipoCobertura = ref<number | null>(null)
const comisionPrimerAnio = ref<number | null>(null)
const comisionRenovacion = ref<number | null>(null)
const reasegEditando = ref<number | null>(null)

const companiaReasegRef = ref()
const participacionRef = ref()

watch(comisionReaseg, (newVal) => {
  if (newVal === 0) {
    tipoComision.value = 0
  } else {
    tipoComision.value = null
  }
})

const reaseguradores = ref<Array<{
  cveReasegurador: string | number
  nombreReasegurador: string
  participacion: number
}>>([])

const hidratarDesdeStore = () => {
  const cfg = contratoStore.configReaseg
  if (!cfg) return
  if (!compaReasegOptions.value.length) return

  reaseguradores.value = cfg.reaseguradores.map(r => {
    const opt = compaReasegOptions.value.find(
      o => o.value === r.cveReasegurador
    )

    return {
      cveReasegurador: r.cveReasegurador,
      nombreReasegurador: opt?.title ?? '',
      participacion: r.participacion
    }
  })

  indicadorDistrC.value = cfg.indicadorDistrC
  cesionCoberBasi.value = cfg.cesionCoberBasi
  comisionReaseg.value = cfg.comisionReaseg
  detalleCobertura.value = cfg.detalleCobertura
  tipoComision.value = cfg.tipoComision
  tipoCobertura.value = cfg.tipoCobertura
  comisionPrimerAnio.value = cfg.comisionPrimerAnio
  comisionRenovacion.value = cfg.comisionRenovacion
}

watch(
  [
    () => contratoStore.configReaseg,
    () => compaReasegOptions.value
  ],
  hidratarDesdeStore,
  { immediate: true }
)

const agregarReaseguradora = async () => {
  const companiaValida = await companiaReasegRef.value.validate()
  const participacionValida = await participacionRef.value.validate()
  if (!companiaValida || !participacionValida) return
  if (participacion.value === null) return

  const selected = compaReasegOptions.value.find(
    o => o.value === companiaReaseg.value
  )
  if (!selected) return

  if (existeReasegurador(companiaReaseg.value)) {
    dialog.show({
      title: 'Aviso',
      message: 'La compañía reaseguradora ya existe en la tabla',
      type: DialogType.INFO
    })
    return
  }

  const nuevo = {
    cveReasegurador: selected.value,
    nombreReasegurador: selected.title,
    participacion: Number(Number(participacion.value).toFixed(2))
  }
  if (reasegEditando.value !== null) {
    reaseguradores.value[reasegEditando.value] = nuevo
    reasegEditando.value = null
    limpiarCamposReaseguro()
    return
  }
  const totalActual = reaseguradores.value.reduce(
    (acc, r) => acc + r.participacion,
    0
  )
  const totalNuevo = totalActual + nuevo.participacion

  if (totalNuevo > 100) {
    dialog.show({
      title: 'Confirmación',
      message: 'El contrato queda cubierto a más de 100%. ¿Desea continuar?',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        reaseguradores.value.push(nuevo)
        limpiarCamposReaseguro()
      }
    })
    return
  }
  reaseguradores.value.push(nuevo)
  limpiarCamposReaseguro()
}
const editarReaseg = (item: any, index: number) => {
  companiaReaseg.value = item.cveReasegurador
  participacion.value = item.participacion
  reaseguradores.value.splice(index, 1)
}
const eliminarReaseg = (index: number) => {
  reaseguradores.value.splice(index, 1)
}
const limpiarCamposReaseguro = () => {
  companiaReaseg.value = ''
  participacion.value = null
  reasegEditando.value = null
  companiaReasegRef.value.resetValidation()
  participacionRef.value.resetValidation()
}

const existeReasegurador = (cve: string | number) => {
  return reaseguradores.value.some(
    (r, i) => r.cveReasegurador === cve && i !== reasegEditando.value
  )
}

const reaseguradoresFormateados = computed<ReaseguradorParticipacion[]>(() =>
  reaseguradores.value.map(r => ({
    cveReasegurador: r.cveReasegurador,
    participacion: r.participacion
  }))
)

const guardarDatosGenerales = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({
      title: 'Error',
      message: 'No existe contrato activo',
      type: DialogType.ERROR
    })
    return
  }

  contratoStore.setConfigReasG({
    idContrato,
    reaseguradores: reaseguradoresFormateados.value,
    indicadorDistrC: indicadorDistrC.value,
    cesionCoberBasi: cesionCoberBasi.value,
    comisionReaseg: comisionReaseg.value,
    detalleCobertura: detalleCobertura.value,
    tipoComision: tipoComision.value,
    tipoCobertura: tipoCobertura.value,
    comisionPrimerAnio: comisionPrimerAnio.value,
    comisionRenovacion: comisionRenovacion.value
  })

  dialog.show({
    title: 'Información',
    message: 'Configuración de reaseguro guardada correctamente',
    type: DialogType.SUCCESS
  })
}
</script>
