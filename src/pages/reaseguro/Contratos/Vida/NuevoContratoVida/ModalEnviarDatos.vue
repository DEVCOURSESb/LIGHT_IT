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

            <v-card-title v-if="comisionEscalonadaTabla.length" class="text-caption">ESCALONADA</v-card-title>
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
import { id } from 'vuetify/locale'

const contratoStore = useContratoStore()
const modalResumen = ref(false)
const dialog = useDialog()

const getID = (item: any): any => {
  if (item === null || item === undefined) return null;
  if (typeof item === 'object' && 'value' in item) return item.value;
  return item;
};

const getTX = (item: any): string => {
  if (item === null || item === undefined) return 'NULL';
  if (typeof item === 'object') return item.title || item.label || item.nombre || 'NULL';
  return String(item);
};

const joinByDash = (arr: any[]) =>
  Array.isArray(arr) ? arr.map(a => getID(a)).join('-') : getID(arr);

const formatSiNo = (val: any) => {
  const v = getID(val);
  if (v === 1 || v === '1' || v === true || String(v).toUpperCase() === 'SI' || String(v).toUpperCase() === 'SÍ') return 'SÍ';
  if (v === 0 || v === '0' || v === false || String(v).toUpperCase() === 'NO') return 'NO';
  return '-';
};

const cleanN = (val: any) => {
  if (val === null || val === undefined || val === '') return 0.0;
  return parseFloat(val.toString().replace('%', '').replace(',', '')) || 0.0;
};

const formatF = (f: string | Date) => {
  if (!f) return "";
  const d = new Date(f);
  return d.toISOString().split('T')[0] + " 00:00:00.0";
};

const datosContratoResumen = computed(() => {
  const g = contratoStore.general; if (!g) return [];
  return [{
    idRamo: '010',
    subRamo: joinByDash(g.subramo),
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
  if (!cob || !cob.tarifas || cob.tarifas.length === 0) return [];

  return cob.tarifas.map((t: any) => {
    const agrup = cob.agrupaciones?.find((a: any) =>
      a.coberturas?.some((c: any) => String(getID(c)) === String(t.cveCob))
    );

    return {
      idContrato: cob.idContrato || 'N/A',
      cveReasegurador: (t.cveReasegurador && getTX(t.cveReasegurador) !== '-') ? getTX(t.cveReasegurador) : 'TODAS',
      detalleCapa: t.detalleCapa || 'NO',
      descClasifCober: t.tipoCobertura || '0 (BASICA)',
      cveCob: String(t.cveCob),
      descCob: t.cobertura,
      cveAgrupCob: agrup ? String(getID(agrup.madre)) : '-',
      descAgrupCob: agrup ? getTX(agrup.madre) : '-',

      cveTarifa: getTX(t.tipoTarifa),
      primaTarifaFija: '$ ' + cleanN(t.primaTarifa).toLocaleString(),
      porcentajePrimaEmitida: cleanN(t.porSobrePrima) + '%',
      tarifaFija: cleanN(t.tarifaFijaM).toFixed(4),
      factorTarifaPropia: cleanN(t.factorTap) + '%',
      tarifaPropia: getTX(t.nombreArchivo) || ''
    };
  });
});

const comisionFijaTabla = computed(() => {
  const conf = contratoStore.configReaseg;
  if (!conf || getID(conf.comisionReaseg) != 1) return [];
  return [{
    idContrato: conf.idContrato,
    cveReasegurador: 'TODAS', // aqui deben ir todas las reaseguradoras y no esa palabra
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
  { title: 'FACTOR PROPIA', key: 'factorTarifaPropia' }, { title: 'TARIFA PROPIA', key: 'tarifaPropia' }
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
// antes de guardar en la base de datos se debe validar que el id del contrato no exista ya en caso contrario lanzar un dialog error diciendo que ya existe un contrato con ese ID y no guardar
const guardarEnBD = async () => {
  const authStore = AuthStore();
  if (!authStore.getToken) return;

  try {
    dialog.show({ title: 'Procesando', message: 'Guardando información...', type: DialogType.INFO });

    const gen = contratoStore.general;
    const conf = contratoStore.configReaseg;
    const cob = contratoStore.configReasegCob;
    const int = contratoStore.configInt;
    const ptu = contratoStore.configReasegPTU;

    if (!gen) return;
    /*const verificarContratoExistente = BaseAPI('/reaseguro/contratos/vida/contratos');
    const identificadorContratoExistente = await contratoStore.verificarContratoExistente(gen.idContrato);
    if(identificadorContratoExistente){
      dialog.show({ title: 'Error', message: `El ID de contrato ${gen.idContrato} ya existe. Por favor, elija uno diferente.`, type: DialogType.ERROR });
      return;
    }*/

    const payloadGen = {
      idRamo: "010",
      subRamo: joinByDash(gen.subramo),
      idContrato: gen.idContrato,
      negocioCubiertos: gen.negociosCubiertos,
      fechaInicioContrato: formatF(gen.fechaInicio),
      fechaFinContrato: formatF(gen.fechaFin),
      cveMoneda: getID(gen.cveMoneda),
      cveFContrac: getID(gen.cveFormaContractual),
      idTContrato: getID(gen.idTContrato),
      criterioCobertura: getID(gen.criterioCobertura),
      limiteMaximoContrato: cleanN(gen.limiteMax),
      limiteMaximoPorContrato: cleanN(gen.limiteMaxResCR),
      cveTReaseg: getID(gen.cveTReaseguro),
      montoRetencion: cleanN(gen.montoRetencion),
      piso: cleanN(gen.piso),
      techo: cleanN(gen.techo),
      porcentajeCesion: cleanN(gen.porcentajeCesion)
    };
    await apiDatosContrato.post('register', payloadGen);

    const listaReaseguradoresContrato = conf?.reaseguradores || [];

    const promsReas = listaReaseguradoresContrato.map((r: any) =>
      apiReaseguradoras.post('register', {
        idContrato: gen.idContrato,
        cveReasegurador: String(r.clave || getID(r.cveReasegurador)),
        participacion: cleanN(r.participacion),
        cveDistrCesion: getID(conf?.indicadorDistrC),
        indCesionBasica: getID(conf?.cesionCoberBasi),
        indComisionReaseguro: getID(conf?.comisionReaseg),
        indDetalleCobertura: getID(conf?.detalleCobertura),
        cveAsignacion: getID(conf?.tipoComision),
        otrogaPtu: getID(ptu?.otorgaPtu),
        cvePtu: getID(ptu?.metodoCalPTU),
        porcentajePtu: cleanN(ptu?.ptu),
        porcentajeK: cleanN(ptu?.kPor),
        aniosArrastre: cleanN(ptu?.aniosArrastre)
      })
    );

    const promsCob: any[] = [];
      if (cob?.tarifas) {
        const cvesEnTarifas = new Set(cob.tarifas.map((t: any) => String(getID(t.cveCob))));

        cob.tarifas.forEach((t: any) => {
          let reasFila: any[] = [];
          if (getID(t.cveReasegurador)) {
            reasFila = Array.isArray(t.cveReasegurador) ? t.cveReasegurador : [t.cveReasegurador];
          } else {
            reasFila = listaReaseguradoresContrato;
          }

          const agrup = cob.agrupaciones?.find(a =>
            a.coberturas?.some((c: any) => String(getID(c)) === String(getID(t.cveCob)))
          );

          const currentCve = String(getID(t.cveCob));
          const motherCve = agrup ? String(getID(agrup.madre)) : null;

          const esMadre = currentCve === motherCve;

          reasFila.forEach((r: any) => {
            const idR = String(r.clave || getID(r.cveReasegurador) || getID(r));

            if (idR && idR !== 'null' && idR !== 'undefined') {
              promsCob.push(apiCoberturas.post('register', {
                idContrato: gen.idContrato,
                cveReasegurador: idR,
                detalleCapa: t.detalleCapa ? String(t.detalleCapa).toUpperCase() : "",
                descClasifCober: getTX(t.tipoCobertura).normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                cveCob: String(getID(t.cveCob)),
                descCob: getTX(t.cobertura),

                cveAgrupCob: (agrup && !esMadre) ? Number(getID(agrup.madre)) : 0,
                descAgrupCob: (agrup && !esMadre) ? getTX(agrup.madre) : "",

                cveTarifa: Number(getID(t.tipoTarifa)),
                primaTarifaFija: cleanN(t.primaTarifa),
                porcentajePrimaEmitida: cleanN(t.porSobrePrima),
                tarifaFija: cleanN(t.tarifaFijaM),
                factorTarifaPropia: cleanN(t.factorTap),
                tarifaPropia: getTX(t.nombreArchivo)
              }));
            }
          });
        });

        cob.agrupaciones?.forEach(ag => {
          ag.coberturas?.forEach((c: any) => {
            const cveC = String(getID(c));

            if (!cvesEnTarifas.has(cveC)) {
              const motherCve = String(getID(ag.madre));
              const esMadre = cveC === motherCve;

              listaReaseguradoresContrato.forEach((r: any) => {
                const idR = String(r.clave || getID(r.cveReasegurador));
                promsCob.push(apiCoberturas.post('register', {
                  idContrato: gen.idContrato,
                  cveReasegurador: idR,
                  detalleCapa: r.detalleCapa ? String(r.detalleCapa).toUpperCase() : "",
                  descClasifCober: getTX(r.tipoCobertura || cob.detalleCobertura).normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                  cveCob: cveC,
                  descCob: getTX(c),
                  cveAgrupCob: !esMadre ? Number(getID(ag.madre)) : 0,
                  descAgrupCob: !esMadre ? getTX(ag.madre) : "",
                  cveTarifa: Number(getID(r.tipoTarifa)),
                  primaTarifaFija: cleanN(r.primaTarifa),
                  porcentajePrimaEmitida: cleanN(r.porSobrePrima),
                  tarifaFija: cleanN(r.tarifaFijaM),
                  factorTarifaPropia: cleanN(r.factorTap),
                  tarifaPropia: r.nombreArchivo || ""
                }));
              });
            }
          });
        });
      }

    /*const promsCob: any[] = [];
    if (cob?.tarifas && cob.tarifas.length > 0) {
      cob.tarifas.forEach((t: any) => {
        let reasFila: any[] = [];
        if (getID(t.cveReasegurador)) {
          reasFila = Array.isArray(t.cveReasegurador) ? t.cveReasegurador : [t.cveReasegurador];
        } else {
          reasFila = listaReaseguradoresContrato;
        }

        const agrup = cob.agrupaciones?.find(a =>
          a.coberturas?.some((c: any) => String(getID(c)) === String(getID(t.cveCob)))
        );

        reasFila.forEach((r: any) => {
          const idR = String(r.clave || getID(r.cveReasegurador) || getID(r));

          if (idR && idR !== 'null' && idR !== 'undefined') {
            promsCob.push(apiCoberturas.post('register', {
              idContrato: gen.idContrato,
              cveReasegurador: idR,
              detalleCapa: t.detalleCapa ? String(t.detalleCapa).toUpperCase() : "",
              descClasifCober: getTX(t.tipoCobertura || cob.detalleCobertura).normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
              cveCob: String(getID(t.cveCob)),
              descCob: getTX(t.cobertura),
              cveAgrupCob: agrup ? Number(getID(agrup.madre)) : 0,
              descAgrupCob: agrup ? getTX(agrup.madre) : "",
              cveTarifa: Number(getID(t.tipoTarifa)),
              primaTarifaFija: cleanN(t.primaTarifa),
              porcentajePrimaEmitida: cleanN(t.porSobrePrima),
              tarifaFija: cleanN(t.tarifaFijaM),
              factorTarifaPropia: cleanN(t.factorTap),
              tarifaPropia: t.nombreArchivo || 0.0 // aqui se supone
            }));
          }
        });
      });
    }*/

    const promsComNormal = (conf && getID(conf.comisionReaseg) == 1)
      ? listaReaseguradoresContrato.map((r: any) => apiComision.post('register', {
          idContrato: gen.idContrato,
          cveReasegurador: String(r.clave || getID(r.cveReasegurador)),
          descClasifCober: getTX(conf?.tipoCobertura).normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          comisionPrimerAnioFijaProv: cleanN(conf?.comisionPrimerAnio),
          comisionRenovacionFijaProv: cleanN(conf?.comisionRenovacion)
        })) : [];

    const promsCapas = (contratoStore.expc?.capas || []).map(c => apiCapas.post('register', { idContrato: gen.idContrato, detalleCapa: c.detalleCapa, montoRetencionCapa: cleanN(c.retencionC), techoCapa: cleanN(c.techoC) }));
    const promsPolizas = (contratoStore.poli?.polizas || []).map(p => apiPolizas.post('register', {
      idContrato: gen.idContrato,
      llavePolRen: `${p.poliza}|${p.renovacion}`,
      numPoliza: p.poliza,
      numRenovPol: p.renovacion }));

    const promsComEsc = (contratoStore.configReasegCom?.comisiones || []).flatMap(c =>
      listaReaseguradoresContrato.map((r: any) => apiComisionEsc.post('register', {
        idContrato: gen.idContrato,
        cveReasegurador: String(r.clave || getID(r.cveReasegurador)),
        descClasifCober: getTX(conf?.tipoCobertura).normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        limiteInf: cleanN(c.limiteInf),
        limiteSup: cleanN(c.limiteSup),
        comisionDefinitiva: cleanN(c.comisionDefinitiva)
      }))
    );

    const promsInter = (contratoStore.configInt?.intermediariosTabla || []).flatMap(filaInter => {
      const reaseguradorValor = getID(filaInter.reaseguradora);

      let reaseguradorasAAplicar: string[] = [];
      if (!reaseguradorValor || reaseguradorValor === 'TODAS' || reaseguradorValor === '0' || reaseguradorValor === 0) {
        reaseguradorasAAplicar = listaReaseguradoresContrato.map((r: any) => {
          const id = r.clave || r.cveReasegurador;
          return String(getID(id));
        });
      } else {
        reaseguradorasAAplicar = [String(reaseguradorValor)];
      }

      return reaseguradorasAAplicar.map((idReasegurador) => {
        if (idReasegurador.includes('[object')) return null;

        return apiIntermediarios.post('register', {
          idContrato: String(gen.idContrato),
          cveReasegurador: idReasegurador,
          indIntermediario: String(getID(contratoStore.configInt?.intermediario) ?? "0"),
          cveCriterioAsig: Number(getID(filaInter.asignacionInterm) ?? 0),
          cveIntermediario: String(getID(filaInter.broker) ?? ""),
          indCorretaje: Number(getID(filaInter.corretaje) ?? 0),
          cveAsignacion: Number(getID(filaInter.tipoCorretaje) ?? 0),
          porcentajeCorretaje: cleanN(filaInter.corretajeFijo),
          montoCorretaje: cleanN(filaInter.montoCorreFijo)
        });
      }).filter(p => p !== null);
    });

    await Promise.all([
      ...promsReas,
      ...promsCob,
      ...promsComNormal,
      ...promsCapas,
      ...promsPolizas,
      ...promsComEsc,
      ...promsInter
    ]);

    dialog.show({ title: 'ÉXITO', message: 'Contrato guardado correctamente.', type: DialogType.SUCCESS });
    modalResumen.value = false;
    contratoStore.reset();

  } catch (error: any) {
    console.error("ERROR:", error);
    dialog.show({ title: 'ERROR', message: `Error al guardar: ${error.message || error}`, type: DialogType.ERROR });
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
