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

        <v-col cols="12" md="4">
          <v-select
            :disabled="getID(cesionCoberBasiObj) === 1"
            v-model="indicadorDistrCObj"
            :items="indicadorDistrCOptions"
            label="Indicador Distr. Cesión"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
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
            :disabled="getID(comisionReasegObj) !== 1 || getID(cesionCoberBasiObj) !== 0"
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
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="1" v-if="getID(detalleCoberturaObj) === 1">
            <v-btn color="indigo" icon @click="agregarComision">
              <v-icon>{{ editandoAgrupacionIndex !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ editandoAgrupacionIndex !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
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

      <v-row v-if="itemsTablaCoberturas.length > 0">
        <v-col cols="12">
          <v-data-table :headers="headers2" :items="itemsTablaCoberturas">

            <template #item.comisionPA="{ value }">
              <span>{{ value }}%</span>
            </template>

            <template #item.comisionR="{ value }">
              <span>{{ value }}%</span>
            </template>

            <template #item.acciones="{ index, item }">
              <v-btn icon color="blue" variant="text" size="small" @click="editarCobertura(item, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" variant="text" size="small" @click="eliminarCobertura(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-col class="text-center mt-10">
        <v-btn class="btn-guardar" elevation="4" @click="guardarConfigReaseguro">
          ACTUALIZAR CONFIGURACIÓN GENERAL
        </v-btn>
      </v-col>
    </v-container>
  </v-form>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import { NuevoContratoVidaConR } from '@/pages/reaseguro/Contratos/Vida/NuevoContratoVida/NuevoContratoConfigR.actions'
import { useContratoStore, type ContratoGeneralConfReaseg, type TipoCoberturas } from "@/stores/reaseguro/contratos/vidaStore"
import { DialogType, useDialog } from "@/stores/general/dialogStore"
import { ValidacionesContrato } from '@/pages/reaseguro/Contratos/Vida/NuevoContratoVida/ValidacionesContrato'

const emits = defineEmits<{
  (e: 'on-save-complete'): void
}>();

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
const tipoCoberturaObj = ref<any>(null)
const comisionPrimerAnio = ref<number>(0)
const comisionRenovacion = ref<number>(0)
const reaseguradores = ref<any[]>([])

const itemsTablaCoberturas = ref<any[]>([])
const editandoAgrupacionIndex = ref<number | null>(null)

const getID = (item: any) => {
  if (item === null || item === undefined) return null;
  if (typeof item === 'object' && 'value' in item) return item.value;
  return item;
}

const getTX = (item: any): string => {
  if (item === null || item === undefined) return 'NULL';
  if (typeof item === 'object') return item.title || item.label || item.nombre || 'NULL';
  return String(item);
};

watch(
  [() => getID(comisionReasegObj.value), () => getID(detalleCoberturaObj.value)],
  async ([comision, detalle]) => {
    if (comision !== 1 || detalle !== 1) {
      await fetchTipoCobertura()
      tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
      return
    }

    if (detalle === 1) {
      tipoCoberturaOptions.value = tipoCoberturaOptions.value.filter(tipoCobertura => tipoCobertura.title !== 'GENERAL')

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
    detalleCoberturaObj.value = null
    tipoComisionObj.value = null
    comisionPrimerAnio.value = 0
    comisionRenovacion.value = 0
  }
})

watch(() => getID(detalleCoberturaObj.value), (val) => {
  if (val === 0) {
    itemsTablaCoberturas.value = [];
    editandoAgrupacionIndex.value = null;
    const opcionGeneral = tipoCoberturaOptions.value.find(o => Number(o.value) === 2);
    if (opcionGeneral) {
      tipoCoberturaObj.value = opcionGeneral;
    }
  }
});

const findInOptions = (options: any[], value: any) => {
  const id = getID(value);
  if (id === null) return null;
  return options.find(o => getID(o) == id) || null;
}

const agregarComision = () => {
  procesarGuardado()
}

const procesarGuardado = () => {
  if (!tipoCoberturaObj.value) {
    dialog.show({ title: 'Aviso', message: 'Seleccione un tipo de cobertura', type: DialogType.INFO });
    return;
  }

  const crearEstructuraRegistro = () => ({
    tipoCoberturaObj: tipoCoberturaObj.value,
    tipoCoberturaNombre: tipoCoberturaObj.value?.title || '-',
    comisionPA: comisionPrimerAnio.value || 0,
    comisionR: comisionRenovacion.value || 0,
  });

  if (editandoAgrupacionIndex.value !== null) {
    itemsTablaCoberturas.value[editandoAgrupacionIndex.value] = crearEstructuraRegistro();
    editandoAgrupacionIndex.value = null; // Resetear modo edición
  } else {
    const existe = itemsTablaCoberturas.value.some(
      item => getID(item.tipoCoberturaObj) === getID(tipoCoberturaObj.value)
    );

    if (existe) {
      dialog.show({ title: 'Aviso', message: 'Esta cobertura ya fue agregada a la tabla.', type: DialogType.INFO });
      return;
    }

    itemsTablaCoberturas.value.push(crearEstructuraRegistro());
  }

  limpiarCamposCaptura();
};

const limpiarCamposCaptura = () => {
  tipoCoberturaObj.value = null
  comisionPrimerAnio.value = 0
  comisionRenovacion.value = 0
}

const editarCobertura = (item: any, index: number) => {
  editandoAgrupacionIndex.value = index;
  tipoCoberturaObj.value = findInOptions(tipoCoberturaOptions.value, item.tipoCoberturaObj);
  comisionPrimerAnio.value = item.comisionPA;
  comisionRenovacion.value = item.comisionR;
}


const eliminarCobertura = (index: number) => itemsTablaCoberturas.value.splice(index, 1)

const hidratar = () => {
  const cfg = contratoStore.configReaseg
  if (!cfg) return

  companiaReasegObj.value = compaReasegOptions.value.find(o => Number(o.value) === Number(getID(cfg.cveReasegurador)))
  indicadorDistrCObj.value = indicadorDistrCOptions.value.find(o => Number(o.value) === Number(getID(cfg.indicadorDistrC)))
  cesionCoberBasiObj.value = siNoOptions.find(o => o.value === getID(cfg.cesionCoberBasi))
  comisionReasegObj.value = siNoOptions.find(o => o.value === getID(cfg.comisionReaseg))
  detalleCoberturaObj.value = siNoOptions.find(o => o.value === getID(cfg.detalleCobertura))
  tipoComisionObj.value = tipoComisionOptions.value.find(o => Number(o.value) === Number(getID(cfg.tipoComision)))

  participacion.value = cfg.participacion || 0

  if (cfg.coberturas && cfg.coberturas.length > 0) {
    if (getID(detalleCoberturaObj.value) === 0) {
      const general = cfg.coberturas[0]
      comisionPrimerAnio.value = general?.comisionPrimerAnio || 0
      comisionRenovacion.value = general?.comisionRenovacion || 0
      tipoCoberturaObj.value = tipoCoberturaOptions.value.find(o => Number(o.value) === 2)
    }
    else {
      itemsTablaCoberturas.value = cfg.coberturas.map(c => {
        const opcionTipo = tipoCoberturaOptions.value.find(o =>
            String(o.title) === String(c.tipoCobertura) ||
            Number(o.value) === Number(c.tipoCobertura)
        )

        return {
          tipoCoberturaObj: opcionTipo || { title: c.tipoCobertura, value: null },
          tipoCoberturaNombre: opcionTipo ? opcionTipo.title : c.tipoCobertura,
          comisionPA: c.comisionPrimerAnio,
          comisionR: c.comisionRenovacion
        }
      })
    }
  }
}
watch(() => companiaReasegObj.value, (nuevoValor) => {
  if (!nuevoValor) return;

  const id = getID(nuevoValor);
  const yaExiste = contratoStore.listaReaseguradoresFinal?.some(
    (r: any) => getID(r.cveReasegurador) === id
  );

  if (yaExiste) {
    dialog.show({
      title: 'Atención',
      message: 'Esta reaseguradora ya está en la lista.',
      type: DialogType.ERROR
    });
    nextTick(() => { companiaReasegObj.value = null; });
  }
});

watch(cesionCoberBasiObj, (value) => {
  const idValue = getID(value);
  const opcionDefault = indicadorDistrCOptions.value.find(o => Number(o.value) === 0);

  if (idValue === 0) {
    indicadorDistrCObj.value = opcionDefault;
  } else {
    indicadorDistrCObj.value = opcionDefault;
  }
});

const guardarConfigReaseguro = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ title: 'Error', message: 'Falta ID de contrato.', type: DialogType.ERROR })
    return
  }

  const sumaPrevia = contratoStore.totalParticipacion;
  const participacionNueva = Number(participacion.value.toFixed(2));
  const totalConNuevo = sumaPrevia + participacionNueva;

  if (totalConNuevo > 100.01) {
    dialog.show({
      title: 'Confirmación de Participación',
      message: `La participación total acumulada será de ${totalConNuevo.toFixed(2)}%. ¿Desea continuar a pesar de exceder el 100%?`,
      type: DialogType.CONFIRM,
      onConfirm: () => ejecutarGuardadoFinal(idContrato) // Función que ejecuta el proceso final
    });
  } else {
    ejecutarGuardadoFinal(idContrato);
  }
}

const ejecutarGuardadoFinal = (idContrato: string) => {
  let coberturasFinal: TipoCoberturas[] = []

  if (getID(detalleCoberturaObj.value) === 1) {
    coberturasFinal = itemsTablaCoberturas.value.map(c => ({
      tipoCobertura: String(getTX(c.tipoCoberturaObj)),
      comisionPrimerAnio: c.comisionPA,
      comisionRenovacion: c.comisionR
    }))
  } else {
    coberturasFinal = [{
      tipoCobertura: getTX(tipoCoberturaObj.value),
      comisionPrimerAnio: comisionPrimerAnio.value,
      comisionRenovacion: comisionRenovacion.value
    }]
  }

  const payload: ContratoGeneralConfReaseg = {
    idContrato,
    cveReasegurador: getID(companiaReasegObj.value),
    nombreReasegurador: companiaReasegObj.value?.title || '',
    participacion: Number(participacion.value.toFixed(2)),
    indicadorDistrC: indicadorDistrCObj.value,
    cesionCoberBasi: cesionCoberBasiObj.value,
    comisionReaseg: comisionReasegObj.value,
    detalleCobertura: detalleCoberturaObj.value,
    tipoComision: tipoComisionObj.value,
    coberturas: coberturasFinal
  }

  contratoStore.setConfigReasG(payload);

  contratoStore.tempReasegurador = {
    cveReasegurador: payload.cveReasegurador,
    nombreReasegurador: payload.nombreReasegurador,
    participacion: payload.participacion,
  };

  dialog.show({ title: 'Éxito', message: 'Configuración guardada.', type: DialogType.SUCCESS })
  emits('on-save-complete')
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

const headers2 = [
  { title: 'Tipo cobertura', key: 'tipoCoberturaNombre' },
  { title: 'Comisión Primer Año', key: 'comisionPA' },
  { title: 'Comisión Renovación', key: 'comisionR' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

</script>
