<template>
  <v-form ref="formRef">
    <v-container>
      <v-row class="align-center">
        <v-col cols="12" md="6">
          <v-autocomplete
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
      </v-row>
      <br>
      <v-row>
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

        <v-col cols="12" md="4" v-if="getID(cesionCoberBasiObj) === 1">
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

        <v-col cols="12" md="6" >
          <div class="text-subtitle-2 d-flex align-center mb-2">
            % Comisión renovación (Fija/Provisional)
            <v-tooltip activator="parent" location="top" max-width="350">
              Si la comisión es igual para el primer año y sus renovaciones, se deberá colocar el mismo dato en ambos campos.
            </v-tooltip>
          </div>
          <v-slider v-model="comisionRenovacion" min="0" max="100" step="0.01" thumb-label color="orange" >
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
import { onMounted, ref, watch, nextTick, computed } from 'vue'
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
const tipoCoberturaObj = ref<any>(null) // como quito la opcion de general si detalleCobertura es igual a Si
const comisionPrimerAnio = ref<number>(0)
const comisionRenovacion = ref<number>(0)
const reaseguradores = ref<any[]>([])

const getID = (item: any) => {
  if (item === null || item === undefined) return null;
  if (typeof item === 'object' && 'value' in item) return item.value;
  return item;
}


watch(
  [() => getID(comisionReasegObj.value), () => getID(detalleCoberturaObj.value)],
  ([comision, detalle]) => {
    if (comision !== 1 || detalle !== 1) {
      tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
      return
    }
    // segun yo aqui debe ir la logica para filtrar las opciones de tipoCobertura si detalle es igual a 1 debera solo mostrar basica y badi que es 0 y 1

    if (detalle === 1) {
      const yaExisteBasicaEnTarifas = contratoStore.configReasegCob?.tarifas?.some(
        (t: any) => getID(t.tipoCobertura) === 0
      )

      if (yaExisteBasicaEnTarifas) {
        tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 1)
      } else {
        tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 0)
      }
    }
  },
  { immediate: false }
)

watch(() => getID(comisionReasegObj.value), (val) => {
  if (val === 1) {
    if (!detalleCoberturaObj.value) detalleCoberturaObj.value = siNoOptions.find(o => o.value === 0)
    if (!tipoComisionObj.value) tipoComisionObj.value = tipoComisionOptions.value.find(o => Number(o.value) === 0)
  } else {
    detalleCoberturaObj.value = siNoOptions.find(o => o.value === 0)
    tipoComisionObj.value = null
    comisionPrimerAnio.value = 0
    comisionRenovacion.value = 0
  }
})


const hidratar = () => {
  const cfg = contratoStore.configReaseg
  if (!cfg) return
  companiaReasegObj.value = compaReasegOptions.value.find(o =>
      Number(o.value) === Number(getID(cfg.cveReasegurador))
  )
  indicadorDistrCObj.value = indicadorDistrCOptions.value.find(o => Number(o.value) === Number(getID(cfg.indicadorDistrC)))
  cesionCoberBasiObj.value = siNoOptions.find(o => o.value === getID(cfg.cesionCoberBasi))
  comisionReasegObj.value = siNoOptions.find(o => o.value === getID(cfg.comisionReaseg))
  detalleCoberturaObj.value = siNoOptions.find(o => o.value === getID(cfg.detalleCobertura))
  tipoComisionObj.value = tipoComisionOptions.value.find(o => Number(o.value) === Number(getID(cfg.tipoComision)))

  tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === Number(getID(cfg.tipoCobertura)))

  comisionPrimerAnio.value = cfg.comisionPrimerAnio || 0
  comisionRenovacion.value = cfg.comisionRenovacion || 0
}

const guardarConfigReaseguro = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'Falta ID de contrato.', type: DialogType.ERROR })
    return
  }

  const sumaPrevia = contratoStore.totalParticipacion;
  if (sumaPrevia + participacion.value > 100.01) {
    dialog.show({ title: 'Error', message: 'La participación total excedería el 100%', type: DialogType.ERROR })
    return;
  }

  const payload: ContratoGeneralConfReaseg = {
    idContrato,
    cveReasegurador: getID(companiaReasegObj.value),
    nombreReasegurador: companiaReasegObj.value ? companiaReasegObj.value.title : '',
    participacion: Number(participacion.value.toFixed(2)),
    indicadorDistrC: indicadorDistrCObj.value,
    cesionCoberBasi: cesionCoberBasiObj.value,
    comisionReaseg: comisionReasegObj.value,
    detalleCobertura: detalleCoberturaObj.value,
    tipoComision: tipoComisionObj.value,
    tipoCobertura: tipoCoberturaObj.value,
    comisionPrimerAnio: Number(comisionPrimerAnio.value.toFixed(2)),
    comisionRenovacion: Number(comisionRenovacion.value.toFixed(2))
  }

  contratoStore.setConfigReasG(payload);
  contratoStore.tempReasegurador = {
    cveReasegurador: getID(companiaReasegObj.value),
    nombreReasegurador: companiaReasegObj.value ? companiaReasegObj.value.title : '',
    participacion: Number(participacion.value.toFixed(2)),
  };
  dialog.show({ title: 'Éxito', message: 'Configuración guardada correctamente.', type: DialogType.SUCCESS })
}

onMounted(async () => {
  await Promise.all([
    fetchReaseguradores(),
    fetchIndicadorDistriC(),
    fetchTipoComision(),
    fetchTipoCobertura()
  ])

  if (!contratoStore.configReaseg) {
    indicadorDistrCObj.value = indicadorDistrCOptions.value.find(o => Number(o.value) === 0)
    cesionCoberBasiObj.value = siNoOptions.find(o => o.value === 1)
    comisionReasegObj.value = siNoOptions.find(o => o.value === 0)
    detalleCoberturaObj.value = siNoOptions.find(o => o.value === 0)
    tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
  } else {
    hidratar()
  }
})

const headersReaseg = [
  { title: 'Reaseguradora', key: 'nombreReasegurador' },
  { title: '% Participación', key: 'participacion' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
