<template>
  <div v-if="estaHabilitado">
    <v-form ref="formRef">
      <v-container>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="4">
            <v-select
              v-model="coberturaObj"
              :items="tipoCoberturaOptions"
              label="Tipo de cobertura"
              item-title="title"
              chips
              return-object
              variant="solo-filled"
            />
          </v-col>
        </v-row>
        <v-row class="align-center">
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

        <v-row>
          <v-col cols="12" md="4">
            <v-file-input
              v-model="cargarComisiones"
              label="Cargar comisiones (CSV)"
              accept=".csv"
              variant="solo-filled"
              @update:model-value="alCambiarArchivo"
            />
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="comisiones"
              density="compact"
              class="elevation-1"
            >
              <template #item.cveReasegurador="{ item }">
                <span class="font-weight-bold">{{ item.cveReasegurador }}</span>
              </template>
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
              @click="guardarDatos"
            >
              Guardar comisiones escalonadas
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>

  <v-container v-else>
    <v-alert type="info" variant="tonal" border="start">
      La sección de <strong>Comisión Escalonada</strong> no aplica para el Tipo de Comisión seleccionado actualmente.
    </v-alert>
  </v-container>
</template>
<script lang="ts" setup>
import { watch, ref, computed, onMounted } from 'vue'
import { useContratoStore, type ComisionReaseguro, type ContratoConfigReasCom } from '@/stores/contratoStore'
import { useDialog, DialogType } from '@/stores/dialogStore'
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'

const emits = defineEmits<{
  (e: 'on-save-complete'): void
}>();

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref<any>(null)
const limiteInf = ref<number>(0)
const limiteSup = ref<number>(0)
const comisionDef = ref<number>(0)
const comisiones = ref<ComisionReaseguro[]>([])
const cargarComisiones = ref<File | null>(null)
const editIndex = ref<number | null>(null)
const coberturaObj = ref<any>(null)

const {
  tipoCoberturaOptions, fetchTipoCobertura
} = NuevoContratoVidaConR()

onMounted(async () => {
  await Promise.all([
    fetchTipoCobertura()
  ])
})

const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

const estaHabilitado = computed(() => {
  const tipo = contratoStore.configReaseg?.tipoComision
  const id = getID(tipo)
  return id == 2
})

const alCambiarArchivo = (file: File | File[] | null) => {
  const selectedFile = Array.isArray(file) ? file[0] : file;
  if (selectedFile) procesarArchivoCSV(selectedFile);
};

const procesarArchivoCSV = (file: File) => {

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const target = e.target as FileReader;
    if (!target) return;
    const content = target.result as string;
    const lineas = content.split(/\r?\n/).filter(l => l.trim() !== '');
    const primeraLinea = lineas[0];
        if (!primeraLinea) {
          dialog.show({ type: DialogType.ERROR, message: 'No se pudo leer el encabezado', title: 'Error' });
          return;
    }
    const encabezados = primeraLinea.toUpperCase().split(',').map(h => h.trim());
    const idxReas = encabezados.indexOf('REASEGURADOR');
    const idxInf = encabezados.indexOf('LIMITE_INF');
    const idxSup = encabezados.indexOf('LIMITE_SUP');
    const idxCom = encabezados.indexOf('COMISION');

    if (idxInf === -1 || idxSup === -1 || idxCom === -1) {
      dialog.show({
        type: DialogType.ERROR,
        message: 'El CSV debe tener las columnas: Reasegurador, Limite_inf, Limite_sup, Comision',
        title: 'Formato Incorrecto'
      });
      return;
    }
    const nuevosRegistros = lineas.slice(1).map(linea => {
      const col = linea.split(',').map(c => c.trim());
      return {
        cveReasegurador: col[idxReas] || 'N/A',
        tipoCobertura: col[idxReas],
        limiteInf: parseFloat(col[idxInf] || '0'),
        limiteSup: parseFloat(col[idxSup] || '0'),
        comisionDefinitiva: parseFloat(col[idxCom] || '0')
      };
    });

    comisiones.value = [...comisiones.value, ...nuevosRegistros];

    dialog.show({ type: DialogType.SUCCESS, message: 'Datos cargados en la tabla', title: 'Éxito' });
    cargarComisiones.value = null;
  };
  reader.readAsText(file);
};

const headers = [
  { title: 'Tipo de cobertura', key: 'tipoCobertura' },
  { title: 'Límite inf (%)', key: 'limiteInf' },
  { title: 'Límite sup (%)', key: 'limiteSup' },
  { title: '% Comisión', key: 'comisionDefinitiva' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

const hidratarDesdeStore = () => {
  const cfg = contratoStore.configReasegCom
  if (!cfg) return

  coberturaObj.value = cfg.tipoCobertura || ''

  if (Array.isArray(cfg.comisiones)) {
    comisiones.value = cfg.comisiones.map(c => ({
      ...c,
      tipoCobertura: cfg.tipoCobertura
    }));
  }
}

watch(
  () => contratoStore.configReasegCom,
  () => hidratarDesdeStore(),
  { immediate: true, deep: true }
)

const agregarComision = async () => {
  if (!coberturaObj.value) {
    dialog.show({ title: 'Advertencia', message: 'Debe ingresar un tipo de cobertura.', type: DialogType.ERROR });
    return;
  }

  if (Number(limiteSup.value) <= Number(limiteInf.value)) {
    dialog.show({ title: 'Advertencia', message: 'El límite superior debe ser mayor al inferior.', type: DialogType.ERROR });
    return;
  }

  const nombreCobertura = coberturaObj.value && typeof coberturaObj.value === 'object'
    ? coberturaObj.value.title
    : coberturaObj.value;

  const nueva = {
    cveReasegurador: 'MANUAL',
    tipoCobertura: nombreCobertura,
    limiteInf: Number(limiteInf.value),
    limiteSup: Number(limiteSup.value),
    comisionDefinitiva: Number(comisionDef.value),
  };

  if (editIndex.value !== null) {
    comisiones.value[editIndex.value] = nueva;
  } else {
    comisiones.value.push(nueva);
  }

  limpiarFormulario();
};

const editarComision = (item: any, index: number) => {
  coberturaObj.value = item.tipoCobertura
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
    dialog.show({ title: 'Error', message: 'No hay contrato activo.', type: DialogType.ERROR })
    return
  }
  const tipoCoberturaF = coberturaObj.value && typeof coberturaObj.value === 'object'
    ? coberturaObj.value.title
    : coberturaObj.value;

  contratoStore.setConfigReasCom({
    idContrato,
    tipoCobertura: String(tipoCoberturaF),
    comisiones: JSON.parse(JSON.stringify(comisiones.value)),
  })

  dialog.show({ title: 'Éxito', message: 'Configuración guardada.', type: DialogType.SUCCESS })
  emits('on-save-complete')
}
</script>
