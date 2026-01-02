<template>
  <v-form ref="form">
    <v-container>
      <v-row >
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="subramoSelect"
            :items="subramoOptions"
            label="Subramo"
            :rules="[ValidacionesContrato.subramo()]"
            required
            variant="solo-filled"
            multiple
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
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="negociosCubiertos"
            label="Negocios cubiertos"
            :rules="ValidacionesContrato.negociosCubiertos()"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="moneda"
            :items="monedaOptions"
            label="Moneda"
            :rules="[ValidacionesContrato.moneda()]"
            required
            variant="solo-filled"
            multiple
          />
        </v-col>
        <v-col cols="12" md="4">
          <!--verificar si se puede cambiar a dd-mm-aaaa, por que esta mm-dd-aaaa-->
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
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="formaContractual"
            :items="formaContractualOptions"
            label="Forma contractual"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoReaseguro"
            label="Tipo de reaseguro"
            :items="tipoReaseguroOptions"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="tipoContrato"
            :items="tipoContratoOptions"
            item-title="title"
            item-value="value"
            label="Tipo de contrato"
            variant="solo-filled"
            :rules="[ValidacionesContrato.tipoContrato()]"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="criterioCobertura"
            :items="criterioCoberturaOptions"
            item-title="title"
            item-value="value"
            label="Criterio de cobertura"
            :rules="[reglaCriterio]"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="limiteMax"
            label="Limite máximo del contrato"
            :rules="[ValidacionesContrato.numeroC21()]"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="limiteMaxResCR"
            label="Limite máximo de responsabilidad de contrato por riesgo"
            :rules="[ValidacionesContrato.numeroC21()]"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="retencionP"
            :disabled="tipoContrato === 3"
            label="Retención propia"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          v-if="tipoContrato !== null && [1, 7, 9].includes(tipoContrato)"
        >
          <v-text-field
            v-model="cesion"
            :disabled="tipoContrato === 3"
            label="Cesión"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[ValidacionesContrato.cesion(() => tipoContrato)]"
            required
            suffix="%"
            maxlength="6"
            placeholder="0.00 - 100.00"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          v-if="tipoContrato !== null && [1, 7, 9].includes(tipoContrato)"
        >
          <v-text-field
            v-model="piso"
            :disabled="tipoContrato === 3"
            label="Piso"
            :rules="[ValidacionesContrato.numeroC21(), ValidacionesContrato.piso(() => tipoContrato)]"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          v-if="tipoContrato !== null && [4, 5, 6].includes(tipoContrato)"
        >
          <v-text-field
            v-model="techo"
            :disabled="tipoContrato === 3"
            label="Techo"
            :rules="[ValidacionesContrato.numeroC21(), ValidacionesContrato.techo(() => tipoContrato)]"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-divider v-if="tipoContrato === 3" />
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-if="tipoContrato === 3"
            v-model="retencionCapa"
            label="Retención propia capa N"
            :rules="[ValidacionesContrato.numeroC21(), ValidacionesContrato.retencionCapa(() => tipoContrato)]"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-if="tipoContrato === 3"
            v-model="techoCapa"
            label="Techo capa N"
            type="number"
            required
            :rules="[ValidacionesContrato.numeroC21(), ValidacionesContrato.techoCapa(() => tipoContrato)]"
            variant="solo-filled"
          />
        </v-col>
        <v-btn
          v-if="tipoContrato === 3"
          class="ma-2"
          color="indigo"
          icon="mdi mdi-plus"
          max-height="30px"
          max-width="30px"
          @click="agregarCapa"
        />
      </v-row>
      <v-spacer />
      <br>
    </v-container>
  </v-form>
  <div>
    <v-row >
      <v-col>
        <v-data-table
          v-if="tipoContrato === 3"
          :headers="headers1"
          :items="capas"
          hide-default-footer
        >
          <template #item.modificar="{ item, index }">
            <v-btn
              color="warning"
              icon="mdi-pencil"
              @click="editarCapa(item, index)"
            />
          </template>

          <template #item.borrar="{ item, index }">
            <v-btn
              color="error"
              icon="mdi-delete"
              @click="eliminarCapa(index)"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" type="button" @click="guardarDatosGenerales">
      Guardar datos
      <br> generales
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { NuevoContratoVida } from './NuevoContratoDG.actions'
import { useContratoStore } from '@/stores/contratoStore'
import { DialogType, useDialog } from '@/stores/dialogStore'
import { ValidacionesContrato } from './ValidacionesContrato'
import ModalEnviarDatos from './ModalEnviarDatos.vue'

const modalRef = ref<InstanceType<typeof ModalEnviarDatos> | null>(null)

const contratoStore = useContratoStore()
const dialog = useDialog()
const form = ref()


const {
  subramoOptions,
  fetchSubramos,
  monedaOptions,
  fetchMoneda,
  formaContractualOptions,
  fetchFormaContractual,
  tipoReaseguroOptions,
  fetchTipoReaseguro,
  tipoContratoOptions,
  fetchTipoContrato,
  criterioCoberturaOptions,
  fetchCriterioCobertura,
} = NuevoContratoVida()

onMounted(() => {
  fetchSubramos()
  fetchMoneda()
  fetchFormaContractual()
  fetchTipoReaseguro()
  fetchTipoContrato()
  fetchCriterioCobertura()
})


const reglaCriterio = (v: number | null | undefined): boolean | string =>
  (v !== null && v !== undefined && v.toString() !== '') ||
  'Criterio de cobertura requerido'

const subramoSelect = ref<string[]>([])
const moneda = ref<number[]>([])
const idContrato = ref('')
const inicioContrato = ref('')
const finContrato = ref('')
const tipoReaseguro = ref('')
const tipoContrato = ref<number | null>(null)
const formaContractual = ref('')
const criterioCobertura = ref<number>(0)
const negociosCubiertos = ref('')
const cesion = ref('')
const limiteMax = ref('0')
const limiteMaxResCR = ref('0')
const retencionP = ref('0')
const piso = ref('0')
const techo = ref('0')

const hidratarDesdeStore = () => {
  const g = contratoStore.general
  if (!g) return

  if (
    !subramoOptions.value.length ||
    !monedaOptions.value.length ||
    !formaContractualOptions.value.length ||
    !tipoReaseguroOptions.value.length ||
    !tipoContratoOptions.value.length ||
    !criterioCoberturaOptions.value.length
  ) {
    return
  }
  subramoSelect.value = [...g.subramo]
  moneda.value = [...g.cveMoneda]
  idContrato.value = g.idContrato
  negociosCubiertos.value = g.negociosCubiertos
  inicioContrato.value = g.fechaInicio
  finContrato.value = g.fechaFin
  formaContractual.value = g.cveFormaContractual
  tipoReaseguro.value = g.cveTReaseguro
  tipoContrato.value = g.idTContrato
  criterioCobertura.value = g.criterioCobertura
  limiteMax.value = g.limiteMax
  limiteMaxResCR.value = g.limiteMaxResCR
  retencionP.value = g.montoRetencion
  piso.value = g.piso
  techo.value = g.techo
  cesion.value = g.porcentajeCesion

  if (g.idTContrato === 3 && contratoStore.expc) {
    capas.value = contratoStore.expc.capas.map((c, i) => ({
      detalleCapa: `EXCEDENTE CAPA ${i + 1}`,
      retencionC: c.retencionC,
      techoC: c.techoC
    }))
  }
}

watch(
  [
    () => contratoStore.general,
    () => subramoOptions.value,
    () => monedaOptions.value,
    () => formaContractualOptions.value,
    () => tipoReaseguroOptions.value,
    () => tipoContratoOptions.value,
    () => criterioCoberturaOptions.value
  ],
  hidratarDesdeStore,
  { immediate: true }
)


interface CapaExPC {
  detalleCapa: string
  retencionC: string
  techoC: string
}
const retencionCapa = ref<string>('')
const techoCapa = ref<string>('')

const capas = ref<CapaExPC[]>([])
const capaEditando = ref<number | null>(null)

const headers1 = [
  { title: 'Detalle de Capa', key: 'detalleCapa' },
  { title: 'Retención Propia capa N', key: 'retencionC' },
  { title: 'Techo Capa N', key: 'techoC' },
  { title: 'Modificar', key: 'modificar', sortable: false },
  { title: 'Borrar', key: 'borrar', sortable: false },
]
const emit = defineEmits<{
  (e: 'actualizarFormaContractual', valor: number): void
}>()

watch(formaContractual, (valor) => {
  emit('actualizarFormaContractual', Number(valor))
})

watch(tipoContrato, value => {
  if (value === 3) {
    // Excedente por capas
    retencionP.value = ''
    cesion.value = ''
    piso.value = ''
    techo.value = ''
  } else {
    capas.value = []
    retencionCapa.value = ''
    techoCapa.value = ''
    capaEditando.value = null
  }
})

const agregarCapa = () => {
  if (retencionCapa.value === '' || techoCapa.value === '') return

  const index = capaEditando.value
  const detalle = index !== null ? `EXCEDENTE CAPA ${index + 1}` : `EXCEDENTE CAPA ${capas.value.length + 1}`

  const capa: CapaExPC = {
    detalleCapa: detalle,
    retencionC: retencionCapa.value.toString(),
    techoC: techoCapa.value.toString(),
  }

  if (index !== null) {
    capas.value[index] = capa
    capaEditando.value = null
  } else {
    capas.value.push(capa)
  }

  retencionCapa.value = ''
  techoCapa.value = ''
}

const editarCapa = (item: CapaExPC, index: number) => {
  retencionCapa.value = item.retencionC
  techoCapa.value = item.techoC
  capaEditando.value = index
}

const eliminarCapa = (index: number) => {
  capas.value.splice(index, 1)

  capas.value.forEach((c, i) => {
    c.detalleCapa = `EXCEDENTE CAPA ${i + 1}`
  })
}

const guardarDatosGenerales = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    dialog.show({
      title: 'Atención',
      message: 'Complete los campos obligatorios del contrato',
      type: DialogType.ERROR,
    })
    return
  }

  contratoStore.setGeneral({
    idContrato: idContrato.value,
    subramo: subramoSelect.value,
    negociosCubiertos: negociosCubiertos.value,
    fechaInicio: inicioContrato.value,
    fechaFin: finContrato.value,
    cveMoneda: moneda.value,
    cveFormaContractual: formaContractual.value,

    contratoProrrogado: null,
    fechaFinProrroga: null,
    contratoCancelado: null,
    fechaCancelacion: null,

    limiteMax: limiteMax.value,
    limiteMaxResCR: limiteMaxResCR.value,
    cveTReaseguro: tipoReaseguro.value,
    idTContrato: tipoContrato.value,
    criterioCobertura: criterioCobertura.value,
    montoRetencion: retencionP.value,
    piso: piso.value,
    techo: techo.value,
    porcentajeCesion: cesion.value,
  })


  if (tipoContrato.value === 3) {
    contratoStore.setDatosExPC({
      idContrato: idContrato.value,
      capas: capas.value,
    })
  }

  dialog.show({
    title: 'Información',
    message: 'Información almacenada correctamente',
    type: DialogType.SUCCESS,
  })
}
</script>
