<template>
  <v-form ref="formRef">
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="4">
          <v-select
            v-model="agrupacionCoberturas"
            :items="siNoOptions"
            label="¿Agrupación de coberturas?"
            chips
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center align-center" v-if="agrupacionCoberturas === 1">
        <v-col cols="12" md="5">
          <p class="text-subtitle-2 mb-2">Coberturas para agrupar:</p>
          <v-data-table
            v-model="coberturasParaAgrupar"
            :headers="[{ title: 'Coberturas Disponibles', key: 'title' }]"
            :items="coberturasDisponiblesParaAgrupar"
            show-select
            item-value="value"
            return-object
            density="compact"
            max-height="300px"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="coberturaMadreObj"
            :items="coberturasDisponiblesParaAgrupar"
            item-title="title"
            chips
            return-object
            label="Agrupar en (Cobertura Madre):"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn color="indigo" icon @click="agregarAgrupacion">
            <v-icon>{{ editandoAgrupacionIndex !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editandoAgrupacionIndex !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
            </v-tooltip>
          </v-btn>
        </v-col>

        <v-col cols="12" md="10" v-if="agrupaciones.length > 0">
          <v-data-table :headers="headersAgrupacion" :items="agrupaciones" hide-default-footer>
            <template v-slot:item.coberturas="{ item }">
              {{ item.coberturas.map((c: any) => c.title).join(', ') }}
            </template>
            <template v-slot:item.madre="{ item }">
              <v-chip color="primary" label>{{ item.madre?.title }}</v-chip>
            </template>
            <template v-slot:item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" @click="editarAgrupacion(item, index)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon color="red" variant="text" @click="eliminarAgrupacion(index)"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasBasiObj"
            :items="coberturasBasiOptions"
            label="Coberturas básicas"
            item-title="title"
            return-object
            multiple
            chips
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasAdiciObj"
            :items="coberturasAdiciOptions"
            label="Coberturas adicionales"
            item-title="title"
            return-object
            multiple
            chips
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCapa"
            :items="siNoOptions"
            label="¿Detalle por capa?"
            chips
            :disabled="!esExcedentePorCapas"
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row>
        <v-col cols="12" md="4" v-if="detalleCapa === 1">
          <v-select
            v-model="capaSeleccionada"
            :items="detalleCOptions"
            chips
            label="Detalle de capa"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCobertura"
            :items="siNoOptions"
            chips
            label="¿Detalle por cobertura?"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4" v-if="detalleCobertura === 1">
          <v-select
            v-model="coberturaTarifaObj"
            label="Cobertura"
            :items="coberturasPermitidasParaTarifa"
            item-title="title"
            chips
            return-object
            hide-selected
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="tipoTarifaObj"
            :items="tipoTarifaOptions"
            label="Tipo de tarifa"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 0">
          <v-text-field v-model.number="primaTarFi" label="Monto Fijo" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]" />
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 1">
          <v-text-field v-model.number="porSobrePrimaE" label="% Prima" suffix="%" type="number" variant="solo-filled" :rules="[ValidacionesContrato.participacion()]"/>
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 3">
          <v-text-field v-model.number="tarifaFijaM" label="Tasa al millar" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]"/>
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 2">
          <v-text-field v-model.number="factorTarifaP" label="Factor %" type="number" variant="solo-filled" :rules="[ValidacionesContrato.participacion()]"/>
        </v-col>

        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 2">
          <v-select
            v-model="tarifaPropiaObj"
            :items="tarifasPropiasOptions"
            item-title="title"
            return-object
            label="Tarifa propia"
            chips
            multiple
            clearable
            variant="solo-filled"
            :rules="[v => !!v || 'Debe seleccionar una tarifa propia']"
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn color="indigo" icon @click="agregarTarifa">
            <v-icon>{{ editandoIndex !== -1 ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editandoIndex !== -1 ? 'Actualizar registro' : 'Agregar detalle tarifa' }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>


      <v-row v-if="itemsTablaTarifas.length > 0">
        <v-col cols="12">
          <v-data-table
            :headers="headers2"
            :items="itemsTablaTarifas"
            class="elevation-1"
          >
            <template #item.tipoTarifa="{ item }">
              {{ item.tipoTarifa?.title }}
            </template>

            <template #item.primaTarifa="{ item }">
              <span v-if="item.tipoTarifa?.value === 0">$ {{ item.primaTarifa }}</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.porSobrePrima="{ item }">
              <span v-if="item.tipoTarifa?.value === 1">{{ item.porSobrePrima }}%</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.tarifaFijaM="{ item }">
              <span v-if="item.tipoTarifa?.value === 3">{{ item.tarifaFijaM }}</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.factorTap="{ item }">
              <span v-if="item.tipoTarifa?.value === 2">{{ item.factorTap }}%</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.tarifaPropia="{ item }">
              <div v-if="item.tipoTarifa?.value === 2 && item.nombreArchivo">
                <v-icon size="small" color="green" class="mr-1">mdi-file-csv</v-icon>
                <small>{{ item.nombreArchivo }}</small>
              </div>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" size="small" @click="editarTarifa(item, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" variant="text" size="small" @click="eliminarTarifa(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col class="text-center">
          <v-btn class="btn-guardar" @click="guardarTodoEnStore">
            GUARDAR COBERTURAS
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContratoStore } from "@/stores/contratoStore"
import { DialogType, useDialog } from "@/stores/dialogStore"
import { NuevoContratoVidaConR } from './NuevoContratoConfigR.actions'
import { ValidacionesContrato } from './ValidacionesContrato'

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref()

const {
  coberturasOptions, fetchCoberturas,
  coberturasBasiOptions, fetchCoberturasBasicas,
  coberturasAdiciOptions, fetchCoberturasAdicionales,
  tipoTarifaOptions, fetchTipoTarifa,
  tarifasPropiasOptions, fetchTarifaPropia
} = NuevoContratoVidaConR()

const siNoOptions = [{ title: 'SI', value: 1 }, { title: 'NO', value: 0 }]

const agrupacionCoberturas = ref(0)
const coberturasParaAgrupar = ref<any[]>([])
const coberturaMadreObj = ref<any>(null)
const agrupaciones = ref<any[]>([])

const coberturasBasiObj = ref<any[]>([])
const coberturasAdiciObj = ref<any[]>([])
const detalleCapa = ref(0)
const capaSeleccionada = ref<string | null>(null)

const detalleCobertura = ref(0)
const coberturaTarifaObj = ref<any>(null)
const tipoTarifaObj = ref<any>(null)

const primaTarFi = ref<number>(0)
const porSobrePrimaE = ref<number>(0)
const tarifaFijaM = ref<number>(0)
const factorTarifaP = ref<number>(0)
const tarifaPropiaObj = ref<any[]>([])

const itemsTablaTarifas = ref<any[]>([])
const editandoAgrupacionIndex = ref<number | null>(null)
const editandoIndex = ref(-1)

const getID = (item: any) => {
  if (item === null || item === undefined) return null;
  return (typeof item === 'object' && 'value' in item) ? item.value : item;
}

const existeTarifaDuplicada = (
  cveCob: any,
  idTipoTarifa: number,
  nombreArchivo: string | null
) => {
  return itemsTablaTarifas.value.some(item => {
    if (item.cveCob !== cveCob) return false
    if (item.tipoTarifa?.value !== idTipoTarifa) return false
    if (idTipoTarifa !== 2) return true

    return item.nombreArchivo === nombreArchivo
  })
}


watch(() => getID(tipoTarifaObj.value), (tipo) => {
  primaTarFi.value = 0;
  porSobrePrimaE.value = 0;
  tarifaFijaM.value = 0;
  factorTarifaP.value = 0;

  if (tipo === 1) {
    porSobrePrimaE.value = 100;
  } else if (tipo === 2) {
    factorTarifaP.value = 100;
  }

  if (tipo !== 2) {
    tarifaPropiaObj.value = [];
  }
})
const esExcedentePorCapas = computed(() => {
  const id = getID(contratoStore.general?.idTContrato);
  return Number(id) === 3;
})

watch(esExcedentePorCapas, (valido) => {
  if (!valido) detalleCapa.value = 0;
})

const detalleCOptions = computed(() => contratoStore.expc?.capas.map(c => ({ title: c.detalleCapa, value: c.detalleCapa })) || [])

const coberturasDisponiblesParaAgrupar = computed(() => {
  const idsAgrupados = agrupaciones.value.flatMap(a => a.coberturas.map((c: any) => c.value))
  return coberturasOptions.value.filter(c => !idsAgrupados.includes(c.value))
})

const coberturasPermitidasParaTarifa = computed(() => {
  const idsPermitidos = [...coberturasBasiObj.value.map(c => c.value), ...coberturasAdiciObj.value.map(c => c.value)]
  return coberturasOptions.value.filter(c => idsPermitidos.includes(c.value))
})

const hidratarDesdeStore = () => {
  const data = contratoStore.configReasegCob
  if (!data || Object.keys(data).length === 0) return
  agrupacionCoberturas.value = data.agrupacionCoberturas ?? 0
  agrupaciones.value = data.agrupaciones || []
  coberturasBasiObj.value = data.coberturasBasi || []
  coberturasAdiciObj.value = data.coberturasAdici || []
  detalleCapa.value = data.detalleCapa ?? 0
  detalleCobertura.value = data.detalleCobertura ?? 0
  itemsTablaTarifas.value = data.tarifas ? [...data.tarifas] : []
}

watch([() => coberturasOptions.value, () => tipoTarifaOptions.value], ([c, t]) => {
  if (c.length > 0 && t.length > 0) hidratarDesdeStore()
}, { immediate: true })

onMounted(async () => {
  await Promise.all([fetchCoberturas(), fetchCoberturasBasicas(), fetchCoberturasAdicionales(), fetchTipoTarifa(), fetchTarifaPropia()])
})

const agregarAgrupacion = () => {
  if (coberturasParaAgrupar.value.length === 0 || !coberturaMadreObj.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Faltan datos de agrupación', title: 'Error' }); return
  }
  agrupaciones.value.push({ coberturas: [...coberturasParaAgrupar.value], madre: { ...coberturaMadreObj.value } })
  coberturasParaAgrupar.value = []; coberturaMadreObj.value = null
}

const editarAgrupacion = (item: any, index: number) => {
  coberturasParaAgrupar.value = [...item.coberturas]; coberturaMadreObj.value = item.madre; eliminarAgrupacion(index)
}
const eliminarAgrupacion = (index: number) => agrupaciones.value.splice(index, 1)

const agregarTarifa = () => {
  const idTipoTarifa = getID(tipoTarifaObj.value);

  if (idTipoTarifa === null) {
    dialog.show({ type: DialogType.ERROR, message: 'Seleccione un tipo de tarifa', title: 'Error' });
    return;
  }

  if (detalleCapa.value === 1 && !capaSeleccionada.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Debe seleccionar una capa', title: 'Error' });
    return;
  }

  const idCobSeleccionada = getID(coberturaTarifaObj.value);
  let tipoCoberturaTexto = 'BÁSICA';

  if (idCobSeleccionada !== null) {
    const esBasica = coberturasBasiObj.value.some(c => getID(c) == idCobSeleccionada);
    const esAdicional = coberturasAdiciObj.value.some(c => getID(c) == idCobSeleccionada);

    if (esBasica) tipoCoberturaTexto = 'BÁSICA';
    else if (esAdicional) tipoCoberturaTexto = 'BADI';
  }

  const fechaInicio = contratoStore.general?.fechaInicio;
  const anioVigencia = fechaInicio ? new Date(fechaInicio).getFullYear() : new Date().getFullYear();

  let listaAProcesar: any[] = [];

    if (idTipoTarifa !== 2) {
    const coberturaRepetida = itemsTablaTarifas.value.some(
      i => i.cveCob === idCobSeleccionada
    );

    if (coberturaRepetida) {
      dialog.show({
        type: DialogType.ERROR,
        title: 'Error',
        message: 'La cobertura ya fue agregada'
      });
      return;
    }
  }

  if (idTipoTarifa === 2) {
    if (tarifaPropiaObj.value.length > 0) {
      listaAProcesar = [...tarifaPropiaObj.value];
    } else {
      listaAProcesar = [{
        title: `${coberturaTarifaObj.value?.title || 'COB'}_${anioVigencia}`
      }];
    }
  } else {
    listaAProcesar = [null];
  }

  for (const item of listaAProcesar) {
    const nombreArchivo = item?.title ?? null;

    const duplicado = existeTarifaDuplicada(
      idCobSeleccionada,
      idTipoTarifa,
      nombreArchivo
    );

    if (duplicado) {
      dialog.show({
        type: DialogType.ERROR,
        title: 'Error',
        message:
          idTipoTarifa === 2
            ? 'El archivo ya fue agregado para esta cobertura'
            : 'No se permiten coberturas o tarifas repetidas'
      });
      return;
    }
  }

  if (editandoIndex.value > -1) {
    itemsTablaTarifas.value[editandoIndex.value] =
      generarObjetoFila(listaAProcesar[0], tipoCoberturaTexto, idCobSeleccionada);
  } else {
    listaAProcesar.forEach(item => {
      itemsTablaTarifas.value.push(
        generarObjetoFila(item, tipoCoberturaTexto, idCobSeleccionada)
      );
    });
  }

  editandoIndex.value = -1;
  limpiarTarifa();
};

const generarObjetoFila = (itemTarifa: any, tipoTexto: string, idCob: any) => {
  const nombreFinal = itemTarifa?.title ?? null;

  return {
    detalleCapa: detalleCapa.value === 1 ? (capaSeleccionada.value || 'SI') : 'NO',
    tipoCobertura: tipoTexto,
    cobertura: coberturaTarifaObj.value?.title || '',
    cveCob: idCob,
    tipoTarifa: { ...tipoTarifaObj.value },
    primaTarifa: primaTarFi.value,
    porSobrePrima: porSobrePrimaE.value,
    tarifaFijaM: tarifaFijaM.value,
    factorTap: factorTarifaP.value,
    nombreArchivo: nombreFinal,
    tarifaPropia: nombreFinal
  }
}

const limpiarTarifa = () => {
  coberturaTarifaObj.value = null;
  tipoTarifaObj.value = null;
  primaTarFi.value = 0;
  porSobrePrimaE.value = 0;
  tarifaFijaM.value = 0;
  factorTarifaP.value = 0;
  tarifaPropiaObj.value = [];
  capaSeleccionada.value = null;
}

const editarTarifa = (item: any, index: number) => {
  editandoIndex.value = index;
  detalleCOptions.value.forEach(c => {
    if (c.title === item.detalleCapa) {
      capaSeleccionada.value = c.value;
    }
  });

  detalleCobertura.value = item.detalleCapa === 'NO' ? 0 : 1;
  coberturaTarifaObj.value = coberturasOptions.value.find(c => c.value === item.cveCob) || null;
  tipoTarifaObj.value = item.tipoTarifa;
  primaTarFi.value = item.primaTarifa;
  porSobrePrimaE.value = item.porSobrePrima;
  tarifaFijaM.value = item.tarifaFijaM;
  factorTarifaP.value = item.factorTap;
  tarifaPropiaObj.value = item.nombreArchivo
    ? [{ title: item.nombreArchivo }]
    : [];
}

const eliminarTarifa = (index: number) => itemsTablaTarifas.value.splice(index, 1)

const guardarTodoEnStore = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) {
    dialog.show({ type: DialogType.ERROR, message: 'No hay contrato activo', title: 'Error' });
    return
  }

  const payload = {
    idContrato,
    agrupacionCoberturas: agrupacionCoberturas.value,
    agrupaciones: agrupaciones.value,
    coberturasBasi: coberturasBasiObj.value,
    coberturasAdici: coberturasAdiciObj.value,
    detalleCapa: detalleCapa.value,
    detalleC: contratoStore.expc?.capas || [],
    detalleCobertura: detalleCobertura.value,
    tarifas: itemsTablaTarifas.value
  }

  contratoStore.setConfigReasCob(payload)
  dialog.show({ type: DialogType.SUCCESS, message: 'Configuración de coberturas guardada', title: 'Éxito' })
}

const headersAgrupacion = [
  { title: 'Coberturas', key: 'coberturas' },
  { title: 'Agrupar en:', key: 'madre' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const headers2 = [
  { title: 'Detalle capa', key: 'detalleCapa' },
  { title: 'Tipo cobertura', key: 'tipoCobertura' },
  { title: 'Cobertura', key: 'cobertura' },
  { title: 'Tipo de tarifa', key: 'tipoTarifa' },
  { title: 'Prima Fija', key: 'primaTarifa' },
  { title: '% Prima Em.', key: 'porSobrePrima' },
  { title: 'Tarifa al Millar', key: 'tarifaFijaM' },
  { title: 'Factor Propio', key: 'factorTap' },
  { title: 'Tarifa Propia', key: 'tarifaPropia' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
