<template>
  <v-form ref="formRef">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="contratoProrrogado"
            label="¿Contrato prorrogado?"
            variant="solo-filled"
            chips
            readonly
          />
        </v-col>
        <v-col cols="12" md="3" v-if="contratoProrrogado === 1" >
          <!--Solo será requerido si contrato prorrogado es si-->
          <!--o	solo se podrá seleccionar una fecha mayor a la Fecha fin contrato (habilitar solo el calendario de acuerdo con esta condición)-->
          <v-date-input
            v-model="fechaFinProrroga"
            label="Fecha fin prórroga"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="solo-filled"
            readonly
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="contratoCancelado"
            label="¿Contrato cancelado?"
            variant="solo-filled"
            chips
            readonly
          />
        </v-col>
        <v-col cols="12" md="3" v-if="contratoCancelado === 1 || contratoProrrogado === 0">
          <!--Solo será requerido si contrato cancelado es si-->
          <!--¿Contrato prorrogado? = NO,	solo se podrá seleccionar una fecha mayor a la Fecha fin contrato (habilitar solo el calendario de acuerdo con esta condición)-->
          <v-date-input
            v-model="fechaCancelacion"
            label="Fecha cancelación"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="solo-filled"
            readonly
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="subramoObj"
            label="Subramo"
            required
            variant="solo-filled"
            multiple
            chips
            return-object
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="idContrato"
            label="Identificador de contrato"
            variant="solo-filled"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="negociosCubiertos"
            label="Negocios cubiertos"
            required
            variant="solo-filled"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="monedaObj"
            label="Moneda"
            required
            variant="solo-filled"
            chips
            return-object
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-date-input
            v-model="inicioContrato"
            label="Fecha inicio contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            required
            variant="solo-filled"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-date-input
            v-model="finContrato"
            label="Fecha fin contrato"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            required
            variant="solo-filled"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="formaContractualObj"
            label="Forma contractual"
            required
            chips
            variant="solo-filled"
            return-object
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="tipoReaseguroObj"
            label="Tipo de reaseguro"
            required
            chips
            variant="solo-filled"
            return-object
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="tipoContratoObj"
            label="Tipo de contrato"
            variant="solo-filled"
            chips
            :disabled="!tipoReaseguroObj"
            return-object
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="criterioCoberturaObj"
            label="Criterio de cobertura"
            required
            chips
            variant="solo-filled"
            return-object
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="displayLimiteMax"
            label="Limite máximo del contrato"
            variant="solo-filled"
            prefix="$"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="displayLimiteMaxResCR"
            label="Limite máximo de responsabilidad"
            variant="solo-filled"
            prefix="$"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="displayRetencionP"
            label="Retención propia"
            variant="solo-filled"
            prefix="$"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3" v-if="[1, 7, 9].includes(Number(getID(tipoContratoObj)))">
          <v-text-field
            v-model="cesion"
            label="Cesión"
            suffix="%"
            variant="solo-filled"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3" v-if="[2, 4, 5, 6].includes(Number(getID(tipoContratoObj)))">
          <v-text-field
            v-model="displayPiso"
            label="Piso"
            variant="solo-filled"
            prefix="$"
            readonly
          />
        </v-col>

        <v-col cols="12" md="3" v-if="[2, 4, 5, 6].includes(Number(getID(tipoContratoObj)))">
          <v-text-field
            v-model="displayTecho"
            label="Techo"
            variant="solo-filled"
            prefix="$"
            readonly
          />
        </v-col>

        <v-divider v-if="Number(getID(tipoContratoObj)) === 3" class="my-4" />
      </v-row>
    </v-container>
    <!--Solo se mostrara si en BD se tiene datos en la tabla de excedentes, en caso contrario no mostrarla-->
    <v-container v-if="Number(getID(tipoContratoObj)) === 3">
      <v-data-table :headers="headers1" :items="capas" hide-default-footer class="elevation-1">
        <template v-slot:item.retencionC="{ item }">
          $ {{ formatNumber(item.retencionC) }}
        </template>
        <template v-slot:item.techoC="{ item }">
          $ {{ formatNumber(item.techoC) }}
        </template>
      </v-data-table>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BaseAPI } from '@/API/BaseAPI'

const contratoProrrogado = ref()
const fechaFinProrroga = ref('')
const contratoCancelado = ref()
const fechaCancelacion = ref('')
const subramoObj = ref<any[]>([])
const monedaObj = ref<any>(null)
const formaContractualObj = ref<any>()
const tipoReaseguroObj = ref<any>(null)
const tipoContratoObj = ref<any>(null)
const criterioCoberturaObj = ref<any>()

const idContrato = ref('')
const negociosCubiertos = ref('')
const inicioContrato = ref<any>(null)
const finContrato = ref<any>(null)

const limiteMax = ref<number>(0)
const limiteMaxResCR = ref<number>(0)
const retencionP = ref<number>(0)
const cesion = ref<string | number>('')
const piso = ref<number>(0)
const techo = ref<number>(0)

const capas = ref<any[]>([])
const retencionCapa = ref<number>(0)
const techoCapa = ref<number>(0)

const apiDatosContrato = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest', isBase: true, isPrivate: true });

const emit = defineEmits<{
  (e: 'actualizarFormaContractual', valor: number): void,
  (e: 'onSuccessRegister'): void
}>()

const getID = (item: any) => (item && typeof item === 'object' ? item.value : item)

const formatNumber = (val: any): string => {
  if (val === null || val === undefined || val === '') return '';
  let stringValue = String(val).replace(/[^0-9.]/g, '');
  const parts = stringValue.split('.');
  const entero = parts[0];
    if (entero) {
      parts[0] = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  return parts.join('.');
};

const parseNumber = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleanValue = val.replace(/,/g, '');
  return parseFloat(cleanValue) || 0;
};

const displayLimiteMax = computed({
  get: () => formatNumber(limiteMax.value),
  set: (val) => { limiteMax.value = parseNumber(val) }
});

const displayRetencionP = computed({
  get: () => formatNumber(retencionP.value),
  set: (val) => { retencionP.value = parseNumber(val) }
});

const displayLimiteMaxResCR = computed({
  get: () => formatNumber(limiteMaxResCR.value),
  set: (val) => { limiteMaxResCR.value = parseNumber(val) }
});

const displayPiso = computed({
  get: () => formatNumber(piso.value),
  set: (val) => { piso.value = parseNumber(val) }
});

const displayTecho = computed({
  get: () => formatNumber(techo.value),
  set: (val) => { techo.value = parseNumber(val) }
});


watch(formaContractualObj, (newVal) => {
  const id = getID(newVal);
  emit('actualizarFormaContractual', Number(id));
}, { immediate: true });

// lo mismo aqui filtrar por el contrato especifico, se necesita el id del contrato para eso, el cual esta en visualizarContratoVidaPage.vue
const cargarDatosContrato = async () => {
  try {
    const response = await apiDatosContrato.post('getAllRecords');
    if (response.data) {
      idContrato.value = response.data.idContrato;
      negociosCubiertos.value = response.data.negociosCubiertos;
      inicioContrato.value = response.data.inicioContrato;
      finContrato.value = response.data.finContrato;
      limiteMax.value = response.data.limiteMax;
      limiteMaxResCR.value = response.data.limiteMaxResCR;
      retencionP.value = response.data.retencionP;
      cesion.value = response.data.cesion;
      piso.value = response.data.piso;
      techo.value = response.data.techo;
      subramoObj.value = response.data.subramoObj || [];
      monedaObj.value = response.data.monedaObj || null;
      formaContractualObj.value = response.data.formaContractualObj || null;
      tipoReaseguroObj.value = response.data.tipoReaseguroObj || null;
      tipoContratoObj.value = response.data.tipoContratoObj || null;
      criterioCoberturaObj.value = response.data.criterioCoberturaObj || null;
    }
  } catch (error) {
    console.error("Error al cargar datos del contrato:", error);
  }
};

onMounted(() => {
  cargarDatosContrato();
});

const headers1 = [
  { title: 'Detalle de Capa', key: 'detalleCapa' },
  { title: 'Retención propia', key: 'retencionC' },
  { title: 'Techo', key: 'techoC' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
