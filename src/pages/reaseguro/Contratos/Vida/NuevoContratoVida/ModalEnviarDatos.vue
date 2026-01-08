<template>
  <v-dialog v-model="modalResumen" max-width="1400px" scrollable>
    <v-card>
      <v-card-title class="text-h6 bg-primary text-white d-flex align-center">
        RESUMEN NUEVO CONTRATO VIDA
      </v-card-title>

      <v-card-text style="background-color: #f5f5f5; height: 80vh;">
        <v-alert type="warning" variant="tonal" border="start" class="mb-4 mt-2">
          Revise la información antes de guardar. Si detecta errores, cierre esta pestaña y regrese al formulario.
        </v-alert>

        <v-container fluid>
          <v-card class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">DATOS GENERALES DEL CONTRATO</v-card-title>
            <v-data-table :headers="headersDatosContrato" :items="datosContratoResumen" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="excedenteCapasResumen.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">EXCEDENTE POR CAPAS</v-card-title>
            <v-data-table :headers="headersCapasResumen" :items="excedenteCapasResumen" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="polizasFacuResumen.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">PÓLIZAS FACULTATIVAS</v-card-title>
            <v-data-table :headers="headersPolizasResumen" :items="polizasFacuResumen" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="reaseguradoresTablaCompleta.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">REASEGURADORES Y PARTICIPACIÓN DE UTILIDADES (PTU)</v-card-title>
            <v-data-table :headers="headersReaseguradores" :items="reaseguradoresTablaCompleta" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="tarifasTablaCompleta.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">DETALLE TÉCNICO DE COBERTURAS (TARIFAS)</v-card-title>
            <v-data-table :headers="headersCoberturas" :items="tarifasTablaCompleta" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="comisionFijaTabla.length || comisionEscalonadaTabla.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">COMISIONES (FIJA Y ESCALONADA)</v-card-title>
            <v-data-table v-if="comisionFijaTabla.length" :headers="headersComisionContrato" :items="comisionFijaTabla" density="compact" hide-default-footer class="mb-2" />

            <v-card-title v-if="comisionEscalonadaTabla.length" class="text-caption">Escalonamiento por Siniestralidad</v-card-title>
            <v-data-table v-if="comisionEscalonadaTabla.length" :headers="headersComisionEscalonada" :items="comisionEscalonadaTabla" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="intermediariosTablaCompleta.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">INTERMEDIARIOS DEL CONTRATO</v-card-title>
            <v-data-table :headers="headersIntermediarios" :items="intermediariosTablaCompleta" density="compact" hide-default-footer />
          </v-card>
        </v-container>
      </v-card-text>

      <v-card-actions class="pa-4 bg-white">
        <v-spacer />
        <v-btn variant="tonal" color="grey-darken-1" @click="modalResumen = false">Cerrar y Editar</v-btn>
        <v-btn color="success" variant="tonal" @click="guardarEnBD">Confirmar y Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useContratoStore } from '@/stores/contratoStore'
import { DialogType, useDialog } from "@/stores/dialogStore"
import { BaseAPI } from '@/API/BaseAPI'
import { AuthStore } from '@/stores/authStore'

const contratoStore = useContratoStore()
const modalResumen = ref(false)
const dialog = useDialog()

const getID = (item: any): any => {
  if (item === null || item === undefined) return null;
  if (Array.isArray(item)) return item.map(i => getID(i)).join('-');
  return (item && typeof item === 'object' && 'value' in item) ? item.value : item;
};

const getTX = (item: any): string => {
  if (item === null || item === undefined || item === '') return '-';
  if (Array.isArray(item)) return item.map(i => getTX(i)).join(', ');
  if (typeof item === 'object') {
    return item.title || item.nombre || item.label || String(item.value ?? '-');
  }
  return String(item);
};

const formatSiNo = (val: any) => {
  const v = getID(val);
  if (v === 1 || v === '1' || v === true || String(v).toUpperCase() === 'SI') return 'SÍ';
  if (v === 0 || v === '0' || v === false || String(v).toUpperCase() === 'NO') return 'NO';
  return '-';
};

const cleanN = (val: any) => {
  if (val === null || val === undefined || val === '') return 0.0;
  return parseFloat(val.toString().replace('%', '').replace(',', '')) || 0.0;
};

const formatF = (f: string) => {
  if (!f) return "";
  const d = new Date(f);
  return d.toISOString().split('T')[0] + " 00:00:00.0";
};

const datosContratoResumen = computed(() => {
  const g = contratoStore.general; if (!g) return [];
  return [{
    idRamo: '010',
    subRamo: getTX(g.subramo),
    idContrato: g.idContrato,
    negocioCubiertos: g.negociosCubiertos || '-',
    fechaInicioContrato: g.fechaInicio,
    fechaFinContrato: g.fechaFin,
    cveMoneda: getTX(g.cveMoneda),
    cveFContrac: getTX(g.cveFormaContractual),
    idTContrato: getTX(g.idTContrato),
    criterioCobertura: getTX(g.criterioCobertura),
    limiteMaximoContrato: '$ ' + cleanN(g.limiteMax).toLocaleString(),
    limiteMaximoPorContrato: '$ ' + cleanN(g.limiteMaxResCR).toLocaleString(),
    cveTReaseg: getTX(g.cveTReaseguro),
    montoRetencion: '$ ' + cleanN(g.montoRetencion).toLocaleString(),
    piso: '$ ' + cleanN(g.piso).toLocaleString(),
    techo: '$ ' + cleanN(g.techo).toLocaleString(),
    porcentajeCesion: cleanN(g.porcentajeCesion) + '%'
  }]
});

const excedenteCapasResumen = computed(() => {
  const id = contratoStore.general?.idContrato || '';
  return (contratoStore.expc?.capas || []).map(c => ({
    idContrato: id,
    detalleCapa: c.detalleCapa,
    montoRetencionCapa: cleanN(c.retencionC),
    techoCapa: cleanN(c.techoC)
  }))
});

const polizasFacuResumen = computed(() => {
  const id = contratoStore.general?.idContrato || '';
  return (contratoStore.poli?.polizas || []).map(p => ({
    idContrato: id,
    llavePolRen: `${p.poliza}|${p.renovacion}`,
    numPoliza: p.poliza,
    numRenovPol: p.renovacion
  }))
});

const reaseguradoresTablaCompleta = computed(() => {
  const conf = contratoStore.configReaseg;
  const ptu = contratoStore.configReasegPTU;
  if (!conf) return [];
  return conf.reaseguradores.map((r: any) => ({
    idContrato: conf.idContrato,
    cveReasegurador: r.nombreReasegurador || getTX(r.cveReasegurador),
    participacion: r.participacion + '%',
    cveDistrCesion: getTX(conf?.indicadorDistrC),
    indCesionBasica: formatSiNo(conf.cesionCoberBasi),
    indComisionReaseguro: formatSiNo(conf.comisionReaseg),
    indDetalleCobertura: formatSiNo(conf.detalleCobertura),
    cveAsignacion: getTX(conf.tipoComision),
    otrogaPtu: formatSiNo(ptu?.otorgaPtu),
    cvePtu: getTX(ptu?.metodoCalPTU),
    porcentajePtu: (ptu?.ptu || 0) + '%',
    porcentajeK: (ptu?.kPor || 0) + '%',
    aniosArrastre: ptu?.aniosArrastre || 0
  }))
});

const tarifasTablaCompleta = computed(() => {
  const cob = contratoStore.configReasegCob;
  if (!cob || !cob.tarifas) return [];

  return cob.tarifas.map((t: any) => {
    const esHija = cob.agrupaciones?.find(a =>
      a.coberturas.some((c: any) => Number(getID(c)) === Number(t.cveCob))
    );

    return {
      idContrato: cob.idContrato,
      cveReasegurador: (t.cveReasegurador && getTX(t.cveReasegurador) !== '-') ? getTX(t.cveReasegurador) : 'TODAS',
      detalleCapa: t.detalleCapa || 'NO',
      descClasifCober: getTX(cob.detalleCobertura),
      cveCob: String(t.cveCob ?? '-'),
      descCob: getTX(t.cobertura),
      cveAgrupCob: esHija ? String(getID(esHija.madre)) : '-',
      descAgrupCob: esHija ? getID(esHija.madre) : '-',
      cveTarifa: getTX(t.tipoTarifa),
      primaTarifaFija: '$ ' + cleanN(t.primaTarifa).toLocaleString(),
      porcentajePrimaEmitida: cleanN(t.porSobrePrima) + '%',
      tarifaFija: cleanN(t.tarifaFijaM).toFixed(4),
      factorTarifaPropia: cleanN(t.factorTap) + '%',
      tarifaPropia: t.nombreArchivo || 'N/A'
    }
  });
});

const comisionFijaTabla = computed(() => {
  const conf = contratoStore.configReaseg;
  if (!conf || getID(conf.comisionReaseg) != 1) return [];
  return [{
    idContrato: conf.idContrato,
    cveReasegurador: 'TODAS',
    descClasifCober: getTX(conf.tipoCobertura),
    comisionPrimerAnioFijaProv: (conf.comisionPrimerAnio || 0) + '%',
    comisionRenovacionFijaProv: (conf.comisionRenovacion || 0) + '%'
  }]
});

const comisionEscalonadaTabla = computed(() => {
  const conf = contratoStore.configReaseg;
  const comEsc = contratoStore.configReasegCom;
  if (!comEsc || !comEsc.comisiones || comEsc.comisiones.length === 0) return [];

  return comEsc.comisiones.map(c => ({
    idContrato: contratoStore.general?.idContrato,
    cveReasegurador: 'TODAS',
    desClasifCober: getTX(conf?.tipoCobertura),
    limiteInf: c.limiteInf + '%',
    limiteSup: c.limiteSup + '%',
    comisionDefinitiva: c.comisionDefinitiva + '%'
  }))
});

const intermediariosTablaCompleta = computed(() => {
  const int = contratoStore.configInt;
  if (!int?.intermediariosTabla) return [];
  return int.intermediariosTabla.map((i: any) => ({
    idContrato: int.idContrato,
    cveReasegurador: i.display?.reaseguradora || getTX(i.reaseguradora),
    indIntermediario: getTX(int.intermediario),
    cveCriterioAsig: i.display?.asignacion || getTX(i.asignacionInterm),
    cveIntermediario: i.display?.broker || getTX(i.broker),
    indCorretaje: getTX(i.corretaje),
    cveAsignacion: i.display?.tipo || getTX(i.tipoCorretaje),
    porcentajeCorretaje: (i.corretajeFijo || 0) + '%',
    montoCorretaje: '$ ' + cleanN(i.montoCorreFijo).toLocaleString()
  }))
});

const headersDatosContrato = [
  { title: 'SUBRAMO', key: 'subRamo' }, { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'NEGOCIOS', key: 'negocioCubiertos' },
  { title: 'INICIO', key: 'fechaInicioContrato' }, { title: 'FIN', key: 'fechaFinContrato' }, { title: 'MONEDA', key: 'cveMoneda' },
  { title: 'FORMA CONTRACTUAL', key: 'cveFContrac' }, { title: 'TIPO CONTRATO', key: 'idTContrato' }, { title: 'CRITERIO', key: 'criterioCobertura' },
  { title: 'LÍMITE MÁX', key: 'limiteMaximoContrato' }, { title: 'RESPONSABILIDAD', key: 'limiteMaximoPorContrato' }, { title: 'TIPO REASEGURO', key: 'cveTReaseg' },
  { title: 'RETENCIÓN', key: 'montoRetencion' }, { title: 'PISO', key: 'piso' }, { title: 'TECHO', key: 'techo' }, { title: '% CESIÓN', key: 'porcentajeCesion' }
];

const headersCapasResumen = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'DETALLE CAPA', key: 'detalleCapa' }, { title: 'RETENCIÓN', key: 'montoRetencionCapa' }, { title: 'TECHO', key: 'techoCapa' }
];

const headersPolizasResumen = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'LLAVE', key: 'llavePolRen' }, { title: 'PÓLIZA', key: 'numPoliza' }, { title: 'RENOVACIÓN', key: 'numRenovPol' }
];

const headersReaseguradores = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'PARTICIPACIÓN', key: 'participacion' },
  { title: 'DISTR. CESIÓN', key: 'cveDistrCesion' }, { title: 'COB. BÁSICA', key: 'indCesionBasica' }, { title: 'COMISIÓN', key: 'indComisionReaseguro' },
  { title: 'DETALLE COB.', key: 'indDetalleCobertura' }, { title: 'ASIGNACIÓN', key: 'cveAsignacion' }, { title: 'OTORGA PTU', key: 'otrogaPtu' },
  { title: 'MÉTODO PTU', key: 'cvePtu' }, { title: '% PTU', key: 'porcentajePtu' }, { title: '% K', key: 'porcentajeK' }, { title: 'AÑOS ARRASTRE', key: 'aniosArrastre' }
];

const headersCoberturas = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'DETALLE CAPA', key: 'detalleCapa' },
  { title: 'TIPO COBERTURA', key: 'descClasifCober' }, { title: 'CLAVE COB', key: 'cveCob' }, { title: 'COBERTURA', key: 'descCob' },
  { title: 'CVE AGRUPAR', key: 'cveAgrupCob' }, { title: 'AGRUPAR EN', key: 'descAgrupCob' }, { title: 'TIPO TARIFA', key: 'cveTarifa' },
  { title: 'PRIMA FIJA', key: 'primaTarifaFija' }, { title: '% SOBRE PRIMA', key: 'porcentajePrimaEmitida' }, { title: 'TARIFA MILLAR', key: 'tarifaFija' },
  { title: 'FACTOR PROPIA', key: 'factorTarifaPropia' }, { title: 'ARCHIVO', key: 'tarifaPropia' }
];

const headersComisionContrato = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'TIPO COBERTURA', key: 'descClasifCober' },
  { title: '% 1ER AÑO', key: 'comisionPrimerAnioFijaProv' }, { title: '% RENOVACIÓN', key: 'comisionRenovacionFijaProv' }
];

const headersComisionEscalonada = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'TIPO COBERTURA', key: 'desClasifCober' },
  { title: 'LÍMITE INF', key: 'limiteInf' }, { title: 'LÍMITE SUP', key: 'limiteSup' }, { title: 'COMISIÓN DEF.', key: 'comisionDefinitiva' }
];

const headersIntermediarios = [
  { title: 'ID CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: '¿INTERMEDIARIO?', key: 'indIntermediario' },
  { title: 'ASIGNACIÓN', key: 'cveCriterioAsig' }, { title: 'BROKER', key: 'cveIntermediario' }, { title: '¿CORRETAJE?', key: 'indCorretaje' },
  { title: 'TIPO CORRETAJE', key: 'cveAsignacion' }, { title: '% CORRETAJE', key: 'porcentajeCorretaje' }, { title: 'MONTO CORRETAJE', key: 'montoCorretaje' }
];


const guardarEnBD = async () => {
  const authStore = AuthStore();
  if (!authStore.getToken) return;

  try {
    dialog.show({ title: 'Procesando', message: 'Guardando información...', type: DialogType.INFO });

    if (!contratoStore.general) {
      dialog.show({ title: 'Atención', message: 'Faltan los Datos Generales del contrato.', type: DialogType.ERROR });
      return;
    }

    const gen = contratoStore.general;
    const conf = contratoStore.configReaseg;
    const ptu = contratoStore.configReasegPTU;
    const cob = contratoStore.configReasegCob;
    const int = contratoStore.configInt;

    const payloadGen = {
      idRamo: "010", subRamo: getID(gen.subramo), idContrato: gen.idContrato, negocioCubiertos: gen.negociosCubiertos,
      fechaInicioContrato: formatF(gen.fechaInicio), fechaFinContrato: formatF(gen.fechaFin),
      cveMoneda: getID(gen.cveMoneda), cveFContrac: String(getID(gen.cveFormaContractual)),
      limiteMaximoContrato: cleanN(gen.limiteMax), limiteMaximoPorContrato: cleanN(gen.limiteMaxResCR),
      cveTReaseg: String(getID(gen.cveTReaseguro)), idTContrato: String(getID(gen.idTContrato)),
      criterioCobertura: String(getID(gen.criterioCobertura)), montoRetencion: cleanN(gen.montoRetencion),
      piso: cleanN(gen.piso), techo: cleanN(gen.techo), porcentajeCesion: cleanN(gen.porcentajeCesion)
    };
    await apiDatosContrato.post('register', payloadGen);

    const promsReas = (conf && conf.reaseguradores) ? conf.reaseguradores.map((r: any) => ({
      idContrato: String(gen.idContrato), cveReasegurador: getID(r.cveReasegurador), participacion: cleanN(r.participacion),
      cveDistrCesion: String(getID(conf.indicadorDistrC) ?? '0'), indCesionBasica: getID(conf.cesionCoberBasi) ?? 1,
      indComisionReaseguro: getID(conf.comisionReaseg) ?? 0, indDetalleCobertura: getID(conf.detalleCobertura) ?? 0,
      cveAsignacion: String(getID(conf.tipoComision) ?? (getID(conf.comisionReaseg) === 1 ? '0' : '')),
      otrogaPtu: getID(ptu?.otorgaPtu) ?? 0, cvePtu: String(getID(ptu?.metodoCalPTU) ?? '0'),
      porcentajePtu: cleanN(ptu?.ptu), porcentajeK: cleanN(ptu?.kPor), aniosArrastre: parseInt(ptu?.aniosArrastre?.toString() || "0")
    })).map(item => apiReaseguradoras.post('register', item)) : [];

    const promsCob = (cob && cob.tarifas) ? cob.tarifas.map((t: any) => {
      const agrup = cob.agrupaciones?.find(a => a.coberturas.some((c: any) => Number(getID(c)) === Number(t.cveCob)));
      return {
        idContrato: String(gen.idContrato), cveReasegurador: getID(t.cveReasegurador) || 'TODAS',
        detalleCapa: String(t.detalleCapa || 'NO'), cveCob: t.cveCob !== undefined ? Number(t.cveCob) : 0,
        descClasifCober: String (t.descClasifCober),
        cveAgrupCob: agrup ? getID(agrup.madre) : null,
        descAgrupCob: String(t.descAgrupCob),
        cveTarifa: String(getID(t.tipoTarifa)), primaTarifaFija: cleanN(t.primaTarifa),
        porcentajePrimaEmitida: cleanN(t.porSobrePrima), tarifaFija: cleanN(t.tarifaFijaM), factorTarifaPropia: cleanN(t.factorTap)
      };
    }).map(item => apiCoberturas.post('register', item)) : [];

    const promsComNormal = (conf && getID(conf.comisionReaseg) === 1) ? [{
      idContrato: String(gen.idContrato), cveReasegurador: 'TODAS',
      descClasifCober: String(getID(conf.tipoCobertura) ?? '0'),
      comisionPrimerAnioFijaProv: cleanN(conf.comisionPrimerAnio),
      comisionRenovacionFijaProv: cleanN(conf.comisionRenovacion)
    }].map(item => apiComision.post('register', item)) : [];

    const promsInt = (int && int.intermediariosTabla) ? int.intermediariosTabla.map(i => apiIntermediarios.post('register', {
      idContrato: gen.idContrato, cveReasegurador: getID(i.reaseguradora), indIntermediario: getID(int.intermediario),
      cveCriterioAsig: getID(i.asignacionInterm), cveIntermediario: getID(i.broker), indCorretaje: getID(i.corretaje),
      cveAsignacion: getID(i.tipoCorretaje), porcentajeCorretaje: cleanN(i.corretajeFijo), montoCorretaje: cleanN(i.montoCorreFijo)
    })) : [];

    const promsCapas = (contratoStore.expc?.capas || []).map(c => apiCapas.post('register', { idContrato: gen.idContrato, detalleCapa: c.detalleCapa, montoRetencionCapa: cleanN(c.retencionC), techoCapa: cleanN(c.techoC) }));
    const promsPolizas = (contratoStore.poli?.polizas || []).map(p => apiPolizas.post('register', { idContrato: gen.idContrato, numPoliza: p.poliza, numRenovPol: p.renovacion }));

    const comisionesEscStore = contratoStore.configReasegCom?.comisiones || [];
    const promsComEsc = comisionesEscStore.map(c => apiComisionEsc.post('register', {
      idContrato: gen.idContrato,
      cveReasegurador: 'TODAS',
      desClasifCober: getTX(conf?.tipoCobertura),
      limiteInf: cleanN(c.limiteInf),
      limiteSup: cleanN(c.limiteSup),
      comisionDefinitiva: cleanN(c.comisionDefinitiva)
    }));

    await Promise.all([
      ...promsReas,
      ...promsCob,
      ...promsComNormal,
      ...promsInt,
      ...promsCapas,
      ...promsPolizas,
      ...promsComEsc
    ]);

    dialog.show({ title: 'ÉXITO', message: 'Contrato guardado correctamente.', type: DialogType.SUCCESS });
    modalResumen.value = false;
    contratoStore.reset();

  } catch (error: any) {
    console.error("Error al guardar:", error);
    dialog.show({ title: 'ERROR', message: 'Fallo al guardar: ' + error.message, type: DialogType.ERROR });
  }
};

const abrirResumen = () => { modalResumen.value = true }
defineExpose({ abrirResumen })

const apiDatosContrato = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest', isBase: true, isPrivate: true });
const apiCapas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ExcedentePorCapasRest', isBase: true, isPrivate: true });
const apiPolizas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/PolizasFacuRest', isBase: true, isPrivate: true });
const apiReaseguradoras = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ReaseguradorasRest', isBase: true, isPrivate: true });
const apiCoberturas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/CoberturasRest', isBase: true, isPrivate: true });
const apiComision = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ComisionRest', isBase: true, isPrivate: true });
const apiComisionEsc = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ComisionEscalonadaRest', isBase: true, isPrivate: true });
const apiIntermediarios = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/IntermediariosRest', isBase: true, isPrivate: true });
</script>
