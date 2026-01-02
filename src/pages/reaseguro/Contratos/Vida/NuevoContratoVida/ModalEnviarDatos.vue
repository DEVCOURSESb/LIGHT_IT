<template>
  <v-dialog v-model="modalResumen" max-width="1300px">
    <v-card>
      <v-card-title class="text-h6 bg-primary text-white">
        Resumen Técnico del Contrato (Claves y IDs)
      </v-card-title>

      <v-card-text>
        <v-container>
          <h3 class="mb-2">DATOS_CONTRATO (General)</h3>
          <v-data-table
            :headers="headersDatosContrato"
            :items="datosContratoResumen"
            density="compact"
            hide-default-footer
            class="elevation-1 mb-6"
          />

          <div v-if="excedenteCapasResumen.length">
            <h3 class="mb-2">EXCEDENTE_POR_CAPAS</h3>
            <v-data-table
              :headers="headersCapasResumen"
              :items="excedenteCapasResumen"
              density="compact"
              hide-default-footer
              class="elevation-1 mb-6"
            />
          </div>

          <div v-if="polizasFacuResumen.length">
            <h3 class="mb-2">POLIZAS_FACU</h3>
            <v-data-table
              :headers="headersPolizasResumen"
              :items="polizasFacuResumen"
              density="compact"
              hide-default-footer
              class="elevation-1 mb-6"
            />
          </div>

          <div v-if="reaseguradoresTablaCompleta.length">
            <h3 class="mb-2">CONFIGURACIÓN REASEGURO Y PTU</h3>
            <v-data-table
              :headers="headersReaseguradores"
              :items="reaseguradoresTablaCompleta"
              density="compact"
              hide-default-footer
              class="elevation-1 mb-6"
            />
          </div>

          <div v-if="tarifasTablaCompleta.length">
            <h3 class="mb-2">DETALLE_TARIFA_COBERTURA</h3>
            <v-data-table
              :headers="headersTarifas"
              :items="tarifasTablaCompleta"
              density="compact"
              hide-default-footer
              class="elevation-1 mb-6"
            />
          </div>

          <div v-if="comisionFijaTabla.length || comisionEscalonadaTabla.length">
            <h3 class="mb-2">COMISIONES (Fija y Escalonada)</h3>
            <v-data-table
              v-if="comisionFijaTabla.length"
              :headers="headersComisionContrato"
              :items="comisionFijaTabla"
              density="compact"
              hide-default-footer
              class="elevation-1 mb-4"
            />
            <v-data-table
              v-if="comisionEscalonadaTabla.length"
              :headers="headersComisionEscalonada"
              :items="comisionEscalonadaTabla"
              density="compact"
              hide-default-footer
              class="elevation-1 mb-6"
            />
          </div>

          <div v-if="intermediariosTablaCompleta.length">
            <h3 class="mb-2">INTERMEDIARIOS_CONTRATO</h3>
            <v-data-table
              :headers="headersIntermediarios"
              :items="intermediariosTablaCompleta"
              density="compact"
              hide-default-footer
              class="elevation-1"
            />
          </div>

        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="modalResumen = false">Cerrar</v-btn>
        <v-btn color="success" @click="guardarEnBD">Confirmar y Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useContratoStore } from '@/stores/contratoStore'
import { DialogType, useDialog } from "@/stores/dialogStore"
import { BaseAPI } from '@/API/BaseAPI'
import { AuthStore } from '@/stores/authStore';

const contratoStore = useContratoStore()
const modalResumen = ref(false)
const dialog = useDialog()


const headersDatosContrato = [
  { title: 'RAMO', key: 'ID_RAMO' },
  { title: 'SUBRAMO', key: 'ID_SUBRAMO' },
  { title: 'ID_CONTRATO', key: 'ID_CONTRATO' },
  { title: 'INICIO', key: 'FECHA_INICIO_CONTRATO' },
  { title: 'FIN', key: 'FECHA_FIN_CONTRATO' },
  { title: 'MONEDA', key: 'CVE_MONEDA' },
  { title: 'F_CONTRAC', key: 'CVE_FCONTRAC' },
  { title: 'T_REASEG', key: 'CVE_TREASEG' },
  { title: 'T_CONT', key: 'ID_TCONTRATO' },
  { title: 'RETENCIÓN', key: 'MONTO_RETENCION' },
]

const headersCapasResumen = [
  { title: 'ID_CONTRATO', key: 'ID_CONTRATO' },
  { title: 'DETALLE_CAPA', key: 'DETALLE_CAPA' },
  { title: 'RETENCION_CAPA', key: 'MONTO_RETENCION_CAPA' },
  { title: 'TECHO_CAPA', key: 'TECHO_CAPA' },
]

const headersPolizasResumen = [
  { title: 'ID_CONTRATO', key: 'ID_CONTRATO' },
  { title: 'LLAVE_POL_REN', key: 'LLAVE_POL_REN' },
  { title: 'NUM_POLIZA', key: 'NUM_POLIZA' },
  { title: 'NUM_RENOV', key: 'NUM_RENOV_POL' },
]

const headersReaseguradores = [
  { title: 'ID_CONTRATO', key: 'idContrato' },
  { title: 'CVE_REASEG', key: 'cveReasegurador' },
  { title: 'PARTICIP', key: 'participacion' },
  { title: 'DISTR_CESION', key: 'indicadorDistrC' },
  { title: 'CESION_BAS', key: 'cesionCoberBasi' },
  { title: 'COM_REASEG', key: 'comisionReaseg' },
  { title: 'DET_COB', key: 'detalleCobertura' },
  { title: 'OTORGA_PTU', key: 'otorgaPtu' },
  { title: 'CVE_PTU', key: 'metodoCalPTU' },
  { title: 'PORC_PTU', key: 'ptu' },
  { title: 'PORC_K', key: 'kPor' },
]

const headersTarifas = [
  { title: 'REASEGURADORES', key: 'reaseguradores' },
  { title: 'DETALLE_CAPA', key: 'detalleCapa' },
  { title: 'T_COB', key: 'tipoCobertura' },
  { title: 'CVE_COB', key: 'cobertura' },
  { title: 'CVE_AGRUP', key: 'cveAgrupacion' },
  { title: 'T_TARIFA', key: 'tipoTarifa' },
  { title: 'PRIMA_FIJA', key: 'primaTarifa' },
  { title: 'TARIFA_P', key: 'tarifaP' },
]

const headersComisionContrato = [
  { title: 'ID_CONTRATO', key: 'idContrato' },
  { title: 'REASEGURADORES', key: 'reaseguradores' },
  { title: 'T_COB', key: 'tipoCobertura' },
  { title: 'COM_1ER_AÑO', key: 'comisionPrimerAnio' },
  { title: 'COM_RENOV', key: 'comisionRenovacion' },
]

const headersComisionEscalonada = [
  { title: 'LIM_INF', key: 'limiteInf' },
  { title: 'LIM_SUP', key: 'limiteSup' },
  { title: 'COM_DEF', key: 'comisionDefinitiva' },
]

const headersIntermediarios = [
  { title: 'CVE_REASEG', key: 'reaseguradores' },
  { title: 'IND_INTERM', key: 'indIntermediario' },
  { title: 'CVE_CRITERIO', key: 'asignacion' },
  { title: 'CVE_INTERM', key: 'broker' },
  { title: 'IND_CORRET', key: 'indCorretaje' },
  { title: 'PORC_CORRET', key: 'porcentajeCorretaje' },
]

const datosContratoResumen = computed(() => {
  const gen = contratoStore.general
  if (!gen) return []

  let retencionTotal = gen.montoRetencion;
  if (gen.idTContrato === 3 && contratoStore.expc?.capas) {
    retencionTotal = contratoStore.expc.capas.reduce((acc, capa) => acc + (Number(capa.retencionC) || 0), 0).toString();
  }

  return [{
    ID_RAMO: '010',
    ID_SUBRAMO: gen.subramo?.join('-') || '',
    CONTRATO_PRORROGADO: gen.contratoProrrogado,
    FECHA_FIN_PRORROGA: gen.fechaFinProrroga || '',
    CONTRATO_CANCELADO: gen.contratoCancelado,
    FECHA_CANCELACION: gen.fechaCancelacion || '',
    ID_CONTRATO: gen.idContrato,
    NEGOCIOS_CUBIERTOS: gen.negociosCubiertos,
    FECHA_INICIO_CONTRATO: gen.fechaInicio,
    FECHA_FIN_CONTRATO: gen.fechaFin,
    CVE_MONEDA: gen.cveMoneda?.join(', ') || '',
    CVE_FCONTRAC: gen.cveFormaContractual,
    LIMITE_MAXIMO_CONTRATO: gen.limiteMax,
    LIMITE_MAXIMO_POR_RIESGO: gen.limiteMaxResCR,
    CVE_TREASEG: gen.cveTReaseguro,
    ID_TCONTRATO: gen.idTContrato,
    CRITERIO_COBERTURA: gen.criterioCobertura,
    MONTO_RETENCION: retencionTotal,
    PISO: gen.piso,
    TECHO: gen.techo,
    PORCENTAJE_CESION: gen.porcentajeCesion
  }]
})

const excedenteCapasResumen = computed(() => {
  const idContrato = contratoStore.general?.idContrato || ''
  return (contratoStore.expc?.capas || []).map((capa, index) => ({
    ID_CONTRATO: idContrato,
    DETALLE_CAPA: `EXCEDENTE CAPA ${index + 1}`,
    MONTO_RETENCION_CAPA: capa.retencionC,
    TECHO_CAPA: capa.techoC
  }))
})

const polizasFacuResumen = computed(() => {
  const idContrato = contratoStore.general?.idContrato || ''
  return (contratoStore.poli?.polizas || []).map(p => ({
    ID_CONTRATO: idContrato,
    LLAVE_POL_REN: `${p.poliza}${p.renovacion}`,
    NUM_POLIZA: p.poliza,
    NUM_RENOV_POL: p.renovacion
  }))
})

const reaseguradoresTablaCompleta = computed(() => {
  const lista = contratoStore.configReaseg?.reaseguradores ?? []
  const conf = contratoStore.configReaseg
  const ptu = contratoStore.configReasegPTU

  return lista.map(r => ({
    idContrato: conf?.idContrato || '',
    cveReasegurador: r.cveReasegurador,
    participacion: r.participacion,
    indicadorDistrC: conf?.indicadorDistrC,
    cesionCoberBasi: conf?.cesionCoberBasi,
    comisionReaseg: conf?.comisionReaseg,
    detalleCobertura: conf?.detalleCobertura,
    otorgaPtu: ptu?.otorgaPtu,
    metodoCalPTU: ptu?.metodoCalPTU,
    ptu: ptu?.ptu,
    kPor: ptu?.kPor
  }))
})

const tarifasTablaCompleta = computed(() => {
  const cob = contratoStore.configReasegCob
  if (!cob?.tarifas) return []
  const reasegIds = contratoStore.configReaseg?.reaseguradores?.map(r => r.cveReasegurador).join(', ') || ''

  return cob.tarifas.map(t => {
    const agrup = cob.agrupaciones?.find(a => a.coberturas.some(c => c.title === t.cobertura))
    return {
      reaseguradores: reasegIds,
      detalleCapa: t.detalleCapa,
      tipoCobertura: t.tipoCobertura,
      cobertura: t.cobertura,
      cveAgrupacion: agrup?.madre?.value || '',
      tipoTarifa: t.tipoTarifa,
      primaTarifa: t.primaTarifa,
      tarifaP: t.tarifaP
    }
  })
})

const comisionFijaTabla = computed(() => {
  const conf = contratoStore.configReaseg
  if (!conf) return []
  const ids = conf.reaseguradores?.map(r => r.cveReasegurador).join(', ') || ''
  return [{
    idContrato: conf.idContrato,
    reaseguradores: ids,
    tipoCobertura: conf.tipoCobertura,
    comisionPrimerAnio: conf.comisionPrimerAnio,
    comisionRenovacion: conf.comisionRenovacion
  }]
})

const comisionEscalonadaTabla = computed(() => {
  return (contratoStore.configReasegCom?.comisiones || []).map(c => ({
    limiteInf: c.limiteInf,
    limiteSup: c.limiteSup,
    comisionDefinitiva: c.comisionDefinitiva
  }))
})

const intermediariosTablaCompleta = computed(() => {
  const config = contratoStore.configInt
  if (!config?.intermediariosTabla) return []
  const idsGral = contratoStore.configReaseg?.reaseguradores?.map(r => r.cveReasegurador).join(', ') || ''

  return config.intermediariosTabla.map(item => ({
    reaseguradores: item.asignacionInterm === 1 ? idsGral : item.reaseguradora,
    indIntermediario: item.intermediario,
    asignacion: item.asignacionInterm,
    broker: item.broker,
    indCorretaje: item.corretaje,
    porcentajeCorretaje: item.corretajeFijo || item.corretaje || 0
  }))
})

const abrirResumen = () => { modalResumen.value = true }

const apiDatosContrato = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest', isBase: true, isPrivate: true });
const apiCapas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ExcedentePorCapasRest', isBase: true, isPrivate: true });
const apiPolizas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/PolizasFacuRest', isBase: true, isPrivate: true });
const apiReaseguradoras = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ReaseguradorasRest', isBase: true, isPrivate: true });
const apiCoberturas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/CoberturasRest', isBase: true, isPrivate: true });
const apiComision = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ComisionRest', isBase: true, isPrivate: true });
const apiComisionEsc = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ComisionEscalonadaRest', isBase: true, isPrivate: true });
const apiIntermediarios = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/IntermediariosRest', isBase: true, isPrivate: true });

const guardarEnBD = async () => {
  const authStore = AuthStore();

  if (!authStore.getToken) {
    dialog.show({
      title: 'Error',
      message: 'No hay una sesión activa.',
      type: DialogType.ERROR
    });
    return;
  }

  try {
    dialog.show({
      title: 'Guardando',
      message: 'Iniciando guardando de contrato...',
      type: DialogType.INFO
    });

    await apiDatosContrato.post('getAllRecords', datosContratoResumen.value[0]);

    await Promise.all([
      excedenteCapasResumen.value.length && apiCapas.post('getAllRecords', excedenteCapasResumen.value),
      polizasFacuResumen.value.length && apiPolizas.post('getAllRecords', polizasFacuResumen.value),
      reaseguradoresTablaCompleta.value.length && apiReaseguradoras.post('getAllRecords', reaseguradoresTablaCompleta.value),
      tarifasTablaCompleta.value.length && apiCoberturas.post('getAllRecords', tarifasTablaCompleta.value),
      comisionFijaTabla.value.length && apiComision.post('getAllRecords', comisionFijaTabla.value),
      comisionEscalonadaTabla.value.length && apiComisionEsc.post('getAllRecords', comisionEscalonadaTabla.value),
      intermediariosTablaCompleta.value.length && apiIntermediarios.post('getAllRecords', intermediariosTablaCompleta.value),
    ].filter(Boolean));

    dialog.show({
      title: 'ÉXITO',
      message: 'Información guardada correctamente.',
      type: DialogType.SUCCESS
    });

    modalResumen.value = false;

  } catch (error: any) {
    console.error(error);

    dialog.show({
      title: 'ERROR',
      message: error.response?.data?.message || 'Error de conexión',
      type: DialogType.ERROR
    });
  }
};
defineExpose({ abrirResumen })
</script>

<style scoped>
h3 {
  border-left: 4px solid #003c71;
  padding-left: 10px;
  color: #003c71;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>
